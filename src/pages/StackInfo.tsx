import React from 'react';
import {NavLink, useParams} from 'react-router-dom';
import '../css/StackInfo.css';
import {getStackInfo, stackInfo} from '../utils/storedStacks';
import { GUID } from "../utils/global";
import StackSummary from "../components/Global/StackSummary";

function StackInfo() {
    const { id } = useParams();

    const stackinfo = getStackInfo(id as GUID);

    if (!stackinfo) {
        return (
            <div className="stack-info-page">
                <div className="stack-info-empty">
                    <p>Stack not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="stack-info-page">
            <div className="stack-info-card">
                <div className="stack-info-header">
                    <div className="stack-info-title">
                        <h1 className="stack-info-name">{stackinfo.name}</h1>
                        <span className="stack-info-type-badge">
                            {stackinfo.type || 'Fullstack'}
                        </span>
                    </div>
                    <p className="stack-info-author">
                        {'Unknown user'}
                    </p>
                </div>

                <div className="stack-info-layout">
                    <div className="stack-info-left">
                        <h2 className="stack-info-packages-title">Packages</h2>
                        <div className="stack-info-packages-list">
                                {stackinfo.stackInfo.map((info, idx) => (
                                    <div className="package-name">
                                        <span key={idx}>{info.packageName}</span>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="stack-info-right">
                        <p className="stack-info-description">
                            {stackinfo.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StackInfo;
