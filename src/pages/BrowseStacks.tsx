import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/BrowseStacks.css';
import {stackInfo} from "../utils/storedStacks";
import StackSummary from "../components/Global/StackSummary";
import AutostackLogo from "../images/AutostackLogo.png";


function BrowseStacks() {
    return (
        <div className="browse">
            <div className="browse-stacks">

                <div className="browse-header">
                    <input type="text" className="browse-stacks-search" placeholder="Search"/>

                    <div className="browse-stacks-filters">
                        <button className="browse-stacks-filter-btn">Popular descending</button>
                        <button className="browse-stacks-filter-btn">Rating</button>
                    </div>
                </div>

                <div className="browse-stacks-section">
                    <h2 className="browse-section-title">Most downloaded</h2>
                    <div className="browse-stack-list">
                        {
                            Array.from(stackInfo.values()).map(info => (
                                <NavLink to={`/StackInfo/${info.id}`} key={info.id} style={{ textDecoration: 'none' }}>
                                    <StackSummary id={info.id} />
                                </NavLink>
                            ))
                        }
                    </div>
                </div>

                <div className="browse-stacks-section">
                    <h2 className="browse-section-title">Recent Stacks</h2>
                    <div className="browse-stack-list">
                        {
                            Array.from(stackInfo.values()).map(info => (
                                <NavLink to={`/StackInfo/${info.id}`} key={info.id} style={{ textDecoration: 'none' }}>
                                    <StackSummary id={info.id} />
                                </NavLink>                        ))
                        }
                        {
                            Array.from(stackInfo.values()).map(info => (
                                <NavLink to={`/StackInfo/${info.id}`} key={info.id} style={{ textDecoration: 'none' }}>
                                    <StackSummary id={info.id} />
                                </NavLink>                          ))
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}

export default BrowseStacks;
