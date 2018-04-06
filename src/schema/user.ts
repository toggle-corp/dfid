import { SchemaGroup } from './interface';

const userSchema: SchemaGroup = [];

{
    const name = 'user';
    const schema = {
        doc: {
            name: 'User',
        },
        fields: {
            id: { type: 'uint', required: 'true' },
            username: { type: 'email', required: 'true' },
            email: { type: 'email', required: 'true' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            displayName: { type: 'string' },
        },
    };
    userSchema.push({ name, schema });
}
{
    const name = 'userPostResponse';
    const schema = {
        doc: {
            name: 'User Create',
        },
        extends: 'user',
    };
    userSchema.push({ name, schema });
}

export default userSchema;
