import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Professional, 
  Service, 
  Client, 
  Appointment, 
  InventoryProduct, 
  MarketingCampaign, 
  WhatsAppMessageSimulation, 
  UserRole,
  TechnicalFormula,
  AppointmentStatus
} from '../types';
import { 
  INITIAL_PROFESSIONALS, 
  INITIAL_SERVICES, 
  INITIAL_CLIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_INVENTORY, 
  INITIAL_CAMPAIGNS, 
  INITIAL_WHATSAPP_LOGS 
} from '../data/mockData';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  professionals: Professional[];
  services: Service[];
  clients: Client[];
  appointments: Appointment[];
  inventory: InventoryProduct[];
  campaigns: MarketingCampaign[];
  whatsAppLogs: WhatsAppMessageSimulation[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedProfessionalFilter: string | 'all';
  setSelectedProfessionalFilter: (id: string | 'all') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toasts: Toast[];
  showToast: (title: string, message?: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  
  // Actions
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  checkInAppointment: (id: string) => void;
  checkoutAppointment: (id: string, details: Appointment['checkoutDetails']) => void;
  submitSurveyFeedback: (appointmentId: string, rating: number, comment?: string) => void;
  addClientFormula: (clientId: string, formula: Omit<TechnicalFormula, 'id' | 'date'>) => void;
  addClient: (client: Omit<Client, 'id' | 'totalVisits' | 'totalSpent' | 'avgTicket' | 'firstVisitDate' | 'lastVisitDate' | 'formulas'>) => Client;
  updateClient: (client: Client) => void;
  restockProduct: (productId: string, amountAdded: number) => void;
  sendWhatsAppMessage: (toName: string, toPhone: string, type: WhatsAppMessageSimulation['type'], message: string, appointmentId?: string) => void;
  toggleCampaign: (id: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or mock data
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('pelu_role') as UserRole) || 'admin';
  });

  const [professionals] = useState<Professional[]>(INITIAL_PROFESSIONALS);
  const [services] = useState<Service[]>(INITIAL_SERVICES);

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
    localStorage.setItem('pelu_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('pelu_whatsapp_logs', JSON.stringify(whatsAppLogs));
  }, [whatsAppLogs]);

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
      id
    };
    setAppointments((prev) => [newApt, ...prev]);

    // Send WhatsApp confirmation simulation
    const servicesList = newApt.items.map((i) => `• ${i.serviceName} con ${i.professionalName}`).join('\n');
    sendWhatsAppMessage(
      newApt.clientName,
      newApt.clientPhone,
      'reminder',
      `🌸 *Reserva Confirmada en Pelu*\n\n¡Hola ${newApt.clientName}!\nTu cita para el *${newApt.date}* a las *${newApt.startTime}* ha sido confirmada con éxito.\n\n*Tus Servicios:*\n${servicesList}\n\n*Total estimado:* $${newApt.totalPrice.toLocaleString('es-CL')}\n\n¡Te esperamos en nuestro salón!`,
      newApt.id
    );

    showToast('Cita agendada con éxito', `${newApt.clientName} - ${newApt.startTime} hrs`);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
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
            `🛎️ *¡Check-In Confirmado en Pelu!*\n\nHola ${apt.clientName}, ya registramos tu llegada a las ${timeStr} hrs. ${profNames} ya fue avisada y pasará por ti a la sala de recepción en un momento. ¡Disfruta un café o té de cortesía! ☕✨`,
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
      `✨ *¿Cómo fue tu experiencia hoy en Pelu?*\n\nHola ${apt.clientName}, fue un placer atenderte. Para nosotras es fundamental saber qué te pareció tu visita de hoy con ${apt.items.map((i) => i.professionalName).join(', ')}.\n\nPor favor califícanos del 1 al 5 estrellas ⭐ respondiendo este mensaje o tocando en tu enlace personalizado de feedback.`,
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
          `Hola ${apt.clientName}, lamentamos profundamente que tu experiencia no haya sido 100% perfecta. En Pelu nuestra prioridad es que ames tu resultado. Nuestro director(a) de salón te contactará enseguida para ofrecerte un retoque o solución gratuita de inmediato. 🙏💖`,
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
      id: 'client-' + Date.now(),
      totalVisits: 0,
      totalSpent: 0,
      avgTicket: 0,
      firstVisitDate: today,
      lastVisitDate: today,
      formulas: []
    };
    setClients((prev) => [newClient, ...prev]);
    showToast('Cliente Registrado', newClient.name);
    return newClient;
  };

  const updateClient = (updatedClient: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
    showToast('Cliente Actualizado', updatedClient.name);
  };

  const restockProduct = (productId: string, amountAdded: number) => {
    const today = new Date().toISOString().split('T')[0];
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            currentStock: item.currentStock + amountAdded,
            lastRestocked: today
          };
        }
        return item;
      })
    );
    showToast('Stock Actualizado', `Se añadieron ${amountAdded} unidades/gr.`);
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
    setClients(INITIAL_CLIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setInventory(INITIAL_INVENTORY);
    setCampaigns(INITIAL_CAMPAIGNS);
    setWhatsAppLogs(INITIAL_WHATSAPP_LOGS);
    showToast('Datos de Demo Restaurados', 'Se han restablecido los valores iniciales de prueba.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        professionals,
        services,
        clients,
        appointments,
        inventory,
        campaigns,
        whatsAppLogs,
        selectedDate,
        setSelectedDate,
        selectedProfessionalFilter,
        setSelectedProfessionalFilter,
        activeTab,
        setActiveTab,
        toasts,
        showToast,
        removeToast,
        addAppointment,
        updateAppointmentStatus,
        checkInAppointment,
        checkoutAppointment,
        submitSurveyFeedback,
        addClientFormula,
        addClient,
        updateClient,
        restockProduct,
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
