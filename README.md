# FYP Blood Donation System

A full-featured mobile application built with **React Native** that connects blood donors, recipients, and blood bank organizations in real time. Developed as a Final Year Project (FYP).

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Screens & Navigation](#screens--navigation)
- [Firebase Integration](#firebase-integration)
- [Getting Started](#getting-started)
- [Screenshots](#screenshots)

---

## Overview

The Blood Donation System is a cross-platform mobile app that bridges the gap between blood donors, patients in need, and healthcare organizations. It supports two distinct user roles:

- **Individual Users** — donors and recipients who can post requests, schedule appointments, and communicate in real time.
- **Organizations** — blood banks and hospitals that manage donors, patients, appointments, and view analytics dashboards.

---

## Features

### Individual Users
- Register and log in via Email/Password or Google Sign-In
- Complete a health eligibility questionnaire on first sign-up
- Post and manage blood donation requests (public & private)
- Browse registered blood bank organizations
- Schedule and track donation appointments
- Real-time in-app chat with other users
- Emergency donor lookup
- View donation history and earned achievements
- Receive push notifications for request/appointment updates
- Manage personal profile and saved addresses

### Organizations
- Register as a blood bank or healthcare organization
- Manage registered donors and receivers (patients)
- View and respond to incoming donation requests
- Track outgoing requests and appointment status
- Analytics dashboard with bar and pie charts (donation trends, geographic data)
- Patient/donor management interface
- Push notifications and alerts

---

## Tech Stack

| Category | Library / Tool |
|---|---|
| Framework | React Native 0.71.7, React 18.2.0 |
| Navigation | React Navigation 6 (Stack, Bottom Tabs, Drawer, Material Top Tabs) |
| Backend / Database | Firebase Firestore (real-time), Firebase Auth |
| Authentication | Firebase Auth, Google Sign-In, OTP Verification |
| UI Components | React Native Paper, RNEUI, React Native Vector Icons, FontAwesome |
| Maps | React Native Maps |
| Chat | React Native Gifted Chat |
| Push Notifications | Notifee, React Native Push Notification |
| Charts | React Native Chart Kit |
| Storage | AsyncStorage |
| Email | EmailJS |
| Styling | Styled Components, Emotion |

---

## Project Structure

```
FYPBloodDonationSystem/
├── src/
│   ├── screens/
│   │   ├── Auth/               # Authentication screens
│   │   ├── Account/            # User profile & account
│   │   ├── Chat/               # Messaging screens
│   │   ├── Home/               # Home dashboards
│   │   ├── Forms/              # Request & application forms
│   │   ├── OrganisationInfo/   # Organization detail screens
│   │   └── PatientDetails/     # Patient information screens
│   ├── navigation/             # All navigation stacks
│   └── components/             # Reusable UI components
├── assets/                     # Images and icons
├── android/                    # Android native project
├── ios/                        # iOS native project
├── App.js                      # Root component
├── index.js                    # Entry point
└── package.json
```

---

## Screens & Navigation

### Authentication Flow
| Screen | Description |
|---|---|
| AuthenticationScreen | Landing screen — login or register decision |
| Login | Email/password login |
| Signup (Part 1 & 2) | Two-step registration form |
| OTPVerification | OTP verification for account activation |
| ForgotPassword | Password recovery via email |
| ChangePassword | Update existing password |
| Questionnaire | Health eligibility questionnaire (first login) |

### Individual User Navigation (Bottom Tabs)
| Tab | Screens |
|---|---|
| Appointments | Appointment requests list, confirmed appointments list, create appointment |
| Chat | Messages list, individual chat screen |
| Home | Home feed, notifications, donation request details, my organizations, emergency donors |
| Create Request | Blood request form |
| Account | Profile, edit profile, donation history, achievements, organizations, application form |

### Organization Navigation (Bottom Tabs)
| Tab | Screens |
|---|---|
| Patients | Registered patients list, patient details |
| Home | Organization dashboard with analytics, notifications |
| Requests | Incoming donor/receiver requests, patient details |

### Total Screens: 42

---

## Firebase Integration

### Firestore Collections

| Collection | Purpose |
|---|---|
| `users` | User profiles for both individual users and organizations |
| `requests` | Blood donation requests (public and private) |
| `appointments` | Appointment bookings and statuses |
| `notifications` | In-app notifications per user |
| `Chats` | Chat documents, with a `messages` subcollection |
| `OrganizationAssociations` | Membership links between users and organizations |

### Firebase Features Used
- Real-time listeners (`onSnapshot`) for live data updates
- Document CRUD operations
- `arrayUnion` for list updates
- Firebase Authentication with role-based routing (`isOrg` flag)
- User session caching via AsyncStorage

---

## Getting Started

### Prerequisites

- Node.js >= 16
- React Native CLI
- Android Studio (for Android) or Xcode (for iOS/macOS only)
- A Firebase project with Firestore and Authentication enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/AliMuhammadAslam/Blood-Donation-System.git
cd Blood-Donation-System/FYPBloodDonationSystem

# Install dependencies
npm install

# Android
npx react-native run-android

# iOS (macOS only)
cd ios && pod install && cd ..
npx react-native run-ios
```

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Email/Password** and **Google** sign-in under Authentication
3. Create a **Firestore** database
4. Download `google-services.json` (Android) and place it in `android/app/`
5. Download `GoogleService-Info.plist` (iOS) and place it in `ios/FYPBloodDonationSystem/`

---

## Design

- **Primary Color:** `#DE0A1E` (Blood Red)
- **Secondary Colors:** White, Dark Gray (`#353535`), Medium Gray (`#969696`)
- Card-based UI with Material Design influences
- Red theme reflects the blood donation context

---

## License

This project was developed as a Final Year Project (FYP). All rights reserved.
