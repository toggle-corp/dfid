import defaultIcons, { alphabets } from './icons';
const healthFacilities = 2;
const financialInstitutions = 1;
const hydroPowerStations = 15;

const layerTypes = {
    [healthFacilities]: [
        'Other HFs',
        'Radiology/lab',
        'Private clinics',
        'Private hospital',
        'PHCC',
        'Government hospital',
        'SHP',
        'HP',
        'Non-government hospital',
        'Hospital',
        'Nursing home',
    ],

    [financialInstitutions]: [
        'Commercial Bank (Class A)',
        'Development Bank (Class B)',
        'Finance Company (Class C)',
        'Microfinance Institutions (Class D)',
    ],

    [hydroPowerStations]: [
        '<1MW',
        '>=100 MW',
        '25-100 MW',
        '1-25 MW',
    ],
};

export const layerTypeKeys = {
    [healthFacilities]: 'MAJROTYP',
    [financialInstitutions]: 'class_name',
    [hydroPowerStations]: 'Size_classification',
};

export const icons = {
    [healthFacilities]: defaultIcons,
    [financialInstitutions]: alphabets,
    [hydroPowerStations]: defaultIcons,
};

export default layerTypes;
