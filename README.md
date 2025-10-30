# Fitness Tracker - Your Personal Training Companion

Fitness Tracker is a modern, cross-platform application designed to help you log, track, and visualize your fitness journey. Whether you're into weightlifting, running, or simply want to monitor your body metrics, this app provides the tools you need to stay on top of your goals.

Built with a focus on simplicity and a clean user interface, it runs on your desktop (Windows, macOS) and can be deployed to mobile devices (Android, iOS).

## ✨ Key Features

- **Comprehensive Training Log**: Record various types of workouts, including:
  - **Weightlifting**: Log sets, reps, and weight for each exercise.
  - **Cardio**: Track distance and duration for activities like running and cycling.
- **Body Metrics Tracking**: Monitor key body measurements to see your progress over time:
  - Body Weight (kg)
  - Shoulder, Chest, Arm, and Waist Circumference (cm)
- **Data Visualization**: Interactive charts and dashboards to help you understand your progress at a glance:
  - **Training Volume Analysis**: See how your workout volume changes over time.
  - **Body Metric Trends**: Visualize changes in your weight and measurements.
  - **Workout Duration Charts**: Track how much time you dedicate to your training sessions.
- **Cross-Platform**:
  - **Desktop**: Native desktop experience powered by **Electron**.
  - **Mobile**: Ready for mobile deployment with **Capacitor**.
- **Local-First Data Storage**: Your data is stored locally on your device, ensuring privacy and offline access.

## 🛠️ Tech Stack

- **Frontend**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **UI Framework**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first styling approach.
- **Charting**: [Recharts](https://recharts.org/) for beautiful and interactive charts.
- **Desktop App**: [Electron](https://www.electronjs.org/)
- **Mobile App**: [Capacitor](https://capacitorjs.com/)
- **Build Tool**: [Vite](https://vitejs.dev/) for a fast and modern development experience.
- **Database**: [NeDB](https://github.com/louischatriot/nedb), a lightweight, file-based embedded database.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)

### Installation & Development

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/fitness-tracker-app.git
    cd fitness-tracker-app
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Run the development server (for web/desktop):**
    This command starts the Vite dev server for the React app and launches the Electron window.
    ```sh
    npm run electron:dev
    ```

## 📦 Available Scripts

This project comes with a set of useful scripts defined in `package.json`:

| Script               | Description                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| `dev`                | Starts the Vite development server for the web app.                                                      |
| `build`              | Compiles the TypeScript code and builds the web app for production.                                      |
| `lint`               | Lints the codebase using ESLint to find and fix problems.                                                |
| `preview`            | Serves the production build locally for previewing.                                                      |
| `electron:dev`       | Runs the app in development mode with Electron.                                                          |
| `dist`               | Builds the app for production and creates distributable packages (e.g., `.dmg`, `.exe`).                 |
| `cap:sync`           | Syncs the web build with the native mobile platforms (Android/iOS).                                      |
| `cap:open:android`   | Opens the project in Android Studio.                                                                     |


