import {
    RestRequest,
    FgRestBuilder,
} from '../../../../vendor/react-store/utils/rest';

import { RequestManager } from '../index';
import {
    CountryData,
    SetCountriesDataAction,
    SetRequestManagerLoadingAction,
} from '../../../../redux/interface';
import {
    urlForCountryData,
    createParamsForCountryData,
} from '../../../../rest';
import { Request } from '../../../../rest/interface';
import schema from '../../../../schema';

interface Props {
    setState: RequestManager['setState'];
    setCountriesData(params: SetCountriesDataAction): void;
    setLoadings(params: SetRequestManagerLoadingAction): void;
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
            .preLoad(() => this.props.setLoadings({ loadingCountryData: true }))
            .afterLoad(() => this.props.setLoadings({ loadingCountryData: false }))
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
