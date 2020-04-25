import React from 'react';

export interface ReactEasySwipeProps {
    className?: string;
    tagName?: string;
    style: React.CSSProperties;
    tolerance?: number;
    allowMouseEvents?: boolean;
    onSwipeMove?: (delta: { x: number; y: number }, event: React.TouchEvent) => boolean;
    onSwipeStart?: (event: React.TouchEvent) => void;
    onSwipeEnd?: (event: React.TouchEvent) => void;
    onSwipeLeft?: (positions: number, event: React.TouchEvent) => void;
    onSwipeRight?: (positions: number, event: React.TouchEvent) => void;
    onSwipeUp?: (positions: number, event: React.TouchEvent) => void;
    onSwipeDown?: (positions: number, event: React.TouchEvent) => void;
    innerRef?: React.LegacyRef<HTMLElement>;
}

declare class ReactEasySwipe extends React.Component<ReactEasySwipeProps> {}

export default ReactEasySwipe;
