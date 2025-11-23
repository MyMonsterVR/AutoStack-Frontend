import React from 'react';
import '../css/MyStacks.css';

function MyStacks() {
    return (
        <div className="stacks">
            <div className="my-stacks">
                <div className="my-header">
                    <input type="text" className="my-search" placeholder="Search"/>
                    <button className="my-create">Create Stack</button>
                </div>
                <h2 className="my-section-title">My Stacks</h2>
                <div className="my-stack-list">

                </div>
                <h2 className="my-section-title">My Templates</h2>
                <div className="my-stack-list">

                </div>
            </div>
        </div>
    );
}

export default MyStacks;
