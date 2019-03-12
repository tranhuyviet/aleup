import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];
  isLoading = false;
  private placesSub: Subscription;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.offers = places;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    // this.placesService.fetchPlaces().subscribe(() => {
    //   this.isLoading = false;
    // });
    this.placesService.fetchPlacesByUserId().subscribe(() => {
      this.isLoading = false;
    });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
    console.log('Editing item', offerId);
  }

  onDelete(placeId: string, slidingItem: IonItemSliding) {
    this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'Delete this place?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            slidingItem.close();
            this.loadingCtrl.create({ message: 'Deleting...' }).then(loadingEl => {
              loadingEl.present();
              this.placesService.deletePlace(placeId).subscribe(() => {
                loadingEl.dismiss();
              });
            });
          }
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
