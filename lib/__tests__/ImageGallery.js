/** @jsx React.DOM */

describe("ImageGallery", function() {
	
	var React = require('react');
	var TestUtils = require('react-addons-test-utils');
	var ReactDOM = require('react-dom');

	var findByTag = TestUtils.scryRenderedDOMComponentsWithTag;
	var findByClass = TestUtils.scryRenderedDOMComponentsWithClass;

	jest.dontMock('../components/ImageGallery');
	jest.dontMock('../components/Carousel');
	
	var ImageGallery = require('../components/ImageGallery');
	
	var component, componentInstance;

	beforeEach(function () {
		componentInstance = TestUtils.renderIntoDocument(
	  		React.createElement(ImageGallery, null, 
	  			React.createElement("img", {src: "assets/1.jpeg"}), 
				React.createElement("img", {src: "assets/2.jpeg"}), 
				React.createElement("img", {src: "assets/3.jpeg"}), 
				React.createElement("img", {src: "assets/4.jpeg"}), 
				React.createElement("img", {src: "assets/5.jpeg"}), 
				React.createElement("img", {src: "assets/6.jpeg"}), 
				React.createElement("img", {src: "assets/7.jpeg"})
	  		)
	  	);
	});

	afterEach(function() {
		if (componentInstance && componentInstance.isMounted()) {
	      // Only components with a parent will be unmounted
	      ReactDOM.unmountComponentAtNode(document);
	    }
  	});

	it("Should have a state selectedItem", function () {
		expect(componentInstance.state.selectedItem).toBeDefined();
	});
});

