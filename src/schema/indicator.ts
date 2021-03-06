import { SchemaGroup } from './interface';

const indicatorSchema: SchemaGroup = [];

{
    const name = 'indicator';
    const schema = {
        doc: {
            name: 'Indicator',
        },
        fields: {
            id: { type: 'uint', required: true },
            name: { type: 'string', required: true },
        },
    };
    indicatorSchema.push({ name, schema });
}

{
    const name = 'indicatorData';
    const schema = {
        doc: {
            name: 'Indicator Data',
        },
        fields: {
            id: { type: 'uint', required: true },
            provinceId: { type: 'uint', required: true },
            indicatorId: { type: 'uint', required: true },
            province: { type: 'string', required: true },
            indicator: { type: 'string', required: true },
            unit: { type: 'string', required: true },
            value: { type: 'number', required: true },
        },
    };
    indicatorSchema.push({ name, schema });
}

{
    const name = 'municipalityIndicatorsData';
    const schema = {
        doc: {
            name: 'Municipality Indicator Data',
        },
        fields: {
            id: { type: 'uint', required: true },
            hlcitCode: { type: 'string', required: true },
            maleLitRate: { type: 'number', required: true },
            femaleLitRate: { type: 'number', required: true },
            totalLitRate: { type: 'number', required: true },
            lgu_FGT_0: { type: 'number', required: true },
            luType: { type: 'string', required: true },
            lgu: { type: 'string', required: true },
        },
    };
    indicatorSchema.push({ name, schema });
}

export default indicatorSchema;
