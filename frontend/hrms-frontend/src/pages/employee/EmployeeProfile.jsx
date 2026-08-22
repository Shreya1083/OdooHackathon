import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mail, Phone, Building2, Briefcase, Calendar, Edit3,
  Save, X, ArrowLeft, Camera, User, Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiGetUserById, apiUpdateProfile } from '../../services/api.js';
import Avatar from '../../components/common/Avatar.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { formatDate, getRoleBadgeClass, getDepartmentColor } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-surface-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={14} className="text-surface-500" />
      </div>
      <div>
        <p className="text-xs font-medium text-surface-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-surface-800 mt-0.5 font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function EmployeeProfile() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { user: me, isAdmin, updateUser } = useAuth();
  const fileRef     = useRef(null);

  const targetId     = id || me?.id;
  const isOwnProfile = targetId === me?.id;
  const canEdit      = isOwnProfile || isAdmin;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form,    setForm]    = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGetUserById(targetId);
        setProfile(data);
        setForm({
          firstName:   data.firstName,
          lastName:    data.lastName,
          phone:       data.phone || '',
          department:  data.department || '',
          designation: data.designation || '',
          avatar:      data.avatar || null,
        });
        setAvatarPreview(data.avatar || null);
      } catch (e) {
        toast.error(e.message);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [targetId, navigate]);

  function handleAvatar(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
    if (file.size > 3 * 1024 * 1024) { toast.error('Image must be under 3 MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target.result);
      setForm((f) => ({ ...f, avatar: ev.target.result }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await apiUpdateProfile(targetId, form);
      setProfile(updated);
      if (isOwnProfile) updateUser(updated);
      setEditing(false);
      toast.success('Profile updated');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setForm({
      firstName:   profile.firstName,
      lastName:    profile.lastName,
      phone:       profile.phone || '',
      department:  profile.department || '',
      designation: profile.designation || '',
      avatar:      profile.avatar || null,
    });
    setAvatarPreview(profile.avatar || null);
    setEditing(false);
  }

  if (loading) return <LoadingSpinner text="Loading profile…" />;
  if (!profile)  return null;

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const displayUser = editing
    ? { ...profile, ...form, avatar: avatarPreview }
    : profile;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="btn-ghost btn-sm mb-5 -ml-1"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* ── Left: avatar + basic ── */}
        <div className="md:col-span-1">
          <div className="card p-6 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <Avatar user={displayUser} size="2xl" />
              {editing && canEdit && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center shadow ring-2 ring-white hover:bg-brand-700 transition-colors"
                  aria-label="Change avatar"
                >
                  <Camera size={14} className="text-white" />
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </div>

            {editing ? (
              <div className="w-full space-y-2">
                <input
                  className="input text-center text-sm font-semibold"
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  placeholder="First name"
                />
                <input
                  className="input text-center text-sm"
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  placeholder="Last name"
                />
              </div>
            ) : (
              <>
                <h2 className="font-bold text-surface-900 text-lg">{fullName}</h2>
                <p className="text-sm text-surface-500 mt-0.5">{profile.designation}</p>
              </>
            )}

            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              <span className={getRoleBadgeClass(profile.role)}>
                <Shield size={10} />
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </span>
              <span className={`badge ${getDepartmentColor(profile.department)}`}>
                {profile.department}
              </span>
            </div>

            <p className="text-xs text-surface-400 mt-4">
              Member since {formatDate(profile.createdAt)}
            </p>

            {/* Edit / Save actions */}
            {canEdit && (
              <div className="mt-5 w-full space-y-2">
                {editing ? (
                  <>
                    <button onClick={handleSave} disabled={saving} className="btn-primary w-full btn-sm">
                      {saving ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : <><Save size={14} /> Save changes</>}
                    </button>
                    <button onClick={handleCancel} className="btn-secondary w-full btn-sm">
                      <X size={14} /> Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditing(true)} className="btn-secondary w-full btn-sm">
                    <Edit3 size={14} /> Edit profile
                  </button>
                )}
              </div>
            )}

            {!isOwnProfile && !canEdit && (
              <p className="mt-4 text-xs text-surface-400 flex items-center gap-1">
                <Shield size={11} /> View-only
              </p>
            )}
          </div>
        </div>

        {/* ── Right: details ── */}
        <div className="md:col-span-2 space-y-4">
          {/* Contact Info */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-surface-900 mb-3 flex items-center gap-2">
              <User size={15} className="text-surface-400" /> Contact Information
            </h3>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="label">Phone</label>
                  <input
                    className="input"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+1 555-0000"
                  />
                </div>
              </div>
            ) : (
              <div>
                <InfoRow icon={Mail}  label="Email"    value={profile.email} />
                <InfoRow icon={Phone} label="Phone"    value={profile.phone || 'Not provided'} />
                <InfoRow icon={User}  label="Username" value={`@${profile.username}`} />
              </div>
            )}
          </div>

          {/* Work Info */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-surface-900 mb-3 flex items-center gap-2">
              <Briefcase size={15} className="text-surface-400" /> Work Details
            </h3>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="label">Department</label>
                  <select
                    className="input"
                    value={form.department}
                    onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                  >
                    {['Engineering', 'Design', 'Marketing', 'Sales', 'Human Resources', 'Administration', 'Unassigned'].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Designation</label>
                  <input
                    className="input"
                    value={form.designation}
                    onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
              </div>
            ) : (
              <div>
                <InfoRow icon={Building2} label="Department"  value={profile.department} />
                <InfoRow icon={Briefcase} label="Designation" value={profile.designation} />
                <InfoRow icon={Calendar}  label="Joined"      value={formatDate(profile.createdAt)} />
              </div>
            )}
          </div>

          {/* Visibility notice for employees viewing others */}
          {!isOwnProfile && !isAdmin && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-2">
              <Shield size={14} className="text-amber-500 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                You are viewing a limited public profile. Sensitive information is hidden.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
