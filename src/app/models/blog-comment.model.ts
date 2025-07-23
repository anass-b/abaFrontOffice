export interface BlogComment {
  id?: number;
  postId?: number;
  userId?: number;
  content?: string;

  createdAt?: string; 
  createdBy?: number;
  updatedBy?: number;
  updatedAt?: string;
  rowVersion?: number;
}
