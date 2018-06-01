import { SiloDomainData } from '../interface';

const initialSiloDomainData: SiloDomainData = {
    dashboard: {
        filterPane: {
            filters: {},
            faramValues: {},
            faramErrors: {},
            pristine: true,
            isHidden: false,
        },
        loadings: {
            loadingCountryData: true,
            loadingProvinceData: true,
            loadingProgrammeData: true,
            // FIXME: change this to true
            loadingSectorData: false,
            loadingProvinces: true,
            loadingProgrammes: true,
            loadingSectors: true,
            loadingIndicators: true,
            loadingGeoJson: false,
        },
    },
    geoJsons: {},
};

export default initialSiloDomainData;
