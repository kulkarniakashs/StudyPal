# StudyPal

StudyPal is an AI-powered study companion built with Next.js, React, Redux Toolkit, MongoDB, and Google Gemini. It provides chat-based Q&A, user authentication, OTP verification, chat history, and sharing features.

## Features

- **AI Chat**: Ask questions and get Markdown-formatted answers from Gemini.
- **Authentication**: Secure login/signup with NextAuth.
- **OTP Verification**: Email-based OTP for signup.
- **Chat History**: View, rename, delete, and share chats.
- **Shareable Links**: Share chats via generated links.
- **Redux State Management**: For chat and user state.
- **Tailwind CSS**: For UI styling.

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Environment Variables

Copy the example environment file and fill in your secrets:

```sh
cp .env.example .env.local
```

Edit `.env.local` and provide the following variables:

```
GEMINI_API=your_google_gemini_api_key
MONGODB=your_mongodb_connection_string
GMAIL_USER=your_gmail_address
GMAIL_PASS=your_gmail_app_password
```

- `GEMINI_API`: Google Gemini API key for AI responses.
- `MONGODB`: MongoDB connection string.
- `GMAIL_USER`/`GMAIL_PASS`: Gmail credentials for OTP email sending.

### 3. Run the development server

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` - Next.js app directory (pages, components, API routes)
- `lib/` - Utility functions, Redux store, database models, OTP logic
- `public/` - Static assets
- `.envexample` - Example environment variables
- `.env.local` - Your environment variables (not committed)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- Next.js 15
- React 19
- Redux Toolkit
- MongoDB & Mongoose
- Google Gemini API
- NextAuth.js
- Tailwind CSS
- Nodemailer (for OTP)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Google Gemini](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/)