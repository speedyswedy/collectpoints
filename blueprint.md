# Mossen F10/F11 JuleChallenge

## Projektöversikt

En webbapplikation för fotbollslaget Mossen F10/F11 för att hantera en träningsutmaning under julledigheten. Appen är byggd med React och Firebase och använder e-post/lösenordsautentisering för att säkerställa att användare kan komma åt sina profiler från olika enheter.

## Applikationsdesign och Funktioner

### Designfilosofi
Applikationen har en modern, professionell och enhetlig design med ett konsekvent användargränssnitt över alla sidor. Designen balanserar ett kort-baserat system för innehållsblock med en ren, professionell tabellvy för listdata, vilket skapar en organiserad och visuellt tilltalande upplevelse.

### Global Styling
- **Centraliserad CSS:** All styling hanteras globalt från `src/App.css`, vilket säkerställer konsekvens och förenklar underhåll.
- **CSS Custom Properties (Variabler):** En global palett för färger (`--primary-color`, `--card-background`), skuggor (`--box-shadow`), och radier (`--border-radius`) är definierad för att enkelt kunna justera appens utseende.
- **Layout-behållare:** Klassen `.page-container` används för att centrera och ge konsekvent luft åt innehållet på alla sidor.

### Komponenter & Layout
- **Kort-baserad UI:** De flesta innehållsblock, såsom utmaningar (`.challenge-item`) och formulär (`.form-container`), renderas som "kort" med enhetliga skuggor och rundade hörn.
- **Professionell Poängtavla:** Poängtavlan (`.leaderboard-container`) presenteras i en ren och lättläst tabell-layout, inkapslad i en kort-behållare för att matcha den övergripande designen.
- **Enhetliga Knappar:** Alla knappar använder `.btn`-klassen för ett konsekvent utseende, med färgvariationer för olika syften och interaktiva hover-effekter.
- **Responsivitet:** Designen är fullt responsiv och anpassar sig för en optimal upplevelse på både mobila enheter och större skärmar.

### Funktioner
- **Användarhantering (E-post/Lösenord):** Registrering, inloggning och utloggning, med stöd för `player`- och `admin`-roller.
- **Profilhantering:** Spelare kan redigera sitt namn på sin profilsida.
- **Utmaningshantering:** Administratörer kan skapa, redigera och ta bort utmaningar. Spelare kan se och slutföra utmaningar.
- **Poängsystem:** Poäng uppdateras i realtid. Poängtavlan visar alla spelares ranking och poäng.
- **Dynamisk Navigering:** Navigationsfältet anpassas efter användarens status och roll.

---

## Senaste Genomförda Ändringar: Tabbvy för Utmaningar

### Mål
Att förbättra översikten på utmaningssidan genom att separera alla tillgängliga utmaningar från de som användaren har slutfört. Detta gör det enklare för spelare att se sina framsteg och hitta nya utmaningar.

### Genomförda Steg
1.  **Implementering av Tabb-komponent:** En ny `Tabs`-komponent skapades för att rendera två flikar: "Alla Utmaningar" och "Slutförda".
2.  **Dynamisk Räknare:** Varje flik visar nu en räknare inom parentes som indikerar antalet utmaningar i den specifika vyn (t.ex., "Slutförda (5)").
3.  **Filtrering av Data:** Logiken i `Challenges.jsx` uppdaterades för att hämta alla utmaningar och sedan filtrera dem i två separata listor baserat på användarens slutförda status.
4.  **Refaktorisering:** Komponenten delades upp i mindre, mer specialiserade delar (`Tabs`, `ChallengeList`) för ökad läsbarhet och underhållbarhet.
5.  **Styling av Tabbar:** Nya CSS-regler lades till i `App.css` för att ge flikarna en ren och modern design som är konsekvent med resten av applikationen.

Denna ändring ger en klarare och mer organiserad vy för spelarna, vilket förbättrar användarupplevelsen avsevärt.