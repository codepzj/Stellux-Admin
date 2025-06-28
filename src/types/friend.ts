export interface FriendVO {
  id: string;
  name: string;
  description: string;
  site_url: string;
  avatar_url: string;
  website_type: number;
  is_active: boolean;
}

export interface FriendCreateReq {
  name: string;
  description: string;
  site_url: string;
  avatar_url: string;
  website_type: number;
}

export interface FriendUpdateReq {
  id: string;
  name: string;
  description: string;
  site_url: string;
  avatar_url: string;
  website_type: number;
  is_active: boolean;
}