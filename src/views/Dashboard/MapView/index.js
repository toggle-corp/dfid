import React from 'react';
import { connect } from 'react-redux';

import {
    urlForCountryGeoJson,
    urlForMunicipalitiesGeoJson,
} from '../../../rest';
import Map from '../../../components/Map';

import GenericSource from './GenericSource';
import Province from './Province';
import ProvinceBorder from './ProvinceBorder';
import Municipality from './Municipality';
import MunicipalityBorder from './MunicipalityBorder';

import styles from './styles.scss';

const nepalBounds = [
    80.05858661752791, 26.3478369963687,
    88.20166918432403, 30.447028670917916,
];

const emptyList = [];

export default class MapView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            context: {},
        };
    }

    setContext = (value) => {
        this.setState({
            context: { ...this.state.context, ...value },
        });
    }

    renderMapChildren = ({ map }) => {
        return (
            <React.Fragment>
                <GenericSource
                    map={map}
                    setContext={this.setContext}
                    url={urlForCountryGeoJson}
                    sourceKey="province"
                />
                <GenericSource
                    map={map}
                    setContext={this.setContext}
                    url={urlForMunicipalitiesGeoJson}
                    sourceKey="municipality"
                />
                <Province
                    map={map}
                    context={this.state.context}
                />
                <Municipality
                    map={map}
                    context={this.state.context}
                />
                <MunicipalityBorder
                    map={map}
                    context={this.state.context}
                />
                <ProvinceBorder
                    map={map}
                    context={this.state.context}
                />
            </React.Fragment>
        );
    }

    render() {
        return (
            <Map
                className={styles.map}
                bounds={nepalBounds}
                childRenderer={this.renderMapChildren}
            />
        );
    }
}
