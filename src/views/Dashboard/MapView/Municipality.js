import React from 'react';
import { connect } from 'react-redux';

import {
    toggleDashboardMunicipilityAction,
    dashboardProvincesSelector,
    municipalitiesSelector,
} from '../../../redux';

import MapLayer from '../../../components/Map/MapLayer';

const mapStateToProps = state => ({
    selectedProvinces: dashboardProvincesSelector(state),
    municipalities: municipalitiesSelector(state),
});

const mapDispatchToProps = dispatch => ({
    toggleSelectedMunicipality: (provinceId) =>
        dispatch(toggleDashboardMunicipilityAction(provinceId)),
});

class Municipality extends React.PureComponent {
    paint = {
        'fill-color': '#fff',
        'fill-opacity': 0,
    }

    hoverInfo = {
        paint: {
            'fill-color': '#e06030',
            'fill-opacity': 0.8,
        },
    }

    handleClick = (key) => {
        const { municipalities } = this.props;
        const municipality = municipalities.find(municipality => municipality.hlcitCode === key);
        if (municipality) {
            this.props.toggleSelectedMunicipality(municipality.id);
        }
    }

    render() {
        const {
            map,
            context,
            selectedProvinces,
        } = this.props;

        if (!context.municipality || !context.province) {
            return null;
        }

        const provinceIds = selectedProvinces.map(p => String(p.id));
        const filter = ['in', 'STATE', ...provinceIds];

        return (
            <MapLayer
                sourceKey="municipality"
                layerKey="municipality"
                property="HLCIT_CODE"
                map={map}
                type="fill"
                paint={this.paint}
                hoverInfo={this.hoverInfo}
                filter={filter}
                onClick={this.handleClick}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Municipality);
