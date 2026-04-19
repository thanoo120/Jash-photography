export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  priceUnit: string;
  image: string;
  category: "graduation" | "birthday" | "event" | "model-shoot" | "pre-shoot";
  duration: string;
  includes: string[];
  featured: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  category: "camera" | "lens" | "lighting" | "accessory" | "drone";
  description: string;
  pricePerDay: number;
  image: string;
  available: boolean;
  brand: string;
  specs: string[];
  featured: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: "print" | "frame" | "album" | "accessory" | "gift";
  description: string;
  price: number;
  images: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  featured: boolean;
  tags: string[];
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  date: string;
  time: string;
  message: string;
  guests?: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface NavLink {
  label: string;
  href: string;
}
