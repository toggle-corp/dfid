import React from 'react';
import Numeral from '../../../vendor/react-store/components/View/Numeral';

import styles from './styles.scss';

interface Data {
    label: string;
    icon: string;
    isCurrency: boolean;
    value: string;
}

interface Props {
    className: string;
    datum: Data;
}

export default class ProvinceDetailItem extends React.PureComponent <Props>{
    getClassName = () => {
        const { className } = this.props;
        const classNames = [
            className,
            styles.provinceDetailItem,
        ];
        return classNames.join(' ');
    }

    render () {
        const { datum } = this.props;
        const className = this.getClassName();

        return (
            <div className={className}>
                <img
                    className={styles.icon}
                    src={datum.icon}
                />
                <div className={styles.label}>
                    {datum.label || '-'}
                </div>
                <div className={styles.value}>
                    <Numeral
                        precision={datum.isCurrency ? 2 : 0}
                        prefix={datum.isCurrency ? '£' : undefined}
                        normal={datum.isCurrency}
                        value={datum.value}
                    />
                </div>
            </div>
        );
    }
}
