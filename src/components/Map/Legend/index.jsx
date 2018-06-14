import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    legendItems: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        color: PropTypes.color,
    })),
    onStateChange: PropTypes.func,
};

const defaultProps = {
    className: '',
    legendItems: [],
    fontSize: 12,
    onStateChange: undefined,
};

export default class Legend extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);
        this.state = {
            inactive: [],
        };
    }

    getItemClassName = (item) => {
        const { inactive } = this.state;

        const styleNames = [styles['legend-item'], 'legend-item'];

        if (inactive.indexOf(item.label) !== -1) {
            styleNames.push(styles.inactive);
        }

        return styleNames.join(' ');
    }

    toggleItem = (item) => {
        if (!this.props.onStateChange) {
            return;
        }

        const { legendItems } = this.props;
        let inactive = [...this.state.inactive];

        if (inactive.length === 0) {
            inactive = legendItems.map(i => i.label).filter(l => l !== item.label);
        } else {
            const index = inactive.indexOf(item.label);
            if (index >= 0) {
                inactive.splice(index, 1);
            } else {
                inactive.push(item.label);
            }

            if (inactive.length === legendItems.length) {
                inactive = [];
            }
        }

        this.setState({ inactive });
        this.props.onStateChange(inactive);
    }

    renderLegendItem = item => (
        <button
            key={item.label}
            className={this.getItemClassName(item)}
            onClick={() => this.toggleItem(item)}
        >
            <div className={styles.iconContainer}>
                <span
                    className={styles.icon}
                    style={{
                        backgroundColor: item.color || 'rgba(0, 0, 0, 0.5)',
                        width: 10,
                        height: 10,
                    }}
                />
            </div>
            <p className={`${styles.label} label`} >
                {item.label}
            </p>
        </button>
    )

    render() {
        const { className, legendItems } = this.props;

        return (
            <div className={`legend ${className} ${styles.legend}`} >
                {legendItems.map(item => this.renderLegendItem(item))}
            </div>
        );
    }
}