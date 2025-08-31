# 🏗️ Equipment Overview - Core UI

A professional team management system for equipment oversight with VDCR management, project tracking, and role-based access control.

## ✨ Features

- **Team Management**: Add, edit, and manage team members with role-based permissions
- **VDCR System**: Complete VDCR document management and workflow
- **Project Management**: Create and manage projects with equipment assignments
- **Equipment Tracking**: Monitor equipment progress and team assignments
- **Professional UI**: Modern, elegant interface built with React and Tailwind CSS
- **Role-Based Access**: Secure permission system for different user types

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/infodigiteq/Equipment-Dashboard-Core-ui.git
cd Equipment-Dashboard-Core-ui

# Run automated setup (recommended)
./setup.sh

# Or manual setup
npm install
```

### Environment Configuration
The project uses environment variables for configuration. **You must set up your environment file:**

```bash
# Copy the environment template
cp env.template .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

#### 🔧 Environment Variables

**Required for Development:**
```bash
# Use hardcoded data (recommended for new team members)
VITE_USE_HARDCODED_DATA=true
VITE_SUPABASE_ENABLED=false
```

**Required for Supabase Integration:**
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_USE_HARDCODED_DATA=false
VITE_SUPABASE_ENABLED=true
```

#### 🎯 Quick Setup for Team Members

**Option 1: Use Hardcoded Data (Easiest)**
```bash
# In your .env file
VITE_USE_HARDCODED_DATA=true
VITE_SUPABASE_ENABLED=false
```

**Option 2: Use Supabase (Get credentials from project lead)**
```bash
# In your .env file
VITE_USE_HARDCODED_DATA=false
VITE_SUPABASE_ENABLED=true
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

### Start Development
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🛠️ Development Workflow

### For Frontend Developers
```bash
# Make changes to code
# Stage changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to remote
git push origin main
```

### For Backend Developers
```bash
# Pull latest changes
git pull origin main

# Install dependencies (if package.json changed)
npm install

# Start development
npm run dev
```

## 🔄 Team Collaboration

### Sharing Updates
- **No more zip files!** Use Git instead
- **Pull latest changes**: `git pull origin main`
- **See what changed**: `git log --oneline`
- **Rollback if needed**: `git reset --hard HEAD~1`

### Best Practices
- Always pull before starting work
- Commit frequently with clear messages
- Test changes before pushing
- Communicate with team about major changes

## 🔧 Environment Setup Guide

### For New Team Members

1. **Clone the repository**
   ```bash
   git clone https://github.com/infodigiteq/Equipment-Dashboard-Core-ui.git
   cd Equipment-Dashboard-Core-ui
   ```

2. **Run automated setup**
   ```bash
   ./setup.sh
   ```

3. **Configure environment**
   ```bash
   cp env.template .env
   # Edit .env file (see Environment Configuration section)
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

### Environment File Structure

The `.env` file contains:
- **Development settings**: Data source configuration
- **Supabase credentials**: Database connection
- **Feature flags**: Enable/disable features
- **API configuration**: Server settings
- **Security settings**: JWT and authentication

### Data Source Modes

**Hardcoded Data Mode** (Default for new team members):
- Uses pre-built data for development
- No database connection required
- Perfect for UI development and testing

**Supabase Mode** (For backend integration):
- Connects to real database
- Requires Supabase credentials
- Enables real-time updates and data persistence

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/          # Main dashboard components
│   ├── forms/             # Form components
│   └── ui/                # Reusable UI components
├── pages/                  # Page components
├── lib/                    # Utilities and configurations
│   └── config.ts          # Environment configuration
└── assets/                 # Images and static files
```

## 🔐 Role System

### Project Manager
- Full project access and team management
- Can edit all data (except VDCR)
- Add/remove team members

### VDCR Manager
- VDCR tab access and management
- Can edit VDCR documents
- Access to VDCR Birdview and logs

### Editor
- Assigned equipment only
- Can add progress images and entries
- Access to VDCR & other tabs
- No access to Settings & Project Details

### Viewer
- Assigned equipment only
- Read-only access
- Cannot edit data
- Access to VDCR & other tabs
- No access to Settings & Project Details

## 🎨 UI Components

Built with:
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Vite** for fast development

## 📝 Adding New Features

1. **Create feature branch**: `git checkout -b feature/new-feature`
2. **Develop and test** your changes
3. **Commit changes**: `git commit -m "Add new feature"`
4. **Push branch**: `git push origin feature/new-feature`
5. **Create pull request** for review

## 🚨 Troubleshooting

### Common Issues
- **Port already in use**: Try `npm run dev` on different port
- **Dependencies issues**: Delete `node_modules` and run `npm install`
- **Build errors**: Check TypeScript errors with `npm run build`
- **Environment issues**: Verify your `.env` file configuration

### Getting Help
1. Check the Git log for recent changes
2. Verify all dependencies are installed
3. Check console for error messages
4. Verify environment configuration
5. Contact the development team

## 📞 Support

For questions or issues:
- Check this README first
- Review recent Git commits
- Verify environment configuration
- Contact the development team

---

**Happy Coding! 🎯**
