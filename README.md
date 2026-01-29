# Buck - Screen Time & Focus App

Buck is a comprehensive screen time management and focus application designed to help users reclaim their time. It combines a cross-platform mobile application with a robust backend to track usage, block distracting applications, and implement "productive gating" — requiring users to complete cognitive tasks or physical exercises to unlock their apps.

## 🚀 Features

-   **Screen Time Tracking**: Detailed daily monitoring of device and application usage.
-   **Smart Blocking**: Set strict or flexible blocks on distracting apps.
-   **Task-Based Unlocking**: Complete tasks (cognitive puzzles, checking off goals) to gain temporary access to blocked apps.
-   **Onboarding Profiler**: Personalized setup to identify screen time goals, problem apps, and motivation types.
-   **Subscription Management**: Premium features and plan management.
-   **Cross-Platform**: Built for both iOS and Android.

## 🛠 Tech Stack

### Client (Mobile)
-   **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
-   **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
-   **Language**: TypeScript
-   **UI/UX**: React Native Reanimated for animations, Expo Haptics for feedback.

### Server (Backend)
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/) (with `pg` driver)
-   **Tools**: `nodemon` for development, `dotenv` for configuration.

## 📂 Project Structure

```
Buck - Screen Time App/
├── client/          # frontend React Native/Expo application
│   ├── app/         # Expo Router pages and layouts
│   ├── components/  # Reusable UI components
│   └── assets/      # Images and static resources
├── server/          # backend Node.js application
│   ├── db/          # Database schema and migration scripts
│   ├── server.js    # Main entry point
│   └── .env         # Environment variables (not committed)
└── README.md        # Project documentation
```

## ⚡️ Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [PostgreSQL](https://www.postgresql.org/) installed and running
-   [Expo Go](https://expo.dev/client) app on your mobile device (or Android Studio/Xcode for simulators)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Buck - Screen Time App"
```

### 2. Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up the database:
    -   Create a PostgreSQL database (e.g., `buck_db`).
    -   Run the schema script to create tables:
        ```bash
        psql -U <username> -d buck_db -f db/schema.sql
        ```
4.  Configure Environment Variables:
    -   Create a `.env` file in the `server` directory.
    -   Add your database credentials and configuration:
        ```env
        PORT=3000
        DATABASE_URL=postgres://user:password@localhost:5432/buck_db
        # Add other keys as needed
        ```
5.  Start the server:
    ```bash
    npm run dev
    ```

### 3. Client Setup

1.  Open a new terminal and navigate to the client directory:
    ```bash
    cd ../client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Expo development server:
    ```bash
    npx expo start
    ```
4.  Scan the QR code with your phone (using Expo Go) or press `a` for Android Emulator / `i` for iOS Simulator.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements.

## 📄 License

[MIT](LICENSE)
# Buck
