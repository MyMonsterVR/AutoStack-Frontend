import React, {useEffect, useState} from 'react';
import { NavLink } from 'react-router-dom';
import '../css/BrowseStacks.css';
import '../css/Global.css';
import {stackInfo, subscribeStacks} from "../utils/storedStacks";
import StackSummary from "../components/Global/StackSummary";

// Simple skeleton component
function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton skeleton-thumb"></div>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-sub"></div>
        </div>
    );
}

function BrowseStacks() {
    const [, forceUpdate] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeStacks(() => {
            forceUpdate({});
            setIsLoading(false);
        });

        if (stackInfo.size > 0) {
            setIsLoading(false);
        }

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

    const stackSummariesByDate = Array.from(stackInfo.values())
        .sort((a,b)=> {
            return Date.parse(a.createdAt) < Date.parse(b.createdAt) ? 1 : -1;
        })
        .map(info => (
            <NavLink className="textDecoration-none" to={`/StackInfo/${info.id}`} key={info.id}>
                <StackSummary id={info.id} />
            </NavLink>
        ));

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
                        {isLoading ? (
                            Array.from({ length: 20 }).map((_, index) => (
                                <SkeletonCard key={index} />
                            ))
                        ) : (
                            stackSummariesByDownloads
                        )}
                    </div>
                </div>

                <div className="browse-stacks-section">
                    <h2 className="browse-section-title">Recent Stacks</h2>
                    <div className="browse-stack-list">
                        {isLoading ? (
                            Array.from({ length: 20 }).map((_, index) => (
                                <SkeletonCard key={index} />
                            ))
                        ) : (
                            stackSummariesByDate
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BrowseStacks;
