# Premium Design Store - Setup Guide

## 1. Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add a Web App and get the configuration object
4. Create a `.env.local` file in the root directory and add:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

## 2. Authentication
- Enable **Google Auth** in Firebase Authentication
- Update `src/lib/constants.ts` with your **admin email**

## 3. Firestore Rules
Copy these rules to your Firebase Firestore console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /designs/{designId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == "your-admin-email@example.com";
    }
  }
}
```

## 4. Storage Rules
Copy these rules to your Firebase Storage console:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /previews/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == "your-admin-email@example.com";
    }
    match /full_designs/{allPaths=**} {
      allow read: if request.auth != null && request.auth.token.email == "your-admin-email@example.com";
      allow write: if request.auth != null && request.auth.token.email == "your-admin-email@example.com";
    }
  }
}
```

## 5. Hosting (Netlify)
- Link your GitHub repository to Netlify
- Add the environment variables from `.env.local` to Netlify's "Environment variables" section
- Build settings:
  - Build command: `npm run build`
  - Publish directory: `.next`

## 6. Security Features
- **Disable Right-Click**: Prevent context menu on image details
- **Watermark**: Repeating site title overlay on preview images
- **Transparent Protection Layer**: Prevents direct image interaction
- **Blur-to-Preview**: Interactive protection on detail pages
- **Protected Storage**: High-quality files are only accessible by the admin in Firebase console (by default) or via specific storage rules.
