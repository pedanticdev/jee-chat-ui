import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const LoginPage = ({ authMethods = ['email', 'google'] }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';
    const errorMessage = location.state?.error;

    useEffect(() => {
        if (errorMessage) {
            setError(errorMessage);
        }
    }, [errorMessage]);

    const handleEmailSignIn = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
            navigate(from);
        } catch (err) {
            setError('Failed to sign in. Please check your credentials.');
            console.error('Sign in error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            await signInWithGoogle();
            console.log('Sign in with Google. Redirecting back to ' + from);
            navigate(from);
        } catch (err) {
            setError('Failed to sign in with Google.');
            console.error('Google sign in error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign In</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {authMethods.includes('email') && (
                <form onSubmit={handleEmailSignIn} className="mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-300 outline-none"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-300 outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                    >
                        {loading ? 'Signing in...' : 'Sign In with Email'}
                    </button>
                </form>
            )}

            {authMethods.includes('google') && (
                <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition duration-300 flex items-center justify-center"
                >
                    <img src="/google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
                    Sign In with Google
                </button>
            )}
        </div>
    );
};

export default LoginPage;