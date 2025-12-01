import React, { useState, FormEvent } from 'react';
import '../css/CreateStack.css';
import {createStack, PackageInfo, StackType} from "../utils/Api/Stacks";
import {NavLink} from "react-router-dom";


function CreateStack() {
    const [name, setName] = useState('');
    const [type, setType] = useState('Frontend');
    const [description, setDescription] = useState('');
    const [packages, setPackages] = useState<PackageInfo[]>([]);

    const addPackageRow = (name: string, link: string) => {
        setPackages([...packages, { packageName: name, packageLink: link }]);
    };

    const createPackageRow = () => {
        console.log("Clicked");
        document.querySelector(".create-stack-packages-list")?.insertAdjacentHTML('beforeend', `
            <div class="create-stack-package-row">
                <input type="text" class="create-stack-package-input" placeholder="Package name"/>
                <input type="text" class="create-stack-package-input" placeholder="Package link"/>
                <span class="create-stack-package-arrow">&gt;</span>
            </div>
        `);
    }

    const handlePackageChange = (index: number, value: string) => {
        const updatedPackages = [...packages];
        if (index < updatedPackages.length) {
            updatedPackages[index] = { ...updatedPackages[index], packageName: value, packageLink: value };
            setPackages(updatedPackages);
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const type = formData.get('type') as StackType;
        const packageInfos: PackageInfo[] = packages.map((pkg) => ({
            packageName: pkg.packageName,
            packageLink: pkg.packageLink,
            isVerified: false
        }));

        const response = await createStack(
            name,
            description,
            type,
            packageInfos
        );

        if (response.success) {
            alert('Stack created successfully!');
            // Optionally, redirect or clear the form here
        } else {
            alert(`Error creating stack: ${response.message}`);
        }
    };

    return (
        <div className="create-stack">
            <form className="create-stack-card" onSubmit={handleSubmit}>
                <div className="create-stack-header">
                    <div className="create-stack-title-row">
                        <input className="create-stack-name-input" type="text" placeholder="Stack name (e.g. MERN)" value={name} onChange={(e) => setName(e.target.value)} required/>

                        <select className="create-stack-type-select" value={type} onChange={(e) => setType(e.target.value)}>
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
                            <button type="button" className="create-stack-add-package" onClick={createPackageRow}>+</button>
                        </div>

                        <div className="create-stack-packages-list">
                            {packages.map((pkg, index) => (
                                <div key={index} className="create-stack-package-row">
                                    <input type="text" className="create-stack-package-input" placeholder="Package name" value={pkg.packageName} onChange={(e) => handlePackageChange(index, e.target.value)}/>
                                    <input type="text" className="create-stack-package-input" placeholder="Package link" value={pkg.packageLink} onChange={(e) => handlePackageChange(index, e.target.value)}/>
                                    <span className="create-stack-package-arrow">&gt;</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="create-stack-right">
                        <textarea className="create-stack-description" placeholder="Describe what this stack is for, how it is structured, etc." value={description} onChange={(e) => setDescription(e.target.value)}/>
                    </div>
                </div>

                <div className="create-stack-footer">
                    <NavLink to="/" className="create-stack-btn secondary">Cancel</NavLink>

                    <button type="submit" className="create-stack-btn primary">Save Stack</button>
                </div>
            </form>
        </div>
    );
}

export default CreateStack;
