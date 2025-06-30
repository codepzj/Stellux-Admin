import request from "@/utils/request";
import type { Response } from "@/types/dto";
import type {
  DocumentRootRequest,
  DocumentRequest,
  DocumentTreeVO,
  DocumentRootVO,
  DocumentVO,
  DocumentSaveRequest,
  DocumentRootEditRequest,
} from "@/types/document";

// 新增文档
export const createDocumentAPI = (
  data: DocumentRequest
): Promise<Response<any>> => {
  return request.post("/admin-api/document/create", data);
};

// 新增根文档
export const createRootDocumentAPI = (
  data: DocumentRootRequest
): Promise<Response<any>> => {
  return request.post("/admin-api/document/create-root", data);
};

// 编辑根文档
export const editRootDocumentAPI = (
  data: DocumentRootEditRequest
): Promise<Response<any>> => {
  return request.put("/admin-api/document/edit-root", data);
};

// 删除根文档
export const deleteRootDocumentAPI = (id: string): Promise<Response<any>> => {
  return request.delete(`/admin-api/document/delete-root/${id}`);
};

// 获取文档树
export const getDocumentTreeByIDAPI = (
  id: string
): Promise<Response<DocumentTreeVO[]>> => {
  return request.get(`/admin-api/document/tree?document_id=${id}`);
};

// 获取所有根文档
export const getAllRootDocAPI = (): Promise<Response<DocumentRootVO[]>> => {
  return request.get("/admin-api/document/list");
};

// 获取所有父文档
export const getAllParentDocAPI = (
  document_id: string
): Promise<Response<DocumentRootVO[]>> => {
  return request.get(
    `/admin-api/document/parent-list?document_id=${document_id}`
  );
};

// 获取文档详情
export const getDocumentDetailByIDAPI = (
  id: string
): Promise<Response<string>> => {
  return request.get(`/admin-api/document/detail?document_id=${id}`);
};

// 删除叶子节点(文档)
export const deleteDocumentLeafByIDAPI = (
  document_id: string
): Promise<Response<any>> => {
  return request.delete(`/admin-api/document/delete`, {
    data: {
      document_id,
    },
  });
};

// 删除父节点(文档)
export const deleteDocumentByIDListAPI = (
  document_id_list: string[]
): Promise<Response<any>> => {
  return request.delete(`/admin-api/document/delete-list`, {
    data: {
      document_id_list,
    },
  });
};

// 根据文档id获取文档详情(文档)
export const getDocumentByIDAPI = (
  id: string
): Promise<Response<DocumentVO>> => {
  return request.get(`/admin-api/document/${id}`);
};

// 保存文档(文档)
export const saveDocumentAPI = (
  data: DocumentSaveRequest
): Promise<Response<any>> => {
  return request.put("/admin-api/document/save", data);
};

// 重命名文档(文档)
export const renameDocumentAPI = (
  id: string,
  title: string
): Promise<Response<any>> => {
  return request.put("/admin-api/document/rename", { id, title });
};
