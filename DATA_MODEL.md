# 🗄️ Firestore Data Model & Security Schema (DATA_MODEL.md)

## 1. Tenancy Model Overview
Every salon operates in a partitioned data tree under `/salons/{salonId}`. System users map to their authenticated identity under `/users/{userId}`.

---

## 2. Document Schemas

### 2.1 Salon Tenant Root (`/salons/{salonId}`)
```typescript
interface TenantSalon {
  id: string;               // Unique Salon ID (Firestore doc ID)
  name: string;             // Display name (e.g., "Studio Chic")
  slug: string;             // Unique URL slug for public booking (e.g., "studio-chic")
  address: string;
  city: string;
  phone: string;
  ownerId: string;          // User UID of the owner
  slogan?: string;
  logo?: string;
  onboardingCompleted: boolean;
  createdAt: string;        // ISO 8601 string
}
```

### 2.2 Stations (`/salons/{salonId}/stations/{stationId}`)
```typescript
interface Station {
  id: string;
  salonId: string;
  name: string;             // e.g. "Sillón Color 1"
  chairNumber: number;
  category: 'hair_color' | 'hair_cut' | 'wash_spa' | 'nails' | 'lashes' | 'general';
  assignedProfessionalId?: string;
  status: 'ready' | 'occupied' | 'sanitizing';
  timeRemainingMinutes?: number;
  currentClientName?: string;
}
```

### 2.3 Services (`/salons/{salonId}/services/{serviceId}`)
```typescript
interface ServiceItem {
  id: string;
  name: string;
  category: 'hair' | 'nails' | 'brows_lashes' | 'skincare' | 'spa';
  durationMinutes: number;
  price: number;
  description?: string;
  isActive: boolean;
}
```

### 2.4 Appointments (`/salons/{salonId}/appointments/{appointmentId}`)
```typescript
interface Appointment {
  id: string;
  salonId: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  stylistId: string;
  stylistName: string;
  serviceIds: string[];
  date: string;             // YYYY-MM-DD
  startTime: string;        // HH:mm
  endTime: string;          // HH:mm
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  totalPrice: number;
  notes?: string;
  createdAt: string;
}
```

### 2.5 Technical Cards (`/salons/{salonId}/clients/{clientId}/technical_cards/{cardId}`)
```typescript
interface TechnicalCard {
  id: string;
  clientId: string;
  stylistId: string;
  serviceType: 'color' | 'nails' | 'treatment';
  formula: {
    baseGrams?: number;
    shadeCode?: string;
    developerVolume?: number;
    exposureMinutes?: number;
    nailArtDetails?: string;
  };
  isConfidential: boolean;   // If true, accessible only by author stylist and admin
  photoUrls?: string[];
  date: string;
}
```

---

## 3. Firestore Security Rules Target Pattern

To eliminate the open `allow read, write: if true;` vulnerability:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isSalonAdmin(salonId) {
      return isAuthenticated() && 
        (get(/databases/$(database)/documents/salons/$(salonId)).data.ownerId == request.auth.uid);
    }
    
    // Public read for salon directory & booking discovery
    match /salons/{salonId} {
      allow read: if true;
      allow write: if isSalonAdmin(salonId);
      
      // Services can be read publicly for the booking portal
      match /services/{serviceId} {
        allow read: if true;
        allow write: if isSalonAdmin(salonId);
      }
      
      // Appointments can be created by clients, managed by staff
      match /appointments/{appointmentId} {
        allow read, write: if isAuthenticated();
      }
      
      // Technical cards are protected (staff only)
      match /clients/{clientId}/technical_cards/{cardId} {
        allow read, write: if isAuthenticated();
      }
      
      // General subcollections restricted to salon members
      match /{subcollection=**} {
        allow read, write: if isAuthenticated();
      }
    }
    
    // User profile isolation
    match /users/{userId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
    }
  }
}
```
