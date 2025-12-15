// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "collectpoints-481314",
  "appId": "1:144783788722:web:f4e5c0a0be99290c1057ab",
  "storageBucket": "collectpoints-481314.firebasestorage.app",
  "apiKey": "AIzaSyA_7ahWgAEcoS6zrqJAPfwCAiH8RKzfppU",
  "authDomain": "collectpoints-481314.firebaseapp.com",
  "messagingSenderId": "144783788722"
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
