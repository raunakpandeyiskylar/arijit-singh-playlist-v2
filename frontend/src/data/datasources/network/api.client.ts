"use client"

import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { RawQlResponse } from "raw_lib";
import authTokenStorage from "@/data/datasources/local/authToken.storage";
import useAuthStore from "@/application/controllers/auth.controller";
import { useRouter } from "next/navigation";

class ApiClient {
    private axios: AxiosInstance;

    constructor() {
        this.axios = axios.create({
            // baseURL: envConfig.clientUrl,
            headers: {
                "Content-Type": "application/json",
            },
        })

        this.axios.interceptors.request.use(
            async (config) => {
                const token = authTokenStorage.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error: AxiosError) => {
                return Promise.reject(error);
            }
        );

        this.axios.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error: AxiosError) => {
                if (error.response?.status === 401 || !useAuthStore().authenticated) {
                    console.error("Unauthorized request. Redirecting to login...");
                    useRouter().replace("/auth/login");
                }
                return Promise.reject(error);
            }
        );
    }

    async get<T>(url: string, params?: object): Promise<RawQlResponse<T>> {
        const response = await this.axios.get<RawQlResponse<T>>(url, { params });
        return response.data as RawQlResponse<T>;
    }

    async post<T>(url: string, data?: any, contentType?: string): Promise<RawQlResponse<T>> {
        const response = await this.axios.post<RawQlResponse<T>>(url, data, {
            headers: {
                "Content-Type": contentType || "application/json"
            }
        });
        return response.data;
    }
}

export default new ApiClient();
