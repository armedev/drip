# DRIP — 3D T-Shirt E-Commerce


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4 |
| State | Zustand, TanStack Query |
| Backend | Express, TypeScript, Mongoose |
| Database | MongoDB |
| Validation | Zod |

## Features

- **3D Product Preview** 
- **SVG Fallback** 
- **Autocomplete Search** 
- **Cart** 
- **Product Detail Page** 

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

## 3D Model

T-shirt model sourced from [threejs-t-shirt](https://github.com/Starklord17/threejs-t-shirt) (MIT License). Color changes applied via material cloning per instance.

## License

MIT
