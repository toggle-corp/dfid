import React from 'react';
import { connect } from 'react-redux';

import LoadingAnimation from '../../../vendor/react-store/components/View/LoadingAnimation';

import {
    urlForCountryGeoJson,
    urlForMunicipalitiesGeoJson,
} from '../../../rest';
import Map from '../../../components/Map';

import GenericSource from './GenericSource';
import Province from './Province';
import ProvinceHover from './ProvinceHover';
import ProvinceBorder from './ProvinceBorder';
import Municipality from './Municipality';
import MunicipalityHover from './MunicipalityHover';
import MunicipalityBorder from './MunicipalityBorder';
import Layers from './Layers';
import Raster from './Raster';
import Legends from './Legends';

import styles from './styles.scss';

const nepalBounds = [
    80.05858661752791, 26.3478369963687,
    88.20166918432403, 30.447028670917916,
];

const emptyList = [];

export default class MapView extends React.PureComponent {
    constructor(props) {
        super(props);

        this.contextData = {};
        this.state = {
            context: {},
            showTextMarkers: true,
            textMarkers: 'programs',
        };
    }

    toggleTextMarkers = () => {
        const { textMarkers } = this.state;
        if (textMarkers === 'programs') {
            this.setState({
                textMarkers: 'partners',
            });
        } else {
            this.setState({
                textMarkers: 'programs',
            });
        }
    }

    toggleTextMarkersVisibility = () => {
        this.setState({
            showTextMarkers: !this.state.showTextMarkers,
        });
    }

    setContext = (value) => {
        this.contextData = { ...this.contextData, ...value };
        this.setState({ context: this.contextData });
    }

    renderMapChildren = ({ map }) => {
        return (
            <React.Fragment>
                <Raster map={map} />
                <Province
                    map={map}
                    context={this.state.context}
                />
                <ProvinceHover
                    map={map}
                    context={this.state.context}
                />
                <Municipality
                    map={map}
                    context={this.state.context}
                />
                <MunicipalityHover
                    map={map}
                    context={this.state.context}
                    textMarkers={this.state.textMarkers}
                    showTextMarkers={this.state.showTextMarkers}
                />
                <Layers
                    map={map}
                    context={this.state.context}
                    setContext={this.setContext}
                />
                <MunicipalityBorder
                    map={map}
                    context={this.state.context}
                />
                <ProvinceBorder
                    map={map}
                    context={this.state.context}
                />
                <GenericSource
                    map={map}
                    setContext={this.setContext}
                    url={urlForCountryGeoJson}
                    sourceKey="province"
                    supportHover
                />
                <GenericSource
                    map={map}
                    setContext={this.setContext}
                    url={urlForMunicipalitiesGeoJson}
                    sourceKey="municipality"
                    supportHover
                />
            </React.Fragment>
        );
    }

    renderLegends = (props) => (
        <Legends
            onToggleTextMarkers={this.toggleTextMarkers}
            onToggleTextMarkersVisibility={this.toggleTextMarkersVisibility}
            textMarkers={this.state.textMarkers}
            showTextMarkers={this.state.showTextMarkers}
            {...props}
        />
    )

    render() {
        const { context } = this.state;

        let loading = false;
        if (!context.province || !context.municipality) {
            loading = true;
        }

        return (
            <div className={styles.mapContainer}>
                { loading && <LoadingAnimation />}
                <Map
                    className={styles.map}
                    bounds={nepalBounds}
                    childRenderer={this.renderMapChildren}
                    panelsRenderer={this.renderLegends}
                    setExportFunction={this.props.setExportFunction}
                />
            </div>
        );
    }
}
