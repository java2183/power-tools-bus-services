window.__APP_CONFIG__ = {
  appName: 'Power Tools Bus Services',
  defaultCurrency: 'ZMW',
  supabaseUrl: 'https://YOUR_PROJECT_REF.supabase.co',
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY',
  useDemoMode: true,
  enableSupabaseLogin: false
};

const createSupabaseClient = () => {
  const config = window.__APP_CONFIG__ || {};
  const isPlaceholder = !config.supabaseUrl || config.supabaseUrl.includes('YOUR_PROJECT_REF') || !config.supabaseAnonKey || config.supabaseAnonKey.includes('YOUR_');

  if (window.supabase && !isPlaceholder && config.supabaseUrl && config.supabaseAnonKey) {
    return window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }

  return null;
};

window.__SUPABASE__ = createSupabaseClient();
