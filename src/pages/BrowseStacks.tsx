import React, {useEffect, useState} from 'react';
import { NavLink } from 'react-router-dom';
import '../css/BrowseStacks.css';
import '../css/Global.css';
import {addToStacks, clearStacks} from "../utils/storedStacks";
import StackSummary from "../components/Global/StackSummary";
import { fetchStacks, SortBy, SortingOrder, StackInfoType } from "../utils/Api/Stacks";

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
    const [isLoading, setIsLoading] = useState(true);
    const [mostDownloadedStacks, setMostDownloadedStacks] = useState<StackInfoType[]>([]);
    const [recentStacks, setRecentStacks] = useState<StackInfoType[]>([]);

    useEffect(() => {
        const loadStacks = async () => {
            setIsLoading(true);

            // Fetch most downloaded stacks (sorted by Popularity descending)
            const downloadedResponse = await fetchStacks(
                SortBy.Popularity,
                SortingOrder.DESC,
                undefined,
                1,
                20
            );

            if (downloadedResponse.success && 'data' in downloadedResponse) {
                setMostDownloadedStacks(downloadedResponse.data.items);
                // Add to global store for caching
                downloadedResponse.data.items.forEach(stack => addToStacks(stack.id, stack));
            }

            // Fetch recent stacks (sorted by PostedDate descending)
            const recentResponse = await fetchStacks(
                SortBy.PostedDate,
                SortingOrder.DESC,
                undefined,
                1,
                20
            );

            if (recentResponse.success && 'data' in recentResponse) {
                setRecentStacks(recentResponse.data.items);
                // Add to global store for caching
                recentResponse.data.items.forEach(stack => addToStacks(stack.id, stack));
            }

            setIsLoading(false);
        };

        loadStacks();
    }, []);

    const stackSummariesByDownloads = mostDownloadedStacks.map(info => (
        <NavLink className="textDecoration-none" to={`/StackInfo/${info.id}`} key={info.id}>
            <StackSummary id={info.id} />
        </NavLink>
    ));

    const stackSummariesByDate = recentStacks.map(info => (
        <NavLink className="textDecoration-none" to={`/StackInfo/${info.id}`} key={info.id}>
            <StackSummary id={info.id} />
        </NavLink>
    ));

    return (
        <div className="browse">
            <div className="browse-stacks">

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
