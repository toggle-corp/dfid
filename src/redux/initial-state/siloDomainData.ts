import { SiloDomainData } from '../interface';

const initialSiloDomainData: SiloDomainData = {
    dashboard: {
        showCompare: false,
        informationPaneState: {
            isCollapsed: true,
            activeTab: 'province',
        },
        filterPane: {
            filters: {
                // TODO: remove this
                municipalitiesId: [1, 2, 3, 4, 5, 6, 7, 8],
            },
            faramValues: {
                // TODO: remove this
                municipalitiesId: [1, 2, 3, 4, 5, 6, 7, 8],
            },
            faramErrors: {},
            pristine: true,
            isHidden: false,
        },
        loadings: {
            loadingMunicipalities: true,
            loadingCountryData: true,
            loadingProvinceData: true,
            loadingProgrammeData: true,
            // FIXME: change this to true
            loadingSectorData: false,
            loadingProvinces: true,
            loadingProgrammes: true,
            loadingSectors: true,
            loadingIndicators: true,
            loadingIndicatorsData: true,
            loadingLayers: true,
            loadingGeoJson: false,
        },
    },
    geoJsons: {},
    explore: {
        /*
         selectedExplore: 1,
         */
    },
};

export default initialSiloDomainData;
