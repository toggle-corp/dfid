import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import { iconNames } from '../../../constants';
import SelectInput from '../../../vendor/react-store/components/Input/SelectInput';
import PrimaryButton from '../../../vendor/react-store/components/Action/Button/PrimaryButton';
import Faram from '../../../vendor/react-store/components/Input/Faram';

import {
    setDashboardFiltersAction,
    sectorsSelector,
    programmesSelector,
    provincesSelector,
    dashboardFilterSelector,
} from '../../../redux';

import {
    RootState,
    Province,
    Programme,
    Sector,
    SetDashboardFilterAction,
    DashboardFilterParams,
    DashboardFilter,
} from '../../../redux/interface';
import {
    FaramErrors,
    Schema,
} from '../../../rest/interface';

import styles from '../styles.scss';

interface OwnProps {
    disabled: boolean;
    onFilterClear?(): void;
    onChange?(oldValues: DashboardFilterParams, values: DashboardFilterParams): void;
}
interface PropsFromState {
    programmes: Programme[];
    provinces: Province[];
    sectors: Sector[];
    faramState: DashboardFilter;
}
interface PropsFromDispatch {
    setDashboardFilters(params: SetDashboardFilterAction): void;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {
    isHidden: boolean;
}

interface Option {
    key: number;
    label: string;
}

const noOp = () => {};

export class Filter extends React.PureComponent<Props, State>{
    schema: Schema;

    indicatorOptions: Option[];
    static provinceKeyExtractor = (p: Province) => p.id;
    static programmeKeyExtractor = (p: Programme) => p.id;
    static programmeLabelExtractor = (p: Programme) => p.name;
    static sectorKeyExtractor = (p: Sector) => p.id;
    static sectorLabelExtractor = (p: Sector) => p.name;

    constructor(props: Props) {
        super(props);

        this.state = {
            isHidden: true,
        };

        this.schema = {
            fields: {
                provinceId: [],
                programmeId: [],
                sectorId: [],
            },
        };

        this.indicatorOptions = [
            { key: 1, label: 'HDI' },
            { key: 2, label: 'Population density' },
        ];
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
        this.setState({
            isHidden: !this.state.isHidden,
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
                iconName={iconNames.expand}
            />
        </div>
    )

    render() {
        const {
            disabled,
            faramState,
        } = this.props;

        const {
            isHidden,
        } = this.state;

        const {
            faramValues,
            faramErrors,
        } = faramState;

        if (isHidden) {
            return this.renderPopup();
        }

        return (
            <Faram
                className={styles.filters}
                onChange={this.handleFaramChange}
                onValidationFailure={this.handleFaramFailure}
                onValidationSuccess={this.handleFaramSuccess}
                schema={this.schema}
                value={faramValues}
                error={faramErrors}
                disabled={disabled}
            >
                <div className={styles.title}>
                    <h3>
                        filters
                    </h3>
                    <PrimaryButton
                        title="Close"
                        onClick={this.handleToggleHidden}
                        iconName={iconNames.close}
                        className={styles.close}
                        transparent
                    />
                </div>
                <div className={styles.clear}>
                    <PrimaryButton
                        title="Clear Filter"
                        onClick={this.handleClearFilter}
                        transparent
                    >
                        Clear Filter
                    </PrimaryButton>
                </div>
                <div className={styles.left}>
                    <SelectInput
                        label="Province"
                        className={styles.province}
                        faramElementName="provinceId"
                        options={this.props.provinces}
                        keySelector={Filter.provinceKeyExtractor}
                        labelSelector={Filter.provinceKeyExtractor}
                        showHintAndError={false}
                        disabled={disabled}
                    />
                    <SelectInput
                        label="Programme"
                        className={styles.programme}
                        options={this.props.programmes}
                        faramElementName="programmeId"
                        keySelector={Filter.programmeKeyExtractor}
                        labelSelector={Filter.programmeLabelExtractor}
                        showHintAndError={false}
                        disabled={disabled}
                    />
                    <SelectInput
                        label="Sector"
                        className={styles.sector}
                        options={this.props.sectors}
                        faramElementName="sectorId"
                        keySelector={Filter.sectorKeyExtractor}
                        labelSelector={Filter.sectorLabelExtractor}
                        showHintAndError={false}
                        disabled={disabled}
                    />
                </div>
                <div className={styles.title}>
                    <h3>
                        Sub-filters
                    </h3>
                </div>
                <div className={styles.right}>
                    <SelectInput
                        label="Indicator"
                        className={styles.indicator}
                        options={this.indicatorOptions}
                        showHintAndError={false}
                        onChange={noOp}
                        disabled={disabled}
                    />
                    <SelectInput
                        label="Map Layers"
                        className={styles.layers}
                        options={this.indicatorOptions}
                        showHintAndError={false}
                        onChange={noOp}
                        disabled={disabled}
                    />
                </div>
            </Faram>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    sectors: sectorsSelector(state),
    programmes: programmesSelector(state),
    provinces: provincesSelector(state),
    faramState: dashboardFilterSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setDashboardFilters: (params: SetDashboardFilterAction) =>
        dispatch(setDashboardFiltersAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Filter);
