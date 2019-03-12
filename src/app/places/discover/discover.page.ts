import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
  offers: Place[];
  isLoading = false;
  private placesSub: Subscription;
  private tempOffer: Place[];
  private searchedOffer: Place[];
  constructor(
    private placesService: PlacesService,
  ) {}

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.offers = places;
      this.tempOffer = [...places];
    });
  }

  ionViewWillEnter() {
    this.fetchPlace();
  }

  public fetchPlace() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(data => {
      this.isLoading = false;
    });
  }

  onSearch(event) {
    this.offers = this.tempOffer;
    this.searchedOffer = this.offers.filter(f => {
      const searchTitle = f.title.toLowerCase().search(event.target.value);
      const searchMarket = f.market.toLowerCase().search(event.target.value);
      const searchAdress = f.location.address.toLowerCase().search(event.target.value);
      if (searchTitle !== -1 || searchMarket !== -1 || searchAdress !== -1) {
        return true;
      } else {
        return false;
      }
    });
    this.offers = this.searchedOffer;
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}