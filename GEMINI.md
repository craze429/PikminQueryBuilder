# GEMINI.md

## Project Overview

This project, "CopyFlow", is a Node.js web application that serves a front-end utility for the game Pikmin Bloom. The application is a "Pikmin Bloom Search String Generator" that allows users to build complex search queries through a user-friendly interface.

The backend is built with Express.js and its primary role is to serve the static front-end files. It sets up both an HTTPS server for the main application and an HTTP server that redirects all traffic to the secure HTTPS connection.

The front-end is a single-page application built with HTML, CSS, and vanilla JavaScript. It is designed as a Progressive Web App (PWA), including a service worker for offline capabilities.

## Building and Running

### Prerequisites

*   Node.js and npm
*   OpenSSL (for generating SSL certificates if they don't exist)

### Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Generate SSL Certificates:**
    The server requires `server.key` and `server.crt` files for HTTPS. If you don't have them, you can generate self-signed certificates using OpenSSL:
    ```bash
    openssl genrsa -out server.key 2048
    openssl req -new -key server.key -out server.csr
    openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
    ```

### Running the Application

To start the server, run the following command:

```bash
npm start
```

The application will be available at `https://localhost:3443`. The HTTP server on `http://localhost:3000` will redirect to the HTTPS address.

### Testing

There are no automated tests configured for this project.

## Development Conventions

*   **Backend:** The backend code is written in JavaScript using the CommonJS module system. It uses the Express.js framework.
*   **Frontend:** The frontend is built with standard HTML, CSS, and JavaScript. The code is organized into separate files for structure (`index.html`), styling (`style.css`), and logic (`script.js`).
*   **PWA:** The application includes a `manifest.json` and a `service-worker.js`, enabling it to be installed as a Progressive Web App.
