# Mossen F10/F11 JuleChallenge

## Projektöversikt

En webbapplikation för fotbollslaget Mossen F10/F11 för att hantera en träningsutmaning under julledigheten. Appen är byggd med React och Firebase, med fokus på enkelhet och en bra användarupplevelse utan traditionell inloggning.

## Applikationsdesign och Funktioner

### Design och Stil
- **Gränssnitt:** Modernt, mobilvänligt och intuitivt med en ren layout och tydlig navigering.
- **Styling:** Global CSS används för ett enhetligt utseende med subtila skuggor, responsiva element och interaktiva effekter för knappar och länkar.
- **Layout:** En huvudlayout med en header som innehåller appens titel och navigering, ett huvudområde för sidinnehåll och en sidfot.

### Funktioner
- **Spelarregistrering:** Spelare kan registrera sig med namn och e-post. Ett unikt ID genereras och lagras lokalt i webbläsarens `localStorage` för att "komma ihåg" spelaren.
- **Redigera Spelare:** Inloggade spelare kan redigera sitt namn och sin e-post på en egen profilsida.
- **Utmaningar:** En lista med utmaningar (titel, beskrivning, poäng) hämtas från Firebase. Spelare kan markera utmaningar som slutförda för att samla poäng.
- **Poängregistrering:** Poäng och slutförda utmaningar uppdateras i realtid i Firebase. Appen använder optimistiska uppdateringar för en snabbare känsla.
- **Poängtavla (Leaderboard):** En offentlig topplista visar alla spelares namn och deras totala poäng, sorterat från högst till lägst.
- **Dynamisk Navigering:** Navigationsfältet anpassas beroende på om en spelare är "inloggad" (har ett `playerId` i `localStorage`).

## Plan för Implementation (Slutförd)

### Steg 1: Projekt-setup och grundläggande struktur
- Installerade `react-router-dom`.
- Skapade en logisk mappstruktur (`components`, `pages`, `firebase`).
- Implementerade routing och skapade grundläggande sidkomponenter.

### Steg 2: Firebase Integration
- Konfigurerade ett Firebase-projekt och installerade Firebase SDK.
- Upprättade anslutning till Firestore i applikationen.

### Steg 3: Spelarregistrering
- Skapade ett registreringsformulär.
- Implementerade logik för att spara nya spelare i Firestore och lagra deras ID lokalt.

### Steg 4: Utmaningssida och Poängregistrering
- Hämtade och visade utmaningar från Firestore.
- Implementerade funktionalitet för att markera utmaningar som slutförda och uppdatera spelarens poäng.

### Steg 5: Poängtavla
- Skapade en topplista som hämtar och sorterar spelardata från Firestore.

### Steg 6: Redigera Spelarinformation
- Skapade en profilsida (`MyProfile.jsx`) där spelare kan redigera sina uppgifter.
- Lade till en länk till profilsidan i navigeringen för inloggade spelare.

### Steg 7: Refaktorering och Finputsning
- **Styling:** Lade till en global CSS-fil (`index.css`) för ett enhetligt och modernt utseende.
- **Felhantering:** Förbättrade felhanteringen i alla komponenter som interagerar med Firebase (`try...catch`), och lade till tydliga felmeddelanden till användaren.
- **Navigering:** Byggde om `Layout.jsx` till att använda `NavLink` för att visuellt markera den aktiva sidan. Införde ett robustare system med `window.addEventListener` för att synkronisera inloggningsstatus över hela appen.
- **Kodförbättringar:** Lade till en sidfot, en övergripande titel och småförbättrade texten på flera ställen för att öka tydligheten.
