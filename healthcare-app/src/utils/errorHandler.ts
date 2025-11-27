import { AxiosError } from 'axios';

export interface UserFriendlyError {
  title: string;
  message: string;
  canRetry: boolean;
}

export class ErrorHandler {
  static handle(error: Error | AxiosError): UserFriendlyError {
    if (this.isAxiosError(error)) {
      return this.handleAPIError(error);
    }
    return this.handleGenericError(error);
  }

  private static isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError === true;
  }

  private static handleAPIError(error: AxiosError): UserFriendlyError {
    const status = error.response?.status;
    const message = (error.response?.data as { message?: string })?.message || error.message;

    switch (status) {
      case 400:
        return {
          title: 'Invalid Request',
          message: message || 'The request was invalid. Please check your input.',
          canRetry: false,
        };
      case 401:
        return {
          title: 'Unauthorized',
          message: 'Please log in again to continue.',
          canRetry: false,
        };
      case 403:
        return {
          title: 'Forbidden',
          message: 'You do not have permission to perform this action.',
          canRetry: false,
        };
      case 404:
        return {
          title: 'Not Found',
          message: 'The requested resource was not found.',
          canRetry: false,
        };
      case 500:
        return {
          title: 'Server Error',
          message: 'An error occurred on the server. Please try again later.',
          canRetry: true,
        };
      case 503:
        return {
          title: 'Service Unavailable',
          message: 'The service is temporarily unavailable. Please try again later.',
          canRetry: true,
        };
      default:
        return {
          title: 'Error',
          message: message || 'Something went wrong. Please try again.',
          canRetry: true,
        };
    }
  }

  private static handleGenericError(error: Error): UserFriendlyError {
    return {
      title: 'Error',
      message: error.message || 'An unexpected error occurred.',
      canRetry: true,
    };
  }
}
