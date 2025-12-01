import React from 'react';
import '../css/Download.css';

function DownloadCli() {

    const handleDownload = () => {
        window.location.href = 'https://autostack.dk/downloads/AutoStackSetup.exe';
    };

    return (
        <div className="download-page">
            <div className="download-card">

                <div className="download-header">
                    <div>
                        <h1 className="download-title">Download AutoStack CLI</h1>
                        <p className="download-subtitle">Our lightweight console app that installs stacks directly into your project.</p>
                    </div>
                </div>

                <div className="download-layout">

                    <div className="download-left">
                        <h2 className="download-section-title">How does it work?</h2>
                        <p className="download-text">
                            The AutoStack CLI runs as a small console application on your machine.
                            You download it once, and afterwards you can simply click
                            <strong> “Install”</strong> on any stack inside AutoStack.
                        </p>

                        <ul className="download-list">
                            <li>✅ We automatically launch the CLI for you</li>
                            <li>✅ It installs all packages and files into your project</li>
                            <li>✅ No manual commands needed</li>
                        </ul>
                    </div>

                    <div className="download-right">
                        <h2 className="download-section-title">Step 1 – Download the CLI</h2>
                        <p className="download-text">
                            Download the AutoStack CLI to your machine and run the installer.
                            Once it's set up, the AutoStack website can automatically launch it
                            whenever you install a stack.
                        </p>

                        <button type="button" className="download-download-btn" onClick={handleDownload}>Download AutoStack CLI</button>

                        <p className="download-text-note">
                            After downloading:
                            <br />1. Run the installer.
                            <br />2. Open your project in your editor.
                            <br />3. Return to AutoStack and click <strong>“Install”</strong> on any stack — we handle the rest.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default DownloadCli;
