import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { getCollectionName, isTestEnv } from './env';

/**
 * Carga o siembra los datos iniciales de una colección en Cloud Firestore
 * Utiliza getCollectionName para aislar automáticamente 'test_' de 'prod'
 */
export async function loadOrSeedCollection<T extends { id: string }>(
  baseCollectionName: string,
  initialData: T[]
): Promise<T[]> {
  const actualCollection = getCollectionName(baseCollectionName);
  try {
    const colRef = collection(db, actualCollection);
    const snapshot = await getDocs(colRef);

    // Si ya existen datos en Firestore para este entorno, devolverlos
    if (!snapshot.empty) {
      const data: T[] = [];
      snapshot.forEach((d) => {
        data.push(d.data() as T);
      });
      return data;
    }

    // Si Firestore está vacío en este entorno, sembrar datos iniciales en lote
    const batch = writeBatch(db);
    initialData.forEach((item) => {
      const docRef = doc(db, actualCollection, item.id);
      batch.set(docRef, item);
    });
    await batch.commit();
    return initialData;
  } catch (error) {
    console.warn(`[Firestore] No se pudo sincronizar ${actualCollection}, usando copia local:`, error);
    return initialData;
  }
}

/**
 * Guarda o actualiza un documento individual en Firestore de forma no bloqueante
 */
export async function saveDocument<T extends { id: string }>(
  baseCollectionName: string, 
  item: T
): Promise<void> {
  const actualCollection = getCollectionName(baseCollectionName);
  try {
    const docRef = doc(db, actualCollection, item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (error) {
    console.warn(`[Firestore] Error al guardar en ${actualCollection}/${item.id}:`, error);
  }
}

/**
 * Elimina un documento individual en Firestore
 */
export async function deleteDocument(
  baseCollectionName: string, 
  id: string
): Promise<void> {
  const actualCollection = getCollectionName(baseCollectionName);
  try {
    const docRef = doc(db, actualCollection, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn(`[Firestore] Error al eliminar en ${actualCollection}/${id}:`, error);
  }
}

/**
 * Clona los datos actuales de Producción hacia el entorno de TEST.
 * Solo puede ejecutarse cuando se está en ambiente TEST para evitar sobreescribir Producción.
 */
export async function cloneProdToTest(): Promise<{ success: boolean; message: string }> {
  if (!isTestEnv()) {
    return { success: false, message: 'Operación permitida únicamente desde el ambiente TEST.' };
  }

  const collectionsToClone = [
    'salons',
    'clients',
    'appointments',
    'services',
    'professionals',
    'inventory',
    'productSales',
    'stations'
  ];

  try {
    for (const name of collectionsToClone) {
      // 1. Obtener datos de prod (nombre base sin prefijo)
      const prodSnapshot = await getDocs(collection(db, name));
      if (!prodSnapshot.empty) {
        const batch = writeBatch(db);
        prodSnapshot.forEach((docSnapshot) => {
          const testDocRef = doc(db, `test_${name}`, docSnapshot.id);
          batch.set(testDocRef, docSnapshot.data());
        });
        await batch.commit();
      }
    }
    return { success: true, message: 'Datos de producción clonados exitosamente al ambiente de TEST.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Error al clonar datos.' };
  }
}
