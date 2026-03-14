import { AnalysisResults } from "@/components/ResultsDisplay";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ProfileResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "@/types/auth";
import { ENV } from "@/config/environment";

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function buildApiUrl(baseUrl: string, endpoint: string): string {
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
  return `${baseUrl}${normalizedEndpoint}`;
}

const API_BASE_URL = normalizeBaseUrl(ENV.api.baseUrl);
const isMockMode = import.meta.env.VITE_MOCK_API === "true";
const RATE_LIMIT_MESSAGE =
  "You have reached the daily request limit. Please try again later.";

// Mock response functions for development testing
const mockResponses: Record<string, { success: boolean; data: unknown }> = {
  "/api/ai/chat": {
    success: true,
    data: {
      message:
        "This is a mock response for development testing. The backend is not available, but you can continue testing the UI.",
      threadId: "mock-thread-123",
    },
  },
  "/api/ai/review-text": {
    success: true,
    data: {
      summary: "Mock code analysis completed successfully",
      issues: [
        {
          type: "suggestion",
          severity: "low",
          description:
            "Consider using const instead of let for variables that don't change",
          suggestion: "Replace 'let' with 'const' where appropriate",
        },
      ],
      suggestions: [
        "Add error handling",
        "Consider using TypeScript interfaces",
      ],
      securityConcerns: [],
      codeQuality: {
        readability: 8,
        maintainability: 7,
        complexity: "Low",
      },
      threadId: "mock-analysis-123",
      filesAnalyzed: [
        {
          filename: "example.js",
          language: "javascript",
          size: 1024,
        },
      ],
    },
  },
  "/api/ai/review-files": {
    success: true,
    data: {
      summary: "Mock file analysis completed successfully",
      issues: [],
      suggestions: ["Files analyzed successfully in mock mode"],
      securityConcerns: [],
      codeQuality: {
        readability: 9,
        maintainability: 8,
        complexity: "Low",
      },
      threadId: "mock-files-123",
      filesAnalyzed: [
        {
          filename: "test.js",
          language: "javascript",
          size: 2048,
        },
      ],
    },
  },
  "/api/ai/languages": {
    success: true,
    data: [
      "javascript",
      "typescript",
      "python",
      "java",
      "csharp",
      "cpp",
      "go",
      "rust",
      "php",
      "ruby",
    ],
  },
  "/api/ai/guidelines": {
    success: true,
    data: {
      guidelines: [
        "Use meaningful variable names",
        "Add proper error handling",
        "Write comprehensive tests",
        "Follow consistent code formatting",
        "Document complex logic",
      ],
    },
  },
  "/api/auth/login": {
    success: true,
    data: {
      message: "Login successful",
      user: {
        id: 1,
        name: "Mock User",
        email: "user@example.com",
        created_at: "2025-01-01T00:00:00.000Z",
      },
      token: "mock-jwt-token-12345",
    },
  },
  "/api/auth/register": {
    success: true,
    data: {
      message: "User registered successfully",
      user: {
        id: 1,
        name: "Mock User",
        email: "user@example.com",
        created_at: "2025-01-01T00:00:00.000Z",
      },
      token: "mock-jwt-token-12345",
    },
  },
  "/api/auth/profile": {
    success: true,
    data: {
      message: "Profile retrieved successfully",
      user: {
        id: 1,
        name: "Mock User",
        email: "user@example.com",
        created_at: "2025-01-01T00:00:00.000Z",
        updated_at: "2025-01-01T00:00:00.000Z",
      },
    },
  },
  "/api/auth/logout": {
    success: true,
    data: {
      message: "Logout successful",
    },
  },
  "/api/auth/change-password": {
    success: true,
    data: {
      message: "Password changed successfully",
    },
  },
};

function getMockResponse<T>(endpoint: string): T | null {
  // Remove query parameters for matching
  const baseEndpoint = endpoint.split("?")[0];
  const mockData = mockResponses[baseEndpoint];
  return mockData ? (mockData as T) : null;
}

export interface CodeIssue {
  type: "bug" | "warning" | "suggestion" | "security";
  severity: "low" | "medium" | "high" | "critical";
  line?: number;
  description: string;
  suggestion?: string;
}

export interface CodeQuality {
  readability: number; // 1-10 scale
  maintainability: number; // 1-10 scale
  complexity: string; // Low, Medium, High
}

export interface CodeReviewResult {
  summary: string;
  issues: CodeIssue[];
  suggestions: string[];
  securityConcerns: string[];
  codeQuality: CodeQuality;
  threadId: string;
  filesAnalyzed?: Array<{
    filename: string;
    language: string;
    size: number;
  }>;
}

export interface BackendApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface CodeAnalysisRequest {
  code: string;
  filename?: string;
  threadId?: string;
}

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  threadId?: string;
}

export interface ChatResponse {
  message: string;
  threadId: string;
}

export class ApiError extends Error {
  code?: string;
  status?: number;

  constructor(options: { message: string; code?: string; status?: number }) {
    super(options.message);
    this.name = "ApiError";
    this.code = options.code;
    this.status = options.status;
  }
}

function createApiClient(baseUrl: string) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  type ApiRequestOptions = RequestInit & {
    includeAuth?: boolean;
  };

  const getAuthToken = (): string | null => localStorage.getItem("auth_token");

  const mapApiError = (
    status: number,
    statusText: string,
    errorData: Record<string, unknown>,
  ): ApiError => {
    if (status === 429) {
      return new ApiError({
        message: RATE_LIMIT_MESSAGE,
        status,
        code: "RATE_LIMIT_EXCEEDED",
      });
    }

    const code =
      (typeof errorData.code === "string" && errorData.code) ||
      (typeof errorData.error === "string" && errorData.error) ||
      (status === 401 ? "UNAUTHORIZED" : "API_ERROR");

    const message =
      (typeof errorData.message === "string" && errorData.message) ||
      (typeof errorData.error === "string" && errorData.error) ||
      `HTTP ${status}: ${statusText}`;

    return new ApiError({
      message,
      status,
      code,
    });
  };

  const request = async <T>(
    endpoint: string,
    options: ApiRequestOptions = {},
  ): Promise<T> => {
    const url = buildApiUrl(normalizedBaseUrl, endpoint);
    const { includeAuth = true, ...requestOptions } = options;

    const headers = new Headers(requestOptions.headers || {});
    const isFormDataBody = requestOptions.body instanceof FormData;
    const hasNonFormBody = requestOptions.body !== undefined && !isFormDataBody;

    if (hasNonFormBody && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (includeAuth && !headers.has("Authorization")) {
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    const config: ApiRequestOptions = {
      ...requestOptions,
      headers,
    };

    try {
      // Check if we should use mock responses
      if (isMockMode) {
        if (import.meta.env.PROD) {
          console.warn("[MOCK] VITE_MOCK_API is enabled in production.");
        }
        console.log(`[MOCK] Using mock response for ${endpoint}`);
        const mockResponse = getMockResponse(endpoint);
        if (mockResponse) {
          // Add a small delay to simulate network request
          await new Promise((resolve) => setTimeout(resolve, 500));

          // For chat endpoint, return data directly (not wrapped)
          if (endpoint === "/api/ai/chat") {
            return (mockResponse as { success: boolean; data: T }).data;
          }

          // For auth endpoints, return data directly (not wrapped)
          if (endpoint.startsWith("/api/auth/")) {
            console.log(`🔐 [MOCK] Returning auth mock data for ${endpoint}`);
            return (mockResponse as { success: boolean; data: T }).data;
          }

          // For other endpoints, return the full response structure
          return mockResponse as T;
        } else {
          console.log(`⚠️ [MOCK] No mock response found for ${endpoint}`);
        }
      }

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as Record<
          string,
          unknown
        >;
        throw mapApiError(response.status, response.statusText, errorData);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError({
        message:
          error instanceof Error ? error.message : "Network error occurred",
      });
    }
  };

  return {
    get: <T>(
      endpoint: string,
      headers?: Record<string, string>,
      includeAuth = true,
    ): Promise<T> =>
      request<T>(endpoint, { method: "GET", headers, includeAuth }),

    post: <T>(
      endpoint: string,
      data?: unknown,
      headers?: Record<string, string>,
      includeAuth = true,
    ): Promise<T> =>
      request<T>(endpoint, {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
        headers,
        includeAuth,
      }),

    put: <T>(
      endpoint: string,
      data?: unknown,
      headers?: Record<string, string>,
      includeAuth = true,
    ): Promise<T> =>
      request<T>(endpoint, {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
        headers,
        includeAuth,
      }),

    delete: <T>(
      endpoint: string,
      headers?: Record<string, string>,
      includeAuth = true,
    ): Promise<T> =>
      request<T>(endpoint, { method: "DELETE", headers, includeAuth }),
  };
}

const apiClient = createApiClient(API_BASE_URL);

export const healthApi = {
  async checkStatus(): Promise<{
    status: string;
    version: string;
    endpoints: string[];
  }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new ApiError({
          message: `Health check failed: HTTP ${response.status}`,
          status: response.status,
          code: "HEALTH_CHECK_FAILED",
        });
      }

      clearTimeout(timeoutId);

      return {
        status: "online",
        version: "1.0.0",
        endpoints: [
          "/api/auth/register",
          "/api/auth/login",
          "/api/auth/profile",
          "/api/auth/logout",
          "/api/ai/chat",
          "/api/ai/review-text",
          "/api/ai/review-files",
          "/api/ai/languages",
          "/api/ai/guidelines",
        ],
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError({
          message: "API health check timed out",
          status: 408,
          code: "TIMEOUT",
        });
      }

      throw new ApiError({
        message: "Backend API is not reachable",
        status: 503,
        code: "SERVICE_UNAVAILABLE",
      });
    }
  },

  async checkHealth(): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
  }> {
    return apiClient.get<{ status: string; timestamp: string; uptime: number }>(
      "/health",
      undefined,
      false,
    );
  },
};

export const codeAnalysisApi = {
  async analyzeText(request: CodeAnalysisRequest): Promise<AnalysisResults> {
    const response = await apiClient.post<BackendApiResponse<CodeReviewResult>>(
      "/api/ai/review-text",
      request,
    );

    return transformCodeReviewToAnalysis(response.data);
  },

  async analyzeFiles(
    files: File[],
    threadId?: string,
  ): Promise<AnalysisResults> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    if (threadId) {
      formData.append("threadId", threadId);
    }

    const token = localStorage.getItem("auth_token");
    const uploadHeaders: Record<string, string> = {};
    if (token) {
      uploadHeaders.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/ai/review-files`, {
      method: "POST",
      headers: uploadHeaders,
      body: formData,
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as Record<
        string,
        unknown
      >;

      if (response.status === 429) {
        throw new ApiError({
          message: RATE_LIMIT_MESSAGE,
          status: response.status,
          code: "RATE_LIMIT_EXCEEDED",
        });
      }

      const code =
        (typeof errorData.code === "string" && errorData.code) ||
        (typeof errorData.error === "string" && errorData.error) ||
        "API_ERROR";
      const message =
        (typeof errorData.message === "string" && errorData.message) ||
        (typeof errorData.error === "string" && errorData.error) ||
        `HTTP ${response.status}: ${response.statusText}`;

      throw new ApiError({
        message,
        status: response.status,
        code,
      });
    }

    const result =
      (await response.json()) as BackendApiResponse<CodeReviewResult>;
    return transformCodeReviewToAnalysis(result.data);
  },

  async getSupportedLanguages(): Promise<{
    supportedExtensions: string[];
    languages: Array<{ extension: string; language: string }>;
    maxFileSize: string;
    maxFiles: number;
  }> {
    const response = await apiClient.get<
      BackendApiResponse<{
        supportedExtensions: string[];
        languages: Array<{ extension: string; language: string }>;
        maxFileSize: string;
        maxFiles: number;
      }>
    >("/api/ai/languages");
    return response.data;
  },

  async getGuidelines(): Promise<{
    reviewCriteria: string[];
    severityLevels: Record<string, string>;
    issueTypes: Record<string, string>;
    tips: string[];
  }> {
    const response = await apiClient.get<
      BackendApiResponse<{
        reviewCriteria: string[];
        severityLevels: Record<string, string>;
        issueTypes: Record<string, string>;
        tips: string[];
      }>
    >("/api/ai/guidelines");
    return response.data;
  },
};

export const chatApi = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post<ChatResponse>(
      "/api/ai/chat",
      request,
    );
    return response;
  },

  async getChatHistory(threadId?: string): Promise<ChatMessage[]> {
    return [];
  },

  async createThread(): Promise<{ threadId: string }> {
    return { threadId: crypto.randomUUID() };
  },

  async deleteThread(threadId: string): Promise<void> {
    return Promise.resolve();
  },
};

function transformCodeReviewToAnalysis(
  data: CodeReviewResult,
): AnalysisResults {
  const securityIssues = data.issues.filter(
    (issue) => issue.type === "security",
  );
  const totalIssues = data.issues.length;
  const highSeverityIssues = data.issues.filter(
    (issue) => issue.severity === "high" || issue.severity === "critical",
  ).length;

  const qualityScore = Math.round(
    (data.codeQuality.readability + data.codeQuality.maintainability) / 2,
  );
  const issuesPenalty = Math.min(highSeverityIssues * 10, 50);
  const overallScore = Math.max(0, qualityScore * 10 - issuesPenalty);

  return {
    summary: {
      score: overallScore,
      issues: totalIssues,
      suggestions: data.suggestions.length,
      securityIssues: securityIssues.length + data.securityConcerns.length,
    },
    issues: data.issues.map((issue) => ({
      id: crypto.randomUUID(),
      severity:
        issue.severity === "critical"
          ? "high"
          : (issue.severity as "high" | "medium" | "low"),
      type:
        issue.type === "warning"
          ? "style"
          : issue.type === "suggestion"
            ? "style"
            : (issue.type as "security" | "performance" | "style" | "bug"),
      title: issue.description,
      description: issue.description,
      line: issue.line || 0,
      suggestion: issue.suggestion || "No specific suggestion provided.",
    })),
    metrics: {
      complexity:
        data.codeQuality.complexity === "Low"
          ? 1
          : data.codeQuality.complexity === "Medium"
            ? 5
            : 9,
      maintainability: data.codeQuality.maintainability,
      testCoverage: 0,
      performance: 5,
    },
    security: {
      vulnerabilities: [
        ...securityIssues.map((issue) => ({
          id: crypto.randomUUID(),
          severity: issue.severity as "critical" | "high" | "medium" | "low",
          title: issue.description,
          description: issue.description,
          recommendation:
            issue.suggestion ||
            "Please review and address this security issue.",
        })),
        ...data.securityConcerns.map((concern) => ({
          id: crypto.randomUUID(),
          severity: "medium" as const,
          title: concern,
          description: concern,
          recommendation: "Please review and address this security concern.",
        })),
      ],
      score:
        data.securityConcerns.length === 0 && securityIssues.length === 0
          ? 95
          : Math.max(
              10,
              95 - (data.securityConcerns.length + securityIssues.length) * 15,
            ),
    },
  };
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isRateLimitError(error: unknown): error is ApiError {
  return error instanceof ApiError && error.code === "RATE_LIMIT_EXCEEDED";
}

export { apiClient };

// Authentication API functions
export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/api/auth/login",
      credentials,
      undefined,
      false,
    );
    return response;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log("🌐 [API] Register request:", {
      url: `${API_BASE_URL}/api/auth/register`,
      data: userData,
    });
    try {
      const response = await apiClient.post<AuthResponse>(
        "/api/auth/register",
        userData,
        undefined,
        false,
      );
      console.log("✅ [API] Register response:", response);
      return response;
    } catch (error) {
      console.error("❌ [API] Register error:", error);
      throw error;
    }
  },

  async getProfile(): Promise<ProfileResponse> {
    const response = await apiClient.get<ProfileResponse>("/api/auth/profile");
    return response;
  },

  async updateProfile(data: UpdateProfileRequest): Promise<ProfileResponse> {
    const response = await apiClient.put<ProfileResponse>(
      "/api/auth/profile",
      data,
    );
    return response;
  },

  async changePassword(
    data: ChangePasswordRequest,
  ): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      "/api/auth/change-password",
      data,
    );
    return response;
  },

  async logout(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      "/api/auth/logout",
      {},
    );
    return response;
  },
};
