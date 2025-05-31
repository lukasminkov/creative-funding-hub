import { DebugLogEntry } from '@/types/campaign.types';

class DebugLogger {
  private logs: DebugLogEntry[] = [];
  private isEnabled: boolean;
  private maxLogs: number = 1000;

  constructor() {
    this.isEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEBUG === 'true';
  }

  private createLogEntry(
    level: DebugLogEntry['level'],
    category: string,
    message: string,
    data?: any
  ): DebugLogEntry {
    return {
      timestamp: new Date(),
      level,
      category,
      message,
      data
    };
  }

  private addLog(entry: DebugLogEntry) {
    if (!this.isEnabled) return;

    this.logs.push(entry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output with formatting
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.category}]`;
    
    switch (entry.level) {
      case 'error':
        console.error(prefix, entry.message, entry.data || '');
        break;
      case 'warn':
        console.warn(prefix, entry.message, entry.data || '');
        break;
      case 'info':
        console.info(prefix, entry.message, entry.data || '');
        break;
      case 'debug':
        console.debug(prefix, entry.message, entry.data || '');
        break;
    }
  }

  // Public logging methods
  info(category: string, message: string, data?: any) {
    this.addLog(this.createLogEntry('info', category, message, data));
  }

  warn(category: string, message: string, data?: any) {
    this.addLog(this.createLogEntry('warn', category, message, data));
  }

  error(category: string, message: string, data?: any) {
    this.addLog(this.createLogEntry('error', category, message, data));
  }

  debug(category: string, message: string, data?: any) {
    this.addLog(this.createLogEntry('debug', category, message, data));
  }

  // Campaign-specific logging methods
  campaignValidation(message: string, data?: any) {
    this.debug('CAMPAIGN_VALIDATION', message, data);
  }

  campaignFormState(message: string, data?: any) {
    this.debug('CAMPAIGN_FORM', message, data);
  }

  campaignSubmission(message: string, data?: any) {
    this.info('CAMPAIGN_SUBMISSION', message, data);
  }

  campaignError(message: string, error?: any) {
    this.error('CAMPAIGN_ERROR', message, error);
  }

  // Development utilities
  getLogs(category?: string, level?: DebugLogEntry['level']): DebugLogEntry[] {
    let filteredLogs = this.logs;

    if (category) {
      filteredLogs = filteredLogs.filter(log => log.category === category);
    }

    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }

    return filteredLogs;
  }

  clearLogs() {
    this.logs = [];
    console.clear();
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Performance timing
  startTimer(category: string, operation: string): () => void {
    const startTime = performance.now();
    this.debug(category, `Started: ${operation}`);
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.debug(category, `Completed: ${operation} (${duration.toFixed(2)}ms)`);
    };
  }
}

// Create singleton instance
export const debugLogger = new DebugLogger();

// Convenience exports
export const logCampaignValidation = (message: string, data?: any) => 
  debugLogger.campaignValidation(message, data);

export const logCampaignFormState = (message: string, data?: any) => 
  debugLogger.campaignFormState(message, data);

export const logCampaignSubmission = (message: string, data?: any) => 
  debugLogger.campaignSubmission(message, data);

export const logCampaignError = (message: string, error?: any) => 
  debugLogger.campaignError(message, error);
