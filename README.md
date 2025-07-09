# Group Chat App

A basic real-time group chat app built with React Native Cli and a Socket.IO backend in Node.js + TypeScript.

---

## 💻 Features

- Prompt user for username
- Real-time messaging via Socket.IO
- Shared group room for all users
- Timestamps and usernames for each message
- Basic error handling (empty input prevention)

---

## 🧠 Tech Stack

- **Frontend**: React Native (TypeScript)
- **Backend**: Node.js, Socket.IO, TypeScript

---

## 🛠️ Setup Instructions

### 🔌 Backend

```bash
cd backend
npm install
npm run dev
Runs server on http://<your-ip>:3005

Edit IP in frontend to match this
```

### 📱 Frontend

```bash
cd mobile
npm install
npm start

# In a new terminal
npm run android
```

### 📂 Structure

```bash
/backend
  └── src/
        ├── server.ts
        └── index.ts

/mobile
  └── src/
        ├── /screens/ChatScreen.tsx
        ├── /types/index.ts
        └── App.tsx
```

### 🧪 Testing

Open app on multiple emulators or physical devices on same Wi-Fi
Type messages to see real-time chat sync
