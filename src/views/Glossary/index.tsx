import React from 'react';
import { connect } from 'react-redux';
import Redux from 'redux';

import { RestRequest } from '../../vendor/react-store/utils/rest';
import styles from './styles.scss';

import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';
import Table, {
    Header,
} from '../../vendor/react-store/components/View/Table';
import {
    compareString,
    compareNumber,
} from '../../vendor/react-store/utils/common';
import SearchInput from '../../vendor/react-store/components/Input/SearchInput';
import {
    RootState,
    GlossaryData,
    SetGlossaryDataAction,
} from '../../redux/interface';

import {
    glossaryDataSelector,
    setGlossaryDataAction,
} from '../../redux';

import GlossaryDataGetRequest from './requests/GlossaryDataGetRequest';
interface OwnProps {
    loading?: boolean;
}
interface PropsFromState {
    glossaryData: GlossaryData[];
}

interface PropsFromDispatch {
    setGlossaryData(params: SetGlossaryDataAction): void;
}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

interface State {
    loadingGlossaryData: boolean;
    glossaryData: GlossaryData[];
    searchValue?: string;
}


const safeString = (value: string | undefined | null): string => {
    if (value === undefined || value === null) {
        return '';
    }
    return value;
};

export class Glossary extends React.PureComponent<Props, State> {
    headers: Header<GlossaryData>[];
    glossaryDataRequest: RestRequest;

    static filterGlossaryData = (data: GlossaryData[], searchValue?: string) => {
        if (!searchValue) {
            return data;
        }

        const filterFn = (datum: GlossaryData) => {
            const {
                description,
                title,
                source,
            } = datum;
            return (
                safeString(description).toLocaleLowerCase().includes(searchValue) ||
                safeString(title).toLocaleLowerCase().includes(searchValue) ||
                safeString(source).toLocaleLowerCase().includes(searchValue)
            );
        };

        return data.filter(filterFn);
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            loadingGlossaryData: true,
            searchValue: undefined,
            glossaryData: this.props.glossaryData,
        };
        this.headers = [
            {
                key: 'id',
                label: 'S.N',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareNumber(a.id, b.id),
            },
            {
                key: 'title',
                label: 'Title',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareString(a.title, b.title),
            },
            {
                key: 'source',
                label: 'Source',
                order: 3,
            },
            {
                key: 'description',
                label: 'Description',
                order: 4,
            },
        ];
    }

    componentWillMount() {
        this.startRequestForGlossaryData();
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.glossaryData !== nextProps.glossaryData) {
            this.setState({
                glossaryData: Glossary.filterGlossaryData(
                    nextProps.glossaryData,
                    this.state.searchValue,
                ),
            });
        }
    }

    componentWillUnmount() {
        if (this.glossaryDataRequest) {
            this.glossaryDataRequest.stop();
        }
    }

    startRequestForGlossaryData = () => {
        if (this.glossaryDataRequest) {
            this.glossaryDataRequest.stop();
        }
        const glossaryDataRequest = new GlossaryDataGetRequest({
            setState: params => this.setState(params),
            setGlossaryData: this.props.setGlossaryData,
        });
        this.glossaryDataRequest = glossaryDataRequest.create();
        this.glossaryDataRequest.start();
    }


    keyExtractor = (item: GlossaryData) => item.id;

    handleSearch = (value: string) => {
        const searchValue = value.toLocaleLowerCase();

        this.setState({
            searchValue,
            glossaryData: Glossary.filterGlossaryData(
                this.props.glossaryData,
                searchValue,
            ),
        });
    }

    render() {
        return (
            <div className={styles.glossary}>
                <div className={styles.search}>
                   <SearchInput
                        label="Search"
                        showHintAndError={false}
                        value={this.state.searchValue}
                        onChange={this.handleSearch}
                   />
                </div>
                <div className={styles.table}>
                    {this.state.loadingGlossaryData && <LoadingAnimation />}
                    <Table
                         data={this.state.glossaryData}
                         headers={this.headers}
                         keyExtractor={this.keyExtractor}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    glossaryData: glossaryDataSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch<RootState>) => ({
    setGlossaryData: (params: SetGlossaryDataAction) => dispatch(setGlossaryDataAction(params)),
});

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps,
)(Glossary);
