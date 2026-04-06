# The Broadpost

Broadpost is a modern, full-stack blogging platform built for seamless content creation and consumption. It leverages a modern frontend stack paired with a robust Supabase backend to deliver a highly responsive and feature-rich experience for both administrators and readers.

## 🚀 Features

- **Modern Architecture:** Built with React 19, Vite, and TypeScript for optimal development and production performance.
- **Robust Backend:** Powered by Supabase for PostgreSQL database, authentication, row-level security (RLS), and media storage.
- **Rich Text Editing:** Integrated Markdown editor (`@uiw/react-md-editor`) for crafting beautifully formatted blog posts.
- **State Management:** Efficient server state management and data fetching using `@tanstack/react-query`.
- **Form Handling:** Robust form validation and submission handling with `react-hook-form`.
- **Elegant UI:** Styled with Tailwind CSS for a fully responsive, utility-first design approach. Beautiful iconography provided by `lucide-react`.
- **User Notifications:** Real-time feedback with toast notifications using `react-hot-toast`.
- **Routing:** Client-side routing managed by `react-router-dom`.

## 🛠️ Technology Stack

- **Frontend Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **Backend/BaaS:** Supabase 
- **Data Fetching:** React Query (TanStack Query)
- **Icons:** Lucide React

## 📦 Getting Started

### Prerequisites

Ensure you have the following installed to run this project:
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.com/) account and project.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd broadpost
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Create a `.env.local` file in the root of the project.
   - You can copy the structure from `.env.example` if available.
   - Add your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 📊 Analytics Notes

- Broadpost already includes client-side Vercel Analytics via `@vercel/analytics`.
- Do **not** place your Vercel access token in any `VITE_*` variable, because those are exposed to the browser bundle.
- If you need Vercel REST API access (for advanced reporting), store the token as a server-only variable such as:

```env
VERCEL_ACCESS_TOKEN=your_vercel_token
```

- Use that token only in server-side code (for example, API routes or background jobs), never in React client components.

## 🏗️ Build for Production

To create a production-ready build, run:
```bash
npm run build
```
This command compiles the application into the `dist` directory, optimizing the final payload. You can preview the production build locally with:
```bash
npm run preview
```

## 🧹 Code Quality

This project is configured with ESLint for maintaining code quality and ensuring best practices:
```bash
npm run lint
```

## 📄 License

This project is private and intended for authorized internal use and client distribution only.
