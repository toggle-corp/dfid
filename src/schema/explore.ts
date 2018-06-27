import { SchemaGroup } from './interface';

const exploreSchema: SchemaGroup = [];

{
    const name = 'exploreData';
    const schema = {
        doc: {
            name: 'Explore',
            description: 'Collection of documents',
        },
        fields: {
            id: { type: 'uint', required: true },
            title: { type: 'string', required: true },
            pdf: { type: 'string', required: true },
        },
    };
    exploreSchema.push({ name, schema });
}

export default exploreSchema;
