import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../css/HeroBanner.css';


function HeroBanner() {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1 className="hero-title">
                    Auto<span>Stack</span>
                </h1>
                <p className="hero-subtitle">Tech stacks made easy</p>

                <div className="hero-buttons">
                    <a>
                        <NavLink to="/BrowseStacks" className="hero-btn">Stacks</NavLink>
                    </a>
                    <a>
                        <NavLink to="/templates" className="hero-btn">Templates</NavLink>
                    </a>
                </div>
            </div>
        </section>
    );
}

export default HeroBanner;
