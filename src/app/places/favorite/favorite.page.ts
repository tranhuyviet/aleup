import { Component, OnInit, OnDestroy } from '@angular/core';
import { Place } from '../place.model';
import { Subscription } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit, OnDestroy {
  offers: Place[];
  isLoading = false;
  private placesSub: Subscription;
  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.offers = places;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlacesFavorite().subscribe(data => {
      // console.log('favo', data);
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}
