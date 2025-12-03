import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { PackageInfo } from '../../utils/Api/Stacks';
import '../../css/AddPackageModal.css';

interface AddPackageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (pkg: PackageInfo) => void;
    verifiedPackages: PackageInfo[];
}

export default function AddPackageModal({ isOpen, onClose, onAdd, verifiedPackages }: AddPackageModalProps) {
    const [packageType, setPackageType] = useState<'verified' | 'custom'>('verified');
    const [selectedVerified, setSelectedVerified] = useState<string>('');
    const [customName, setCustomName] = useState('');
    const [customLink, setCustomLink] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setPackageType('verified');
            setSelectedVerified('');
            setCustomName('');
            setCustomLink('');
            setError('');
        }
    }, [isOpen]);

    const validateUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleAdd = () => {
        setError('');

        if (packageType === 'verified') {
            if (!selectedVerified) {
                setError('Please select a verified package');
                return;
            }

            const pkg = verifiedPackages.find(p => p.name === selectedVerified);
            if (pkg) {
                onAdd(pkg);
                onClose();
            }
        } else {
            if (!customName.trim()) {
                setError('Package name is required');
                return;
            }

            if (!customLink.trim()) {
                setError('Package link is required');
                return;
            }

            if (!validateUrl(customLink)) {
                setError('Please enter a valid URL');
                return;
            }

            onAdd({
                name: customName.trim(),
                link: customLink.trim(),
                isVerified: false
            });
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Add Package" size="lg">
            <div className="add-package-modal">
                <h2 className="add-package-modal-title">Add Package</h2>

                {error && (
                    <div className="add-package-modal-error">
                        {error}
                    </div>
                )}

                <div className="add-package-modal-type-selector">
                    <label className="add-package-modal-radio">
                        <input
                            type="radio"
                            name="packageType"
                            value="verified"
                            checked={packageType === 'verified'}
                            onChange={() => setPackageType('verified')}
                        />
                        <span>Verified Package</span>
                    </label>

                    <label className="add-package-modal-radio">
                        <input
                            type="radio"
                            name="packageType"
                            value="custom"
                            checked={packageType === 'custom'}
                            onChange={() => setPackageType('custom')}
                        />
                        <span>Custom Package</span>
                    </label>
                </div>

                {packageType === 'verified' ? (
                    <div className="add-package-modal-field">
                        <label htmlFor="verified-package">Select Package</label>
                        <select
                            id="verified-package"
                            className="add-package-modal-select"
                            value={selectedVerified}
                            onChange={(e) => setSelectedVerified(e.target.value)}
                        >
                            <option value="">-- Choose a package --</option>
                            {verifiedPackages.map((pkg) => (
                                <option key={pkg.name} value={pkg.name}>
                                    {pkg.name}
                                </option>
                            ))}
                        </select>
                        {selectedVerified && (
                            <div className="add-package-modal-link-preview">
                                <span className="add-package-modal-link-label">Link:</span>
                                <a
                                    href={verifiedPackages.find(p => p.name === selectedVerified)?.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="add-package-modal-link"
                                >
                                    {verifiedPackages.find(p => p.name === selectedVerified)?.link}
                                </a>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="add-package-modal-field">
                            <label htmlFor="custom-name">Package Name</label>
                            <input
                                id="custom-name"
                                type="text"
                                className="add-package-modal-input"
                                placeholder="e.g. React"
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                            />
                        </div>

                        <div className="add-package-modal-field">
                            <label htmlFor="custom-link">Package Link</label>
                            <input
                                id="custom-link"
                                type="url"
                                className="add-package-modal-input"
                                placeholder="https://example.com"
                                value={customLink}
                                onChange={(e) => setCustomLink(e.target.value)}
                            />
                        </div>
                    </>
                )}

                <div className="add-package-modal-actions">
                    <button
                        type="button"
                        className="add-package-modal-btn secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="add-package-modal-btn primary"
                        onClick={handleAdd}
                    >
                        Add Package
                    </button>
                </div>
            </div>
        </Modal>
    );
}
