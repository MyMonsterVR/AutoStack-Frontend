import React, {useEffect, useState} from 'react';
import HeroBanner from '../components/Home/HeroBanner';
import StackSummary from '../components/Global/StackSummary';
import SkeletonCard from '../components/Global/SkeletonCard';
import '../css/Home.css';
import '../css/Global.css'
import {addToStacks} from '../utils/storedStacks';
import {NavLink} from "react-router-dom";
import {fetchStacks, SortBy, SortingOrder, StackInfoType} from '../utils/Api/Stacks';

function Home() {
    const [trendingStacks, setTrendingStacks] = useState<StackInfoType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTrendingStacks = async () => {
            setIsLoading(true);

            const response = await fetchStacks(
                SortBy.Popularity,
                SortingOrder.DESC,
                undefined,
                1,
                5
            );

            if (response.success && 'data' in response) {
                setTrendingStacks(response.data.items);
                response.data.items.forEach(stack => addToStacks(stack.id, stack));
            }

            setIsLoading(false);
        };

        loadTrendingStacks();
    }, []);

    const stackSummaries = trendingStacks.map(info => (
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
