import React from 'react';

import ListView from '../../../vendor/react-store/components/View/List/ListView';
import styles from './styles.scss';

interface Props {
    label: string;
    values: object[];
    valueModifier(value?: object | string | number): string;
}

const marker = '•';
class ListItem extends React.PureComponent<Props> {
    renderItem = ({ datum }: { datum: object }) => {
        const { valueModifier } = this.props;
        const title = valueModifier(datum);

        return (
            <div className={styles.item}>
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
                <div className={styles.label}>
                    {label}
                </div>
                <ListView
                    className={styles.list}
                    data={values}
                    renderer={this.renderItem}
                />
            </div>
        );
    }
}

export default ListItem;
