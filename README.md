# 🌸 Pelu · CRM & Plataforma de Gestión para Salones de Belleza

Sistema integral y moderno de agendamiento, gestión operativa, fichas técnicas y fidelización automatizada para peluquerías, salones de manicura y estudios de belleza.

---

## 🚀 Características Principales

### 1. 📅 Agenda Multi-Servicio & Check-In
- **Reserva Combinada**: Permite agendar múltiples servicios y distintos profesionales en una sola visita (ej: Balayage con María + Manicura con Laura).
- **Check-In en Local**: Notifica instantáneamente la llegada del cliente a sala de espera.
- **Filtros por Profesional**: Visualización rápida por estilista o visión global del salón.

### 2. 🎨 Fichas Técnicas & Recetario Confidencial
- **Colorimetría**: Registro exacto de proporciones (gramos de base, reflejos, volúmenes de oxidante, tiempo de exposición).
- **Manicura & Nail Art**: Marca y código de esmalte, base rubber, técnicas de diseño.
- **Privacidad Configurable**: Flag de confidencialidad para proteger las fórmulas exclusivas de cada profesional.
- **Galería Fotográfica**: Registro de resultados post-servicio.

### 3. 💳 Punto de Cobro & Cierre de Atención
- Cálculo automático de servicios, venta de productos retail, descuentos y propinas.
- Descuento automático de insumos del inventario técnico.
- **Encuesta de Satisfacción Post-Servicio**: Disparo automático de evaluación vía WhatsApp.
- **Protocolo de Rectificación**: Alerta inmediata ante calificaciones bajas para retener y solucionar inconvenientes con la clienta.

### 4. ✨ Motor de Fidelización & Simulador WhatsApp
- **Recordatorios por Ciclo de Servicio**:
  - Manicura permanente: 14 días.
  - Retoque de raíces: 25 días.
  - Corte y peinado: 45 días.
- **Campañas de Cumpleaños**: Cupones automáticos de descuento.
- **Recuperación de Clientes Inactivos**: Listado y mensaje personalizado a clientas sin visitas en +45 días.
- **Simulador Interactivo de WhatsApp**: Mockup de chat para probar y enviar mensajes en vivo.

### 5. 📦 Inventario Inteligente
- Control de stock de tintes (g), oxidantes (ml), tratamientos y esmaltes.
- Alertas de stock crítico y generador de órdenes de reposición a proveedores.

### 6. 📊 Analítica de Salón & KPIs
- Días y horas de mayor afluencia (peak hours).
- Ticket promedio por cliente y por estilista.
- Comisiones estimadas por profesional.

### 7. 📱 Portal de Auto-Reserva para Clientes (Mobile-First)
- Experiencia estética y fluida para que las clientas reserven directo desde Instagram o WhatsApp.

---

## 🛠️ Ejecución Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

La aplicación se abrirá en `http://localhost:3000`.

---

## ☁️ Guía de Despliegue en GCP a Costo $0

### Opción A: Firebase Hosting (Frontend PWA)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy --only hosting
```
*Costo: $0 (hasta 10 GB de almacenamiento y 360 MB/día de transferencia gratuita).*

### Opción B: Google Cloud Run (Backend / Fullstack)
```bash
gcloud run deploy pelu-crm --source . --region us-central1 --allow-unauthenticated
```
*Costo: Nivel gratuito de Cloud Run incluye 2 millones de peticiones mensuales gratis.*
