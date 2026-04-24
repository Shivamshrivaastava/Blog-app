import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiSave, FiCamera } from 'react-icons/fi';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [tab, setTab] = useState('profile');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.put('/auth/profile', profileForm);
      updateUser(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setPwLoading(true);
    try {
      await API.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Avatar header */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-28 relative" />
        <div className="px-6 pb-6">
          <div className="-mt-12 mb-4 flex items-end gap-4">
            <div className="relative">
              {user?.avatar ? (
                <img src={user.avatar} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow" alt="avatar" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-indigo-100 border-4 border-white shadow flex items-center justify-center text-indigo-600 text-3xl font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="pb-1">
              <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-100 pb-1">
            {['profile', 'password'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`text-sm px-4 py-2 font-medium capitalize transition rounded-t-lg
                  ${tab === t ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                {t === 'profile' ? 'Edit Profile' : 'Change Password'}
              </button>
            ))}
          </div>

          {tab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={profileForm.name}
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={user?.email}
                    disabled
                    className="w-full border border-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                <div className="relative">
                  <FiCamera className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={profileForm.avatar}
                    onChange={e => setProfileForm({ ...profileForm, avatar: e.target.value })}
                    placeholder="https://..."
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                  rows={3}
                  maxLength={300}
                  placeholder="Tell us about yourself..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
                />
                <p className="text-xs text-gray-400 text-right">{profileForm.bio.length}/300</p>
              </div>
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
                <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {tab === 'password' && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {['currentPassword', 'newPassword', 'confirmPassword'].map((field, i) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {['Current Password', 'New Password', 'Confirm New Password'][i]}
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={passwordForm[field]}
                      onChange={e => setPasswordForm({ ...passwordForm, [field]: e.target.value })}
                      required
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>
                </div>
              ))}
              <button type="submit" disabled={pwLoading}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
                <FiLock /> {pwLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
