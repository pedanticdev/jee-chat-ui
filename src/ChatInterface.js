import React, {useEffect, useState} from 'react';
import {Bot, Hammer, Heart, Mic, Send, User} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {useAuth} from "./AuthContext";

const STORAGE_KEY = 'chat_messages';

const CodeBlock = ({language, children}) => {
    return (
        <div className="relative">
           <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
               <code className={`language-${language || 'text'}`}>
                   {children}
               </code>
           </pre>
        </div>
    );
};


// Environment configuration
const API_ENDPOINTS = {
    development: 'http://localhost:8080/chat/api/v1',
    production: 'https://chat.jakarta101.com/chat/api/v1',
};

// API configuration
const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || API_ENDPOINTS[process.env.NODE_ENV] || API_ENDPOINTS.development,
    TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT, 10) || 30000,
};


const ChatInterface = () => {
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem(STORAGE_KEY);
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const {user} = useAuth();

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {content: input, isUser: true};
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');

        setIsLoading(true);
        try {
            // Get the auth token from localStorage or your auth management system
            const token = user.accessToken;
            if (!token) {
                throw new Error('No authentication token found');
            }
            console.log(token);
            const response = await fetch(`${API_CONFIG.BASE_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    userMessage: input,
                    metadata: null
                }),
                signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            console.log(response);
            const data = await response.json();
            console.log(data);
            const botMessage = {
                content: data.chatResponse || 'Sorry, I couldn\'t process that.',
                isUser: false
            };
            setMessages([...newMessages, botMessage]);

        } catch (error) {
            console.log(process.env.NODE_ENV);

            console.error('Error:', error);
            const errorMessage = {
                content: error.message === 'No authentication token found'
                    ? 'Please log in to continue.'
                    : 'Sorry, there was an error processing your request.',
                isUser: false
            };
            setMessages([...newMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearHistory = () => {
        if (window.confirm('Are you sure you want to clear chat history?')) {
            setMessages([]);
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <div className="w-full max-w-6xl mx-auto">
                <div className="flex justify-end p-2">
                    <button
                        onClick={clearHistory}
                        className="text-sm text-gray-500 hover:text-red-500 px-3 py-1 rounded-md hover:bg-red-50"
                    >
                        Clear History
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100vh-120px)]">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start gap-2 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            {!msg.isUser && (
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-blue-600"/>
                                </div>
                            )}
                            <div
                                className={`max-w-2xl p-4 rounded-lg shadow-md ${
                                    msg.isUser
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-blue-50 text-gray-800 border border-blue-100'
                                }`}
                            >
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h1: ({node, ...props}) => <h1
                                            className="text-3xl font-bold mt-6 mb-4" {...props} />,
                                        h2: ({node, ...props}) => <h2
                                            className="text-2xl font-bold mt-5 mb-3" {...props} />,
                                        h3: ({node, ...props}) => <h3
                                            className="text-xl font-bold mt-4 mb-2" {...props} />,
                                        p: ({node, ...props}) => <p className="my-4" {...props} />,
                                        ul: ({node, ...props}) => <ul className="list-disc pl-6 my-4" {...props} />,
                                        ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-4" {...props} />,
                                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                        table: ({node, ...props}) => (
                                            <div className="overflow-x-auto my-6">
                                                <table
                                                    className="min-w-full border-collapse border border-gray-300 table-auto" {...props} />
                                            </div>
                                        ),
                                        thead: ({node, ...props}) => <thead className="bg-gray-100" {...props} />,
                                        th: ({node, ...props}) => (
                                            <th className="border border-gray-300 px-4 py-2 text-left font-bold bg-gray-50" {...props} />
                                        ),
                                        td: ({node, ...props}) => (
                                            <td className="border border-gray-300 px-4 py-2 align-top" {...props} />
                                        ),
                                        blockquote: ({node, ...props}) => (
                                            <blockquote
                                                className="border-l-4 border-gray-300 pl-4 my-4 italic" {...props} />
                                        ),
                                        code: ({node, inline, className, children, ...props}) => {
                                            const match = /language-(\w+)/.exec(className || '');
                                            const language = match ? match[1] : '';
                                            return !inline ? (
                                                <CodeBlock language={language}>
                                                    {String(children).replace(/\n$/, '')}
                                                </CodeBlock>
                                            ) : (
                                                <code className="bg-gray-800 text-white px-1 rounded" {...props}>
                                                    {children}
                                                </code>
                                            )
                                        },
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                            {msg.isUser && (
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                    <User className="w-5 h-5 text-white"/>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 p-4 bg-white shadow-lg">
                    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me Jakarta EE/MicroProfile and Payara related questions."
                            className="flex-1 p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 bg-blue-50"
                        />
                        <button
                            type="button"
                            className="p-2 text-blue-500 hover:text-blue-700"
                        >
                            <Mic className="w-5 h-5"/>
                        </button>
                        <button
                            type="submit"
                            className="p-2 text-blue-500 hover:text-blue-700 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            <Send className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}/>
                        </button>
                    </form>
                </div>

                <div
                    className="text-center p-2 text-xs text-gray-500 border-t border-gray-200 bg-white flex items-center justify-center gap-1">
                    <Hammer className="w-4 h-4"/> Built with Jakarta EE + MicroProfile + React With <Heart
                    className="w-4 h-4 text-red-500" fill="currentColor"/>.
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;