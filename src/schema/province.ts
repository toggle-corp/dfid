import { SchemaGroup } from './interface';

const provinceSchema: SchemaGroup = [];

{
    const name = 'provinceData';
    const schema = {
        doc: {
            name: 'Province Data',
            description: 'Data for each province',
        },
        fields: {
            id: { type: 'uint', required: true },
            province: { type: 'string', required: true },
            total_population: { type: 'uint', required: true },
            area: { type: 'number', required: true },
            population_density: { type: 'number', required: true },
            poverty_rate: { type: 'number', required: true },
            population_under_poverty_line: { type: 'uint', required: true },
            per_capita_income: { type: 'number', required: true },
            hh_by_lowest_wealth_quantiles: { type: 'number', required: true },
            human_development_index: { type: 'number', required: true },
            minute_access_to: { type: 'number', required: true },
            vulnerability_index: { type: 'number', required: true },
            gdp: { type: 'number', required: true },
        },
    };
    provinceSchema.push({ name, schema });
}

{
    const name = 'province';
    const schema = {
        doc: {
            name: 'Province',
        },
        fields: {
            id: { type: 'uint', required: true },
            name: { type: 'string', required: true },
            description: { type: 'string' },
        },
    };
    provinceSchema.push({ name, schema });
}

export default provinceSchema;
