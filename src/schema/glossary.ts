import { SchemaGroup } from './interface';

const glossarySchema: SchemaGroup = [];

{
    const name = 'glossaryData';
    const schema = {
        doc: {
            name: 'Glossary',
            description: 'Includes the glossary of the keywords',
        },
        fields: {
            id: { type: 'uint', required: true },
            title: { type: 'string' },
            source: { type: 'string' },
            description: { type: 'string' },
        },
    };
    glossarySchema.push({ name, schema });
}

export default glossarySchema;
