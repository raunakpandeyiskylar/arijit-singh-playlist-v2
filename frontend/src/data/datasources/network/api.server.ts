import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import envConfig from "@/config/env.config";
import { RawQlResponse } from "raw_lib";

export default class ApiServer {
    private axios: AxiosInstance;
    // private token: string;

    constructor(token?: string | null) {
        this.axios = axios.create({
            baseURL: envConfig.baseUrl,
            headers: {
                "Content-Type": "application/json",
            },
        })

        this.axios.interceptors.request.use(
            async (config) => {
                if (token) {
                    config.headers.Authorization = token;
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
                if (error.response?.status === 401) {
                    console.error("Unauthorized request. Redirecting to login...");
                }
                return Promise.reject(error);
            }
        );
    }

    async get<T>(url: string, params?: object): Promise<RawQlResponse<T>> {
        const response = await this.axios.get<RawQlResponse<T>>(url, { params });
        return response.data;
    }

    async post<T>(url: string, data?: any, contentType?: string): Promise<RawQlResponse<T>> {
        const response = await this.axios.post<RawQlResponse<T>>(`/api/v1${url}`, JSON.stringify(data), {
            headers: {
                "Content-Type": contentType || "application/json"
            }
        });
        return response.data;
    }
}
