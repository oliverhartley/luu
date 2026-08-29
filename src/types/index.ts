export type UserRole = 'admin' | 'stylist' | 'client';

export type ServiceCategory = 'hair' | 'nails' | 'brows_lashes' | 'skincare' | 'spa';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  durationMinutes: number;
  price: number;
  description: string;
  image?: string;
  defaultRecurrenceDays?: number; // e.g. 14 for nails, 25 for roots, 45 for haircut
  requiredProducts?: {
    productId: string;
    productName: string;
    amountUsed: number;
    unit: string;
  }[];
}

export interface Professional {
  id: string;
  name: string;
  roleTitle: string; // e.g. "Colorista Master", "Manicurista Senior"
  specialties: ServiceCategory[];
  avatar: string;
  rating: number;
  commissionRate: number; // e.g. 0.40 (40%)
  phone: string;
  colorHex: string;
}

export interface TechnicalFormula {
  id: string;
  date: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  isPrivate: boolean; // Confidential to the professional
  // For hair:
  rootFormula?: string;
  lengthsFormula?: string;
  developerVol?: string;
  tonerFormula?: string;
  processingTimeMinutes?: number;
  // For nails:
  baseType?: string;
  polishBrandAndCode?: string;
  nailArtDetails?: string;
  // Notes:
  generalNotes?: string;
  photos?: string[];
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday?: string; // YYYY-MM-DD
  avatar?: string;
  totalVisits: number;
  totalSpent: number;
  avgTicket: number;
  firstVisitDate: string;
  lastVisitDate: string;
  favoriteProfessionalId?: string;
  tags: ('VIP' | 'Frecuente' | 'Nuevo' | 'Inactivo' | 'Color Raíz' | 'Manicura Lover')[];
  formulas: TechnicalFormula[];
  notes?: string;
}

export type AppointmentStatus = 'confirmed' | 'arrived' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface AppointmentItem {
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  durationMinutes: number;
  price: number;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: AppointmentStatus;
  items: AppointmentItem[];
  totalPrice: number;
  notes?: string;
  checkInTime?: string;
  checkoutDetails?: {
    paymentMethod: 'credit' | 'debit' | 'transfer' | 'cash';
    subtotal: number;
    discount: number;
    tip: number;
    total: number;
    completedAt: string;
    uploadedPhoto?: string;
    technicalNotes?: string;
    surveySent: boolean;
    surveyRating?: number;
    surveyComment?: string;
    rectificationNeeded?: boolean;
  };
}

export interface InventoryProduct {
  id: string;
  name: string;
  brand: string;
  category: 'tintes' | 'oxidantes' | 'tratamientos' | 'esmaltes' | 'desechables' | 'retail';
  currentStock: number;
  minStockAlert: number;
  unit: string;
  costPrice: number;
  salePrice?: number;
  lastRestocked: string;
}

export interface MarketingCampaign {
  id: string;
  title: string;
  type: 'recurrence' | 'birthday' | 'inactivity_recovery' | 'flash_promo';
  serviceTrigger?: ServiceCategory;
  daysTrigger: number;
  messageTemplate: string;
  discountPercentage?: number;
  isActive: boolean;
  targetCount: number;
  convertedCount: number;
}

export interface WhatsAppMessageSimulation {
  id: string;
  toName: string;
  toPhone: string;
  type: 'reminder' | 'survey' | 'campaign' | 'checkin_alert' | 'rectification';
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'replied';
  appointmentId?: string;
}
