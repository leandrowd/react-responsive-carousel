import React, { Component } from 'react';
export interface Props {
    axis: 'horizontal' | 'vertical';
    children: React.ReactChild[];
    labels: {
        leftArrow: string;
        rightArrow: string;
        item: string;
    };
    onSelectItem: (index: number, item: React.ReactNode) => void;
    selectedItem: number;
    thumbWidth: number;
    transitionTime: number;
}
interface State {
    selectedItem: number;
    firstItem: number;
    itemSize?: number;
    visibleItems: number;
    lastPosition: number;
    showArrows: boolean;
    swiping: boolean;
}
export default class Thumbs extends Component<Props, State> {
    private itemsWrapperRef?;
    private itemsListRef?;
    private thumbsRef?;
    static displayName: string;
    static defaultProps: {
        axis: string;
        labels: {
            leftArrow: string;
            rightArrow: string;
            item: string;
        };
        selectedItem: number;
        thumbWidth: number;
        transitionTime: number;
    };
    constructor(props: Props);
    componentDidMount(): void;
    UNSAFE_componentWillReceiveProps(props: Props): void;
    componentDidUpdate(prevProps: Props): void;
    componentWillUnmount(): void;
    setItemsWrapperRef: (node: HTMLDivElement) => void;
    setItemsListRef: (node: HTMLUListElement) => void;
    setThumbsRef: (node: HTMLLIElement, index: number) => void;
    setupThumbs(): void;
    destroyThumbs(): void;
    updateSizes: () => void;
    handleClickItem: (index: number, item: React.ReactNode, e: React.MouseEvent | React.KeyboardEvent) => void;
    onSwipeStart: () => void;
    onSwipeEnd: () => void;
    onSwipeMove: (delta: {
        x: number;
        y: number;
    }) => boolean;
    slideRight: (positions?: number | undefined) => void;
    slideLeft: (positions?: number | undefined) => void;
    moveTo: (position: number) => void;
    getFirstItem(selectedItem: number): number;
    renderItems(): JSX.Element[];
    render(): JSX.Element | null;
}
export {};
//# sourceMappingURL=Thumbs.d.ts.map