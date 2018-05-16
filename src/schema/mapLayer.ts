import { SchemaGroup } from './interface';

const mapLayerSchema: SchemaGroup = [];

{
    const name = 'mapLayerSector';
    const schema = {
        doc: {
            name: 'Map Layer Sector',
        },
        fields: {
            code: { type: 'string', required: true },
        },
    };
    mapLayerSchema.push({ name, schema });
}
{
    const name = 'mapLayer';
    const schema = {
        doc: {
            name: 'Map Layer',
        },
        fields: {
            id: { type: 'uint', required: true },
            layerName: { type: 'string', required: true },
            type: { type: 'string', required: true },
            file: { type: 'string' },
            layerServerUrl: { type: 'string' },
            layerPath: { type: 'string' },
            sectors: { type: 'array.mapLayerSector' },
        },
    };
    mapLayerSchema.push({ name, schema });
}

export default mapLayerSchema;
