import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FirebaseError } from "firebase/app";
import { BehaviorSubject, EMPTY, Observable, ObservableInput, delay, filter, mergeMap, of, throwError } from "rxjs";
import { EventLogService } from "../eventLog/event-log.service";
import { EventType } from "../dataModels/loggingModels/event-logging.model";

interface SystemError {
    id: string;
    timestamp: Date;
    operation: string;
    message: string;
    originalError?: any;
    retryCount: number;
    context?: any;
  }

@Injectable({ providedIn: 'root' })
export class ErrorHandlingService {
  // Use BehaviorSubject to maintain current error state
  private readonly errorSubject = new BehaviorSubject<SystemError | null>(null);
  readonly errors$ = this.errorSubject.asObservable();

  constructor(
    private snackBar: MatSnackBar,
    private eventLog: EventLogService
  ) {
    // Subscribe to errors to show them in UI
    this.errors$.pipe(
      filter(error => !!error)
    ).subscribe(error => {
      if (error) {
        this.showError(error);
      }
    });
  }

  // Define our error structure
  

  /**
   * Main error handler that can be used in RxJS pipes
   */
  handleError<T>(operation: string, fallbackValue: T): ObservableInput<T> {
      const systemError: SystemError = {
        id: crypto.randomUUID(), // Generate unique error ID
        timestamp: new Date(),
        operation,
        message: this.getErrorMessage(Error),
        originalError: Error,
        retryCount: 0,
        context: { operation, fallbackValue }
      };

      // Check if we should retry the operation
      if (this.shouldRetry(systemError)) {
        systemError.retryCount++;
        return of(Error).pipe(
          delay(1000), // Wait 1 second before retry
          mergeMap(() => throwError(() => Error))
        );
      }

      // Log the error
      this.logError(systemError);

      // Emit the error
      this.errorSubject.next(systemError);

      // Notify other parts of the system
      this.eventLog.logError(EventType.SYSTEM_ERROR, systemError);

      // Return fallback value if provided, otherwise empty
      return of(fallbackValue);
    
  }

  /**
   * Clear current error
   */
  clearError(): void {
    this.errorSubject.next(null);
  }

  /**
   * Determine if an operation should be retried
   */
  private shouldRetry(error: SystemError): boolean {
    // Add retry logic based on error type
    // For now, just retry network errors up to 3 times
    if (error.originalError?.name === 'NetworkError' && error.retryCount < 3) {
      return true;
    }
    return false;
  }

  /**
   * Convert various error types to user-friendly messages
   */
  private getErrorMessage(error: any): string {
    if (error instanceof FirebaseError) {
      // Handle Firebase specific errors
      return this.getFirebaseErrorMessage(error);
    }

    if (error instanceof HttpErrorResponse) {
      // Handle HTTP errors
      return `Server error: ${error.message}`;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred';
  }

  /**
   * Handle Firebase-specific error messages
   */
  private getFirebaseErrorMessage(error: FirebaseError): string {
    switch (error.code) {
      case 'permission-denied':
        return 'You do not have permission to perform this action';
      case 'not-found':
        return 'The requested resource was not found';
      case 'already-exists':
        return 'This record already exists';
      default:
        return error.message;
    }
  }

  /**
   * Show error in UI
   */
  private showError(error: SystemError): void {
    this.snackBar.open(
      error.message,
      'Dismiss',
      {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      }
    );
  }

  /**
   * Log error for debugging
   */
  private logError(error: SystemError): void {
    // In development
    console.error('System Error:', error);

    // TODO: Add production error logging service
    // this.loggingService.logError(error);
  }
}