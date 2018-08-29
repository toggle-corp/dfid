import React from 'react';
import { connect } from 'react-redux';

import {
    createUrlForTileLayer,
} from '../../../rest';
import {
    dashboardRasterMapLayerSelector,
} from '../../../redux';

import RasterLayer from '../../../components/Map/RasterLayer';

const mapStateToProps = state => ({
    selectedRasterMapLayer: dashboardRasterMapLayerSelector(state),
});

class Raster extends React.PureComponent {
    render() {
        const {
            map,
            selectedRasterMapLayer: mapLayer,
        } = this.props;

        if (!mapLayer) {
            return null;
        }

        const url = mapLayer.mapBoxUrl || createUrlForTileLayer(mapLayer.layerServerUrl || '', {
            format: 'image/png',
            version: '1.1.0',
            service: 'WMS',
            request: 'GetMap',
            srs: 'EPSG:3857',
            width: 256,
            height: 256,
            transparent: 'true',
            layers: mapLayer.layerPath || '',
        });

        return (
            <RasterLayer
                layerKey="raster"
                map={map}
                tiles={[url]}
                tileSize={256}
            />
        );
    }
}

export default connect(mapStateToProps)(Raster);
