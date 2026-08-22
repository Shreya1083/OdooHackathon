# HRMS Frontend

Modern React-based frontend for Human Resource Management System built with Vite.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment**
   ```bash
   copy .env.example .env
   # Default configuration connects to http://localhost:5000/api
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

Application will run on `http://localhost:5173`

## 🛠️ Tech Stack

- **React 19** - Latest React with improved performance
- **Vite** - Lightning-fast build tool
- **React Router DOM v7** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful notifications
- **Lucide React** - Modern icon library
- **TanStack React Query** - Data fetching and caching
- **date-fns** - Date manipulation library

## 📁 Project Structure

```
src/
├── assets/          # Images, icons, static files
├── components/      # Reusable UI components
│   ├── common/      # Shared components (Avatar, Modal, etc.)
│   ├── employee/    # Employee-specific components
│   └── admin/       # Admin-specific components
├── context/         # React Context providers
│   └── AuthContext.jsx
├── data/            # Mock data for development
├── hooks/           # Custom React hooks
├── layout/          # Layout components (MainLayout, Sidebar, etc.)
├── pages/           # Page components
│   ├── auth/        # Login, Signup pages
│   ├── employee/    # Employee pages
│   └── admin/       # Admin pages
├── routes/          # Route configuration
│   └── ProtectedRoute.jsx
├── services/        # API service layer
│   ├── api.js       # API endpoints
│   └── apiClient.js # Axios instance configuration
├── utils/           # Utility functions
├── App.jsx          # Main application component
├── index.css        # Global styles
└── main.jsx         # Application entry point
```

## 🎨 Features

### For All Users
- ✅ Authentication (Login/Signup)
- ✅ Profile management
- ✅ Responsive design
- ✅ Dark theme UI
- ✅ Toast notifications

### Employee Features
- ✅ Personal dashboard
- ✅ Clock in/out
- ✅ View attendance history
- ✅ Apply for leave
- ✅ Track leave status
- ✅ View employee directory
- ✅ Update profile

### Admin/HR Features
- ✅ Admin dashboard with analytics
- ✅ Manage all employees
- ✅ View all attendance records
- ✅ Approve/reject leave requests
- ✅ Manage payroll and salaries
- ✅ Add/edit/delete users
- ✅ Department-wise reports

## 🔐 Authentication

The app uses JWT token-based authentication:
- Tokens are stored in localStorage
- Automatic token attachment to API requests
- Auto-redirect to login on 401 errors
- Session persistence across page refreshes

## 🌐 API Integration

API calls are handled through the service layer:

```javascript
// Example: Login
import { apiLogin } from './services/api';

const { user, session } = await apiLogin({ 
  email: 'user@example.com', 
  password: 'password' 
});
```

All API functions are available in `src/services/api.js`

## 🎯 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

⚠️ **Note**: Vite requires the `VITE_` prefix for environment variables to be exposed to the client.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run Oxlint for code quality

## 🔧 Configuration

### Tailwind CSS

Tailwind is configured with custom colors and theme in `tailwind.config.js`:
- Custom brand colors
- Surface colors for dark theme
- Custom animations
- Extended shadows

### Vite

Vite configuration in `vite.config.js` includes:
- React plugin with Fast Refresh
- Build optimizations
- Development server settings

## 🚢 Building for Production

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

Built files will be in the `dist/` directory.

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## 🎨 Design System

### Colors
- **Brand**: Blue color palette for primary actions
- **Surface**: Slate color palette for backgrounds
- **Success**: Green for positive actions
- **Error**: Red for errors and warnings
- **Warning**: Yellow for warnings

### Typography
- Font Family: Inter (with fallbacks)
- Responsive font sizes
- Consistent spacing

### Components
All components follow a consistent design pattern:
- Cards with subtle shadows
- Rounded corners (6px-12px)
- Smooth transitions
- Accessible color contrasts

## 🔒 Security

- Environment variables for API endpoints
- No sensitive data in client code
- Secure token handling
- XSS protection via React
- CSRF protection (backend)

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Ensure backend server is running on port 5000
- Check `VITE_API_URL` in `.env`
- Verify CORS settings in backend

### "Token invalid"
- Clear localStorage and login again
- Check if JWT_SECRET matches between sessions

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

## 📚 Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC License

---

For more information, see the main [README.md](../../README.md) in the project root.
