const mapStyles = {
    provinces: {
        stroke: '#444',
        strokeWidth: 1.5,

        color: '#fff',
        opacity: 0,

        hoverColor: '#d0d1e6',
        hoverOpacity: 0.5,
    },

    selectedProvinces: {
        color: '#fff',
        opacity: 0,
        stroke: '#b30000',
        strokeWidth: 2.5,
    },

    municipalities: {
        stroke: '#795548',
        strokeOpacity: 0.3,

        color: '#1c9099',
        opacity: 0.6,
    },

    municipalitiesHover: {
        color: '#fff',
        opacity: 0,
        hoverColor: '#d0d1e6',
        hoverOpacity: 0.6,
    },

    municipalitiesSelected: {
        stroke: '#b30000',
        strokeWidth: 1.5,
        strokeOpacity: 1,
    },

    indicator: {
        color: '#fc8d59',
        hoverColor: '#d0d1e6',
    },

    transparent: {
        color: '#fff',
        opacity: 0,
        stroke: '#fff',
        strokeOpacity: 0,
    },
};

export default mapStyles;
