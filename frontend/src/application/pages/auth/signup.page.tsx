// application/components/auth/signup-form.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/application/controllers/auth.controller';

export default function SignupForm() {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        dateOfBirth: '',
    });

    const { signup, loading, error, clearError, authenticated } = useAuthStore();
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

        if (error) {
            clearError();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await signup({
            name: formData.name.trim(),
            username: formData.username.trim(),
            password: formData.password,
            dateOfBirth: new Date(formData.dateOfBirth)
        });

        router.replace('/auth/login')
    };

    const isFormValid = formData.name.trim() &&
        formData.username.trim() &&
        formData.password.length >= 6 &&
        formData.dateOfBirth;

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="glass rounded-2xl p-8 shadow-xl border border-border/40">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        Create Account
                    </h2>
                    <p className="text-muted-foreground">
                        Join us and start your musical journey
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
                                htmlFor="name"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-music-primary focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                Username
                            </label>
                            <input
                                id="username_signup"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-music-primary focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Choose a username"
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
                                id="password_signup"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-music-primary focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="At least 6 characters"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="dateOfBirth"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                Date of Birth
                            </label>
                            <input
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                required
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-music-primary focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !isFormValid}
                        className="w-full py-3 px-4 bg-linear-to-r from-music-primary to-music-accent text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-music-primary/25 focus:ring-2 focus:ring-music-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Creating account...
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-muted-foreground">
                        Already have an account?{' '}
                        <a
                            href="/auth/login"
                            className="text-music-primary hover:text-music-accent font-medium transition-colors"
                        >
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
