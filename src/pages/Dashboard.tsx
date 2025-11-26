import React from 'react';
import '../css/MyStacks.css';
import {stackInfo} from "../utils/storedStacks";
import StackSummary from "../components/Global/StackSummary";

function Dashboard() {
    return (
        <div className="stacks">
            <div className="my-stacks">
                <div className="my-header">
                    <input type="text" className="my-search" placeholder="Search"/>
                    <button className="my-create">Create Stack</button>
                </div>

                <div className="my-stacks-section">
                    <h2 className="my-section-title">My Stacks</h2>
                    <div className="my-stack-list">
                        {
                            Array.from(stackInfo.values()).map(info => (
                                <StackSummary id={info.id}/>
                            ))
                        }
                    </div>
                </div>

                <div className="my-stacks-section">
                    <h2 className="my-section-title">My Templates</h2>
                    <div className="my-stack-list">
                        {
                            Array.from(stackInfo.values()).map(info => (
                                <StackSummary id={info.id}/>
                            ))
                        }
                        {
                            Array.from(stackInfo.values()).map(info => (
                                <StackSummary id={info.id}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
