export type PhotoProp = FileList | null;

export type PhotosProp = Blob[];

export type LocationProp = {
  streetAddress: string;
  aptSuite: string;
  city: string;
  province: string;
  country: string;
};

export type DescriptionProps = {
  title: string;
  description: string;
  highlight: string;
  highlightDescription: string;
  price: number;
};

export type ListingFormProps = {
  creator: string;
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
  title: string;
  description: string;
  highlight: string;
  highlightDescription: string;
  price: number;
};
