
# Hala FTTH - ISP CRM & Help Desk System

This is a comprehensive, full-stack web application designed to serve as a Customer Relationship Management (CRM) and Help Desk system for an Internet Service Provider (ISP). It provides a multi-faceted platform for managing subscribers, tickets, tasks, employees, and sales leads, all governed by a robust role-based access control system.

The application is built with a modern technology stack, featuring Next.js for the frontend and backend, NextAuth.js for authentication, and is designed to work with MongoDB for data persistence, while also supporting a mock data mode for easy demonstration.

## ✨ Key Features

- **Authentication & Authorization:**
  - Secure user login and session management using NextAuth.js.
  - Role-Based Access Control (RBAC) to restrict access to features based on user roles (e.g., Super Admin, Support Manager, Reseller, Client).
  - A demo-friendly login page to easily switch between different user roles without needing passwords.

- **Role-Specific Dashboards:**
  - Dynamic dashboards that present relevant information and modules based on the logged-in user's permissions.
  - At-a-glance cards for key metrics like open tickets and pending tasks.

- **Help Desk & Ticket Management:**
  - Create, view, and manage support tickets.
  - Assign tickets to agents or forward them to specific reseller groups.
  - Add comments, update status, and track ticket history.
  - **AI-Powered Summaries:** Integrated with the Google Gemini API to generate concise summaries of long ticket conversations.

- **Subscriber & Reseller Management:**
  - Look up subscribers by name or username to view detailed information (profile, balance, status, etc.).
  - Reseller managers can view and manage tickets and employees associated with their reseller group.
  - Admins can assign users to different resellers.

- **Task Management:**
  - Create, assign, and track tasks with due dates and statuses (To Do, In Progress, Done).
  - Users can view tasks assigned to them, while managers can oversee all tasks.

- **Human Resources (HR) Modules:**
  - **Employee Management:** View and manage a list of all employees (users).
  - **Time Off:** Employees can request time off, which generates an approval request.
  - **Approvals:** Managers can view and approve/reject requests.
  - **Timesheets:** Employees can log their work hours.
  - **Appraisals:** Managers can create performance appraisals for employees.

- **CRM & Sales:**
  - **Leads Management:** A complete CRM module to manage sales leads through a Kanban board or a table view.
  - **Contacts:** Manage a directory of customers, vendors, and partners.
  - **Sales Orders:** Create and track sales orders.

- **Collaboration & Tools:**
  - **Team Chat:** A real-time discussion board for internal communication.
  - **Calendar:** A team calendar to schedule and view events.
  - **Knowledge Base:** A repository for support articles and internal documentation.
  - **Surveys:** Create and manage surveys.

- **User Experience:**
  - **Multi-Language Support:** Fully bilingual interface supporting English and Arabic (RTL).
  - **Dark/Light Mode:** Theme toggling for user comfort.
  - **Responsive Design:** A clean, modern UI that works across different screen sizes.
  - **Real-time Notifications:** In-app notifications for important events like ticket assignments.

## 🛠️ Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (React framework for server-side rendering and static site generation)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) (Designed for, but uses mock data for demo)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **AI Integration:** [Google Gemini API](https://ai.google.dev/)
- **State Management:** React Context API & `useState` hook for local and global state.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later recommended)
- `npm` or `yarn` package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/isp-crm.git
    cd isp-crm
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of your project and add the following variables.

    ```env
    # A long, random string used to hash tokens and sign cookies
    NEXTAUTH_SECRET=your_super_secret_key_here

    # Your MongoDB connection string (optional, as the app uses mock data by default)
    MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

    # Your Google Gemini API Key for the AI Summary feature (optional)
    API_KEY=your_gemini_api_key_here
    ```

    - **`NEXTAUTH_SECRET`**: This is required by NextAuth.js. You can generate a secret with `openssl rand -hex 32`.
    - **`MONGODB_URI`**: The application is configured to use mock data, so this is not strictly necessary for the demo to run. If you wish to connect to a real database, you'll need to provide your connection string.
    - **`API_KEY`**: This is needed for the "AI Summary" feature on the tickets page. If left blank, the feature will be gracefully disabled.

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 🎭 Demo Mode

By default, the application runs in a "demo mode" that uses mock data defined in `/lib/mockData.ts`. This allows you to explore the full functionality of the application without needing to set up a database.

The login page (`/auth/login`) features a dropdown menu that lets you sign in as any of the predefined users, making it easy to test the different roles and permissions.

## 📁 Project Structure

```
/components/      # Reusable UI components (buttons, modals, cards)
  /auth/          # Auth-related components
  /common/        # Generic, shared components
  /layout/        # Layout components (Header, Sidebar)
/contexts/        # React Context providers (Auth, Theme, Language)
/lib/             # Helper functions, database connection, mock data
/models/          # Mongoose schemas for database models
/pages/           # Next.js pages and API routes
  /api/           # API routes, including auth endpoints
  /auth/          # Authentication pages (login, signup)
  /settings/      # Nested routes for the settings section
/services/        # Services for external APIs (e.g., Gemini)
/styles/          # Global CSS files
/public/          # Static assets
- translations.ts # English and Arabic translation strings
- types.ts        # TypeScript type definitions
- next.config.js  # Next.js configuration
- README.md       # You are here!
```

## ☁️ Deployment

This application is ready to be deployed on platforms that support Next.js, such as [Vercel](https://vercel.com/).

When deploying, ensure you have set the required environment variables (`NEXTAUTH_SECRET`, `MONGODB_URI`, `API_KEY`) in your deployment provider's settings.

