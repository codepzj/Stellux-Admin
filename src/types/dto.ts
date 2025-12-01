export interface Response<T> {
  code: number;
  data: T;
  msg?: string;
  error?: string;
}

export interface PageResponse<T> {
  code: number;
  data: {
    page_no: number;
    page_size: number;
    total_count: number;
    total_page: number;
    list: T[];
  };
  msg?: string;
  error?: string;
}

export interface PageReq {
  page_no: number;
  page_size: number;
  keyword?: string;
  field?: string;
  order?: "ASC" | "DESC";
}

export interface PageData<T> {
  page_no: number;
  page_size: number;
  total_count: number;
  total_page: number;
  list: T[];
}
