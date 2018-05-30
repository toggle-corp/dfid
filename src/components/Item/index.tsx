import React from 'react';

import styles from './styles.scss';

interface Props {
    label: string;
    value?: object | string | number;
    valueModifier?(value?: object | string | number): JSX.Element;
}

class Item extends React.PureComponent<Props> {
    render() {
        const {
            label,
            value,
            valueModifier,
        } = this.props;

        const val = valueModifier ? valueModifier(value) : value;

        return (
            <div className={styles.item} >
                <div className={styles.label}>
                    {label}
                </div>
                <div className={styles.value}>
                    {val || '-'}
                </div>
            </div>
        );
    }
}

export default Item;
