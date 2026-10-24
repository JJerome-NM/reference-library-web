import { API_BASE_URL, USE_MOCK_DATA } from "@/src/shared/config/api.config"

interface RequestOptions extends RequestInit {
  mockData?: unknown
  delayMs?: number
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async handleMockDelay(options?: RequestOptions): Promise<void> {
    if (!options?.delayMs) return
    if (options.signal?.aborted) {
      throw new DOMException("The user aborted a request.", "AbortError")
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, options.delayMs)
      if (options.signal) {
        options.signal.addEventListener(
          "abort",
          () => {
            clearTimeout(timer)
            reject(new DOMException("The user aborted a request.", "AbortError"))
          },
          { once: true }
        )
      }
    })
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    if (options?.signal?.aborted) {
      throw new DOMException("The user aborted a request.", "AbortError")
    }

    if (USE_MOCK_DATA && options?.mockData !== undefined) {
      await this.handleMockDelay(options)
      return options.mockData as T
    }

    try {
      const url = path.startsWith("http") ? path : `${this.baseUrl}${path}`
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        signal: options?.signal,
      })

      if (!response.ok) {
        if (options?.mockData !== undefined) {
          return options.mockData as T
        }
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      return (await response.json()) as T
    } catch (error) {
      if (options?.signal?.aborted || (error instanceof Error && error.name === "AbortError")) {
        throw error
      }
      if (options?.mockData !== undefined) {
        return options.mockData as T
      }
      throw error
    }
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    if (options?.signal?.aborted) {
      throw new DOMException("The user aborted a request.", "AbortError")
    }

    if (USE_MOCK_DATA && options?.mockData !== undefined) {
      await this.handleMockDelay(options)
      return options.mockData as T
    }

    try {
      const url = path.startsWith("http") ? path : `${this.baseUrl}${path}`
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: options?.signal,
      })

      if (!response.ok) {
        if (options?.mockData !== undefined) {
          return options.mockData as T
        }
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      return (await response.json()) as T
    } catch (error) {
      if (options?.signal?.aborted || (error instanceof Error && error.name === "AbortError")) {
        throw error
      }
      if (options?.mockData !== undefined) {
        return options.mockData as T
      }
      throw error
    }
  }
}

export const apiClient = new ApiClient()
