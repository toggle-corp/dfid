import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';


const propTypes = {
    map: PropTypes.object,
    sourceKey: PropTypes.string.isRequired,
    onSourceAdded: PropTypes.func,
    onSourceRemoved: PropTypes.func,
};

const defaultProps = {
    map: undefined,
    onSourceAdded: undefined,
    onSourceRemoved: undefined,
};


export default class MapSource extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    componentDidMount() {
        this.create(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.map !== nextProps.map) {
            this.destroy();
            this.create(nextProps);
        }
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy = () => {
        const { map, onSourceRemoved } = this.props;
        if (map && this.source) {
            map.removeSource(this.source);
        }
        if (onSourceRemoved) {
            onSourceRemoved();
        }
        this.source = undefined;
    }

    create = (props) => {
        const {
            map,
            sourceKey,
            geoJson,
            onSourceAdded,
        } = props;

        map.addSource(sourceKey, {
            type: 'geojson',
            data: geoJson,
        });
        this.source = sourceKey;

        if (onSourceAdded) {
            onSourceAdded();
        }
    }

    render() {
        return null;
    }
}
