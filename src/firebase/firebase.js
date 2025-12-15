// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const challengesData = [
  { title: 'Jonglera 50 gånger', description: 'Jonglera med en fotboll 50 gånger utan att den nuddar marken.', points: 10 },
  { title: 'Nötter-Kungen', description: 'Träffa en kompis (eller förälder) med en nöt i baken från 5 meters avstånd.', points: 20 },
  { title: 'Pricka kryssribban', description: 'Träffa kryssribban från straffpunkten.', points: 30 },
  { title: 'Sätt en hörna direkt i mål', description: 'Skruva in en hörna direkt i mål.', points: 50 },
];

const seedChallenges = async () => {
  const challengesCollection = collection(db, 'challenges');
  const challengesSnapshot = await getDocs(challengesCollection);
  if (challengesSnapshot.empty) {
    console.log('Seeding challenges...');
    for (const challenge of challengesData) {
      await addDoc(challengesCollection, challenge);
    }
    console.log('Seeding complete.');
  } else {
    console.log('Challenges collection is not empty. Skipping seeding.');
  }
};

export { db, seedChallenges };
