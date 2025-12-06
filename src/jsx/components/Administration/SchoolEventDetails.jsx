import React from 'react';
import DetailPage from '../Academic/DetailPage';
import { getSchoolEventById } from '../../../services/AdministrationService';

const SchoolEventDetails = () => {
    return (
        <DetailPage 
            title="School Event Details" 
            fetchById={getSchoolEventById} 
        />
    );
};

export default SchoolEventDetails;