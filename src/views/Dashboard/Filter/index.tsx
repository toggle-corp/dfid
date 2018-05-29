import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import { iconNames } from '../../../constants';
import SelectInputWithList from '../../../vendor/react-store/components/Input/SelectInputWithList';
import DangerButton from '../../../vendor/react-store/components/Action/Button/DangerButton';
import WarningButton from '../../../vendor/react-store/components/Action/Button/WarningButton';
import PrimaryButton from '../../../vendor/react-store/components/Action/Button/PrimaryButton';
import SuccessButton from '../../../vendor/react-store/components/Action/Button/SuccessButton';
import Faram from '../../../vendor/react-store/components/Input/Faram';
import { isObjectEmpty } from '../../../vendor/react-store/utils/common';

import {
    setDashboardFiltersAction,
    sectorsSelector,
    programmesSelector,
    provincesSelector,
    dashboardFilterSelector,
    indicatorsSelector,
    mapLayersSelector,
} from '../../../redux';

import {
    RootState,
    Province,
    Programme,
    Sector,
    Indicator,
    MapLayer,
    SetDashboardFilterAction,
    DashboardFilterParams,
    DashboardFilter,
} from '../../../redux/interface';
import {
    FaramErrors,
    Schema,
} from '../../../rest/interface';

import styles from './styles.scss';

interface OwnProps {
    disabled: boolean;
    onFilterClear?(): void;
    // onChange when filters are applied
    onChange?(oldValues: DashboardFilterParams, values: DashboardFilterParams): void;
}
interface PropsFromState {
    programmes: Programme[];
    provinces: Province[];
    sectors: Sector[];
    indicators: Indicator[];
    mapLayers: MapLayer[];
    faramState: DashboardFilter;
}
interface PropsFromDispatch {
    setDashboardFilters(params: SetDashboardFilterAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State { }

export class Filter extends React.PureComponent<Props, State>{
    schema: Schema;

    static provinceKeyExtractor = (p: Province) => p.id;
    static provinceLabelExtractor = (p: Province) => p.name;
    static programmeKeyExtractor = (p: Programme) => p.id;
    static programmeLabelExtractor = (p: Programme) => p.name;
    static sectorKeyExtractor = (p: Sector) => p.id;
    static sectorLabelExtractor = (p: Sector) => p.name;
    static indicatorKeyExtractor = (p: Indicator) => p.id;
    static indicatorLabelExtractor = (p: Indicator) => p.name;
    static mapLayerKeyExtractor = (p: MapLayer) => p.id;
    static mapLayerLabelExtractor = (p: MapLayer) => p.layerName;

    constructor(props: Props) {
        super(props);

        this.schema = {
            fields: {
                provincesId: [],
                programmesId: [],
                sectorsId: [],
                indicatorsId: [],
                mapLayersId: [],
            },
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        const { onChange, faramState: { filters: oldFilters } } = this.props;
        const { faramState: { filters } } = nextProps;
        if (filters !== oldFilters) {
            if (onChange) {
                onChange(oldFilters, filters);
            }
        }
    }

    handleFaramChange = (
        faramValues: DashboardFilterParams, faramErrors: FaramErrors,
    ) => {
        this.props.setDashboardFilters({
            faramValues,
            faramErrors,
            pristine: false,
        });
    }

    handleFaramFailure = (faramErrors: FaramErrors) => {
        this.props.setDashboardFilters({
            faramErrors,
            pristine: true,
        });
    }

    handleFaramSuccess = (faramValues: DashboardFilterParams) => {
        this.props.setDashboardFilters({
            faramValues,
            filters: faramValues,
            pristine: true,
        });
    }

    handleToggleHidden = () => {
        this.props.setDashboardFilters({
            isHidden: !this.props.faramState.isHidden,
        });
    }

    handleClearFilter = () => {
        const { onFilterClear } = this.props;
        this.props.setDashboardFilters({
            faramValues: {},
            pristine: false,
        });
        if (onFilterClear) {
            onFilterClear();
        }
    }

    handleDiscard = () => {
        const { faramState: { filters } } = this.props;
        this.props.setDashboardFilters({
            faramValues: filters,
            pristine: true,
        });
    }

    renderPopup = () => (
        <div className={styles.popup}>
            <PrimaryButton
                title="Expand"
                onClick={this.handleToggleHidden}
                iconName={iconNames.filter}
            />
        </div>
    )

    render() {
        const {
            disabled,
            faramState,
            provinces,
            programmes,
            sectors,
            indicators,
            mapLayers,
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
            isHidden,
        } = faramState;

        if (isHidden) {
            return this.renderPopup();
        }

        const isFilterEmpty = isObjectEmpty(faramValues);

        return (
            <Faram
                className={styles.filtersContainer}
                onChange={this.handleFaramChange}
                onValidationFailure={this.handleFaramFailure}
                onValidationSuccess={this.handleFaramSuccess}
                schema={this.schema}
                value={faramValues}
                error={faramErrors}
                disabled={disabled}
            >
                <header className={styles.header}>
                    <DangerButton
                        title="Close"
                        onClick={this.handleToggleHidden}
                        iconName={iconNames.close}
                        className={styles.close}
                        transparent
                    />
                    <div className={styles.rightContainer}>
                        <WarningButton
                            title="Clear all"
                            onClick={this.handleClearFilter}
                            iconName={iconNames.refresh}
                            disabled={isFilterEmpty}
                            transparent
                        />
                        <SuccessButton
                            type="submit"
                            disabled={pristine || disabled}
                            iconName={iconNames.check}
                            transparent
                        />
                        <DangerButton
                            title="Discard Changes"
                            onClick={this.handleDiscard}
                            disabled={pristine || disabled}
                            iconName={iconNames.close}
                            transparent
                        />
                    </div>
                </header>
                <div className={styles.container}>
                    <div className={styles.filters}>
                        <h4 className={styles.heading}>
                            Filters
                        </h4>
                        <div className={styles.content}>
                            <SelectInputWithList
                                label="Province"
                                className={styles.input}
                                faramElementName="provincesId"
                                options={provinces}
                                keySelector={Filter.provinceKeyExtractor}
                                labelSelector={Filter.provinceLabelExtractor}
                                showHintAndError={false}
                            />
                            <SelectInputWithList
                                label="Programme"
                                className={styles.input}
                                options={programmes}
                                faramElementName="programmesId"
                                keySelector={Filter.programmeKeyExtractor}
                                labelSelector={Filter.programmeLabelExtractor}
                                showHintAndError={false}
                            />
                            <SelectInputWithList
                                label="Sector"
                                className={styles.input}
                                options={sectors}
                                faramElementName="sectorsId"
                                keySelector={Filter.sectorKeyExtractor}
                                labelSelector={Filter.sectorLabelExtractor}
                                showHintAndError={false}
                            />
                        </div>
                    </div>
                    <div className={styles.layers}>
                        <h4 className={styles.heading}>
                            Layers
                        </h4>
                        <div className={styles.content}>
                            <SelectInputWithList
                                label="Indicator"
                                className={styles.input}
                                options={indicators}
                                faramElementName="indicatorsId"
                                keySelector={Filter.indicatorKeyExtractor}
                                labelSelector={Filter.indicatorLabelExtractor}
                                showHintAndError={false}
                            />
                            <SelectInputWithList
                                label="Map Layers"
                                className={styles.input}
                                options={mapLayers}
                                faramElementName="mapLayersId"
                                keySelector={Filter.mapLayerKeyExtractor}
                                labelSelector={Filter.mapLayerLabelExtractor}
                                showHintAndError={false}
                            />
                        </div>
                    </div>
                </div>
            </Faram>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    sectors: sectorsSelector(state),
    programmes: programmesSelector(state),
    provinces: provincesSelector(state),
    indicators: indicatorsSelector(state),
    mapLayers: mapLayersSelector(state),
    faramState: dashboardFilterSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setDashboardFilters: (params: SetDashboardFilterAction) =>
        dispatch(setDashboardFiltersAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Filter);
