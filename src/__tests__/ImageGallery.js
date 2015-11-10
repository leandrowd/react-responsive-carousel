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
	  		<ImageGallery>
	  			<img src="assets/1.jpeg" />
				<img src="assets/2.jpeg" />
				<img src="assets/3.jpeg" />
				<img src="assets/4.jpeg" />
				<img src="assets/5.jpeg" />
				<img src="assets/6.jpeg" />
				<img src="assets/7.jpeg" />
	  		</ImageGallery>
	  	);
	});

	afterEach(function() {
		if (componentInstance && componentInstance.isMounted()) {
	      // Only components with a parent will be unmounted
	      React.unmountComponentAtNode(componentInstance.getDOMNode());
	    }
  	});

	it("Should have a state currentImage", function () {
		expect(componentInstance.state.currentImage).toBeDefined();
	});
});

