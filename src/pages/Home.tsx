import React from 'react';
import HeroBanner from '../components/Home/HeroBanner';
import StackSummary from '../components/Global/StackSummary';
import '../css/Home.css';
import { stackInfo } from '../utils/storedStacks';

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
                            <StackSummary id={info.id} key={info.id}/>
                        ))
                    }
                </div>
            </section>
        </div>
    </div>
  );
}

export default Home;