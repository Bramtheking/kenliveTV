export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: "POLITICS" | "BUSINESS" | "SPORTS" | "CULTURE" | "WORLD";
  author: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  featured: boolean;
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
}

export interface Subscriber {
  id: string;
  email?: string;
  fcmToken?: string;
  subscribedAt: Date;
  type: 'email' | 'notification';
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
}

export interface User {
  uid: string;
  email: string;
  isAdmin: boolean;
}

export interface Schedule {
  id: string;
  title: string;
  description: string;
  host: string;
  startTime: string; // Format: "HH:mm" e.g., "09:00"
  endTime: string;   // Format: "HH:mm" e.g., "12:00"
  daysOfWeek: string[]; // ["Monday", "Tuesday", etc.]
  category: "News" | "Politics" | "Entertainment" | "Sports" | "Talk Show" | "Music" | "Other";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}