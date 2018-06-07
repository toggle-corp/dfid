import {
    RestRequest,
    FgRestBuilder,
} from '../../../../vendor/react-store/utils/rest';

import { RequestManager } from '../index';
import {
    IndicatorData,
    Dictionary,
    SetIndicatorsDataAction,
    SetRequestManagerLoadingAction,
} from '../../../../redux/interface';
import {
    urlForIndicatorsData,
    createParamsForIndicatorsData,
} from '../../../../rest';
import { Request } from '../../../../rest/interface';
import schema from '../../../../schema';

interface Props {
    setState: RequestManager['setState'];
    setIndicatorsData(params: SetIndicatorsDataAction): void;
    setLoadings(params: SetRequestManagerLoadingAction): void;
}

interface ServerIndicatorData {
    id: number;
    provinceId: number;
    indicatorId: number;
    province: string;
    indicator: string;
    unit: string;
    value: number;
}

export default class IndicatorsGetRequest implements Request<{}> {
    props: Props;

    static keySelector = (data: ServerIndicatorData) => (data.indicatorId);
    static modifier = (data: ServerIndicatorData) => ({
        id: data.indicatorId,
        name: data.indicator,
        unit: data.unit,
        provinces: {
            [data.provinceId]: IndicatorsGetRequest.getProvince(data),
        },
    })
    static getProvince = (data: ServerIndicatorData) => ({
        provinceId: data.provinceId,
        value: data.value,
    })

    static transformIndicatorsData = (
        serverIndicatorsData: ServerIndicatorData[],
    ): Dictionary<IndicatorData> => {

        const {
            keySelector,
            modifier,
            getProvince,
        } = IndicatorsGetRequest;

        const indicatorData = serverIndicatorsData.reduce(
            (acc, data) => {
                const key = keySelector(data);
                if (acc[key]) {
                    acc[key].provinces[data.provinceId] = getProvince(data);
                } else {
                    acc[key] = modifier(data);
                }
                return acc;
            },
            {},
        );
        return indicatorData;
    }

    constructor(props: Props) {
        this.props = props;
    }

    success = (response: ServerIndicatorData[]) => {
        schema.validate(response, 'array.indicatorData');
        const indicatorsData = IndicatorsGetRequest.transformIndicatorsData(response);
        this.props.setIndicatorsData({ indicatorsData });
    }

    create = (): RestRequest => {
        const request = new FgRestBuilder()
            .url(urlForIndicatorsData)
            .params(createParamsForIndicatorsData)
            .preLoad(() => this.props.setLoadings({ loadingIndicatorsData: true }))
            .postLoad(() => this.props.setLoadings({ loadingIndicatorsData: false }))
            .success(this.success)
            .build();
        return request;
    }
}
