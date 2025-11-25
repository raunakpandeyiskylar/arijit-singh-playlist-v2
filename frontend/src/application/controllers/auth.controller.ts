import authTokenStorage from "@/data/datasources/local/authToken.storage";
import userIdStorage from "@/data/datasources/local/userId.storage";
import authService from "@/data/services/auth.service";
import UserEntity from "@/domain/entities/user.entity";
import LoginUsecase from "@/domain/usecases/auth/login.usecase";
import LogoutUsecase from "@/domain/usecases/auth/logout.usecase";
import SignupUsecase from "@/domain/usecases/auth/signup.usecase";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    user: UserEntity | null,
    authenticated: boolean,
    loading: boolean,
    error: string | null,
    success: string | null,

    login(payload: { username: string; password: string; }): Promise<void>;
    signup(user: Partial<UserEntity>): Promise<void>;
    logout(): Promise<void>;
    clearError: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            authenticated: false,
            loading: false,
            error: null,
            success: null,

            async login(payload) {
                set({ loading: true, error: null });

                try {
                    const loginUseCase = new LoginUsecase(authService);

                    const response = await loginUseCase.call(payload);

                    if (response.status && response.data && response.data.type === 'single') {
                        const user = response.data.item;
                        const token = user.authToken;

                        if (token) {
                            authTokenStorage.setToken(token);
                            userIdStorage.setUserId(user._id!);
                        }

                        set({
                            user,
                            authenticated: true,
                            loading: false,
                            error: null
                        });

                        return;
                    }

                    throw new Error(response.message);
                } catch (error: any) {
                    set({
                        error: error.message || 'Login failed',
                        loading: false,
                        authenticated: false,
                        user: null
                    });
                    authTokenStorage.removeToken();
                    userIdStorage.removeUserId();
                }
            },

            async signup(user) {
                set({ loading: true, error: null });

                try {
                    const signupUsecase = new SignupUsecase(authService);

                    const response = await signupUsecase.call(user);

                    if (response.status && response.data && response.data.type === 'single') {
                        const user = response.data.item;

                        set({
                            user,
                            authenticated: false,
                            loading: false,
                            error: null
                        })

                        return;
                    }

                    throw new Error(response.message);
                } catch (error: any) {
                    set({
                        error: error.message || 'Signup failed',
                        loading: false,
                        authenticated: false,
                        user: null
                    });
                }
            },

            async logout() {
                try {
                    set({ loading: true, error: null, success: null, });

                    const logoutUsecase = new LogoutUsecase(authService);

                    const response = await logoutUsecase.call();

                    if (response.status) {
                        set({
                            user: null,
                            authenticated: false,
                            loading: false,
                            error: null,
                            success: response.message
                        })

                        authTokenStorage.removeToken();
                        userIdStorage.removeUserId();

                        return;
                    }

                    throw new Error(response.message);
                } catch (error: any) {
                    set({
                        error: error.message || 'Logout failed',
                        loading: false,
                        authenticated: false,
                        user: null
                    });
                }
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: "auth",
            partialize: (state) => ({
                user: state.user,
                authenticated: state.authenticated,
            })
        }
    )
)

export default useAuthStore;
