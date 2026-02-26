import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faMoneyBill, faLevelUpAlt } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { userLevels } from '../utils/constants';

const ModalHeader = styled.div`
  text-align: center;
  background-color: rgb(45, 93, 121);
`;

const Logo = styled.h1`
  color: rgb(148, 187, 223);
  margin: 0;
  min-height: 180px;
  padding: 0;
  width: 384px;
`;

const LogoIcon = styled.img`
  height: 160px;
`;

const Version = styled.span`
  color: rgb(212, 212, 212);
  font-size: 20px;
`;

const HeaderBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
`;

const PatchNotesBtn = styled(HeaderBtn)`
  position: absolute;
  top: 10px;
  left: 10px;
  color: rgb(212, 212, 212);
  background-color: rgb(33, 71, 94);
`;

const UpgradeBtn = styled(HeaderBtn)`
  position: absolute;
  top: 10px;
  right: 10px;
  color: rgb(112, 221, 91);
  background-color: rgb(38, 88, 26);
  gap: 5px;
`;

const UserLevelDisplay = styled.h5`
  margin-top: 5px;
  margin-left: 100px;
  width: 50vw;
  border-radius: 25px;
  padding: 5px;
  text-align: center;
`;

export const Header = ({ onOpenPatchNotes, onOpenUpgrade }) => {
  const { userLevel } = useContext(AppContext);
  const currentLevel = userLevels.find(l => l.code === userLevel) || userLevels[0];

  return (
    <>
      <ModalHeader className="modal-header">
        <Logo>
          <LogoIcon src="/images/logo_256.png" alt="logo" />
          PassWorld
          <Version>(1.2.6)</Version>

          <PatchNotesBtn onClick={onOpenPatchNotes} title="Patch notes">
            <FontAwesomeIcon icon={faBook} />
          </PatchNotesBtn>

          <UpgradeBtn onClick={onOpenUpgrade} title="Upgrade now!">
            <FontAwesomeIcon icon={faMoneyBill} />
            <FontAwesomeIcon icon={faLevelUpAlt} />
          </UpgradeBtn>
        </Logo>
      </ModalHeader>

      <UserLevelDisplay
        style={{ color: currentLevel.color, backgroundColor: currentLevel.bgColor }}
      >
        {currentLevel.description}
      </UserLevelDisplay>
    </>
  );
};
