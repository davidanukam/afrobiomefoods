export type ServiceCategory = "kitchen" | "market" | "cultural" | "health";

export type ServiceItem = {
  service_id: string;
  name: string;
  category: ServiceCategory;
  lat: number;
  lng: number;
  distance_km: number;
  contact: string;
  hours_en: string;
  accessibility_notes_en: string;
};

export const services: ServiceItem[] = [
  {
    service_id: "s1",
    name: "Ndi-Ichie Community Kitchen",
    category: "kitchen",
    lat: 6.44,
    lng: 7.5,
    distance_km: 2.1,
    contact: "+1-555-0100",
    hours_en: "Mon–Sat 9am–2pm",
    accessibility_notes_en: "Ramp entrance, large-print menus.",
  },
  {
    service_id: "s2",
    name: "Green Yam Farmers' Market",
    category: "market",
    lat: 6.46,
    lng: 7.49,
    distance_km: 4.8,
    contact: "+1-555-0101",
    hours_en: "Sat 7am–1pm",
    accessibility_notes_en: "Seating areas every 50m.",
  },
  {
    service_id: "s3",
    name: "Uli Cultural Center",
    category: "cultural",
    lat: 6.43,
    lng: 7.52,
    distance_km: 3.5,
    contact: "+1-555-0102",
    hours_en: "Tue–Sun 10am–6pm",
    accessibility_notes_en: "Wheelchair accessible auditorium.",
  },
  {
    service_id: "s4",
    name: "Golden Years Wellness Clinic",
    category: "health",
    lat: 6.45,
    lng: 7.51,
    distance_km: 5.2,
    contact: "+1-555-0103",
    hours_en: "By appointment",
    accessibility_notes_en: "Hearing loop in waiting area.",
  },
];
