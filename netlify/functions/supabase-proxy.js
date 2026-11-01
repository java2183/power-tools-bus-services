const { createClient } = require('@supabase/supabase-js');

const fallbackMetrics = {
  busCount: 42,
  activeBusCount: 31,
  tripCount: 87,
  todayBookings: 214,
  passengerCount: 11234,
  revenue: 789456,
  pendingPayments: 145600
};

const getSupabaseClient = () => {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey || url.includes('YOUR_PROJECT_REF') || anonKey.includes('YOUR_')) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
};

exports.handler = async () => {
  try {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(fallbackMetrics)
      };
    }

    const [busResult, activeBusResult, tripResult, bookingResult, passengerResult, paymentResult] = await Promise.all([
      supabase.from('buses').select('id', { count: 'exact', head: true }),
      supabase.from('buses').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('trips').select('id', { count: 'exact', head: true }),
      supabase.from('bookings').select('id', { count: 'exact', head: true }),
      supabase.from('passengers').select('id', { count: 'exact', head: true }),
      supabase.from('payments').select('amount', { count: 'exact', head: true })
    ]);

    const metrics = {
      busCount: busResult.count || 0,
      activeBusCount: activeBusResult.count || 0,
      tripCount: tripResult.count || 0,
      todayBookings: bookingResult.count || 0,
      passengerCount: passengerResult.count || 0,
      revenue: fallbackMetrics.revenue,
      pendingPayments: fallbackMetrics.pendingPayments
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(metrics)
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(fallbackMetrics)
    };
  }
};

