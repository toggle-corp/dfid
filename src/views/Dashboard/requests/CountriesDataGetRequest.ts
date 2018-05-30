import {
    RestRequest,
    FgRestBuilder,
} from '../../../vendor/react-store/utils/rest';

import { Dashboard } from '../index';
import {
    CountryData,
    SetCountriesDataAction,
} from '../../../redux/interface';
import {
    urlForCountryData,
    createParamsForCountryData,
} from '../../../rest';
import { Request } from '../../../rest/interface';
import schema from '../../../schema';

interface Props {
    setState: Dashboard['setState'];
    setCountriesData(params: SetCountriesDataAction): void;
}

export default class CountriesDataGetRequest implements Request<{}> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    create = (): RestRequest => {
        const request = new FgRestBuilder()
            .url(urlForCountryData)
            .params(createParamsForCountryData)
            .preLoad(() => this.props.setState({ loadingCountryData: true }))
            .postLoad(() => this.props.setState({ loadingCountryData: false }))
            .success((response: CountryData[]) => {
                try {
                    schema.validate(response, 'array.countryData');
                    this.props.setCountriesData({ countriesData: response });
                } catch (error) {
                    console.warn(error);
                }
            })
            .build();
        return request;
    }
}
