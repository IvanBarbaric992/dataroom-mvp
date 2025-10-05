# 📁 Data Room MVP

A modern, production-ready virtual data room application built with React, TypeScript, and cutting-edge web technologies. Designed for secure document management with an intuitive file explorer interface.

## ✨ Features

### Core Functionality

- 📂 **Hierarchical Folder Structure** - Create nested folders with unlimited depth
- 📄 **PDF Document Management** - Upload, view, and organize PDF files
- 🔍 **Interactive PDF Viewer** - Built-in viewer with zoom, navigation, and fullscreen support
- ✏️ **File Operations** - Rename files and folders with conflict resolution
- 🗑️ **Cascade Delete** - Delete folders and all nested content safely
- 🧭 **Breadcrumb Navigation** - Intuitive path navigation with mobile scroll support

### User Experience

- 🎨 **Modern Glassmorphism Design** - Clean, professional interface with subtle transparency effects
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- 🎭 **Smooth Animations** - Consistent 150ms transitions with proper easing
- 🍞 **Smart Notifications** - Contextual toast messages with deduplication
- ⌨️ **Keyboard Accessible** - Full keyboard navigation and screen reader support
- 🌙 **Theme Support** - Built-in theme system ready for dark/light modes

### Technical Excellence

- ⚡ **Blazing Fast Performance** - Optimized bundle splitting and lazy loading
- 🔄 **Real-time Updates** - Reactive database queries with live synchronization
- 💾 **Offline-First** - IndexedDB storage with transactional integrity
- 🔒 **Type Safety** - Comprehensive TypeScript coverage with strict mode
- 🧪 **Production Ready** - Extensive linting, formatting, and quality checks

## 🚀 Quick Start

### Prerequisites

- Node.js 20.19+ or 22.12+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/IvanBarbaric992/dataroom-mvp.git
cd dataroom-mvp

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build

# Code Quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint errors
pnpm format       # Format with Prettier
pnpm stylelint    # Lint CSS/styles
pnpm check        # Run all quality checks

# Git Hooks
pnpm prepare      # Setup Husky git hooks
```

## 🏗️ Architecture

### Project Structure

```
src/
├── app/                    # Application configuration
├── components/             # Reusable UI components
│   ├── common/            # Shared components (buttons, dialogs, etc.)
│   └── layouts/           # Layout components
├── entities/              # Domain entities (DDD pattern)
│   ├── blob/              # File storage entity
│   └── node/              # File/folder entity
├── features/              # Feature-specific components
├── pages/                 # Route pages
└── shared/                # Shared utilities
    ├── constants/         # Type-safe constants
    ├── lib/              # Utility libraries
    └── stores/           # State management
```

### Tech Stack

#### Core Technologies

- **React 19** - Latest React with concurrent features
- **TypeScript 5.9** - Strict type checking and modern syntax
- **Vite 7** - Lightning-fast build tool with HMR
- **Tailwind CSS 4** - Utility-first styling with modern features

#### State & Data Management

- **Zustand 5** - Lightweight state management
- **Dexie 4** - IndexedDB wrapper with reactive hooks
- **React Router 7** - Client-side routing

#### UI Components & Styling

- **Radix UI** - Accessible headless components
- **Lucide React** - Consistent icon system
- **Class Variance Authority** - Type-safe component variants
- **Sonner** - Beautiful toast notifications

#### Development Tools

- **ESLint 9** - Comprehensive linting with TypeScript rules
- **Prettier 3** - Code formatting
- **Stylelint** - CSS linting
- **Husky** - Git hooks for quality assurance

### Database Schema

```typescript
interface NodeRecord {
  id: string; // Unique identifier
  roomId: string; // Data room association
  parentId: string | null; // Hierarchical structure
  type: 'folder' | 'file'; // Node type
  name: string; // Display name
  nameLower: string; // Search optimization
  createdAt: number; // Creation timestamp
  updatedAt: number; // Last modification
  size?: number; // File size (files only)
  mime?: string; // MIME type (files only)
  blobId?: string; // Binary data reference (files only)
}
```

### Key Design Patterns

#### Domain-Driven Design (DDD)

- **Entities**: Self-contained business logic
- **Repositories**: Data access abstraction
- **Constants**: Type-safe enums and configurations

#### Component Architecture

- **Composition**: Flexible, reusable components
- **Headless UI**: Accessible, unstyled base components
- **Lazy Loading**: Performance optimization with preloading

#### Performance Optimizations

- **Code Splitting**: Automatic chunk optimization
- **Preloading**: Smart component and asset preloading
- **Memoization**: Optimized re-renders with useCallback/useMemo
- **Bundle Analysis**: Optimized vendor chunk splitting

## 🎨 Design System

### Animation Standards

- **Duration**: 150ms for all transitions
- **Easing**: `ease-out` for entrances, `ease-in` for exits
- **Scale**: Subtle 1.01x hover effects
- **Consistency**: Unified timing across all interactions

### Color Palette

- **Primary**: CSS custom properties for theme flexibility
- **Glassmorphism**: Backdrop blur with subtle transparency
- **Semantic**: Success (primary) and error (destructive) variants

### Responsive Breakpoints

- **Mobile First**: Base styles for mobile devices
- **sm**: 640px+ (tablets and small laptops)
- **md**: 768px+ (laptops and desktops)
- **lg**: 1024px+ (large screens)

## 🔧 Configuration

### Environment Setup

```bash
# Required Node.js versions
node: ">=20.19 || >=22.12"

# Package manager
pnpm: ">=8.0.0" (recommended)
```

### Build Configuration

- **Bundle Size**: Optimized chunks under 1MB warning limit
- **Tree Shaking**: Automatic unused code elimination
- **Asset Optimization**: Automatic image and font optimization

### Code Quality Standards

- **TypeScript**: Strict mode with comprehensive type checking
- **ESLint**: 150+ rules including React, accessibility, and import organization
- **Prettier**: Consistent code formatting with Tailwind plugin
- **Git Hooks**: Pre-commit quality checks and automatic fixes

## 🚦 Development Workflow

### Quality Assurance

1. **Pre-commit**: Automatic linting and formatting
2. **Type Checking**: Strict TypeScript validation
3. **Bundle Analysis**: Size and performance monitoring
4. **Accessibility**: ARIA compliance and keyboard navigation

### Performance Monitoring

- **Bundle Size**: Automated warnings for large chunks
- **Lighthouse**: Performance, accessibility, and SEO metrics
- **React DevTools**: Component performance profiling

## 🔒 Security & Best Practices

### Data Security

- **Client-side Storage**: IndexedDB with transactional integrity
- **Input Validation**: Comprehensive sanitization and validation
- **File Type Restrictions**: PDF-only uploads with MIME validation

### Code Security

- **Dependency Scanning**: Regular security audits
- **Type Safety**: Runtime error prevention through TypeScript
- **Sanitization**: XSS protection through proper escaping

## 📈 Performance Metrics

### Bundle Size (Gzipped)

- **Total**: ~290KB
- **Initial Load**: ~115KB
- **Lazy Chunks**: 1-5KB each
- **Vendor Libraries**: Optimally chunked

### Lighthouse Scores

- **Performance**: 95+ (target)
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 95+ (target)

## 🤝 Contributing

### Development Setup

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes and commit: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Standards

- Follow the existing code style and patterns
- Write meaningful commit messages
- Add tests for new functionality
- Update documentation as needed

## 📄 License

This project is private and proprietary. All rights reserved.

## 🛠️ Technical Support

For technical questions or issues:

1. Check the existing documentation
2. Review closed issues in the repository
3. Create a detailed issue with reproduction steps

---

**Built with ❤️ using modern web technologies**
