import React, { useState, FormEvent } from 'react';
import '../css/CreateStack.css';
import {createStack, PackageInfo, StackType} from "../utils/Api/Stacks";
import {NavLink, useNavigate} from "react-router-dom";


interface PackageRow {
    id: number;
    name: string;
    link: string;
}

function CreateStack() {
    const [name, setName] = useState('');
    const [type, setType] = useState('FRONTEND');
    const [description, setDescription] = useState('');
    const [packageRows, setPackageRows] = useState<PackageRow[]>([]);
    const [nextId, setNextId] = useState(1);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const addPackageRow = () => {
        setPackageRows([...packageRows, { id: nextId, name: '', link: '' }]);
        setNextId(nextId + 1);
    };

    const removePackageRow = (id: number) => {
        setPackageRows(packageRows.filter(row => row.id !== id));
    };

    const updatePackage = (id: number, field: 'name' | 'link', value: string) => {
        setPackageRows(packageRows.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        ));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const validPackages = packageRows
            .filter(row => row.name.trim() !== '' && row.link.trim() !== '')
            .map(row => ({ name: row.name.trim(), link: row.link.trim() }));

        try {
            const response = await createStack(name, description, type as StackType, validPackages);

            if (response.success) {
                navigate(`/StackInfo/${response.data?.id}`);
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
                            <button type="button" className="create-stack-add-package" onClick={addPackageRow} disabled={isLoading}>+</button>
                        </div>

                        <div className="create-stack-packages-list">
                            {packageRows.map(row => (
                                <div key={row.id} className="create-stack-package-row">
                                    <input
                                        type="text"
                                        className="create-stack-package-input"
                                        placeholder="Package name"
                                        value={row.name}
                                        onChange={(e) => updatePackage(row.id, 'name', e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <input
                                        type="text"
                                        className="create-stack-package-input"
                                        placeholder="Package link"
                                        value={row.link}
                                        onChange={(e) => updatePackage(row.id, 'link', e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="create-stack-package-remove"
                                        onClick={() => removePackageRow(row.id)}
                                        disabled={isLoading}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
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
