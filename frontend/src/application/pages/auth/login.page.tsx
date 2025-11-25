'use client';

import { useState, useEffect } from 'react';
import useAuthStore from '@/application/controllers/auth.controller';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const { login, loading, error, clearError, authenticated } = useAuthStore();
    const router = useRouter();

    // Redirect if already authenticated
    useEffect(() => {
        if (authenticated) {
            router.push('/');
        }
    }, [authenticated, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (error) {
            clearError();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username.trim() || !formData.password.trim()) {
            return;
        }

        await login({
            username: formData.username.trim(),
            password: formData.password
        });

        router.replace("/");
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="glass rounded-2xl p-8 shadow-xl border border-border/40">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-muted-foreground">
                        Sign in to your account to continue
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                Username
                            </label>
                            <input
                                id="username_login"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-music-primary focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                Password
                            </label>
                            <input
                                id="password_login"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-music-primary focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !formData.username.trim() || !formData.password.trim()}
                        className="w-full py-3 px-4 bg-linear-to-r from-music-primary to-music-accent text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-music-primary/25 focus:ring-2 focus:ring-music-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Signing in...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-muted-foreground">
                        Don't have an account?{' '}
                        <a
                            href="/auth/signup"
                            className="text-music-primary hover:text-music-accent font-medium transition-colors"
                        >
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
