import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';

describe("Slider", function() {
	jest.autoMockOff();

	const Carousel = require('../components/Carousel');

	let component, componentInstance, totalChildren, lastItemIndex;

	const renderComponent = props => {
		component = mount(
	  		<Carousel {...props}>
	  			<img src="assets/1.jpeg" />
				<img src="assets/2.jpeg" />
				<img src="assets/3.jpeg" />
				<img src="assets/4.jpeg" />
				<img src="assets/5.jpeg" />
				<img src="assets/6.jpeg" />
				<img src="assets/7.jpeg" />
	  		</Carousel>
	  	);

        componentInstance = component.instance();

        totalChildren = componentInstance.props.children.length;
        lastItemIndex = totalChildren - 1;
	}

	beforeEach(() => {
		renderComponent({});
	});

  	describe("Basics", () => {
        describe("DisplayName", () => {
            it('should be Carousel', () => {
                expect(Carousel.displayName).toBe('Carousel');
            });
        });

        describe("Default Props", () => {
            const props = {
                showIndicators: true,
                showArrows: true,
                showStatus:true,
                showThumbs:true,
                infiniteLoop: false,
                selectedItem: 0,
                axis: 'horizontal',
                useKeyboardArrows: false,
                autoPlay: false,
                stopOnHover: true,
                interval: 3000,
                transitionTime: 350,
                swipeScrollTolerance: 5,
                dynamicHeight: false,
                emulateTouch: false
            };

            Object.keys(props).forEach(prop => {
                it(`should have ${prop} as ${props[prop]}`, () => {
                    expect(componentInstance.props[prop]).toBe(props[prop]);
                });
            });
        });

        describe("Initial State", () => {
            const props = {
                selectedItem: 0,
                hasMount: false
            };

            Object.keys(props).forEach(prop => {
                it(`should have ${prop} as ${props[prop]}`, () => {
                    expect(componentInstance.state.selectedItem).toBe(0);
                    expect(componentInstance.state.hasMount).toBe(false);
                });
            });
        });
  	});

    describe("componentDidMount", () => {
        beforeEach(() => {
            componentInstance.bindEvents = jest.genMockFunction();
            componentInstance.componentDidMount();

        });
        it("should bind the events", () => {
            expect(componentInstance.bindEvents.mock.calls.length).toBe(1);
        });
    });

    describe("componentWillUnmount", () => {
        beforeEach(() => {
            componentInstance.unbindEvents = jest.genMockFunction();
            componentInstance.componentWillUnmount();

        });
        it("should unbind the events", () => {
            expect(componentInstance.unbindEvents.mock.calls.length).toBe(1);
        });
    });

    describe("bindEvents", () => {
        describe("when useKeyboardArrows is false", () => {
            beforeEach(() => {
                window.addEventListener = jest.genMockFunction();
                document.addEventListener = jest.genMockFunction();
                componentInstance.bindEvents();
            });

            it("should bind resize to updateSizes", () => {
                expect(window.addEventListener.mock.calls[0]).toEqual(['resize', componentInstance.updateSizes]);
            });

            it("should bind DOMContentLoaded to updateSizes", () => {
                expect(window.addEventListener.mock.calls[1]).toEqual(['DOMContentLoaded', componentInstance.updateSizes]);
            });

            it("should not bind keydown to navigateWithKeyboard", () => {
                expect(document.addEventListener.mock.calls.length).toBe(0);
            });
        });

        describe("when useKeyboardArrows is true", () => {
            beforeEach(() => {
                renderComponent({
                    useKeyboardArrows: true
                });

                window.addEventListener = jest.genMockFunction();
                document.addEventListener = jest.genMockFunction();
                componentInstance.bindEvents();
            });

            it("should bind resize to updateSizes", () => {
                expect(window.addEventListener.mock.calls[0]).toEqual(['resize', componentInstance.updateSizes]);
            });

            it("should bind DOMContentLoaded to updateSizes", () => {
                expect(window.addEventListener.mock.calls[1]).toEqual(['DOMContentLoaded', componentInstance.updateSizes]);
            });

            it("should bind keydown to navigateWithKeyboard", () => {
                expect(document.addEventListener.mock.calls[0]).toEqual(['keydown', componentInstance.navigateWithKeyboard]);
            });
        })
    });

    describe("unbindEvents", () => {
        describe("when useKeyboardArrows is false", () => {
            beforeEach(() => {
                window.removeEventListener = jest.genMockFunction();
                document.removeEventListener = jest.genMockFunction();
                componentInstance.unbindEvents();
            });

            it("should unbind resize to updateSizes", () => {
                expect(window.removeEventListener.mock.calls[0]).toEqual(['resize', componentInstance.updateSizes]);
            });

            it("should unbind DOMContentLoaded to updateSizes", () => {
                expect(window.removeEventListener.mock.calls[1]).toEqual(['DOMContentLoaded', componentInstance.updateSizes]);
            });

            it("should not unbind keydown to navigateWithKeyboard", () => {
                expect(document.removeEventListener.mock.calls.length).toBe(0);
            });
        });

        describe("when useKeyboardArrows is true", () => {
            beforeEach(() => {
                renderComponent({
                    useKeyboardArrows: true
                });

                window.removeEventListener = jest.genMockFunction();
                document.removeEventListener = jest.genMockFunction();
                componentInstance.unbindEvents();
            });

            it("should unbind resize to updateSizes", () => {
                expect(window.removeEventListener.mock.calls[0]).toEqual(['resize', componentInstance.updateSizes]);
            });

            it("should unbind DOMContentLoaded to updateSizes", () => {
                expect(window.removeEventListener.mock.calls[1]).toEqual(['DOMContentLoaded', componentInstance.updateSizes]);
            });

            it("should unbind keydown to navigateWithKeyboard", () => {
                expect(document.removeEventListener.mock.calls[0]).toEqual(['keydown', componentInstance.navigateWithKeyboard]);
            });
        })
    });

    describe("navigateWithKeyboard", () => {
        beforeEach(() => {
            renderComponent({
                useKeyboardArrows: true
            });

            componentInstance.increment = jest.genMockFunction();
            componentInstance.decrement = jest.genMockFunction();
        });

        it('should call only increment on ArrowDown', () => {
            componentInstance.navigateWithKeyboard({key: 'ArrowDown'});

            expect(componentInstance.increment.mock.calls.length).toBe(1);
            expect(componentInstance.decrement.mock.calls.length).toBe(0);
        });

        it('should call only increment on ArrowRight', () => {
            componentInstance.navigateWithKeyboard({key: 'ArrowRight'});

            expect(componentInstance.increment.mock.calls.length).toBe(1);
            expect(componentInstance.decrement.mock.calls.length).toBe(0);
        });

        it('should call only decrement on ArrowUp', () => {
            componentInstance.navigateWithKeyboard({key: 'ArrowUp'});

            expect(componentInstance.decrement.mock.calls.length).toBe(1);
            expect(componentInstance.increment.mock.calls.length).toBe(0);
        });

        it('should call only decrement on ArrowLeft', () => {
            componentInstance.navigateWithKeyboard({key: 'ArrowLeft'});

            expect(componentInstance.decrement.mock.calls.length).toBe(1);
            expect(componentInstance.increment.mock.calls.length).toBe(0);
        });
    });

    describe("changeItem", () => {
        beforeEach(() => {
            componentInstance.selectItem = jest.genMockFunction();
            componentInstance.getFirstItem = jest.genMockFunction().mockReturnValue(2);
            componentInstance.changeItem({
                target: {
                    value: 1
                }
            });
        });

        it("should call selectItem sending selectedItem as 1", () => {
            expect(componentInstance.selectItem.mock.calls[0][0]).toEqual({
                selectedItem: 1
            });
        });
    });

    describe("selectItem", () => {
        beforeEach(() => {
            componentInstance.setState = jest.genMockFunction();
            componentInstance.handleOnChange = jest.genMockFunction();
            componentInstance.selectItem({
                selectedItem: 1,
                ramdomNumber: 2
            });
        });

        it("should call setState sending the argument received", () => {
            expect(componentInstance.setState.mock.calls[0][0]).toEqual({
                selectedItem: 1,
                ramdomNumber: 2
            });
        });

        it("should call handleOnChange sending only selectedItem", () => {
            expect(componentInstance.handleOnChange.mock.calls[0][0]).toBe(1);
        });
    });

	it("should add a thumb-wrapper container", () => {
		expect(component.find('.thumbs-wrapper').length).toBe(1);
	});

	describe("Moving", () => {
		beforeEach(() => {
			componentInstance.showArrows = true;
			componentInstance.lastPosition = 3;
			componentInstance.visibleItems = 3;
		});

		it("should set the selectedItem from the props", () => {
			renderComponent({selectedItem: 3});
			expect(componentInstance.state.selectedItem).toBe(3);
		});

		it("should update the position of the Carousel if selectedItem is changed", () => {
			component.ref('item2').simulate('click');
			expect(componentInstance.state.selectedItem).toBe(2);

            component.ref('item3').simulate('click');
			expect(componentInstance.state.selectedItem).toBe(3);
		});
	})

	describe("Selecting", () => {
		it("should set the index as selectedItem when clicked", () => {
			expect(componentInstance.state.selectedItem).toBe(0);

            component.ref('item1').simulate('click');
			expect(componentInstance.state.selectedItem).toBe(1);

            component.ref('item3').simulate('click');
			expect(componentInstance.state.selectedItem).toBe(3);
		});

		it("should call a given onSelectItem function when an item is clicked", () => {
			var mockedFunction = jest.genMockFunction();

			renderComponent({onClickItem: mockedFunction});

            component.ref('item1').simulate('click');
			expect(mockedFunction).toBeCalled();
		});
	})

	describe("Navigating", () => {
		beforeEach(() => {
			componentInstance.showArrows = true;
		});

		it("should disable the left arrow if we are showing the first item", () => {
			component.ref('item0').simulate('click');
			expect(ReactDOM.findDOMNode(componentInstance).querySelectorAll('.carousel-slider .control-prev.control-disabled').length).toBe(1);
		});

		it("should enable the left arrow if we are showing other than the first item", () => {
			component.ref('item1').simulate('click');
			expect(ReactDOM.findDOMNode(componentInstance).querySelectorAll('.carousel-slider .control-prev.control-disabled').length).toBe(0);
		});

		it("should disable the right arrow if we reach the lastPosition", () => {
			component.ref('item1').simulate('click');
			expect(ReactDOM.findDOMNode(componentInstance).querySelectorAll('.carousel-slider .control-next.control-disabled').length).toBe(0);

			component.ref('item6').simulate('click');
			expect(ReactDOM.findDOMNode(componentInstance).querySelectorAll('.carousel-slider .control-next.control-disabled').length).toBe(1);
		});
	});

    describe("Infinite Loop", () => {
        beforeEach(() => {
            renderComponent({
                infiniteLoop: true
            })
        });

        it("should enable the prev arrow if we are showing the first item", () => {
            component.ref('item0').simulate('click');
            expect(ReactDOM.findDOMNode(componentInstance).querySelectorAll('.carousel-slider .control-prev.control-disabled').length).toBe(0);
        });

        it("should enable the right arrow if we reach the lastPosition", () => {
            component.ref('item6').simulate('click');
            expect(ReactDOM.findDOMNode(componentInstance).querySelectorAll('.carousel-slider .control-next.control-disabled').length).toBe(0);
        });

        it('should move to the first one if increment was called in the last', () => {
            componentInstance.setState({
                selectedItem: lastItemIndex
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
    });

    describe('Auto Play', () => {
        beforeEach(() => {
            jest.useFakeTimers();
            window.addEventListener = jest.genMockFunction();

            renderComponent({
                autoPlay: true
            });
        });

        afterEach(() => {
            jest.useRealTimers();
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
    });

    describe('For Mobile', () => {
        describe('onSwipeMove', () => {
            it('should return true to stop scrolling if there was movement in the same direction as the carousel axis', () => {
                expect(componentInstance.onSwipeMove({
                    x: 10,
                    y: 0
                })).toBe(true);
            });

            it('should return false to allow scrolling if there was no movement in the same direction as the carousel axis', () => {
                expect(componentInstance.onSwipeMove({
                    x: 0,
                    y: 10
                })).toBe(false);
            });
        });
    });

	jest.autoMockOn();
});

