import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserData, editUser, uploadAvatar } from '../utils/Api/UserData';
import { GUID } from '../utils/global';
import { useNavigate } from 'react-router-dom';
import TwoFactorStatus from '../components/TwoFactor/TwoFactorStatus';
import EmailVerificationBanner from '../components/EmailVerification/EmailVerificationBanner';
import EmailVerificationModal from '../components/EmailVerification/EmailVerificationModal';
import '../css/MyAccount.css';

function MyAccount() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<{
        id: GUID;
        email: string;
        username: string;
        avatarUrl: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [profileError, setProfileError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    useEffect(() => {
        const loadUserData = async () => {
            if (!user) {
                navigate('/login');
                return;
            }
            const response = await fetchUserData();
            if (response.success && response.data) {
                setUserData(response.data);
                setFormData({
                    username: response.data.username,
                    email: response.data.email,
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                });
            }
            setLoading(false);
        };

        loadUserData();
    }, [user, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

        if (!ALLOWED_TYPES.includes(file.type)) {
            setProfileError('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
            e.target.value = '';
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setProfileError('File size exceeds 5MB limit.');
            e.target.value = '';
            return;
        }

        setProfileError('');
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = async () => {
        setProfileError('');
        setProfileSuccess('');

        // If a file was selected, upload it and we're done (upload handler updates the user)
        if (avatarFile) {
            const uploadResponse = await uploadAvatar(avatarFile);
            if (!uploadResponse.success) {
                setProfileError(uploadResponse.message || 'Failed to upload avatar');
                return;
            }

            // Upload successful - update local state with the response
            if (uploadResponse.data) {
                setUserData(uploadResponse.data);
                setFormData({
                    username: uploadResponse.data.username,
                    email: uploadResponse.data.email,
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                });
            }

            setIsEditing(false);
            setAvatarFile(null);
            setAvatarPreview('');
            setProfileSuccess('Avatar uploaded successfully');
            return;
        }

        // No file upload, just update profile fields
        const response = await editUser({
            username: formData.username,
            email: formData.email
        });

        if (response.success && response.data) {
            setUserData(response.data);
            setIsEditing(false);
            setProfileSuccess('Profile updated successfully');
        } else {
            setProfileError(response.message || 'Failed to update profile');
        }
    };

    const handleUpdatePassword = async () => {
        setPasswordError('');
        setPasswordSuccess('');

        if (!formData.currentPassword || !formData.newPassword || !formData.confirmNewPassword) {
            setPasswordError('Please fill in all password fields');
            return;
        }

        if (formData.newPassword !== formData.confirmNewPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        const response = await editUser({
            username: formData.username,
            email: formData.email,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
            confirmNewPassword: formData.confirmNewPassword
        });

        if (response.success) {
            setFormData({
                ...formData,
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
            setPasswordSuccess('Password updated successfully');
        } else {
            setPasswordError(response.message || 'Failed to update password');
        }
    };

    const handleVerificationComplete = async () => {
        setShowVerificationModal(false);
        // Reload user data to get updated emailVerified status
        const response = await fetchUserData();
        if (response.success && response.data) {
            setUserData(response.data);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="my-account">
            <EmailVerificationModal
                isOpen={showVerificationModal}
                onClose={() => setShowVerificationModal(false)}
                onVerified={handleVerificationComplete}
                userId={user?.id || ''}
            />
            <div className="my-account-container">
                <div className="my-account-header">
                    <h1 className="my-account-title">My Account</h1>
                    <p className="my-account-subtitle">Manage your profile and settings</p>
                </div>

                {user && !user.emailVerified && (
                    <EmailVerificationBanner
                        onVerifyClick={() => setShowVerificationModal(true)}
                        userId={user.id}
                    />
                )}

                <div className="my-account-section">
                    <h2 className="my-account-section-title">Profile Information</h2>

                    {profileError && (
                        <div style={{
                            color: '#d32f2f',
                            backgroundColor: '#ffebee',
                            padding: '0.75rem',
                            borderRadius: '4px',
                            marginBottom: '1rem',
                            fontSize: '0.9rem'
                        }}>
                            {profileError}
                        </div>
                    )}

                    {profileSuccess && (
                        <div style={{
                            color: '#2e7d32',
                            backgroundColor: '#e8f5e9',
                            padding: '0.75rem',
                            borderRadius: '4px',
                            marginBottom: '1rem',
                            fontSize: '0.9rem'
                        }}>
                            {profileSuccess}
                        </div>
                    )}

                    <div className="my-account-field">
                        <label>Avatar</label>
                        <div className="my-account-avatar-container">
                            <img
                                src={userData?.avatarUrl}
                                alt="User Avatar"
                                className="my-account-avatar"
                            />
                        </div>
                        {isEditing && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="my-account-file-input"
                            />
                        )}
                    </div>
                    <div className="my-account-field">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                        />
                    </div>
                    <div className="my-account-field">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                        />
                    </div>
                    {isEditing ? (
                        <>
                            <button className="my-account-btn" onClick={handleSaveProfile}>Save Profile</button>
                            <button className="my-account-btn" onClick={() => {
                                setIsEditing(false);
                                setProfileError('');
                                setProfileSuccess('');
                            }}>Cancel</button>
                        </>
                    ) : (
                        <button className="my-account-btn" onClick={() => {
                            setIsEditing(true);
                            setProfileError('');
                            setProfileSuccess('');
                        }}>Edit Profile</button>
                    )}
                </div>

                <div className="my-account-section">
                    <h2 className="my-account-section-title">Change Password</h2>

                    {passwordError && (
                        <div style={{
                            color: '#d32f2f',
                            backgroundColor: '#ffebee',
                            padding: '0.75rem',
                            borderRadius: '4px',
                            marginBottom: '1rem',
                            fontSize: '0.9rem'
                        }}>
                            {passwordError}
                        </div>
                    )}

                    {passwordSuccess && (
                        <div style={{
                            color: '#2e7d32',
                            backgroundColor: '#e8f5e9',
                            padding: '0.75rem',
                            borderRadius: '4px',
                            marginBottom: '1rem',
                            fontSize: '0.9rem'
                        }}>
                            {passwordSuccess}
                        </div>
                    )}

                    <div className="my-account-field">
                        <label>Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            placeholder="Enter current password"
                        />
                    </div>
                    <div className="my-account-field">
                        <label>New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="my-account-field">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmNewPassword"
                            value={formData.confirmNewPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm new password"
                        />
                    </div>
                    <button className="my-account-btn" onClick={handleUpdatePassword}>Update Password</button>
                </div>

                <div className="my-account-section">
                    <h2 className="my-account-section-title">Two-Factor Authentication</h2>
                    <p className="my-account-section-subtitle">
                        Add an extra layer of security to your account by requiring a verification code from your authenticator app.
                    </p>
                    <TwoFactorStatus />
                </div>
            </div>
        </div>
    );
}

export default MyAccount;
