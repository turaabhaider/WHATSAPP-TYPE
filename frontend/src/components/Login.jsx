import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            // Mocking a user object. In a real app, this comes from your JWT backend.
            onLogin({ id: Math.floor(Math.random() * 1000), username });
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-96">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-blue-600 p-3 rounded-full text-white mb-2">
                        <MessageSquare size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Join Chat
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;