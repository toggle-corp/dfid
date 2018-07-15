import React from 'react';
import { connect } from 'react-redux';

import { dashboardProvincesSelector } from '../../../redux';

import MapLayer from '../../../components/Map/MapLayer';

const mapStateToProps = state => ({
    selectedProvinces: dashboardProvincesSelector(state),
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
            />
        );
    }
}

export default connect(mapStateToProps)(Municipality);
