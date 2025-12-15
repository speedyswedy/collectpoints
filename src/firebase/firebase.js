// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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
const auth = getAuth(app);
const db = getFirestore(app);

const challengesData = [
  { title: 'Jonglera 50 gånger', description: 'Jonglera med en fotboll 50 gånger utan att den nuddar marken.', points: 10 },
  { title: 'Nötter-Kungen', description: 'Träffa en kompis (eller förälder) med en nöt i baken från 5 meters avstånd.', points: 20 },
  { title: 'Pricka kryssribban', description: 'Träffa kryssribban från straffpunkten.', points: 30 },
  { title: 'Sätt en hörna direkt i mål', description: 'Skruva in en hörna direkt i mål.', points: 50 },
  { title: 'Jorden Runt', description: 'Gör "Jorden Runt" med bollen.', points: 30 },
  { title: 'Passning mot vägg', description: 'Stå 5 meter från en vägg. Passa bollen med ett tillslag mot väggen 50 gånger i rad utan att missa.', points: 20 },
  { title: 'Volleyskott på mål', description: 'Be en kompis kasta en boll som du skjuter på volley. Träffa målet 3 av 5 gånger.', points: 25 },
  { title: 'Nickduell', description: 'Vinn 5 nickdueller mot en kompis (eller förälder).', points: 15 },
  { title: 'Snabb dribbling', description: 'Dribbla så snabbt du kan mellan 10 koner uppställda på en rad. Filma och skicka in din tid. Poäng baseras på tid, max 30.', points: 30 },
  { title: 'Frisparksmuren', description: 'Sätt en frispark över en mur (be vänner stå där) från 20 meter.', points: 40 },
  { title: 'Mottagning & vändning', description: 'Ta emot en hög passning, vänd och skjut på mål inom 3 sekunder.', points: 20 },
  { title: 'Plankan-mästaren', description: 'Stå i plankan så länge du kan. Filma och skicka in din tid. 1 poäng per 10 sekunder, max 30 poäng.', points: 30 },
  { title: 'Långpassning', description: 'Slå en passning på minst 30 meter som landar precis hos din medspelare.', points: 25 },
  { title: 'Sido-jonglering', description: 'Jonglera bollen 20 gånger bara med utsidan av fötterna.', points: 15 },
  { title: 'Burpee-hopp', description: 'Gör 15 burpees med ett upphopp på slutet.', points: 20 },
  { title: 'Crossbar Challenge från halva plan', description: 'Försök träffa ribban från mittlinjen.', points: 100 },
  { title: 'Rabona-passning', description: 'Slå en lyckad Rabona-passning till en medspelare.', points: 35 },
  { title: 'Enbens-balans', description: 'Stå på ett ben och blunda i 60 sekunder utan att tappa balansen.', points: 15 },
  { title: 'Coerver-dribbling serie', description: 'Genomför 5 olika Coerver-övningar i följd utan stopp.', points: 25 },
  { title: 'Vägg-volley', description: 'Kasta bollen mot en vägg, ta emot på volley och kontrollera den direkt. Upprepa 10 gånger.', points: 20 },
  { title: 'Huvud-tennis', description: 'Spela "huvud-tennis" med en kompis över ett nät (eller en linje på marken). Först till 5 poäng vinner.', points: 15 },
  { title: 'Skottfinter', description: 'Gör en skottfint som får en motståndare (vän) att gå åt fel håll, och gå sedan förbi.', points: 20 },
  { title: 'Sprint-intervaller', description: 'Spring 10 x 30 meter med 30 sekunders vila mellan varje.', points: 30 },
  { title: 'Sula-rullning', description: 'Rulla bollen fram och tillbaka under foten 30 gånger så snabbt som möjligt.', points: 10 },
  { title: 'Vägg-sit utmaning', description: 'Sitt i 90 grader mot en vägg så länge du kan. Bra för lårstyrkan. Filma och skicka in din tid. 1 poäng per 10 sekunder, max 30 poäng.', points: 30 },
  { title: 'Snabbfotad stege', description: 'Genomför 5 olika övningar i en agilitystege utan fel.', points: 20 },
  { title: 'Precisionsskott', description: 'Ställ upp 3 koner i målet. Träffa alla 3 med max 5 skott totalt.', points: 35 },
  { title: 'Klackspark till mål', description: 'Gör mål med en klackspark inifrån straffområdet.', points: 40 },
  { title: 'Slå tunnel', description: 'Slå en tunnel på en motståndare (en vän) under en liten match.', points: 25 },
  { title: 'Upphopp med knädrag', description: 'Gör 20 upphopp där du drar knäna mot bröstet i varje hopp.', points: 20 },
  { title: 'Dribbla förbi och skjut', description: 'Utmana en vän 1-mot-1. Dribbla förbi och gör mål.', points: 20 },
  { title: 'Bröst-kontroll', description: 'Ta ner en hög boll på bröstet och spela den vidare med max två tillslag.', points: 15 },
  { title: 'Kvick vändning', description: 'Löp mot en kon, gör en snabb vändning och sprinta 10 meter tillbaka. Upprepa 5 gånger.', points: 20 },
  { title: 'Hålla i, hålla i', description: 'Håll bollen i luften med enbart knän och fötter i 1 minut.', points: 25 },
  { title: 'Målgest-specialisten', description: 'Skapa och utför en unik målgest. Filma och få den godkänd av en kompis.', points: 10 },
  { title: 'Balansera på bollen', description: 'Sitt och balansera på en fotboll i 30 sekunder.', points: 25 },
  { title: 'Snabba fötter, snabba beslut', description: 'Dribbla mot en vän. Gör en överstegsfint och byt riktning på under 2 sekunder.', points: 20 },
  { title: 'Helikopterfinten', description: 'Genomför en lyckad helikopterfint (360-graders snurr med bollen).', points: 30 },
  { title: 'Reaktions-sprint', description: 'Stå med ryggen mot en vän. När vännen ropar \"VÄND!\", vänd dig om, sprinta 10 meter och ta emot en passning.', points: 15 },
  { title: 'Triangel-passningar', description: 'Ställ upp tre koner i en triangel. Passa bollen med en kompis genom triangeln, 20 passningar i rad med max två tillslag per person.', points: 25 },
  { title: 'Zlatan-klacken', description: 'Försök göra mål genom att klacka bollen i luften över ditt eget huvud (likt Zlatans mål mot Italien).', points: 70 },
  { title: 'Sidledshopp', description: 'Hoppa sidleds över en fotboll 30 gånger utan att nudda bollen.', points: 15 },
  { title: 'Press och vinn', description: 'Vinn tillbaka bollen från en motståndare (vän) inom 5 sekunder efter att ditt lag tappat den. Upprepa 3 gånger.', points: 20 },
  { title: 'Långskott i krysset', description: 'Skjut ett skott från utanför straffområdet som går i något av kryssen.', points: 60 },
  { title: 'Mål-från-halva-plan', description: 'Försök göra mål från egen planhalva på ett tomt mål.', points: 150 },
  { title: 'Boll-på-nacken', description: 'Balansera bollen på nacken i 10 sekunder.', points: 20 },
  { title: 'Elastico-finten', description: 'Lura en motståndare med en lyckad Elastico-fint.', points: 40 },
  { title: 'Vrist-skott i krysset', description: 'Gör ett mål med ett stenhårt vrist-skott i krysset.', points: 50 },
  { title: 'Själv-pass och skott', description: 'Passa bollen mot en vägg (eller annat objekt), spring och möt den och skjut direkt på mål.', points: 25 },
  { title: 'Hoppa-rep-utmaningen', description: 'Hoppa hopprep 100 gånger utan att fastna.', points: 15 },
  { title: '"Around the World" (ATW) med båda fötterna', description: 'Gör en "Around the World" med höger fot, följt av en med vänster fot.', points: 60 },
  { title: 'Målvakts-utkast', description: 'Stå som målvakt och kasta ut bollen förbi mittlinjen med precision till en medspelare.', points: 20 },
  { title: 'Boll-rullning och stopp', description: 'Rulla bollen snabbt framåt med sulan och stanna den sedan tvärt under foten. Upprepa 10 gånger.', points: 15 },
  { title: 'Scorpion-klacken', description: 'Försök att göra en "Scorpion-klack" (klacka bollen framåt i luften bakom ryggen).', points: 80 }
];

const seedChallenges = async () => {
  const challengesCollection = collection(db, 'challenges');
  // const challengesSnapshot = await getDocs(challengesCollection);
  // if (challengesSnapshot.empty) {
    console.log('Seeding challenges...');
    for (const challenge of challengesData) {
      await addDoc(challengesCollection, challenge);
    }
    console.log('Seeding complete.');
  // } else {
  //   console.log('Challenges collection is not empty. Skipping seeding.');
  // }
};

export { db, auth, seedChallenges };
