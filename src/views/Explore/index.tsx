import React from 'react';

import provinceGeoJson from '../../resources/geofiles/province.geo.json';
import Map from '../../components/Map';

import styles from './styles.scss';

export default class Explore extends React.PureComponent {
    render() {
        return (
            <div className={styles.explore}>
                <Map
                    className={styles.map}
                    geojson={provinceGeoJson}
                    idKey="D_ID"
                    labelKey="Title"
                />
               <div className={styles.stats}>
                    Stats
              </div>
            </div>
        );
    }
}
