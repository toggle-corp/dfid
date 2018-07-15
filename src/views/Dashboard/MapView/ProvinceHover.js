import React from 'react';
import { connect } from 'react-redux';

import {
    toggleDashboardProvinceAction,
    dashboardProvincesSelector,
} from '../../../redux';

import MapLayer from '../../../components/Map/MapLayer';

const mapStateToProps = state => ({
    selectedProvinces: dashboardProvincesSelector(state),
});

const mapDispatchToProps = dispatch => ({
    toggleSelectedProvince: (provinceId) =>
        dispatch(toggleDashboardProvinceAction(provinceId)),
});

class Province extends React.PureComponent {
    paint = {
        'fill-color': '#e06030',
        'fill-opacity': 0,
    }

    hoverInfo = {
        paint: {
            'fill-color': '#fff',
            'fill-opacity': 0.4,
        },
    }

    handleClick = (key) => {
        this.props.toggleSelectedProvince(parseInt(key, 10));
    }

    render() {
        const {
            map,
            context,
            selectedProvinces,
        } = this.props;

        if (!context.province) {
            return null;
        }

        const provinceIds = selectedProvinces.map(p => p.id);
        const filter = ['!in', 'Province', ...provinceIds];

        return (
            <MapLayer
                sourceKey="province"
                layerKey="province-hover"
                property="Province"
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

export default connect(mapStateToProps, mapDispatchToProps)(Province);
