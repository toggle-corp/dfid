import React from 'react';
import { connect } from 'react-redux';

import {
    dashboardIndicatorSelector,
    provincesSelector,
} from '../../../redux';

import MapLayer from '../../../components/Map/MapLayer';
import { getCategoricalPaint } from './utils';

const mapStateToProps = state => ({
    provinces: provincesSelector(state),
    selectedIndicator: dashboardIndicatorSelector(state),
});

class Province extends React.PureComponent {
    paint = {
        'fill-color': '#e06030',
        'fill-opacity': 0.4,
    }

    componentDidMount() {
        this.calculatePaint(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.selectedIndicator !== nextProps.selectedIndicator) {
            this.calculatePaint(nextProps);
        }
    }

    calculatePaint = ({ selectedIndicator, provinces }) => {
        if (!selectedIndicator) {
            return this.paint;
        }

        const style = {};
        provinces.forEach((province) => {
            style[province.id] = {
                'color': '#e06030',
                'opacity': 0.4,
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
