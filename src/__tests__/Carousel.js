/** @jsx React.DOM */

describe("Carousel", function() {
	var React = require('react/addons');
	var TestUtils = React.addons.TestUtils;
	var findByTag = TestUtils.scryRenderedDOMComponentsWithTag;
	var findByClass = TestUtils.scryRenderedDOMComponentsWithClass;

	jest.dontMock('../components/Carousel');
	var Carousel = require('../components/Carousel');
	
	var component, componentInstance;

	var images = [
		{url: "http://placehold.it/150x150"},
		{url: "http://placehold.it/149x149"},
		{url: "http://placehold.it/148x148"},
		{url: "http://placehold.it/147x147"},
		{url: "http://placehold.it/146x146"},
		{url: "http://placehold.it/147x147"},
		{url: "http://placehold.it/146x146"}
	];

	beforeEach(function () {
		componentInstance = TestUtils.renderIntoDocument(
	  		<Carousel items={ images }/>
	  	);
	});

	afterEach(function() {
		if (componentInstance && componentInstance.isMounted()) {
	      // Only components with a parent will be unmounted
	      React.unmountComponentAtNode(componentInstance.getDOMNode().parent);
	    }
  	});

	it("should be an instance of component", function(){
		expect(TestUtils.isCompositeComponent(componentInstance)).toBe(true);
	});

	it("Should have the right state at the begin", function () {
		expect(componentInstance.state.selectedItem).toBe(0);
		expect(componentInstance.state.firstItem).toBe(0);
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
			componentInstance.setProps({selectedItem: 3});
			expect(componentInstance.state.selectedItem).toBe(3);
		});

		it("Should update the position of the carousel if selectedItem is changed", function () {
			componentInstance.setProps({selectedItem: 2});
			expect(componentInstance.state.selectedItem).toBe(2);
			expect(componentInstance.state.firstItem).toBe(2);

			componentInstance.setProps({selectedItem: 3});
			expect(componentInstance.state.selectedItem).toBe(3);
			expect(componentInstance.state.firstItem).toBe(3);
		});


		it("Should limit the position of the carousel firstItem to the `lastPosition`", function () {
			componentInstance.setProps({selectedItem: 2});
			expect(componentInstance.state.selectedItem).toBe(2);
			expect(componentInstance.state.firstItem).toBe(2);

			componentInstance.setProps({selectedItem: 5});
			expect(componentInstance.state.selectedItem).toBe(5);
			expect(componentInstance.state.firstItem).toBe(3);

			componentInstance.setProps({selectedItem: 6});
			expect(componentInstance.state.selectedItem).toBe(6);
			expect(componentInstance.state.firstItem).toBe(3);
		});
	})

	describe("Selecting", function () {
		it("Should set the index as selectedItem when clicked", function () {
			expect(componentInstance.state.selectedItem).toBe(0);
			
			TestUtils.Simulate.click(findByTag(componentInstance, 'li')[1].getDOMNode());
			expect(componentInstance.state.selectedItem).toBe(1);

			TestUtils.Simulate.click(findByTag(componentInstance, 'li')[3].getDOMNode());
			expect(componentInstance.state.selectedItem).toBe(3);
		});

		it("Should call a given onSelectItem function when an item is clicked", function () {
			var mockedFunction = jest.genMockFunction();
			
			componentInstance.setProps({onSelectItem: mockedFunction});

			TestUtils.Simulate.click(findByTag(componentInstance, 'li')[1].getDOMNode());
			expect(mockedFunction).toBeCalled();
			expect(mockedFunction).lastCalledWith(1, {url: "http://placehold.it/149x149"});		

		})
	})

	describe("Integrating", function () {
		beforeEach(function () {
			componentInstance.lastPosition = 4;
			componentInstance.visibleItems = 1;
			componentInstance.showArrows = true;
		});
	
		it("Should disable the left arrow if the first thumb is selected", function () {
			expect(findByClass(componentInstance, 'control-arrow control-left control-disabled').length).toBe(1);

			componentInstance.setProps({selectedItem: 2});
			expect(findByClass(componentInstance, 'control-arrow control-left control-disabled').length).toBe(0);	
		});
	})

	describe("Navigating", function () {
		beforeEach(function () {
			componentInstance.lastPosition = 4;
			componentInstance.visibleItems = 1;
			componentInstance.showArrows = true;
		});

		it("Should disable the left arrow if we are showing the first item", function () {
			componentInstance.setProps({selectedItem: 0});
			expect(findByClass(componentInstance, 'control-arrow control-left control-disabled').length).toBe(1);
		});	

		it("Should enable the left arrow if we are showing other than the first item", function () {
			componentInstance.setProps({selectedItem: 1});
			expect(findByClass(componentInstance, 'control-arrow control-left control-disabled').length).toBe(0);
		});	

		it("Should disable the right arrow if we reach the lastPosition", function () {
			componentInstance.setProps({selectedItem: 1});
			expect(findByClass(componentInstance, 'control-arrow control-right control-disabled').length).toBe(0);
			
			componentInstance.setProps({selectedItem: 4});
			expect(findByClass(componentInstance, 'control-arrow control-right control-disabled').length).toBe(1);
		});	

		it("Should disable both arrows if we have more space than items", function () {
			componentInstance.visibleItems = 10;
			componentInstance.setProps({selectedItem: 0});
			expect(findByClass(componentInstance, 'control-arrow control-left control-disabled').length).toBe(1);
			expect(findByClass(componentInstance, 'control-arrow control-right control-disabled').length).toBe(1);
		})
	})	
});

