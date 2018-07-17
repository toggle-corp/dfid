import React from 'react';
import { connect } from 'react-redux';

import {
    toggleDashboardProvinceAction,
    dashboardProvincesSelector,
    dashboardIndicatorSelector,
} from '../../../redux';

import MapLayer from '../../../components/Map/MapLayer';
import { renderNormalNumeral } from '../../../components/Renderer';

import mapStyles from '../../../constants/mapStyles';
import styles from './styles.scss';

const mapStateToProps = state => ({
    selectedProvinces: dashboardProvincesSelector(state),
    selectedIndicator: dashboardIndicatorSelector(state),
});

const mapDispatchToProps = dispatch => ({
    toggleSelectedProvince: (provinceId) =>
        dispatch(toggleDashboardProvinceAction(provinceId)),
});

class Province extends React.PureComponent {
    constructor(props) {
        super(props);

        this.paint = {
            'fill-color': '#fff',
            'fill-opacity': 0,
        }

        this.hoverInfo = {
            paint: {
                'fill-color': mapStyles.provinces.hoverColor,
                'fill-opacity': mapStyles.provinces.hoverOpacity,
            },
            showTooltip: true,
            tooltipModifier: this.renderTooltip,
        }
    }

    handleClick = (key) => {
        this.props.toggleSelectedProvince(parseInt(key, 10));
    }

    renderIndicatorTooltip = (province) => {
        const { selectedIndicator } = this.props;
        if (!selectedIndicator) {
            return null;
        }

        const value = selectedIndicator.provinces[province].value;
        let unit = '';
        if (selectedIndicator.unit.toLowerCase() === 'in percent') {
            unit = '%';
        }

        return (
            <span className={styles.attributes}>
                {renderNormalNumeral(value)}{unit}
            </span>
        );
    }

    renderTooltip = (properties) => {
        const { selectedIndicator } = this.props;
        return (
            <div className={styles.provinceTooltip}>
                <span className={styles.label}>
                    Province {properties.Province}
                </span>
                {this.renderIndicatorTooltip(properties.Province)}
            </div>
        );
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
                sourceKey="province-hover"
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
