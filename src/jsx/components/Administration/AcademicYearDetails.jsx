import React from 'react';
import DetailPage from '../Academic/DetailPage';
import { getAcademicYearById } from '../../../services/AdministrationService';

const AcademicYearDetails = () => {
    return (
        <DetailPage 
            title="Academic Year Details" 
            fetchById={getAcademicYearById} 
        />
    );
};

export default AcademicYearDetails;