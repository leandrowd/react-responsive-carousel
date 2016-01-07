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
	  		React.createElement(Carousel, React.__spread({},  props, {showArrows: true}), 
	  			React.createElement("img", {src: "assets/1.jpeg"}), 
				React.createElement("img", {src: "assets/2.jpeg"}), 
				React.createElement("img", {src: "assets/3.jpeg"}), 
				React.createElement("img", {src: "assets/4.jpeg"}), 
				React.createElement("img", {src: "assets/5.jpeg"}), 
				React.createElement("img", {src: "assets/6.jpeg"}), 
				React.createElement("img", {src: "assets/7.jpeg"})
	  		)
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
  				console.log(componentInstance.handleOnChange.mock.calls[0][0]);
				expect(componentInstance.handleOnChange.mock.calls[0][0]).toBe(1);
  			});
  		});
  	});

	it("Should have the right state at the begin", function () {
		expect(componentInstance.state.selectedItem).toBe(0);
		expect(componentInstance.state.hasMount).toBe(false);
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
	})	

	jest.autoMockOn();
});

