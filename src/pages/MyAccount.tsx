import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserData } from '../utils/Api/UserData';
import { GUID } from '../utils/global';
import { useNavigate } from 'react-router-dom';
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

    useEffect(() => {
        const loadUserData = async () => {
            if (!user) {
                navigate('/login');
                return;
            }

            const response = await fetchUserData();
            if (response.success && response.data) {
                setUserData(response.data);
                console.log('User Data:', userData);
            }
            setLoading(false);
        };

        loadUserData();
    }, [user, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }


    return (
        <div className="my-account">
            <div className="my-account-container">
                <div className="my-account-header">
                    <h1 className="my-account-title">My Account</h1>
                    <p className="my-account-subtitle">Manage your profile and settings</p>
                </div>

                <div className="my-account-section">
                    <h2 className="my-account-section-title">Profile Information</h2>
                    <div className="my-account-field">
                        <label>Username</label>
                        <input type="text" value={userData?.username || ''} readOnly />
                    </div>
                    <div className="my-account-field">
                        <label>Email</label>
                        <input type="email" value={userData?.email || ''} readOnly />
                    </div>
                    <button className="my-account-btn">Edit Profile</button>
                </div>

                <div className="my-account-section">
                    <h2 className="my-account-section-title">Change Password</h2>
                    <div className="my-account-field">
                        <label>Current Password</label>
                        <input type="password" placeholder="Enter current password" />
                    </div>
                    <div className="my-account-field">
                        <label>New Password</label>
                        <input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="my-account-field">
                        <label>Confirm New Password</label>
                        <input type="password" placeholder="Confirm new password" />
                    </div>
                    <button className="my-account-btn">Update Password</button>
                </div>
            </div>
        </div>
    );
}

export default MyAccount;
