# Pokémon Team Manager 🔴⚡

Een dynamische Pokémon webapplicatie gebouwd met **React**, **Vite**, **React Router** en de officiële **PokéAPI** ([pokeapi.co](https://pokeapi.co/)).

Gemaakt als schoolopdracht voor de opleiding **mbo niveau 4 Software Developer**.

---

## 🌟 Functionaliteiten

1. **Routing & Navigatie**:
   - Vloeiende navigatie zonder paginareload met `react-router-dom` (`HashRouter` voor volledige GitHub Pages compatibiliteit).
   - Vaste `Header` en `Navigation` op alle pagina's met actieve linkindicator.

2. **PokéAPI Data ophalen**:
   - Automatisch ophalen van de eerste 20 Pokémon via `https://pokeapi.co/api/v2/pokemon?limit=20`.
   - Duidelijke laadindicator (*"Aan het laden..."*) en foutafhandeling indien de API onbereikbaar is.
   - Live zoekfilter om snel Pokémon op naam te vinden.

3. **Herbruikbare Pokémon Kaarten**:
   - `PokemonCard` component gestyled met CSS Grid en type-badges.
   - Toont Pokémon ID, officiële artwork, naam, elementtypes en een directe doorklikknop.

4. **Dynamische Detailpagina**:
   - Route op basis van URL-parameters met `useParams()` (`#/pokemon/:name`).
   - Uitgebreide statistieken: HP, Attack, Defense, Speed (met geanimeerde progress-balken).
   - Fysieke eigenschappen: gewicht (kg) en lengte (m).
   - Direct toevoegen of verwijderen van teams vanaf de detailpagina.

5. **Pokémon Teams Beheer**:
   - Zelf teams aanmaken met een eigen naam.
   - Maximaal 6 Pokémon per team.
   - Duplicaatpreventie (dezelfde Pokémon kan niet tweemaal in hetzelfde team zitten).
   - Pokémon toevoegen via de detailpagina of via de snelle selectielijst op de teampagina.
   - Teams en teamleden verwijderen.
   - Volledig behoud van teams via `localStorage` (blijft bewaard na F5 / herladen).

6. **Responsive Styling**:
   - Aangepast voor laptops, tablets en smartphones.
   - Duidelijk leesbare dropdowns met lichte achtergrond en contrastrijke tekst.

---

## 🚀 Lokaal starten

1. Repository klonen:
   ```bash
   git clone https://github.com/mouiz76/pokimon.git
   cd pokimon
   ```

2. Dependencies installeren:
   ```bash
   npm install
   ```

3. Ontwikkelserver starten:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in je browser.

4. Productie-build testen:
   ```bash
   npm run build
   ```

---

## 🛠️ Gebruikte Technologieën

- **React 19**
- **Vite 8**
- **React Router DOM 7** (`HashRouter`)
- **PokéAPI v2**
- **Vanilla CSS**
