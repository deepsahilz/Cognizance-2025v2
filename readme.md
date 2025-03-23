# PayCraft - Secure Freelance Payment Platform

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#technology-stack">Technology Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#available-scripts">Available Scripts</a> •
  <a href="#api-documentation">API Documentation</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

## Overview

PayCraft is a modern, secure platform connecting freelancers and employers with integrated payment protection, real-time messaging, and project management tools. Our platform streamlines the entire freelancing workflow from finding opportunities to receiving payment.

## Key Features

* **Secure Payment Protection**: Escrow-based payment system ensures freelancers get paid and employers receive quality work
* **Two-Factor Authentication**: Enhanced security for account access and financial transactions
* **Real-time Messaging**: Built-in communication system with file sharing and notification system
* **Project Management**: Track milestones, deadlines, and deliverables in one place
* **Profile Verification**: Identity verification for enhanced trust between parties
* **Rating & Review System**: Build your reputation through transparent feedback
* **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

## Technology Stack

### Frontend
* React 18
* Vite for fast development and builds
* Tailwind CSS for styling
* Lucide React for icons
* React Router for navigation
* Axios for API requests

### Backend
* Node.js with Express
* MongoDB for database
* JWT for authentication
* Nodemailer for email communications
* Socket.io for real-time features

## Getting Started

### Prerequisites
* Node.js (v16.0.0 or higher)
* npm (v8.0.0 or higher)
* MongoDB (local or Atlas connection)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/abhimanyu119/Cognizance-2025.git
cd Cognizance-2025
```

2. **Install dependencies**
```bash
npm install
npm run dev
```

3. **Environment Variables**

Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
CLIENT_URL=http://localhost:5173
```

4. **Start the development servers**
```bash
npm run dev
```

5. **Open your browser**

Visit http://localhost:5173 to see the application

## Project Structure

```
Cognizance-2025/
├── client/                  # Frontend React application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React context providers
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API and external services
│   │   └── utils/           # Utility functions
│   ├── index.html           # HTML entry point
│   └── vite.config.js       # Vite configuration
├── server/                  # Backend Node.js application
│   ├── config/              # Server configuration
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Express middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   └── index.js             # Server entry point
└── README.md                # Project documentation
```

## Available Scripts

### Parent
* `npm run dev` - Start development server
* `npm run build` - Build for production
* `npm run preview` - Preview production build
* `npm run lint` - Run ESLint


## API Documentation

API documentation is available at `/api/docs` when the server is running. We use Swagger for API documentation.

## Deployment

### Frontend
The frontend can be deployed to services like Vercel, Netlify, or any static hosting provider:
```bash
cd client
npm run build
```

### Backend
The backend can be deployed to services like Heroku, DigitalOcean, or AWS:
```bash
cd server
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

* React
* Vite
* Tailwind CSS
* Express
* MongoDB

## Contact

Project Link: https://github.com/abhimanyu119/Cognizance-2025.git

---

<p align="center">Made with ❤️ by the PayCraft Team</p>