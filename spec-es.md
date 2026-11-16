# 🌸 Luu (Pelu) — Especificación del Producto (SPEC-es.md)

## 1. Visión General del Producto
**Luu** (internamente `pelu-crm`) es una plataforma SaaS multi-inquilino de gestión y CRM diseñada para peluquerías, salones de manicura, barberías y estudios de belleza.

### Propuesta de Valor Central
- **Dueños de Salón / Administradores:** Optimiza las operaciones de recepción, previene solapamientos de citas, automatiza el control de inventario y liquida comisiones de estilistas con mínima fricción.
- **Estilistas / Profesionales:** Acceso móvil a puestos de trabajo, visualización de agenda, historial de clientes, fichas técnicas (colorimetría/nail art) y recetario confidencial protegido.
- **Clientes:** Enlace de auto-reserva ágil y adaptado a móviles (vía Instagram / WhatsApp), confirmación automática de citas, historial de servicios y encuestas de satisfacción post-atención.

---

## 2. Actores y Permisos Basados en Roles (RBAC)

| Rol | Alcance | Permisos y Límites de Acceso |
| :--- | :--- | :--- |
| `admin` (Dueño/Administrador) | Todo el salón (`salonId`) | Control total sobre configuración del salón, estilistas, puestos, catálogo de servicios, reportes financieros, reposición de inventario y punto de cobro (POS). |
| `stylist` (Profesional) | Puesto asignado / cartera personal de clientes | Visualizar citas asignadas, gestionar estado del puesto (`ready`, `occupied`, `sanitizing`), crear/editar fichas técnicas y fórmulas, consultar comisiones personales acumuladas. Sin acceso a finanzas globales del salón ni ajustes generales. |
| `client` | Solo datos propios | Reservar citas mediante enlace público, consultar citas pasadas y futuras, responder encuestas de satisfacción. Cero acceso a puestos internos ni notas privadas del salón. |

---

## 3. Módulos Funcionales y Reglas de Negocio

### 3.1 Gestión de Planta y Puestos de Trabajo (Salon Floor)
- **Categorías de Puesto:** `hair_color`, `hair_cut`, `wash_spa`, `nails`, `lashes`, `general`.
- **Ciclo de Vida del Puesto:**
  $$\text{ready (disponible)} \longrightarrow \text{occupied (ocupado)} \longrightarrow \text{sanitizing (desinfección)} \longrightarrow \text{ready (disponible)}$$
- **Rotación de Sillón:** Control de `timeRemainingMinutes` para clientes en atención.
- **Asignación de Estilistas:** Los puestos pueden asignarse de forma fija o dinámica a cada profesional.

### 3.2 Agenda Multi-Servicio y Check-in en Local
- **Reservas Combinadas:** Permite agendar múltiples servicios con distintos profesionales en una sola visita (ej: Balayage con María + Manicura con Laura).
- **Check-in en Recepción:** Recepción marca la llegada de la clienta, notificando al estilista y ubicándola en la cola digital de sala de espera.
- **Prevención de Solapamientos:** Un estilista no puede tener citas superpuestas a menos que se configure atención en paralelo (ej: tiempo de exposición de color mientras atiende otro servicio rápido).

### 3.3 Fichas Técnicas y Recetario Confidencial
- **Colorimetría:** Registro de medidas exactas (gramos de base, código de tono, volúmenes de oxidante, tiempo de exposición).
- **Manicura y Nail Art:** Código de esmalte, base rubber aplicada, especificaciones de diseño.
- **Flag de Confidencialidad:** El profesional puede marcar fórmulas exclusivas como confidenciales para que otros estilistas no puedan inspeccionarlas.
- **Registro Fotográfico:** Galería de fotos (antes/después) vinculada al historial del cliente.

### 3.4 Punto de Cobro (POS), Cierre de Atención y Comisiones
- **Liquidación en Flujo Único:** Totaliza servicios realizados, productos retail añadidos, descuentos y propinas.
- **Descuento Automático de Inventario:** Cerrar un servicio técnico descuenta automáticamente los insumos utilizados (ej: 60g de tinte, 90ml de oxidante).
- **Motor de Comisiones:** Porcentaje configurable por profesional liquidado al cerrar la transacción.
- **Encuesta de Satisfacción Automatizada:** Al cerrar caja se dispara un mensaje vía WhatsApp con encuesta. Calificaciones bajas (< 3 estrellas) activan una alerta inmediata para protocolo de rectificación.

### 3.5 Motor Automatizado de Fidelización y Retención
- **Recordatorios por Ciclo de Vida:**
  - Manicura permanente / Gel: 14 días
  - Retoque de raíces: 25 días
  - Corte y peinado: 45 días
- **Recuperación de Clientes Inactivos:** Detecta clientes sin visitas en >45 días y genera ofertas personalizadas de reactivación.
- **Fidelización por Cumpleaños:** Generación automática de cupones de descuento para el mes de cumpleaños.

### 3.6 Enrutamiento Multi-Inquilino (Multi-Tenant)
- Cada salón cuenta con un identificador único `slug` (ej: `luu.app/:salonSlug`).
- El portal público de reservas resuelve el `salonId` a partir del slug y muestra exclusivamente la marca, servicios y profesionales de ese establecimiento.
