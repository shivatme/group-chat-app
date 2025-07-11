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

🔧 **Update the Backend URL**  
In order for the app to connect to your local backend server, update the following line in your config file:

`/mobile/src/config.ts  export  const  BACKEND_URL = 'http://<your-local-ip>:3005';`

Replace `<your-local-ip>` with your actual local IP address (e.g. `192.168.1.5`).

> 📶 Ensure your device or emulator is on the **same Wi-Fi network** as your backend server machine.

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
        ├── /config.ts
        └── App.tsx
```

### 🧪 Testing

Open app on multiple emulators or physical devices on same Wi-Fi
Type messages to see real-time chat sync

## ⚠️ Known Issues

- The keyboard may overlap the message input field on **Android 15** due to system-level changes in keyboard handling.
- I was unable to test the app on Android 15 due to device limitations, but the app works as expected on Android 13 and below.
- For better compatibility across Android versions, we can use `react-native-keyboard-aware-scroll-view` or `react-native-keyboard-controller`.
- **Same usernames are allowed**, which may cause confusion (e.g., duplicate typing indicators or messages appearing from indistinguishable users).  
  A future improvement could involve assigning unique user IDs or restricting duplicate usernames at the server level.
