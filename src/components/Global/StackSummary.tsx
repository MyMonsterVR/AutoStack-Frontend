import React from 'react';
import { getStackInfo } from '../../utils/storedStacks';
import '../../css/StackSummary.css';
import { GUID } from "../../utils/global";


function StackSummary(props: { id: GUID }): React.ReactElement<number> {

    const TYPES: Record<string, string> = {
        "FRONTEND": "Frontend",
        "BACKEND": "Backend",
        "FULLSTACK": "Fullstack"
    }

    const stackInfo = getStackInfo(props.id);

    if(!stackInfo) {
        return <div className="stack-summary-card">
            <p className="stack-summary-error">
                Stack not found.
            </p>
        </div>;
    }

    return (
        <div className="stack-summary-card">

            <div className="stack-summary-header">
                <h2 className="stack-summary-title">{stackInfo?.name}</h2>

                <span className={`stack-summary-badge stack-summary-badge-${TYPES[stackInfo.type]?.toLowerCase()}`}>
                    {TYPES[stackInfo.type]}
                </span>
            </div>

            <p className="stack-summary-description">
                {stackInfo?.description}
            </p>

            <div className="stack-summary-footer">
                <img
                    src={ "/images/default-avatar.png"}
                    className="stack-summary-avatar"
                    alt="User avatar"
                />
                <span className="stack-summary-username">
                    {"Unknown user"}
                </span>
            </div>

        </div>
    );
}

export default StackSummary;
