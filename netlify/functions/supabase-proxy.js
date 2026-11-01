const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      statusCode: 503,
      body: JSON.stringify({
        error: 'Supabase configuration is missing. Set SUPABASE_URL and SUPABASE_ANON_KEY in Netlify environment variables.'
      })
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase.from('buses').select('*').limit(5);

  return {
    statusCode: error ? 500 : 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(error ? { error: error.message } : { data })
  };
};
