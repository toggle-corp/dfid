import React from 'react';

import provinceGeoJson from '../../geofiles/province.geo.json';
import Map from '../../components/Map';

import SelectInput from '../../vendor/react-store/components/Input/SelectInput';

import styles from './styles.scss';

interface Props {
}
interface State {
}

interface Option {
    key: number;
    label: string;
}

const noOp = () => {};

export default class Dashboard extends React.PureComponent<Props, State>{
    provinceOptions: Option[];
    projectOptions: Option[];
    sectorOptions: Option[];
    indicatorOptions: Option[];

    constructor(props: Props) {
        super(props);

        this.provinceOptions = [
            { key: 1, label: 'Province 1' },
            { key: 2, label: 'Province 2' },
            { key: 3, label: 'Province 3' },
        ];

        this.projectOptions = [
            { key: 1, label: 'Project 1' },
            { key: 2, label: 'Project 2' },
        ];

        this.sectorOptions = [
            { key: 1, label: 'Sector 1' },
            { key: 2, label: 'Sector 2' },
        ];

        this.indicatorOptions = [
            { key: 1, label: 'HDI' },
            { key: 2, label: 'Population density' },
        ];
    }

    renderFilters = () => (
        <div className={styles.filters}>
            <div className={styles.left}>
                <SelectInput
                    label="Province"
                    className={styles.filter}
                    options={this.provinceOptions}
                    showHintAndError={false}
                    onChange={noOp}
                />
                <SelectInput
                    label="Project"
                    className={styles.filter}
                    options={this.projectOptions}
                    showHintAndError={false}
                    onChange={noOp}
                />
                <SelectInput
                    label="Sector"
                    className={styles.filter}
                    options={this.sectorOptions}
                    showHintAndError={false}
                    onChange={noOp}
                />
            </div>
            <div className={styles.right}>
                <SelectInput
                    label="Indicator"
                    className={styles.filter}
                    options={this.indicatorOptions}
                    showHintAndError={false}
                    onChange={noOp}
                />
            </div>
        </div>
    )

    renderInformation = () => (
        <div className={styles.right}>
            <div className={styles.provinceDetails}>
                <h3 className={styles.title}>
                    Province details
                </h3>
                <div className={styles.content}>
                    Province details
                </div>
            </div>
            <div className={styles.projectDetails}>
                <h3 className={styles.title}>
                    Project details
                </h3>
                <div className={styles.content}>
                    Project details
                </div>
            </div>
        </div>
    )

    render() {
        // tslint:disable-next-line variable-name
        const Filters = this.renderFilters;

        // tslint:disable-next-line variable-name
        const Information = this.renderInformation;

        return (
            <div className={styles.dashboard}>
                <div className={styles.left}>
                    <Filters />
                    <Map
                        className={styles.map}
                        geojson={provinceGeoJson}
                        idKey="D_ID"
                        labelKey="Title"
                    />
                </div>
                <Information />
            </div>
        );
    }
}
