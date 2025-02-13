# Biodiversity Education Application 🌿

A web-based platform for exploring biodiversity, contributing cultural knowledge, and engaging in gamified learning.

![Alt text](bio_home.png)

## Project Structure
- **Frontend**: React app (see [`frontend/README.md`](./frontend/README.md)).
- **Backend**: Node.js API (see [`backend/README.md`](./backend/README.md)).

## Setup

1. Clone the repository
```bash
git clone https://github.com/ekinyua/WildPedia.git
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
npm run dev
```

## Features
- Species exploration via GBIF API
- User-generated content with admin approval
- Gamification (badges, quizzes)
- Photo uploads with Google Vision API
- Localization support

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express, MySQL, Redis
- **Storage**: AWS S3

## Figma Design
https://www.figma.com/design/vOxac0bbbkDZxrBK1nVHdg/Capstone-Project?node-id=56-802&t=Mr8dnlEhp3FLdHZf-1

## Video Recording
https://drive.google.com/file/d/1eTsh1AchztAECoHgefr6N3PfTiwHTZDI/view?usp=sharing

## Database Schema
https://drive.google.com/file/d/1FSooS9udCPcSsObXODU5JpMr5S7AnoC_/view?usp=sharing

#  Deployment Plan

## Backend Deployment

### Traditional Server
```bash
# Clone and install
git clone [repository-url]
cd backend
npm install

# Setup environment
cp .env.example .env
nano .env  # Configure environment variables

# Start server
npm start
```

### Docker
```bash
# Build and run
docker build -t biodiversity-api .
docker run -d -p 5000:5000 biodiversity-api
```

## Frontend Deployment

### Build and Deploy
```bash
# Build
cd frontend
npm install
npm run build

# Deploy to hosting platforms
npm run deploy   # Vercel
```

