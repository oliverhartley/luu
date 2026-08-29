import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Scissors, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  Store, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  ArrowRight,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

export const AuthScreen: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
  const { 
    loginWithGoogle, 
    loginWithEmail, 
    registerSalon, 
    setRole,
    currentSalon 
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Sign In Fields
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Sign Up Fields
  const [salonName, setSalonName] = useState<string>('');
  const [ownerName, setOwnerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('+56 9 ');
  const [city, setCity] = useState<string>('Santiago, Chile');
  const [registerEmail, setRegisterEmail] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;
    loginWithEmail(loginEmail, loginPassword);
    if (onDismiss) onDismiss();
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!salonName.trim() || !ownerName.trim() || !registerEmail.trim()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    registerSalon(salonName, ownerName, registerEmail, registerPassword, phone, city);
    if (onDismiss) onDismiss();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="max-w-4xl w-full bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-brand-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Hero Brand Column */}
        <div className="md:w-5/12 bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-brand-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center space-x-2.5 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-roseGold flex items-center justify-center text-white shadow-lg">
                <Scissors className="w-5 h-5" />
              </div>
              <span className="font-serif text-3xl font-bold tracking-tight">
                luu<span className="text-brand-400">.</span>
              </span>
            </div>

            <Badge variant="luxury" className="bg-white/10 text-brand-200 border-white/20 mb-4">
              Multi-Salon SaaS
            </Badge>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
              El CRM inteligente que las mejores peluquerías eligen.
            </h2>

            <p className="text-xs text-charcoal-300 mt-4 leading-relaxed">
              Agenda multi-servicio, check-in express, recetario confidencial de tintes y marketing automatizado por WhatsApp.
            </p>
          </div>

          {/* Social Proof Quote */}
          <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
            <div className="flex items-center space-x-1 text-amber-300 text-xs mb-1">
              <span>⭐⭐⭐⭐⭐</span>
            </div>
            <p className="text-xs text-charcoal-200 italic">
              "Aumentamos la retención de clientas de tinte y manicura en un 40% en nuestro primer mes."
            </p>
            <p className="text-[11px] text-brand-300 font-semibold mt-2">
              — Valentina Morales · Master Colorista
            </p>
          </div>

          {/* Subtle Background Glow */}
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Right Form Card */}
        <div className="md:w-7/12 p-6 sm:p-10 flex flex-col justify-between">
          
          <div>
            {/* Top Switcher */}
            <div className="flex items-center p-1 bg-[#FAF7F2] rounded-2xl border border-brand-200/80 mb-6">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === 'signin'
                    ? 'bg-white text-charcoal-950 shadow-sm'
                    : 'text-charcoal-500 hover:text-charcoal-800'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === 'signup'
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'text-charcoal-500 hover:text-charcoal-800'
                }`}
              >
                + Registrar Mi Salón
              </button>
            </div>

            {/* Header Text */}
            <div className="mb-6">
              <h3 className="font-serif text-2xl font-bold text-charcoal-950">
                {mode === 'signin' ? '¡Bienvenido(a) de vuelta!' : 'Crea la cuenta para tu Salón'}
              </h3>
              <p className="text-xs text-charcoal-500 mt-1">
                {mode === 'signin'
                  ? 'Accede a la gestión de tu peluquería y agenda en tiempo real.'
                  : 'Empieza a digitalizar tu salón con look and feel moderno.'}
              </p>
            </div>

            {/* Google Social Login Button */}
            <button
              type="button"
              onClick={() => {
                loginWithGoogle();
                if (onDismiss) onDismiss();
              }}
              className="w-full py-3 px-4 rounded-2xl border border-brand-200/80 bg-white hover:bg-brand-50/50 shadow-sm text-xs sm:text-sm font-bold text-charcoal-800 flex items-center justify-center space-x-3 transition-all transform active:scale-[0.99]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
              <span>Continuar con Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="border-t border-brand-200/60 w-full" />
              <span className="bg-white px-3 text-[11px] text-charcoal-400 font-medium shrink-0">
                o con correo electrónico
              </span>
              <div className="border-t border-brand-200/60 w-full" />
            </div>

            {/* Sign In Form */}
            {mode === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="nombre@tusalon.cl"
                      className="pl-10 text-xs sm:text-sm bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 text-xs sm:text-sm bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center space-x-1.5 text-charcoal-600 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                    <span>Recordarme en este equipo</span>
                  </label>
                  <a href="#" className="font-semibold text-brand-600 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <Button type="submit" variant="luxury" size="lg" className="w-full mt-2">
                  <span>Iniciar Sesión en Mi Salón</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            ) : (
              /* Sign Up Form */
              <form onSubmit={handleSignUp} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Nombre de tu Peluquería / Salón *
                  </label>
                  <div className="relative">
                    <Store className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      type="text"
                      required
                      value={salonName}
                      onChange={(e) => setSalonName(e.target.value)}
                      placeholder="Ej. Studio Glow, Atelier Providencia"
                      className="pl-10 text-xs sm:text-sm bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-700 mb-1">
                      Tu Nombre (Dueño/a) *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        required
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="Ej. Francisca Valdés"
                        className="pl-10 text-xs sm:text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-700 mb-1">
                      WhatsApp Salón *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <Input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 text-xs sm:text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-700 mb-1">
                      Email de Acceso *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <Input
                        type="email"
                        required
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="contacto@tusalon.cl"
                        className="pl-10 text-xs sm:text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-700 mb-1">
                      Crear Contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <Input
                        type="password"
                        required
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="pl-10 text-xs sm:text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="luxury" size="lg" className="w-full mt-2">
                  <span>Registrar Salón & Comenzar Gratis</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            )}
          </div>

          {/* Quick Demo Logins for Fast Demonstrations in Hair Salons */}
          <div className="mt-6 pt-4 border-t border-brand-100/80 bg-[#FAF7F2] p-3 rounded-2xl">
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 mb-2 text-center">
              ⚡ Accesos Rápidos de Prueba (Demo)
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  loginWithEmail('oliver.hartley@gmail.com', 'admin');
                  if (onDismiss) onDismiss();
                }}
                className="w-full sm:w-auto px-3 py-1.5 text-xs font-semibold text-charcoal-700 bg-white hover:bg-brand-50 border border-brand-200 rounded-xl transition-all shadow-2xs"
              >
                Dueño: Oliver Hartley (luu. Vitacura)
              </button>
              <button
                type="button"
                onClick={() => {
                  loginWithEmail('valentina.morales@luu.cl', 'stylist');
                  if (onDismiss) onDismiss();
                }}
                className="w-full sm:w-auto px-3 py-1.5 text-xs font-semibold text-brand-800 bg-brand-100/60 hover:bg-brand-100 border border-brand-200 rounded-xl transition-all shadow-2xs"
              >
                Estilista: Valentina Morales
              </button>
            </div>
          </div>

          {/* Client Portal Link for visiting clients */}
          <div className="mt-4 pt-3 border-t border-brand-100/60 text-center">
            <button
              type="button"
              onClick={() => {
                setRole('client');
                if (onDismiss) onDismiss();
              }}
              className="text-xs font-medium text-brand-700 hover:text-brand-900 transition-colors inline-flex items-center space-x-1"
            >
              <span>¿Eres clienta y buscas reservar hora?</span>
              <span className="font-bold underline ml-1">Ir al Portal de Reservas →</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
