const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  const metrics = {
    busCount: 42,
    activeBusCount: 31,
    tripCount: 87,
    todayBookings: 214,
    passengerCount: 11234,
    revenue: 789456,
    pendingPayments: 145600
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(metrics)
  };
};
