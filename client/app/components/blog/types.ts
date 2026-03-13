export interface Blog {
  id: number;
  title: string;
  content: string;
  topic: string;
  author_name: string;
  author_avatar?: string;
  image?: string;
  created_at: string;
}
