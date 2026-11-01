<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login | Power Tools Bus Services</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
    <link rel="stylesheet" href="assets/css/styles.css" />
  </head>
  <body data-page="login" data-page-title="Login | Power Tools Bus Services">
    <div class="login-shell">
      <div class="login-visual">
        <div class="login-overlay">
          <div class="brand-slab">
            <i class="bi bi-bus-front"></i>
            <span>Power Tools Bus Services</span>
          </div>
          <h1>Transport operations with confidence.</h1>
          <p>Secure passenger management, trip scheduling, and business reporting for modern intercity operations.</p>
        </div>
      </div>

      <div class="login-form-panel">
        <div class="login-card">
          <div class="text-center mb-4">
            <h2>Welcome back</h2>
            <p class="muted">Sign in to the operational dashboard.</p>
          </div>
          <form id="loginForm">
            <div class="mb-3">
              <label for="email" class="form-label">Email address</label>
              <input type="email" class="form-control" id="email" placeholder="admin@powertoolsbus.com" required />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password" placeholder="••••••••" required />
            </div>
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="rememberMe" />
                <label class="form-check-label" for="rememberMe">Remember me</label>
              </div>
              <a href="#" class="small-link">Forgot password?</a>
            </div>
            <button type="submit" class="btn btn-primary w-100">Login</button>
          </form>
          <div class="divider"><span>Or</span></div>
          <button class="btn btn-outline-secondary w-100 mt-3">
            <i class="bi bi-google"></i> Continue with Google
          </button>
          <p class="small text-muted mt-3 mb-0">Demo users: admin@powertoolsbus.com / admin123</p>
        </div>
      </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/config.js"></script>
    <script src="assets/js/app.js"></script>
  </body>
</html>
