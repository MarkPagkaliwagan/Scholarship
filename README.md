# Scholarship System

A Next.js web application for managing scholarship applications, providing information, and tracking application status.

## Features

- **Home Page** - Overview of available scholarships and key information
- **Apply** - Online scholarship application form
- **How to Apply** - Detailed application instructions and requirements
- **Track Application** - Check application status using application ID
- **FAQ** - Frequently asked questions about scholarships
- **Contact** - Contact information for support

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Bun runtime

## Getting Started

First, install dependencies:

```bash
bun install
```

Create the local environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Run the development server:

```bash
bun run dev
```

On macOS or Windows, the first run may ask for admin approval to pin the Cloudflare DB hostname to IPv4 in the system hosts file. This avoids local IPv6 routes breaking `cloudflared`.

Open [http://localhost:5001](http://localhost:5001) in your browser.

## Project Structure

```
src/
├── app/
│   ├── apply/         # Application form page
│   ├── contacts/      # Contact page
│   ├── howtoapply/   # How to apply instructions
│   ├── tracking/     # Application tracking page
│   ├── about/        # About page
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
└── components/
    ├── ApplicationForm.tsx
    ├── FAQAccordion.tsx
    ├── Footer.tsx
    ├── Navbar.tsx
    └── TrackApplication.tsx
```

## Available Scripts

- `bun run dev` - Start DB tunnel (best-effort) and development server on port 5001
- `bun run dev:web` - Start only development server on port 5001
- `bun run dev:db` - Start only DB tunnel
- `bun run dev:setup-db` - Pin DB tunnel hostname to IPv4 in the system hosts file
- `bun run build` - Build for production
- `bun run start` - Start production server
