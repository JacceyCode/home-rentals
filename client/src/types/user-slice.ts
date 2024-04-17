export type Listing = {
  category: string;
  type: string;
  streetAddress: string;
  aptSuite: string;
  city: string;
  province: string;
  country: string;
  guestCount: number;
  bedroomCount: number;
  bedCount: number;
  bathroomCount: number;
  amenities: string[];
  listingPhotoPaths: string[];
  title: string;
  description: string;
  highlight: string;
  highlightDescription: string;
  price: number;
  creator: User;
  _id: string;
};

export type Trip = {
  _id: string;
  customerId: User;
  hostId: User;
  listingId: Listing;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ListingCardProps = {
  listingId: string;
  listingPhotoPaths: string[];
  city: string;
  province: string;
  country: string;
  category: string;
  type?: string;
  price?: number;
  startDate?: Date;
  endDate?: Date;
  totalPrice?: number;
  booking: boolean;
};

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  profileImagePath: string;
  propertyList: Listing[];
  reservationList: Trip[];
  tripList: Trip[];
  wishList: Listing[];
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export interface UserState {
  user: null | User;
  token: string | null;
  listings: Listing[] | null;
}
