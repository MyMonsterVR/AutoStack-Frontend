import React, { useState } from 'react';
import '../css/Download.css';

interface FAQItem {
    question: string;
    answer: string;
}

function DownloadCli() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleDownload = (platform: 'windows' | 'linux') => {
        const fileName = platform === 'windows' ? 'AutoStackSetup.exe' : 'AutoStackSetup.flatpak';
        window.location.href = `https://autostack.dk/downloads/${fileName}`;
    };

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqItems: FAQItem[] = [
        {
            question: "What is the AutoStack CLI?",
            answer: "The AutoStack CLI is a lightweight console application that runs on your machine. It automatically installs stacks, and files directly into your project when you click 'Install' on any stack in AutoStack."
        },
        {
            question: "What platforms are supported?",
            answer: "AutoStack CLI is currently available for Windows (.exe installer) and Linux (Flatpak package). Download the version that matches your operating system from the buttons above."
        },
        {
            question: "How do I install it?",
            answer: "Installation is simple: 1) Click the download button for your platform above. 2) Run the installer once it downloads. 3) Return to AutoStack and click 'Install' on any stack - the CLI will launch automatically and handle the installation."
        },
        {
            question: "Do I need to use the install button on a stack?",
            answer: "No, you can also open the AutoStack CLI as a normal application to browse different stacks, setup custom paths and change your package manager",
        },
        {
            question: "Why should I log in to the AutoStack CLI?",
            answer: "Logging in enables you to download more stacks within a short period of time.",
        },
        {
            question: "Do I need to download it every time?",
            answer: "No! You only need to download and install the CLI once. After that, AutoStack can automatically launch it whenever you install a stack. The CLI stays on your machine and works with all your projects."
        },
        {
            question: "Is it safe?",
            answer: "Yes, the AutoStack CLI is completely safe. It only runs when you explicitly click 'Install' on a stack, and it only modifies the project folder you specify."
        }
    ];

    return (
        <div className="download-page">
            {/* Hero Banner Section */}
            <section className="download-hero">
                <div className="download-hero-content">
                    <h1 className="download-hero-title">Download AutoStack CLI</h1>
                    <p className="download-hero-subtitle">
                        Our lightweight console app that installs stacks directly into your project.
                    </p>
                    <div className="download-hero-buttons">
                        <button
                            type="button"
                            className="download-btn download-btn-primary"
                            onClick={() => handleDownload('windows')}
                        >
                            Download for Windows
                        </button>
                        <button
                            type="button"
                            className="download-btn download-btn-secondary"
                            onClick={() => handleDownload('linux')}
                        >
                            Download for Linux
                        </button>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="download-faq-section">
                <h2 className="download-faq-title">Frequently Asked Questions</h2>
                <div className="download-faq-container">
                    {faqItems.map((item, index) => (
                        <div key={index} className="download-faq-item">
                            <button
                                type="button"
                                className="download-faq-question"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span>{item.question}</span>
                                <span className={`download-faq-icon ${openIndex === index ? 'open' : ''}`}>
                                    ▼
                                </span>
                            </button>
                            {openIndex === index && (
                                <div className="download-faq-answer">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default DownloadCli;
