/** @jsx React.DOM */

describe("ImageGallery", function() {
	
	var React = require('react/addons');
	var TestUtils = React.addons.TestUtils;
	var findByTag = TestUtils.scryRenderedDOMComponentsWithTag;
	var findByClass = TestUtils.scryRenderedDOMComponentsWithClass;

	jest.dontMock('../components/ImageGallery');
	jest.dontMock('../components/Carousel');
	
	var ImageGallery = require('../components/ImageGallery');
	
	var component, componentInstance;

	beforeEach(function () {
		componentInstance = TestUtils.renderIntoDocument(
	  		<ImageGallery images={[
					{url: "http://placehold.it/150x150"},
					{url: "http://placehold.it/149x149"},
					{url: "http://placehold.it/148x148"},
					{url: "http://placehold.it/147x147"},
					{url: "http://placehold.it/146x146"}
			]}/>
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

	it("Should have a state currentImage", function () {
		expect(componentInstance.state.currentImage).toBeDefined();
	});
});

