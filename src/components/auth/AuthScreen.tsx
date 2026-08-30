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
    showToast,
    currentSalon 
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Google Connected state (if user authenticated with Google but needs to register salon)
  const [googleConnectedUser, setGoogleConnectedUser] = useState<{
    uid: string;
    email: string;
    name: string;
    avatar?: string;
  } | null>(null);

  // Google Fallback Prompt modal state
  const [isGooglePromptOpen, setIsGooglePromptOpen] = useState<boolean>(false);
  const [fallbackEmail, setFallbackEmail] = useState<string>('');
  const [fallbackName, setFallbackName] = useState<string>('');

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

  const handleGoogleSignIn = async (emailOverride?: string, nameOverride?: string) => {
    setLoading(true);
    const res = await loginWithGoogle(emailOverride, nameOverride);
    setLoading(false);

    if (res.status === 'logged_in') {
      if (onDismiss) onDismiss();
      return;
    }

    if (res.status === 'needs_registration') {
      setMode('signup');
      if (res.googleUser) {
        setOwnerName(res.googleUser.name);
        setRegisterEmail(res.googleUser.email);
        setGoogleConnectedUser(res.googleUser);
      }
      showToast(
        'Cuenta de Google Conectada',
        'No encontramos un salón registrado con este correo. ¡Crea el nombre de tu salón para comenzar!',
        'info'
      );
      return;
    }

    if (res.status === 'fallback_required') {
      setIsGooglePromptOpen(true);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;
    setLoading(true);
    const success = await loginWithEmail(loginEmail, loginPassword);
    setLoading(false);
    if (success && onDismiss) onDismiss();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salonName.trim() || !ownerName.trim() || !registerEmail.trim()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    setLoading(true);
    const isGoogle = !!googleConnectedUser;
    const pwd = registerPassword || (isGoogle ? 'google-auth-verified' : '123456');
    await registerSalon(salonName, ownerName, registerEmail, pwd, phone, city, isGoogle);
    setLoading(false);
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
              disabled={loading}
              onClick={() => handleGoogleSignIn()}
              className="w-full py-3 px-4 rounded-2xl border border-brand-200/80 bg-white hover:bg-brand-50/50 shadow-sm text-xs sm:text-sm font-bold text-charcoal-800 flex items-center justify-center space-x-3 transition-all transform active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              ) : (
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
              )}
              <span>
                {loading
                  ? 'Conectando con Google...'
                  : mode === 'signup'
                    ? 'Completar Registro con Google'
                    : 'Continuar con Google'}
              </span>
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

                <Button type="submit" variant="luxury" size="lg" className="w-full mt-2" disabled={loading}>
                  <span>{loading ? 'Iniciando sesión...' : 'Iniciar Sesión en Mi Salón'}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            ) : (
              /* Sign Up Form */
              <form onSubmit={handleSignUp} className="space-y-3">
                {googleConnectedUser && (
                  <div className="p-3 bg-brand-50/80 border border-brand-200 rounded-2xl flex items-start space-x-3 mb-2 animate-fade-in">
                    <div className="w-9 h-9 rounded-xl bg-white border border-brand-200 flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z" />
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center space-x-1.5 mb-0.5">
                        <span className="font-bold text-brand-900">Cuenta Google Conectada</span>
                        <Badge variant="luxury" className="text-[9px] px-1.5 py-0">Verificada</Badge>
                      </div>
                      <p className="text-charcoal-700 font-medium truncate">
                        {googleConnectedUser.name} · {googleConnectedUser.email}
                      </p>
                      <p className="text-[11px] text-charcoal-500 mt-0.5">
                        No encontramos un salón registrado para este correo. Completa el nombre de tu salón para crear tu cuenta.
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Nombre de tu Peluquería / Salón *
                  </label>
                  <div className="relative">
                    <Store className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      type="text"
                      required
                      autoFocus={!!googleConnectedUser}
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
                      {googleConnectedUser ? 'Autenticación' : 'Crear Contraseña *'}
                    </label>
                    {googleConnectedUser ? (
                      <div className="flex items-center space-x-2 px-3 py-2 bg-brand-50 border border-brand-200 rounded-xl text-xs text-brand-800 font-medium h-9 sm:h-10">
                        <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
                        <span className="truncate">Autenticado vía Google</span>
                      </div>
                    ) : (
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
                    )}
                  </div>
                </div>

                <Button type="submit" variant="luxury" size="lg" className="w-full mt-2" disabled={loading}>
                  <span>{loading ? 'Creando tu cuenta...' : 'Crear Salón y Configurar en el Wizard →'}</span>
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
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  loginWithEmail('oliver@harliz.com', '123456');
                  if (onDismiss) onDismiss();
                }}
                className="w-full px-2.5 py-2 text-xs font-semibold text-brand-900 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-xl transition-all shadow-2xs text-left truncate"
                title="Acceso especial con eliminación de cuenta habilitada"
              >
                <span className="block font-bold truncate">👤 oliver@harliz.com</span>
                <span className="text-[10px] text-brand-600 block">Con botón eliminar</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  loginWithEmail('fran@harliz.com', '123456');
                  if (onDismiss) onDismiss();
                }}
                className="w-full px-2.5 py-2 text-xs font-semibold text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all shadow-2xs text-left truncate"
                title="Acceso especial con eliminación de cuenta habilitada"
              >
                <span className="block font-bold truncate">👤 fran@harliz.com</span>
                <span className="text-[10px] text-rose-600 block">Con botón eliminar</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  loginWithEmail('oliver.hartley@gmail.com', 'admin');
                  if (onDismiss) onDismiss();
                }}
                className="w-full px-2.5 py-2 text-xs font-semibold text-charcoal-700 bg-white hover:bg-brand-50 border border-brand-200 rounded-xl transition-all shadow-2xs text-left truncate"
              >
                <span className="block font-bold truncate">Dueño Demo</span>
                <span className="text-[10px] text-charcoal-500 block truncate">oliver.hartley@gmail.com</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  loginWithEmail('valentina.morales@luu.cl', 'stylist');
                  if (onDismiss) onDismiss();
                }}
                className="w-full px-2.5 py-2 text-xs font-semibold text-charcoal-700 bg-white hover:bg-brand-50 border border-brand-200 rounded-xl transition-all shadow-2xs text-left truncate"
              >
                <span className="block font-bold truncate">Estilista</span>
                <span className="text-[10px] text-charcoal-500 block truncate">valentina.morales@luu.cl</span>
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

      {/* Google Account Fallback Dialog (seamless fallback if popup is not configured or blocked) */}
      {isGooglePromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-brand-200 relative">
            <button
              type="button"
              onClick={() => setIsGooglePromptOpen(false)}
              className="absolute top-4 right-4 p-1 text-charcoal-400 hover:text-charcoal-700 rounded-full"
            >
              ✕
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center shadow-xs shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                </svg>
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-charcoal-950">Acceso con Google</h4>
                <p className="text-xs text-charcoal-500">Ingresa tu cuenta de Google para verificar tu salón o registrarlo</p>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!fallbackEmail.trim()) return;
              setIsGooglePromptOpen(false);
              handleGoogleSignIn(fallbackEmail.trim(), fallbackName.trim());
            }} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Correo Electrónico de Google *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="email"
                    required
                    value={fallbackEmail}
                    onChange={(e) => setFallbackEmail(e.target.value)}
                    placeholder="nombre@gmail.com"
                    className="pl-10 text-xs sm:text-sm bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Tu Nombre (opcional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    value={fallbackName}
                    onChange={(e) => setFallbackName(e.target.value)}
                    placeholder="Ej. Oliver Hartley"
                    className="pl-10 text-xs sm:text-sm bg-white"
                  />
                </div>
              </div>

              <Button type="submit" variant="luxury" size="default" className="w-full mt-2" disabled={loading}>
                <span>Continuar con esta Cuenta</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>

              <div className="pt-2.5 border-t border-brand-100">
                <p className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider mb-2">
                  ⚡ O selecciona acceso rápido:
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsGooglePromptOpen(false);
                    handleGoogleSignIn('oliver.hartley@gmail.com', 'Oliver Hartley');
                  }}
                  className="w-full py-2 px-3 rounded-xl border border-brand-200 bg-brand-50/70 hover:bg-brand-100/70 text-xs font-semibold text-brand-900 text-left transition-all flex items-center justify-between"
                >
                  <span>Oliver Hartley (oliver.hartley@gmail.com)</span>
                  <span className="text-[10px] text-brand-600 bg-white px-2 py-0.5 rounded-md border border-brand-200">luu. Vitacura</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
