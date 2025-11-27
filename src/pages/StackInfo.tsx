import React, {useEffect, useState} from 'react';
import {NavLink, useParams} from 'react-router-dom';
import '../css/StackInfo.css';
import {addToStacks, getStackInfo, stackInfo} from '../utils/storedStacks';
import { GUID } from "../utils/global";
import StackSummary from "../components/Global/StackSummary";
import {fetchStackById, fetchStacks, StackInfoType} from "../utils/Api/Stacks";

function StackInfo() {
    const { id } = useParams();
    const [stackInfo, setStackInfo] = useState({} as StackInfoType | null);

    useEffect(() => {
        fetchStackById(id as GUID).then((res) => {
            const stackInfo = res as StackInfoType;
            setStackInfo(stackInfo);
            console.log(stackInfo);
        }).catch(err => {
            console.error('fetchStacksById failed', err);
        });
    }, [id]);

        if (!stackInfo) {
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
                        <h1 className="stack-info-name">{stackInfo.name}</h1>
                        <span className="stack-info-type-badge">
                            {stackInfo.type || 'Fullstack'}
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
                                {stackInfo.packages?.map((info, idx) => (
                                    <div className="package-name">
                                        <span key={idx}>{info.packageName}</span>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="stack-info-right">
                        <p className="stack-info-description">
                            {stackInfo.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StackInfo;
