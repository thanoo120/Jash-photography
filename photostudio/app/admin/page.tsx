"use client";
import { useState, useEffect, useMemo, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Camera, Package, ShoppingBag,
  MessageSquare, Settings, LogOut, TrendingUp,
  Calendar, DollarSign, Users, ArrowUp, ArrowDown,
  Eye, Edit, Trash2, ChevronRight, Bell, CheckCircle,
} from "lucide-react";
import { Button, Badge } from "@/components/ui/index";
import { createEquipment, createGalleryProduct, getAggregatedReviews, getEquipment, getGalleryProducts, getServices, createService, deleteEquipmentAdmin, updateEquipmentAdmin, deleteServiceAdmin, updateServiceAdmin, getPendingReviewsAdmin, approveReviewAdmin, deleteReviewAdmin } from "@/lib/api";
import type { Equipment, Product, Review, Service } from "@/types";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { getAccessToken, isAdmin } from "@/lib/auth";

type Tab = "dashboard" | "services" | "equipment" | "products" | "reviews" | "bookings";

const stats = [
  { label: "Total Revenue", value: "LKR 48,250", icon: DollarSign, change: +12.5, prefix: "LKR" },
  { label: "Active Bookings", value: "24", icon: Calendar, change: +8.3 },
  { label: "Total Clients", value: "318", icon: Users, change: +5.2 },
  { label: "Equipment Rented", value: "42", icon: Camera, change: -2.1 },
];

const recentBookings = [
  { id: "BK-0041", client: "Amara Patel", service: "Wedding Photography", date: "2025-04-12", status: "confirmed", amount: 1200 },
  { id: "BK-0042", client: "Marcus Chen", service: "Studio Portrait", date: "2025-04-14", status: "pending", amount: 250 },
  { id: "BK-0043", client: "James Okafor", service: "Event Coverage", date: "2025-04-18", status: "confirmed", amount: 600 },
  { id: "BK-0044", client: "Sofia Laurent", service: "Outdoor Shoot", date: "2025-04-20", status: "pending", amount: 380 },
  { id: "BK-0045", client: "Priya Nair", service: "Commercial", date: "2025-04-22", status: "cancelled", amount: 800 },
];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [services, setServices] = useState<Service[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    /** Matches backend Gallery.GalleryCategory */
    category: "PRODUCT",
    description: "",
    price: 49,
    imageUrl: "",
    featured: false,
    active: true,
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [productMessage, setProductMessage] = useState<string | null>(null);
  const [productError, setProductError] = useState<string | null>(null);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: 100,
    durationMinutes: 60,
    serviceType:"PRE_SHOOT",
    thumbnailImage: "",
    includes: "",
  });
  const [savingService, setSavingService] = useState(false);
  const [serviceMessage, setServiceMessage] = useState<string | null>(null);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    brand: "",
    description: "",
    dailyRentalPrice: 3500,
    weeklyRentalPrice: 18000,
    totalStock: 1,
    availableStock: 1,
    category: "CAMERA",
    thumbnailImage: "",
    specifications: "",
    active: true,
  });
  const [savingEquipment, setSavingEquipment] = useState(false);
  const [equipmentMessage, setEquipmentMessage] = useState<string | null>(null);
  const [equipmentError, setEquipmentError] = useState<string | null>(null);
  const [editingEquipmentId, setEditingEquipmentId] = useState<number | null>(null);
  const [deletingEquipmentId, setDeletingEquipmentId] = useState<string | null>(null);
  const [processingReviewId, setProcessingReviewId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin()) {
      setAuthorized(false);
      router.push('/');
      return;
    }
    setAuthorized(true);
    const token = getAccessToken();
    Promise.all([
      getServices(),
      getEquipment(),
      getGalleryProducts(),
      getAggregatedReviews(),
      token ? getPendingReviewsAdmin(token) : Promise.resolve([]),
    ]).then(([s, e, p, approvedReviews, pendingReviews]) => {
      const mappedPending: Review[] = pendingReviews.map((item) => ({
        id: `rev-${item.id}`,
        name: item.userFullName || "Client",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        service: item.serviceName || item.equipmentName || "Service",
        rating: item.rating,
        comment: item.comment,
        date: item.createdAt?.split("T")[0] ?? "",
        verified: false,
      }));
      const existingIds = new Set(mappedPending.map((item) => item.id));
      const mergedReviews = [...mappedPending, ...approvedReviews.filter((item) => !existingIds.has(item.id))];
      
        setServices(s);
        setEquipment(e);
        setProducts(p);
        setReviews(mergedReviews);
      });
  }, [router]);

  function parseReviewId(rawId: string): number | null {
    const numericId = Number(rawId.replace("rev-", ""));
    return Number.isFinite(numericId) ? numericId : null;
  }

  async function handleApproveReview(review: Review) {
    const token = getAccessToken();
    if (!token) return;
    const reviewId = parseReviewId(review.id);
    if (!reviewId) return;

    setProcessingReviewId(review.id);
    const ok = await approveReviewAdmin(token, reviewId);
    setProcessingReviewId(null);
    if (!ok) return;

    setReviews((current) => current.map((item) => (item.id === review.id ? { ...item, verified: true } : item)));
  }

  async function handleDeleteReview(review: Review) {
    const token = getAccessToken();
    if (!token) return;
    const reviewId = parseReviewId(review.id);
    if (!reviewId) return;

    const confirmed = window.confirm("Delete this review?");
    if (!confirmed) return;

    setProcessingReviewId(review.id);
    const ok = await deleteReviewAdmin(token, reviewId);
    setProcessingReviewId(null);
    if (!ok) return;

    setReviews((current) => current.filter((item) => item.id !== review.id));
  }

  async function handleAddService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServiceError(null);
    setServiceMessage(null);
    if (!newService.name.trim() || !newService.description.trim()) {
      setServiceError('Please add a name and description for the service.');
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setServiceError("You must be logged in to add services.");
      return;
    }

    const normalizedDuration = Number.isFinite(newService.durationMinutes)
      ? Math.max(30, newService.durationMinutes)
      : 60;

    setSavingService(true);
    const payload = {
      name: newService.name,
      description: newService.description,
      price: newService.price,
      durationMinutes: normalizedDuration,
      serviceType: newService.serviceType,
      thumbnailImage: newService.thumbnailImage || undefined,
      includes: newService.includes || undefined,
    };
    const saved = editingServiceId
      ? await updateServiceAdmin(token, editingServiceId, payload)
      : await createService(token, payload);
    setSavingService(false);

    if (!saved) {
      setServiceError(
        `Unable to ${editingServiceId ? "update" : "save"} service. Ensure you are logged in as an admin and the API URL (NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_API_URL) matches your backend.`
      );
      return;
    }

    const refreshedServices = await getServices();
    setServices((current) => (refreshedServices.length ? refreshedServices : [saved, ...current]));
    setServiceMessage(`Service ${editingServiceId ? "updated" : "saved"} successfully.`);
    setEditingServiceId(null);
    setNewService({
      name: "",
      description: "",
      price: 100,
      durationMinutes: 60,
      serviceType: "PRE_SHOOT",
      thumbnailImage: "",
      includes: "",
    });
  }

  function parseServiceId(rawId: string): number | null {
    const numericId = Number(rawId.replace("svc-", ""));
    return Number.isFinite(numericId) ? numericId : null;
  }

  function toBackendServiceType(category: Service["category"]): string {
    switch (category) {
      case "graduation":
        return "GRADUATION";
      case "birthday":
        return "BIRTHDAY";
      case "event":
        return "EVENT";
      case "model-shoot":
        return "MODEL_SHOOT";
      default:
        return "PRE_SHOOT";
    }
  }

  function parseDurationMinutes(duration: string): number {
    const match = duration.match(/\d+/);
    const parsed = match ? Number(match[0]) : 60;
    return Number.isFinite(parsed) ? Math.max(30, parsed) : 60;
  }

  function handleEditService(serviceItem: Service) {
    const serviceId = parseServiceId(serviceItem.id);
    if (!serviceId) {
      setServiceError("Unable to edit this service because its id is invalid.");
      return;
    }

    setServiceError(null);
    setServiceMessage("Editing service. Update the form values and click Save.");
    setEditingServiceId(serviceId);
    setNewService({
      name: serviceItem.title,
      description: serviceItem.description || "",
      price: serviceItem.price,
      durationMinutes: parseDurationMinutes(serviceItem.duration),
      serviceType: toBackendServiceType(serviceItem.category),
      thumbnailImage: serviceItem.image || "",
      includes: serviceItem.includes.join(", "),
    });
  }

  async function handleDeleteService(serviceItem: Service) {
    setServiceError(null);
    setServiceMessage(null);

    const serviceId = parseServiceId(serviceItem.id);
    if (!serviceId) {
      setServiceError("Unable to delete this service because its id is invalid.");
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setServiceError("You must be logged in to delete services.");
      return;
    }

    const confirmed = window.confirm(`Delete "${serviceItem.title}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingServiceId(serviceItem.id);
    const deleted = await deleteServiceAdmin(token, serviceId);
    setDeletingServiceId(null);

    if (!deleted) {
      setServiceError("Unable to delete service. Please try again.");
      return;
    }

    if (editingServiceId === serviceId) {
      setEditingServiceId(null);
    }
    setServices((current) => current.filter((item) => item.id !== serviceItem.id));
    setServiceMessage("Service deleted successfully.");
  }

  async function handleAddProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProductError(null);
    setProductMessage(null);
    if (!newProduct.name.trim() || !newProduct.description.trim() || !newProduct.imageUrl.trim()) {
      setProductError('Please add a name, description, and image URL for the product.');
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setProductError("You must be logged in to add products.");
      return;
    }

    setSavingProduct(true);
    const created = await createGalleryProduct(token, {
      title: newProduct.name,
      description: newProduct.description,
      category: newProduct.category,
      price: newProduct.price,
      imageUrl: newProduct.imageUrl,
      featured: newProduct.featured,
      active: newProduct.active,
    });
    setSavingProduct(false);

    if (!created) {
      setProductError(
        "Unable to save product. Ensure you are logged in as an admin and the API URL (NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_API_URL) matches your backend."
      );
      return;
    }

    setProducts((current) => [created, ...current]);
    setProductMessage('Product saved successfully.');
    setNewProduct({
      name: "",
      category: "PRODUCT",
      description: "",
      price: 49,
      imageUrl: "",
      featured: false,
      active: true,
    });
  }

  async function handleAddEquipment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEquipmentError(null);
    setEquipmentMessage(null);

    if (!newEquipment.name.trim() || !newEquipment.brand.trim()) {
      setEquipmentError("Please add equipment name and brand.");
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setEquipmentError("You must be logged in to add equipment.");
      return;
    }

    setSavingEquipment(true);
    const payload = {
      name: newEquipment.name,
      brand: newEquipment.brand,
      description: newEquipment.description || undefined,
      dailyRentalPrice: newEquipment.dailyRentalPrice,
      weeklyRentalPrice: newEquipment.weeklyRentalPrice,
      totalStock: newEquipment.totalStock,
      availableStock: newEquipment.availableStock,
      category: newEquipment.category,
      thumbnailImage: newEquipment.thumbnailImage || undefined,
      specifications: newEquipment.specifications || undefined,
      active: newEquipment.active,
    };
    const saved = editingEquipmentId
      ? await updateEquipmentAdmin(token, editingEquipmentId, payload)
      : await createEquipment(token, payload);
    setSavingEquipment(false);

    if (!saved) {
      setEquipmentError(
        `Unable to ${editingEquipmentId ? "update" : "save"} equipment. Ensure you are logged in as an admin and the API URL (NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_API_URL) matches your backend.`
      );
      return;
    }

    const refreshedEquipment = await getEquipment();
    setEquipment((current) => (refreshedEquipment.length ? refreshedEquipment : [saved, ...current]));
    setEquipmentMessage(`Equipment ${editingEquipmentId ? "updated" : "saved"} successfully.`);
    setEditingEquipmentId(null);
    setNewEquipment({
      name: "",
      brand: "",
      description: "",
      dailyRentalPrice: 3500,
      weeklyRentalPrice: 18000,
      totalStock: 1,
      availableStock: 1,
      category: "CAMERA",
      thumbnailImage: "",
      specifications: "",
      active: true,
    });
  }

  function parseEquipmentId(rawId: string): number | null {
    const numericId = Number(rawId.replace("eq-", ""));
    return Number.isFinite(numericId) ? numericId : null;
  }

  function toBackendEquipmentCategory(category: Equipment["category"]): string {
    switch (category) {
      case "camera":
        return "CAMERA";
      case "lens":
        return "LENS";
      case "lighting":
        return "LIGHTING";
      case "drone":
        return "DRONE";
      default:
        return "ACCESSORY";
    }
  }

  function handleEditEquipment(equipmentItem: Equipment) {
    const equipmentId = parseEquipmentId(equipmentItem.id);
    if (!equipmentId) {
      setEquipmentError("Unable to edit this equipment item because its id is invalid.");
      return;
    }

    setEquipmentError(null);
    setEquipmentMessage("Editing equipment. Update the form values and click Save.");
    setEditingEquipmentId(equipmentId);
    setNewEquipment({
      name: equipmentItem.name,
      brand: equipmentItem.brand,
      description: equipmentItem.description || "",
      dailyRentalPrice: equipmentItem.pricePerDay,
      weeklyRentalPrice: equipmentItem.pricePerDay * 5,
      totalStock: 1,
      availableStock: equipmentItem.available ? 1 : 0,
      category: toBackendEquipmentCategory(equipmentItem.category),
      thumbnailImage: equipmentItem.image || "",
      specifications: equipmentItem.specs.join(", "),
      active: true,
    });
  }

  async function handleDeleteEquipment(equipmentItem: Equipment) {
    setEquipmentError(null);
    setEquipmentMessage(null);
    const equipmentId = parseEquipmentId(equipmentItem.id);
    if (!equipmentId) {
      setEquipmentError("Unable to delete this equipment item because its id is invalid.");
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setEquipmentError("You must be logged in to delete equipment.");
      return;
    }

    const confirmed = window.confirm(`Delete "${equipmentItem.name}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingEquipmentId(equipmentItem.id);
    const deleted = await deleteEquipmentAdmin(token, equipmentId);
    setDeletingEquipmentId(null);

    if (!deleted) {
      setEquipmentError("Unable to delete equipment. Please try again.");
      return;
    }

    if (editingEquipmentId === equipmentId) {
      setEditingEquipmentId(null);
    }
    setEquipment((current) => current.filter((item) => item.id !== equipmentItem.id));
    setEquipmentMessage("Equipment deleted successfully.");
  }

  const navItems: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = useMemo(
    () => [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "bookings", label: "Bookings", icon: Calendar, count: 24 },
      { id: "services", label: "Services", icon: Camera, count: services.length },
      { id: "equipment", label: "Equipment", icon: Package, count: equipment.length },
      { id: "products", label: "Products", icon: ShoppingBag, count: products.length },
      { id: "reviews", label: "Reviews", icon: MessageSquare, count: reviews.length },
    ],
    [services.length, equipment.length, products.length, reviews.length]
  );

  if (authorized === false) {
    return null; // or a message, but since redirecting, null is fine
  }

  if (authorized === null) {
    return <div>Loading...</div>; // optional loading state
  }

  return (
    <div className="min-h-screen bg-obsidian-100 dark:bg-obsidian-950 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-obsidian-950 border-r border-obsidian-800 fixed left-0 top-0 bottom-0 z-20">
        <div className="p-5 border-b border-obsidian-800">
          <p className="text-xs font-mono text-gold-400 tracking-widest uppercase">Admin Panel</p>
          <p className="text-xs text-obsidian-500 mt-0.5">Lumière Studio</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-sm text-sm transition-colors",
                activeTab === item.id
                  ? "bg-gold-500/10 text-gold-400 border border-gold-500/20"
                  : "text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-800"
              )}
            >
              <div className="flex items-center gap-2.5">
                <item.icon size={15} />
                {item.label}
              </div>
              {item.count !== undefined && (
                <span className="text-xs bg-obsidian-700 text-obsidian-300 px-1.5 py-0.5 rounded">{item.count}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-obsidian-800 space-y-1">
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-sm text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-800 transition-colors">
            <Settings size={15} /> Settings
          </button>
          <Link href="/" className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-sm text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-800 transition-colors">
            <LogOut size={15} /> Back to Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-60 min-h-screen">
        {/* Admin topbar */}
        <div className="bg-white dark:bg-obsidian-900 border-b border-obsidian-200 dark:border-obsidian-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 lg:hidden overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors",
                  activeTab === item.id
                    ? "bg-gold-500 text-obsidian-950"
                    : "bg-obsidian-100 dark:bg-obsidian-800 text-obsidian-600 dark:text-obsidian-300"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <h1 className="hidden lg:block font-display text-xl text-obsidian-900 dark:text-obsidian-50 capitalize">
            {activeTab}
          </h1>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 text-obsidian-500 hover:text-obsidian-900 dark:hover:text-obsidian-100" aria-label="Notifications">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-obsidian-200 dark:border-obsidian-700">
              <div className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center">
                <span className="text-xs font-bold text-obsidian-950">A</span>
              </div>
              <span className="text-xs text-obsidian-600 dark:text-obsidian-300">Admin</span>
            </div>
          </div>
        </div>

        <div className="p-5 lg:p-8">
          {/* Dashboard tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-200 dark:border-obsidian-800 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-xs text-obsidian-500 dark:text-obsidian-400">{stat.label}</p>
                      <div className="w-8 h-8 bg-gold-100 dark:bg-gold-900/20 rounded-sm flex items-center justify-center">
                        <stat.icon size={14} className="text-gold-600 dark:text-gold-400" />
                      </div>
                    </div>
                    <p className="font-display text-2xl text-obsidian-900 dark:text-obsidian-50">{stat.value}</p>
                    <div className={cn("flex items-center gap-1 mt-1 text-xs", stat.change >= 0 ? "text-emerald-600" : "text-red-500")}>
                      {stat.change >= 0 ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                      {Math.abs(stat.change)}% vs last month
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent bookings table */}
              <div className="bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-200 dark:border-obsidian-800">
                <div className="flex items-center justify-between p-5 border-b border-obsidian-200 dark:border-obsidian-800">
                  <h2 className="font-display text-lg text-obsidian-900 dark:text-obsidian-50">Recent Bookings</h2>
                  <Button size="sm" variant="ghost" className="gap-1 text-xs" onClick={() => alert('View All Bookings clicked')}>
                    View All <ChevronRight size={12} />
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-obsidian-100 dark:border-obsidian-800">
                        {["ID", "Client", "Service", "Date", "Status", "Amount", ""].map((h) => (
                          <th key={h} className="text-left text-xs font-medium text-obsidian-400 dark:text-obsidian-500 uppercase tracking-wide px-4 py-3">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((b) => (
                        <tr key={b.id} className="border-b border-obsidian-50 dark:border-obsidian-800/50 hover:bg-obsidian-50 dark:hover:bg-obsidian-800/30 transition-colors">
                          <td className="px-4 py-3 text-xs font-mono text-obsidian-500">{b.id}</td>
                          <td className="px-4 py-3 text-sm text-obsidian-800 dark:text-obsidian-200 font-medium">{b.client}</td>
                          <td className="px-4 py-3 text-sm text-obsidian-600 dark:text-obsidian-400">{b.service}</td>
                          <td className="px-4 py-3 text-xs text-obsidian-500">{b.date}</td>
                          <td className="px-4 py-3">
                            <Badge variant={b.status === "confirmed" ? "available" : b.status === "pending" ? "default" : "unavailable"}>
                              {b.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm font-display text-gold-600 dark:text-gold-400">{formatPrice(b.amount)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button className="p-1.5 hover:bg-obsidian-100 dark:hover:bg-obsidian-800 rounded transition-colors text-obsidian-500 hover:text-obsidian-800" onClick={() => alert(`View booking ${b.id}`)} aria-label="View booking">
                                <Eye size={13} />
                              </button>
                              <button className="p-1.5 hover:bg-obsidian-100 dark:hover:bg-obsidian-800 rounded transition-colors text-obsidian-500 hover:text-obsidian-800" onClick={() => alert(`Edit booking ${b.id}`)} aria-label="Edit booking">
                                <Edit size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-200 dark:border-obsidian-800 p-5">
                  <p className="text-xs text-obsidian-400 mb-2 flex items-center gap-1.5">
                    <TrendingUp size={12} /> Equipment Availability
                  </p>
                  <div className="space-y-1.5">
                    {equipment.slice(0, 4).map((e) => (
                      <div key={e.id} className="flex items-center justify-between">
                        <span className="text-xs text-obsidian-700 dark:text-obsidian-300 truncate max-w-[70%]">{e.name}</span>
                        <span className={`text-xs font-medium ${e.available ? "text-emerald-600" : "text-red-500"}`}>
                          {e.available ? "Free" : "Out"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-200 dark:border-obsidian-800 p-5">
                  <p className="text-xs text-obsidian-400 mb-2">Latest Reviews</p>
                  {reviews.slice(0, 3).map((r) => (
                    <div key={r.id} className="flex items-center gap-2 py-1.5 border-b border-obsidian-50 dark:border-obsidian-800 last:border-0">
                      <span className="text-xs text-obsidian-700 dark:text-obsidian-300 flex-1 truncate">{r.name}</span>
                      <span className="text-xs text-gold-500">{"★".repeat(r.rating)}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-200 dark:border-obsidian-800 p-5">
                  <p className="text-xs text-obsidian-400 mb-2">Low Stock Products</p>
                  {products.filter((p) => !p.inStock).map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-obsidian-50 dark:border-obsidian-800 last:border-0">
                      <span className="text-xs text-obsidian-700 dark:text-obsidian-300 truncate max-w-[70%]">{p.name}</span>
                      <Badge variant="unavailable">Out</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Services tab */}
          {activeTab === "services" && (
            <div>
              <div className="flex flex-col gap-4 mb-6 rounded-sm border border-obsidian-200 dark:border-obsidian-800 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-sm text-obsidian-500 dark:text-obsidian-400">{services.length} services</p>
                    <p className="text-xs text-obsidian-400 dark:text-obsidian-500 mt-1">Add a new photography service and save it to the backend.</p>
                  </div>
                  <Button size="sm" type="submit" form="add-service-form" disabled={savingService} className="gap-2">
                    {savingService ? "Saving..." : editingServiceId ? "Save Service" : "+ Add Service"}
                  </Button>
                </div>

                <form id="add-service-form" onSubmit={handleAddService} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-3 lg:col-span-2">
                    <div>
                      <label htmlFor="service-name" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Name</label>
                      <input
                        id="service-name"
                        value={newService.name}
                        onChange={(event) => setNewService((prev) => ({ ...prev, name: event.target.value }))}
                        className="mt-2 w-full rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                        placeholder="Service title"
                      />
                    </div>
                    <div>
                      <label htmlFor="service-description" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Description</label>
                      <textarea
                        id="service-description"
                        value={newService.description}
                        onChange={(event) => setNewService((prev) => ({ ...prev, description: event.target.value }))}
                        className="mt-2 w-full min-h-[90px] rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                        placeholder="Service details"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                    <label htmlFor="service-price" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Price (LKR)</label>
                    <input
                      id="service-price"
                      type="number"
                      value={newService.price}
                      onChange={(event) => setNewService((prev) => ({ ...prev, price: Number(event.target.value) }))}
                      className="mt-2 w-full rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                      placeholder="15680"
                      />
                    </div>
                    <div>
                      <label htmlFor="service-duration" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Duration (minutes)</label>
                      <input
                        id="service-duration"
                        type="number"
                        min={30}
                        value={newService.durationMinutes}
                        onChange={(event) => setNewService((prev) => ({ ...prev, durationMinutes: Number(event.target.value) }))}
                        className="mt-2 w-full rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                        placeholder="60"
                      />
                    </div>
                    <div>
                      <label htmlFor="service-type" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Category</label>
                      <select
                        id="service-type"
                        value={newService.serviceType}
                        onChange={(event) => setNewService((prev) => ({ ...prev, serviceType: event.target.value }))}
                        className="mt-2 w-full rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                      >
                        <option value="GRADUATION">Graduation</option>
                        <option value="BIRTHDAY">Birthday</option>
                        <option value="EVENT">Event</option>
                        <option value="MODEL_SHOOT">Model shoot</option>
                        <option value="PRE_SHOOT">Pre-shoot</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="service-image" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Image URL</label>
                      <input
                        id="service-image"
                        value={newService.thumbnailImage}
                        onChange={(event) => setNewService((prev) => ({ ...prev, thumbnailImage: event.target.value }))}
                        className="mt-2 w-full rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label htmlFor="service-includes" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Includes (comma-separated)</label>
                      <input
                        id="service-includes"
                        value={newService.includes}
                        onChange={(event) => setNewService((prev) => ({ ...prev, includes: event.target.value }))}
                        className="mt-2 w-full rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                        placeholder="Photos, editing, prints"
                      />
                    </div>
                    {serviceError && <p className="text-xs text-red-500">{serviceError}</p>}
                    {serviceMessage && <p className="text-xs text-emerald-600">{serviceMessage}</p>}
                  </div>
                </form>
              </div>

              <div className="bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-200 dark:border-obsidian-800 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-obsidian-200 dark:border-obsidian-800 bg-obsidian-50 dark:bg-obsidian-800/50">
                      {["Service", "Category", "Price", "Duration", "Featured", "Actions"].map((h) => (
                        <th key={h} className="text-left text-xs font-medium text-obsidian-400 uppercase tracking-wide px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s) => (
                      <tr key={s.id} className="border-b border-obsidian-100 dark:border-obsidian-800 hover:bg-obsidian-50 dark:hover:bg-obsidian-800/30">
                        <td className="px-4 py-3 text-sm font-medium text-obsidian-800 dark:text-obsidian-200">{s.title}</td>
                        <td className="px-4 py-3 text-xs text-obsidian-500 capitalize">{s.category}</td>
                        <td className="px-4 py-3 text-sm text-gold-600 dark:text-gold-400 font-display">{formatPrice(s.price)}</td>
                        <td className="px-4 py-3 text-xs text-obsidian-500">{s.duration}</td>
                        <td className="px-4 py-3">
                          {s.featured ? <Badge variant="featured">Yes</Badge> : <span className="text-xs text-obsidian-400">No</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button type="button" className="p-1.5 hover:bg-obsidian-100 dark:hover:bg-obsidian-800 rounded text-obsidian-500 hover:text-blue-600" onClick={() => handleEditService(s)} aria-label="Edit service"><Edit size={13} /></button>
                            <button type="button" className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-obsidian-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => handleDeleteService(s)} disabled={deletingServiceId === s.id} aria-label="Delete service"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Equipment tab */}
          {activeTab === "equipment" && (
            <div>
              <div className="flex flex-col gap-4 mb-6 rounded-sm border border-obsidian-200 dark:border-obsidian-800 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-sm text-obsidian-500 dark:text-obsidian-400">{equipment.length} items in inventory</p>
                    <p className="text-xs text-obsidian-400 dark:text-obsidian-500 mt-1">Add new equipment and save it to the backend.</p>
                  </div>
                  <Button size="sm" type="submit" form="add-equipment-form" disabled={savingEquipment} className="gap-2">
                    {savingEquipment ? "Saving..." : editingEquipmentId ? "Save Equipment" : "+ Add Equipment"}
                  </Button>
                </div>

                <form id="add-equipment-form" onSubmit={handleAddEquipment} className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="space-y-3 lg:col-span-2">
                    <div>
                      <label htmlFor="equipment-name" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Name</label>
                      <input
                        id="equipment-name"
                        value={newEquipment.name}
                        onChange={(event) => setNewEquipment((prev) => ({ ...prev, name: event.target.value }))}
                        className="mt-2 w-full rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                        placeholder="Canon EOS R6"
                      />
                    </div>
                    <div>
                      <label htmlFor="equipment-description" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Description</label>
                      <textarea
                        id="equipment-description"
                        value={newEquipment.description}
                        onChange={(event) => setNewEquipment((prev) => ({ ...prev, description: event.target.value }))}
                        className="mt-2 w-full min-h-[90px] rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                        placeholder="Short description"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label htmlFor="equipment-brand" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Brand</label>
                      <input
                        id="equipment-brand"
                        value={newEquipment.brand}
                        onChange={(event) => setNewEquipment((prev) => ({ ...prev, brand: event.target.value }))}
                        className="mt-2 w-full rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                        placeholder="Canon"
                      />
                    </div>
                    <div>
                      <label htmlFor="equipment-category" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Category</label>
                      <select
                        id="equipment-category"
                        value={newEquipment.category}
                        onChange={(event) => setNewEquipment((prev) => ({ ...prev, category: event.target.value }))}
                        className="mt-2 w-full rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                      >
                        <option value="CAMERA">Camera</option>
                        <option value="LENS">Lens</option>
                        <option value="LIGHTING">Lighting</option>
                        <option value="DRONE">Drone</option>
                        <option value="ACCESSORY">Accessory</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="equipment-image" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Image URL</label>
                      <input
                        id="equipment-image"
                        value={newEquipment.thumbnailImage}
                        onChange={(event) => setNewEquipment((prev) => ({ ...prev, thumbnailImage: event.target.value }))}
                        className="mt-2 w-full rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label htmlFor="equipment-price-day" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Daily price (LKR)</label>
                      <input
                        id="equipment-price-day"
                        type="number"
                        value={newEquipment.dailyRentalPrice}
                        onChange={(event) => setNewEquipment((prev) => ({ ...prev, dailyRentalPrice: Number(event.target.value) }))}
                        className="mt-2 w-full rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                      />
                    </div>
                    <div>
                      <label htmlFor="equipment-price-week" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Weekly price (LKR)</label>
                      <input
                        id="equipment-price-week"
                        type="number"
                        value={newEquipment.weeklyRentalPrice}
                        onChange={(event) => setNewEquipment((prev) => ({ ...prev, weeklyRentalPrice: Number(event.target.value) }))}
                        className="mt-2 w-full rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="equipment-total-stock" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Total stock</label>
                        <input
                          id="equipment-total-stock"
                          type="number"
                          value={newEquipment.totalStock}
                          onChange={(event) => setNewEquipment((prev) => ({ ...prev, totalStock: Number(event.target.value) }))}
                          className="mt-2 w-full rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                        />
                      </div>
                      <div>
                        <label htmlFor="equipment-available-stock" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Available</label>
                        <input
                          id="equipment-available-stock"
                          type="number"
                          value={newEquipment.availableStock}
                          onChange={(event) => setNewEquipment((prev) => ({ ...prev, availableStock: Number(event.target.value) }))}
                          className="mt-2 w-full rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="equipment-specs" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Specifications (comma-separated)</label>
                      <input
                        id="equipment-specs"
                        value={newEquipment.specifications}
                        onChange={(event) => setNewEquipment((prev) => ({ ...prev, specifications: event.target.value }))}
                        className="mt-2 w-full rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                        placeholder="24MP, 4K, Mirrorless"
                      />
                    </div>
                    {equipmentError && <p className="text-xs text-red-500">{equipmentError}</p>}
                    {equipmentMessage && <p className="text-xs text-emerald-600">{equipmentMessage}</p>}
                  </div>
                </form>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipment.map((e) => (
                  <div key={e.id} className="bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-200 dark:border-obsidian-800 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs text-gold-600 dark:text-gold-400 font-medium">{e.brand}</p>
                        <p className="text-sm font-medium text-obsidian-800 dark:text-obsidian-200">{e.name}</p>
                      </div>
                      <Badge variant={e.available ? "available" : "unavailable"}>
                        {e.available ? "Free" : "Rented"}
                      </Badge>
                    </div>
                    <p className="text-xs text-obsidian-500 capitalize mb-3">{e.category} · {formatPrice(e.pricePerDay)}/day</p>
                    <div className="flex gap-2">
                      <button type="button" className="flex items-center gap-1 text-xs text-obsidian-600 hover:text-blue-600 transition-colors" onClick={() => handleEditEquipment(e)} aria-label="Edit equipment"><Edit size={11} /> Edit</button>
                      <button type="button" className="flex items-center gap-1 text-xs text-obsidian-600 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => handleDeleteEquipment(e)} disabled={deletingEquipmentId === e.id} aria-label="Remove equipment"><Trash2 size={11} /> {deletingEquipmentId === e.id ? "Removing..." : "Remove"}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products tab */}
          {activeTab === "products" && (
            <div>
              <div className="flex flex-col gap-4 mb-6 rounded-sm border border-obsidian-200 dark:border-obsidian-800 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-sm text-obsidian-500 dark:text-obsidian-400">{products.length} products</p>
                    <p className="text-xs text-obsidian-400 dark:text-obsidian-500 mt-1">Add a new gallery product and save it to the backend.</p>
                  </div>
                  <Button size="sm" type="submit" form="add-product-form" disabled={savingProduct} className="gap-2">
                    {savingProduct ? 'Saving...' : '+ Add Product'}
                  </Button>
                </div>

                <form id="add-product-form" onSubmit={handleAddProduct} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-3 lg:col-span-2">
                    <div>
                      <label htmlFor="product-name" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Name</label>
                      <input
                        id="product-name"
                        value={newProduct.name}
                        onChange={(event) => setNewProduct((prev) => ({ ...prev, name: event.target.value }))}
                        className="mt-2 w-full rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                        placeholder="Product title"
                      />
                    </div>
                    <div>
                      <label htmlFor="product-description" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Description</label>
                      <textarea
                        id="product-description"
                        value={newProduct.description}
                        onChange={(event) => setNewProduct((prev) => ({ ...prev, description: event.target.value }))}
                        className="mt-2 w-full min-h-[90px] rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                        placeholder="Product details"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label htmlFor="product-category" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Category</label>
                      <select
                        id="product-category"
                        value={newProduct.category}
                        onChange={(event) => setNewProduct((prev) => ({ ...prev, category: event.target.value }))}
                        className="mt-2 w-full rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                      >
                        <option value="PRODUCT">Product / print</option>
                        <option value="FAMILY">Family / album</option>
                        <option value="PORTRAIT">Portrait</option>
                        <option value="WEDDING">Wedding</option>
                        <option value="CORPORATE">Corporate</option>
                        <option value="EVENT">Event</option>
                        <option value="FASHION">Fashion</option>
                        <option value="REAL_ESTATE">Real estate</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="product-image" className="text-xs font-medium text-obsidian-600 dark:text-obsidian-300">Image URL</label>
                      <input
                        id="product-image"
                        value={newProduct.imageUrl}
                        onChange={(event) => setNewProduct((prev) => ({ ...prev, imageUrl: event.target.value }))}
                        className="mt-2 w-full rounded-sm border border-obsidian-200 bg-white dark:bg-obsidian-950 px-3 py-2 text-sm text-obsidian-900 dark:text-obsidian-100"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 text-xs text-obsidian-600 dark:text-obsidian-300">
                        <input
                          type="checkbox"
                          checked={newProduct.featured}
                          onChange={(event) => setNewProduct((prev) => ({ ...prev, featured: event.target.checked }))}
                          className="h-4 w-4 rounded border-obsidian-300 text-gold-500"
                        />
                        Featured
                      </label>
                      <label className="flex items-center gap-2 text-xs text-obsidian-600 dark:text-obsidian-300">
                        <input
                          type="checkbox"
                          checked={newProduct.active}
                          onChange={(event) => setNewProduct((prev) => ({ ...prev, active: event.target.checked }))}
                          className="h-4 w-4 rounded border-obsidian-300 text-gold-500"
                        />
                        Active
                      </label>
                    </div>
                    {productError && <p className="text-xs text-red-500">{productError}</p>}
                    {productMessage && <p className="text-xs text-emerald-600">{productMessage}</p>}
                  </div>
                </form>
              </div>

              <div className="bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-200 dark:border-obsidian-800 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-obsidian-200 dark:border-obsidian-800 bg-obsidian-50 dark:bg-obsidian-800/50">
                      {["Product", "Category", "Price", "Rating", "Stock", "Actions"].map((h) => (
                        <th key={h} className="text-left text-xs font-medium text-obsidian-400 uppercase tracking-wide px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-obsidian-100 dark:border-obsidian-800 hover:bg-obsidian-50 dark:hover:bg-obsidian-800/30">
                        <td className="px-4 py-3 text-sm font-medium text-obsidian-800 dark:text-obsidian-200">{p.name}</td>
                        <td className="px-4 py-3 text-xs text-obsidian-500 capitalize">{p.category}</td>
                        <td className="px-4 py-3 text-sm text-gold-600 dark:text-gold-400 font-display">{formatPrice(p.price)}</td>
                        <td className="px-4 py-3 text-xs text-obsidian-600">★ {p.rating} ({p.reviewCount})</td>
                        <td className="px-4 py-3">
                          <Badge variant={p.inStock ? "available" : "unavailable"}>
                            {p.inStock ? "In Stock" : "Out"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="p-1.5 hover:bg-obsidian-100 dark:hover:bg-obsidian-800 rounded text-obsidian-500 hover:text-blue-600" onClick={() => alert(`Edit product ${p.id}`)} aria-label="Edit product"><Edit size={13} /></button>
                            <button className="p-1.5 hover:bg-red-50 rounded text-obsidian-500 hover:text-red-600" onClick={() => alert(`Delete product ${p.id}`)} aria-label="Delete product"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reviews tab */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-obsidian-500">{reviews.length} reviews total</p>
              </div>
              {reviews.map((r) => (
                <div key={r.id} className="bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-200 dark:border-obsidian-800 p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 mb-3">
                      <div>
                        <p className="text-sm font-medium text-obsidian-800 dark:text-obsidian-200">{r.name}</p>
                        <p className="text-xs text-obsidian-500">{r.service} · {r.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gold-500 text-sm">{"★".repeat(r.rating)}</span>
                      {r.verified && <Badge variant="available">Verified</Badge>}
                    </div>
                  </div>
                  <p className="text-sm text-obsidian-600 dark:text-obsidian-400 leading-relaxed mb-3">{r.comment}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="text-xs gap-1 text-emerald-600" onClick={() => handleApproveReview(r)} disabled={r.verified || processingReviewId === r.id}><CheckCircle size={11} /> {r.verified ? "Approved" : "Approve"}</Button>
                    <Button size="sm" variant="ghost" className="text-xs gap-1 text-red-500" onClick={() => handleDeleteReview(r)} disabled={processingReviewId === r.id}><Trash2 size={11} /> Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bookings tab */}
          {activeTab === "bookings" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-obsidian-500">{recentBookings.length} recent bookings</p>
                <div className="flex gap-2">
                  <select className="text-xs border border-obsidian-200 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 text-obsidian-600 dark:text-obsidian-300 rounded-sm px-3 py-1.5 focus:outline-none" aria-label="Filter bookings by status">
                    <option>All Statuses</option>
                    <option>Confirmed</option>
                    <option>Pending</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                {recentBookings.map((b) => (
                  <div key={b.id} className="bg-white dark:bg-obsidian-900 rounded-sm border border-obsidian-200 dark:border-obsidian-800 p-5 flex items-center gap-4 flex-wrap">
                    <div className="font-mono text-xs text-obsidian-400">{b.id}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-obsidian-800 dark:text-obsidian-200">{b.client}</p>
                      <p className="text-xs text-obsidian-500">{b.service} · {b.date}</p>
                    </div>
                    <Badge variant={b.status === "confirmed" ? "available" : b.status === "pending" ? "default" : "unavailable"}>
                      {b.status}
                    </Badge>
                    <p className="font-display text-gold-600 dark:text-gold-400">{formatPrice(b.amount)}</p>
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-obsidian-100 dark:hover:bg-obsidian-800 rounded text-obsidian-500 hover:text-blue-600" onClick={() => alert(`View booking ${b.id}`)} aria-label="View booking"><Eye size={13} /></button>
                      <button className="p-1.5 hover:bg-obsidian-100 dark:hover:bg-obsidian-800 rounded text-obsidian-500 hover:text-blue-600" onClick={() => alert(`Edit booking ${b.id}`)} aria-label="Edit booking"><Edit size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
