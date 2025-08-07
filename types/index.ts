export interface Work {
  id: string;
  title: string;
  type: 'text' | 'image' | 'video';
  content: string;
  images?: string[];
  videoUrl?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    isFollowed: boolean;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
    isLiked: boolean;
    isCollected: boolean;
  };
  tags: string[];
  createdAt: string;
  description?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

export interface Collection {
  id: string;
  name: string;
  count: number;
  coverImage?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  works: number;
}