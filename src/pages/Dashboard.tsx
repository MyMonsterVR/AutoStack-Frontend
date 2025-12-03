import React, { useMemo, useEffect } from 'react';
import '../css/Dashboard.css';
import { stackInfo } from "../utils/storedStacks";
import StackSummary from "../components/Global/StackSummary";
import { useAuth } from '../contexts/AuthContext';
import {NavLink, useNavigate} from 'react-router-dom';

function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const userStacks = useMemo(() => {
        if (!user) return [];
        return Array.from(stackInfo.values())
            .filter(info => info.userId === user.id)
            .sort((a, b) => {
                return Date.parse(b.createdAt) - Date.parse(a.createdAt);
            });
    }, [user]);

    const stackSummariesByDate = userStacks.map(info => (
        <NavLink className="textDecoration-none" to={`/StackInfo/${info.id}`} key={info.id}>
            <StackSummary id={info.id} />
        </NavLink>
    ));
    

    return (
        <div className="stacks">
            <div className="my-stacks">
                <div className="my-header">
                    <input type="text" className="my-search" placeholder="Search"/>
                    <NavLink to="/CreateStack" className="my-create">Create Stack</NavLink>
                </div>

                <div className="my-stacks-section">
                    <h2 className="my-section-title">My Stacks</h2>
                    <div className="my-stack-list">
                        {stackSummariesByDate}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
