import React from 'react';

import MapSource from '../../../components/Map/MapSource';
import GeoJsonRequest from './GeoJsonRequest';


const ProvinceSource = ({ sourceKey, geoJson, map, setContext, supportHover }) => (
    <MapSource
        sourceKey={sourceKey}
        map={map}
        geoJson={geoJson}
        onSourceAdded={() => { setContext({ [sourceKey]: true }); }}
        onSourceRemoved={() => { setContext({ [sourceKey]: undefined }); }}
        supportHover={supportHover}
    />
);

// Could be an HOC instead
export default (props) => (
    <GeoJsonRequest
        url={props.url}
        child={ProvinceSource}
        {...props}
    />
);
