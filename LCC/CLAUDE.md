# Louisville Cricket Club App

## Overview
Production-grade iOS + Android cricket club management app built with Expo + React Native.

## Stack
- **Framework**: Expo SDK with expo-router (file-based routing)
- **Language**: TypeScript
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Payments**: Stripe via @stripe/stripe-react-native
- **State**: Zustand
- **Forms**: react-hook-form + zod
- **Lists**: @shopify/flash-list
- **Animations**: react-native-reanimated

## Brand Colors
- Navy: `#1a3c5e` (primary)
- Gold: `#c8a84b` (accent)

## Directory Structure
- `app/` — Expo Router screens
- `src/components/` — Reusable components
- `src/design/` — Design tokens and theme
- `src/services/` — Firebase and API services
- `src/store/` — Zustand stores
- `src/hooks/` — Custom hooks

## Dev Commands
```bash
npx expo start          # Start dev server
npx expo start --ios    # iOS simulator
npx expo start --android # Android emulator
```

## Build Commands
```bash
eas build --platform ios --profile production
eas build --platform android --profile production
eas submit --platform ios
eas submit --platform android
```

## Environment Variables
Copy `.env.example` to `.env` and fill in Firebase, Stripe, and CricClub credentials.

## Firebase Setup
1. Create project at console.firebase.google.com
2. Enable Auth (Email/Password), Firestore, Storage, Cloud Messaging
3. Add iOS app (bundle: com.louisvillecricketclub.app) and download GoogleService-Info.plist
4. Add Android app (package: com.louisvillecricketclub.app) and download google-services.json
5. Set Firestore security rules from firestore.rules
