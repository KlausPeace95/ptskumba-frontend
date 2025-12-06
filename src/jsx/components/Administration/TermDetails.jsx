import React from 'react';
import DetailPage from '../Academic/DetailPage';
import { getTermById } from '../../../services/AdministrationService';

const TermDetails = () => {
    return (
        <DetailPage 
            title="Term Details" 
            fetchById={getTermById} 
        />
    );
};

export default TermDetails;