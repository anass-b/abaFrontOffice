export interface BlogPost {
  id?: number;
  title?: string;
  content?: string;
  authorId?: number;
  category?: string;
  publishedAt?: string; 
  isPublished?: boolean;

  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
  rowVersion?: number;
}
