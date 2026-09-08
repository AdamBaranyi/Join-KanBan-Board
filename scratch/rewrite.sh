#!/bin/bash
git checkout --orphan new-main
git rm -rf --cached .

git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.node.json tsconfig.app.json index.html
git commit -m "Initialize React project with Vite and TypeScript"

git add public/assets
git commit -m "Add project assets and images"

git add src/index.css src/App.css
git commit -m "Define global CSS variables and base styling"

git add src/lib
git commit -m "Implement Firebase connection and session management"

git add src/components/Sidebar.tsx src/components/Sidebar.css src/components/Header.tsx src/components/Header.css
git commit -m "Build Sidebar and Header navigation"

git add src/pages/Login.tsx src/pages/Login.css
git commit -m "Implement Login and Registration"

git add src/pages/Summary.tsx src/pages/Summary.css
git commit -m "Implement Dashboard Summary page"

git add src/pages/Contacts.tsx src/pages/Contacts.css
git commit -m "Implement Contacts management"

git add src/components/AddTaskForm.tsx src/components/AddTaskForm.css src/pages/AddTask.tsx src/pages/AddTask.css
git commit -m "Implement Add Task form and functionality"

git add src/components/TaskCard.tsx src/components/TaskCard.css src/components/TaskDetailsModal.tsx src/components/TaskDetailsModal.css src/pages/Board.tsx src/pages/Board.css src/components/Modal.tsx src/components/Modal.css
git commit -m "Implement Kanban Board with drag-and-drop"

git add src/pages/Help.tsx src/pages/Legal.tsx src/pages/Privacy.tsx
git commit -m "Add Static information pages"

git add src/App.tsx src/main.tsx src/vite-env.d.ts
git commit -m "Setup React Router and application layout"

git add public/screenshots
git commit -m "Add application screenshots for documentation"

git add README.md
git commit -m "Write comprehensive project README"

git add .
git commit -m "Final polish and bug fixes"

git branch -D main
git branch -m main
git push origin main --force
