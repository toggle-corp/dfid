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

export default countrySchema;
