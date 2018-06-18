import React from 'react';
import { connect } from 'react-redux';

import styles from './styles.scss';

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
} from '../../redux/interface';

import { glossaryDataSelector } from '../../redux';
interface OwnProps {
    loading?: boolean;
}
interface PropsFromState {
    glossaryData: GlossaryData[];
}

interface PropsFromDispatch {}
type Props = OwnProps & PropsFromState;

interface State {}


export class Glossary extends React.PureComponent<Props, State> {
    headers: Header<GlossaryData>[];

    constructor(props: Props) {
        super(props);
        this.state = {

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

    keyExtractor = (item: GlossaryData) => item.id;
    render() {
        return (
            <div className={styles.glossary}>
                <div className={styles.search}>
                   <SearchInput
                        label="Search"
                        showHintAndError={false}
                   />
                </div>
                <div className={styles.table}>
                    <Table
                         data={this.props.glossaryData}
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

export default connect<PropsFromState, PropsFromDispatch, OwnProps>(
    mapStateToProps,
)(Glossary);
