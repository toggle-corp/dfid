import React from 'react';
import Numeral from '../vendor/react-store/components/View/Numeral';


export const renderPound = (data: number) => (
    <Numeral
        precision={1}
        value={data}
        prefix="£"
        lang="en"
        normal
    />
);

export const renderDollar = (data: number) => (
    <Numeral
        precision={0}
        value={data}
        prefix="$"
    />
);

export const renderNumeral = (data: number) => (
    <Numeral
        precision={0}
        value={data}
    />
);

export const renderPercent = (data: number) => (
    <Numeral
        precision={2}
        suffix=" %"
        value={data ? data * 100 : undefined}
    />
);

export const renderNormalNumeral = (data: number) => (
    <Numeral
        value={data}
    />
);

// Render Text

export const renderPercentText = (data: number) => (
    Numeral.renderText({
        precision: 2,
        suffix: '%',
        value: data ? data * 100 : undefined,
    })
);

export const renderDollarText = (data: number) => (
    Numeral.renderText({
        precision: 0,
        value: data,
        prefix: '$',
    })
);

export const renderPoundText = (data: number) => (
    Numeral.renderText({
        precision: 1,
        value: data,
        prefix: '£',
        lang: 'en',
        normal: true,
    })
);
