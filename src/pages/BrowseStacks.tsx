import React from 'react';
import '../css/BrowseStacks.css';

function BrowseStacks() {
    return (
        <div className="browse">
            <div className="browse-stacks">

                <div className="browse-header">
                    <input type="text" className="browse-search" placeholder="Search"/>

                    <div className="browse-filters">
                        <button className="browse-filter-btn">Popular descending</button>
                        <button className="browse-filter-btn">Rating</button>
                    </div>
                </div>

                <h2 className="browse-section-title">Most downloaded</h2>
                <div className="browse-stack-list"></div>

                <h2 className="browse-section-title">Recent Stacks</h2>
                <div className="browse-stack-list"></div>

            </div>
        </div>
    );
}

export default BrowseStacks;
