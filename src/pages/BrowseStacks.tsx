import React, {useEffect, useState} from 'react';
import { NavLink } from 'react-router-dom';
import '../css/BrowseStacks.css';
import '../css/Global.css';
import {stackInfo, subscribeStacks} from "../utils/storedStacks";
import StackSummary from "../components/Global/StackSummary";
import AutostackLogo from "../images/AutostackLogo.png";


function BrowseStacks() {

    // Used to force re-render when stacks are updated
    const [, forceUpdate] = useState({});

    useEffect(() => {
        // Forces a state change when stacks are updated
        const unsubscribe = subscribeStacks(() => {
            forceUpdate({});
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const stackSummariesByDownloads = Array.from(stackInfo.values()).sort((a,b)=> {
        return a.downloads < b.downloads ? 1 : -1;
    }).map(info => (
        <NavLink className="textDecoration-none" to={`/StackInfo/${info.id}`} key={info.id}>
            <StackSummary id={info.id} />
        </NavLink>
    ));

    /*const stackSummariesByDate = Array.from(stackInfo.values()).sort((a,b)=> {
        return a.postedDate < b.postedDate ? 1 : -1;
    }).map(info => (
        <NavLink className="textDecoration-none" to={`/StackInfo/${info.id}`} key={info.id}>
            <StackSummary id={info.id} />
        </NavLink>
    ));*/

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
                        {stackSummariesByDownloads}
                    </div>
                </div>

                <div className="browse-stacks-section">
                    <h2 className="browse-section-title">Recent Stacks</h2>
                    <div className="browse-stack-list">
                        {/*stackSummariesByDate*/}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default BrowseStacks;
