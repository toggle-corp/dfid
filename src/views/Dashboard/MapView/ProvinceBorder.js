import React from 'react';
import { connect } from 'react-redux';

import {
    provincesSelector,
    dashboardProvincesSelector,
} from '../../../redux';

import MapLayer from '../../../components/Map/MapLayer';
import mapStyles from '../../../constants/mapStyles';
import { getCategoricalPaint } from './utils';

const mapStateToProps = state => ({
    provinces: provincesSelector(state),
    selectedProvinces: dashboardProvincesSelector(state),
});

class Province extends React.PureComponent {
    componentWillMount() {
        this.calculatePaint(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.selectedProvinces !== nextProps.selectedProvinces) {
            this.calculatePaint(nextProps);
        }
    }

    calculatePaint = ({ provinces, selectedProvinces }) => {
        const style = {};
        provinces.forEach((province) => {
            style[province.id] = {
                color: mapStyles.provinces.stroke,
                strokeWidth: mapStyles.provinces.strokeWidth,
            };
        });

        selectedProvinces.forEach((province) => {
            style[province.id] = {
                color: mapStyles.provinces.selectedStroke,
                strokeWidth: mapStyles.provinces.selectedStrokeWidth,
            };
        });

        this.paint = {
            'line-color': getCategoricalPaint('Province', style, 'color', true),
            'line-width': getCategoricalPaint('Province', style, 'strokeWidth', true),
        };
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
                layerKey="province-border"
                map={map}
                type="line"
                paint={this.paint}
            />
        );
    }
}
export default connect(mapStateToProps)(Province);
