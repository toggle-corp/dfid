import { mapToList } from '../../../vendor/react-store/utils/common';

export const getCategoricalPaint = (property, style, key, isInt = false) => ({
    property,
    type: 'categorical',
    stops: mapToList(style, (v, k) => [isInt ? parseInt(k, 10) : k, v[key]]),
});
