export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  avatar_path: string;
  latitude: number | null;
  longitude: number | null;
  is_online: boolean;
  rating: number;
  rating_count: number;
  has_transport: boolean;
}

export interface HelpRequest {
  id: number;
  requester: User;
  helper: User | null;
  category: 'GAS' | 'TOOL' | 'EVAC';
  category_display: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
  status_display: string;
  latitude: number;
  longitude: number;
  radius_km: number;
  description: string;
  created_at: string;
  updated_at: string;
  distance_km?: number;
}

export interface Message {
  id: number;
  request: number;
  sender: User;
  content: string;
  timestamp: string;
  is_read: boolean;
}

export interface Transport {
  id: number;
  brand: string;
  model: string;
  color: string;
  plate_number: string;
  photo_path: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}
