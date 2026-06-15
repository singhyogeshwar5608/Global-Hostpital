import { create } from "zustand";

// ─── Types ───────────────────────────────────────────────────
export interface Medicine {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  quantity: number; // quantity per unit (e.g., 10 tablets, 30 capsules)
  category: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface MedicineOrder {
  id: string;
  items: CartItem[];
  totalAmount: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  shippingAddress: string;
  paymentMethod: "card" | "upi" | "netbanking" | "cod";
  paymentStatus: "paid" | "pending" | "failed";
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface MedicalStore {
  id: string;
  name: string;
  ownerName: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  district: string;
  phone: string;
  email: string;
  rating: number;
  licenseNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MedicineState {
  medicines: Medicine[];
  addMedicine: (medicine: Omit<Medicine, "id" | "createdAt" | "updatedAt">) => void;
  updateMedicine: (id: string, data: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  toggleMedicineStatus: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (medicine: Medicine, qty?: number) => void;
  removeFromCart: (medicineId: string) => void;
  updateCartQuantity: (medicineId: string, qty: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;

  // Orders
  orders: MedicineOrder[];
  placeOrder: (order: Omit<MedicineOrder, "id" | "createdAt" | "updatedAt">) => MedicineOrder;
  updateOrderStatus: (id: string, status: MedicineOrder["orderStatus"]) => void;
  updatePaymentStatus: (id: string, status: MedicineOrder["paymentStatus"]) => void;

  // Medical Stores
  medicalStores: MedicalStore[];
  addMedicalStore: (data: Omit<MedicalStore, "id" | "createdAt" | "updatedAt">) => void;
  updateMedicalStore: (id: string, data: Partial<MedicalStore>) => void;

  // Shop UI
  isShopOpen: boolean;
  openShop: () => void;
  closeShop: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

// ─── Sample Data ─────────────────────────────────────────────
const sampleMedicines: Medicine[] = [
  {
    id: "MED-1001",
    name: "Paracetamol 500mg",
    price: 2.50,
    stock: 500,
    description: "Common pain reliever and fever reducer. Effective for headaches, body aches, and cold symptoms.",
    quantity: 10,
    category: "Pain Relief",
    image: "💊",
    isActive: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "MED-1002",
    name: "Amoxicillin 250mg",
    price: 8.99,
    stock: 200,
    description: "Broad-spectrum antibiotic used to treat various bacterial infections including ear, nose, throat, and urinary tract infections.",
    quantity: 30,
    category: "Antibiotics",
    image: "💊",
    isActive: true,
    createdAt: "2024-02-15T14:30:00Z",
    updatedAt: "2024-02-15T14:30:00Z",
  },
  {
    id: "MED-1003",
    name: "Omeprazole 20mg",
    price: 5.75,
    stock: 350,
    description: "Proton pump inhibitor used to treat acid reflux, GERD, and stomach ulcers. Reduces stomach acid production.",
    quantity: 14,
    category: "Gastrointestinal",
    image: "💊",
    isActive: true,
    createdAt: "2024-03-05T09:15:00Z",
    updatedAt: "2024-03-05T09:15:00Z",
  },
  {
    id: "MED-1004",
    name: "Cetirizine 10mg",
    price: 3.25,
    stock: 450,
    description: "Antihistamine for allergy relief. Treats hay fever, allergic rhinitis, and chronic urticaria.",
    quantity: 10,
    category: "Allergy",
    image: "💊",
    isActive: true,
    createdAt: "2024-03-20T11:45:00Z",
    updatedAt: "2024-03-20T11:45:00Z",
  },
  {
    id: "MED-1005",
    name: "Metformin 500mg",
    price: 4.50,
    stock: 300,
    description: "First-line medication for type 2 diabetes. Helps control blood sugar levels by improving insulin sensitivity.",
    quantity: 30,
    category: "Diabetes",
    image: "💊",
    isActive: true,
    createdAt: "2024-04-02T16:20:00Z",
    updatedAt: "2024-04-02T16:20:00Z",
  },
  {
    id: "MED-1006",
    name: "Amlodipine 5mg",
    price: 6.00,
    stock: 250,
    description: "Calcium channel blocker used to treat high blood pressure and coronary artery disease. Helps relax blood vessels.",
    quantity: 30,
    category: "Cardiovascular",
    image: "💊",
    isActive: true,
    createdAt: "2024-04-15T08:30:00Z",
    updatedAt: "2024-04-15T08:30:00Z",
  },
  {
    id: "MED-1007",
    name: "Azithromycin 500mg",
    price: 12.50,
    stock: 150,
    description: "Macrolide antibiotic for treating respiratory infections, skin infections, and sexually transmitted infections.",
    quantity: 3,
    category: "Antibiotics",
    image: "💊",
    isActive: true,
    createdAt: "2024-05-01T13:00:00Z",
    updatedAt: "2024-05-01T13:00:00Z",
  },
  {
    id: "MED-1008",
    name: "Vitamin D3 1000IU",
    price: 7.99,
    stock: 600,
    description: "Essential vitamin supplement for bone health, immune function, and calcium absorption. Recommended for deficiency.",
    quantity: 30,
    category: "Supplements",
    image: "💊",
    isActive: true,
    createdAt: "2024-05-10T10:30:00Z",
    updatedAt: "2024-05-10T10:30:00Z",
  },
];

const sampleOrders: MedicineOrder[] = [
  {
    id: "ORD-5001",
    items: [
      { medicine: sampleMedicines[0], quantity: 3 },
      { medicine: sampleMedicines[3], quantity: 2 },
    ],
    totalAmount: 14.0,
    patientName: "John Doe",
    patientEmail: "john@example.com",
    patientPhone: "+1 (555) 101-2001",
    shippingAddress: "123 Main St, New York, NY 10001",
    paymentMethod: "card",
    paymentStatus: "paid",
    orderStatus: "delivered",
    createdAt: "2024-05-15T10:00:00Z",
    updatedAt: "2024-05-18T14:00:00Z",
  },
  {
    id: "ORD-5002",
    items: [
      { medicine: sampleMedicines[1], quantity: 1 },
      { medicine: sampleMedicines[4], quantity: 2 },
    ],
    totalAmount: 17.99,
    patientName: "Emily Johnson",
    patientEmail: "emily@example.com",
    patientPhone: "+1 (555) 303-4003",
    shippingAddress: "456 Oak Ave, Brooklyn, NY 11201",
    paymentMethod: "upi",
    paymentStatus: "paid",
    orderStatus: "shipped",
    createdAt: "2024-05-20T14:30:00Z",
    updatedAt: "2024-05-22T09:00:00Z",
  },
  {
    id: "ORD-5003",
    items: [
      { medicine: sampleMedicines[7], quantity: 2 },
    ],
    totalAmount: 15.98,
    patientName: "Michael Smith",
    patientEmail: "michael@example.com",
    patientPhone: "+1 (555) 202-3002",
    shippingAddress: "789 Pine St, Queens, NY 11375",
    paymentMethod: "netbanking",
    paymentStatus: "pending",
    orderStatus: "processing",
    createdAt: "2024-05-25T08:15:00Z",
    updatedAt: "2024-05-25T08:15:00Z",
  },
];

// ─── Sample Medical Stores ───────────────────────────────────
const sampleMedicalStores: MedicalStore[] = [
  { id: "MS-001", name: "City Pharmacy & Medical Store", ownerName: "Rajesh Kumar", address: "12, MG Road, Sector 5", city: "Mumbai", state: "Maharashtra", pinCode: "400001", district: "Mumbai City", phone: "+91 98765-43210", email: "citypharma@example.com", rating: 4.5, licenseNumber: "DL-22-MH-001", isActive: true, createdAt: "2024-01-15T00:00:00Z", updatedAt: "2024-06-01T00:00:00Z" },
  { id: "MS-002", name: "HealWell Pharmacy", ownerName: "Priya Sharma", address: "45, LBS Marg, Near Station", city: "Mumbai", state: "Maharashtra", pinCode: "400002", district: "Mumbai Suburban", phone: "+91 98765-43211", email: "healwell@example.com", rating: 4.2, licenseNumber: "DL-22-MH-002", isActive: true, createdAt: "2024-02-20T00:00:00Z", updatedAt: "2024-06-01T00:00:00Z" },
  { id: "MS-003", name: "MediCare Drug Store", ownerName: "Amit Patel", address: "78, Park Street", city: "Delhi", state: "Delhi", pinCode: "110001", district: "Central Delhi", phone: "+91 98765-43212", email: "medicare@example.com", rating: 4.7, licenseNumber: "DL-22-DL-001", isActive: true, createdAt: "2024-03-10T00:00:00Z", updatedAt: "2024-06-01T00:00:00Z" },
  { id: "MS-004", name: "Wellness Pharmacy", ownerName: "Neha Gupta", address: "23, Brigade Road", city: "Bangalore", state: "Karnataka", pinCode: "560001", district: "Bangalore Urban", phone: "+91 98765-43213", email: "wellness@example.com", rating: 4.0, licenseNumber: "DL-22-KA-001", isActive: true, createdAt: "2024-04-05T00:00:00Z", updatedAt: "2024-06-01T00:00:00Z" },
];

// ─── Store ───────────────────────────────────────────────────
export const useMedicineStore = create<MedicineState>((set, get) => ({
  medicines: sampleMedicines,

  addMedicine: (data) => {
    const medicine: Medicine = {
      ...data,
      id: `MED-${1000 + get().medicines.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ medicines: [...state.medicines, medicine] }));
  },

  updateMedicine: (id, data) => {
    set((state) => ({
      medicines: state.medicines.map((m) =>
        m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m
      ),
    }));
  },

  deleteMedicine: (id) => {
    set((state) => ({ medicines: state.medicines.filter((m) => m.id !== id) }));
  },

  toggleMedicineStatus: (id) => {
    set((state) => ({
      medicines: state.medicines.map((m) =>
        m.id === id ? { ...m, isActive: !m.isActive, updatedAt: new Date().toISOString() } : m
      ),
    }));
  },

  // ─── Cart ────────────────────────────────────────────────
  cart: [],

  addToCart: (medicine, qty = 1) => {
    const { cart } = get();
    const existing = cart.find((item) => item.medicine.id === medicine.id);
    if (existing) {
      const newQty = Math.min(existing.quantity + qty, medicine.stock);
      set({
        cart: cart.map((item) =>
          item.medicine.id === medicine.id ? { ...item, quantity: newQty } : item
        ),
      });
    } else {
      set({ cart: [...cart, { medicine, quantity: Math.min(qty, medicine.stock) }] });
    }
  },

  removeFromCart: (medicineId) => {
    set((state) => ({ cart: state.cart.filter((item) => item.medicine.id !== medicineId) }));
  },

  updateCartQuantity: (medicineId, qty) => {
    if (qty <= 0) {
      get().removeFromCart(medicineId);
      return;
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.medicine.id === medicineId
          ? { ...item, quantity: Math.min(qty, item.medicine.stock) }
          : item
      ),
    }));
  },

  clearCart: () => set({ cart: [] }),

  getCartTotal: () => {
    return get().cart.reduce((total, item) => total + item.medicine.price * item.quantity, 0);
  },

  getCartItemCount: () => {
    return get().cart.reduce((count, item) => count + item.quantity, 0);
  },

  // ─── Orders ─────────────────────────────────────────────
  orders: sampleOrders,

  placeOrder: (orderData) => {
    const order: MedicineOrder = {
      ...orderData,
      id: `ORD-${5000 + get().orders.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Reduce stock for ordered items
    const { cart, medicines } = get();
    const updatedMedicines = medicines.map((med) => {
      const cartItem = cart.find((item) => item.medicine.id === med.id);
      if (cartItem) {
        return { ...med, stock: Math.max(0, med.stock - cartItem.quantity) };
      }
      return med;
    });
    set((state) => ({
      orders: [order, ...state.orders],
      cart: [],
      medicines: updatedMedicines,
    }));
    return order;
  },

  updateOrderStatus: (id, status) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() } : o
      ),
    }));
  },

  updatePaymentStatus: (id, status) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, paymentStatus: status, updatedAt: new Date().toISOString() } : o
      ),
    }));
  },

  // ─── Medical Stores ─────────────────────────────────────
  medicalStores: sampleMedicalStores,
  addMedicalStore: (data) => {
    const store: MedicalStore = { ...data, id: `MS-${Date.now().toString(36).toUpperCase()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    set((s) => ({ medicalStores: [...s.medicalStores, store] }));
  },
  updateMedicalStore: (id, data) => {
    set((s) => ({ medicalStores: s.medicalStores.map((st) => st.id === id ? { ...st, ...data, updatedAt: new Date().toISOString() } : st) }));
  },

  // ─── Shop UI ────────────────────────────────────────────
  isShopOpen: false,
  openShop: () => set({ isShopOpen: true }),
  closeShop: () => set({ isShopOpen: false }),
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}));
