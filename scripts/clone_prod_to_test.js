import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'pelu-harliz-green',
  appId: '1:217318402011:web:b660dcacfb27c4badde9fe',
  storageBucket: 'pelu-harliz-green.firebasestorage.app',
  apiKey: 'AIzaSyDeSPCO40kAsHtIx6Ej6zulu2Bh2Ukd2PU',
  authDomain: 'pelu-harliz-green.firebaseapp.com',
  messagingSenderId: '217318402011'
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
