export interface Mosque {
  id: string;
  name: string;
  type: 'mosque' | 'islamic_centre' | 'prayer_room';
  lat: number;
  lng: number;
  distance?: number;
  address?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
}
