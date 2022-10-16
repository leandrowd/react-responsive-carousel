import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount, ReactWrapper } from 'enzyme';
import renderer from 'react-test-renderer';
import * as index from '../index';
import Swipe, { SwipeProps as ReactEasySwipeProps } from 'react-easy-swipe';
import Carousel from '../components/Carousel';
import Thumbs from '../components/Thumbs';
import getDocument from '../shims/document';
import getWindow from '../shims/window';
import {
    CarouselProps,
    AnimationHandler,
    SwipeAnimationHandler,
    StopSwipingHandler,
} from '../components/Carousel/types';
import { getPosition } from '../components/Carousel/utils';
import { slideSwipeAnimationHandler } from '../components/Carousel/animations';

const findDOMNodeWithinWrapper = (wrapper: ReactWrapper, domNode: HTMLElement) => {
    return wrapper.findWhere((n) => n.getDOMNode() === domNode).simulate('click');
};

describe('Slider', function() {
    jest.autoMockOff();

    let window: Window;
    let document: Document;
    let component: ReactWrapper;
    let componentInstance: any;
    let totalChildren: number;
    let lastItemIndex: number;
    const animationHandler: AnimationHandler = jest.fn();
    const swipeAnimationHandler: SwipeAnimationHandler = jest.fn(slideSwipeAnimationHandler);
    const stopSwipingHandler: StopSwipingHandler = jest.fn();

    const bootstrap = (props: Partial<CarouselProps>, children: CarouselProps['children']) => {
        window = getWindow();
        document = getDocument();

        component = mount<Partial<CarouselProps>>(<Carousel {...props}>{children}</Carousel>);

        componentInstance = component.instance();

        totalChildren = children ? React.Children.count(componentInstance.props.children) : 0;
        lastItemIndex = Math.max(totalChildren - 1, 0);
    };

    const baseChildren = [
        <img src="assets/1.jpeg" key="1" />,
        <img src="assets/2.jpeg" key="2" />,
        <img src="assets/3.jpeg" key="3" />,
        <img src="assets/4.jpeg" key="4" />,
        <img src="assets/5.jpeg" key="5" />,
        <img src="assets/6.jpeg" key="6" />,
        <img src="assets/7.jpeg" key="7" />,
    ];

    const renderDefaultComponent = ({ children = baseChildren, ...props }: Partial<CarouselProps>) => {
        props = { animationHandler, swipeAnimationHandler, stopSwipingHandler, ...props };
        bootstrap(props, children);
    };

    const renderForSnapshot = (props: Partial<CarouselProps>, children: CarouselProps['children']) => {
        return renderer.create(<Carousel {...props}>{children}</Carousel>).toJSON();
    };

    beforeEach(() => {
        renderDefaultComponent({});
    });

    describe('Exports', () => {
        it('should export Carousel from the main index file', () => {
            expect(index.Carousel).toBe(Carousel);
        });
        it('should export Thumbs from the main index file', () => {
            expect(index.Thumbs).toBe(Thumbs);
        });
    });

    describe('Basics', () => {
        describe('DisplayName', () => {
            it('should be Carousel', () => {
                expect(Carousel.displayName).toBe('Carousel');
            });
        });

        describe('Default Props', () => {
            describe('values', () => {
                const props: Partial<CarouselProps> = {
                    axis: 'horizontal',
                    centerSlidePercentage: 80,
                    interval: 3000,
                    labels: {
                        leftArrow: 'previous slide / item',
                        rightArrow: 'next slide / item',
                        item: 'slide item',
                    },
                    selectedItem: 0,
                    showArrows: true,
                    showIndicators: true,
                    showStatus: true,
                    showThumbs: true,
                    stopOnHover: true,
                    swipeScrollTolerance: 5,
                    swipeable: true,
                    transitionTime: 350,
                    verticalSwipe: 'standard',
                    width: '100%',
                };

                Object.keys(props).forEach((prop) => {
                    it(`should have ${prop} as ${props[prop as keyof CarouselProps]}`, () => {
                        expect(component.prop(prop)).toBeDefined();
                        expect(component.prop(prop)).toEqual(props[prop as keyof CarouselProps]);
                    });
                });
            });

            describe('methods', () => {
                it('renderArrowPrev should return a button', () => {
                    expect(componentInstance.props.renderArrowPrev!(jest.fn(), true, 'prev')).toMatchSnapshot();
                });

                it('renderArrowNext should return a button', () => {
                    expect(componentInstance.props.renderArrowNext!(jest.fn(), true, 'next')).toMatchSnapshot();
                });

                it('renderIndicator should return a list item', () => {
                    expect(componentInstance.props.renderIndicator!(jest.fn(), true, 0, 'slide')).toMatchSnapshot();
                });

                it('renderItem should pass through the item', () => {
                    expect(componentInstance.props.renderItem!(<div>item</div>)).toMatchSnapshot();
                });

                it('renderThumbs should return a list of images extracted from the children', () => {
                    expect(
                        componentInstance.props.renderThumbs!([
                            <li>
                                <img src="assets/1.jpeg" key="1" />
                                <p>Legend 1</p>
                            </li>,
                            <li>
                                <img src="assets/2.jpeg" key="2" />
                                <p>Legend 2</p>
                            </li>,
                            <li>
                                <img src="assets/3.jpeg" key="3" />
                                <p>Legend 3</p>
                            </li>,
                            <li>
                                <img src="assets/4.jpeg" key="4" />
                                <p>Legend 4</p>
                            </li>,
                            <li>
                                <img src="assets/5.jpeg" key="5" />
                                <p>Legend 5</p>
                            </li>,
                            <li>
                                <img src="assets/6.jpeg" key="6" />
                                <p>Legend 6</p>
                            </li>,
                            <li>
                                <img src="assets/7.jpeg" key="7" />
                                <p>Legend 7</p>
                            </li>,
                        ])
                    ).toMatchSnapshot();
                });

                it('statusFormatter should return a string', () => {
                    expect(componentInstance.props.statusFormatter!(1, 3)).toEqual('1 of 3');
                });
            });
        });

        describe('Initial State', () => {
            const props = {
                selectedItem: 0,
                hasMount: false,
            };

            Object.entries(props).forEach((key, value) => {
                it(`should have ${key} as ${value}`, () => {
                    expect(component.state('selectedItem')).toBe(0);
                    expect(component.state('hasMount')).toBe(false);
                });
            });
        });

        describe('Different child types', () => {
            it('should handle single element', () => {
                <Carousel>{baseChildren[0]}</Carousel>;
            });
            it('should handle JSX.Element[]', () => {
                <Carousel>{baseChildren}</Carousel>;
            });
        });
    });

    describe('componentDidMount', () => {
        it('should bind the events', () => {
            componentInstance.bindEvents = jest.fn();
            componentInstance.componentDidMount();
            expect(componentInstance.bindEvents).toHaveBeenCalledTimes(1);
        });

        it('should not bind the events if there are no children', () => {
            bootstrap({}, undefined);
            componentInstance.bindEvents = jest.fn();
            componentInstance.componentDidMount();
            expect(componentInstance.bindEvents).not.toHaveBeenCalled();
        });

        it('should bind the events if children were lazy loaded (through componentDidUpdate)', () => {
            bootstrap({}, undefined);
            componentInstance.bindEvents = jest.fn();
            expect(componentInstance.bindEvents).not.toHaveBeenCalled();

            component.setProps({
                children: [<img src="assets/1.jpeg" key="1" />],
            });

            expect(componentInstance.bindEvents).toHaveBeenCalledTimes(1);
        });
    });

    describe('componentDidUpdate', () => {
        it('should unbind the events', () => {
            componentInstance.setState({ swiping: false });
            componentInstance.componentDidUpdate({}, { swiping: true });
            expect(stopSwipingHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe('componentWillUnmount', () => {
        beforeEach(() => {
            componentInstance.unbindEvents = jest.fn();
            componentInstance.componentWillUnmount();
        });
        it('should unbind the events', () => {
            expect(componentInstance.unbindEvents).toHaveBeenCalledTimes(1);
        });
    });

    describe('bindEvents', () => {
        describe('when useKeyboardArrows is false', () => {
            beforeEach(() => {
                window.addEventListener = jest.fn();
                document.addEventListener = jest.fn();
                componentInstance.bindEvents();
            });

            it('should bind resize to updateSizes', () => {
                expect(window.addEventListener).toHaveBeenCalledWith('resize', componentInstance.updateSizes);
            });

            it('should bind DOMContentLoaded to updateSizes', () => {
                expect(window.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', componentInstance.updateSizes);
            });

            it('should not bind keydown to navigateWithKeyboard', () => {
                expect(document.addEventListener).not.toHaveBeenCalledWith(
                    'keydown',
                    componentInstance.navigateWithKeyboard
                );
            });
        });

        describe('when useKeyboardArrows is true', () => {
            beforeEach(() => {
                renderDefaultComponent({
                    useKeyboardArrows: true,
                });

                window.addEventListener = jest.fn();
                document.addEventListener = jest.fn();
                componentInstance.bindEvents();
            });

            it('should bind resize to updateSizes', () => {
                expect(window.addEventListener).toHaveBeenCalledWith('resize', componentInstance.updateSizes);
            });

            it('should bind DOMContentLoaded to updateSizes', () => {
                expect(window.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', componentInstance.updateSizes);
            });

            it('should bind keydown to navigateWithKeyboard', () => {
                expect(document.addEventListener).toHaveBeenCalledWith(
                    'keydown',
                    componentInstance.navigateWithKeyboard
                );
            });
        });
    });

    describe('unbindEvents', () => {
        describe('when useKeyboardArrows is false', () => {
            beforeEach(() => {
                window.removeEventListener = jest.fn();
                document.removeEventListener = jest.fn();
                componentInstance.unbindEvents();
            });

            it('should unbind resize to updateSizes', () => {
                expect(window.removeEventListener).toHaveBeenCalledWith('resize', componentInstance.updateSizes);
            });

            it('should unbind DOMContentLoaded to updateSizes', () => {
                expect(window.removeEventListener).toHaveBeenCalledWith(
                    'DOMContentLoaded',
                    componentInstance.updateSizes
                );
            });

            it('should not unbind keydown to navigateWithKeyboard', () => {
                expect(document.removeEventListener).not.toHaveBeenCalledWith(
                    'keydown',
                    componentInstance.navigateWithKeyboard
                );
            });

            it('should not set a tabIndex on the carousel-root', () => {
                expect(component.find('.carousel-root[tabIndex=0]').length).toBe(0);
            });
        });

        describe('when useKeyboardArrows is true', () => {
            beforeEach(() => {
                renderDefaultComponent({
                    useKeyboardArrows: true,
                });

                window.removeEventListener = jest.fn();
                document.removeEventListener = jest.fn();
                componentInstance.unbindEvents();
            });

            it('should unbind resize to updateSizes', () => {
                expect(window.removeEventListener).toHaveBeenCalledWith('resize', componentInstance.updateSizes);
            });

            it('should unbind DOMContentLoaded to updateSizes', () => {
                expect(window.removeEventListener).toHaveBeenCalledWith(
                    'DOMContentLoaded',
                    componentInstance.updateSizes
                );
            });

            it('should unbind keydown to navigateWithKeyboard', () => {
                expect(document.removeEventListener).toHaveBeenCalledWith(
                    'keydown',
                    componentInstance.navigateWithKeyboard
                );
            });

            it('should set a tabIndex on the carousel-root', () => {
                expect(component.find('.carousel-root[tabIndex=0]').length).toBe(1);
            });
        });
    });

    describe('getInitialImage', () => {
        it('Returns the first image within the declared selected item', () => {
            renderDefaultComponent({
                selectedItem: 2,
            });

            const initialImage = componentInstance.getInitialImage();
            const expectedMatchingImageComponent = baseChildren[2];

            expect(initialImage.src.endsWith(expectedMatchingImageComponent.props.src)).toEqual(true);
        });
    });

    describe('navigateWithKeyboard', () => {
        const setActiveElement = (element: HTMLElement) => {
            (document.activeElement as any) = element;
        };

        beforeEach(() => {
            // jsdom has issues with activeElement so we are hacking it for this specific scenario
            Object.defineProperty(document, 'activeElement', {
                writable: true,
            });
        });

        describe('Axis === horizontal', () => {
            beforeEach(() => {
                renderDefaultComponent({
                    axis: 'horizontal',
                    useKeyboardArrows: true,
                });

                componentInstance.increment = jest.fn();
                componentInstance.decrement = jest.fn();
            });

            it('should not navigate if the focus is outside of the carousel', () => {
                componentInstance.navigateWithKeyboard({ keyCode: 39 });
                componentInstance.navigateWithKeyboard({ keyCode: 37 });

                expect(componentInstance.increment).not.toHaveBeenCalled();
                expect(componentInstance.decrement).not.toHaveBeenCalled();
            });

            it('should call only increment on ArrowRight (39)', () => {
                setActiveElement(componentInstance.carouselWrapperRef);

                componentInstance.navigateWithKeyboard({ keyCode: 39 });

                expect(componentInstance.increment).toHaveBeenCalledTimes(1);
                expect(componentInstance.decrement).not.toHaveBeenCalled();
            });

            it('should call only decrement on ArrowLeft (37)', () => {
                setActiveElement(componentInstance.carouselWrapperRef);

                componentInstance.navigateWithKeyboard({ keyCode: 37 });

                expect(componentInstance.decrement).toHaveBeenCalledTimes(1);
                expect(componentInstance.increment).not.toHaveBeenCalled();
            });

            it('should not call increment on ArrowDown (40)', () => {
                setActiveElement(componentInstance.carouselWrapperRef);

                componentInstance.navigateWithKeyboard({ keyCode: 40 });

                expect(componentInstance.increment).not.toHaveBeenCalled();
                expect(componentInstance.decrement).not.toHaveBeenCalled();
            });

            it('should not call decrement on ArrowUp (38)', () => {
                setActiveElement(componentInstance.carouselWrapperRef);

                componentInstance.navigateWithKeyboard({ keyCode: 38 });

                expect(componentInstance.decrement).not.toHaveBeenCalled();
                expect(componentInstance.increment).not.toHaveBeenCalled();
            });
        });

        describe('Axis === vertical', () => {
            beforeEach(() => {
                renderDefaultComponent({
                    axis: 'vertical',
                    useKeyboardArrows: true,
                });

                componentInstance.increment = jest.fn();
                componentInstance.decrement = jest.fn();
            });

            it('should not navigate if the focus is outside of the carousel', () => {
                componentInstance.navigateWithKeyboard({ keyCode: 40 });
                componentInstance.navigateWithKeyboard({ keyCode: 38 });

                expect(componentInstance.increment).not.toHaveBeenCalled();
                expect(componentInstance.decrement).not.toHaveBeenCalled();
            });

            it('should call only increment on ArrowDown (40)', () => {
                setActiveElement(componentInstance.carouselWrapperRef);
                componentInstance.navigateWithKeyboard({ keyCode: 40 });

                expect(componentInstance.increment).toHaveBeenCalledTimes(1);
                expect(componentInstance.decrement).not.toHaveBeenCalled();
            });

            it('should call only decrement on ArrowUp (38)', () => {
                setActiveElement(componentInstance.carouselWrapperRef);
                componentInstance.navigateWithKeyboard({ keyCode: 38 });

                expect(componentInstance.decrement).toHaveBeenCalledTimes(1);
                expect(componentInstance.increment).not.toHaveBeenCalled();
            });

            it('should not call increment on ArrowRight (39)', () => {
                setActiveElement(componentInstance.carouselWrapperRef);
                componentInstance.navigateWithKeyboard({ keyCode: 39 });

                expect(componentInstance.increment).not.toHaveBeenCalled();
                expect(componentInstance.decrement).not.toHaveBeenCalled();
            });

            it('should not call decrement on ArrowLeft (37)', () => {
                setActiveElement(componentInstance.carouselWrapperRef);
                componentInstance.navigateWithKeyboard({ keyCode: 37 });

                expect(componentInstance.decrement).not.toHaveBeenCalled();
                expect(componentInstance.increment).not.toHaveBeenCalled();
            });
        });
    });

    describe('changeItem', () => {
        beforeEach(() => {
            componentInstance.selectItem = jest.fn();
            componentInstance.getFirstItem = jest.fn().mockReturnValue(2);
            componentInstance.changeItem(1)();
        });

        it('should call selectItem sending selectedItem as 1', () => {
            expect(componentInstance.selectItem.mock.calls[0][0]).toEqual({
                selectedItem: 1,
            });
        });
    });

    describe('selectItem', () => {
        beforeEach(() => {
            componentInstance.setState = jest.fn();
            componentInstance.handleOnChange = jest.fn();
            componentInstance.selectItem({
                selectedItem: 1,
                ramdomNumber: 2,
            });
        });

        it('should call setState sending the argument received, with previousItem', () => {
            expect(componentInstance.setState.mock.calls[0][0]).toEqual({
                previousItem: 0,
                selectedItem: 1,
                ramdomNumber: 2,
            });
        });

        it('should call handleOnChange sending only selectedItem', () => {
            expect(componentInstance.handleOnChange.mock.calls[0][0]).toBe(1);
        });
    });

    it('should add a thumb-wrapper container', () => {
        expect(component.find('.thumbs-wrapper').length).toBe(1);
    });

    it('should insert aria-label if provided', () => {
        const ariaLabel = 'Carousel title';
        renderDefaultComponent({ ariaLabel });
        expect(component.find(`[aria-label="${ariaLabel}"]`)).toBeTruthy();
    });

    describe('Moving', () => {
        beforeEach(() => {
            componentInstance.showArrows = true;
            componentInstance.lastPosition = 3;
            componentInstance.visibleItems = 3;
        });

        it('should set the selectedItem from the props', () => {
            renderDefaultComponent({ selectedItem: 3 });
            expect(componentInstance.state.selectedItem).toBe(3);
        });

        it('should update the position of the Carousel if selectedItem is changed', () => {
            findDOMNodeWithinWrapper(component, componentInstance.itemsRef[2]).simulate('click');
            expect(componentInstance.state.selectedItem).toBe(2);

            findDOMNodeWithinWrapper(component, componentInstance.itemsRef[3]).simulate('click');
            expect(componentInstance.state.selectedItem).toBe(3);
        });
    });

    describe('Selecting', () => {
        it('should set the index as selectedItem when clicked', () => {
            expect(componentInstance.state.selectedItem).toBe(0);

            findDOMNodeWithinWrapper(component, componentInstance.itemsRef[1]).simulate('click');
            expect(componentInstance.state.selectedItem).toBe(1);

            findDOMNodeWithinWrapper(component, componentInstance.itemsRef[3]).simulate('click');
            expect(componentInstance.state.selectedItem).toBe(3);
        });

        it('should call a given onSelectItem function when an item is clicked', () => {
            var mockedFunction = jest.fn();

            renderDefaultComponent({ onClickItem: mockedFunction });

            findDOMNodeWithinWrapper(component, componentInstance.itemsRef[1]).simulate('click');
            expect(mockedFunction).toBeCalled();

            findDOMNodeWithinWrapper(component, componentInstance.itemsRef[0]).simulate('click');
            expect(componentInstance.state.selectedItem).toBe(0);
        });

        it('should call onSelectItem function when exactly 1 child is present', () => {
            var mockedFunction = jest.fn();

            renderDefaultComponent({
                children: [<img src="assets/1.jpeg" key="1" />],
                onClickItem: mockedFunction,
            });
            expect(componentInstance.state.selectedItem).toBe(0);

            findDOMNodeWithinWrapper(component, componentInstance.itemsRef[0]).simulate('click');
            expect(componentInstance.state.selectedItem).toBe(0);
            expect(mockedFunction).toBeCalled();
        });
    });

    const findDOMNodeByClass = (instance: any, classNames: string) =>
        (ReactDOM.findDOMNode(instance)! as HTMLElement).querySelectorAll(classNames);

    describe('Navigating', () => {
        beforeEach(() => {
            componentInstance.showArrows = true;
        });

        it('should disable the left arrow if we are showing the first item', () => {
            findDOMNodeWithinWrapper(component, componentInstance.itemsRef[0]).simulate('click');
            expect(
                findDOMNodeByClass(componentInstance, '.carousel-slider .control-prev.control-disabled')
            ).toHaveLength(1);
        });

        it('should enable the left arrow if we are showing other than the first item', () => {
            findDOMNodeWithinWrapper(component, componentInstance.itemsRef[1]).simulate('click');
            expect(
                findDOMNodeByClass(componentInstance, '.carousel-slider .control-prev.control-disabled')
            ).toHaveLength(0);
        });

        it('should disable the right arrow if we reach the lastPosition', () => {
            findDOMNodeWithinWrapper(component, componentInstance.itemsRef[1]).simulate('click');
            expect(
                findDOMNodeByClass(componentInstance, '.carousel-slider .control-next.control-disabled')
            ).toHaveLength(0);

            findDOMNodeWithinWrapper(component, componentInstance.itemsRef[6]).simulate('click');
            expect(
                findDOMNodeByClass(componentInstance, '.carousel-slider .control-next.control-disabled')
            ).toHaveLength(1);
        });
    });

    describe('Infinite Loop', () => {
        beforeEach(() => {
            renderDefaultComponent({
                infiniteLoop: true,
            });
        });

        it('should enable the prev arrow if we are showing the first item', () => {
            findDOMNodeWithinWrapper(component, componentInstance.itemsRef[0]).simulate('click');
            expect(
                findDOMNodeByClass(componentInstance, '.carousel-slider .control-prev.control-disabled')
            ).toHaveLength(0);
        });

        it('should enable the right arrow if we reach the lastPosition', () => {
            findDOMNodeWithinWrapper(component, componentInstance.itemsRef[6]).simulate('click');
            expect(
                findDOMNodeByClass(componentInstance, '.carousel-slider .control-next.control-disabled')
            ).toHaveLength(0);
        });

        it('should move to the first one if increment was called in the last', () => {
            componentInstance.setState({
                selectedItem: lastItemIndex,
            });

            expect(componentInstance.state.selectedItem).toBe(lastItemIndex);

            componentInstance.increment();

            expect(componentInstance.state.selectedItem).toBe(0);
        });

        it('should move to the last one if decrement was called in the first', () => {
            expect(componentInstance.state.selectedItem).toBe(0);

            componentInstance.decrement();

            expect(componentInstance.state.selectedItem).toBe(lastItemIndex);
        });

        it('should render the clone slides', () => {
            expect(
                component
                    .find('.slide')
                    .at(0)
                    .key()
            ).toContain('itemKey6clone');
            expect(
                component
                    .find('.slide')
                    .at(8)
                    .key()
            ).toContain('itemKey0clone');
        });

        it('should work with minimal children', () => {
            renderDefaultComponent({
                children: [<img src="assets/1.jpeg" key="1" />, <img src="assets/2.jpeg" key="2" />],
                infiniteLoop: true,
            });
            componentInstance.decrement();
            expect(componentInstance.state.selectedItem).toBe(lastItemIndex);

            renderDefaultComponent({
                children: [<img src="assets/1.jpeg" key="1" />],
                infiniteLoop: true,
            });
            componentInstance.decrement();
            expect(componentInstance.state.selectedItem).toBe(lastItemIndex);
        });

        it('should not render any Swipe component with one child', () => {
            renderDefaultComponent({
                children: [<img src="assets/1.jpeg" key="1" />],
                infiniteLoop: true,
            });

            expect(component.find(Swipe).length).toBe(0);
        });
    });

    describe('Auto Play', () => {
        beforeEach(() => {
            jest.useFakeTimers();
            window.addEventListener = jest.fn();

            renderDefaultComponent({
                autoPlay: true,
            });
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should disable when only 1 child is present', () => {
            renderDefaultComponent({
                children: [<img src="assets/1.jpeg" key="1" />],
                autoPlay: true,
            });

            expect(componentInstance.state.selectedItem).toBe(0);

            jest.runOnlyPendingTimers();

            expect(componentInstance.state.selectedItem).toBe(0);
        });

        it('should change items automatically', () => {
            expect(componentInstance.state.selectedItem).toBe(0);

            jest.runOnlyPendingTimers();

            expect(componentInstance.state.selectedItem).toBe(1);

            jest.runOnlyPendingTimers();

            expect(componentInstance.state.selectedItem).toBe(2);
        });

        it('should not move automatically if hovering', () => {
            componentInstance.stopOnHover();

            expect(componentInstance.state.selectedItem).toBe(0);

            jest.runOnlyPendingTimers();

            expect(componentInstance.state.selectedItem).toBe(0);

            componentInstance.autoPlay();

            jest.runOnlyPendingTimers();

            expect(componentInstance.state.selectedItem).toBe(1);
        });

        it('should restart auto-play after disabling it via props', () => {
            expect(componentInstance.state.selectedItem).toBe(0);

            jest.runOnlyPendingTimers();

            expect(componentInstance.state.selectedItem).toBe(1);

            component.setProps({
                autoPlay: false,
            });

            jest.runOnlyPendingTimers();

            expect(componentInstance.state.selectedItem).toBe(1);

            component.setProps({
                autoPlay: true,
            });

            jest.runOnlyPendingTimers();

            expect(componentInstance.state.selectedItem).toBe(2);
        });

        it('should reset when changing the slide through indicator', () => {
            renderDefaultComponent({ interval: 3000, autoPlay: true });
            jest.advanceTimersByTime(2000);

            expect(componentInstance.state.selectedItem).toBe(0);

            const changeToSecondItem = componentInstance.changeItem(1);
            // it only runs with an event
            changeToSecondItem(new MouseEvent('click'));

            jest.advanceTimersByTime(1000);

            expect(componentInstance.state.selectedItem).toBe(1);
        });
    });

    describe('Infinite Loop and Auto Play', () => {
        beforeEach(() => {
            jest.useFakeTimers();
            window.addEventListener = jest.fn();

            renderDefaultComponent({
                children: [
                    <img src="assets/1.jpeg" key="1" />,
                    <img src="assets/2.jpeg" key="2" />,
                    <img src="assets/3.jpeg" key="3" />,
                ],
                infiniteLoop: true,
                autoPlay: true,
            });
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should automatically loop infinitely', () => {
            expect(componentInstance.state.selectedItem).toBe(0);

            jest.runOnlyPendingTimers();

            expect(componentInstance.state.selectedItem).toBe(1);

            jest.runOnlyPendingTimers();

            expect(componentInstance.state.selectedItem).toBe(2);

            jest.runOnlyPendingTimers();

            expect(componentInstance.state.selectedItem).toBe(0);

            jest.runOnlyPendingTimers();

            expect(componentInstance.state.selectedItem).toBe(1);

            jest.runOnlyPendingTimers();

            expect(componentInstance.state.selectedItem).toBe(2);
        });
    });

    describe('Mouse enter/leave', () => {
        describe('onMouseEnter', () => {
            it('should set isMouseEntered to true', () => {
                componentInstance.stopOnHover();
                expect(componentInstance.state.isMouseEntered).toBe(true);
            });

            it('should stop auto play when hovering', () => {
                componentInstance.clearAutoPlay = jest.fn();
                componentInstance.stopOnHover();
                expect(componentInstance.clearAutoPlay).toHaveBeenCalledTimes(1);
            });
        });

        describe('onMouseLeave', () => {
            it('should set isMouseEntered to false', () => {
                componentInstance.startOnLeave();
                expect(componentInstance.state.isMouseEntered).toBe(false);
            });

            it('should start auto play again after hovering', () => {
                componentInstance.autoPlay = jest.fn();
                componentInstance.startOnLeave();
                expect(componentInstance.autoPlay).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('Focus', () => {
        describe('calling forceFocus', () => {
            it('should call carousel wrapper focus', () => {
                componentInstance.carouselWrapperRef.focus = jest.fn();
                componentInstance.forceFocus();
                expect(componentInstance.carouselWrapperRef.focus).toHaveBeenCalledTimes(1);
            });
        });

        describe('AutoFocus === true', () => {
            it('should call forceFocus on componentDidMount', () => {
                const forceFocusSpy = jest.spyOn(Carousel.prototype, 'forceFocus');
                renderDefaultComponent({ autoFocus: true });
                expect(forceFocusSpy).toHaveBeenCalledTimes(1);
                forceFocusSpy.mockReset();
                forceFocusSpy.mockRestore();
            });

            it('should call forceFocus conditionally on componentDidUpdate', () => {
                componentInstance.forceFocus = jest.fn();

                component.setProps({ autoFocus: false });
                expect(componentInstance.forceFocus).toHaveBeenCalledTimes(0);

                component.setProps({ autoFocus: true });
                expect(componentInstance.forceFocus).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('Swiping', () => {
        describe('onSwipeStart', () => {
            it('should set swiping to true', () => {
                componentInstance.onSwipeStart();
                expect(componentInstance.state.swiping).toBe(true);
            });

            it('should call onSwipeStart callback', () => {
                var onSwipeStartFunction = jest.fn();
                renderDefaultComponent({ onSwipeStart: onSwipeStartFunction });

                componentInstance.onSwipeStart();
                expect(onSwipeStartFunction).toBeCalled();
            });
        });

        describe('onSwipeMove', () => {
            beforeEach(() => {
                renderDefaultComponent({ preventMovementUntilSwipeScrollTolerance: true });
            });

            it('should return true to stop scrolling if there was movement in the same direction as the carousel axis', () => {
                expect(
                    componentInstance.onSwipeMove({
                        x: 10,
                        y: 0,
                    })
                ).toBe(true);
            });

            it('should return false to allow scrolling if there was no movement in the same direction as the carousel axis', () => {
                expect(
                    componentInstance.onSwipeMove({
                        x: 0,
                        y: 10,
                    })
                ).toBe(false);
            });

            it('should call the swipeAnimationHandler when onSwipeMove is fired', () => {
                componentInstance.onSwipeMove({
                    x: 10,
                    y: 0,
                });

                expect(swipeAnimationHandler).toHaveBeenCalled();
            });

            it('should call onSwipeMove callback', () => {
                var onSwipeMoveFunction = jest.fn();
                renderDefaultComponent({ onSwipeMove: onSwipeMoveFunction });

                componentInstance.onSwipeMove({ x: 0, y: 10 });
                expect(onSwipeMoveFunction).toHaveBeenCalled();
            });
        });

        describe('onSwipeEnd', () => {
            it('should set swiping to false', () => {
                componentInstance.onSwipeEnd();
                expect(componentInstance.state.swiping).toBe(false);
            });

            it('should stop autoplay', () => {
                componentInstance.clearAutoPlay = jest.fn();
                componentInstance.onSwipeEnd();
                expect(componentInstance.clearAutoPlay).toHaveBeenCalledTimes(1);
            });

            it('should not start autoplay again', () => {
                componentInstance.autoPlay = jest.fn();
                componentInstance.onSwipeEnd();
                expect(componentInstance.autoPlay).toHaveBeenCalledTimes(0);
            });

            it('should start autoplay again when autoplay is true', () => {
                renderDefaultComponent({ autoPlay: true });
                componentInstance.autoPlay = jest.fn();
                componentInstance.onSwipeEnd();
                expect(componentInstance.autoPlay).toHaveBeenCalledTimes(1);
            });
            it('should call onSwipeEnd callback', () => {
                var onSwipeEndFunction = jest.fn();
                renderDefaultComponent({ onSwipeEnd: onSwipeEndFunction });

                componentInstance.onSwipeEnd();
                expect(onSwipeEndFunction).toBeCalled();
            });
        });

        describe("verticalSwipe === 'standard'", () => {
            it('should pass the correct props to <Swipe />', () => {
                renderDefaultComponent({
                    axis: 'vertical',
                });

                const swipeProps: ReactEasySwipeProps = component
                    .find(Swipe)
                    .first()
                    .props();

                expect(swipeProps.onSwipeUp).toBe(componentInstance.onSwipeForward);
                expect(swipeProps.onSwipeDown).toBe(componentInstance.onSwipeBackwards);
            });
        });

        describe("verticalSwipe === 'natural'", () => {
            it('should pass the correct props to <Swipe />', () => {
                renderDefaultComponent({
                    axis: 'vertical',
                    verticalSwipe: 'natural',
                });

                const swipeProps: ReactEasySwipeProps = component
                    .find(Swipe)
                    .first()
                    .props();

                expect(swipeProps.onSwipeUp).toBe(componentInstance.onSwipeBackwards);
                expect(swipeProps.onSwipeDown).toBe(componentInstance.onSwipeForward);
            });
        });

        describe('emulateTouch', () => {
            it('should cancel click when swipe forward and backwards with emulated touch', () => {
                renderDefaultComponent({
                    emulateTouch: true,
                });

                let currentIndex = componentInstance.state.selectedItem;
                const items = componentInstance.props.children;

                componentInstance.onSwipeForward();
                componentInstance.handleClickItem(currentIndex, items[currentIndex]);
                ++currentIndex;

                expect(componentInstance.state.selectedItem).toEqual(currentIndex);

                componentInstance.onSwipeBackwards();
                componentInstance.handleClickItem(currentIndex, items[currentIndex]);
                --currentIndex;

                expect(componentInstance.state.selectedItem).toEqual(currentIndex);
            });
        });
    });

    describe('center mode', () => {
        beforeEach(() => {
            renderDefaultComponent({
                centerMode: true,
            });
        });

        describe('getPosition', () => {
            it('should return regular tranform calculation for vertical axis', () => {
                renderDefaultComponent({
                    centerMode: true,
                    axis: 'vertical',
                });
                const props = componentInstance.props;

                expect(getPosition(0, props)).toBe(0);
                expect(getPosition(1, props)).toBe(-100);
                expect(getPosition(2, props)).toBe(-200);
                expect(getPosition(3, props)).toBe(-300);
                expect(getPosition(4, props)).toBe(-400);
                expect(getPosition(5, props)).toBe(-500);
                expect(getPosition(6, props)).toBe(-600);
            });

            it('should return padded transform calculation for horizontal axis', () => {
                const props = componentInstance.props;
                expect(getPosition(0, props)).toBe(0);
                expect(getPosition(1, props)).toBe(-70);
                expect(getPosition(2, props)).toBe(-150);
                expect(getPosition(3, props)).toBe(-230);
                expect(getPosition(4, props)).toBe(-310);
                expect(getPosition(5, props)).toBe(-390);
                // last one takes up more space
                expect(getPosition(6, props)).toBe(-460);
            });

            it('should return padded tranform calculation for custom centerSlidePercentage', () => {
                renderDefaultComponent({
                    centerMode: true,
                    centerSlidePercentage: 50,
                });

                const props = componentInstance.props;

                expect(getPosition(0, props)).toBe(0);
                expect(getPosition(1, props)).toBe(-25);
                expect(getPosition(2, props)).toBe(-75);
                expect(getPosition(3, props)).toBe(-125);
                expect(getPosition(4, props)).toBe(-175);
                expect(getPosition(5, props)).toBe(-225);
                expect(getPosition(6, props)).toBe(-250);
            });
        });

        describe('slide style', () => {
            it('should have a min-width of 80%', () => {
                const slide = shallow(component.find('.slide').get(0));
                expect(slide.prop('style')).toHaveProperty('minWidth', '80%');
            });

            it('should have min-width defined by centerSlidePercentage', () => {
                renderDefaultComponent({
                    centerMode: true,
                    centerSlidePercentage: 50,
                });
                const slide = shallow(component.find('.slide').get(0));
                expect(slide.prop('style')).toHaveProperty('minWidth', '50%');
            });

            it('should not be present for vertical axis', () => {
                renderDefaultComponent({
                    centerMode: true,
                    axis: 'vertical',
                });
                const slide = shallow(component.find('.slide').get(0));
                expect(slide.prop('style')).toEqual({});
            });
        });
    });

    describe('Snapshots', () => {
        it('default', () => {
            expect(renderForSnapshot({}, baseChildren)).toMatchSnapshot();
        });

        it('no thumbs', () => {
            expect(
                renderForSnapshot(
                    {
                        showThumbs: false,
                    },
                    baseChildren
                )
            ).toMatchSnapshot();
        });

        it('no arrows', () => {
            expect(
                renderForSnapshot(
                    {
                        showArrows: false,
                    },
                    baseChildren
                )
            ).toMatchSnapshot();
        });

        it('no indicators', () => {
            expect(
                renderForSnapshot(
                    {
                        showIndicators: false,
                    },
                    baseChildren
                )
            ).toMatchSnapshot();
        });

        it('no indicators', () => {
            expect(
                renderForSnapshot(
                    {
                        showStatus: false,
                    },
                    baseChildren
                )
            ).toMatchSnapshot();
        });

        it('custom class name', () => {
            expect(
                renderForSnapshot(
                    {
                        className: 'my-custom-carousel',
                    },
                    baseChildren
                )
            ).toMatchSnapshot();
        });

        it('custom width', () => {
            expect(
                renderForSnapshot(
                    {
                        width: '700px',
                    },
                    baseChildren
                )
            ).toMatchSnapshot();
        });

        it('vertical axis', () => {
            expect(
                renderForSnapshot(
                    {
                        axis: 'vertical',
                    },
                    baseChildren
                )
            ).toMatchSnapshot();
        });

        it('no children at mount', () => {
            expect(renderForSnapshot({}, undefined)).toMatchSnapshot();
        });

        it('center mode', () => {
            expect(
                renderForSnapshot(
                    {
                        centerMode: true,
                    },
                    baseChildren
                )
            ).toMatchSnapshot();
        });

        it('swipeable false', () => {
            expect(
                renderForSnapshot(
                    {
                        swipeable: false,
                    },
                    baseChildren
                )
            ).toMatchSnapshot();
        });

        it('infinite loop', () => {
            expect(
                renderForSnapshot(
                    {
                        infiniteLoop: true,
                    },
                    baseChildren
                )
            ).toMatchSnapshot();
        });
    });

    jest.autoMockOn();
});
