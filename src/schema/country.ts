import { SchemaGroup } from './interface';

const countrySchema: SchemaGroup = [];

{
    const name = 'countryData';
    const schema = {
        doc: {
            name: 'Country Data',
            description: 'Flat Data For Country',
        },
        fields: {
            id: { type: 'uint', required: true },
            provinces: { type: 'number' },
            paalikas: { type: 'number' },
            municipalities: { type: 'number' },
            totalPopulation: { type: 'uint' },
            // TODO: ask api for sending area as number
            area: { type: 'string' },
            populationDensity: { type: 'number' },
            povertyRate: { type: 'number' },
            literacyRate: { type: 'number' },
            populationUnderPovertyLine: { type: 'uint' },
            perCapitaIncome: { type: 'number' },
            humanDevelopmentIndex: { type: 'number' },
            gdp: { type: 'number' },
        },
    };
    countrySchema.push({ name, schema });
}

{
    // TODO: Not Complete
    const name = 'countryGeoJson';
    const schema = {
        doc: {
            name: 'Country GeoJson',
            description: 'GeoJson For Country',
        },
        fields: {
            features: { type: 'array', required: true },
        },
    };
    countrySchema.push({ name, schema });
}

{
    const name = 'municipalityPartners';
    const schema = {
        doc: {
            name: 'Municipality Data',
            description: 'Municipality Data',
        },
        fields: {
            name: { type: 'string' },
            description: { type: 'string' },
        },
    };
    countrySchema.push({ name, schema });
}

{
    const name = 'municipalityProgram';
    const schema = {
        doc: {
            name: 'Municipality Data',
            description: 'Municipality Data',
        },
        fields: {
            programId : { type: 'number' },
            program : { type: 'string' },
            partners : { type: 'array.municipalityPartners', required: true },
            programBudget : { type: 'number' },
            totalNoOfPartners : { type: 'number' },
        },
    };
    countrySchema.push({ name, schema });
}
{
    const name = 'municipality';
    const schema = {
        doc: {
            name: 'Municipality Data',
            description: 'Municipality Data',
        },
        fields: {
            id: { type: 'uint', required: true },
            hlcitCode: { type: 'string' },
            type: { type: 'string' },
            localName: { type: 'string' },
            programs: { type: 'array.municipalityProgram' },
            totalProgramBudget: { type: 'number' },
            totalNoOfProgrammes: { type: 'number' },
        },
    };
    countrySchema.push({ name, schema });
}

export default countrySchema;
