import { PlaceLocation } from './location.model';
import { Favorite } from './favorite.model';

export class Place {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public price: number,
    public discount: number,
    public market: string,
    public favorite: string[],
    public availableFrom: Date,
    public availableTo: Date,
    public userId: string,
    public location: PlaceLocation
  ) {}
}
