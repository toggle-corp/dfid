import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import { iconNames } from '../../../constants';
import SelectInput from '../../../vendor/react-store/components/Input/SelectInput';
import DangerButton from '../../../vendor/react-store/components/Action/Button/DangerButton';
import WarningButton from '../../../vendor/react-store/components/Action/Button/WarningButton';
import PrimaryButton from '../../../vendor/react-store/components/Action/Button/PrimaryButton';
import Faram from '../../../vendor/react-store/components/Input/Faram';

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

interface State {}

export class Filter extends React.PureComponent<Props, State>{
    schema: Schema;

    static provinceKeyExtractor = (p: Province) => p.id;
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
                provinceId: [],
                programmeId: [],
                sectorId: [],
                indicatorId: [],
                mapLayerId: [],
            },
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        const { onChange, faramState: { faramValues: oldFaramValues } } = this.props;
        const { faramState: { faramValues } } = nextProps;
        if (faramValues !== oldFaramValues) {
            if (onChange) {
                onChange(oldFaramValues, faramValues);
            }
        }
    }

    handleFaramChange = (
        faramValues: DashboardFilterParams, faramErrors: FaramErrors,
    ) => {
        this.props.setDashboardFilters({
            faramValues,
            faramErrors,
        });
    }

    handleFaramFailure = (faramErrors: FaramErrors) => {
        this.props.setDashboardFilters({
            faramErrors,
        });
    }

    handleFaramSuccess = (value: DashboardFilterParams) => {
        console.warn(value);
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
        });
        if (onFilterClear) {
            onFilterClear();
        }
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
            isHidden,
        } = faramState;

        if (isHidden) {
            return this.renderPopup();
        }

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
                    <WarningButton
                        title="Clear all"
                        onClick={this.handleClearFilter}
                        transparent
                    >
                        Clear all
                    </WarningButton>
                </header>
                <div className={styles.filters}>
                    <h4 className={styles.heading}>
                        Filters
                    </h4>
                    <div className={styles.content}>
                        <SelectInput
                            label="Province"
                            className={styles.input}
                            faramElementName="provinceId"
                            options={provinces}
                            keySelector={Filter.provinceKeyExtractor}
                            labelSelector={Filter.provinceKeyExtractor}
                            showHintAndError={false}
                        />
                        <SelectInput
                            label="Programme"
                            className={styles.input}
                            options={programmes}
                            faramElementName="programmeId"
                            keySelector={Filter.programmeKeyExtractor}
                            labelSelector={Filter.programmeLabelExtractor}
                            showHintAndError={false}
                        />
                        <SelectInput
                            label="Sector"
                            className={styles.input}
                            options={sectors}
                            faramElementName="sectorId"
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
                        <SelectInput
                            label="Indicator"
                            className={styles.input}
                            options={indicators}
                            faramElementName="indicatorId"
                            keySelector={Filter.indicatorKeyExtractor}
                            labelSelector={Filter.indicatorLabelExtractor}
                            showHintAndError={false}
                        />
                        <SelectInput
                            label="Map Layers"
                            className={styles.input}
                            options={mapLayers}
                            faramElementName="mapLayerId"
                            keySelector={Filter.mapLayerKeyExtractor}
                            labelSelector={Filter.mapLayerLabelExtractor}
                            showHintAndError={false}
                        />
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
