import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey, faLink, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { decryptText } from '../utils/crypto';
import { defaultValue, emptyListString } from '../utils/constants';
import styled from 'styled-components';

const SiteNameDiv = styled.td`
  max-width: 110px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
`;

const ButtonsTd = styled.td`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const IconButton = styled.button`
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const PasswordRow = ({ pass, index, onEdit }) => {
    const { key, canEdit, deletePassword } = useContext(AppContext);

    const decryptedUser = decryptText(pass.un, key);
    const decryptedPass = decryptText(pass.p, key);

    const hasUser = decryptedUser !== defaultValue && decryptedUser !== "";
    const hasPass = decryptedPass !== defaultValue && decryptedPass !== "";
    const hasLink = pass.link !== defaultValue && pass.link !== "";
    const isNotEmpty = pass.wn !== emptyListString;
    const canUserEdit = canEdit();

    const handleCopyUser = () => {
        navigator.clipboard.writeText(decryptedUser);
    };

    const handleCopyPass = () => {
        navigator.clipboard.writeText(decryptedPass);
    };

    const handleLink = () => {
        window.open(pass.link);
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to procceed with this action?")) {
            deletePassword(pass.id);
        }
    };

    return (
        <tr>
            <th scope="row" style={{ verticalAlign: 'middle' }}>{index + 1}</th>
            <SiteNameDiv title={pass.wn}>{pass.wn}</SiteNameDiv>
            <ButtonsTd>
                {hasUser && (
                    <IconButton className="btn btn-outline-primary" onClick={handleCopyUser} title="Copy the username!">
                        <FontAwesomeIcon icon={faUser} />
                    </IconButton>
                )}

                {hasPass && (
                    <IconButton className="btn btn-outline-primary" onClick={handleCopyPass} title="Copy the password!">
                        <FontAwesomeIcon icon={faKey} />
                    </IconButton>
                )}

                {hasLink && (
                    <IconButton className="btn btn-outline-primary" onClick={handleLink} title="Move to the page!">
                        <FontAwesomeIcon icon={faLink} />
                    </IconButton>
                )}

                {isNotEmpty && canUserEdit && (
                    <IconButton className="btn btn-outline-warning" onClick={() => onEdit(pass.wn)} title="Edit password">
                        <FontAwesomeIcon icon={faEdit} />
                    </IconButton>
                )}

                {isNotEmpty && (
                    <IconButton className="btn btn-outline-danger" onClick={handleDelete} title="Delete password">
                        <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                )}

                {!hasUser && !hasPass && !hasLink && !isNotEmpty && (
                    <span>No available actions!</span>
                )}
            </ButtonsTd>
        </tr>
    );
};
