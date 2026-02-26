import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;

  &:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
`;

const TooltipText = styled.div`
  visibility: hidden;
  width: 250px;
  background-color: #444;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 12px;
  position: absolute;
  z-index: 1060;
  bottom: calc(100% + 10px); 
  right: 0; 
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 13px;
  box-shadow: 0px 4px 6px rgba(0,0,0,0.3);
  pointer-events: none;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    right: 20px;
    border-width: 6px;
    border-style: solid;
    border-color: #444 transparent transparent transparent;
  }
`;

export const PasscodeModal = ({ isOpen, onSubmit, isFirstTime }) => {
    const [passcode, setPasscode] = useState('');

    const handleSubmit = () => {
        const success = onSubmit(passcode);
        if (!success && !isFirstTime) {
            toast.error("Wrong passcode! Try again!");
            setPasscode('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset the app? This will permanently delete ALL your saved passwords and log you out!")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ backgroundColor: 'var(--bs-dark)', color: 'white' }}>

                    {isFirstTime && (
                        <div className="modal-header bg-primary">
                            <h5 className="modal-title">Welcome to PassWorld!</h5>
                        </div>
                    )}

                    <div className="modal-header">
                        <h5 className="modal-title">Please enter your passcode:</h5>
                    </div>

                    <div className="modal-body text-center">
                        {isFirstTime && (
                            <div className="mb-4 p-3" style={{ backgroundColor: 'rgb(45, 93, 121)', borderRadius: '5px' }}>
                                <h5>You will now be asked to enter a passcode that will be used for future login.</h5>
                                <h6 style={{ color: 'red' }}>IMPORTANT - this password cannot be changed!!!</h6>
                            </div>
                        )}

                        <div className="d-flex justify-content-center gap-2">
                            <input
                                type="password"
                                className="form-control w-50"
                                value={passcode}
                                onChange={e => setPasscode(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                            <button className="btn btn-success" onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>

                    <div className="modal-footer d-flex justify-content-between">
                        {!isFirstTime && (
                            <button className="btn btn-outline-danger" onClick={handleReset} title="Reset the app and delete all passwords.">
                                Forgot Passcode?
                            </button>
                        )}
                        <TooltipWrapper className={isFirstTime ? "ms-auto" : ""}>
                            <button className="btn btn-outline-light">
                                Why?
                            </button>
                            <TooltipText className="tooltip-text">
                                This passcode will be used to secure your passwords and load your membership status.
                            </TooltipText>
                        </TooltipWrapper>
                    </div>

                </div>
            </div>
        </div>
    );
};
