import React from 'react';
import '../css/BrowseTemplate.css';
import {templateInfo} from "../utils/storedTemplates";
import TemplateSummary from "../components/Global/TemplateSummary";


function BrowseTemplates() {
    return (
        <div className="browse">
            <div className="browse-template">

                <div className="browse-template-header">
                    <input type="text" className="browse-template-search" placeholder="Search"/>

                    <div className="browse-template-filters">
                        <button className="browse-template-filter-btn">Popular descending</button>
                        <button className="browse-template-filter-btn">Rating</button>
                    </div>
                </div>

                <div className="browse-template-section">
                    <h2 className="browse-template-section-title">Most downloaded</h2>
                    <div className="browse-template-list">
                        {
                            Array.from(templateInfo.values()).map(info => (
                                <TemplateSummary id={info.id} key={info.id}/>
                            ))
                        }
                    </div>
                </div>

                <div className="browse-template-section">
                    <h2 className="browse-template-section-title">Recent Templates</h2>
                    <div className="browse-template-list">
                        {
                            Array.from(templateInfo.values()).map(info => (
                                <TemplateSummary id={info.id} key={info.id}/>
                            ))
                        }
                        {
                            Array.from(templateInfo.values()).map(info => (
                                <TemplateSummary id={info.id} key={info.id}/>
                            ))
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}

export default BrowseTemplates;
