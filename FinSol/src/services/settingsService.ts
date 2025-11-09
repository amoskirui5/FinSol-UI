import axiosInstance from '../interceptors/globaInterceptor';
import {
  GET_GENERAL_SETTINGS,
  UPDATE_GENERAL_SETTINGS,
  GET_SYSTEM_CONFIGURATION,
  UPDATE_SYSTEM_CONFIGURATION,
  GET_EMAIL_SETTINGS,
  UPDATE_EMAIL_SETTINGS,
  TEST_EMAIL_SETTINGS,
  GET_EMAIL_TEMPLATES,
  UPDATE_EMAIL_TEMPLATE,
  GET_BACKUPS,
  CREATE_BACKUP,
  DELETE_BACKUP,
  DOWNLOAD_BACKUP,
  RESTORE_BACKUP,
  GET_PASSWORD_POLICY,
  UPDATE_PASSWORD_POLICY,
  GET_TWO_FACTOR_SETTINGS,
  UPDATE_TWO_FACTOR_SETTINGS,
  ENABLE_TWO_FACTOR,
  VERIFY_TWO_FACTOR,
  GENERATE_BACKUP_CODES,
  GET_AUDIT_TRAIL,
  EXPORT_AUDIT_TRAIL
} from '../constants/apiEndpoints';
import {
  GeneralSettingsResponse,
  SystemConfigurationResponse,
  UpdateSystemConfigurationRequest,
  EmailSettingsResponse,
  UpdateEmailSettingsRequest,
  TestEmailRequest,
  BackupInfoResponse,
  CreateBackupRequest,
  RestoreRequest,
  PasswordPolicyResponse,
  UpdatePasswordPolicyRequest,
  TwoFactorSettingsResponse,
  EnableTwoFactorRequest,
  TwoFactorVerificationRequest,
  GenerateBackupCodesRequest,
  AuditTrailResponse,
  AuditTrailFilter
} from '../types/Settings/settingsTypes';
import { PaginationOptions } from '../types/paginationTypes';

// General Settings Services
export const getGeneralSettings = async (): Promise<GeneralSettingsResponse> => {
  const response = await axiosInstance.get(GET_GENERAL_SETTINGS);
  return response.data;
};

export const updateGeneralSettings = async (settings: Record<string, any>): Promise<GeneralSettingsResponse> => {
  const response = await axiosInstance.put(UPDATE_GENERAL_SETTINGS, settings);
  return response.data;
};

export const getSystemConfiguration = async (): Promise<SystemConfigurationResponse> => {
  const response = await axiosInstance.get(GET_SYSTEM_CONFIGURATION);
  return response.data;
};

export const updateSystemConfiguration = async (config: UpdateSystemConfigurationRequest): Promise<SystemConfigurationResponse> => {
  const response = await axiosInstance.put(UPDATE_SYSTEM_CONFIGURATION, config);
  return response.data;
};

// Email Settings Services
export const getEmailSettings = async (): Promise<EmailSettingsResponse> => {
  const response = await axiosInstance.get(GET_EMAIL_SETTINGS);
  return response.data;
};

export const updateEmailSettings = async (settings: UpdateEmailSettingsRequest): Promise<EmailSettingsResponse> => {
  const response = await axiosInstance.put(UPDATE_EMAIL_SETTINGS, settings);
  return response.data;
};

export const testEmailSettings = async (testData: TestEmailRequest): Promise<void> => {
  await axiosInstance.post(TEST_EMAIL_SETTINGS, testData);
};

export const getEmailTemplates = async (): Promise<any> => {
  const response = await axiosInstance.get(GET_EMAIL_TEMPLATES);
  return response.data;
};

export const updateEmailTemplate = async (templateId: string, templateData: any): Promise<any> => {
  const response = await axiosInstance.put(`${UPDATE_EMAIL_TEMPLATE}/${templateId}`, templateData);
  return response.data;
};

// Backup & Restore Services
export const getBackups = async (options: PaginationOptions): Promise<BackupInfoResponse> => {
  const response = await axiosInstance.get(GET_BACKUPS, {
    params: {
      pageNumber: options.pageNumber,
      pageSize: options.pageSize,
      searchTerm: options.searchTerm,
    },
  });
  return response.data;
};

export const createBackup = async (backupData: CreateBackupRequest): Promise<void> => {
  await axiosInstance.post(CREATE_BACKUP, backupData);
};

export const deleteBackup = async (backupId: string): Promise<void> => {
  await axiosInstance.delete(`${DELETE_BACKUP}/${backupId}`);
};

export const downloadBackup = async (backupId: string): Promise<Blob> => {
  const response = await axiosInstance.get(`${DOWNLOAD_BACKUP}/${backupId}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const restoreBackup = async (restoreData: RestoreRequest): Promise<void> => {
  await axiosInstance.post(RESTORE_BACKUP, restoreData);
};

// Password Policy Services
export const getPasswordPolicy = async (): Promise<PasswordPolicyResponse> => {
  const response = await axiosInstance.get(GET_PASSWORD_POLICY);
  return response.data;
};

export const updatePasswordPolicy = async (policy: UpdatePasswordPolicyRequest): Promise<PasswordPolicyResponse> => {
  const response = await axiosInstance.put(UPDATE_PASSWORD_POLICY, policy);
  return response.data;
};

// Two-Factor Authentication Services
export const getTwoFactorSettings = async (): Promise<TwoFactorSettingsResponse> => {
  const response = await axiosInstance.get(GET_TWO_FACTOR_SETTINGS);
  return response.data;
};

export const updateTwoFactorSettings = async (settings: any): Promise<TwoFactorSettingsResponse> => {
  const response = await axiosInstance.put(UPDATE_TWO_FACTOR_SETTINGS, settings);
  return response.data;
};

export const enableTwoFactor = async (data: EnableTwoFactorRequest): Promise<void> => {
  await axiosInstance.post(ENABLE_TWO_FACTOR, data);
};

export const verifyTwoFactor = async (data: TwoFactorVerificationRequest): Promise<void> => {
  await axiosInstance.post(VERIFY_TWO_FACTOR, data);
};

export const generateBackupCodes = async (data: GenerateBackupCodesRequest): Promise<any> => {
  const response = await axiosInstance.post(GENERATE_BACKUP_CODES, data);
  return response.data;
};

// Audit Trail Services
export const getAuditTrail = async (filter: AuditTrailFilter, options: PaginationOptions): Promise<AuditTrailResponse> => {
  const response = await axiosInstance.get(GET_AUDIT_TRAIL, {
    params: {
      ...filter,
      pageNumber: options.pageNumber,
      pageSize: options.pageSize,
      searchTerm: options.searchTerm,
    },
  });
  return response.data;
};

export const exportAuditTrail = async (filter: AuditTrailFilter, format: 'excel' | 'pdf'): Promise<Blob> => {
  const response = await axiosInstance.get(EXPORT_AUDIT_TRAIL, {
    params: { ...filter, format },
    responseType: 'blob',
  });
  return response.data;
};