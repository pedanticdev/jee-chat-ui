Here’s the amended README file with the necessary additions based on the provided components and requirements:

---

# Getting Started with Jakarta Docs Chat UI

This project is a React-based chat interface for Jakarta EE/MicroProfile and Payara-related questions. It integrates with Firebase for authentication and hosting, and uses Firebase Firestore for user role management.

## Prerequisites

Before running the project, ensure you have the following:

1. **Node.js** and **npm** installed.
2. **Firebase CLI** installed globally. If not, install it using:
   ```bash
   npm install -g firebase-tools
   ```
3. A Firebase project set up with **Authentication** and **Firestore** enabled.

## Environment Configuration

To run the application, you need to create a `.env` file in the root directory with the following Firebase configuration:

```plaintext
REACT_APP_FIREBASE_API_KEY="API_KEY"
REACT_APP_FIREBASE_AUTH_DOMAIN="AUTH_DOMAIN"
REACT_APP_FIREBASE_PROJECT_ID="PROJECT_ID"
REACT_APP_FIREBASE_STORAGE_BUCKET="STORAGE_BUCKET"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="SENDER_ID"
REACT_APP_FIREBASE_APP_ID="APP_ID"
```

Replace the placeholders with your Firebase project's credentials.

## Firebase Initialization

1. Run the following command to initialize Firebase in your project:
   ```bash
   firebase init
   ```
2. Follow the prompts to set up Firebase Hosting and Firestore.
3. Ensure the Firebase configuration matches the `.env` file.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified, and the filenames include hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Firebase Deployment

To deploy the app to Firebase Hosting, run the following command:

```bash
firebase deploy
```

This will deploy the production build of your app to Firebase Hosting.

## Authentication and Authorization

The app uses Firebase Authentication for user sign-in. Supported authentication methods include:

- **Email/Password**
- **Google Sign-In**

User roles are managed via Firestore. Ensure your Firestore database has a `users` collection with a `role` field for each user.

## API Configuration

The app communicates with a backend API for chat functionality. The API endpoint is configured based on the environment:

- **Development**: `http://localhost:8080/chat/api/v1`

You can override the API endpoint by setting the `API_URL` environment variable.

## Learn More

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- [Firebase Documentation](https://firebase.google.com/docs)

---

### Key Features

- **Chat Interface**: A responsive chat UI with markdown support, code highlighting, and message history persistence.
- **Authentication**: Integrated Firebase Authentication for secure user sign-in.
- **Role-Based Access Control**: Users are assigned roles (e.g., `user`, `admin`) stored in Firestore.
- **Environment Configuration**: Supports environment variables for Firebase and API configuration.
- **Firebase Hosting**: Easy deployment to Firebase Hosting.

### Components Overview

- **ChatInterface**: The main chat component with message handling, markdown rendering, and clear history functionality.
- **AuthContext**: Manages user authentication state and provides methods for signing in and out.
- **LoginPage**: A login page supporting email/password and Google sign-in.
- **ProtectedRoute**: A wrapper component for protecting routes based on user authentication and role.

---

This README now includes all necessary setup instructions, environment configuration details, and an overview of the key components and features.