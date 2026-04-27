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

Run the development server:

```bash
bun dev
```

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

- `bun dev` - Start development server on port 5001
- `bun build` - Build for production
- `bun start` - Start production server