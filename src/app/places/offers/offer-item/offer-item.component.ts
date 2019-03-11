import { Component, OnInit, Input } from '@angular/core';

import { Place } from '../../place.model';
import { formatDate } from '@angular/common';
import { PlacesService } from '../../places.service';
import { AuthService } from '../../../auth/auth.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss']
})
export class OfferItemComponent implements OnInit {
  @Input() offer: Place;

  isMore = false;
  dateFrom: string;
  dateTo: string;
  userId: string;
  isFav = false;

  constructor(private placesService: PlacesService, private authService: AuthService, private loadingCtrl: LoadingController) {}

  ngOnInit() {
    this.authService.userId.subscribe(user => {
      this.userId = user;
    });

    if (this.offer.favorite) {
      const f = this.offer.favorite.findIndex(userId => userId === this.userId);
      if (f > -1) {
        this.isFav = true;
      }
    }


    this.dateFrom = new Date(this.offer.availableFrom).toLocaleString().slice(0, 10);
    this.dateTo = new Date(this.offer.availableTo).toLocaleString().slice(0, 10);
  }

  addFavorite(placeId: string) {
    // this.loadingCtrl.create({
    //   message: 'Updating Favorite...'
    // }).then(loadingEl => {
    //   loadingEl.present();
    //   this.placesService.addFavorite(placeId).subscribe(() => {
    //     loadingEl.dismiss();
    //   });
    // });
    this.placesService.addFavorite(placeId).subscribe();
  }

  onSwitchMoreLess() {
    this.isMore = !this.isMore;
  }


}
