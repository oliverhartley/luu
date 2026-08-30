import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'pelu-harliz-green-df830',
  appId: '1:437514694034:web:82dba50042406d4199254b',
  storageBucket: 'pelu-harliz-green-df830.firebasestorage.app',
  apiKey: 'AIzaSyBjkzLm8xiOXGwDyc7yljAhXjarw5b7Sw8',
  authDomain: 'pelu-harliz-green-df830.firebaseapp.com',
  messagingSenderId: '437514694034',
  measurementId: 'G-XJC9DJD71X'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const collections = [
  'salons',
  'clients',
  'appointments',
  'services',
  'professionals',
  'inventory',
  'productSales',
  'stations'
];

async function cloneAll() {
  console.log('🔄 Iniciando clonación exacta de Producción a Test...');

  for (const colName of collections) {
    const prodCol = collection(db, colName);
    const snapshot = await getDocs(prodCol);

    console.log(`📂 Colección "${colName}": ${snapshot.size} documentos encontrados en Producción.`);

    if (snapshot.empty) continue;

    const batch = writeBatch(db);
    let count = 0;

    snapshot.forEach((docSnap) => {
      const targetDoc = doc(db, `test_${colName}`, docSnap.id);
      batch.set(targetDoc, docSnap.data());
      count++;
    });

    await batch.commit();
    console.log(`✅ Colección "test_${colName}": ${count} documentos sincronizados a Test.`);
  }

  console.log('🎉 Clonación completada exitosamente. El ambiente TEST es exactamente igual al de Producción.');
  process.exit(0);
}

cloneAll().catch((err) => {
  console.error('❌ Error al clonar colecciones:', err);
  process.exit(1);
});
