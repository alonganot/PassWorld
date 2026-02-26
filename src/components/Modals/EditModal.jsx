import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { decryptText } from '../../utils/crypto';
import { toast } from 'react-toastify';

export const EditModal = ({ isOpen, onClose, initialWn }) => {
    const { passwords, key, editPassword } = useContext(AppContext);
    const [selectedWn, setSelectedWn] = useState('');

    const [site, setSite] = useState('');
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [link, setLink] = useState('');
    const [showPass, setShowPass] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const targetWn = initialWn || (passwords.length > 0 ? passwords[0].wn : '');
            setSelectedWn(targetWn);
            loadPassData(targetWn);
        }
    }, [isOpen, initialWn, passwords]);

    const loadPassData = (wn) => {
        const p = passwords.find(x => x.wn === wn);
        if (p) {
            setSite(p.wn);
            setUser(decryptText(p.un, key));
            setPass(decryptText(p.p, key));
            setLink(p.link);
        }
    };

    const handleSelectChange = (e) => {
        setSelectedWn(e.target.value);
        loadPassData(e.target.value);
    };

    const handleSubmit = () => {
        if (!site) {
            alert("Error! some fields cannot be empty!");
            return;
        }

        const pId = passwords.find(x => x.wn === selectedWn)?.id;
        const siteExists = passwords.find(x => x.wn === site && x.id !== pId);

        if (siteExists) {
            alert("Error! this site name is already in use!");
            return;
        }

        editPassword(pId, site, user, pass, link);
        alert("Success! information edited successfully!");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content" style={{ backgroundColor: 'var(--bs-dark)', color: 'white' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Edit your passwords information:</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body text-start">
                        <h2>What do you want to edit?</h2>
                        <select className="form-select mb-3" value={selectedWn} onChange={handleSelectChange}>
                            {passwords.map(p => (
                                <option key={p.id} value={p.wn}>{p.wn}</option>
                            ))}
                        </select>

                        <div id="editPassForm" style={{ backgroundColor: 'white', color: 'black', padding: '15px', borderRadius: '5px' }}>
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Site name:</label>
                                    <input type="text" className="form-control" value={site} onChange={e => setSite(e.target.value)} />
                                    <div className="form-text">This name is only for you to recognize what is the password for.</div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Username</label>
                                    <input type="text" className="form-control" value={user} onChange={e => setUser(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <div className="input-group">
                                        <input type={showPass ? "text" : "password"} className="form-control" value={pass} onChange={e => setPass(e.target.value)} />
                                        <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPass(!showPass)}>
                                            <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Link</label>
                                    <input type="text" className="form-control" value={link} onChange={e => setLink(e.target.value)} />
                                </div>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                            </form>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
