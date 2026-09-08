# Join 360 - React Kanban Board

![Join Cover](/public/screenshots/board.png)

Join is a modern, fully responsive Kanban-based project management tool. It allows you to organize tasks efficiently, manage your team contacts, and keep track of upcoming deadlines using a sleek and intuitive interface.

This project is a React modernization of the original Vanilla JS Join application, built as part of the Developer Akademie web development bootcamp.

## 🚀 Features

- **Kanban Board**: Drag and drop tasks between *To do, In progress, Await feedback,* and *Done* columns.
- **Task Management**: Create tasks with titles, descriptions, due dates, priorities, categories, and subtasks.
- **Subtasks**: Track progress on granular tasks with a visual progress bar.
- **Contact CRM**: A built-in address book to manage your team and assign them to specific tasks.
- **Responsive Design**: Flawless user experience across all devices, from ultra-wide monitors down to 320px mobile screens.
- **Firebase Integration**: Real-time data synchronization using a lightweight REST wrapper around Firebase Realtime Database.

## 📸 Screenshots

| Summary Dashboard | Kanban Board |
| :---: | :---: |
| ![Summary](/public/screenshots/summary.png) | ![Board](/public/screenshots/board.png) |
| **Add Task Form** | **Contact Management** |
| ![Add Task](/public/screenshots/add-task.png) | ![Contacts](/public/screenshots/contacts.png) |

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite for blazing fast HMR and optimized builds
- **Routing**: React Router DOM v7
- **State Management**: React Hooks (useState, useEffect)
- **Drag & Drop**: `@dnd-kit/core` and `@dnd-kit/sortable`
- **Validation**: Zod for robust schema validation
- **Styling**: Standard CSS with a custom design system and variables
- **Backend/DB**: Firebase Realtime Database (via REST API)

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AdamBaranyi/Join-React.git
   cd Join-React
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add your Firebase Realtime Database URL:
   ```env
   VITE_FIREBASE_DB_URL=https://your-firebase-project-id-default-rtdb.europe-west1.firebasedatabase.app
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173/` (or whichever port Vite assigns).

## 🧹 Clean Code

This project adheres to strict Clean Code principles. A key constraint during development was to keep all files **under 400 lines of code** to ensure maximum readability, modularity, and maintainability. Components are logically separated and reusable across the application.

## 📝 License & Legal

This project is created for educational purposes. 
- [Privacy Policy](/privacy)
- [Legal Notice](/legal)

---
*Created by [Adam Baranyi](https://github.com/AdamBaranyi) - Developer Akademie*
