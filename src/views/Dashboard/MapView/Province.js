import React from 'react';
import { connect } from 'react-redux';

import {
    dashboardProgrammesSelector,
    dashboardIndicatorSelector,
    provincesSelector,
} from '../../../redux';

import MapLayer from '../../../components/Map/MapLayer';
import mapStyles from '../../../constants/mapStyles';
import { getCategoricalPaint } from './utils';

const mapStateToProps = state => ({
    provinces: provincesSelector(state),
    selectedProgrammes: dashboardProgrammesSelector(state),
    selectedIndicator: dashboardIndicatorSelector(state),
});

class Province extends React.PureComponent {
    componentWillMount() {
        this.calculatePaint(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.selectedIndicator !== nextProps.selectedIndicator ||
            this.props.selectedProgrammes !== nextProps.selectedProgrammes
        ) {
            this.calculatePaint(nextProps);
        }
    }

    calculatePaint = ({ selectedIndicator, selectedProgrammes, provinces }) => {
        if (!selectedIndicator) {
            this.paint = {
                'fill-color': mapStyles.provinces.color,
                'fill-opacity': mapStyles.provinces.opacity,
            };
            return;
        }

        const style = {};
        provinces.forEach((province) => {
            style[province.id] = {
                'color': mapStyles.provinces.indicatorColor,
                'opacity': 0.85,
            };
        });

        const minValue = selectedIndicator.minValue;
        const maxValue = selectedIndicator.maxValue;

        Object.keys(selectedIndicator.provinces).forEach((provinceId) => {
            if (maxValue === minValue) {
                return;
            }

            const value = selectedIndicator.provinces[provinceId].value;
            if (!value) {
                return;
            }

            const fraction = (value - minValue) / (maxValue - minValue);
            const offset = 0.25;
            const fractionWithOffset = fraction * (0.85 - offset) + offset;

            style[provinceId].opacity = fractionWithOffset;
        });

        this.paint = {
            'fill-color': getCategoricalPaint('Province', style, 'color', true),
            'fill-opacity': getCategoricalPaint('Province', style, 'opacity', true),
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
                layerKey="province"
                property="Province"
                map={map}
                type="fill"
                paint={this.paint}
            />
        );
    }
}

export default connect(mapStateToProps)(Province);
