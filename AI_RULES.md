# AI Rules for Pizzaria D'Kasa

## Tech Stack

- **React 18** - Frontend framework with TypeScript support
- **Vite** - Build tool and development server
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI
- **React Router** - Client-side routing
- **Supabase** - Backend-as-a-Service with auth and database
- **React Query** - Server state management
- **React Hook Form** - Form handling with Zod validation
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

## Library Usage Rules

### UI Components
- **Always use shadcn/ui components** when available
- **Never create custom UI components** that duplicate existing shadcn/ui functionality
- **Import components** from `@/components/ui/[component]`
- **Use Tailwind CSS classes** for styling and layout
- **Follow the existing design system** with orange/wine color scheme

### Forms
- **Use React Hook Form** for all form handling
- **Use Zod** for form validation schemas
- **Import validation** from `@/hookform/resolvers`
- **Use shadcn/ui form components** (Input, Label, Button, etc.)

### State Management
- **Use React Query** for server state and API calls
- **Use React useState** for local component state
- **Use custom hooks** for complex state logic (e.g., `useAuth`, `useOrders`)
- **Never use Redux or Zustand** unless specifically requested

### Routing
- **Use React Router** for all navigation
- **Define routes** in `src/App.tsx`
- **Use `Link` components** for navigation
- **Route structure**: `/` (home), `/pedidos` (menu), `/pedido-rapido` (quick order), `/login` (auth), `/perfil` (user profile)

### Authentication
- **Use Supabase** for all authentication
- **Use the `useAuth` hook** for auth state management
- **Never implement custom auth** - always use Supabase
- **User profiles** are stored in the `profiles` table

### Data Fetching
- **Use React Query** for all API calls
- **Use Supabase client** for database operations
- **Import from** `@/integrations/supabase/client`
- **Type database responses** using the generated types from `@/integrations/supabase/types`

### Styling
- **Use Tailwind CSS classes** exclusively
- **Never write custom CSS** unless absolutely necessary
- **Use the design tokens** defined in `tailwind.config.ts`
- **Follow the existing color scheme**: orange primary, wine secondary, cream backgrounds

### Icons
- **Use Lucide React icons** exclusively
- **Import icons** directly: `import { IconName } from "lucide-react"`
- **Never use other icon libraries**

### Images
- **Use local images** from `src/assets/`
- **Import images** directly: `import imageName from "@/assets/image.jpg"`
- **Never use external image URLs** unless specifically requested

### File Structure
- **Pages** go in `src/pages/`
- **Components** go in `src/components/`
- **Hooks** go in `src/hooks/`
- **Utils** go in `src/lib/`
- **Data** goes in `src/data/`
- **Integration code** goes in `src/integrations/`

### Code Patterns
- **Use TypeScript interfaces** for all data structures
- **Use functional components** with hooks
- **Use arrow functions** for event handlers
- **Follow existing naming conventions** (camelCase for variables, PascalCase for components)
- **Write responsive code** using Tailwind responsive classes

### Error Handling
- **Use Sonner toasts** for user-facing errors
- **Never use try/catch** unless specifically requested
- **Let errors bubble up** to the error boundary
- **Provide user-friendly error messages**

### Performance
- **Use React Query caching** for API data
- **Implement lazy loading** for heavy components
- **Use React.memo** for expensive components
- **Optimize images** with proper sizing and formats

### Testing
- **Never write tests** unless specifically requested
- **If testing is needed**, use React Testing Library and Jest