// أكواد أخطاء موحّدة لمسارات الذكاء الاصطناعي، تُستخدم في الخادم والواجهة معًا.

export type AIErrorCode =
  | "MISSING_API_KEY"
  | "INVALID_INPUT"
  | "TIMEOUT"
  | "UPSTREAM_ERROR"
  | "INVALID_RESPONSE"
  | "RATE_LIMITED"
  | "UNKNOWN";

export interface AIErrorPayload {
  error: AIErrorCode;
  message: string;
}

const ERROR_STATUS: Record<AIErrorCode, number> = {
  MISSING_API_KEY: 500,
  INVALID_INPUT: 400,
  TIMEOUT: 504,
  UPSTREAM_ERROR: 502,
  INVALID_RESPONSE: 502,
  RATE_LIMITED: 429,
  UNKNOWN: 500,
};

export function aiErrorStatus(code: AIErrorCode): number {
  return ERROR_STATUS[code] ?? 500;
}

export class AIServiceError extends Error {
  code: AIErrorCode;

  constructor(code: AIErrorCode, message: string) {
    super(message);
    this.name = "AIServiceError";
    this.code = code;
  }
}
