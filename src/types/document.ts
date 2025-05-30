export interface DocumentRootRequest {
  title: string;
  alias: string;
  description: string;
  thumbnail: string;
  document_type: string;
  is_public: boolean;
}

export interface DocumentRootEditRequest {
  id: string;
  title: string;
  alias: string;
  description: string;
  thumbnail: string;
  document_type: string;
  is_public: boolean;
}

export interface DocumentRequest {
  title: string;
  content: string;
  document_type: string;
  parent_id: string;
  document_id: string;
}

export interface DocumentSaveRequest {
  id: string;
  title: string;
  content: string;
}

export interface DocumentVO {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  document_type: string;
  is_public: boolean;
  parent_id: string;
  document_id: string;
}

export interface DocumentRootVO {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  alias: string;
  description: string;
  thumbnail: string;
  is_public: boolean;
}

export interface DocumentTreeVO {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  document_type: string;
  is_public: boolean;
  parent_id: string;
  document_id: string;
}
