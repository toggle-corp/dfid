import React, { Fragment }  from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import SelectInputWithList from '../../../vendor/react-store/components/Input/SelectInputWithList';
import SelectInput from '../../../vendor/react-store/components/Input/SelectInput';
import DangerButton from '../../../vendor/react-store/components/Action/Button/DangerButton';
import WarningButton from '../../../vendor/react-store/components/Action/Button/WarningButton';
import SuccessButton from '../../../vendor/react-store/components/Action/Button/SuccessButton';
import Faram from '../../../vendor/react-store/components/Input/Faram';
import { isObjectEmpty } from '../../../vendor/react-store/utils/common';

import {
    setDashboardFiltersAction,
    sectorsSelector,
    programmesSelector,
    provincesSelector,
    dashboardFilterPaneSelector,
    indicatorsSelector,
    validMapLayersSelector,
    validRasterMapLayersSelector,
    setDashboardShowCompareAction,
    dashboardShowCompareSelector,
    setInformationPaneStateAction,
} from '../../../redux';

import {
    RootState,
    Province,
    Programme,
    Sector,
    Indicator,
    MapLayer,
    DashboardFilterParams,
    DashboardFilter,
    SetDashboardFilterAction,
    SetInformationPaneStateAction,
} from '../../../redux/interface';
import {
    FaramErrors,
    Schema,
} from '../../../rest/interface';

import styles from './styles.scss';

interface OwnProps {
    className?: string;
    disabled: boolean;
    onFilterClear?(): void;
    // onChange when filters are applied
    onChange?(oldValues: DashboardFilterParams, values: DashboardFilterParams): void;
    loadingProvinces?: boolean;
    loadingProgrammes?: boolean;
    loadingSectors?: boolean;
    loadingIndicators?: boolean;
    loadingLayers?: boolean;
}

interface PropsFromState {
    programmes: Programme[];
    provinces: Province[];
    sectors: Sector[];
    indicators: Indicator[];
    mapLayers: MapLayer[];
    rasterMapLayers: MapLayer[];
    faramState: DashboardFilter;
    showCompare: boolean;
}

interface PropsFromDispatch {
    setDashboardFilters(params: SetDashboardFilterAction): void;
    setDashboardShowCompare(showBoolean: boolean): void;
    setInformationPaneState(params: SetInformationPaneStateAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State { }

const provinceKeyExtractor = (p: Province) => p.id;
const provinceLabelExtractor = (p: Province) => p.name;
const programmeKeyExtractor = (p: Programme) => p.id;
const programmeLabelExtractor = (p: Programme) => p.name;
const sectorKeyExtractor = (p: Sector) => p.id;
const sectorLabelExtractor = (p: Sector) => p.name;
const indicatorKeyExtractor = (p: Indicator) => p.id;
const indicatorLabelExtractor = (p: Indicator) => p.name;
const mapLayerKeyExtractor = (p: MapLayer) => p.id;
const mapLayerLabelExtractor = (p: MapLayer) => p.layerName;

const renderProvinceEmpty = () => (
    <div className={styles.empty}>
        No province selected
    </div>
);

const renderProgramEmpty = () => (
    <div className={styles.empty}>
        No program selected
    </div>
);

const renderSectorEmpty = () => (
    <div className={styles.empty}>
        No sector selected
    </div>
);

const renderIndicatorEmpty = () => (
    <div className={styles.empty}>
        No indicator selected
    </div>
);

const renderLayerEmpty = () => (
    <div className={styles.empty}>
        No layer selected
    </div>
);

export class FilterPane extends React.PureComponent<Props, State>{
    schema: Schema;

    constructor(props: Props) {
        super(props);

        this.schema = {
            fields: {
                provincesId: [],
                programmesId: [],
                sectorsId: [],
                indicatorId: [],
                mapLayersId: [],
                rasterMapLayerId: [],
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
            filters: {},
            pristine: true,
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

    toggleShowCompare = () => {
        this.props.setDashboardShowCompare(!this.props.showCompare);
        this.props.setInformationPaneState({ isCollapsed: false });
    }

    render() {
        const {
            disabled,
            faramState,
            provinces,
            programmes,
            sectors,
            indicators,
            mapLayers,
            rasterMapLayers,
            className,
            showCompare,

            loadingProvinces,
            loadingProgrammes,
            loadingSectors,
            loadingIndicators,
            loadingLayers,
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
        } = faramState;

        const classNames = [
            className,
            styles.filtersContainer,
        ];

        const isFilterEmpty = isObjectEmpty(faramValues);

        return (
            <Faram
                className={classNames.join(' ')}
                onChange={this.handleFaramChange}
                onValidationFailure={this.handleFaramFailure}
                onValidationSuccess={this.handleFaramSuccess}
                schema={this.schema}
                value={faramValues}
                error={faramErrors}
                disabled={disabled}
            >
                <header className={styles.header}>
                    <div className={styles.left}>
                        <WarningButton
                            title="Clear all selection"
                            onClick={this.handleClearFilter}
                            disabled={isFilterEmpty || disabled}
                            transparent
                        >
                           Clear
                        </WarningButton>
                    </div>
                    <div className={styles.right}>
                        <DangerButton
                            title="Discard current changes"
                            onClick={this.handleDiscard}
                            transparent
                            disabled={pristine || disabled}
                        >
                            Cancel
                        </DangerButton>
                        <SuccessButton
                            title="Apply current changes"
                            type="submit"
                            disabled={pristine || disabled}
                            transparent
                        >
                            Apply
                        </ SuccessButton>
                    </div>
                </header>
                <div className={styles.container}>
                    <div className={styles.filters}>
                        { !loadingProvinces &&
                            <SelectInputWithList
                                label="Provinces"
                                className={styles.input}
                                faramElementName="provincesId"
                                options={provinces}
                                keySelector={provinceKeyExtractor}
                                labelSelector={provinceLabelExtractor}
                                showHintAndError={false}
                                listProps={{ emptyComponent: renderProvinceEmpty }}
                            />
                        }
                        { !loadingSectors &&
                            <SelectInputWithList
                                label="Sectors"
                                className={styles.input}
                                options={sectors}
                                faramElementName="sectorsId"
                                keySelector={sectorKeyExtractor}
                                labelSelector={sectorLabelExtractor}
                                showHintAndError={false}
                                listProps={{ emptyComponent: renderSectorEmpty }}
                            />
                        }
                        { !loadingProgrammes &&
                            <SelectInputWithList
                                label="Programmes"
                                className={styles.input}
                                options={programmes}
                                faramElementName="programmesId"
                                keySelector={programmeKeyExtractor}
                                labelSelector={programmeLabelExtractor}
                                showHintAndError={false}
                                listProps={{ emptyComponent: renderProgramEmpty }}
                            />
                        }
                    </div>
                    <div className={styles.layers}>
                        { !loadingIndicators &&
                            <SelectInput
                                label="Indicators"
                                className={styles.input}
                                options={indicators}
                                faramElementName="indicatorId"
                                keySelector={indicatorKeyExtractor}
                                labelSelector={indicatorLabelExtractor}
                                showHintAndError={false}
                                listProps={{ emptyComponent: renderIndicatorEmpty }}
                            />
                        }
                        { !loadingLayers &&
                            <Fragment>
                                <SelectInput
                                    label="Background Layers"
                                    className={styles.input}
                                    options={rasterMapLayers}
                                    faramElementName="rasterMapLayerId"
                                    keySelector={mapLayerKeyExtractor}
                                    labelSelector={mapLayerLabelExtractor}
                                    showHintAndError={false}
                                />
                                <SelectInputWithList
                                    label="Layers"
                                    className={styles.input}
                                    options={mapLayers}
                                    faramElementName="mapLayersId"
                                    keySelector={mapLayerKeyExtractor}
                                    labelSelector={mapLayerLabelExtractor}
                                    showHintAndError={false}
                                    listProps={{ emptyComponent: renderLayerEmpty }}
                                />
                            </Fragment>
                        }
                    </div>
                </div>
                <WarningButton
                    title={showCompare ? 'Show Map' : 'Show Compare'}
                    onClick={this.toggleShowCompare}
                    disabled={disabled}
                    transparent
                >
                    {showCompare ? 'Show Map' : 'Show Compare'}
                </WarningButton>
            </Faram>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    sectors: sectorsSelector(state),
    programmes: programmesSelector(state),
    provinces: provincesSelector(state),
    indicators: indicatorsSelector(state),
    mapLayers: validMapLayersSelector(state),
    rasterMapLayers: validRasterMapLayersSelector(state),
    faramState: dashboardFilterPaneSelector(state),
    showCompare: dashboardShowCompareSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setDashboardFilters: (params: SetDashboardFilterAction) =>
        dispatch(setDashboardFiltersAction(params)),
    setDashboardShowCompare: (showCompare: boolean) =>
        dispatch(setDashboardShowCompareAction(showCompare)),
    setInformationPaneState: (params: SetInformationPaneStateAction) =>
        dispatch(setInformationPaneStateAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(FilterPane);
