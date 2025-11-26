import React, {useEffect, useState} from 'react';
import HeroBanner from '../components/Home/HeroBanner';
import StackSummary from '../components/Global/StackSummary';
import '../css/Home.css';
import {stackInfo, subscribeStacks} from '../utils/storedStacks';
import {NavLink} from "react-router-dom";

function Home() {
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

    console.log(Array.from(stackInfo.values()))
    const stackSummaries = Array.from(stackInfo.values()).sort((a,b)=> {
        return a.downloads < b.downloads ? 1 : -1;
    }).slice(0,5).map(info => (
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
                        {stackSummaries}
                    </div>
                </section>
            </div>
    </div>
);
}

export default Home;