import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/ui/ToastContainer';
import { AgendaView } from './components/agenda/AgendaView';
import { AppointmentModal } from './components/agenda/AppointmentModal';
import { ClientsList } from './components/clients/ClientsList';
import { ClientProfileModal } from './components/clients/ClientProfileModal';
import { FormulaEditorModal } from './components/clients/FormulaEditorModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { MarketingHub } from './components/marketing/MarketingHub';
import { WhatsAppSimulator } from './components/marketing/WhatsAppSimulator';
import { InventoryList } from './components/inventory/InventoryList';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { ClientBookingApp } from './components/client-portal/ClientBookingApp';
import { CommandPalette } from './components/command/CommandPalette';
import { ColorRatioCalculatorModal } from './components/tools/ColorRatioCalculatorModal';
import { BeforeAfterSliderModal } from './components/tools/BeforeAfterSliderModal';
import { BeautyPassModal } from './components/clients/BeautyPassModal';
import { SalonFloorPlan } from './components/salon-floor/SalonFloorPlan';
import { ServicesManager } from './components/services/ServicesManager';
import { StylistsManager } from './components/stylists/StylistsManager';
import { AuthScreen } from './components/auth/AuthScreen';
import { OnboardingWizardModal } from './components/onboarding/OnboardingWizardModal';
import { Appointment, Client } from './types';

export const App: React.FC = () => {
  const { role, activeTab, currentUser } = useApp();

  // Modals state
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState<boolean>(false);
  const [checkoutTargetAppointment, setCheckoutTargetAppointment] = useState<Appointment | null>(null);
  const [profileTargetClientId, setProfileTargetClientId] = useState<string | null>(null);
  const [formulaTargetClientId, setFormulaTargetClientId] = useState<string | null>(null);
  const [beautyPassClient, setBeautyPassClient] = useState<Client | null>(null);
  const [isWhatsAppSimulatorOpen, setIsWhatsAppSimulatorOpen] = useState<boolean>(false);
  const [whatsAppTargetPhone, setWhatsAppTargetPhone] = useState<string | undefined>(undefined);
  const [isColorCalculatorOpen, setIsColorCalculatorOpen] = useState<boolean>(false);
  const [isBeforeAfterOpen, setIsBeforeAfterOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // If Client self-booking role is active, render customer booking view
  if (role === 'client') {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        <ClientBookingApp />
        <ToastContainer />
      </div>
    );
  }

  // If user is logged out, show the full Auth Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        <AuthScreen />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-100 selection:text-brand-800">
      
      {/* Top Navigation */}
      <Navbar
        onOpenNewAppointmentModal={() => setIsNewAppointmentOpen(true)}
        onOpenWhatsAppSimulator={() => {
          setWhatsAppTargetPhone(undefined);
          setIsWhatsAppSimulatorOpen(true);
        }}
        onOpenColorCalculator={() => setIsColorCalculatorOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenBeforeAfterSlider={() => setIsBeforeAfterOpen(true)}
        onOpenAuthScreen={() => setIsAuthModalOpen(true)}
      />

      {/* Main Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 lg:pb-8">
        
        {/* Left Sidebar */}
        <Sidebar />

        {/* Dynamic Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'agenda' && (
            <AgendaView
              onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
              onOpenCheckout={(apt) => setCheckoutTargetAppointment(apt)}
              onViewClientProfile={(clientId) => setProfileTargetClientId(clientId)}
              onOpenWhatsAppForAppointment={(apt) => {
                setWhatsAppTargetPhone(apt.clientPhone);
                setIsWhatsAppSimulatorOpen(true);
              }}
            />
          )}

          {activeTab === 'stylists' && (
            <StylistsManager
              onOpenCheckout={(apt) => setCheckoutTargetAppointment(apt)}
              onViewClientProfile={(clientId) => setProfileTargetClientId(clientId)}
              onOpenWhatsAppForAppointment={(apt) => {
                setWhatsAppTargetPhone(apt.clientPhone);
                setIsWhatsAppSimulatorOpen(true);
              }}
            />
          )}

          {activeTab === 'floorplan' && (
            <SalonFloorPlan
              onOpenAppointmentDetails={(clientName) => {
                setProfileTargetClientId('client-1');
              }}
            />
          )}

          {activeTab === 'clients' && (
            <ClientsList
              onViewClientProfile={(clientId) => setProfileTargetClientId(clientId)}
              onOpenNewFormula={(clientId) => setFormulaTargetClientId(clientId)}
              onOpenBeautyPass={(client) => setBeautyPassClient(client)}
            />
          )}

          {activeTab === 'services' && <ServicesManager />}

          {activeTab === 'marketing' && (
            <MarketingHub
              onOpenWhatsAppSimulator={(phone) => {
                setWhatsAppTargetPhone(phone);
                setIsWhatsAppSimulatorOpen(true);
              }}
            />
          )}

          {activeTab === 'inventory' && <InventoryList />}

          {activeTab === 'analytics' && <AnalyticsDashboard />}
        </main>
      </div>

      {/* Global Modals & Tools */}
      <AppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
      />

      <CheckoutModal
        appointment={checkoutTargetAppointment}
        isOpen={!!checkoutTargetAppointment}
        onClose={() => setCheckoutTargetAppointment(null)}
      />

      <ClientProfileModal
        clientId={profileTargetClientId}
        onClose={() => setProfileTargetClientId(null)}
        onOpenNewFormula={(cid) => {
          setProfileTargetClientId(null);
          setFormulaTargetClientId(cid);
        }}
      />

      <FormulaEditorModal
        clientId={formulaTargetClientId}
        isOpen={!!formulaTargetClientId}
        onClose={() => setFormulaTargetClientId(null)}
      />

      <BeautyPassModal
        client={beautyPassClient}
        isOpen={!!beautyPassClient}
        onClose={() => setBeautyPassClient(null)}
      />

      <WhatsAppSimulator
        isOpen={isWhatsAppSimulatorOpen}
        onClose={() => setIsWhatsAppSimulatorOpen(false)}
        targetClientPhone={whatsAppTargetPhone}
      />

      <ColorRatioCalculatorModal
        isOpen={isColorCalculatorOpen}
        onClose={() => setIsColorCalculatorOpen(false)}
      />

      <BeforeAfterSliderModal
        isOpen={isBeforeAfterOpen}
        onClose={() => setIsBeforeAfterOpen(false)}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
        onOpenColorCalculator={() => setIsColorCalculatorOpen(true)}
        onOpenWhatsAppSimulator={() => {
          setWhatsAppTargetPhone(undefined);
          setIsWhatsAppSimulatorOpen(true);
        }}
        onViewClientProfile={(cid) => setProfileTargetClientId(cid)}
      />

      {/* Auth Modal if opened from top navbar */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 text-charcoal-500 hover:text-charcoal-900 bg-white/80 rounded-full"
            >
              ✕
            </button>
            <AuthScreen onDismiss={() => setIsAuthModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Onboarding Wizard Modal */}
      <OnboardingWizardModal />

      {/* Toast feedback messages */}
      <ToastContainer />

    </div>
  );
};
