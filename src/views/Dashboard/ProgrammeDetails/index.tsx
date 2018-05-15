import React from 'react';
import { connect } from 'react-redux';

import { RestRequest } from '../../../vendor/react-store/utils/rest';

import {
    RootState,
    ProgrammeData,
    ProgrammeSectorName,
} from '../../../redux/interface';
import {
    programmesDataSelector,
} from '../../../redux';

import Numeral from '../../../vendor/react-store/components/View/Numeral';
import ListView from '../../../vendor/react-store/components/View/List/ListView';

import styles from './styles.scss';

interface OwnProps {}
interface PropsFromState {
    programmeData: ProgrammeData[];
}
type Props = OwnProps & PropsFromState ;

interface State {
    programmeData?: ProgrammeData;
    loadingProgrammeData: boolean;
    selectedProgramme?: number;
}

export class ProgrammeDetails extends React.PureComponent<Props, State>{
    programmeDataRequest: RestRequest;

    constructor(props: Props) {
        super(props);

        this.state = {
            loadingProgrammeData: true,
            selectedProgramme: undefined,
        };
    }

    renderProgrammeDetailInfo = () => {
        const { programmeData } = this.props;
        const { selectedProgramme } = this.state;

        const data: Partial<ProgrammeData> = programmeData.find(d =>
            d.programId === selectedProgramme,
        ) || {};


        const { sectors = [] } = data;

        return (
            <div
                className={styles.content}
            >
                <div
                    className={styles.item}
                    key="program"
                >
                    <div className={styles.label}>
                        Program
                    </div>
                    <div className={styles.value}>
                        {data.program || '-'} </div>
                </div>
                <div
                    className={styles.item}
                    key="programBudget"
                >
                    <div className={styles.label}>
                       Budget
                    </div>
                    <Numeral
                        className={styles.value}
                        prefix="£"
                        precision={0}
                        value={data.programBudget}
                    />
                </div>
                <div
                    className={styles.item}
                    key="programmeSectorName"
                >
                    <div className={styles.label}>
                        Sector
                    </div>
                    <ListView
                        className={`${styles.value} ${styles.sector}`}
                        data={sectors}
                        modifier={this.renderProgrammeSectorName}
                    />
                </div>
                <div
                    className={styles.item}
                    key="description"
                >
                    <div className={styles.label}>
                       Description
                    </div>
                    <div className={styles.value}>
                        {data.description || '-'}
                    </div>
                </div>
            </div>
        );
    }

    renderProgrammeSectorName = (k: undefined, data: ProgrammeSectorName) => (
        <div
            key={data.sectorId}
            className={styles.sectorName}
        >
            <span className={styles.title}>{data.sectorName}</span>
        </div>
    )


    render() {
        const {
            selectedProgramme,
            loadingProgrammeData,
        } = this.state;

        if (!selectedProgramme) {
            return (
                <div className={styles.message}>
                    <h3> Select a programme </h3>
                </div>
            );
        }

        // tslint:disable-next-line variable-name
        const ProgrammeDetailInfo = this.renderProgrammeDetailInfo;
        // tslint:disable-next-line variable-name
        const LoadingMessage = () => (
            <div className={styles.content}>
            Loading Province Information ...
            </div>
        );

        return (
            <div className={styles.programmeDetails}>
            {
                loadingProgrammeData ?
                <LoadingMessage /> :
                <ProgrammeDetailInfo />
            }
            </div>
        );

    }
}

const mapStateToProps = (state: RootState) => ({
    programmeData: programmesDataSelector(state),
});

export default connect<PropsFromState, OwnProps>(
    mapStateToProps,
)(ProgrammeDetails);

