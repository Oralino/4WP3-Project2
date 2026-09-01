# Game Match Tracker - Full-Stack React Native Application

A cross-platform mobile and web application designed to track gaming performance, match statistics, and KDA ratios. Built with a decoupled architecture featuring a modern React Native (Expo) frontend and an Express/SQLite REST API backend.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

---

## Features

- **Collapsible Game Folders**: Automatically groups match history into expandable folders by game title using custom JavaScript array reduction.
- **Full CRUD Support**: Add, view, edit, and delete gaming matches with instant backend sync.
- **Cross-Platform Compatibility**: Supports native iOS/Android alert dialogs as well as browser confirmation modals for React Native Web via `Platform.OS` detection.
- **Bulk Data Wipe**: Features both folder-specific data clearing (using parallel `Promise.all` requests) and global database wipes.
- **Full-Stack Validation**: Sanitizes and validates user input on the frontend and uses parameterized queries on the backend to prevent SQL injection.

---

## Visual Overview

<img width="517" height="1142" alt="Image1" src="https://github.com/user-attachments/assets/764e3897-0fa2-4fe8-a551-775d108fc25d" />
<img width="507" height="1142" alt="Image2" src="https://github.com/user-attachments/assets/18dbf73e-6cbf-4127-a9bf-175c6a3df39c" />

