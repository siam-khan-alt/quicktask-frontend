# QuickTask - Frontend

A minimal, ultra-modern full-stack SaaS Task Manager application featuring a sleek Kanban board, glassmorphism UI, and Stripe Premium upgrade integration.

<!-- ## 🚀 Live Links
- **Live Demo:** [https://siamkhan-portfolio.vercel.app](https://siamkhan-portfolio.vercel.app) *(Your actual deployed domain)*
- **Backend Repository:** [Link to your backend repo] -->

## 🛠️ Tech Stack
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Modern Dark Theme)
- **State Management & Auth:** React Context API (Optimized Clean Architecture)
- **Drag and Drop:** `@hello-pangea/dnd`
- **Notifications:** `react-hot-toast`

## ✨ Features Implemented
- **Sleek UX/UI:** Dark theme with glassmorphism effects.
- **Robust Auth Integration:** Seamless token synchronization with persistence.
- **Interactive Kanban Board:** Drag and drop tasks smoothly between To Do, In Progress, and Done states.
- **Smart Limits:** Dynamic client-side restriction block for free plan users (max 3 tasks) with a real-time responsive Task Form.
- **Stripe Success/Cancel Sync:** Automatic listener for URL parameters to trigger instant account upgrades via context.
- **Enhanced Security & UX:** Custom password visibility toggles on Auth forms and contextual error notifications.

## 📦 Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <frontend-repo-url>
   cd quicktask-frontend
Install dependencies:

Bash
npm install
Configure Environment Variables:
Create a .env.local file in the root directory:

Code snippet
NEXT_PUBLIC_API_URL=http://localhost:5000
Run the development server:

Bash
npm run dev
Open http://localhost:3000 in your browser.

📝 Implementation Notes & Challenges
Cascading Render Fixes: Optimized React state dispatching inside Context lifecycle effects by wrapping multiple states into a unified synchronous AuthState object, completely bypassing the strict react-hooks/set-state-in-effect rule.

Clean Architecture Split: Divided the Authentication context layer into separate standalone modules (AuthContext.ts and AuthProvider.tsx) to guarantee clean structural isolation and premium modularity.