import React from 'react';
import '../css/BrowseStacks.css';
import {stackInfo} from "../utils/storedStacks";
import StackSummary from "../components/Global/StackSummary";


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

                <div className="browse-stacks-section">
                    <h2 className="browse-section-title">Most downloaded</h2>
                    <div className="browse-stack-list">
                        {
                            Array.from(stackInfo.values()).map(info => (
                                <StackSummary id={info.id}/>
                            ))
                        }
                    </div>
                </div>

                <div className="browse-stacks-section">
                    <h2 className="browse-section-title">Recent Stacks</h2>
                    <div className="browse-stack-list">
                        {
                            Array.from(stackInfo.values()).map(info => (
                                <StackSummary id={info.id}/>
                            ))
                        }
                        {
                            Array.from(stackInfo.values()).map(info => (
                                <StackSummary id={info.id}/>
                            ))
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}

export default BrowseStacks;
