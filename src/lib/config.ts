// Environment configuration utility
// This file centralizes all environment variables and provides fallbacks

export const config = {
  // Development settings
  useHardcodedData: import.meta.env.VITE_USE_HARDCODED_DATA === 'true',
  supabaseEnabled: import.meta.env.VITE_SUPABASE_ENABLED === 'true',
  
  // Supabase configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  
  // API configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  },
  
  // Feature flags
  features: {
    authentication: import.meta.env.VITE_ENABLE_AUTHENTICATION === 'true',
    realTimeUpdates: import.meta.env.VITE_ENABLE_REAL_TIME_UPDATES === 'true',
    fileUploads: import.meta.env.VITE_ENABLE_FILE_UPLOADS === 'true',
  },
  
  // Development server
  devServer: {
    port: parseInt(import.meta.env.VITE_DEV_SERVER_PORT || '3000'),
    host: import.meta.env.VITE_DEV_SERVER_HOST || 'localhost',
  },
  
  // Logging
  logging: {
    debug: import.meta.env.VITE_ENABLE_DEBUG_LOGGING === 'true',
    level: import.meta.env.VITE_LOG_LEVEL || 'info',
  },
  
  // Security
  security: {
    jwtSecret: import.meta.env.VITE_JWT_SECRET || 'dev-secret-key',
  },
  
  // External services
  services: {
    email: import.meta.env.VITE_EMAIL_SERVICE || 'sendgrid',
    storage: import.meta.env.VITE_STORAGE_SERVICE || 'supabase',
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET || 'equipment-dashboard',
  },
  
  // Notifications
  notifications: {
    email: import.meta.env.VITE_ENABLE_EMAIL_NOTIFICATIONS === 'true',
    push: import.meta.env.VITE_ENABLE_PUSH_NOTIFICATIONS === 'true',
  },
  
  // Analytics
  analytics: {
    enabled: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    id: import.meta.env.VITE_ANALYTICS_ID || '',
  },
  
  // Development tools
  devTools: {
    reactDevTools: import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true',
    performanceMonitoring: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
  },
};

// Helper functions
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Data source configuration
export const getDataSourceConfig = () => ({
  useHardcodedData: config.useHardcodedData,
  supabaseEnabled: config.supabaseEnabled,
  dataSource: config.useHardcodedData ? 'hardcoded' : 'supabase',
});

// Validation
export const validateConfig = () => {
  const errors: string[] = [];
  
  if (!config.useHardcodedData && !config.supabaseEnabled) {
    errors.push('Either hardcoded data or Supabase must be enabled');
  }
  
  if (config.supabaseEnabled) {
    if (!config.supabase.url) {
      errors.push('Supabase URL is required when Supabase is enabled');
    }
    if (!config.supabase.anonKey) {
      errors.push('Supabase anon key is required when Supabase is enabled');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Configuration status
export const getConfigStatus = () => {
  const validation = validateConfig();
  
  return {
    ...validation,
    dataSource: config.useHardcodedData ? 'Hardcoded Data' : 'Supabase',
    supabaseConfigured: !!(config.supabase.url && config.supabase.anonKey),
    features: {
      auth: config.features.authentication,
      realTime: config.features.realTimeUpdates,
      fileUploads: config.features.fileUploads,
    },
  };
};

export default config;
