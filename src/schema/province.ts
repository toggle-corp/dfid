import { SchemaGroup } from './interface';

const provinceSchema: SchemaGroup = [];

{
    const name = 'programmeName';
    const schema = {
        doc: {
            name: 'Programme Name',
            description: 'Data for province programme name',
        },
        fields: {
            programID: { type: 'uint', required: true },
            programName: { type: 'string', required: true },
        },
    };
    provinceSchema.push({ name, schema });
}

{
    const name = 'provinceData';
    const schema = {
        doc: {
            name: 'Province Data',
            description: 'Data for each province',
        },
        fields: {
            id: { type: 'uint', required: true },
            province: { type: 'string', required: true },
            district: { type: 'number', required: true },
            totalPopulation: { type: 'uint', required: true },
            area: { type: 'number', required: true },
            populationDensity: { type: 'number', required: true },
            povertyRate: { type: 'number', required: true },
            populationUnderPovertyLine: { type: 'uint', required: true },
            perCapitaIncome: { type: 'number', required: true },
            hhByLowestWealthQuantiles: { type: 'number', required: true },
            humanDevelopmentIndex: { type: 'number', required: true },
            minuteAccessTo: { type: 'number', required: true },
            vulnerabilityIndex: { type: 'number', required: true },
            gdp: { type: 'number', required: true },
            activeProgrammes: { type: 'array.programmeName', required: true },
            totalBudget: { type: 'number' },
            description: { type: 'string' },
        },
    };
    provinceSchema.push({ name, schema });
}

{
    const name = 'provinceInfo';
    const schema = {
        doc: {
            name: 'Province Info',
            description: 'Info for each province [For Landing Page]',
        },
        fields: {
            id: { type: 'uint', required: true },
            provinceId: { type: 'uint', required: true },
            name: { type: 'string', required: true },
            activeProgrammes: { type: 'number' },
            totalBudget: { type: 'number' },
        },
    };
    provinceSchema.push({ name, schema });
}

{
    const name = 'province';
    const schema = {
        doc: {
            name: 'Province',
        },
        fields: {
            id: { type: 'uint', required: true },
            name: { type: 'string', required: true },
            description: { type: 'string' },
        },
    };
    provinceSchema.push({ name, schema });
}

export default provinceSchema;
