import React from 'react';

import MapSource from '../../../components/Map/MapSource';
import { RequestWrapper } from './GeoJsonRequest';


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

export default (props) => (
    <RequestWrapper
        url={props.url}
        child={ProvinceSource}
        {...props}
    />
);
