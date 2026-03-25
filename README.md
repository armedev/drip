# DRIP — 3D T-Shirt E-Commerce

A modern t-shirt storefront with real-time 3D product visualization, built for [Ctruh](https://ctruh.com) — a 3D commerce platform.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4 |
| 3D Engine | Three.js, @react-three/fiber, @react-three/drei |
| State | Zustand, TanStack Query |
| Backend | Express, TypeScript, Mongoose |
| Database | MongoDB |
| Validation | Zod |

## Features

- **3D Product Preview** — Interactive t-shirt models rendered with Three.js, auto-rotating with product-specific colors
- **SVG Fallback** — Instant-loading SVG thumbnails that match product color while 3D loads
- **Autocomplete Search** — Debounced instant search with product dropdown, recent searches, trending chips
- **Smart Filters** — Gender, colour, type, price range with URL sync
- **Cart** — Add/update/remove with quantity guards and stock validation
- **Product Detail Page** — Large 3D viewer with orbit controls, quantity picker, related products
- **Glassmorphism UI** — Dark theme with gold accents, glass panels, soft glow effects
- **Mobile Responsive** — Bottom sheet filters, compact navbar, 2-column grid on mobile

## Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)

## Setup

```bash
# Clone
git clone <repo-url> && cd drip

# Server
cd server
npm install
# Create .env with:
#   PORT=4000
#   MONGO_URI=mongodb://localhost:27017/drip
npm run dev     # Starts on http://localhost:4000, seeds DB automatically

# Client (separate terminal)
cd client
npm install
npm run dev     # Starts on http://localhost:3000
```

Open http://localhost:3000.

## Project Structure

```
drip/
├── client/
│   ├── app/
│   │   ├── layout.tsx            # Root layout, fonts, providers, navbar
│   │   ├── page.tsx              # Product listing with filters + hero
│   │   ├── cart/page.tsx         # Cart page
│   │   └── products/[id]/page.tsx # Product detail with 3D viewer
│   ├── components/
│   │   ├── Navbar.tsx            # Glass navbar, responsive search
│   │   ├── SearchBar.tsx         # Autocomplete with dropdown
│   │   ├── FilterSidebar.tsx     # Desktop filter panel
│   │   ├── BottomSheet.tsx       # Mobile filter sheet
│   │   ├── HeroBanner.tsx        # Homepage hero section
│   │   ├── ProductCard.tsx       # Card with 3D/SVG preview
│   │   ├── ProductGrid.tsx       # Responsive grid
│   │   ├── CartItem.tsx          # Cart row with qty controls
│   │   ├── CartSummary.tsx       # Cart totals + checkout
│   │   ├── TShirt3D.tsx          # Three.js t-shirt model
│   │   ├── TShirtSvg.tsx         # SVG t-shirt with dynamic fill
│   │   └── logo/                 # DripsIcon + Logo components
│   ├── store/
│   │   ├── cartStore.ts          # Zustand cart state
│   │   └── filterStore.ts        # Filter state with URL sync
│   ├── hooks/
│   │   ├── useProducts.ts        # Product queries
│   │   └── useCart.ts            # Cart mutations
│   ├── lib/
│   │   ├── api.ts                # Axios instance
│   │   ├── search.tsx            # Search utilities
│   │   └── utils.ts              # cn(), formatPrice()
│   └── types/index.ts            # Shared TypeScript types
│
├── server/
│   ├── src/
│   │   ├── index.ts              # Express entry, routes, seed
│   │   ├── config/db.ts          # MongoDB connection
│   │   ├── models/
│   │   │   ├── Product.model.ts
│   │   │   └── Cart.model.ts
│   │   ├── controllers/
│   │   │   ├── product.controller.ts
│   │   │   └── cart.controller.ts
│   │   ├── services/
│   │   │   ├── product.service.ts
│   │   │   └── cart.service.ts
│   │   ├── routes/
│   │   │   ├── product.routes.ts
│   │   │   └── cart.routes.ts
│   │   ├── schemas/
│   │   │   ├── product.schema.ts
│   │   │   └── cart.schema.ts
│   │   ├── middleware/
│   │   │   ├── error.middleware.ts
│   │   │   └── upload.middleware.ts
│   │   └── seed/index.ts         # Sample data (12 products)
│   └── uploads/                  # Product images (SVG + JPG)
│
├── postman/drip-api.json         # Postman collection
└── README.md
```

## API Endpoints

### Products

| Method | Endpoint | Description | Query/Body |
|---|---|---|---|
| GET | `/api/products` | List products | `page`, `limit`, `search`, `gender`, `colours`, `types`, `minPrice`, `maxPrice` |
| GET | `/api/products/:id` | Get single product | — |
| POST | `/api/products` | Create product | `name`, `type`, `gender`, `colour`, `price`, `quantity`, `image` (file) |
| DELETE | `/api/products/:id` | Delete product | — |

### Cart

| Method | Endpoint | Description | Body |
|---|---|---|---|
| GET | `/api/cart` | Get cart | — |
| POST | `/api/cart` | Add to cart | `{ "productId": "...", "quantity": 1 }` |
| PATCH | `/api/cart/:productId` | Update quantity | `{ "quantity": 2 }` |
| DELETE | `/api/cart/:productId` | Remove item | — |

## Design System

| Token | Value |
|---|---|
| Background | `#0f0f0f` (studio-base) |
| Surface | `#161616` (studio-surface) |
| Elevated | `#1f1f1f` (studio-elevated) |
| Border | `#2a2a2a` (border-studio) |
| Text Primary | `#f0f0f0` |
| Text Secondary | `#a0a0a0` |
| Text Muted | `#6b6b6b` |
| Accent Gold | `#e8c27a` |
| Error | `#e05c5c` |
| Font Sans | Geist |
| Font Mono | IBM Plex Mono |

## 3D Model

T-shirt model sourced from [threejs-t-shirt](https://github.com/Starklord17/threejs-t-shirt) (MIT License). Color changes applied via material cloning per instance.

## License

MIT
