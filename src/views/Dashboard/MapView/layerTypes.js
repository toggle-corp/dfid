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
        'Microfinance Institutions (Class D)',
        'Finance Company (Class C)',
        'Development Bank (Class B)',
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

export default layerTypes;
