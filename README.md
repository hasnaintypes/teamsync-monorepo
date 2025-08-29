# TeamSync Client

A modern React-based frontend application for TeamSync, a collaborative project management platform. Built with TypeScript, Vite, and a comprehensive UI component library.

## Overview

TeamSync Client provides an intuitive interface for team collaboration, project management, and task tracking. The application features workspace management, project organization, team member collaboration, and real-time task management capabilities.

## Technology Stack

### Core Technologies

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **React Router DOM v7** - Client-side routing and navigation

### State Management & Data Fetching

- **TanStack React Query** - Server state management and caching
- **Zustand** - Lightweight client state management
- **React Hook Form** - Form state management and validation
- **Zod** - Schema validation and type inference

### UI Framework & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI component primitives
- **Lucide React** - Beautiful icons and symbols
- **shadcn/ui** - Pre-built accessible components

### Additional Libraries

- **Axios** - HTTP client for API requests
- **Date-fns** - Date manipulation and formatting
- **Emoji Mart** - Emoji picker component
- **Immer** - Immutable state updates

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── asidebar/        # Sidebar navigation components
│   ├── auth/            # Authentication components
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── workspace/       # Workspace-specific components
│   └── resuable/        # Generic reusable components
├── context/             # React context providers
├── hooks/               # Custom React hooks
│   └── api/             # API-specific hooks
├── lib/                 # Utility libraries and configurations
├── pages/               # Page components
├── routes/              # Routing configuration
├── types/               # TypeScript type definitions
├── constants/           # Application constants
└── layout/              # Layout components
```

## Key Features

### Authentication & Authorization

- OAuth integration (Google)
- Role-based access control
- Permission-based UI rendering
- Session management

### Workspace Management

- Create and manage workspaces
- Workspace analytics and insights
- Member invitation and management
- Role and permission assignment

### Project Organization

- Project creation and management
- Project analytics and reporting
- Emoji-based project identification
- Project-specific task organization

### Task Management

- Comprehensive task CRUD operations
- Task status tracking (Backlog, Todo, In Progress, In Review, Done)
- Priority levels (Low, Medium, High)
- Task filtering and search capabilities
- Task analytics and reporting

### UI/UX Features

- Responsive design for all devices
- Dark/light mode support
- Accessible components with ARIA support
- Skeleton loading states
- Toast notifications
- Confirmation dialogs
- Advanced data tables with pagination

## Environment Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository and navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Environment Configuration:

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:

```env
VITE_API_BASE_URL="http://localhost:8000/api"
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production (with type checking)
npm run build

# Build for production (ignore errors)
npm run build:ignore-errors

# Preview production build
npm run preview

# Run ESLint (strict)
npm run lint

# Run ESLint (ignore errors)
npm run lint:ignore

# Type check only
npm run type-check

# Type check (ignore errors)
npm run type-check:ignore
```

## API Integration

The client communicates with the TeamSync server through a RESTful API. Key integration features:

### HTTP Client Configuration

- Axios-based API client with interceptors
- Automatic error handling and authentication
- Request/response transformation
- Timeout and retry mechanisms

### Query Management

- TanStack React Query for server state
- Optimistic updates for better UX
- Background refetching and cache management
- Error boundary integration

### Authentication Flow

- Session-based authentication
- Automatic token refresh
- Redirect handling for unauthorized access
- OAuth integration with external providers

## Component Architecture

### UI Components

Built on Radix UI primitives with custom styling:

- **Form Components**: Input, Select, Textarea, Checkbox
- **Navigation**: Sidebar, Breadcrumb, Pagination
- **Feedback**: Toast, Dialog, Tooltip
- **Data Display**: Table, Card, Avatar, Badge

### Layout System

- Responsive sidebar navigation
- Protected route wrappers
- Permission-based component rendering
- Mobile-optimized layouts

### State Management

- Context providers for global state
- Custom hooks for component logic
- Zustand stores for client state
- React Query for server state

## Performance Optimizations

### Code Splitting

- Route-based code splitting
- Lazy loading of components
- Dynamic imports for heavy libraries

### Caching Strategy

- React Query cache configuration
- Optimistic updates for mutations
- Background data synchronization

### Bundle Optimization

- Vite's automatic tree shaking
- Asset optimization and compression
- Modern JavaScript output

## Development Guidelines

### Code Organization

- Feature-based folder structure
- Separation of concerns
- Reusable component patterns
- Custom hook extraction

### Type Safety

- Comprehensive TypeScript coverage
- API response type definitions
- Form validation schemas
- Error type definitions

### Testing Strategy

- Component unit testing
- Integration testing for forms
- API mocking for development
- End-to-end testing coverage

## Deployment

### Build Process

```bash
npm run build
```

### Production Considerations

- Environment variable configuration
- API endpoint configuration
- Asset optimization
- Browser compatibility

### Hosting Options

- Static site hosting (Vercel, Netlify)
- CDN deployment
- Docker containerization
- Reverse proxy configuration

## Contributing

### Development Workflow

1. Create feature branches from main
2. Follow TypeScript and ESLint conventions
3. Write tests for new components
4. Update documentation as needed

### Code Standards

- ESLint configuration enforcement
- Prettier for code formatting
- Conventional commit messages
- Component documentation

## API Documentation

### Endpoint Structure

- Base URL: `{VITE_API_BASE_URL}`
- Authentication: Session-based
- Response format: JSON
- Error handling: Standardized error responses

### Key API Routes

- Authentication: `/auth/*`
- Workspaces: `/workspace/*`
- Projects: `/project/*`
- Tasks: `/task/*`
- Members: `/member/*`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License. See the LICENSE file for details.
