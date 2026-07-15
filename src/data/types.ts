/** Core domain types shared across the app. */

export interface ServiceOffer {
  id: string;
  title: string;
  price: number;
  unit: string; // e.g. "per hour", "per session", "flat"
  description?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  text: string;
  date: string; // human friendly, e.g. "2 weeks ago"
}

export interface Provider {
  id: string;
  name: string;
  tagline: string;
  category: string;
  /** Keywords the mock AI matcher scans the natural-language query against. */
  tags: string[];
  description: string;
  priceRange: string; // e.g. "$40 - $120"
  rating: number; // average, 1-5
  reviewCount: number;
  /** Placeholder image URL — swap for real photos later. */
  image: string;
  location: string;
  responseTime: string; // e.g. "Replies in ~15 min"
  verified: boolean;
  availability: string[]; // e.g. ["today", "tomorrow", "weekend"]
  services: ServiceOffer[];
  reviews: Review[];
  /** True for demo listings the user added via the seller screen. */
  isUserCreated?: boolean;
}
