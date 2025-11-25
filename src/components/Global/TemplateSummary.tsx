import React from 'react';
import { getToTemplates } from '../../utils/storedTemplates';
import '../../css/TemplateSummary.css';

function TemplateSummary(props: { id: number }): React.ReactElement<number> {

    const templateInfo = getToTemplates(props.id);

    return (
        <div className="template-summary-card">

            <div className="template-summary-header">
                <h2 className="template-summary-title">{templateInfo?.name}</h2>

                <span className="template-summary-badge">
                    {templateInfo?.type || "Fullstack"}
                </span>
            </div>

            <p className="template-summary-description">
                {templateInfo?.description}
            </p>

            <div className="template-summary-footer">
                <img
                    src={templateInfo?.authorImg || "/images/default-avatar.png"}
                    className="template-summary-avatar"
                    alt="User avatar"
                />
                <span className="template-summary-username">
                    {templateInfo?.author || "Unknown user"}
                </span>
            </div>

        </div>
    );
}

export default TemplateSummary;
