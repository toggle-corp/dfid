import React from 'react';

import ListView from '../../../vendor/react-store/components/View/List/ListView';
import styles from './styles.scss';

interface Props {
    label?: string;
    values: object[];
    // FIXME: Check if ReactNode is supported
    valueModifier(value?: object | string | number): string | React.ReactNode;
    keySelector(value?: object | string | number, index?: number): string | number;
}

const marker = '•';
class ListItem extends React.PureComponent<Props> {

    renderItem = (_: undefined, datum: object, index: number) => {
        const { keySelector, valueModifier } = this.props;
        const title = valueModifier(datum);

        const key = keySelector(datum, index);

        return (
            <div
                key={key}
                className={styles.item}
            >
                <span className={styles.marker}>
                    {marker}
                </span>
                <span className={styles.title}>
                    {title}
                </span>
            </div>
        );
    }

    render() {
        const {
            label,
            values,
        } = this.props;

        return (
            <div className={styles.listItem} >
                { label &&
                    <div className={styles.label}>
                        {label}
                    </div>
                }
                <ListView
                    className={styles.list}
                    data={values}
                    modifier={this.renderItem}
                />
            </div>
        );
    }
}

export default ListItem;
