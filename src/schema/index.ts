import dict from '../vendor/ravl/schema';
import attachValidator from '../vendor/ravl/attachValidator';

import token from './token';
import user from './user';
import province from './province';
import country from './country';
import programme from './programme';
import sectors from './sectors';
import { SchemaGroup } from './interface';

// Validator mixin
attachValidator(dict);

// ATTACHING USER DEFINED SCHEMAS
const userDefinedSchemas: SchemaGroup  = [];
{
    const name = 'dbentity';
    const schema = {
        doc: {
            name: 'Database Entity',
            description: 'Defines all the attributes common to db entities',
        },
        fields: {
            createdAt: { type: 'string', required: true }, // date
            createdBy: { type: 'uint' },
            createdByName: { type: 'string' },
            id: { type: 'uint', required: true },
            modifiedAt: { type: 'string', required: true }, // date
            modifiedBy: { type: 'uint' },
            modifiedByName: { type: 'string' },
            versionId: { type: 'uint', required: true },
        },
    };
    userDefinedSchemas.push({ name, schema });
}
{
    const name = 'keyValuePair';
    const schema = {
        doc: {
            name: 'Key Value Pair',
            description: 'Defines key value pair',
        },
        fields: {
            key: { type: 'uint', required: true },
            value: { type: 'string', required: true },
        },
    };
    userDefinedSchemas.push({ name, schema });
}
{
    const name = 'keyValuePairSS';
    const schema = {
        doc: {
            name: 'Key Value Pair',
            description: 'Defines key value pair where key and value both are strings',
        },
        fields: {
            key: { type: 'string', required: true },
            value: { type: 'string', required: true },
        },
    };
    userDefinedSchemas.push({ name, schema });
}

[
    ...userDefinedSchemas,
    ...token,
    ...user,
    ...province,
    ...country,
    ...programme,
    ...sectors,
].forEach(
    ({ name, schema }) => dict.put(name, schema),
);

export default dict;
