// Type definitions for react-responsive-carousel 3.1
// Project: https://github.com/leandrowd/react-responsive-carousel/
// Definitions by: Tatu Tamminen <https://github.com/ttamminen>
//                 Deividas Bakanas <https://github.com/DeividasBakanas>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import * as React from "react";

export type Axis = "horizontal" | "vertical";
export type srcType =  "receive-props" | "auto-play" | "click-dot" | "click-thumb" | "click-prev" | "click-next" | "swipe-prev" | "swipe-next"  | "key-next" | "key-prev";

export type CarouselCallback = (index: number, item: React.ReactNode) => void;
export type CarouselChangeCallback = (index: number, item: React.ReactNode, srcType: srcType) => void;

export type StatusFormatter = (current: number, total: number) => string;

export interface CarouselProps {
    className?: string;
    showArrows?: boolean;
    showStatus?: boolean;
    showIndicators?: boolean;
    showThumbs?: boolean;
    infiniteLoop?: boolean;
    selectedItem?: number;
    axis?: Axis;
    onChange?: CarouselChangeCallback;
    onUserChange?: CarouselChangeCallback;
    onClickItem?: CarouselCallback;
    onClickThumb?: CarouselCallback;
    width?: string;
    useKeyboardArrows?: boolean;
    autoPlay?: boolean;
    stopOnHover?: boolean;
    interval?: number;
    transitionTime?: number;
    swipeable?: boolean;
    swipeScrollTolerance?: number;
    dynamicHeight?: boolean;
    emulateTouch?: boolean;
    statusFormatter?: StatusFormatter;
    children?: React.ReactNode;
    centerMode?:boolean;
    centerSlidePercentage?:number;
}

export interface CarouselState {
    initialized: boolean;
    selectedItem: number;
    hasMount: boolean;
    itemSize: number;
    wrapperSize: number;
    cancelClick: boolean;
    swiping: boolean;
    autoPlay: boolean;
}

export class Carousel extends React.Component<CarouselProps, CarouselState> {
    constructor(props: CarouselProps, context: any);
    render(): JSX.Element;
}

export interface ThumbsProps {
    transitionTime?: number;
    selectedItem?: number;
    axis?: Axis;
}

export interface ThumbState {
    initialized: boolean;
    selectedItem: number;
    hasMount: boolean;
    firstItem: number;
    images?: HTMLImageElement[];
}

export class Thumbs extends React.Component<ThumbsProps, ThumbState> {
    constructor(props: ThumbsProps, context: any);
    render(): JSX.Element;
}
