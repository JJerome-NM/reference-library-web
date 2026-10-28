import { API_BASE_URL, USE_MOCK_DATA } from "@/src/shared/config/api.config"

export interface NextFetchOptions {
  revalidate?: number | false
  tags?: string[]
}

export interface RequestOptions extends RequestInit {
  mockData?: unknown
  delayMs?: number
  next?: NextFetchOptions
}

export class HttpError extends Error {
  readonly status: number
  readonly statusText: string
  readonly data?: unknown

  constructor(status: number, statusText: string, data?: unknown) {
    super(`HTTP ${status} ${statusText}`)
    this.name = "HttpError"
    this.status = status
    this.statusText = statusText
    this.data = data
  }
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

  private async parseErrorBody(response: Response): Promise<unknown> {
    try {
      return await response.json()
    } catch {
      try {
        return await response.text()
      } catch {
        return null
      }
    }
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
        next: options?.next,
      })

      if (!response.ok) {
        if (options?.mockData !== undefined) {
          return options.mockData as T
        }
        const errorData = await this.parseErrorBody(response)
        throw new HttpError(response.status, response.statusText, errorData)
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
        next: options?.next,
      })

      if (!response.ok) {
        if (options?.mockData !== undefined) {
          return options.mockData as T
        }
        const errorData = await this.parseErrorBody(response)
        throw new HttpError(response.status, response.statusText, errorData)
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
