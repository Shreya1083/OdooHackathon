import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Lock, Eye, EyeOff, Phone, AtSign,
  UserPlus, Camera, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiSignup } from '../../services/api.js';
import toast from 'react-hot-toast';

const FIELD_RULES = {
  firstName:       { required: true,  label: 'First name' },
  lastName:        { required: true,  label: 'Last name' },
  username:        { required: true,  label: 'Username',  minLength: 3 },
  email:           { required: true,  label: 'Email',     pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone:           { required: false, label: 'Phone' },
  password:        { required: true,  label: 'Password',  minLength: 6 },
  confirmPassword: { required: true,  label: 'Confirm password' },
};

function validateField(name, value, allValues) {
  const rule = FIELD_RULES[name];
  if (!rule) return '';
  if (rule.required && !value?.trim()) return `${rule.label} is required`;
  if (rule.minLength && value.length < rule.minLength)
    return `${rule.label} must be at least ${rule.minLength} characters`;
  if (rule.pattern && !rule.pattern.test(value)) return `Invalid ${rule.label.toLowerCase()}`;
  if (name === 'confirmPassword' && value !== allValues.password) return 'Passwords do not match';
  return '';
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: '6+ characters', ok: password.length >= 6 },
    { label: 'Uppercase',     ok: /[A-Z]/.test(password) },
    { label: 'Number',        ok: /\d/.test(password) },
  ];
  return (
    <div className="flex gap-3 mt-2">
      {checks.map((c) => (
        <div key={c.label} className="flex items-center gap-1 text-xs">
          <div className={`w-1.5 h-1.5 rounded-full ${c.ok ? 'bg-emerald-500' : 'bg-surface-300'}`} />
          <span className={c.ok ? 'text-emerald-600' : 'text-surface-400'}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}

// Field extracted to module scope to avoid static-component lint warning
function FormField({ name, label, type = 'text', icon: Icon, placeholder, autoComplete, form, errors, touched, handleChange, handleBlur, loading }) {
  const err = touched[name] && errors[name];
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />}
        <input
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          value={form[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={loading}
          className={`input ${Icon ? 'pl-10' : ''} ${err ? 'input-error' : ''}`}
        />
        {touched[name] && !errors[name] && form[name] && (
          <CheckCircle2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" />
        )}
      </div>
      {err && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={11} /> {errors[name]}
        </p>
      )}
    </div>
  );
}

export default function Signup() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const fileRef    = useRef(null);

  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '', email: '',
    phone: '', password: '', confirmPassword: '', avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors,        setErrors]        = useState({});
  const [touched,       setTouched]       = useState({});
  const [showPw,        setShowPw]        = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [serverError,   setServerError]   = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value, { ...form, [name]: value }) }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value, form) }));
  }

  function handleAvatar(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const ALLOWED = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!ALLOWED.includes(file.type)) { toast.error('Please upload a valid image (JPG, PNG, GIF, WebP)'); return; }
    if (file.size > 3 * 1024 * 1024) { toast.error('Image must be smaller than 3 MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target.result);
      setForm((prev) => ({ ...prev, avatar: ev.target.result }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    const allTouched = Object.fromEntries(Object.keys(FIELD_RULES).map((k) => [k, true]));
    setTouched(allTouched);
    const newErrors = Object.fromEntries(
      Object.keys(FIELD_RULES).map((k) => [k, validateField(k, form[k], form)])
    );
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    try {
      const { user } = await apiSignup(form);
      login(user);
      toast.success('Account created! Welcome to HRMS Pro.');
      navigate('/employee/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  // Shared props passed down to FormField
  const fieldProps = { form, errors, touched, handleChange, handleBlur, loading };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 relative overflow-hidden flex-col justify-center p-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-28 -left-12 w-72 h-72 rounded-full bg-white/5" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">HRMS Pro</span>
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight mb-4">
            Join your team<br />on HRMS Pro
          </h1>
          <p className="text-brand-200 leading-relaxed">
            Create your account to start managing attendance, leave, and more.
          </p>
          <div className="mt-8 p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10">
            <p className="text-white/70 text-xs mb-2 font-semibold uppercase tracking-wide">After signing up</p>
            <ul className="space-y-2 text-sm text-brand-100">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-300" />Clock in/out your attendance</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-300" />Request time off with ease</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-300" />View your leave history</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-surface-50 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="font-bold text-xl text-surface-900">HRMS Pro</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-surface-900">Create account</h2>
            <p className="text-surface-500 text-sm mt-1">Fill in your details to get started</p>
          </div>

          {/* Avatar upload */}
          <div className="flex justify-center mb-6">
            <button type="button" onClick={() => fileRef.current?.click()} className="relative group" aria-label="Upload profile picture">
              <div className="w-20 h-20 rounded-full bg-surface-200 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-card-lg">
                {avatarPreview
                  ? <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                  : <User size={28} className="text-surface-400" />
                }
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center shadow ring-2 ring-white group-hover:bg-brand-700 transition-colors">
                <Camera size={13} className="text-white" />
              </div>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </div>

          {/* Server error */}
          {serverError && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3 mb-5 animate-fade-in">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField name="firstName" label="First name" icon={User} placeholder="Alice" autoComplete="given-name" {...fieldProps} />
              <FormField name="lastName"  label="Last name"  icon={User} placeholder="Johnson" autoComplete="family-name" {...fieldProps} />
            </div>
            <FormField name="username" label="Username"         icon={AtSign} placeholder="alice.johnson"   autoComplete="username" {...fieldProps} />
            <FormField name="email"    label="Email"            icon={Mail}   placeholder="you@company.com" autoComplete="email" type="email" {...fieldProps} />
            <FormField name="phone"    label="Phone (optional)" icon={Phone}  placeholder="+1 555-0100"     autoComplete="tel" type="tel" {...fieldProps} />

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                <input
                  id="password" name="password" type={showPw ? 'text' : 'password'}
                  autoComplete="new-password" value={form.password}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="Min. 6 characters" disabled={loading}
                  className={`input pl-10 pr-10 ${touched.password && errors.password ? 'input-error' : ''}`}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
              {touched.password && errors.password && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{errors.password}</p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className="label">Confirm password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                <input
                  id="confirmPassword" name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password" value={form.confirmPassword}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="Repeat password" disabled={loading}
                  className={`input pl-10 pr-10 ${touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{errors.confirmPassword}</p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full btn-lg mt-2" disabled={loading}>
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account…</>
                : <><UserPlus size={18} /> Create account</>
              }
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
