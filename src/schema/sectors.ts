import { SchemaGroup } from './interface';

const sectorsSchema: SchemaGroup = [];

{
    const name = 'sector';
    const schema = {
        doc: {
            name: 'Sectors',
        },
        fields: {
            id: { type: 'uint', required: true },
            name: { type: 'string', required: true },
            code: { type: 'string', required: true },
            description: { type: 'string' },
        },
    };
    sectorsSchema.push({ name, schema });
}

export default sectorsSchema;
