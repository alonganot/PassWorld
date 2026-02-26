import React, { useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

export const UpgradeModal = ({ isOpen, onClose }) => {
    const { key, upgradeUser } = useContext(AppContext);
    // No useEffect needed for dynamic rendering anymore.
    // In a real-world scenario without a backend, validating payments is tricky.
    // For this extension format, we will open the PayPal link, and provide an
    // 'Activate' button to finalize the upgrade locally upon reopening the popup.
    const handleActivateClick = (level) => {
        upgradeUser(level);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content" style={{ backgroundColor: 'var(--bs-dark)', color: 'white' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Upgrade now!</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body text-center">
                        <div id="upgradeBody">
                            <h2 style={{ backgroundColor: 'rgb(84, 88, 88)', padding: '4px', color: 'rgb(17, 196, 106)' }}>
                                Get your premium today!
                            </h2>
                            <img width="100%" src="/images/pricingtable.JPG" alt="Pricing Table" style={{ maxWidth: '365px' }} />
                            <div className="container mt-3">

                                <h2 className="text-start">Pay now:</h2>
                                <a
                                    className="btn btn-warning w-100 mb-1 rounded-pill"
                                    href="https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=your_email@example.com&item_name=PassWorld+GOLD&amount=2.99&currency_code=USD"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <strong>1. Buy GOLD ($2.99)</strong>
                                </a>
                                <button
                                    className="btn btn-outline-warning w-100 mb-4 rounded-pill"
                                    onClick={() => handleActivateClick('gold')}
                                >
                                    <strong>2. Activate GOLD Membership</strong>
                                </button>

                                <a
                                    className="btn btn-primary w-100 mb-1 rounded-pill"
                                    href="https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=your_email@example.com&item_name=PassWorld+PLATINUM&amount=4.99&currency_code=USD"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <strong>1. Buy PLATINUM ($4.99)</strong>
                                </a>
                                <button
                                    className="btn btn-outline-primary w-100 rounded-pill"
                                    onClick={() => handleActivateClick('platinum')}
                                >
                                    <strong>2. Activate PLATINUM Membership</strong>
                                </button>

                            </div>
                        </div>

                        <div style={{ backgroundColor: 'rgb(84, 88, 88)', marginTop: '15px', padding: '10px' }}>
                            <h2 style={{ color: 'red' }}>VERY IMPORTANT!</h2>
                            <h2 style={{ color: 'white', fontSize: '18px' }}>Your membership will ONLY work for the passcode you entered!</h2>
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
