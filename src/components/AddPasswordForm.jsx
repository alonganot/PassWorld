import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { emptyListString } from '../utils/constants';
import { toast } from 'react-toastify';

export const AddPasswordForm = () => {
    const { hasPassedMaxPasswords, addPassword, passwords } = useContext(AppContext);
    const [site, setSite] = useState('');
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [link, setLink] = useState('');

    const isSiteNameExist = (name) => {
        return passwords.find((p) => p.wn === name);
    };

    const handleAdd = () => {
        if (hasPassedMaxPasswords()) {
            toast.error("You have reached the maximum password amount! upgrade now for more passwords!");
            return;
        }

        if (site === "" || site === emptyListString) {
            toast.error("Error: You cannot add a password with this name!");
            return;
        }

        if (!user || !pass || !link) {
            toast.info("Notice: adding a password with missing information!");
        }

        if (isSiteNameExist(site)) {
            toast.error("Site name is already in use!");
            return;
        }

        addPassword(site, user, pass, link);
        setSite('');
        setUser('');
        setPass('');
        setLink('');
        toast.success("Password added successfully!");
    };

    return (
        <div id="addPassMenu" style={{ marginTop: '20px' }}>
            <div className="input-group mb-3 gap-1">
                <input
                    style={{ fontSize: '14px' }}
                    type="text"
                    className="form-control"
                    placeholder="Site"
                    value={site}
                    onChange={(e) => setSite(e.target.value)}
                />
                <input
                    style={{ fontSize: '14px' }}
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                />
                <input
                    style={{ fontSize: '14px' }}
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                />
                <input
                    style={{ fontSize: '14px' }}
                    type="text"
                    className="form-control"
                    placeholder="Link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleAdd}
                    title="Add a new password!"
                >
                    <FontAwesomeIcon icon={faUserPlus} size="2x" />
                </button>
            </div>
        </div>
    );
};
