import { IconType } from "react-icons";

export type CategoryProps = {
  img?: string;
  label: string;
  icon: IconType;
  description?: string;
};

export type TypeProps = {
  name: string;
  icon: IconType;
  description: string;
};

export interface FacilitiesProps {
  name: string;
  icon: IconType;
}
