# DTO Organization Structure

This document describes the organized structure of Data Transfer Objects (DTOs) in the FinSol application.

## Directory Structure

```
src/types/
├── Accounting/
│   └── accountingTypes.ts                 # Account classes, charts of accounts
├── Administration/
│   └── administrationTypes.ts             # User management, roles, permissions, access logs
├── Financials/
│   ├── FinancialTypes.ts                  # Original financial types
│   └── EnhancedFinancialTypes.ts          # Enhanced financial reporting DTOs
├── LoanTypesSettings/
│   ├── loanTypeSettings.ts                # Loan type settings
│   └── loanTypeTypes.ts                   # Loan type definitions
├── Member/
│   └── memberTypes.ts                     # Member information DTOs
├── MemberAccount/
│   └── memberAccountTypes.ts              # Member account DTOs
├── MemberLoan/
│   └── memberLoanTypes.ts                 # Member loan DTOs
├── MemberServices/
│   └── memberServicesTypes.ts             # Enhanced member services (deposits, shares, loans)
├── Organizations/
│   └── organizationTypes.ts               # Organization management DTOs
├── Settings/
│   ├── financialYearTypes.ts              # Financial year settings
│   └── settingsTypes.ts                   # System settings, email, backup, security
├── System/
│   ├── systemRolesTypes.ts                # System roles
│   └── systemUsersTypes.ts                # System users
├── authTypes.ts                           # Authentication types
├── BaseResponseDTO.ts                     # Base response structure
└── paginationTypes.ts                     # Pagination utilities
```

## DTO Categories

### 1. **Accounting** (`types/Accounting/`)
- Account classes and charts of accounts
- Financial account structures
- Accounting-related DTOs

### 2. **Administration** (`types/Administration/`)
- User management (CRUD operations)
- Role-based access control (RBAC)
- Permission management
- System access logs and audit trails

### 3. **Financial Reporting** (`types/Financials/`)
- **FinancialTypes.ts**: Original financial report types
- **EnhancedFinancialTypes.ts**: Advanced financial reporting
  - Profit & Loss statements with comparisons
  - Cash Flow statements
  - Balance Sheet data
  - Financial report requests and responses

### 4. **Loan Management** (`types/LoanTypesSettings/`)
- Loan type definitions and configurations
- Loan settings and parameters
- Interest rate calculations

### 5. **Member Management**
- **Member/**: Basic member information
- **MemberAccount/**: Member account structures
- **MemberLoan/**: Member loan applications and processing

### 6. **Enhanced Member Services** (`types/MemberServices/`)
- Member deposits (savings, fixed deposits, share capital)
- Share capital management and transfers
- Enhanced loan application workflow
- Loan approvals and disbursements

### 7. **Organization Management** (`types/Organizations/`)
- Organization profiles and settings
- Multi-organization support
- Industry and location data

### 8. **System Settings** (`types/Settings/`)
- General system configuration
- Email settings and templates
- Backup and restore functionality
- Password policies and security
- Two-factor authentication
- Audit trail management

### 9. **System Infrastructure** (`types/System/`)
- System user management
- Role definitions
- Core system types

## Import Patterns

All imports have been updated to reflect the new structure:

```typescript
// Before
import { User } from './types/systemUsersTypes';

// After
import { User } from './types/System/systemUsersTypes';
```

## Service Layer Integration

The service files have been updated to work with the new DTO structure:

- `administrationService.ts` → `types/Administration/`
- `settingsService.ts` → `types/Settings/`
- `enhancedFinancialService.ts` → `types/Financials/`
- `memberServicesService.ts` → `types/MemberServices/`

## Benefits of This Organization

1. **Modularity**: Clear separation of concerns
2. **Scalability**: Easy to add new DTOs in appropriate folders
3. **Maintainability**: Related types are grouped together
4. **Team Collaboration**: Different teams can work on specific modules
5. **Backend Integration**: Clear contracts for API development

## Backend API Development

The organized DTOs provide clear contracts for backend API implementation:

1. Each folder represents a business domain
2. Request/Response DTOs are clearly defined
3. Service layer patterns show expected API structure
4. Type safety ensures contract compliance

This structure enables the backend team to implement APIs that exactly match the frontend expectations.