# 🍜 Kuliner AI — Smart Food & Recipe Decision Maker

> A clean, minimalist web dashboard that uses ingredient-based matching and budget filtering to recommend authentic Indonesian recipes and local street-food spots — instantly.

![Kuliner AI Screenshot](https://raw.githubusercontent.com/placeholder/kuliner-ai/main/preview.png)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧊 **Fridge Mode** | Type your available ingredients (e.g. `ayam`, `telur`, `tahu`) and get ranked recipe matches |
| 🗺️ **Budget Mode** | Set your IDR budget and pick a city to discover the best local street-food spots |
| 🤖 **AI Simulation** | Animated processing state with progress bar and contextual status messages |
| 📸 **Food Photos** | Real food photography via stable Unsplash CDN URLs — no API key required |
| 📋 **Step-by-Step Instructions** | Collapsible accordion steps for each recipe |
| 📭 **Empty State** | Friendly no-results card with suggestions when nothing matches |
| 📱 **Fully Responsive** | Mobile-first layout — photo stacks above content on small screens |

---

## 🖼️ Preview

<p align="center">
  <img
    src="https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&w=800&q=80"
    alt="Kuliner AI – recipe results for ayam"
    width="720"
    style="border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,.12)"
  />
</p>

---

## 📁 Project Structure

```
makanan_web/
├── index.html          ← Markup & layout (176 lines)
├── css/
│   └── style.css       ← All styles — light theme, bento grid, cards (835 lines)
└── js/
    ├── data.js         ← 22-recipe catalogue with keywords, Unsplash photos, city data
    ├── ui.js           ← DOM builders: cards, chips, tags, empty state
    └── app.js          ← Controller: matching engine, AI simulation, event wiring
```

> **No build step. No npm. No framework.** Open `index.html` in any modern browser.

---

## 🚀 Getting Started

### Option 1 — Open directly

```bash
# Clone the repo
git clone https://github.com/your-username/kuliner-ai.git
cd kuliner-ai

# Open in browser
start index.html          # Windows
open index.html           # macOS
xdg-open index.html       # Linux
```

### Option 2 — Serve locally (recommended for image loading)

```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx serve .

# Using VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

Then visit **http://localhost:8080**

---

## 🧠 How the Matching Engine Works

### Fridge Mode

```
User types: "ayam", "telur"
                    ↓
   normalise() → ["ayam", "telur"]
                    ↓
   For each recipe in ALL_RECIPES (non dine-out):
     scoreRecipe() = matchingKeywords / totalUserTerms
                    ↓
   Filter score > 0 → sort descending → top 5
```

**Example results for `ayam`:**
- `score=1.00` → Soto Ayam Kampung
- `score=1.00` → Ayam Geprek Sambal Bawang
- `score=1.00` → Nasi Goreng Ayam
- `score=1.00` → Opor Ayam Kuah Santan

**Keyword matching is bilingual** — both Indonesian and English terms work:

| You type | Matched by |
|---|---|
| `ayam` | `ayam`, `chicken`, `geprek`, `soto ayam` |
| `chicken` | same recipes |
| `egg` | `telur`, `dadar`, `balado` |
| `tofu` | `tahu`, `tofu`, `bacem` |
| `noodles` | `mie`, `bihun`, `vermicelli` |

### Budget Mode

```
City: Yogyakarta   Budget: Rp 25,000
              ↓
  RECIPES_BUDGET['Yogyakarta']
  .filter(r => r.priceRaw <= 25000)
  .sort cheapest first
  .slice(0, 5)
              ↓
  If nothing fits → show all city recipes + "budget exceeded" warning
```

---

## 🍽️ Recipe Catalogue (22 recipes)

| Category | Recipes |
|---|---|
| 🐔 Ayam (Chicken) | Soto Ayam, Ayam Geprek, Nasi Goreng Ayam, Opor Ayam |
| 🥚 Telur (Egg) | Telur Dadar, Scrambled Tofu & Egg, Telur Balado |
| 🟨 Tahu & Tempe | Tempe Goreng, Tahu Bacem Jogja |
| 🍜 Mie (Noodles) | Mie Goreng Jawa, Mie Rebus Kuah Gurih |
| 🍚 Nasi (Rice) | Nasi Goreng Kampung, Sayur Bening Bayam |
| 🥩 Daging (Beef) | Rendang Daging Sapi, Sate Sapi Bumbu Kacang |
| 🐟 Ikan (Fish) | Ikan Goreng Kuning |
| 🏙️ Street Food | Gudeg Yogya, Angkringan, Gado-Gado, Soto Betawi |
| 🥦 Vegan | Cap Cay Sayuran, Urap Sayur Kelapa |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#F8FAFC` (off-white) |
| Card surface | `#FFFFFF` |
| Secondary surface | `#F1F5F9` |
| Border | `#E2E8F0` |
| Accent blue | `#4F6EF7` |
| Accent orange | `#F97316` |
| Accent teal | `#0EA5A0` |
| Text | `#0F172A` |
| Muted | `#64748B` |
| Border radius (card) | `20px` |
| Border radius (element) | `16px` |

---

## 🗃️ Adding New Recipes

Open [`js/data.js`](js/data.js) and add an object to `ALL_RECIPES`:

```js
{
  id: 'your-recipe-id',          // unique kebab-case ID
  img: {
    src:   'https://images.unsplash.com/photo-XXXXXX?auto=format&fit=crop&w=600&q=80',
    local: 'img/your-recipe.jpg', // swap to local file when deploying
    alt:   'Descriptive alt text for the photo'
  },
  name: 'Recipe Display Name',
  cost: 'Rp 15,000',
  priceRaw: 15000,               // numeric IDR for budget filtering
  time: '20 min',
  difficulty: 'Easy',            // Easy | Medium | Hard | Dine-out
  cuisine: 'Indonesian',         // must match one of CUISINES[]
  cities: ['Yogyakarta', 'Jakarta'], // cities where available (budget mode)
  keywords: [
    // Indonesian AND English synonyms — the more the better
    'ayam', 'chicken', 'goreng', 'fried', 'sambal', 'chili'
  ],
  tags: ['ayam', 'goreng', 'quick'], // display tags shown on card
  stripe: 'stripe-blue',            // stripe-blue | stripe-orange | stripe-teal
  steps: [
    'Step 1 description.',
    'Step 2 description.',
    // ...
  ]
}
```

---

## 📸 Using Local Images

By default, photos are served from Unsplash CDN. For production or offline use:

1. Download images and place them in the `img/` folder (create it if needed).
2. In `js/data.js`, change `img.src` to the `img.local` path for each recipe:

```js
// Before
src: 'https://images.unsplash.com/photo-1562802378-063ec186a863?...'

// After (local)
src: 'img/ayam-geprek.jpg'
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Vanilla CSS (custom properties, flexbox, grid) |
| Logic | Vanilla JavaScript ES5-compatible (no bundler needed) |
| Images | Unsplash CDN (stable, free, no API key) |
| Fonts | System UI font stack (`-apple-system`, `Segoe UI`) |

---

## 📄 License

MIT — free to use, modify, and distribute.

---

<p align="center">
  Made with ❤️ for Indonesian food lovers &nbsp;|&nbsp; Kuliner AI v1.0
</p>
