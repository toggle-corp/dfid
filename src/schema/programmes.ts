import { SchemaGroup } from './interface';

const programmesSchema: SchemaGroup = [];

{
    const name = 'programmes';
    const schema = {
        doc: {
            name: 'Programmes',
        },
        fields: {
            id: { type: 'uint', required: true },
            name: { type: 'string', required: true },
            description: { type: 'string' },
        },
    };
    programmesSchema.push({ name, schema });
}

export default programmesSchema;
