/**
 * Utilidades para integración directa con WhatsApp Web / WhatsApp App (wa.me)
 */

/**
 * Normaliza cualquier formato de teléfono (+56 9 8123 4567, 981234567, etc.)
 * a formato internacional E.164 sin '+' para wa.me (ej: 56981234567).
 */
export function cleanWhatsAppNumber(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, '');
  // Si empieza con 9 y tiene 9 dígitos (formato estándar móvil chileno 9XXXXXXXX), agregamos 56
  if (cleaned.length === 9 && cleaned.startsWith('9')) {
    cleaned = `56${cleaned}`;
  }
  return cleaned;
}

/**
 * Genera la URL oficial de wa.me / WhatsApp Web con mensaje codificado
 */
export function getWhatsAppUrl(phone: string, message?: string): string {
  const cleaned = cleanWhatsAppNumber(phone);
  const base = cleaned ? `https://wa.me/${cleaned}` : 'https://wa.me/';
  if (message && message.trim()) {
    return `${base}?text=${encodeURIComponent(message.trim())}`;
  }
  return base;
}

/**
 * Abre WhatsApp Web o la App de WhatsApp en una pestaña nueva con el mensaje precargado
 */
export function openWhatsApp(phone: string, message?: string): void {
  const url = getWhatsAppUrl(phone, message);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Genera el enlace único para la encuesta post-servicio (+2h)
 */
export function getSurveyUrl(appointmentId: string): string {
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.origin}/?feedback=${appointmentId}`;
  }
  return `https://luu.cl/?feedback=${appointmentId}`;
}

/**
 * Plantillas predefinidas para mensajería directa
 */
export const WhatsAppTemplates = {
  /** Mensaje para compartir el VIP Beauty Pass */
  beautyPass: (clientName: string, salonName: string, passUrl: string): string =>
    `¡Hola ${clientName.split(' ')[0]}! ✨ Te compartimos tu Beauty Pass VIP de *${salonName}*. Puedes revisar tus visitas, beneficios y puntos acumulados aquí: ${passUrl}`,

  /** Recordatorio de Cita */
  appointmentReminder: (
    clientName: string,
    salonName: string,
    date: string,
    time: string,
    serviceName: string,
    professionalName: string
  ): string =>
    `¡Hola ${clientName.split(' ')[0]}! ✨ Te recordamos tu cita en *${salonName}*:\n\n📅 Fecha: ${date}\n⏰ Hora: ${time}\n💆‍♀️ Servicio: ${serviceName}\n💇‍♀️ Estilista: ${professionalName}\n\nSi necesitas reagendar, por favor avísanos con anticipación. ¡Te esperamos!`,

  /** Encuesta de Satisfacción tradicional */
  survey: (clientName: string, salonName: string, professionalName: string): string =>
    `✨ *¿Cómo estuvo tu experiencia en ${salonName}?*\n\nHola ${clientName.split(' ')[0]}, gracias por visitarnos hoy para tu atención con ${professionalName}. ¿Podrías calificarnos del 1 al 5 ⭐? Tu opinión nos ayuda a brindarte siempre lo mejor.`,

  /** Encuesta Post-Servicio (+2 Horas) con Link Único y Garantía de Retoque */
  postServiceSurvey: (
    clientName: string,
    salonName: string,
    serviceName: string,
    surveyUrl: string
  ): string =>
    `¡Hola ${clientName.split(' ')[0]}! ✨ Esperamos que estés disfrutando tu día tras visitarnos en *${salonName}* 💕\n\nQueremos asegurarnos de que estés 100% feliz con tu atención de *${serviceName}*. ¿Te encantó tu resultado o hay algún detalle que quieras cambiar o retocar?\n\nTu satisfacción es nuestra prioridad: si algo no quedó exactamente como soñabas, ¡lo solucionamos de inmediato sin costo!\n\n👉 Cuéntanos aquí en 30 segundos:\n${surveyUrl}`,

  /** Coordinación de Retoque Inmediato (Protocolo de Rescate) */
  retouchCoordination: (
    clientName: string,
    salonName: string,
    retouchDetail: string
  ): string =>
    `¡Hola ${clientName.split(' ')[0]}! 💕 Vimos tus comentarios en la encuesta post-servicio sobre tu atención en *${salonName}* (${retouchDetail}).\n\nEn nuestro salón tu felicidad está garantizada: queremos coordinar contigo una cita prioritaria de retoque totalmente gratuita para dejarlo exactamente como te gusta. ¿Qué día y horario te acomoda mejor? 🌸✨`,

  /** Saludo genérico para chat */
  greeting: (clientName: string, salonName: string): string =>
    `¡Hola ${clientName.split(' ')[0]}! Te escribimos desde *${salonName}*. ¿En qué podemos ayudarte hoy?`,

  /** Pedido de reposición a proveedores */
  supplierOrder: (
    salonName: string,
    items: { name: string; brand: string; currentStock: number; minStockAlert: number; unit: string }[]
  ): string => {
    const list = items
      .map(
        (item, index) =>
          `${index + 1}. *${item.name}* (${item.brand})\n   • Stock actual: ${item.currentStock} ${item.unit} (Mínimo: ${item.minStockAlert} ${item.unit})`
      )
      .join('\n\n');
    return `📦 *Orden de Reposición de Insumos - ${salonName}*\n\nHola! Necesitamos solicitar reposición de los siguientes productos con stock bajo:\n\n${list}\n\nQuedamos atentos a confirmación de despacho y costo. ¡Muchas gracias!`;
  }
};
