import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string, token?: string) {
    this.client = axios.create({
      baseURL: baseURL ?? import.meta.env.VITE_API_BASE_URL,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  public setToken(token: string): void {
    this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request(config);
      return response.data;
    } catch (error) {
      this.handleRequestError(error);
      throw error;
    }
  }

  public async get<T>(
    endpoint: string,
    params?: object,
    headers?: object
  ): Promise<T> {
    return this.request<T>({ method: 'GET', url: endpoint, params, headers });
  }

  public async post<T>(
    endpoint: string,
    payload?: object,
    headers?: object
  ): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url: endpoint,
      data: payload,
      headers,
    });
  }

  public async put<T>(
    endpoint: string,
    payload?: object,
    headers?: object
  ): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      url: endpoint,
      data: payload,
      headers,
    });
  }

  public async delete<T>(
    endpoint: string,
    params?: object,
    headers?: object
  ): Promise<T> {
    return this.request<T>({
      method: 'DELETE',
      url: endpoint,
      params,
      headers,
    });
  }

  private handleRequestError(error: any): void {
    if (error.response) {
      throw new Error(
        `Request failed with status code ${error.response.status}`
      );
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('An error occurred while setting up the request');
    }
  }
}

const apiClient = new ApiClient(
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
  localStorage.getItem('token') ?? ''
);

export default apiClient;
