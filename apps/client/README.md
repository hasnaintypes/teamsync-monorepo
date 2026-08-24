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
│   └── reusable/        # Generic reusable components
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

> **Note:** This package lives at `apps/client` inside the [teamsync-monorepo](https://github.com/hasnaintypes/teamsync-monorepo) Turborepo workspace. Dependencies are installed once from the repository root via `pnpm install`.

### Prerequisites

- Node.js (v22 or higher, see root `.nvmrc`)
- [pnpm](https://pnpm.io/) (v10 or higher)

### Installation

1. Clone the monorepo and install all workspace dependencies from the root:

```bash
git clone https://github.com/hasnaintypes/teamsync-monorepo.git
cd teamsync-monorepo
pnpm install
```

2. Environment Configuration:

```bash
cd apps/client
cp .env.example .env
```

3. Configure environment variables in `.env`:

```env
VITE_API_BASE_URL="http://localhost:8000/api"
```

### Development Commands

Run these via `pnpm --filter team-sync-client <script>` from the repo root, or directly with `pnpm run <script>` from within `apps/client`:

```bash
# Start development server
pnpm --filter team-sync-client dev

# Build for production (type-checks with tsc -b, then vite build)
pnpm --filter team-sync-client build

# Preview production build
pnpm --filter team-sync-client preview

# Run ESLint (--max-warnings=0)
pnpm --filter team-sync-client lint

# Type check only
pnpm --filter team-sync-client type-check
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
pnpm --filter team-sync-client build
```

### Production Considerations

- Environment variable configuration
- API endpoint configuration
- Asset optimization
- Browser compatibility

### Hosting

Deployed on **[Vercel](https://vercel.com/)** with the project's Root Directory set to `apps/client` (see `apps/client/vercel.json`, which runs the build via `pnpm turbo run build --filter=team-sync-client` from the monorepo root for Turborepo caching).

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
