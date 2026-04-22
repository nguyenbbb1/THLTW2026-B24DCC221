export interface Tag {
  id: string;
  name: string;
  count: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  avatarUrl: string;
  author: string;
  createdAt: string;
  views: number;
  status: 'Nháp' | 'Đã đăng';
  tags: string[];
}

export interface Author {
  name: string;
  avatar: string;
  bio: string;
  skills: string[];
  socialLinks: { label: string; url: string }[];
}