import { SchemaGroup } from './interface';

const programmesSchema: SchemaGroup = [];

{
    const name = 'programme';
    const schema = {
        doc: {
            name: 'Programme',
        },
        fields: {
            id: { type: 'uint', required: true },
            name: { type: 'string', required: true },
            description: { type: 'string' },
        },
    };
    programmesSchema.push({ name, schema });
}

{
    const name = 'programmeData';
    const schema = {
        doc: {
            name: 'Programme  Data',
            description: 'Data for each programme',
        },
        fields: {
            id: { type: 'uint', required: true },
            program: { type: 'string', required: true },
            programBudget: { type: 'number' },
            description: { type: 'string' },
            programId: { type: 'number', required: true },
            sectors: { type: 'array.programmeSectorName', required: true },
        },
    };
    programmesSchema.push({ name, schema });
}

{
    const name = 'programmeSectorName';
    const schema = {
        doc: {
            name: 'Sector Name',
            description: 'Data for sectors in a programme',
        },
        fields: {
            sectorId: { type: 'uint', required: true },
            sectorName: { type: 'string', required: true },
        },
    };
    programmesSchema.push({ name, schema });
}


export default programmesSchema;
