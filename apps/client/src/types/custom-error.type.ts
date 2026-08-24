export interface CustomError extends Error {
  errorCode?: string;
  status?: number;
}
