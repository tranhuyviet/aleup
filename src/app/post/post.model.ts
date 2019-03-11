export class Post {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public price: number,
        public discount: number,
        public validTime: string,
        public image: string,
        public market: string,
        // public location: Location
    ) {}
}

export class Location {
    constructor(
        public lan: string,
        public lng: string
    ) {}
}
