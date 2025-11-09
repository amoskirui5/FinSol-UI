import { BaseResponseDTO } from '../BaseResponseDTO';

// System Settings DTOs
export interface GeneralSetting {
  settingId: string;
  settingKey: string;
  settingValue: string;
  description: string;
  category: string;
  dataType: 'string' | 'number' | 'boolean' | 'json';
  isRequired: boolean;
  isEncrypted: boolean;
  lastModified: string;
  modifiedBy: string;
}

export interface SystemConfiguration {
  organizationName: string;
  organizationLogo?: string;
  timezone: string;
  currency: string;
  currencySymbol: string;
  dateFormat: string;
  timeFormat: string;
  fiscalYearStart: string;
  defaultLanguage: string;
  maxLoginAttempts: number;
  sessionTimeout: number;
  enableAuditLog: boolean;
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
  backupRetentionDays: number;
  maintenanceMode: boolean;
  systemVersion: string;
}

export interface UpdateSystemConfigurationRequest {
  organizationName?: string;
  organizationLogo?: string;
  timezone?: string;
  currency?: string;
  currencySymbol?: string;
  dateFormat?: string;
  timeFormat?: string;
  fiscalYearStart?: string;
  defaultLanguage?: string;
  maxLoginAttempts?: number;
  sessionTimeout?: number;
  enableAuditLog?: boolean;
  enableEmailNotifications?: boolean;
  enableSmsNotifications?: boolean;
  backupRetentionDays?: number;
  maintenanceMode?: boolean;
}

// Email Settings DTOs
export interface EmailSettings {
  settingId: string;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword?: string; // Encrypted on backend
  useSSL: boolean;
  useTLS: boolean;
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;
  isEnabled: boolean;
  maxEmailsPerHour: number;
  emailTemplates: EmailTemplate[];
}

export interface EmailTemplate {
  templateId: string;
  templateName: string;
  templateType: 'welcome' | 'password_reset' | 'loan_approval' | 'payment_reminder' | 'custom';
  subject: string;
  body: string;
  isActive: boolean;
  variables: string[];
}

export interface UpdateEmailSettingsRequest {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword?: string;
  useSSL: boolean;
  useTLS: boolean;
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;
  isEnabled: boolean;
  maxEmailsPerHour: number;
}

export interface TestEmailRequest {
  toEmail: string;
  subject: string;
  body: string;
}

// Backup & Restore DTOs
export interface BackupInfo {
  backupId: string;
  backupName: string;
  backupType: 'full' | 'incremental' | 'differential';
  backupSize: number;
  createdDate: string;
  createdBy: string;
  status: 'completed' | 'in_progress' | 'failed';
  filePath: string;
  description?: string;
  expiryDate?: string;
}

export interface CreateBackupRequest {
  backupName: string;
  backupType: 'full' | 'incremental' | 'differential';
  description?: string;
  includeFiles: boolean;
  includeDatabase: boolean;
  scheduleBackup: boolean;
  scheduleTime?: string;
}

export interface RestoreRequest {
  backupId: string;
  restoreToDate?: string;
  overwriteExisting: boolean;
  restoreFiles: boolean;
  restoreDatabase: boolean;
  confirmRestore: boolean;
}

// Password Policy DTOs
export interface PasswordPolicy {
  policyId: string;
  minimumLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialCharacters: boolean;
  forbidCommonPasswords: boolean;
  passwordHistoryCount: number;
  passwordExpiryDays: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  requirePasswordChangeOnFirstLogin: boolean;
  isActive: boolean;
  lastModified: string;
}

export interface UpdatePasswordPolicyRequest {
  minimumLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialCharacters: boolean;
  forbidCommonPasswords: boolean;
  passwordHistoryCount: number;
  passwordExpiryDays: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  requirePasswordChangeOnFirstLogin: boolean;
}

// Two-Factor Authentication DTOs
export interface TwoFactorSettings {
  settingId: string;
  isEnabled: boolean;
  requireForAllUsers: boolean;
  allowedMethods: ('sms' | 'email' | 'authenticator')[];
  defaultMethod: 'sms' | 'email' | 'authenticator';
  codeLength: number;
  codeExpiryMinutes: number;
  maxAttempts: number;
  backupCodesCount: number;
}

export interface EnableTwoFactorRequest {
  method: 'sms' | 'email' | 'authenticator';
  phoneNumber?: string;
  email?: string;
  verificationCode: string;
}

export interface TwoFactorVerificationRequest {
  userId: string;
  code: string;
  method: 'sms' | 'email' | 'authenticator';
}

export interface GenerateBackupCodesRequest {
  userId: string;
  password: string;
}

// Audit Trail DTOs
export interface AuditTrail {
  auditId: string;
  userId: string;
  username: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  sessionId: string;
  additionalData?: Record<string, any>;
}

export interface AuditTrailFilter {
  userId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  startDate?: string;
  endDate?: string;
  ipAddress?: string;
}

// Response DTOs
export interface GeneralSettingsResponse extends BaseResponseDTO {
  data: GeneralSetting[];
}

export interface SystemConfigurationResponse extends BaseResponseDTO {
  data: SystemConfiguration;
}

export interface EmailSettingsResponse extends BaseResponseDTO {
  data: EmailSettings;
}

export interface BackupInfoResponse extends BaseResponseDTO {
  data: {
    items: BackupInfo[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface PasswordPolicyResponse extends BaseResponseDTO {
  data: PasswordPolicy;
}

export interface TwoFactorSettingsResponse extends BaseResponseDTO {
  data: TwoFactorSettings;
}

export interface AuditTrailResponse extends BaseResponseDTO {
  data: {
    items: AuditTrail[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
}