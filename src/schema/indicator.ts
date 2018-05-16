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

export default indicatorSchema;
