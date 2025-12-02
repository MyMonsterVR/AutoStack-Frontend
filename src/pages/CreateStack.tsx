import React, { useState, FormEvent } from 'react';
import '../css/CreateStack.css';
import {createStack, PackageInfo, StackType} from "../utils/Api/Stacks";
import {NavLink, useNavigate} from "react-router-dom";


function CreateStack() {
    const [name, setName] = useState('');
    const [type, setType] = useState('Frontend');
    const [description, setDescription] = useState('');
    const [packages, setPackages] = useState<PackageInfo[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const createPackageRow = () => {
        document.querySelector(".create-stack-packages-list")?.insertAdjacentHTML('beforeend', `
            <div class="create-stack-package-row">
                <input type="text" class="create-stack-package-input" name="packageName" placeholder="Package name"/>
                <input type="text" class="create-stack-package-input" name="packageLink" placeholder="Package link"/>
                <span class="create-stack-package-arrow">&gt;</span>
            </div>
        `);
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const type = formData.get('type') as StackType;

        const collectedPackages: PackageInfo[] = [];
        document.querySelectorAll(".create-stack-package-row").forEach(pkg => {
            const packageNameInput = pkg.querySelector('input[name="packageName"]') as HTMLInputElement;
            const packageLinkInput = pkg.querySelector('input[name="packageLink"]') as HTMLInputElement;

            if (packageNameInput && packageLinkInput) {
                const packageName = packageNameInput.value;
                const packageLink = packageLinkInput.value;

                if (packageName.trim() !== '' && packageLink.trim() !== '') {
                    collectedPackages.push({ name: packageName, link: packageLink });
                }
            }
        });

        try {
            const response = await createStack(name, description, type, collectedPackages);

            if (response.success) {
                navigate(`/StackInfo/${response.data?.id}`);
            }
            else {
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
                            <button type="button" className="create-stack-add-package" onClick={createPackageRow} disabled={isLoading}>+</button>
                        </div>

                        <div className="create-stack-packages-list">
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
        </div>
    );
}

export default CreateStack;
