import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { PlaceLocation } from './location.model';
import { Plugins } from '@capacitor/core';
// import { Favorite } from './favorite.model';



interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  discount: number;
  imageUrl: string;
  price: number;
  title: string;
  market: string;
  favorite?: string[];
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        'https://booking-places-dfff6.firebaseio.com/offered-places.json'
      )
      .pipe(
        map(resData => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  resData[key].discount,
                  resData[key].market,
                  resData[key].favorite,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId,
                  resData[key].location
                )
              );
            }
          }
          return places;
          // return [];
        }),
        tap(places => {
          this._places.next(places);
        })
      );
  }

  fetchPlacesByUserId() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        'https://booking-places-dfff6.firebaseio.com/offered-places.json'
      )
      .pipe(
        map(resData => {
          const places = [];
          let userId: string;
          this.authService.userId.subscribe(user => {
            userId = user;
          });
          for (const key in resData) {
            if (resData.hasOwnProperty(key) && userId === resData[key].userId) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  resData[key].discount,
                  resData[key].market,
                  resData[key].favorite,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId,
                  resData[key].location
                )
              );
            }
          }
          return places;
          // return [];
        }),
        tap(places => {
          this._places.next(places);
        })
      );
  }

  fetchPlacesFavorite() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        'https://booking-places-dfff6.firebaseio.com/offered-places.json'
      )
      .pipe(
        map(resData => {
          const places = [];
          let userId: string;
          this.authService.userId.subscribe(user => {
            userId = user;
          });
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              if (resData[key].favorite) {
                for (const fav of resData[key].favorite) {
                  if (fav === userId) {
                    places.push(
                      new Place(
                        key,
                        resData[key].title,
                        resData[key].description,
                        resData[key].imageUrl,
                        resData[key].price,
                        resData[key].discount,
                        resData[key].market,
                        resData[key].favorite,
                        new Date(resData[key].availableFrom),
                        new Date(resData[key].availableTo),
                        resData[key].userId,
                        resData[key].location
                      )
                    );
                  }
                }
              }
            }
          }
          return places;
          // return [];
        }),
        tap(places => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://booking-places-dfff6.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map(placeData => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            placeData.discount,
            placeData.market,
            placeData.favorite,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId,
            placeData.location
          );
        })
      );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.http.post<{ imageUrl: string; imagePath: string }>(
      'https://us-central1-booking-places-dfff6.cloudfunctions.net/storeImage',
      uploadData
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    discount: number,
    market: string,
    favorite: [],
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation,
    imageUrl: string
  ) {
    let generatedId: string;
    let newPlace: Place;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user found!');
        }
        newPlace = new Place(
          Math.random().toString(),
          title,
          description,
          imageUrl,
          price,
          discount,
          market,
          favorite,
          dateFrom,
          dateTo,
          userId,
          location
        );
        return this.http.post<{ name: string }>(
          'https://booking-places-dfff6.firebaseio.com/offered-places.json',
          {
            ...newPlace,
            id: null
          }
        );
      }),
      switchMap(resData => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );
  }

  addFavorite(placeId: string) {
    let updatedPlaces: Place[];
    let updatedFavorite: string[] = [];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        const oldFavorite: string[] = oldPlace.favorite;
        let usid: string;

        this.authService.userId.subscribe(uid => {
          usid = uid;
        });
        if (!oldFavorite) {
          console.log(updatedFavorite);
          console.log(usid);
          updatedFavorite.push(usid);
        } else {
          const favoriteIndex = oldFavorite.findIndex(f => {
            return f.toString() === usid;
          });
          if (+favoriteIndex > -1) {
            oldFavorite.splice(favoriteIndex, 1);
            updatedFavorite = oldFavorite;
          // console.log('vv', updatedFavorite);
          } else {
            oldFavorite.push(usid);
            updatedFavorite = oldFavorite;
          }
        }
        // let favoriteIndex = -1;
        // if (oldFavorite) {
        //   favoriteIndex = oldFavorite.findIndex(f => {
        //     return f.toString() === usid;
        //   });
        // }
        // // console.log(favoriteIndex);
        // if (+favoriteIndex > -1) {
        //   oldFavorite.splice(favoriteIndex, 1);
        //   updatedFavorite = oldFavorite;
        //   // console.log('vv', updatedFavorite);
        // } else {
        //   oldFavorite.push(usid);
        //   updatedFavorite = oldFavorite;
        // }
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          oldPlace.title,
          oldPlace.description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.discount,
          oldPlace.market,
          updatedFavorite,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(
          `https://booking-places-dfff6.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.discount,
          oldPlace.market,
          oldPlace.favorite,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(
          `https://booking-places-dfff6.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }

  deletePlace(placeId: string) {
    return this.http
    .delete(
      `https://booking-places-dfff6.firebaseio.com/offered-places/${placeId}.json`
    )
    .pipe(
      switchMap(() => {
        return this.places;
      }),
      take(1),
      tap(places => {
        this._places.next(places.filter(p => p.id !== placeId));
      })
    );
  }
}
