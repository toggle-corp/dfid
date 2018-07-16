import React from 'react';
import { connect } from 'react-redux';

import {
    dashboardProvincesSelector,
} from '../../../redux';

import MapLayer from '../../../components/Map/MapLayer';
import mapStyles from '../../../constants/mapStyles';


const mapStateToProps = state => ({
    selectedProvinces: dashboardProvincesSelector(state),
});

class Province extends React.PureComponent {
    paint = {
        'line-color': mapStyles.provinces.stroke,
        'line-width': mapStyles.provinces.strokeWidth,
    }

    selectionPaint = {
        'line-color': mapStyles.provinces.selectedStroke,
        'line-width': mapStyles.provinces.selectedStrokeWidth,
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
        const selectionFilter = ['in', 'Province', ...provinceIds];

        return (
            <React.Fragment>
                <MapLayer
                    sourceKey="province"
                    layerKey="province-border"
                    map={map}
                    type="line"
                    paint={this.paint}
                />
                <MapLayer
                    sourceKey="province"
                    layerKey="province-border-selection"
                    map={map}
                    type="line"
                    paint={this.selectionPaint}
                    filter={selectionFilter}
                />
            </React.Fragment>
        );
    }
}
export default connect(mapStateToProps)(Province);
