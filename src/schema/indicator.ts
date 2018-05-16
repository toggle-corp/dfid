import { SchemaGroup } from './interface';

const sectorsSchema: SchemaGroup = [];

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
    sectorsSchema.push({ name, schema });
}

export default sectorsSchema;
