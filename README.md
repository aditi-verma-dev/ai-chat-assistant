# AI Chat Assistant

A full-stack AI chat application built with React, JavaScript, Java 21, Spring Boot, REST APIs, and Google's Gemini API.

## Architecture

```text
React frontend (Vite, http://localhost:5173)
        |
        | POST /api/chat
        v
Spring Boot backend (http://localhost:8080)
        |
        | Gemini generateContent API
        v
Google Gemini
```

The Gemini API key is configured on the backend only. Do not put it in the React `.env` file or commit it to GitHub.

## Requirements

- Node.js 20.19+ or 22.12+
- Java 21
- Internet connection
- A Google Gemini API key from https://aistudio.google.com/app/apikey

## 1. Configure the Gemini API key

Set an environment variable named `GEMINI_API_KEY`.

### Windows PowerShell (temporary, current terminal only)

```powershell
$env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

Keep this terminal open while running the backend.

Alternatively, copy `backend/.env.example` as a reminder of the required setting. Spring Boot does not automatically load `.env` files; the environment variable must be set in your shell or IDE run configuration.

Optional model setting:

```powershell
$env:GEMINI_MODEL="gemini-2.5-flash"
```

The default model is `gemini-2.5-flash`. If Google changes model availability for your API key, set `GEMINI_MODEL` to a model currently available in your Google AI Studio account.

## 2. Run the backend

Open a terminal in the `backend` folder:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend starts at `http://localhost:8080`.

Test the health endpoint in a browser:

`http://localhost:8080/api/health`

Expected response:

```json
{"status":"UP","service":"AI Chat Assistant"}
```

## 3. Run the frontend

Open a second terminal in the `frontend` folder:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## 4. Use the app

Type a message and press Enter or click Send. The frontend sends the conversation to Spring Boot. Spring Boot calls Gemini and returns the generated answer.

The conversation is held in the browser's React state. Refreshing the page clears the current conversation; this version does not save chats to a database.

## API contract

### `POST /api/chat`

Request:

```json
{
  "messages": [
    { "role": "user", "content": "Explain Java OOP simply." }
  ]
}
```

Response:

```json
{
  "reply": "Object-oriented programming..."
}
```

Supported roles are `user` and `model`. The frontend sends the full current conversation so Gemini can use earlier messages as context.

### `GET /api/health`

Returns a simple backend health response.

## Project structure

```text
ai-chat-assistant-complete/
├── backend/
│   ├── src/main/java/com/aditi/backend/
│   │   ├── BackendApplication.java
│   │   ├── config/CorsConfig.java
│   │   ├── controller/ChatController.java
│   │   ├── controller/HealthController.java
│   │   ├── dto/ChatRequest.java
│   │   ├── dto/ChatResponse.java
│   │   ├── dto/ChatMessage.java
│   │   └── service/GeminiService.java
│   ├── src/main/resources/application.properties
│   ├── .env.example
│   └── pom.xml
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Important security note

The API key is not included in this ZIP. Never commit a real key to GitHub. If a key is accidentally exposed, revoke it in Google AI Studio and create a new one. For a public production deployment, also add authentication, rate limiting, usage limits, and appropriate secret management.

## Current limitations

- No database or persistent chat history.
- No user login or authentication.
- No streaming response; the full answer appears after Gemini responds.
- The backend sends the conversation history on each request, so very long conversations can increase token usage.
- Gemini API usage is subject to Google's current model availability, quotas, and terms.

## Suggested interview explanation

"I built a full-stack AI chat assistant. The React frontend manages the conversation state and sends messages to a Spring Boot REST API. The backend validates the request, converts the conversation into Gemini's expected request format, calls Google's Gemini API using Java's HTTP client support through Spring's RestClient, and returns the generated response as JSON. The API key is kept on the backend rather than exposed in frontend code."
