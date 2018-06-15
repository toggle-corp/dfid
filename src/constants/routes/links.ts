import { mapObjectToObject, Map } from '../../utils/map';
import { CloakSettings } from './interface';

const prepareSettings = (semantics: string): CloakSettings => {
    const mapCharacterToSettingMap: Map<{ name: string, value: boolean }> = {
        d: { name: 'requireDevMode', value: true },
        x: { name: 'requireLogin', value: false },
        l: { name: 'requireLogin', value: true },
        a: { name: 'requireAdminRights', value: true },
    };

    const settings: CloakSettings = {
        requireDevMode: false,
        requireLogin: false,
        requireAdminRights: false,
    };

    semantics.split(',').forEach((character) => {
        const characterSetting = mapCharacterToSettingMap[character];
        if (characterSetting) {
            const { name, value } = characterSetting;
            settings[name] = value;
        }
    });
    return settings;
};

export const noLinks = {};
export const allLinks = mapObjectToObject<string, CloakSettings>(
    {
        dashboard: '',
        explore: '',
        glossary: '',
    },
    prepareSettings,
);
