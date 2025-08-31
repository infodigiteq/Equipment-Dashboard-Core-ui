# 🚀 Team Setup Guide - Equipment Dashboard Core UI

**Quick setup guide for team members to get the project running.**

## ⚡ Super Quick Setup (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/infodigiteq/Equipment-Dashboard-Core-ui.git

# 2. Navigate to project
cd Equipment-Dashboard-Core-ui

# 3. Run automated setup
./setup.sh

# 4. Start development
npm run dev
```

**That's it!** The setup script will handle everything automatically.

## 🔧 Manual Setup (If needed)

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp env.template .env

# 3. Edit .env file (see below)
nano .env

# 4. Start development
npm run dev
```

## 📝 Environment Configuration

### For New Team Members (Use Hardcoded Data)

Edit your `.env` file and set:

```bash
# Use hardcoded data (no database needed)
VITE_USE_HARDCODED_DATA=true
VITE_SUPABASE_ENABLED=false

# Development server
VITE_DEV_SERVER_PORT=3000
```

### For Backend Developers (Use Supabase)

Edit your `.env` file and set:

```bash
# Get these values from the project lead
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_key_here
VITE_USE_HARDCODED_DATA=false
VITE_SUPABASE_ENABLED=true
```

## 🎯 What Each Mode Does

### Hardcoded Data Mode (Default)
- ✅ **No database setup required**
- ✅ **Uses pre-built sample data**
- ✅ **Perfect for UI development**
- ✅ **Works immediately**

### Supabase Mode
- 🔗 **Connects to real database**
- 🔄 **Real-time updates**
- 💾 **Data persistence**
- 🔐 **Authentication system**

## 🚨 Troubleshooting

### Project won't start?
```bash
# Check if port 3000 is free
lsof -i :3000

# Try different port
VITE_DEV_SERVER_PORT=3001
```

### Dependencies issues?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Environment issues?
```bash
# Verify .env file exists
ls -la .env

# Check configuration
cat .env
```

## 📞 Need Help?

1. **Check the main README.md** first
2. **Run the setup script**: `./setup.sh`
3. **Contact the project lead** for Supabase credentials
4. **Check Git log** for recent changes: `git log --oneline`

## 🔄 Getting Updates

```bash
# Get latest code
git pull origin main

# Install new dependencies (if any)
npm install

# Start development
npm run dev
```

---

**Happy Coding! 🎯**

Your project should now be running at `http://localhost:3000`
