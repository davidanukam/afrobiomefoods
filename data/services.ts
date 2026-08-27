export type ServiceCategory = "kitchen" | "market" | "cultural" | "health";

export type ServiceItem = {
  service_id: string;
  name: string;
  category: ServiceCategory;
  lat: number;
  lng: number;
  distance_km: number;
  contact: string;
  address: string;
  email?: string;
  website?: string;
  hours_en: string;
  accessibility_notes_en: string;
};

export function mapsSearchUrl(item: Pick<ServiceItem, "address" | "lat" | "lng" | "name">): string {
  const query = item.address.trim() || item.name.trim() || `${item.lat},${item.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function splitEmails(email?: string): string[] {
  if (!email) return [];
  return email
    .split(/[;,]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export const services: ServiceItem[] = [
  {
    service_id: "s1",
    name: "Best Bargain African Wholesale Inc.",
    category: "market",
    lat: 43.006899,
    lng: -81.198169,
    distance_km: 0,
    contact: "+1 (519) 614-1885",
    address: "549 First Street, Unit 3B, London, Ontario, N5V 1Z5, Canada",
    email: "info@bbafricanfoods.com, bestbargainafric@gmail.com",
    website: "https://bbafricanfoods.com/",
    hours_en: "",
    accessibility_notes_en: "",
  },
  {
    service_id: "s2",
    name: "ASOROCK AFRICAN MARKET INC.",
    category: "market",
    lat: 43.001802,
    lng: -81.186847,
    distance_km: 0,
    contact: "+1 (647) 745-2233",
    address: "1700 Dundas Street, London, Ontario, N5W 3C9, Canada",
    email: "asorockafricanmarket@gmail.com",
    website: "https://asorockafricanmarket.ca",
    hours_en: "",
    accessibility_notes_en: "",
  },
  {
    service_id: "s3",
    name: "AfroBiome Foods Incorporated",
    category: "market",
    lat: 42.980779,
    lng: -81.219531,
    distance_km: 0,
    contact: "+1 (519) 872-0687",
    address: "426 Hamilton Street, London, Ontario N5Z 1R9",
    email: "afrobiomefoods@gmail.com; info@afrobiomefoods.ca",
    website: "https://www.afrobiomefoods.ca",
    hours_en: "",
    accessibility_notes_en: "",
  },
  {
    service_id: "s4",
    name: "Bos African Store",
    category: "market",
    lat: 43.003522,
    lng: -81.226355,
    distance_km: 0,
    contact: "+1 (587) 222-9232",
    address: "908 Oxford Street E, London, ON N5Y 3J7",
    website: "https://www.africanstorescanada.ca/stores/bosafricanstore-london",
    hours_en: "",
    accessibility_notes_en: "",
  },
  {
    service_id: "s5",
    name: "Payless Afro International Food Market",
    category: "market",
    lat: 42.980187,
    lng: -81.213452,
    distance_km: 0,
    contact: "+1 (519) 601-7797",
    address: "577 Hamilton Rd, London ON N5Z 1S5",
    hours_en: "",
    accessibility_notes_en: "",
  },
  {
    service_id: "s6",
    name: "Feliza African Grocery and Beauty store",
    category: "market",
    lat: 42.982432,
    lng: -81.297831,
    distance_km: 0,
    contact: "+1 (226) 663-2980",
    address: "689 Oxford St W, London ON N6H 1V1",
    website: "https://www.feliza.ca",
    hours_en: "",
    accessibility_notes_en: "",
  },
  {
    service_id: "s7",
    name: "Makas Foods Inc",
    category: "market",
    lat: 42.947797,
    lng: -81.271605,
    distance_km: 0,
    contact: "+1 (226) 663-36338",
    address: "725 Notre Dame Dr #12, London, ON",
    hours_en: "",
    accessibility_notes_en: "",
  },
  {
    service_id: "s8",
    name: "Steda Tropical Foods Ltd",
    category: "market",
    lat: 42.99051,
    lng: -81.225361,
    distance_km: 0,
    contact: "+1 (519) 681-4986",
    address: "781 Dundas St, London ON N5W 2Z6",
    hours_en: "",
    accessibility_notes_en: "",
  },
];
