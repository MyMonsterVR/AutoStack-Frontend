import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import '../css/StackInfo.css';
import { GUID } from "../utils/global";
import {fetchStackById, StackInfoType} from "../utils/Api/Stacks";
import ProtocolModal from "../components/Global/ProtocolModal";

function StackInfo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [stackInfo, setStackInfo] = useState({} as StackInfoType | null);
    const [modalState, setModalState] = useState<'loading' | 'error' | 'closed'>('closed');

    const TYPES: Record<string, string> = {
        "FRONTEND": "Frontend",
        "BACKEND": "Backend",
        "FULLSTACK": "Fullstack"
    }

    useEffect(() => {
        fetchStackById(id as GUID).then((res) => {
            const stackInfo = res as StackInfoType;
            setStackInfo(stackInfo);
        }).catch(err => {
            console.error('fetchStacksById failed', err);
        });
    }, [id]);

    const handleInstallClick = (): void => {
        setModalState('loading');
        let protocolDetected = false;
        let iframe: HTMLIFrameElement | null = null;

        // Detect browser's protocol confirmation dialog (causes blur)
        const handleBlur = () => {
            protocolDetected = true;
            // Auto-close modal after brief delay (protocol handler exists)
            setTimeout(() => {
                setModalState('closed');
                cleanup();
            }, 800);
        };

        const cleanup = () => {
            window.removeEventListener('blur', handleBlur);
            if (iframe && iframe.parentNode) {
                document.body.removeChild(iframe);
            }
        };

        // Listen for blur (browser dialog appearing)
        window.addEventListener('blur', handleBlur);

        // Trigger protocol via hidden iframe
        iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = `autostack://getstack/${id}`;
        document.body.appendChild(iframe);

        // Timeout: if no blur after 1800ms, show error
        setTimeout(() => {
            if (!protocolDetected) {
                setModalState('error');
            }
            cleanup();
        }, 1800);
    };

    const handleModalClose = () => {
        setModalState('closed');
    };

    const handleDownload = () => {
        setModalState('closed');
        navigate('/download');
    };

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
                        <div className="stack-info-right-top">
                            <span className={`stack-info-type-badge stack-info-type-badge-${TYPES[stackInfo.type]?.toLowerCase()}`}>
                                {TYPES[stackInfo.type] || 'Fullstack'}
                            </span>
                            <div onClick={handleInstallClick} className="stack-info-type-install">
                                <span>Install</span>
                            </div>
                        </div>
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
                                    <div className="package-name" key={idx}>
                                        <span>{info.packageName}</span>
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

            <ProtocolModal
                state={modalState}
                onClose={handleModalClose}
                onDownload={handleDownload}
            />
        </div>
    );
}

export default StackInfo;
