import request from "@/utils/request";
import type { Response } from "@/types/dto";
import type {
  DocumentRootRequest,
  DocumentTreeVO,
  DocumentRootVO,
  DocumentVO,
  DocumentRootEditRequest,
  DocumentContentRequest,
  DocumentContentEditRequest,
  DocumentContentVO,
} from "@/types/document";

// ==================== 根文档管理接口 ====================

// 创建根文档
export const createRootDocumentAPI = (
  data: DocumentRootRequest
): Promise<Response<any>> => {
  return request.post("/admin-api/document/create", data);
};

// 查询根文档
export const getRootDocumentAPI = (
  id: string
): Promise<Response<DocumentRootVO>> => {
  return request.get(`/admin-api/document/find?id=${id}`);
};

// 更新根文档
export const updateRootDocumentAPI = (
  data: DocumentRootEditRequest
): Promise<Response<any>> => {
  return request.put("/admin-api/document/update", data);
};

// 删除根文档
export const deleteRootDocumentAPI = (id: string): Promise<Response<any>> => {
  return request.delete(`/admin-api/document/delete/${id}`);
};

// 软删除根文档
export const softDeleteRootDocumentAPI = (
  id: string
): Promise<Response<any>> => {
  return request.put(`/admin-api/document/soft-delete/${id}`);
};

// 恢复根文档
export const restoreRootDocumentAPI = (id: string): Promise<Response<any>> => {
  return request.put(`/admin-api/document/restore/${id}`);
};

// 根据别名查询根文档
export const getRootDocumentByAliasAPI = (
  alias: string
): Promise<Response<DocumentRootVO>> => {
  return request.get(`/admin-api/document/find-by-alias?alias=${alias}`);
};

// 获取根文档列表
export const getRootDocumentListAPI = (params: any): Promise<Response<any>> => {
  return request.get("/admin-api/document/list", { params });
};

// ==================== 文档内容管理接口 ====================

// 创建文档内容
export const createDocumentContentAPI = (
  data: DocumentContentRequest
): Promise<Response<any>> => {
  return request.post("/admin-api/document-content/create", data);
};

// 查询文档内容
export const getDocumentContentAPI = (
  id: string
): Promise<Response<DocumentContentVO>> => {
  return request.get(`/admin-api/document-content/${id}`);
};

// 更新文档内容
export const updateDocumentContentAPI = (
  data: DocumentContentEditRequest
): Promise<Response<any>> => {
  return request.put("/admin-api/document-content/update", data);
};

// 删除文档内容
export const deleteDocumentContentAPI = (
  id: string
): Promise<Response<any>> => {
  return request.delete(`/admin-api/document-content/${id}`);
};

// 软删除文档内容
export const softDeleteDocumentContentAPI = (
  id: string
): Promise<Response<any>> => {
  return request.put(`/admin-api/document-content/soft-delete/${id}`);
};

// 恢复文档内容
export const restoreDocumentContentAPI = (
  id: string
): Promise<Response<any>> => {
  return request.put(`/admin-api/document-content/restore/${id}`);
};

// 根据父级ID查询文档内容
export const getDocumentContentByParentIdAPI = (
  parentId: string
): Promise<Response<DocumentContentVO[]>> => {
  return request.get(
    `/admin-api/document-content/all/parent-id?parent_id=${parentId}`
  );
};

// 根据文档ID查询所有子文档内容
export const getDocumentContentByDocumentIdAPI = (
  documentId: string
): Promise<Response<DocumentContentVO[]>> => {
  return request.get(
    `/admin-api/document-content/all/document-id?document_id=${documentId}`
  );
};

// 获取文档内容列表
export const getDocumentContentListAPI = (
  params: any
): Promise<Response<any>> => {
  return request.get("/admin-api/document-content/list", { params });
};

// 搜索文档内容
export const searchDocumentContentAPI = (
  keyword: string
): Promise<Response<DocumentContentVO[]>> => {
  return request.get(`/admin-api/document-content/search?keyword=${keyword}`);
};

// ==================== 公开接口 ====================

// 获取所有公开文档
export const getAllPublicDocumentAPI = (): Promise<
  Response<DocumentRootVO[]>
> => {
  return request.get("/document/public");
};

// 获取文档内容列表(平铺数据，前端组装成树)
export const getDocumentTreeDataAPI = (
  documentId: string
): Promise<Response<DocumentTreeVO[]>> => {
  return request.get(
    `/admin-api/document-content/all/document-id?document_id=${documentId}`
  );
};

// 获取根文档
export const getRootDocumentPublicAPI = (
  id: string
): Promise<Response<DocumentRootVO>> => {
  return request.get(`/document/root/${id}`);
};

// 获取文档站点地图
export const getDocumentSitemapAPI = (): Promise<Response<any>> => {
  return request.get("/document/sitemap");
};

// 根据ID获取文档
export const getDocumentByIdAPI = (
  id: string
): Promise<Response<DocumentVO>> => {
  return request.get(`/document/${id}`);
};

// 批量删除文档
export const deleteDocumentByIdListAPI = (
  document_id_list: string[]
): Promise<Response<any>> => {
  return request.post(`/admin-api/document-content/delete-list`, {
    document_id_list,
  });
};
