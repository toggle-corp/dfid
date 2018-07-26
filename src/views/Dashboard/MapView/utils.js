import { mapToList } from '../../../vendor/react-store/utils/common';

export const getCategoricalPaint = (property, style, key, isInt = false, defaultValue = undefined) => {
    const paint = {
        property,
        type: 'categorical',
        stops: mapToList(style, (v, k) => [isInt ? parseInt(k, 10) : k, v[key]]),
    };

    if (defaultValue) {
        paint.default = defaultValue;
    }

    return paint;
};
