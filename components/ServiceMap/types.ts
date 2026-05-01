import type { ServiceItem } from "@/data/services";

export type ServiceMapProps = {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  items: ServiceItem[];
  accessibilityLabel: string;
  webMessage: string;
  webBorderColor: string;
};
