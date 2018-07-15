import React from 'react';
import * as topojson  from 'topojson-client';


export default class GeoJsonRequest {
    constructor(url) {
        this.url = url;
        this.headers = {
            method: 'GET',
        };
    }

    start({ url, onSuccess, onFailure } = {}) {
        this.url = url;
        this.onSuccess = onSuccess;
        this.onFailure = onFailure;

        fetch(this.url, this.headers)
            .then(r => r.text())
            .then(this.handleResponse)
            .catch(this.handleError);
    }

    stop() {
        this.onSuccess = undefined;
        this.onFailure = undefined;
    }

    handleResponse = (responseText) => {
        if (!this.onSuccess) {
            return;
        }

        let response;
        if (responseText && responseText.length > 0) {
            response = JSON.parse(responseText);
        }

        let geoJson;
        if (response.type && response.type === 'FeatureCollection') {
            geoJson = response;
        } else {
            geoJson = topojson.feature(response, Object.values(response.objects)[0]);
        }

        this.onSuccess(geoJson);
    }

    handleError = (error) => {
        console.error('Failed fetching: \n', error);
        if (!this.onFailure) {
            return;
        }
        this.onFailure(error);
    }
}


export class RequestWrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            geoJson: undefined,
        };

        this.request = new GeoJsonRequest();
    }

    componentDidMount() {
        this.request.start({
            url: this.props.url,
            onSuccess: geoJson => this.setState({ geoJson }),
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.url !== nextProps.url) {
            this.request.stop();
            this.request.start({
                url: this.props.url,
                onSuccess: geoJson => this.setState({ geoJson }),
            });
        }
    }

    componentWillUnmount() {
        this.request.stop();
    }

    render() {
        const {
            child: Child,
            url,
            ...otherProps,
        } = this.props;
        const { geoJson } = this.state;

        return geoJson ? (
            <Child
                geoJson={geoJson}
                {...otherProps}
            />
        ) : null;
    }
}
