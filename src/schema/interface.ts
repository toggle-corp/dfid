export interface Schema {
    doc: {
        name: string,
        description?: string,
    };
    extends?: string;
    fields?: object;
}
export type SchemaGroup = ({ name: string, schema: Schema })[];
