import axios, { AxiosRequestConfig } from 'axios';
import querystring from 'querystring';

interface OAuth2Options {
    clientId: string;
    clientSecret: string;
    accessTokenUrl: string;
    refreshTokenUrl: string;
}

interface TokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
}

export class OAuth2Client {
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly accessTokenUrl: string;
    private readonly refreshTokenUrl: string;
    private accessToken: string | null;
    private accessTokenExpiryTime: number;
    private refreshToken: string | null;

    constructor(options: OAuth2Options) {
        this.clientId = options.clientId;
        this.clientSecret = options.clientSecret;
        this.accessTokenUrl = options.accessTokenUrl;
        this.refreshTokenUrl = options.refreshTokenUrl;
        this.accessToken = null;
        this.accessTokenExpiryTime = 0;
        this.refreshToken = null;
    }

    private async requestAccessToken(): Promise<void> {
        const response = await axios.post<TokenResponse>(this.accessTokenUrl,
            querystring.stringify({
                grant_type: 'client_credentials',
                client_id: this.clientId,
                client_secret: this.clientSecret,
            }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        this.accessToken = response.data.access_token;
        this.accessTokenExpiryTime = Date.now() + response.data.expires_in * 1000;
        this.refreshToken = response.data.refresh_token || null;
    }

    private async refreshAccessToken(): Promise<void> {
        if (!this.refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await axios.post<TokenResponse>(this.refreshTokenUrl,
            querystring.stringify({
                grant_type: 'refresh_token',
                refresh_token: this.refreshToken,
                client_id: this.clientId,
                client_secret: this.clientSecret,
            }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        this.accessToken = response.data.access_token;
        this.accessTokenExpiryTime = Date.now() + response.data.expires_in * 1000;
        this.refreshToken = response.data.refresh_token || null;
    }

    private async getAccessToken(): Promise<string> {
        if (this.accessToken && Date.now() < this.accessTokenExpiryTime) {
            return this.accessToken;
        }

        try {
            if (!this.refreshToken) {
                await this.requestAccessToken();
            } else {
                await this.refreshAccessToken();
            }

            return this.accessToken as string;
        } catch (error) {
            this.accessToken = null;
            this.accessTokenExpiryTime = 0;
            this.refreshToken = null;
            throw error;
        }
    }

    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const token = await this.getAccessToken();
        const headers = { Authorization: `Bearer ${token}` };
        return axios.get<T>(url, { ...config, headers }).then((response) => response.data);
    }

    async post<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const token = await this.getAccessToken();
        const headers = { Authorization: `Bearer ${token}` };
        return axios.post<T>(url, data, { ...config, headers }).then((response) => response.data);
    }
}
