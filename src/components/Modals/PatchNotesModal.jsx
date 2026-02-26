import React, { useEffect } from 'react';

export const PatchNotesModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content" style={{ backgroundColor: 'var(--bs-dark)', color: 'white' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Patch notes:</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body text-start">
                        <div id="patchNotesBody" style={{ backgroundColor: 'white', padding: '10px' }}>
                            <embed src="/patchNotes/notes.txt" style={{ width: '100%', height: '300px' }} />
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
