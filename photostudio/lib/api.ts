import type { Equipment, Product, Review, Service } from "@/types";

const publicApiUrl = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : undefined;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (publicApiUrl ? `${publicApiUrl}/api` : undefined) ||
  "http://localhost:8090/api";

/** OpenAPI / Swagger UI (same origin as API). */
export function getSwaggerUiUrl(): string {
  return `${API_BASE_URL.replace(/\/$/, "")}/swagger-ui.html`;
}

type PagedResponse<T> = {
  content: T[];
};

export type AuthPayload = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    profileImage?: string;
    roles?: string[];
  };
};

type BackendService = {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMinutes?: number | null;
  serviceType?: string | null;
  thumbnailImage?: string | null;
  includes?: string | null;
};

type BackendEquipment = {
  id: number;
  name: string;
  brand: string;
  description: string;
  dailyRentalPrice: number;
  availableStock: number;
  category?: string | null;
  thumbnailImage?: string | null;
  specifications?: string | null;
};

type BackendGallery = {
  id: number;
  title: string;
  description?: string | null;
  imageUrl: string;
  category: string;
  featured: boolean;
  active: boolean;
};

type BackendReview = {
  id: number;
  userFullName?: string | null;
  userProfileImage?: string | null;
  serviceName?: string | null;
  equipmentName?: string | null;
  rating: number;
  comment: string;
  createdAt?: string | null;
};

const toCategory = (raw?: string | null): Service["category"] => {
  const value = (raw || "").toLowerCase();
  if (value.includes("wedding")) return "wedding";
  if (value.includes("event")) return "event";
  if (value.includes("outdoor")) return "outdoor";
  if (value.includes("portrait")) return "portrait";
  return "studio";
};

const toEquipmentCategory = (raw?: string | null): Equipment["category"] => {
  const value = (raw || "").toLowerCase();
  if (value.includes("camera")) return "camera";
  if (value.includes("lens")) return "lens";
  if (value.includes("light")) return "lighting";
  if (value.includes("drone")) return "drone";
  return "accessory";
};

const toSlug = (text: string): string =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchJson<T>(path: string): Promise<T | null> {
  const cacheKey = path;
  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: 300 }, // ISR with 5 minute revalidation
    });
    if (!response.ok) {
      // Return cached data if available, even if expired
      return cached?.data || null;
    }
    const data = (await response.json()) as T;
    cache.set(cacheKey, { data, timestamp: now });
    return data;
  } catch (error) {
    console.warn(`API call failed for ${path}:`, error);
    // Return cached data if available, even if expired
    return cached?.data || null;
  }
}

async function postJson<T>(
  path: string,
  body: unknown,
  token?: string
): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `POST ${path} failed with status ${response.status}:`,
        errorText
      );
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error(`POST ${path} error:`, error);
    return null;
  }
}

export async function getServices(): Promise<Service[]> {
  const data = await fetchJson<PagedResponse<BackendService>>("/services?page=0&size=50");
  if (!data?.content) return [];

  return data.content.map((item, index) => ({
    id: `svc-${item.id}`,
    title: item.name,
    slug: toSlug(item.name),
    description: item.description,
    longDescription: item.description,
    price: Number(item.price || 0),
    priceUnit: "session",
    image:
      item.thumbnailImage ||
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",
    category: toCategory(item.serviceType),
    duration: item.durationMinutes ? `${item.durationMinutes} mins` : "Custom",
    includes: item.includes
      ? item.includes.split(",").map((x) => x.trim()).filter(Boolean)
      : [],
    featured: index < 3,
  }));
}

export async function getEquipment(): Promise<Equipment[]> {
  const data = await fetchJson<PagedResponse<BackendEquipment>>("/equipment?page=0&size=50");
  if (!data?.content) return [];

  return data.content.map((item, index) => ({
    id: `eq-${item.id}`,
    name: item.name,
    category: toEquipmentCategory(item.category),
    description: item.description,
    pricePerDay: Number(item.dailyRentalPrice || 0),
    image:
      item.thumbnailImage ||
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    available: (item.availableStock || 0) > 0,
    brand: item.brand || "Unknown",
    specs: item.specifications
      ? item.specifications.split(",").map((x) => x.trim()).filter(Boolean)
      : [],
    featured: index < 4,
  }));
}

function galleryToProduct(item: BackendGallery): Product {
  const cat = (item.category || "").toUpperCase();
  const productCategory: Product["category"] =
    cat.includes("WEDDING") || cat.includes("FAMILY") ? "album" : cat.includes("PRODUCT") ? "print" : "print";

  return {
    id: `gal-${item.id}`,
    name: item.title,
    category: productCategory,
    description: item.description || "",
    price: 15680, // Converted from 49 USD to LKR (approx 320 LKR per USD)
    images: [item.imageUrl],
    inStock: item.active,
    rating: 5,
    reviewCount: 0,
    featured: item.featured,
    tags: [item.category],
  };
}

export async function getGalleryProducts(): Promise<Product[]> {
  const data = await fetchJson<PagedResponse<BackendGallery>>("/gallery?page=0&size=100");
  if (!data?.content?.length) return [];
  return data.content.map(galleryToProduct);
}

/** Backend `Gallery.GalleryCategory` enum names (e.g. PRODUCT, WEDDING). */
export async function createGalleryProduct(
  token: string,
  payload: {
    title: string;
    description?: string;
    category: string;
    price?: number;
    imageUrl: string;
    featured: boolean;
    active: boolean;
  }
): Promise<Product | null> {
  const result = await postJson<BackendGallery>("/gallery", payload, token);
  if (!result) return null;
  return galleryToProduct(result);
}

export async function createService(
  token: string,
  payload: {
    name: string;
    description: string;
    price: number;
    durationMinutes?: number;
    serviceType?: string;
    thumbnailImage?: string;
    includes?: string;
  }
): Promise<Service | null> {
  const result = await postJson<BackendService>("/services", payload, token);
  if (!result) return null;
  return {
    id: `svc-${result.id}`,
    title: result.name,
    slug: toSlug(result.name),
    description: result.description,
    longDescription: result.description,
    price: Number(result.price || 0),
    priceUnit: "session",
    image: result.thumbnailImage || "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",
    category: toCategory(result.serviceType),
    duration: result.durationMinutes ? `${result.durationMinutes} mins` : "Custom",
    includes: result.includes ? result.includes.split(",").map((x) => x.trim()).filter(Boolean) : [],
    featured: false,
  };
}

function mapBackendReview(r: BackendReview): Review {
  const dateStr = r.createdAt?.split("T")[0] ?? "";
  return {
    id: `rev-${r.id}`,
    name: r.userFullName || "Client",
    avatar:
      r.userProfileImage ||
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    service: r.serviceName || r.equipmentName || "Service",
    rating: r.rating,
    comment: r.comment,
    date: dateStr,
    verified: true,
  };
}

export async function getAggregatedReviews(): Promise<Review[]> {
  // Try to get reviews from a dedicated endpoint first
  const reviewsData = await fetchJson<PagedResponse<BackendReview>>("/reviews?page=0&size=50");
  if (reviewsData?.content) {
    return reviewsData.content
      .slice(0, 10) // Limit to 10 reviews for performance
      .map(mapBackendReview)
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  }

  // Fallback to the old inefficient method if dedicated endpoint doesn't exist
  const svcPage = await fetchJson<PagedResponse<BackendService>>("/services?page=0&size=5");
  if (!svcPage?.content?.length) return [];

  const merged: Review[] = [];
  // Only fetch reviews for first few services to limit API calls
  for (const svc of svcPage.content.slice(0, 3)) {
    const revPage = await fetchJson<PagedResponse<BackendReview>>(
      `/reviews/service/${svc.id}?page=0&size=10`
    );
    if (revPage?.content) {
      merged.push(...revPage.content.map(mapBackendReview));
    }
  }

  return merged
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .slice(0, 10); // Limit total reviews
}

export async function submitReview(
  token: string,
  payload: { serviceId: number; rating: number; comment: string }
): Promise<boolean> {
  const result = await postJson("/reviews", payload, token);
  return Boolean(result);
}

export async function loginUser(email: string, password: string): Promise<AuthPayload | null> {
  return postJson<AuthPayload>("/auth/login", { email, password });
}

export async function registerUser(
  fullName: string,
  email: string,
  password: string,
  phone?: string
): Promise<AuthPayload | null> {
  return postJson<AuthPayload>("/auth/register", { fullName, email, password, phone });
}

export async function createBooking(
  token: string,
  payload: {
    serviceId: number;
    bookingDate: string;
    startTime: string;
    location?: string;
    specialRequests?: string;
  }
): Promise<boolean> {
  const result = await postJson("/bookings", payload, token);
  return Boolean(result);
}

async function getJsonAuth<T>(path: string, token: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export type CurrentUserProfile = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  roles?: unknown;
  createdAt?: string;
};

/** Current user (Bearer). Roles match DB — use to refresh admin checks after login. */
export async function getCurrentUserProfile(token: string): Promise<CurrentUserProfile | null> {
  return getJsonAuth<CurrentUserProfile>("/users/profile", token);
}

async function deleteJsonAuth(path: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function patchJsonAuth(path: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok;
  } catch {
    return false;
  }
}

export type DashboardStats = {
  totalUsers: number;
  totalServices: number;
  totalEquipment: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalRentalOrders: number;
  pendingRentalOrders: number;
  pendingReviews: number;
  totalRevenue: number;
  rentalRevenue: number;
  recentBookings: {
    id: number;
    userFullName: string;
    serviceName: string;
    bookingDate: string;
    status: string;
    totalAmount: string;
  }[];
  bookingsByStatus?: Record<string, number>;
};

export async function getAdminDashboard(token: string): Promise<DashboardStats | null> {
  return getJsonAuth<DashboardStats>("/admin/dashboard", token);
}

export type PendingReviewRow = {
  id: number;
  userFullName?: string | null;
  serviceName?: string | null;
  equipmentName?: string | null;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt?: string | null;
};

export async function getPendingReviewsAdmin(token: string): Promise<PendingReviewRow[]> {
  const data = await getJsonAuth<PagedResponse<PendingReviewRow>>("/reviews/pending?page=0&size=50", token);
  return data?.content ?? [];
}

export async function approveReviewAdmin(token: string, reviewId: number): Promise<boolean> {
  return patchJsonAuth(`/reviews/${reviewId}/approve`, token);
}

export async function deleteReviewAdmin(token: string, reviewId: number): Promise<boolean> {
  return deleteJsonAuth(`/reviews/${reviewId}`, token);
}

export async function deleteServiceAdmin(token: string, serviceId: number): Promise<boolean> {
  return deleteJsonAuth(`/services/${serviceId}`, token);
}

export async function deleteEquipmentAdmin(token: string, equipmentId: number): Promise<boolean> {
  return deleteJsonAuth(`/equipment/${equipmentId}`, token);
}

export async function deleteGalleryAdmin(token: string, galleryId: number): Promise<boolean> {
  return deleteJsonAuth(`/gallery/${galleryId}`, token);
}
