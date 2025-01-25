import React from 'react';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import {AuthProvider} from "./AuthContext";
import {LoginPage} from "./Login";
import ChatInterface from "./ChatInterface";
import {ProtectedRoute} from "./ProtectedRoute";
import FileUpload from "./FileUpload";

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute allowedAuth="google">
                                    <ChatInterface />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/upload"
                            element={
                                <ProtectedRoute allowedAuth="email" requiredRole="admin">
                                    <FileUpload onUploadComplete={(files) => {
                                        console.log('Uploaded files:', files);
                                    }} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/login"
                            element={<LoginWithRedirect />}
                        />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
};

// New component to handle auth method selection
const LoginWithRedirect = () => {
    const location = useLocation();
    const authMethod = location.state?.authMethod || ['email', 'google'];

    return <LoginPage authMethods={Array.isArray(authMethod) ? authMethod : [authMethod]} />;
};

export default App;