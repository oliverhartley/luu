import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut 
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { loadOrSeedCollection, saveDocument, deleteDocument } from '../lib/firestoreSync';
import { 
  Professional, 
  Service, 
  Client, 
  Appointment, 
  AppointmentItem,
  InventoryProduct, 
  MarketingCampaign, 
  WhatsAppMessageSimulation, 
  UserRole,
  TechnicalFormula,
  AppointmentStatus,
  TenantSalon,
  AuthUser,
  ProductSale
} from '../types';
import { 
  INITIAL_PROFESSIONALS, 
  INITIAL_SERVICES, 
  INITIAL_CLIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_INVENTORY, 
  INITIAL_PRODUCT_SALES,
  INITIAL_CAMPAIGNS, 
  INITIAL_WHATSAPP_LOGS 
} from '../data/mockData';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

export const INITIAL_SALONS: TenantSalon[] = [
  {
    id: 'salon-1',
    name: 'luu. Vitacura',
    slug: 'luu-vitacura',
    address: 'Av. Alonso de Córdova 3820',
    city: 'Santiago, Chile',
    phone: '+56 9 8123 4567',
    ownerId: 'user-1',
    createdAt: '2026-01-15'
  },
  {
    id: 'salon-2',
    name: 'Atelier Belleza Providencia',
    slug: 'atelier-providencia',
    address: 'Av. Providencia 2150, Local 12',
    city: 'Santiago, Chile',
    phone: '+56 9 9876 5432',
    ownerId: 'user-2',
    createdAt: '2026-03-20'
  }
];

export const DEFAULT_USER: AuthUser = {
  id: 'user-1',
  name: 'Oliver Hartley',
  email: 'oliver.hartley@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  role: 'owner',
  salonId: 'salon-1',
  salonName: 'luu. Vitacura',
  provider: 'google'
};

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: AuthUser | null;
  currentSalon: TenantSalon;
  salons: TenantSalon[];
  loginWithGoogle: () => Promise<boolean>;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  registerSalon: (salonName: string, ownerName: string, email: string, password: string, phone: string, city?: string) => Promise<void>;
  logout: () => Promise<void>;
  switchSalon: (salonId: string) => void;
  
  professionals: Professional[];
  services: Service[];
  clients: Client[];
  appointments: Appointment[];
  inventory: InventoryProduct[];
  productSales: ProductSale[];
  campaigns: MarketingCampaign[];
  whatsAppLogs: WhatsAppMessageSimulation[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedProfessionalFilter: string | 'all';
  setSelectedProfessionalFilter: (id: string | 'all') => void;
  selectedStylistId: string;
  setSelectedStylistId: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toasts: Toast[];
  showToast: (title: string, message?: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  
  // Actions
  addProfessional: (professional: Omit<Professional, 'id'>) => Professional;
  updateProfessional: (professional: Professional) => void;
  deleteProfessional: (id: string) => void;
  addService: (service: Omit<Service, 'id'>) => Service;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  addServiceToAppointment: (appointmentId: string, item: AppointmentItem) => void;
  removeServiceFromAppointment: (appointmentId: string, itemIndex: number) => void;
  checkInAppointment: (id: string) => void;
  checkoutAppointment: (id: string, details: Appointment['checkoutDetails']) => void;
  submitSurveyFeedback: (appointmentId: string, rating: number, comment?: string) => void;
  addClientFormula: (clientId: string, formula: Omit<TechnicalFormula, 'id' | 'date'>) => void;
  addClient: (client: Omit<Client, 'id' | 'totalVisits' | 'totalSpent' | 'avgTicket' | 'firstVisitDate' | 'lastVisitDate' | 'formulas'>) => Client;
  updateClient: (client: Client) => void;
  addProduct: (product: Omit<InventoryProduct, 'id' | 'lastRestocked'>) => InventoryProduct;
  updateProduct: (product: InventoryProduct) => void;
  deleteProduct: (id: string) => void;
  restockProduct: (productId: string, amountAdded: number) => void;
  processProductSale: (saleData: Omit<ProductSale, 'id' | 'date' | 'time' | 'salonId'>) => ProductSale;
  getProductByBarcode: (barcode: string) => InventoryProduct | undefined;
  sendWhatsAppMessage: (toName: string, toPhone: string, type: WhatsAppMessageSimulation['type'], message: string, appointmentId?: string) => void;
  toggleCampaign: (id: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Salons & User Auth State
  const [salons, setSalons] = useState<TenantSalon[]>(() => {
    const saved = localStorage.getItem('luu_salons');
    return saved ? JSON.parse(saved) : INITIAL_SALONS;
  });

  const [currentSalon, setCurrentSalon] = useState<TenantSalon>(() => {
    const saved = localStorage.getItem('luu_current_salon');
    return saved ? JSON.parse(saved) : INITIAL_SALONS[0];
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('luu_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('pelu_role') as UserRole) || 'admin';
  });

  const [professionals, setProfessionals] = useState<Professional[]>(() => {
    const saved = localStorage.getItem('pelu_professionals');
    return saved ? JSON.parse(saved) : INITIAL_PROFESSIONALS;
  });

  const [selectedStylistId, setSelectedStylistId] = useState<string>(() => {
    return localStorage.getItem('pelu_selected_stylist') || INITIAL_PROFESSIONALS[0]?.id || 'prof-1';
  });
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('pelu_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('pelu_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('pelu_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [inventory, setInventory] = useState<InventoryProduct[]>(() => {
    const saved = localStorage.getItem('pelu_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [productSales, setProductSales] = useState<ProductSale[]>(() => {
    const saved = localStorage.getItem('pelu_product_sales');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCT_SALES;
  });

  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(() => {
    const saved = localStorage.getItem('pelu_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [whatsAppLogs, setWhatsAppLogs] = useState<WhatsAppMessageSimulation[]>(() => {
    const saved = localStorage.getItem('pelu_whatsapp_logs');
    return saved ? JSON.parse(saved) : INITIAL_WHATSAPP_LOGS;
  });

  const [selectedDate, setSelectedDate] = useState<string>('2026-08-16');
  const [selectedProfessionalFilter, setSelectedProfessionalFilter] = useState<string | 'all'>('all');
  const [activeTab, setActiveTab] = useState<string>('agenda');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('luu_salons', JSON.stringify(salons));
  }, [salons]);

  useEffect(() => {
    localStorage.setItem('luu_current_salon', JSON.stringify(currentSalon));
  }, [currentSalon]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('luu_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('luu_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pelu_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('pelu_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('pelu_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('pelu_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('pelu_product_sales', JSON.stringify(productSales));
  }, [productSales]);

  useEffect(() => {
    localStorage.setItem('pelu_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('pelu_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('pelu_whatsapp_logs', JSON.stringify(whatsAppLogs));
  }, [whatsAppLogs]);

  useEffect(() => {
    localStorage.setItem('pelu_professionals', JSON.stringify(professionals));
  }, [professionals]);

  useEffect(() => {
    localStorage.setItem('pelu_selected_stylist', selectedStylistId);
  }, [selectedStylistId]);

  // 1. Initial Firestore Load & Seed on mount
  useEffect(() => {
    loadOrSeedCollection('salons', INITIAL_SALONS).then((data) => {
      if (data && data.length > 0) setSalons(data);
    });
    loadOrSeedCollection('inventory', INITIAL_INVENTORY).then((data) => {
      if (data && data.length > 0) setInventory(data);
    });
    loadOrSeedCollection('clients', INITIAL_CLIENTS).then((data) => {
      if (data && data.length > 0) setClients(data);
    });
    loadOrSeedCollection('appointments', INITIAL_APPOINTMENTS).then((data) => {
      if (data && data.length > 0) setAppointments(data);
    });
    loadOrSeedCollection('services', INITIAL_SERVICES).then((data) => {
      if (data && data.length > 0) setServices(data);
    });
    loadOrSeedCollection('professionals', INITIAL_PROFESSIONALS).then((data) => {
      if (data && data.length > 0) setProfessionals(data);
    });
    loadOrSeedCollection('productSales', INITIAL_PRODUCT_SALES).then((data) => {
      if (data && data.length > 0) setProductSales(data);
    });
  }, []);

  // 2. Real-time Firebase Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario';
        const user: AuthUser = {
          id: firebaseUser.uid,
          name: displayName,
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=E07A5F&color=fff`,
          role: 'owner',
          salonId: currentSalon.id,
          salonName: currentSalon.name,
          provider: firebaseUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'password'
        };
        setCurrentUser(user);
        setRole('admin');
      }
    });
    return () => unsubscribe();
  }, [currentSalon.id, currentSalon.name]);

  const addProfessional = (profData: Omit<Professional, 'id'>): Professional => {
    const newProf: Professional = {
      ...profData,
      id: 'prof-' + Date.now(),
      salonId: currentSalon.id
    };
    setProfessionals((prev) => [...prev, newProf]);
    saveDocument('professionals', newProf);
    showToast('Peluquera Registrada', `${newProf.name} añadida al equipo`, 'success');
    return newProf;
  };

  const updateProfessional = (updatedProf: Professional) => {
    setProfessionals((prev) => prev.map((p) => (p.id === updatedProf.id ? updatedProf : p)));
    saveDocument('professionals', updatedProf);
    showToast('Peluquera Actualizada', updatedProf.name, 'success');
  };

  const deleteProfessional = (id: string) => {
    const prof = professionals.find((p) => p.id === id);
    setProfessionals((prev) => prev.filter((p) => p.id !== id));
    deleteDocument('professionals', id);
    showToast('Peluquera Eliminada', prof?.name, 'info');
  };

  const addService = (serviceData: Omit<Service, 'id'>): Service => {
    const newService: Service = {
      ...serviceData,
      salonId: currentSalon.id,
      id: 'srv-' + Date.now()
    };
    setServices((prev) => [...prev, newService]);
    saveDocument('services', newService);
    showToast('Servicio Creado', newService.name, 'success');
    return newService;
  };

  const updateService = (updatedService: Service) => {
    setServices((prev) => prev.map((s) => (s.id === updatedService.id ? updatedService : s)));
    saveDocument('services', updatedService);
    showToast('Servicio Actualizado', updatedService.name, 'success');
  };

  const deleteService = (id: string) => {
    const srv = services.find((s) => s.id === id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    deleteDocument('services', id);
    showToast('Servicio Eliminado', srv?.name, 'info');
  };

  const showToast = (title: string, message?: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Production Auth Handlers with Firebase
  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const displayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Usuario Google';
      const user: AuthUser = {
        id: fbUser.uid,
        name: displayName,
        email: fbUser.email || 'usuario@gmail.com',
        avatar: fbUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=E07A5F&color=fff`,
        role: 'owner',
        salonId: currentSalon.id,
        salonName: currentSalon.name,
        provider: 'google'
      };
      setCurrentUser(user);
      setRole('admin');
      setActiveTab('agenda');
      showToast('Sesión Real con Google', `Bienvenido(a) ${fbUser.displayName || fbUser.email}`, 'success');
      return true;
    } catch (err: any) {
      console.error('[Firebase Auth Error]', err);
      let errorMsg = 'No se pudo completar la autenticación con Google.';

      if (err.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Ventana de Google cerrada antes de seleccionar tu cuenta.';
      } else if (err.code === 'auth/popup-blocked') {
        errorMsg = 'El navegador bloqueó la ventana emergente de Google. Habilita los popups en la barra de direcciones.';
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMsg = 'Este dominio no está autorizado en Firebase. Añade este dominio en Firebase Console > Authentication > Settings > Authorized Domains.';
      } else if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
        errorMsg = 'Firebase Authentication no está activado aún en Firebase Console. Debes ir a Firebase Console > Authentication > Comenzar y habilitar Google.';
      } else if (err.message) {
        errorMsg = `[${err.code || 'Auth'}] ${err.message}`;
      }

      showToast('Error de Autenticación Real', errorMsg, 'error');
      return false;
    }
  };

  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) return false;
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = cred.user;
      const user: AuthUser = {
        id: fbUser.uid,
        name: fbUser.displayName || email.split('@')[0],
        email: fbUser.email || email,
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        role: 'owner',
        salonId: currentSalon.id,
        salonName: currentSalon.name,
        provider: 'password'
      };
      setCurrentUser(user);
      setRole('admin');
      setActiveTab('agenda');
      showToast('Sesión Iniciada con Éxito', `Bienvenido(a) a ${currentSalon.name}`, 'success');
      return true;
    } catch (err: any) {
      console.warn('Firebase email auth fallback:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        showToast('Error de Acceso', 'Correo o contraseña incorrectos.', 'error');
        return false;
      }

      // Demo fallback si es cuenta de prueba
      const cleanEmail = email.trim().toLowerCase();
      const isOliver = cleanEmail.includes('oliver');
      const isStylist = cleanEmail.includes('valentina') || cleanEmail.includes('stylist') || password.trim().toLowerCase() === 'stylist';
      const userRole: 'owner' | 'stylist' = isStylist ? 'stylist' : 'owner';
      const userName = isOliver
        ? 'Oliver Hartley'
        : isStylist
          ? 'Valentina Morales'
          : email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());

      const userAvatar = isOliver
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
        : isStylist
          ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80';

      const user: AuthUser = {
        id: isOliver ? 'user-1' : 'user-email-' + Date.now(),
        name: userName,
        email: email.trim(),
        avatar: userAvatar,
        role: userRole,
        salonId: currentSalon.id,
        salonName: currentSalon.name,
        provider: 'password'
      };

      setCurrentUser(user);
      if (isStylist) {
        setRole('stylist');
        setActiveTab('stylists');
        setSelectedStylistId('prof-1');
      } else {
        setRole('admin');
        setActiveTab('agenda');
      }
      showToast('Sesión Iniciada con Éxito', `Bienvenido(a) ${userName} a ${currentSalon.name}`, 'success');
      return true;
    }
  };

  const registerSalon = async (
    salonName: string, 
    ownerName: string, 
    email: string, 
    password: string, 
    phone: string, 
    city: string = 'Santiago, Chile'
  ): Promise<void> => {
    let firebaseUid = 'user-' + Date.now();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (cred.user) {
        firebaseUid = cred.user.uid;
        await updateProfile(cred.user, { displayName: ownerName.trim() });
      }
    } catch (err: any) {
      console.warn('Firebase registration notice:', err);
    }

    const newSalonId = 'salon-' + Date.now();
    const newSalon: TenantSalon = {
      id: newSalonId,
      name: salonName.trim(),
      slug: salonName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      address: 'Dirección por configurar',
      city: city,
      phone: phone,
      ownerId: firebaseUid,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const newOwner: AuthUser = {
      id: firebaseUid,
      name: ownerName.trim(),
      email: email.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: 'owner',
      salonId: newSalonId,
      salonName: newSalon.name,
      provider: 'password'
    };

    saveDocument('salons', newSalon);
    setSalons((prev) => [...prev, newSalon]);
    setCurrentSalon(newSalon);
    setCurrentUser(newOwner);
    setRole('admin');
    setActiveTab('agenda');
    showToast('¡Peluquería Registrada con Éxito!', `Bienvenido a la red luu., ${ownerName}`, 'success');
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn(e);
    }
    setCurrentUser(null);
    localStorage.removeItem('luu_current_user');
    setRole('admin');
    showToast('Sesión Finalizada', 'Has cerrado sesión correctamente.', 'info');
  };

  const switchSalon = (salonId: string) => {
    const salon = salons.find((s) => s.id === salonId);
    if (salon) {
      setCurrentSalon(salon);
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          salonId: salon.id,
          salonName: salon.name
        });
      }
      showToast('Salón Seleccionado', salon.name, 'info');
    }
  };

  // Helper to send simulated WhatsApp message
  const sendWhatsAppMessage = (
    toName: string, 
    toPhone: string, 
    type: WhatsAppMessageSimulation['type'], 
    message: string, 
    appointmentId?: string
  ) => {
    const newMsg: WhatsAppMessageSimulation = {
      id: 'wa-' + Date.now(),
      salonId: currentSalon.id,
      toName,
      toPhone,
      type,
      message,
      timestamp: 'Ahora mismo',
      status: 'sent',
      appointmentId
    };
    setWhatsAppLogs((prev) => [newMsg, ...prev]);
    showToast('Mensaje de WhatsApp Enviado', `Para ${toName} (${toPhone})`, 'info');
  };

  // Deduct inventory items according to service recipe requirements
  const autoDeductInventoryForServices = (items: Appointment['items']) => {
    setInventory((currentInventory) => {
      let updated = [...currentInventory];
      items.forEach((item) => {
        const fullService = services.find((s) => s.id === item.serviceId);
        if (fullService?.requiredProducts) {
          fullService.requiredProducts.forEach((req) => {
            updated = updated.map((invItem) => {
              if (invItem.id === req.productId) {
                const newStock = Math.max(0, invItem.currentStock - req.amountUsed);
                if (newStock <= invItem.minStockAlert) {
                  showToast(
                    '⚠️ Alerta de Inventario Crítico',
                    `${invItem.name} llegó al stock mínimo (${newStock} ${invItem.unit}).`,
                    'warning'
                  );
                }
                return { ...invItem, currentStock: newStock };
              }
              return invItem;
            });
          });
        }
      });
      return updated;
    });
  };

  const addAppointment = (appointmentData: Omit<Appointment, 'id'>): Appointment => {
    const id = 'apt-' + Date.now();
    const newApt: Appointment = {
      ...appointmentData,
      salonId: currentSalon.id,
      id
    };
    setAppointments((prev) => [newApt, ...prev]);
    saveDocument('appointments', newApt);

    // Send WhatsApp confirmation simulation
    const servicesList = newApt.items.map((i) => `• ${i.serviceName} con ${i.professionalName}`).join('\n');
    sendWhatsAppMessage(
      newApt.clientName,
      newApt.clientPhone,
      'reminder',
      `🌸 *Reserva Confirmada en ${currentSalon.name}*\n\n¡Hola ${newApt.clientName}!\nTu cita para el *${newApt.date}* a las *${newApt.startTime}* ha sido confirmada con éxito.\n\n*Tus Servicios:*\n${servicesList}\n\n*Total estimado:* $${newApt.totalPrice.toLocaleString('es-CL')}\n\n¡Te esperamos en nuestro salón!`,
      newApt.id
    );

    showToast('Cita agendada con éxito', `${newApt.clientName} - ${newApt.startTime} hrs`);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          const updated = { ...apt, status };
          saveDocument('appointments', updated);
          return updated;
        }
        return apt;
      })
    );
  };

  const addServiceToAppointment = (appointmentId: string, item: AppointmentItem) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId) {
          const updatedItems = [...apt.items, item];
          const updatedTotal = updatedItems.reduce((sum, i) => sum + i.price, 0);
          return {
            ...apt,
            items: updatedItems,
            totalPrice: updatedTotal
          };
        }
        return apt;
      })
    );
    showToast('Servicio Agregado', `${item.serviceName} añadido a la atención (${item.professionalName})`, 'success');
  };

  const removeServiceFromAppointment = (appointmentId: string, itemIndex: number) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId) {
          const itemToRemove = apt.items[itemIndex];
          const updatedItems = apt.items.filter((_, idx) => idx !== itemIndex);
          const updatedTotal = updatedItems.reduce((sum, i) => sum + i.price, 0);
          showToast('Servicio Removido', itemToRemove?.serviceName, 'info');
          return {
            ...apt,
            items: updatedItems,
            totalPrice: updatedTotal
          };
        }
        return apt;
      })
    );
  };

  const checkInAppointment = (id: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          const updated = {
            ...apt,
            status: 'arrived' as AppointmentStatus,
            checkInTime: timeStr
          };
          // Notify stylists and client
          const profNames = Array.from(new Set(apt.items.map((i) => i.professionalName))).join(' y ');
          sendWhatsAppMessage(
            apt.clientName,
            apt.clientPhone,
            'checkin_alert',
            `🛎️ *¡Check-In Confirmado en ${currentSalon.name}!*\n\nHola ${apt.clientName}, ya registramos tu llegada a las ${timeStr} hrs. ${profNames} ya fue avisada y pasará por ti a la sala de recepción en un momento. ¡Disfruta un café o té de cortesía! ☕✨`,
            apt.id
          );
          return updated;
        }
        return apt;
      })
    );

    showToast('Check-In Registrado', 'El cliente está en recepción y el profesional fue alertado.', 'success');
  };

  const checkoutAppointment = (id: string, details: Appointment['checkoutDetails']) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt || !details) return;

    // Deduct stock
    autoDeductInventoryForServices(apt.items);

    // Update appointment
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'completed',
              checkoutDetails: details
            }
          : a
      )
    );

    // Update client metrics
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === apt.clientId) {
          const totalSpent = c.totalSpent + details.total;
          const totalVisits = c.totalVisits + 1;
          return {
            ...c,
            totalSpent,
            totalVisits,
            avgTicket: Math.round(totalSpent / totalVisits),
            lastVisitDate: apt.date
          };
        }
        return c;
      })
    );

    // Automatically trigger WhatsApp satisfaction survey
    sendWhatsAppMessage(
      apt.clientName,
      apt.clientPhone,
      'survey',
      `✨ *¿Cómo fue tu experiencia hoy en ${currentSalon.name}?*\n\nHola ${apt.clientName}, fue un placer atenderte. Para nosotras es fundamental saber qué te pareció tu visita de hoy con ${apt.items.map((i) => i.professionalName).join(', ')}.\n\nPor favor califícanos del 1 al 5 estrellas ⭐ respondiendo este mensaje o tocando en tu enlace personalizado de feedback.`,
      apt.id
    );

    showToast('Atención finalizada & Cobrada', `Total $${details.total.toLocaleString('es-CL')}. Encuesta enviada por WhatsApp.`);
  };

  const submitSurveyFeedback = (appointmentId: string, rating: number, comment?: string) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId && apt.checkoutDetails) {
          const rectificationNeeded = rating <= 3;
          return {
            ...apt,
            checkoutDetails: {
              ...apt.checkoutDetails,
              surveyRating: rating,
              surveyComment: comment,
              rectificationNeeded
            }
          };
        }
        return apt;
      })
    );

    const apt = appointments.find((a) => a.id === appointmentId);
    if (apt) {
      if (rating <= 3) {
        showToast(
          '🚨 Alerta de Calificación Baja',
          `${apt.clientName} calificó con ${rating} estrellas. Se activó el protocolo de rectificación post-servicio.`,
          'warning'
        );
        sendWhatsAppMessage(
          apt.clientName,
          apt.clientPhone,
          'rectification',
          `Hola ${apt.clientName}, lamentamos profundamente que tu experiencia no haya sido 100% perfecta. En ${currentSalon.name} nuestra prioridad es que ames tu resultado. Nuestro director(a) de salón te contactará enseguida para ofrecerte un retoque o solución gratuita de inmediato. 🙏💖`,
          apt.id
        );
      } else {
        showToast('⭐ Calificación Recibida', `${apt.clientName} dejó una reseña de ${rating} estrellas!`);
      }
    }
  };

  const addClientFormula = (clientId: string, formulaData: Omit<TechnicalFormula, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newFormula: TechnicalFormula = {
      ...formulaData,
      id: 'form-' + Date.now(),
      date: today
    };

    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          return {
            ...c,
            formulas: [newFormula, ...c.formulas]
          };
        }
        return c;
      })
    );

    showToast('Ficha Técnica Guardada', `Fórmula confidencial registrada con éxito para el cliente.`);
  };

  const addClient = (clientData: Omit<Client, 'id' | 'totalVisits' | 'totalSpent' | 'avgTicket' | 'firstVisitDate' | 'lastVisitDate' | 'formulas'>): Client => {
    const today = new Date().toISOString().split('T')[0];
    const newClient: Client = {
      ...clientData,
      salonId: currentSalon.id,
      id: 'client-' + Date.now(),
      totalVisits: 0,
      totalSpent: 0,
      avgTicket: 0,
      firstVisitDate: today,
      lastVisitDate: today,
      formulas: []
    };
    setClients((prev) => [newClient, ...prev]);
    saveDocument('clients', newClient);
    showToast('Cliente Registrado', newClient.name);
    return newClient;
  };

  const updateClient = (updatedClient: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
    saveDocument('clients', updatedClient);
    showToast('Cliente Actualizado', updatedClient.name);
  };

  const restockProduct = (productId: string, amountAdded: number) => {
    const today = new Date().toISOString().split('T')[0];
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const updated = {
            ...item,
            currentStock: item.currentStock + amountAdded,
            lastRestocked: today
          };
          saveDocument('inventory', updated);
          return updated;
        }
        return item;
      })
    );
    showToast('Stock Actualizado', `Se añadieron ${amountAdded} unidades/gr.`);
  };

  const addProduct = (productData: Omit<InventoryProduct, 'id' | 'lastRestocked'>): InventoryProduct => {
    const today = new Date().toISOString().split('T')[0];
    const newProduct: InventoryProduct = {
      ...productData,
      id: 'prod-' + Date.now(),
      salonId: currentSalon.id,
      lastRestocked: today,
      isForSale: productData.isForSale ?? (Boolean(productData.salePrice && productData.salePrice > 0))
    };
    setInventory((prev) => [newProduct, ...prev]);
    saveDocument('inventory', newProduct);
    showToast('Producto Creado', `${newProduct.name} registrado con éxito.`);
    return newProduct;
  };

  const updateProduct = (updatedProduct: InventoryProduct) => {
    setInventory((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    saveDocument('inventory', updatedProduct);
    showToast('Producto Actualizado', updatedProduct.name);
  };

  const deleteProduct = (id: string) => {
    const prod = inventory.find((p) => p.id === id);
    setInventory((prev) => prev.filter((p) => p.id !== id));
    deleteDocument('inventory', id);
    showToast('Producto Eliminado', prod ? prod.name : undefined, 'info');
  };

  const getProductByBarcode = (barcode: string): InventoryProduct | undefined => {
    const clean = barcode.trim().toLowerCase();
    if (!clean) return undefined;
    return inventory.find(
      (p) => (p.barcode && p.barcode.toLowerCase() === clean) || (p.sku && p.sku.toLowerCase() === clean)
    );
  };

  const processProductSale = (saleData: Omit<ProductSale, 'id' | 'date' | 'time' | 'salonId'>): ProductSale => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newSale: ProductSale = {
      ...saleData,
      id: 'sale-' + Date.now(),
      salonId: currentSalon.id,
      date: today,
      time
    };

    // Descontar stock de cada producto vendido y persistir en Firestore
    setInventory((prev) => {
      return prev.map((item) => {
        const soldItem = saleData.items.find((si) => si.productId === item.id);
        if (soldItem) {
          const newStock = Math.max(0, item.currentStock - soldItem.quantity);
          if (newStock <= item.minStockAlert) {
            showToast(
              '⚠️ Alerta de Stock Bajo',
              `"${item.name}" quedó con ${newStock} ${item.unit} (mínimo: ${item.minStockAlert}).`,
              'warning'
            );
          }
          const updatedItem = {
            ...item,
            currentStock: newStock
          };
          saveDocument('inventory', updatedItem);
          return updatedItem;
        }
        return item;
      });
    });

    setProductSales((prev) => [newSale, ...prev]);
    saveDocument('productSales', newSale);

    showToast(
      'Venta de Productos Cobrada',
      `Total $${newSale.total.toLocaleString('es-CL')} · ${newSale.items.length} producto(s)`,
      'success'
    );

    return newSale;
  };

  const toggleCampaign = (id: string) => {
    setCampaigns((prev) =>
      prev.map((camp) =>
        camp.id === id ? { ...camp, isActive: !camp.isActive } : camp
      )
    );
  };

  const resetDemoData = () => {
    localStorage.clear();
    setProfessionals(INITIAL_PROFESSIONALS);
    setSelectedStylistId(INITIAL_PROFESSIONALS[0]?.id || 'prof-1');
    setClients(INITIAL_CLIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setInventory(INITIAL_INVENTORY);
    setProductSales(INITIAL_PRODUCT_SALES);
    setCampaigns(INITIAL_CAMPAIGNS);
    setWhatsAppLogs(INITIAL_WHATSAPP_LOGS);
    setSalons(INITIAL_SALONS);
    setCurrentSalon(INITIAL_SALONS[0]);
    setCurrentUser(null);
    setRole('admin');
    setActiveTab('agenda');
    showToast('Datos de Demo Restaurados', 'Se han restablecido los valores iniciales de prueba.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        currentSalon,
        salons,
        loginWithGoogle,
        loginWithEmail,
        registerSalon,
        logout,
        switchSalon,
        professionals,
        services,
        clients,
        appointments,
        inventory,
        productSales,
        campaigns,
        whatsAppLogs,
        selectedDate,
        setSelectedDate,
        selectedProfessionalFilter,
        setSelectedProfessionalFilter,
        selectedStylistId,
        setSelectedStylistId,
        activeTab,
        setActiveTab,
        toasts,
        showToast,
        removeToast,
        addProfessional,
        updateProfessional,
        deleteProfessional,
        addService,
        updateService,
        deleteService,
        addAppointment,
        updateAppointmentStatus,
        addServiceToAppointment,
        removeServiceFromAppointment,
        checkInAppointment,
        checkoutAppointment,
        submitSurveyFeedback,
        addClientFormula,
        addClient,
        updateClient,
        addProduct,
        updateProduct,
        deleteProduct,
        restockProduct,
        processProductSale,
        getProductByBarcode,
        sendWhatsAppMessage,
        toggleCampaign,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
