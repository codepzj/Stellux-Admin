// ==================== 根文档相关类型 ====================

export interface DocumentRootRequest {
  title: string;
  alias: string;
  description: string;
  thumbnail: string;
  document_type: string;
  is_public: boolean;
  sort: number;
}

export interface DocumentRootEditRequest {
  id: string;
  title: string;
  alias: string;
  description: string;
  thumbnail: string;
  document_type: string;
  is_public: boolean;
  sort: number;
}

export interface DocumentRootVO {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  alias: string;
  description: string;
  thumbnail: string;
  document_type: string;
  is_public: boolean;
  is_deleted: boolean;
  sort: number;
}

// ==================== 文档内容相关类型 ====================

export interface DocumentContentRequest {
  document_id: string;
  title: string;
  content: string;
  description: string;
  alias: string;
  parent_id: string;
  is_dir: boolean;
  sort: number;
}

export interface DocumentContentEditRequest {
  id: string;
  document_id: string;
  title: string;
  content: string;
  description: string;
  alias: string;
  parent_id: string;
  is_dir: boolean;
  sort: number;
}

export interface DocumentContentVO {
  id: string;
  document_id: string;
  title: string;
  content: string;
  description: string;
  alias: string;
  parent_id: string;
  is_dir: boolean;
  sort: number;
  like_count: number;
  dislike_count: number;
  comment_count: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

// ==================== 文档树相关类型 ====================

export interface DocumentTreeVO {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  alias: string;
  document_type?: string;
  is_dir: boolean;
  is_public?: boolean;
  parent_id: string;
  document_id: string;
  sort: number;
  children?: DocumentTreeVO[];
}

// ==================== 兼容性类型（保留原有类型） ====================

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
