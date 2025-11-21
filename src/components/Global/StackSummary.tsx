import React from 'react';
import { getStackInfo } from '../../utils/storedStacks';
import '../../css/StackSummary.css';


function StackSummary(props: { id: number }): React.ReactElement<number> {

    const stackInfo = getStackInfo(props.id);

    return (
        <div className="stack-summary-card">

            <div className="stack-summary-header">
                <h2 className="stack-summary-title">{stackInfo?.name}</h2>

                <span className="stack-summary-badge">
                    {stackInfo?.type || "Fullstack"}
                </span>
            </div>

            <p className="stack-summary-description">
                {stackInfo?.description}
            </p>

            <div className="stack-summary-footer">
                <img
                    src={stackInfo?.authorImg || "/images/default-avatar.png"}
                    className="stack-summary-avatar"
                    alt="User avatar"
                />
                <span className="stack-summary-username">
                    {stackInfo?.author || "Unknown user"}
                </span>
            </div>

        </div>
    );
}

export default StackSummary;
