import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    minValue: PropTypes.string.isRequired,
    maxValue: PropTypes.string.isRequired,
    minColor: PropTypes.string.isRequired,
    maxColor: PropTypes.string.isRequired,
};

const defaultProps = {
    className: '',
};

export default class Legend extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getClassName = () => {
        const { className } = this.props;
        const classNames = [
            className,
            'scale-legend',
            styles.scaleLegend,
        ];

        return classNames.join(' ');
    }

    getScaleStyle = () => {
        const {
            minColor,
            maxColor,
        } = this.props;

        return {
            background: `linear-gradient(to right, ${minColor}, ${maxColor})`,
        };
    }

    render() {
        const className = this.getClassName();
        const {
            minValue,
            maxValue,
        } = this.props;

        return (
            <div className={className}>
                <div className={styles.scale} style={this.getScaleStyle()}/>
                <div className={styles.scaleValues}>
                    <span>{ minValue }</span>
                    <span>{ maxValue }</span>
                </div>
            </div>
        );
    }
}
