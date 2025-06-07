export interface FriendVO {
  id: string;
  name: string;
  description: string;
  site_url: string;
  avatar_url: string;
  website_type: string;
  isActive: boolean;
}

export interface FriendCreateReq {
  name: string;
  description: string;
  site_url: string;
  avatar_url: string;
  website_type: string;
}