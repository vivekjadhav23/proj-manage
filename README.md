🚀 TaskFlow | Enterprise Project Management
TaskFlow is a high-performance, full-stack collaborative platform designed for modern engineering teams. It streamlines project roadmaps through systematic Kanban infrastructure, real-time activity streams, and granular performance analytics.

💎 Core Features
Engineering Kanban: Dynamic board interface with drag-and-drop status updates and custom priority weightage.

Bento-Grid Analytics: A high-end "Command Center" dashboard providing at-a-glance system health and workspace metrics.

Real-time Activity Stream: A live system log that tracks every deployment, task update, and team interaction.

Enterprise Security: JWT-based session management with secure authentication protocols and encrypted data storage.

Adaptive UI: Fully responsive design with native Dark Mode support and high-fidelity typography using the Inter font family.

🛠️ Tech Stack
Frontend:

React.js (Vite)

React Bootstrap (Modern SaaS Theme)

Bootstrap Icons

Axios for API Orchestration

Backend:

Node.js & Express

MongoDB (Mongoose ODM)

JSON Web Tokens (JWT) for secure Auth

📂 Project Structure
Plaintext
taskflow/
├── client/                # React Frontend
│   ├── src/
│   │   ├── api/           # Axios service configurations
│   │   ├── components/    # Reusable UI (Landing, Board, Dashboard, etc.)
│   │   └── App.jsx        # Routing and Protected Routes
│   └── index.html         # SEO Meta Tags & Pre-loader
└── server/                # Node.js Backend
    ├── models/            # Mongoose Schemas (User, Project, Task)
    └── index.js           # API Routes and Controller Logic
🚀 Getting Started
Prerequisites
Node.js (v18+)

MongoDB Instance (Local or Atlas)

Installation
Clone the Repository:

Bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
Setup Backend:

Bash
cd server
npm install
# Create a .env file with MONGO_URI and JWT_SECRET
node index.js
Setup Frontend:

Bash
cd client
npm install
npm run dev
📊 Roadmap
[x] Bento-Grid Dashboard Implementation

[x] Real-time Activity Logs

[ ] Multi-factor Authentication (MFA)

[ ] WebSocket Integration for Live Cursor Tracking

TaskFlow — Built for engineering teams shipping the future in 2026.
