import React, {useEffect, useState} from 'react';
import HeroBanner from '../components/Home/HeroBanner';
import StackSummary from '../components/Global/StackSummary';
import '../css/Home.css';
import '../css/Global.css'
import {stackInfo, subscribeStacks} from '../utils/storedStacks';
import {NavLink} from "react-router-dom";

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

function Home() {
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

    const stackSummaries = Array.from(stackInfo.values())
        .sort((a,b)=> a.downloads < b.downloads ? 1 : -1)
        .slice(0,5)
        .map(info => (
            <NavLink className="textDecoration-none" to={`/StackInfo/${info.id}`} key={info.id}>
                <StackSummary id={info.id} />
            </NavLink>
        ));

    return (
        <div className="home">
            <div className="home-banner">
                <HeroBanner />
            </div>
            <div className="home-content">
                <section className="home-trending">
                    <h2 className="home-trending-title">Trending stacks</h2>
                    <p className="home-trending-sub">Most downloaded stacks</p>

                    <div className="home-stack-list">
                        {isLoading ? (
                            <>
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                            </>
                        ) : (
                            stackSummaries
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;
