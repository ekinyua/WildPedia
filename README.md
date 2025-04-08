# WildPedia - Biodiversity Education Platform 🌿

**Explore, Learn, and Contribute to the World of Biodiversity!**

![Landing page](landing_1.png)

## Overview

WildPedia is a web-based platform designed to make learning about biodiversity engaging and accessible. Whether you're a student, educator, or simply curious about the natural world, WildPedia offers a wealth of information, interactive quizzes, and opportunities to contribute your own knowledge.

**Key Features:**

- **Species Exploration:** Discover detailed information about species using data from the GBIF API.
- **Cultural Knowledge Sharing:** Contribute myths, legends, and proverbs related to different species.
- **Gamified Learning:** Earn badges, take quizzes, and track your progress as you learn.
- **Image Recognition:** Identify species from images using the Google Vision API.
- **Multi-Language Support:** Access content in multiple languages.

![Identify Species](species_identify.png)

## Project Structure

- **Frontend:** React application built with Tailwind CSS
- **Backend:** Node.js API built with Express, PostgreSQL

## Tech Stack

- **Frontend:**
  - React
  - Tailwind CSS
- **Backend:**
  - Node.js
  - Express
  - Postgresql
- **Storage:** AWS S3 (for sound storage)
- **APIs:**
  - GBIF API
  - Google Vision API

## Setup - Get Started Locally

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/ekinyua/WildPedia.git
    cd WildPedia
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    - Create a `.env` file in both the `frontend` and `backend` directories.
    - Refer to `.env.example` files for the required variables (API keys, database credentials, etc.).

4.  **Start the development servers:**

    ```bash
    # In separate terminal windows:
    npm run dev
    npm run dev
    ```

5.  **Access the application:**

    - Frontend: `http://localhost:3000` (or the port specified in your frontend configuration)
    - Backend: `http://localhost:5000` (or the port specified in your backend configuration)

## Contributing

We welcome contributions to WildPedia!

## Figma Design

[Link to Figma design: https://www.figma.com/design/vOxac0bbbkDZxrBK1nVHdg/Capstone-Project?node-id=56-802&t=Mr8dnlEhp3FLdHZf-1]

## Video Recording

[Link to video recording: https://drive.google.com/file/d/1ha18yLMkY463gN4lDmp9FZt_TeLM86ZB/view?usp=sharing]

## Database Schema

[Link to database schema: https://drive.google.com/file/d/1FSooS9udCPcSsObXODU5JpMr5S7AnoC_/view?usp=sharing]
