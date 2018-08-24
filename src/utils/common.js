import { getHashFromString } from '../vendor/react-store/utils/common';

export const getPastelColorFromString = (str) => {
    const hash = getHashFromString(str);
    return `hsl(${hash % 360}, 75%, 85%)`;
}
