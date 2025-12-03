import React, { useState, useEffect, FormEvent } from 'react';
import '../css/CreateStack.css';
import { createStack, PackageInfo, StackType, fetchVerifiedPackages } from "../utils/Api/Stacks";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import AddPackageModal from '../components/Global/AddPackageModal';

function CreateStack() {
    const [name, setName] = useState('');
    const [type, setType] = useState('FRONTEND');
    const [description, setDescription] = useState('');
    const [packages, setPackages] = useState<PackageInfo[]>([]);
    const [verifiedPackages, setVerifiedPackages] = useState<PackageInfo[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { isLoading: authLoading } = useAuth();

    useEffect(() => {
        if (authLoading) return;

        const loadVerifiedPackages = async () => {
            try {
                const response = await fetchVerifiedPackages();
                if (response.success && response.data) {
                    setVerifiedPackages(response.data);
                } else {
                    console.error('Failed to fetch verified packages:', response.message);
                }
            } catch (err) {
                console.error('Error loading verified packages:', err);
            }
        };
        loadVerifiedPackages();
    }, [authLoading]);

    const handleAddPackage = (pkg: PackageInfo) => {
        setPackages([...packages, pkg]);
    };

    const removePackage = (index: number) => {
        setPackages(packages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (packages.length === 0) {
            setError('Please add at least one package');
            setIsLoading(false);
            return;
        }

        try {
            const response = await createStack(name, description, type as StackType, packages);

            if (response.success) {
                navigate(`/stackinfo/${response.data?.id}`);
            } else {
                setError(response.message || 'Failed to create stack');
            }
        } catch (err: any) {
            console.error('Create stack error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="create-stack">
            <form className="create-stack-card" onSubmit={handleSubmit}>
                <div className="create-stack-header">
                    {error && (
                        <div style={{
                            color: '#d32f2f',
                            backgroundColor: '#ffebee',
                            padding: '0.75rem',
                            borderRadius: '4px',
                            marginBottom: '1rem',
                            fontSize: '0.9rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="create-stack-title-row">
                        <input className="create-stack-name-input" type="text" name="name" placeholder="Stack name (e.g. MERN)" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} required/>

                        <select className="create-stack-type-select" name="type" value={type} onChange={(e) => setType(e.target.value)} disabled={isLoading}>
                            <option value="FRONTEND">Frontend</option>
                            <option value="BACKEND">Backend</option>
                            <option value="FULLSTACK">Fullstack</option>
                        </select>
                    </div>

                    <p className="create-stack-author">By <span>You</span></p>
                </div>

                <div className="create-stack-layout">
                    <div className="create-stack-left">
                        <div className="create-stack-packages-header">
                            <h2 className="create-stack-packages-title">Packages</h2>
                            <button
                                type="button"
                                className="create-stack-add-package"
                                onClick={() => setIsModalOpen(true)}
                                disabled={isLoading}
                            >
                                +
                            </button>
                        </div>

                        <div className="create-stack-packages-list">
                            {packages.length === 0 ? (
                                <div className="create-stack-empty-state">
                                    No packages added yet. Click + to add a package.
                                </div>
                            ) : (
                                packages.map((pkg, index) => (
                                    <div key={index} className="create-stack-package-item">
                                        <div className="create-stack-package-info">
                                            <div className="create-stack-package-name">
                                                {pkg.name}
                                                {pkg.isVerified && (
                                                    <span className="create-stack-verified-badge">✓</span>
                                                )}
                                            </div>
                                            <a
                                                href={pkg.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="create-stack-package-link"
                                            >
                                                {pkg.link}
                                            </a>
                                        </div>
                                        <button
                                            type="button"
                                            className="create-stack-package-remove"
                                            onClick={() => removePackage(index)}
                                            disabled={isLoading}
                                            aria-label="Remove package"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="create-stack-right">
                        <textarea className="create-stack-description" name="description" placeholder="Describe what this stack is for, how it is structured, etc." value={description} onChange={(e) => setDescription(e.target.value)} disabled={isLoading}/>
                    </div>
                </div>

                <div className="create-stack-footer">
                    <NavLink to="/" className="create-stack-btn secondary">Cancel</NavLink>

                    <button type="submit" className="create-stack-btn primary" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Stack'}
                    </button>
                </div>
            </form>

            <AddPackageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddPackage}
                verifiedPackages={verifiedPackages}
            />
        </div>
    );
}

export default CreateStack;
