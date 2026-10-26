# Akshun Innovations — Frontend

The frontend of Akshun Innovations is a web application built with Next.js, React, and TypeScript. It provides the user interface for browsing the product catalogue and exploring detailed product information.

## Features

- Product listing and catalogue pages
- Category and subcategory navigation
- Product detail pages
- Search, filtering, sorting, and pagination
- Reusable product cards and layout components
- Product specifications, features, and applications
- Catalogue data organized into structured files
- Quote-related interface components

## Technology Stack

- Next.js
- React
- TypeScript
- CSS and PostCSS
- npm

## Folder Structure

```text
frontend/
├── app/             # Application routes and pages
├── components/      # Reusable UI components
├── data/            # Catalogue and product data
├── public/           # Static assets
├── scripts/          # Data processing utilities
├── package.json
├── package-lock.json
└── README.md
```

## Prerequisites

- Node.js
- npm

## Installation

From the repository root:

```bash
cd frontend
npm install
```

## Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for Production

```bash
npm run build
```

Run the production build locally:

```bash
npm run start
```

## Code Quality

Check `package.json` for the available linting and formatting scripts. Run the configured checks before submitting changes.

## Backend Integration

The frontend can integrate with the FastAPI backend to retrieve product information. Configure the API base URL according to the frontend's environment-variable conventions and the backend server address.

Ensure the backend CORS configuration permits requests from the frontend development origin.

## Development Guidelines

- Use TypeScript types for product and API data.
- Build reusable components instead of duplicating UI logic.
- Keep product data and presentation components separate.
- Test navigation and product filters after making changes.
- Do not commit environment files containing secrets.

## Related Documentation

See the repository's root `README.md` for overall setup and `backend/README.md` for API and database configuration.
