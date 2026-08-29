import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  writeBatch,
  query,
  where
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  InventoryProduct, 
  Client, 
  Appointment, 
  Service, 
  Professional, 
  ProductSale,
  TenantSalon 
} from '../types';
import { 
  INITIAL_INVENTORY, 
  INITIAL_CLIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_SERVICES, 
  INITIAL_PROFESSIONALS, 
  INITIAL_PRODUCT_SALES 
} from '../data/mockData';

/**
 * Carga o siembra los datos iniciales de una colección en Cloud Firestore
 */
export async function loadOrSeedCollection<T extends { id: string }>(
  collectionName: string,
  initialData: T[]
): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);

    // Si ya existen datos en Firestore, devolverlos
    if (!snapshot.empty) {
      const data: T[] = [];
      snapshot.forEach((d) => {
        data.push(d.data() as T);
      });
      return data;
    }

    // Si Firestore está vacío, sembrar los datos iniciales en lote
    const batch = writeBatch(db);
    initialData.forEach((item) => {
      const docRef = doc(db, collectionName, item.id);
      batch.set(docRef, item);
    });
    await batch.commit();
    return initialData;
  } catch (error) {
    console.warn(`[Firestore] No se pudo sincronizar ${collectionName}, usando copia local:`, error);
    return initialData;
  }
}

/**
 * Guarda o actualiza un documento individual en Firestore de forma no bloqueante
 */
export async function saveDocument<T extends { id: string }>(
  collectionName: string, 
  item: T
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (error) {
    console.warn(`[Firestore] Error al guardar en ${collectionName}/${item.id}:`, error);
  }
}

/**
 * Elimina un documento individual en Firestore
 */
export async function deleteDocument(
  collectionName: string, 
  id: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn(`[Firestore] Error al eliminar en ${collectionName}/${id}:`, error);
  }
}
