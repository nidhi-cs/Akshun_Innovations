# Akshun-Innovations
# Akshun Innovations

A full-stack product catalogue platform for IoT, electrical, and laboratory-related products. The application is designed to help users explore product categories, discover products, and view detailed product information through a modern web interface.

## Overview

Akshun Innovations separates the application into two components:

- **Frontend:** A responsive web application built with Next.js and TypeScript.
- **Backend:** A Python API service built with FastAPI, with MongoDB integration for product data.

The repository follows a modular structure to keep frontend development, backend services, and application data organized.

## Features

- Product catalogue and product detail pages
- Category and subcategory navigation
- Search, filtering, and sorting
- Product specifications, features, and applications
- Product information for different audiences
- Catalogue data management
- REST API architecture for product data
- Separated frontend and backend codebases

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | CSS, PostCSS |
| Backend | Python, FastAPI |
| Database | MongoDB |
| Validation and configuration | Pydantic, Pydantic Settings |
| Version control | Git and GitHub |

## Project Structure

```text
Akshun-Innovations/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── data/
│   ├── public/
│   ├── scripts/
│   ├── package.json
│   └── README.md
├── backend/
│   ├── app/
│   ├── scripts/
│   ├── tests/
│   ├── requirements.txt
│   └── README.md
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- Python 3
- MongoDB, either locally or through MongoDB Atlas
- Git

### 1. Clone the repository

```bash
git clone https://github.com/nidhi-cs/Akshun-Innovations.git
cd Akshun-Innovations
```

### 2. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Set up the backend

Open a separate terminal from the repository root:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment on Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the required environment variables using the backend's `.env.example` file. Ensure your MongoDB connection settings are correct.

Start the FastAPI server using the application's actual entry-point module. For example, if the entry point is `app.main:app`:

```bash
uvicorn app.main:app --reload
```

If configured with the default development settings, the API may run at `http://localhost:8000`. Interactive API documentation is available at `/docs` when enabled.

## Environment Configuration

Keep credentials and private configuration in local `.env` files. Do not commit passwords, API keys, or database credentials.

Use `.env.example` to document the required variable names without including real secrets.

## Development

- Keep frontend components modular and reusable.
- Keep API routes, database access, and validation organized in the backend.
- Add or update tests when backend functionality changes.
- Keep dependencies and setup instructions up to date.

## Contributing

1. Fork or clone the repository.
2. Create a feature branch.
3. Implement and test your changes.
4. Commit your work with a descriptive message.
5. Open a pull request for review.

## License

A license has not yet been specified. Add a license file before distributing the project under an open-source license.

---

Developed as part of the Akshun Innovations project.
