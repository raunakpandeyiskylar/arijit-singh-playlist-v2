import UserEntity from "@/domain/entities/user.entity";
import AuthRepository from "@/domain/repositories/auth.repository";
import { RawQlResponse } from "raw_lib";
import apiClient from "../datasources/network/api.client";

class AuthService implements AuthRepository {
    login(payload: { username: string; password: string; }): Promise<RawQlResponse<UserEntity>> {
        try {
            return apiClient.post<UserEntity>("/api/auth/login", payload);
        } catch (error) {
            throw error;
        }
    }

    signup(user: Partial<UserEntity>): Promise<RawQlResponse<UserEntity>> {
        try {
            return apiClient.post<UserEntity>("/api/auth/signup", user);
        } catch (error) {
            throw error;
        }
    }

    logout(): Promise<RawQlResponse<void>> {
        try {
            return apiClient.post("/api/auth/logout");
        } catch (error) {
            throw error;
        }
    }
}

export default new AuthService();
