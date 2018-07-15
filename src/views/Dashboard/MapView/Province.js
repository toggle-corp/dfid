import React from 'react';
import { connect } from 'react-redux';

import MapLayer from '../../../components/Map/MapLayer';

export default class Province extends React.PureComponent {
    paint = {
        'fill-color': '#e06030',
        'fill-opacity': 0.4,
    }

    hoverInfo = {
        paint: {
            'fill-color': '#fff',
            'fill-opacity': 0.4,
        },
    }

    render() {
        const {
            map,
            context,
        } = this.props;

        if (!context.province) {
            return null;
        }

        return (
            <MapLayer
                sourceKey="province"
                layerKey="province"
                property="Province"
                map={map}
                type="fill"
                paint={this.paint}
                hoverInfo={this.hoverInfo}
            />
        );
    }
}
