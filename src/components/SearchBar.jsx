import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export const SearchBar = () => {
    const { searchQuery, setSearchQuery, canSearch } = useContext(AppContext);
    const searchEnabled = canSearch();

    return (
        <div className="input-group mb-3">
            <span className="input-group-text">
                <FontAwesomeIcon icon={faSearch} />
            </span>
            <input
                type="text"
                className="form-control"
                placeholder={searchEnabled ? "Search" : "Sorry, this is only available for platinum users! upgrade now!"}
                disabled={!searchEnabled}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    );
};
