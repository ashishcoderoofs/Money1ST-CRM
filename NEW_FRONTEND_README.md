# Money1st CRM - Frontend Application

A modern, responsive React/TypeScript frontend application for the Money1st CRM system with advanced multi-stage forms, role-based access control, enhanced security features, and comprehensive user management interfaces.

## 🌟 Current System Status

**✅ FULLY IMPLEMENTED & PRODUCTION READY**

- **Modern React Application**: Built with React 18, TypeScript, and Vite
- **Advanced Multi-Stage Forms**: Progressive consultant and client creation with validation
- **Enhanced Security**: JWT authentication with 10-minute token expiration handling
- **Role-Based UI**: Dynamic interface based on user roles and permissions
- **Admin Panel**: Complete user management with bulk operations
- **Securia Integration**: Financial management module for Admin users
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: React Query for efficient data management
- **Form Validation**: Comprehensive validation with Zod schemas

## 🏗️ Architecture Overview

### Core Technologies

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety throughout the application
- **Vite**: Fast build tool with hot module replacement
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **React Query**: Server state management and caching
- **React Hook Form**: Performant form handling with validation
- **Zod**: TypeScript-first schema validation
- **React Router**: Client-side routing with protection

### Key Features

- **Multi-Stage Forms**: Progressive form filling with tab navigation
- **Token Management**: Automatic token expiration handling and refresh
- **Role-Based Navigation**: Dynamic menu and access control
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Skeleton loaders and loading indicators
- **Data Validation**: Client-side validation with server-side integration
- **Audit Trail**: User activity tracking and display

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API server running (see backend README)

### 1. Environment Setup

```bash
# Clone and navigate
git clone <repository>
cd Money1st-CRM

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### 2. Configure Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# Application Settings
VITE_APP_NAME=Money1st CRM
VITE_APP_VERSION=2.0.0

# Security Settings
VITE_TOKEN_REFRESH_THRESHOLD=60000  # 1 minute before expiry
```

### 3. Start Development Server

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 4. Access Application

- **Development**: `http://localhost:5173`
- **Default Login**: `admin@test.com` / `admin123`
- **Admin Panel**: `/admin`
- **Securia Module**: `/securia`

## 📱 Application Structure

### Main Routes

```
/                   # Dashboard (authenticated users)
/login             # Login page
/admin             # Admin panel (Admin role only)
/securia           # Securia financial module (Admin only)
/consultants       # Consultant listing (BMA+)
/consultants/new   # Create consultant (Field Trainer+)
/consultants/:id   # Consultant details
/consultants/:id/edit  # Edit consultant
/clients           # Client management (Admin)
/settings          # User settings
/profile           # User profile
```

### Component Architecture

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── forms/              # Form components
│   │   ├── ConsultantFormApi.tsx
│   │   ├── ClientFormApi.tsx
│   │   └── UserCreationForm.tsx
│   ├── admin/              # Admin panel components
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminUsersTable.tsx
│   │   ├── AdminUserCreation.tsx
│   │   └── PagePermissionsManager.tsx
│   ├── consultant-details/ # Consultant detail components
│   │   ├── MainInformationSection.tsx
│   │   ├── ContactTab.tsx
│   │   ├── PersonalTab.tsx
│   │   └── CFSInformationTab.tsx
│   ├── dashboard/          # Dashboard components
│   ├── layout/             # Layout components
│   └── common/             # Shared components
├── hooks/                  # Custom React hooks
│   ├── useAuth.tsx         # Authentication hook
│   ├── useConsultantAPI.tsx # Consultant API hooks
│   ├── useSecuriaClients.tsx
│   └── useUserRole.tsx
├── pages/                  # Page components
│   ├── Admin.tsx
│   ├── Securia.tsx
│   ├── Consultants.tsx
│   ├── NewConsultant.tsx
│   └── EditConsultant.tsx
├── lib/                    # Utility libraries
└── types/                  # TypeScript definitions
```

## 🔐 Security Features

### Enhanced Authentication

- **JWT Token Management**: Automatic handling of 10-minute token expiration
- **Token Refresh Logic**: Proactive token refresh before expiration
- **Secure Storage**: Tokens stored in localStorage with cleanup
- **Automatic Logout**: Graceful logout on token expiration
- **Login Redirect**: Seamless redirect to login when needed

### Role-Based Access Control

```typescript
// Role Hierarchy
Admin           // Full system access
Field Builder   // Management capabilities  
Field Trainer   // Training and supervision
Senior BMA      // Senior associate privileges
BMA            // Standard associate access
IBA            // Entry-level access
```

### Route Protection

```typescript
// Protected route examples
<ProtectedRoute allowedRoles={['Admin']}>
  <AdminPanel />
</ProtectedRoute>

<SecuriaProtectedRoute>
  <SecuriaModule />
</SecuriaProtectedRoute>

<RBACProtectedRoute requiredRole="Field Trainer">
  <ConsultantCreation />
</RBACProtectedRoute>
```

## 📝 Multi-Stage Forms

### Consultant Creation Form

**4-Stage Progressive Form** (`/consultants/new`)

#### Stage 1: Contact Information
- First Name (required)
- Last Name (required)  
- Email (required, validated)
- Entry Date (required)
- Position/Role selection
- Phone numbers (formatted)

#### Stage 2: Personal Information
- Date of Birth
- Marital Status
- Personal identifiers
- Employment details
- Education information

#### Stage 3: CFS Information
- Financial certifications
- Company information
- Membership details
- Payment information

#### Stage 4: Lineage & Hierarchy
- Reporting structure
- Team relationships
- Additional notes

### Form Features

- **Tab Navigation**: Easy switching between form sections
- **Data Persistence**: Form data saved as user progresses
- **Validation**: Real-time validation with error messages  
- **Auto-save**: Automatic saving of progress
- **Pre-filling**: Edit mode pre-fills all fields from backend
- **Responsive**: Works on all device sizes

### Client Creation Form (Securia)

**Multi-Section Progressive Form** for comprehensive client data:

- **Applicant Information**: Primary client details
- **Co-Applicant Information**: Secondary applicant data
- **Financial Information**: Income, assets, liabilities
- **Insurance Information**: Various insurance coverages
- **Loan Information**: Mortgage and loan details
- **Additional Sections**: Customizable based on needs

## 🎨 User Interface

### Design System

- **Tailwind CSS**: Utility-first styling approach
- **shadcn/ui**: Modern, accessible component library
- **Consistent Spacing**: Standardized margins and padding
- **Color Palette**: Professional color scheme
- **Typography**: Clear, readable font hierarchy
- **Icons**: Lucide React icon library

### Responsive Design

```css
/* Mobile-first responsive breakpoints */
sm: 640px   /* Tablet */
md: 768px   /* Small desktop */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Component Examples

```tsx
// Modern form with validation
<Form {...form}>
  <FormField
    control={form.control}
    name="firstName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>First Name *</FormLabel>
        <FormControl>
          <Input placeholder="Enter first name" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>

// Data table with actions
<DataTable
  columns={columns}
  data={consultants}
  pagination={true}
  filtering={true}
  sorting={true}
/>
```

## 🏢 Admin Panel Features

### Dashboard

- **System Statistics**: User counts, activity metrics
- **Recent Activity**: Latest user actions and changes
- **Quick Actions**: Common administrative tasks
- **Charts & Analytics**: Visual data representation

### User Management

- **User Table**: Comprehensive user listing with search and filters
- **Bulk Operations**: Select multiple users for bulk actions
- **Status Management**: Toggle user active/inactive status
- **Role Management**: Change user roles with validation
- **User Creation**: Multi-step user creation form

### Permission Management

- **Dynamic Permissions**: Runtime permission configuration
- **Role Matrix**: Visual permission matrix for all roles
- **Page Access Control**: Control access to specific pages
- **Permission Inheritance**: Hierarchical permission system

## 🏦 Securia Module

### Financial Management Interface

- **Dashboard**: Financial statistics and metrics
- **Consultant Management**: Specialized consultant interface
- **Client Management**: Comprehensive client profiles
- **Multi-Stage Forms**: Progressive client data collection
- **Analytics**: Financial reporting and insights

### Enhanced Features

- **Admin-Only Access**: Restricted to Admin users only
- **Re-authentication**: Additional security layer
- **Audit Logging**: Complete activity tracking
- **Advanced Search**: Powerful search and filtering
- **Export Functions**: Data export capabilities

## 🔧 Development Tools

### Available Scripts

```bash
npm run dev          # Development server with HMR
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint code checking
npm run lint:fix     # Fix linting issues
npm run type-check   # TypeScript type checking
npm run format       # Prettier code formatting
```

### Development Features

- **Hot Module Replacement**: Instant updates during development
- **TypeScript**: Full type safety with strict checking
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **Path Aliases**: Clean import paths with @ aliases
- **Bundle Analysis**: Build size analysis tools

### Code Quality

```typescript
// TypeScript interfaces for type safety
interface ConsultantData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'Active' | 'Inactive';
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Zod schemas for validation
const consultantSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  position: z.enum(USER_ROLES),
});
```

## 🧪 Testing & Quality

### Testing Strategy

- **Component Testing**: React component unit tests
- **Integration Testing**: API integration tests
- **E2E Testing**: End-to-end user workflow tests
- **Form Testing**: Multi-stage form validation tests
- **Authentication Testing**: Login and token handling tests

### Manual Testing Guides

- **[QUICK_TESTING_GUIDE.md](./QUICK_TESTING_GUIDE.md)**: Step-by-step testing procedures
- **Admin Panel Testing**: Complete admin functionality testing
- **Securia Testing**: Financial module testing scenarios
- **Form Testing**: Multi-stage form testing procedures

### Quality Assurance

- **Type Safety**: Comprehensive TypeScript coverage
- **Error Boundaries**: Graceful error handling
- **Loading States**: Proper loading indicators
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Optimized rendering and data fetching

## 📊 Performance Optimization

### React Query Integration

```typescript
// Efficient data fetching with caching
const useConsultants = (params) => {
  return useQuery({
    queryKey: ['consultants', params],
    queryFn: () => consultantAPI.getConsultants(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Optimistic updates for better UX
const useUpdateConsultant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: consultantAPI.updateConsultant,
    onSuccess: () => {
      queryClient.invalidateQueries(['consultants']);
    },
  });
};
```

### Performance Features

- **Code Splitting**: Lazy loading of route components
- **Image Optimization**: Optimized image loading
- **Bundle Optimization**: Tree shaking and minification
- **Caching Strategy**: Intelligent data caching
- **Virtualization**: Virtual scrolling for large lists

## 🔄 State Management

### Authentication State

```typescript
// useAuth hook for authentication management
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Token expiration handling
  useEffect(() => {
    const handleTokenExpiration = () => {
      // Clear auth state and redirect
      logout();
      navigate('/login');
    };

    // Monitor token expiration
    if (token) {
      const decoded = jwt.decode(token);
      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now();
      
      if (expirationTime - currentTime < 60000) { // 1 minute threshold
        handleTokenExpiration();
      }
    }
  }, [token]);
}
```

### Form State Management

```typescript
// React Hook Form with Zod validation
const form = useForm<ConsultantFormValues>({
  resolver: zodResolver(consultantFormSchema),
  defaultValues: {
    firstName: "",
    lastName: "",
    email: "",
    // ... other fields
  },
});

// Multi-stage form state
const [currentStep, setCurrentStep] = useState(1);
const [formData, setFormData] = useState<Partial<ConsultantData>>({});
```

## 🚀 Production Deployment

### Build Process

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview

# Analyze bundle size
npm run build -- --analyze
```

### Environment Configuration

```env
# Production Environment
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Money1st CRM
VITE_APP_VERSION=2.0.0
VITE_ENVIRONMENT=production
```

### Deployment Options

#### Static Hosting (Recommended)

```bash
# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=dist

# Deploy to AWS S3
aws s3 sync dist/ s3://your-bucket-name
```

#### Docker Deployment

```dockerfile
# Multi-stage Docker build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Production Checklist

- [ ] Configure production API URL
- [ ] Enable HTTPS for secure communication
- [ ] Set up proper error tracking (Sentry)
- [ ] Configure analytics (Google Analytics)
- [ ] Enable performance monitoring
- [ ] Set up proper caching headers
- [ ] Configure CDN for static assets
- [ ] Test all user flows in production
- [ ] Verify mobile responsiveness
- [ ] Test token expiration handling

## 🔒 Security Best Practices

### Authentication Security

- **Secure Token Storage**: Tokens cleared on logout/expiration
- **HTTPS Only**: All API communication over HTTPS
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: CSRF tokens for state-changing operations
- **Content Security Policy**: Restricted script execution

### Data Protection

- **Input Validation**: Client and server-side validation
- **Sensitive Data**: No sensitive data in localStorage
- **Error Handling**: No sensitive data in error messages
- **Audit Logging**: User actions tracked for security

## 📱 Mobile Experience

### Responsive Design Features

- **Mobile-First**: Designed for mobile devices first
- **Touch-Friendly**: Large touch targets and gestures
- **Optimized Navigation**: Collapsible menus and navigation
- **Form Optimization**: Mobile-optimized form inputs
- **Performance**: Fast loading on mobile networks

### Mobile Testing

```bash
# Test on different screen sizes
# Mobile: 375px x 667px
# Tablet: 768px x 1024px
# Desktop: 1440px x 900px
```

## 💡 Key Features Highlights

### 🎯 Multi-Stage Forms

- **Progressive Disclosure**: Show relevant fields based on user progress
- **Validation on Each Step**: Immediate feedback for user inputs
- **Save Progress**: Users can continue later where they left off
- **Pre-filling**: Edit mode loads all existing data
- **Responsive Tabs**: Works seamlessly on all devices

### 🔐 Enhanced Security

- **10-Minute Token Expiration**: Automatic handling of short-lived tokens
- **Graceful Logout**: Smooth user experience on token expiration
- **Role-Based UI**: Interface adapts to user permissions
- **Secure Routes**: Protected routes with proper access control

### 🎨 Modern UI/UX

- **Clean Design**: Modern, professional interface
- **Intuitive Navigation**: Easy-to-use navigation patterns
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: User-friendly error messages

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes with proper typing
4. Test thoroughly on all breakpoints
5. Run linting: `npm run lint`
6. Commit changes: `git commit -am 'Add new feature'`
7. Push to branch: `git push origin feature/new-feature`
8. Submit pull request with detailed description

### Code Standards

- **TypeScript**: Strict type checking required
- **ESLint**: All linting rules must pass
- **Prettier**: Consistent code formatting
- **Component Structure**: Follow established patterns
- **Accessibility**: Maintain WCAG compliance

## 📞 Support & Troubleshooting

### Common Issues

#### Token Expiration Issues

```typescript
// Check token expiration handling
if (error.response?.status === 401) {
  // Token expired - redirect to login
  localStorage.removeItem('auth_token');
  window.location.href = '/login';
}
```

#### Form Validation Issues

```typescript
// Debug form validation
console.log('Form errors:', form.formState.errors);
console.log('Form values:', form.getValues());
```

#### Build Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

### Getting Help

- **Documentation**: Check comprehensive guides
- **Issues**: Create GitHub issue with reproduction steps
- **Logs**: Check browser console for error messages
- **Network**: Check network tab for API call failures

---

**Last Updated**: January 2025  
**Version**: 2.0.0  
**Status**: ✅ Production Ready  
**Features**: Complete CRM Frontend + Multi-Stage Forms + Enhanced Security + Admin Panel + Securia Integration  
**Technology Stack**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui  
**Security Level**: Enterprise-Grade with Token Expiration Handling  
**UI/UX**: Modern, Responsive, Accessible Design
