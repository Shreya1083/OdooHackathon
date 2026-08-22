import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext.jsx';
import { apiLogin } from '../../services/api.js';
import toast from 'react-hot-toast';

const DEMO_ACCOUNTS = [
  {
    label: 'Employee',
    email: 'alice@hrms.com',
    password: 'pass123',
  },
  {
    label: 'Admin',
    email: 'admin@hrms.com',
    password: 'admin123',
  },
];

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function getRedirect(role) {
    if (
      from &&
      !from.startsWith('/login') &&
      !from.startsWith('/signup')
    ) {
      return from;
    }

    if (role === 'admin') {
      return '/admin/dashboard';
    }

    return '/employee/dashboard';
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');

    if (!form.email.trim()) {
      setError('Email is required');
      return;
    }

    if (!form.password) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    try {
      const { user } = await apiLogin({
        email: form.email.trim(),
        password: form.password,
      });

      login(user);

      toast.success(`Welcome back, ${user.firstName}!`);

      navigate(getRedirect(user.role), {
        replace: true,
      });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(acc) {
    setForm({
      email: acc.email,
      password: acc.password,
    });

    setError('');
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#070812] text-white">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* Purple glow */}
        <div
          className="
            absolute
            -top-40
            -left-40
            w-[500px]
            h-[500px]
            rounded-full
            bg-purple-600/20
            blur-[120px]
          "
        />

        {/* Blue glow */}
        <div
          className="
            absolute
            top-1/3
            -right-40
            w-[500px]
            h-[500px]
            rounded-full
            bg-blue-600/20
            blur-[130px]
          "
        />

        {/* Bottom glow */}
        <div
          className="
            absolute
            -bottom-40
            left-1/3
            w-[450px]
            h-[450px]
            rounded-full
            bg-indigo-600/15
            blur-[120px]
          "
        />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              `
              linear-gradient(
                rgba(255,255,255,0.5) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,0.5) 1px,
                transparent 1px
              )
              `,
            backgroundSize: '50px 50px',
          }}
        />

      </div>


      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">

        {/* ===================================================
            GLASS CONTAINER
        ==================================================== */}

        <div
          className="
            w-full
            max-w-6xl
            min-h-[680px]
            grid
            lg:grid-cols-2
            rounded-3xl
            overflow-hidden
            border
            border-white/10
            bg-white/[0.04]
            backdrop-blur-2xl
            shadow-[0_25px_80px_rgba(0,0,0,0.5)]
          "
        >

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div
            className="
              hidden
              lg:flex
              relative
              flex-col
              justify-between
              p-12
              overflow-hidden
            "
          >

            {/* Left panel gradient */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-purple-600/[0.12]
                via-transparent
                to-blue-600/[0.08]
              "
            />

            {/* Decorative circles */}

            <div
              className="
                absolute
                -top-20
                -right-20
                w-72
                h-72
                rounded-full
                border
                border-white/10
              "
            />

            <div
              className="
                absolute
                -top-10
                -right-10
                w-52
                h-52
                rounded-full
                border
                border-white/5
              "
            />

            <div
              className="
                absolute
                -bottom-32
                -left-20
                w-80
                h-80
                rounded-full
                bg-purple-500/10
                blur-3xl
              "
            />


            {/* LEFT CONTENT */}

            <div className="relative z-10">

              {/* Logo */}

              <div className="flex items-center gap-3 mb-20">

                <div
                  className="
                    w-11
                    h-11
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    bg-white/10
                    border
                    border-white/15
                    backdrop-blur-xl
                    shadow-lg
                  "
                >
                  <span
                    className="
                      text-xl
                      font-bold
                      bg-gradient-to-br
                      from-purple-300
                      to-blue-300
                      bg-clip-text
                      text-transparent
                    "
                  >
                    H
                  </span>
                </div>

                <div>

                  <span className="text-white font-bold text-xl tracking-tight">
                    HRMS
                  </span>

                  <span className="text-purple-400 font-bold text-xl">
                    Pro
                  </span>

                </div>

              </div>


              {/* Badge */}

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-3
                  py-1.5
                  mb-6
                  rounded-full
                  border
                  border-purple-400/20
                  bg-purple-500/10
                  text-purple-300
                  text-xs
                  font-medium
                "
              >

                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-purple-400
                    animate-pulse
                  "
                />

                Smart HR Management

              </div>


              {/* Heading */}

              <h1
                className="
                  text-5xl
                  font-bold
                  leading-tight
                  tracking-tight
                "
              >

                Manage your
                <br />

                <span
                  className="
                    bg-gradient-to-r
                    from-purple-300
                    via-indigo-300
                    to-blue-300
                    bg-clip-text
                    text-transparent
                  "
                >
                  workforce smarter.
                </span>

              </h1>


              {/* Description */}

              <p
                className="
                  mt-6
                  text-white/50
                  text-base
                  leading-relaxed
                  max-w-md
                "
              >
                Manage attendance, leave requests, employee records
                and payroll — all from one powerful workspace.
              </p>

            </div>


            {/* =================================================
                FEATURES
            ================================================== */}

            <div className="relative z-10 space-y-3">

              {[
                'Role-based access control',
                'Attendance & clock-in tracking',
                'Leave management & approvals',
                'Salary & payroll overview',
              ].map((feature) => (

                <div
                  key={feature}
                  className="
                    flex
                    items-center
                    gap-3
                    text-white/60
                  "
                >

                  <div
                    className="
                      w-7
                      h-7
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      bg-white/[0.06]
                      border
                      border-white/10
                    "
                  >

                    <svg
                      viewBox="0 0 12 12"
                      fill="none"
                      className="w-3.5 h-3.5 text-purple-300"
                    >

                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                    </svg>

                  </div>

                  <span className="text-sm">
                    {feature}
                  </span>

                </div>

              ))}

            </div>

          </div>


          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div
            className="
              flex
              items-center
              justify-center
              p-6
              sm:p-10
              lg:border-l
              border-white/10
            "
          >

            <div className="w-full max-w-md">


              {/* =================================================
                  MOBILE LOGO
              ================================================= */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  mb-10
                  lg:hidden
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    bg-white/10
                    border
                    border-white/10
                  "
                >

                  <span className="font-bold text-purple-300">
                    H
                  </span>

                </div>

                <span className="font-bold text-xl">

                  HRMS
                  <span className="text-purple-400">
                    Pro
                  </span>

                </span>

              </div>


              {/* =================================================
                  LOGIN GLASS CARD
              ================================================= */}

              <div
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/[0.045]
                  backdrop-blur-xl
                  p-7
                  sm:p-8
                  shadow-2xl
                "
              >

                {/* Header */}

                <div className="mb-8">

                  <p
                    className="
                      text-purple-400
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      mb-3
                    "
                  >
                    Welcome back
                  </p>

                  <h2 className="text-3xl font-bold text-white">
                    Sign in
                  </h2>

                  <p className="text-white/40 text-sm mt-2">
                    Enter your credentials to continue
                  </p>

                </div>


                {/* =================================================
                    DEMO LOGIN
                ================================================== */}

                <div className="mb-7">

                  <p
                    className="
                      text-[11px]
                      font-semibold
                      text-white/30
                      uppercase
                      tracking-widest
                      mb-3
                    "
                  >
                    Quick demo login
                  </p>

                  <div className="grid grid-cols-2 gap-3">

                    {DEMO_ACCOUNTS.map((acc) => (

                      <button
                        key={acc.label}
                        type="button"
                        onClick={() => fillDemo(acc)}
                        className="
                          group
                          py-2.5
                          px-3
                          rounded-xl
                          border
                          border-white/10
                          bg-white/[0.04]
                          hover:bg-white/[0.08]
                          hover:border-purple-400/30
                          transition-all
                          duration-200
                        "
                      >

                        <span
                          className="
                            text-xs
                            font-medium
                            text-white/60
                            group-hover:text-purple-300
                            transition-colors
                          "
                        >
                          {acc.label}
                        </span>

                      </button>

                    ))}

                  </div>

                </div>


                {/* =================================================
                    ERROR
                ================================================== */}

                {error && (

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      bg-red-500/10
                      border
                      border-red-500/20
                      rounded-xl
                      px-4
                      py-3
                      mb-5
                    "
                  >

                    <AlertCircle
                      size={17}
                      className="
                        text-red-400
                        flex-shrink-0
                      "
                    />

                    <p className="text-sm text-red-300">
                      {error}
                    </p>

                  </div>

                )}


                {/* =================================================
                    FORM
                ================================================== */}

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-5"
                >

                  {/* EMAIL */}

                  <div>

                    <label
                      htmlFor="email"
                      className="
                        block
                        text-xs
                        font-medium
                        text-white/60
                        mb-2
                      "
                    >
                      Email or Username
                    </label>

                    <div className="relative">

                      <Mail
                        size={17}
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-white/30
                          pointer-events-none
                        "
                      />

                      <input
                        id="email"
                        type="text"
                        autoComplete="username"
                        value={form.email}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            email: e.target.value,
                          })
                        }
                        placeholder="you@company.com"
                        disabled={loading}
                        className="
                          w-full
                          h-12
                          rounded-xl
                          bg-black/20
                          border
                          border-white/10
                          text-white
                          placeholder:text-white/20
                          pl-11
                          pr-4
                          outline-none
                          transition-all
                          duration-200
                          focus:border-purple-400/50
                          focus:bg-white/[0.06]
                          focus:ring-2
                          focus:ring-purple-500/10
                        "
                      />

                    </div>

                  </div>


                  {/* PASSWORD */}

                  <div>

                    <label
                      htmlFor="password"
                      className="
                        block
                        text-xs
                        font-medium
                        text-white/60
                        mb-2
                      "
                    >
                      Password
                    </label>

                    <div className="relative">

                      <Lock
                        size={17}
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-white/30
                          pointer-events-none
                        "
                      />

                      <input
                        id="password"
                        type={showPw ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={form.password}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            password: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        disabled={loading}
                        className="
                          w-full
                          h-12
                          rounded-xl
                          bg-black/20
                          border
                          border-white/10
                          text-white
                          placeholder:text-white/20
                          pl-11
                          pr-12
                          outline-none
                          transition-all
                          duration-200
                          focus:border-purple-400/50
                          focus:bg-white/[0.06]
                          focus:ring-2
                          focus:ring-purple-500/10
                        "
                      />

                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="
                          absolute
                          right-3.5
                          top-1/2
                          -translate-y-1/2
                          text-white/30
                          hover:text-purple-300
                          transition-colors
                        "
                        aria-label={
                          showPw
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >

                        {showPw ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}

                      </button>

                    </div>

                  </div>


                  {/* =================================================
                      LOGIN BUTTON
                  ================================================== */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full
                      h-12
                      mt-2
                      rounded-xl
                      flex
                      items-center
                      justify-center
                      gap-2
                      font-semibold
                      text-sm
                      text-white
                      bg-gradient-to-r
                      from-purple-600
                      to-indigo-600
                      hover:from-purple-500
                      hover:to-indigo-500
                      shadow-lg
                      shadow-purple-900/20
                      hover:shadow-purple-500/20
                      transition-all
                      duration-300
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >

                    {loading ? (
                      <>
                        <span
                          className="
                            w-4
                            h-4
                            border-2
                            border-white/30
                            border-t-white
                            rounded-full
                            animate-spin
                          "
                        />

                        Signing in…
                      </>
                    ) : (
                      <>
                        <LogIn size={18} />

                        Sign in
                      </>
                    )}

                  </button>

                </form>


                {/* =================================================
                    SIGN UP
                ================================================== */}

                <p
                  className="
                    text-center
                    text-sm
                    text-white/40
                    mt-7
                  "
                >

                  Don't have an account?{' '}

                  <Link
                    to="/signup"
                    className="
                      text-purple-400
                      font-semibold
                      hover:text-purple-300
                      transition-colors
                    "
                  >
                    Create account
                  </Link>

                </p>

              </div>


              {/* Bottom text */}

              <p
                className="
                  text-center
                  text-[11px]
                  text-white/20
                  mt-6
                "
              >
                Secure HR management platform
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}