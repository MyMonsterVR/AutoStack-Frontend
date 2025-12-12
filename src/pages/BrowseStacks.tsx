import React, {useEffect, useState} from 'react';
import { NavLink } from 'react-router-dom';
import '../css/BrowseStacks.css';
import '../css/Global.css';
import {addToStacks} from "../utils/storedStacks";
import StackSummary from "../components/Global/StackSummary";
import SkeletonCard from "../components/Global/SkeletonCard";
import { fetchStacks, SortBy, SortingOrder, StackInfoType } from "../utils/Api/Stacks";

function BrowseStacks() {
    const [isLoadingDownloaded, setIsLoadingDownloaded] = useState(true);
    const [isLoadingRecent, setIsLoadingRecent] = useState(true);

    const [mostDownloadedStacks, setMostDownloadedStacks] = useState<StackInfoType[]>([]);
    const [downloadedPage, setDownloadedPage] = useState(1);
    const [downloadedTotalPages, setDownloadedTotalPages] = useState(1);
    const [downloadedHasNext, setDownloadedHasNext] = useState(false);
    const [downloadedHasPrev, setDownloadedHasPrev] = useState(false);

    const [recentStacks, setRecentStacks] = useState<StackInfoType[]>([]);
    const [recentPage, setRecentPage] = useState(1);
    const [recentTotalPages, setRecentTotalPages] = useState(1);
    const [recentHasNext, setRecentHasNext] = useState(false);
    const [recentHasPrev, setRecentHasPrev] = useState(false);

    const hasLoadedRef = React.useRef(false);
    const hasLoadedDownloadedOnce = React.useRef(false);
    const hasLoadedRecentOnce = React.useRef(false);
    const pageSize = 24;

    const loadMostDownloaded = async (page: number) => {
        setIsLoadingDownloaded(true);

        const response = await fetchStacks(
            SortBy.Popularity,
            SortingOrder.DESC,
            undefined,
            page,
            pageSize
        );

        if (response.success && 'data' in response) {
            setMostDownloadedStacks(response.data.items);
            setDownloadedTotalPages(response.data.totalPages);
            setDownloadedHasNext(response.data.hasNextPage);
            setDownloadedHasPrev(response.data.hasPreviousPage);
            response.data.items.forEach(stack => addToStacks(stack.id, stack));
            hasLoadedDownloadedOnce.current = true;
        }

        setIsLoadingDownloaded(false);
    };

    const loadRecent = async (page: number) => {
        setIsLoadingRecent(true);

        const response = await fetchStacks(
            SortBy.PostedDate,
            SortingOrder.DESC,
            undefined,
            page,
            pageSize
        );

        if (response.success && 'data' in response) {
            setRecentStacks(response.data.items);
            setRecentTotalPages(response.data.totalPages);
            setRecentHasNext(response.data.hasNextPage);
            setRecentHasPrev(response.data.hasPreviousPage);
            response.data.items.forEach(stack => addToStacks(stack.id, stack));
            hasLoadedRecentOnce.current = true;
        }

        setIsLoadingRecent(false);
    };

    useEffect(() => {
        if (!hasLoadedRef.current) {
            hasLoadedRef.current = true;
            loadMostDownloaded(1);
            loadRecent(1);
        }
    }, []);

    const handleDownloadedPrev = () => {
        if (downloadedHasPrev) {
            const newPage = downloadedPage - 1;
            setDownloadedPage(newPage);
            loadMostDownloaded(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleDownloadedNext = () => {
        if (downloadedHasNext) {
            const newPage = downloadedPage + 1;
            setDownloadedPage(newPage);
            loadMostDownloaded(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleRecentPrev = () => {
        if (recentHasPrev) {
            const newPage = recentPage - 1;
            setRecentPage(newPage);
            loadRecent(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleRecentNext = () => {
        if (recentHasNext) {
            const newPage = recentPage + 1;
            setRecentPage(newPage);
            loadRecent(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

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
                    <h2 className="browse-section-title">Most Downloaded</h2>
                    {isLoadingDownloaded && !hasLoadedDownloadedOnce.current ? (
                        <div className="browse-stack-list">
                            {Array.from({ length: 20 }).map((_, index) => (
                                <SkeletonCard key={index} />
                            ))}
                        </div>
                    ) : mostDownloadedStacks.length === 0 ? (
                        <div className="empty-state">
                            <p className="empty-state-text">No stacks found.</p>
                        </div>
                    ) : (
                        <>
                            <div className="browse-stack-list">
                                {stackSummariesByDownloads}
                            </div>
                            {downloadedTotalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="pagination-btn"
                                        onClick={handleDownloadedPrev}
                                        disabled={!downloadedHasPrev}
                                    >
                                        Previous
                                    </button>
                                    <span className="pagination-info">
                                        Page {downloadedPage} of {downloadedTotalPages}
                                    </span>
                                    <button
                                        className="pagination-btn"
                                        onClick={handleDownloadedNext}
                                        disabled={!downloadedHasNext}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="browse-stacks-section">
                    <h2 className="browse-section-title">Recent Stacks</h2>
                    {isLoadingRecent && !hasLoadedRecentOnce.current ? (
                        <div className="browse-stack-list">
                            {Array.from({ length: 20 }).map((_, index) => (
                                <SkeletonCard key={index} />
                            ))}
                        </div>
                    ) : recentStacks.length === 0 ? (
                        <div className="empty-state">
                            <p className="empty-state-text">No stacks found.</p>
                        </div>
                    ) : (
                        <>
                            <div className="browse-stack-list">
                                {stackSummariesByDate}
                            </div>
                            {recentTotalPages > 1 && (
                                <div className="pagination">
                                    <button className="pagination-btn" onClick={handleRecentPrev} disabled={!recentHasPrev}>Previous</button>
                                    <span className="pagination-info">
                                        Page {recentPage} of {recentTotalPages}
                                    </span>
                                    <button className="pagination-btn" onClick={handleRecentNext} disabled={!recentHasNext}>Next</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BrowseStacks;
