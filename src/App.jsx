import React, { useContext, useState } from 'react';
import { AppContext } from './context/AppContext';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { PasswordRow } from './components/PasswordRow';
import { AddPasswordForm } from './components/AddPasswordForm';
import { PasscodeModal } from './components/Modals/PasscodeModal';
import { EditModal } from './components/Modals/EditModal';
import { PatchNotesModal } from './components/Modals/PatchNotesModal';
import { UpgradeModal } from './components/Modals/UpgradeModal';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const {
    isFirstLogin, handleSetPasscode, isPasscodeModalOpen, passwords, searchQuery, upgradeUser
  } = useContext(AppContext);

  const [isPatchNotesOpen, setIsPatchNotesOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editSiteWn, setEditSiteWn] = useState('');

  // Listen for the upgrade message from sandbox.html
  React.useEffect(() => {
    const handleMessage = (request, sender, sendResponse) => {
      if (request.action === "UPGRADE_SUCCESS") {
        upgradeUser(request.level);
        setIsUpgradeOpen(false);
        toast.success(`Successfully upgraded to ${request.level.toUpperCase()}!`);
        if (sendResponse) sendResponse({ success: true });
      }
      return true;
    };

    if (chrome && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener(handleMessage);
      return () => chrome.runtime.onMessage.removeListener(handleMessage);
    }
  }, [upgradeUser]);

  const handleEdit = (wn) => {
    setEditSiteWn(wn);
    setIsEditOpen(true);
  };

  const filteredPasswords = passwords.filter(p =>
    p.wn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      <Header
        onOpenPatchNotes={() => setIsPatchNotesOpen(true)}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
      />

      <div className="modal-content" style={{ padding: '0 15px', paddingBottom: '20px' }}>
        <h3>Access your passwords anytime!</h3>
        <SearchBar />

        <table className="table table-dark table-striped" id="mainTable">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Site</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPasswords.map((pass, index) => (
              <PasswordRow
                key={pass.id}
                pass={pass}
                index={index}
                onEdit={handleEdit}
              />
            ))}
          </tbody>
        </table>

        <AddPasswordForm />
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Modals */}
      <PasscodeModal
        isOpen={isPasscodeModalOpen}
        onSubmit={handleSetPasscode}
        isFirstTime={isFirstLogin}
      />
      <PatchNotesModal isOpen={isPatchNotesOpen} onClose={() => setIsPatchNotesOpen(false)} />
      <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
      <EditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} initialWn={editSiteWn} />

    </div>
  );
}

export default App;
