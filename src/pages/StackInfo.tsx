import React from 'react';
import { useParams } from 'react-router-dom';
import '../css/StackInfo.css';
import { getStackInfo } from '../utils/storedStacks';

function StackInfo() {
    const { id } = useParams();
    const numericId = Number(id);

    const info = getStackInfo(numericId);

    if (!info) {
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
                        <h1 className="stack-info-name">{info.name}</h1>
                        <span className="stack-info-type-badge">
                            {info.type || 'Fullstack'}
                        </span>
                    </div>
                    <p className="stack-info-author">
                        {info.author || 'Unknown user'}
                    </p>
                </div>

                <div className="stack-info-layout">
                    <div className="stack-info-left">
                        <h2 className="stack-info-packages-title">Packages</h2>

                        <div className="stack-info-packages-list">
                            <p className="stack-info-no-packages">
                                No packages added yet.
                            </p>
                        </div>
                    </div>

                    <div className="stack-info-right">
                        <p className="stack-info-description">
                            {info.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StackInfo;
