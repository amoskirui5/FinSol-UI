# Organization Management Module

## Overview
This module provides a complete Organization management system that perfectly aligns with your backend API structure. It includes comprehensive CRUD operations, advanced filtering, pagination, and enterprise-grade UI components.

## Backend API Integration

### Endpoints Supported
- `POST /api/Organizations` - Create new organization
- `GET /api/Organizations` - Get organizations with filtering and pagination
- `GET /api/Organizations/{id}` - Get organization by ID
- `PUT /api/Organizations/{id}` - Update organization
- `DELETE /api/Organizations/{id}` - Soft delete organization
- `POST /api/Organizations/{id}/reactivate` - Reactivate organization

### Response Format
All endpoints follow your backend's standard response format:
```typescript
{
  success: boolean;
  message: string;
  errors: string[];
  data: T;
}
```

## File Structure

```
src/
├── types/
│   └── organizationTypes.ts          # TypeScript interfaces matching your backend
├── services/
│   └── organizationService.ts        # API service layer
├── views/
│   ├── OrganizationListPage.tsx      # Data table with filtering
│   ├── OrganizationForm.tsx          # Create/Edit form
│   └── OrganizationManagementPage.tsx # Main container component
└── routing/
    └── organizationRoutes.tsx        # Route configuration example
```

## Features Implemented

### 1. **Organization List Page**
- **Pagination**: Supports pageNumber, pageSize with controls
- **Sorting**: Column-based sorting with backend integration
- **Filtering**: 
  - Organization name search
  - Industry dropdown
  - Country selection
  - Active/Inactive toggle
- **Actions**: View, Edit, Delete, Reactivate
- **Responsive Design**: Works on all screen sizes

### 2. **Organization Form**
- **Comprehensive Form Sections**:
  - Basic Information (Name, Registration, Industry, etc.)
  - Contact Information (Primary contact details)
  - Address Information (Full address with city/country dropdowns)
  - Banking Information (Account details, SWIFT codes)
  - License Information (Number and expiry date)
- **Validation**: 
  - Required field validation
  - Email format validation
  - Date validation
  - Number range validation
- **Different Modes**: Create vs Edit (certain fields disabled in edit mode)

### 3. **Type Safety**
```typescript
// All backend response types defined
interface Organization {
  organizationId: string;
  organizationName: string;
  businessRegistrationNumber: string;
  taxIdentificationNumber: string;
  // ... all fields matching your backend exactly
}

// Separate interfaces for different operations
interface CreateOrganizationRequest { ... }
interface UpdateOrganizationRequest { ... }
interface OrganizationFilters { ... }
```

### 4. **Service Layer**
```typescript
// Complete API integration with error handling
export const createOrganization = async (data: CreateOrganizationRequest): Promise<ApiResponse<Organization>>
export const getOrganizations = async (filters: OrganizationFilters): Promise<PaginatedResponse<Organization>>
export const getOrganizationById = async (id: string): Promise<ApiResponse<Organization>>
export const updateOrganization = async (id: string, data: UpdateOrganizationRequest): Promise<ApiResponse<Organization>>
export const deleteOrganization = async (id: string): Promise<ApiResponse<void>>
export const reactivateOrganization = async (id: string): Promise<ApiResponse<Organization>>
```

## Business Rules Implemented

### Validation Rules
- **Organization Name**: 2-200 characters, required
- **Email**: Valid email format, required
- **Phone**: Required field
- **Established Date**: Cannot be future date
- **License Expiry**: Cannot be past date
- **Employee Count**: Positive number

### UI Business Logic
- **Create Mode**: All fields editable, registration numbers required
- **Edit Mode**: Registration numbers read-only (as per backend spec)
- **Status Management**: Delete = soft delete, Reactivate option for inactive
- **Form Reset**: Clears all fields to initial state

## Enterprise UI Features

### Design System Integration
- **Enterprise Theme**: Uses your custom CSS variables
- **Consistent Components**: PageHeader, EnterpriseButton, etc.
- **Professional Styling**: Cards, tables, forms all styled consistently
- **Responsive Design**: Mobile-first approach

### User Experience
- **Loading States**: Proper loading indicators during API calls
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Toast notifications for operations
- **Confirmation Dialogs**: For destructive actions
- **Search & Filter**: Real-time filtering with debouncing

### Accessibility
- **ARIA Labels**: Proper screen reader support
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear focus indicators
- **Color Contrast**: High contrast for text readability

## Usage Examples

### 1. Basic Integration
```tsx
// In your main routing file
import OrganizationManagementPage from './views/OrganizationManagementPage';

<Route path="/organizations" element={<OrganizationManagementPage />} />
```

### 2. Custom Integration
```tsx
// Custom usage with callbacks
<OrganizationListPage
  onCreate={() => handleCreate()}
  onEdit={(org) => handleEdit(org)}
  onView={(org) => handleView(org)}
/>
```

### 3. Form Integration
```tsx
// Standalone form usage
<OrganizationForm
  organizationId="uuid-here" // For edit mode
  onSuccess={(org) => handleSuccess(org)}
  onCancel={() => handleCancel()}
/>
```

## Environment Configuration

### Required Environment Variables
```env
# Backend API base URL
VITE_API_BASE_URL=https://localhost:7079

# Optional: API timeout settings
VITE_API_TIMEOUT=30000
```

### Backend URL Configuration
The service automatically uses the environment variable or falls back to `https://localhost:7079` as per your API specification.

## Data Flow

### Create Organization Flow
1. User fills form → Form validation → API call to `POST /api/Organizations`
2. Backend validates → Creates organization → Returns success/error
3. UI shows success message → Refreshes list → Closes form

### Update Organization Flow
1. Load organization → Populate form → User edits → Form validation
2. API call to `PUT /api/Organizations/{id}` → Backend updates
3. Success feedback → List refresh

### Delete/Reactivate Flow
1. User confirms action → API call to `DELETE` or `POST .../reactivate`
2. Backend soft deletes/reactivates → Returns success
3. List refreshes with updated status

## Error Handling Strategy

### API Errors
- Network errors: "Please check your connection"
- Validation errors: Display specific field errors
- Server errors: Show backend error message
- Timeout errors: "Request timed out, please try again"

### Form Validation
- Client-side validation for immediate feedback
- Server-side validation errors displayed inline
- Required field highlighting
- Format validation (email, dates, numbers)

## Performance Considerations

### Optimization Features
- **Lazy Loading**: Components loaded on demand
- **Pagination**: Large datasets handled efficiently
- **Debounced Search**: Reduces API calls during typing
- **Memoization**: Prevents unnecessary re-renders
- **Error Boundaries**: Graceful error handling

### Bundle Size
- Tree-shaking compatible
- Minimal external dependencies
- Efficient import statements

## Future Enhancements

### Planned Features
1. **Bulk Operations**: Select multiple organizations for actions
2. **Export Functionality**: CSV/Excel export with filtering
3. **Import Functionality**: Bulk import from files
4. **Advanced Filtering**: Date ranges, custom filters
5. **Organization Hierarchy**: Parent-child relationships
6. **Document Management**: Logo upload, file attachments
7. **Audit Trail**: Track all organization changes

### Integration Points
- **Reporting Module**: Organization-based reports
- **User Management**: Link users to organizations
- **Member Management**: Organization-member relationships
- **Financial Reports**: Organization financial data

## Testing Strategy

### Unit Tests (Recommended)
```typescript
// Test service layer
describe('organizationService', () => {
  it('should create organization successfully', async () => {
    // Test implementation
  });
});

// Test components
describe('OrganizationForm', () => {
  it('should validate required fields', () => {
    // Test implementation
  });
});
```

### Integration Tests
- API endpoint testing
- Form submission flows
- Error handling scenarios
- Pagination and filtering

## Deployment Notes

### Build Requirements
- Node.js 16+
- TypeScript 4.5+
- Vite build tool

### Production Considerations
- Environment variable configuration
- API endpoint security (HTTPS)
- Error monitoring integration
- Performance monitoring

This Organization module provides a complete, enterprise-grade solution that perfectly matches your backend API structure and follows modern React/TypeScript best practices.
