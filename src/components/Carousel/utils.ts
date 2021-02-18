export const noop = () => {};

export const defaultStatusFormatter = (current: number, total: number) => `${current} of ${total}`;

export const isKeyboardEvent = (e?: React.MouseEvent | React.KeyboardEvent): e is React.KeyboardEvent =>
    e ? e.hasOwnProperty('key') : false;
