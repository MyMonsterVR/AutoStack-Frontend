import React from 'react';
import HeroBanner from '../components/Home/HeroBanner';
import StackSummary from '../components/Global/StackSummary';
import '../css/Home.css';
import { stackInfo } from '../utils/storedStacks';
import {NavLink} from "react-router-dom";

function Home() {
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
                    {
                        Array.from(stackInfo.values()).map(info => (
                            <NavLink to={`/StackInfo/${info.id}`} key={info.id} style={{ textDecoration: 'none' }}>
                                <StackSummary id={info.id} />
                            </NavLink>
                        ))
                    }
                </div>
            </section>
        </div>
    </div>
  );
}

export default Home;