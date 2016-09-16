var React = require('react');
var TestUtils = require('react-addons-test-utils');
var ReactDOM = require('react-dom');

describe("Slider", function() {
	var findByTag = TestUtils.scryRenderedDOMComponentsWithTag;
	var findByClass = TestUtils.scryRenderedDOMComponentsWithClass;

	jest.autoMockOff();

	var Carousel = require('../components/Carousel');

	var component, componentInstance;

	function renderComponent (props) {
		componentInstance = TestUtils.renderIntoDocument(
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
	}

	beforeEach(function () {
		renderComponent({});
	});

	afterEach(function() {
		if (componentInstance && componentInstance.isMounted()) {
	      // Only components with a parent will be unmounted
	      ReactDOM.unmountComponentAtNode(document);
	    }
  	});

  	describe("Basics", function () {
        describe("DisplayName", () => {
            it('Should be Slider', function () {
                expect(Carousel.displayName).toBe('Slider');
            });
        });

        describe("Default Props", () => {
            var props = {
                showIndicators: true,
                showArrows: true,
                showStatus:true,
                showThumbs:true,
                selectedItem: 0,
                axis: 'horizontal',
                useKeyboardArrows: false
            };

            Object.keys(props).forEach(prop => {
                it(`Should have ${props} as ${props[prop]}`, function () {
                    expect(componentInstance.props[prop]).toBe(props[prop]);
                });
            });
        });

        describe("Initial State", () => {
            var props = {
                selectedItem: 0,
                hasMount: false
            };

            Object.keys(props).forEach(prop => {
                it(`Should have ${props} as ${props[prop]}`, function () {
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
        it("Should bind the events", () => {
            expect(componentInstance.bindEvents.mock.calls.length).toBe(1);
        });
    });

    describe("componentWillUnmount", () => {
        beforeEach(() => {
            componentInstance.unbindEvents = jest.genMockFunction();
            componentInstance.componentWillUnmount();

        });
        it("Should unbind the events", () => {
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

            it("Should bind resize to updateSizes", () => {
                expect(window.addEventListener.mock.calls[0]).toEqual(['resize', componentInstance.updateSizes]);
            });

            it("Should bind DOMContentLoaded to updateSizes", () => {
                expect(window.addEventListener.mock.calls[1]).toEqual(['DOMContentLoaded', componentInstance.updateSizes]);
            });

            it("Should not bind keydown to navigateWithKeyboard", () => {
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

            it("Should bind resize to updateSizes", () => {
                expect(window.addEventListener.mock.calls[0]).toEqual(['resize', componentInstance.updateSizes]);
            });

            it("Should bind DOMContentLoaded to updateSizes", () => {
                expect(window.addEventListener.mock.calls[1]).toEqual(['DOMContentLoaded', componentInstance.updateSizes]);
            });

            it("Should bind keydown to navigateWithKeyboard", () => {
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

            it("Should unbind resize to updateSizes", () => {
                expect(window.removeEventListener.mock.calls[0]).toEqual(['resize', componentInstance.updateSizes]);
            });

            it("Should unbind DOMContentLoaded to updateSizes", () => {
                expect(window.removeEventListener.mock.calls[1]).toEqual(['DOMContentLoaded', componentInstance.updateSizes]);
            });

            it("Should not unbind keydown to navigateWithKeyboard", () => {
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

            it("Should unbind resize to updateSizes", () => {
                expect(window.removeEventListener.mock.calls[0]).toEqual(['resize', componentInstance.updateSizes]);
            });

            it("Should unbind DOMContentLoaded to updateSizes", () => {
                expect(window.removeEventListener.mock.calls[1]).toEqual(['DOMContentLoaded', componentInstance.updateSizes]);
            });

            it("Should unbind keydown to navigateWithKeyboard", () => {
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

    describe("changeItem", function () {
        beforeEach(function () {
            componentInstance.selectItem = jest.genMockFunction();
            componentInstance.getFirstItem = jest.genMockFunction().mockReturnValue(2);
            componentInstance.changeItem({
                target: {
                    value: 1
                }
            });
        });

        it("Should call selectItem sending selectedItem as 1", function () {
            expect(componentInstance.selectItem.mock.calls[0][0]).toEqual({
                selectedItem: 1
            });
        });
    });

    describe("selectItem", function () {
        beforeEach(function () {
            componentInstance.setState = jest.genMockFunction();
            componentInstance.handleOnChange = jest.genMockFunction();
            componentInstance.selectItem({
                selectedItem: 1,
                ramdomNumber: 2
            });
        });

        it("Should call setState sending the argument received", function () {
            expect(componentInstance.setState.mock.calls[0][0]).toEqual({
                selectedItem: 1,
                ramdomNumber: 2
            });
        });

        it("Should call handleOnChange sending only selectedItem", function () {
            expect(componentInstance.handleOnChange.mock.calls[0][0]).toBe(1);
        });
    });

	it("Should add a thumb-wrapper container", function () {
		expect(findByClass(componentInstance, 'thumbs-wrapper').length).toBe(1);
	});

	describe("Moving", function () {
		beforeEach(function () {
			componentInstance.showArrows = true;
			componentInstance.lastPosition = 3;
			componentInstance.visibleItems = 3;
		});

		it("Should set the selectedItem from the props", function () {
			renderComponent({selectedItem: 3});
			expect(componentInstance.state.selectedItem).toBe(3);
		});

		it("Should update the position of the Carousel if selectedItem is changed", function () {
			TestUtils.Simulate.click(componentInstance['item2']);
			expect(componentInstance.state.selectedItem).toBe(2);

			TestUtils.Simulate.click(componentInstance['item3']);
			expect(componentInstance.state.selectedItem).toBe(3);
		});
	})

	describe("Selecting", function () {
		it("Should set the index as selectedItem when clicked", function () {
			expect(componentInstance.state.selectedItem).toBe(0);

			TestUtils.Simulate.click(componentInstance['item1']);
			expect(componentInstance.state.selectedItem).toBe(1);

			TestUtils.Simulate.click(componentInstance['item3']);
			expect(componentInstance.state.selectedItem).toBe(3);
		});

		it("Should call a given onSelectItem function when an item is clicked", function () {
			var mockedFunction = jest.genMockFunction();

			renderComponent({onClickItem: mockedFunction});

			TestUtils.Simulate.click(componentInstance['item1']);
			expect(mockedFunction).toBeCalled();
		});
	})

	describe("Navigating", function () {
		beforeEach(function () {
			componentInstance.showArrows = true;
		});

		it("Should disable the left arrow if we are showing the first item", function () {
			TestUtils.Simulate.click(componentInstance['item0']);
			expect(ReactDOM.findDOMNode(componentInstance).querySelectorAll('.carousel-slider .control-prev.control-disabled').length).toBe(1);
		});

		it("Should enable the left arrow if we are showing other than the first item", function () {
			TestUtils.Simulate.click(componentInstance['item1']);
			expect(ReactDOM.findDOMNode(componentInstance).querySelectorAll('.carousel-slider .control-prev.control-disabled').length).toBe(0);
		});

		it("Should disable the right arrow if we reach the lastPosition", function () {
			TestUtils.Simulate.click(componentInstance['item1']);
			expect(ReactDOM.findDOMNode(componentInstance).querySelectorAll('.carousel-slider .control-next.control-disabled').length).toBe(0);

			TestUtils.Simulate.click(componentInstance['item6']);
			expect(ReactDOM.findDOMNode(componentInstance).querySelectorAll('.carousel-slider .control-next.control-disabled').length).toBe(1);
		});

        describe("Infinite Loop", function () {
            beforeEach(function () {
                renderComponent({
                    infiniteLoop: true
                })
            });

            it("Should enable the prev arrow if we are showing the first item", function () {
                TestUtils.Simulate.click(componentInstance['item0']);
                expect(ReactDOM.findDOMNode(componentInstance).querySelectorAll('.carousel-slider .control-prev.control-disabled').length).toBe(0);
            });

            it("Should enable the right arrow if we reach the lastPosition", function () {
                TestUtils.Simulate.click(componentInstance['item6']);
                expect(ReactDOM.findDOMNode(componentInstance).querySelectorAll('.carousel-slider .control-next.control-disabled').length).toBe(0);
            });
        });
	});

	jest.autoMockOn();
});

