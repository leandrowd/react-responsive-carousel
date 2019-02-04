"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _enzyme = require("enzyme");

var _reactTestRenderer = require("react-test-renderer");

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

var _index = require("../index");

var index = _interopRequireWildcard(_index);

var _reactEasySwipe = require("react-easy-swipe");

var _reactEasySwipe2 = _interopRequireDefault(_reactEasySwipe);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

describe("Slider", function () {
    jest.autoMockOff();

    var Carousel = require("../components/Carousel").default;
    var Thumbs = require("../components/Thumbs").default;

    var component = void 0,
        componentInstance = void 0,
        totalChildren = void 0,
        lastItemIndex = void 0;

    var bootstrap = function bootstrap(props, children) {
        component = (0, _enzyme.mount)(_react2.default.createElement(
            Carousel,
            props,
            children
        ));

        componentInstance = component.instance();

        totalChildren = children && children.length ? componentInstance.props.children.length : 0;
        lastItemIndex = totalChildren - 1;
    };

    var baseChildren = [_react2.default.createElement("img", { src: "assets/1.jpeg", key: "1" }), _react2.default.createElement("img", { src: "assets/2.jpeg", key: "2" }), _react2.default.createElement("img", { src: "assets/3.jpeg", key: "3" }), _react2.default.createElement("img", { src: "assets/4.jpeg", key: "4" }), _react2.default.createElement("img", { src: "assets/5.jpeg", key: "5" }), _react2.default.createElement("img", { src: "assets/6.jpeg", key: "6" }), _react2.default.createElement("img", { src: "assets/7.jpeg", key: "7" })];

    var renderDefaultComponent = function renderDefaultComponent(_ref) {
        var _ref$children = _ref.children,
            children = _ref$children === undefined ? baseChildren : _ref$children,
            props = _objectWithoutProperties(_ref, ["children"]);

        bootstrap(props, children);
    };

    var renderForSnapshot = function renderForSnapshot(props, children) {
        return _reactTestRenderer2.default.create(_react2.default.createElement(
            Carousel,
            props,
            children
        )).toJSON();
    };

    beforeEach(function () {
        renderDefaultComponent({});
    });

    describe("Exports", function () {
        it("should export Carousel from the main index file", function () {
            expect(index.Carousel).toBe(Carousel);
        });
        it("should export Thumbs from the main index file", function () {
            expect(index.Thumbs).toBe(Thumbs);
        });
    });

    describe("Basics", function () {
        describe("DisplayName", function () {
            it("should be Carousel", function () {
                expect(Carousel.displayName).toBe("Carousel");
            });
        });

        describe("Default Props", function () {
            var props = {
                showIndicators: true,
                showArrows: true,
                showStatus: true,
                showThumbs: true,
                infiniteLoop: false,
                selectedItem: 0,
                axis: "horizontal",
                verticalSwipe: "standard",
                useKeyboardArrows: false,
                autoPlay: false,
                stopOnHover: true,
                interval: 3000,
                transitionTime: 350,
                swipeScrollTolerance: 5,
                dynamicHeight: false,
                emulateTouch: false,
                centerMode: false
            };

            Object.keys(props).forEach(function (prop) {
                it("should have " + prop + " as " + props[prop], function () {
                    expect(componentInstance.props[prop]).toBe(props[prop]);
                });
            });
        });

        describe("Initial State", function () {
            var props = {
                selectedItem: 0,
                hasMount: false
            };

            Object.keys(props).forEach(function (prop) {
                it("should have " + prop + " as " + props[prop], function () {
                    expect(componentInstance.state.selectedItem).toBe(0);
                    expect(componentInstance.state.hasMount).toBe(false);
                });
            });
        });
    });

    describe("componentDidMount", function () {
        it("should bind the events", function () {
            componentInstance.bindEvents = jest.genMockFunction();
            componentInstance.componentDidMount();
            expect(componentInstance.bindEvents.mock.calls.length).toBe(1);
        });

        it("should not bind the events if there are no children", function () {
            bootstrap({}, null);
            componentInstance.bindEvents = jest.genMockFunction();
            componentInstance.componentDidMount();
            expect(componentInstance.bindEvents.mock.calls.length).toBe(0);
        });

        it("should bind the events if children were lazy loaded (through componentDidUpdate)", function () {
            bootstrap({}, null);
            componentInstance.bindEvents = jest.genMockFunction();
            expect(componentInstance.bindEvents.mock.calls.length).toBe(0);

            component.setProps({
                children: [_react2.default.createElement("img", { src: "assets/1.jpeg", key: "1" })]
            });

            expect(componentInstance.bindEvents.mock.calls.length).toBe(1);
        });
    });

    describe("componentDidUpdate", function () {
        it("should unbind the events", function () {
            componentInstance.resetPosition = jest.genMockFunction();
            componentInstance.setState({ swiping: false });
            componentInstance.componentDidUpdate({}, { swiping: true });
            expect(componentInstance.resetPosition.mock.calls.length).toBe(1);
        });
    });

    describe("componentWillUnmount", function () {
        beforeEach(function () {
            componentInstance.unbindEvents = jest.genMockFunction();
            componentInstance.componentWillUnmount();
        });
        it("should unbind the events", function () {
            expect(componentInstance.unbindEvents.mock.calls.length).toBe(1);
        });
    });

    describe("bindEvents", function () {
        describe("when useKeyboardArrows is false", function () {
            beforeEach(function () {
                window.addEventListener = jest.genMockFunction();
                document.addEventListener = jest.genMockFunction();
                componentInstance.bindEvents();
            });

            it("should bind resize to updateSizes", function () {
                expect(window.addEventListener.mock.calls[0]).toEqual(["resize", componentInstance.updateSizes]);
            });

            it("should bind DOMContentLoaded to updateSizes", function () {
                expect(window.addEventListener.mock.calls[1]).toEqual(["DOMContentLoaded", componentInstance.updateSizes]);
            });

            it("should not bind keydown to navigateWithKeyboard", function () {
                expect(document.addEventListener.mock.calls.length).toBe(0);
            });
        });

        describe("when useKeyboardArrows is true", function () {
            beforeEach(function () {
                renderDefaultComponent({
                    useKeyboardArrows: true
                });

                window.addEventListener = jest.genMockFunction();
                document.addEventListener = jest.genMockFunction();
                componentInstance.bindEvents();
            });

            it("should bind resize to updateSizes", function () {
                expect(window.addEventListener.mock.calls[0]).toEqual(["resize", componentInstance.updateSizes]);
            });

            it("should bind DOMContentLoaded to updateSizes", function () {
                expect(window.addEventListener.mock.calls[1]).toEqual(["DOMContentLoaded", componentInstance.updateSizes]);
            });

            it("should bind keydown to navigateWithKeyboard", function () {
                expect(document.addEventListener.mock.calls[0]).toEqual(["keydown", componentInstance.navigateWithKeyboard]);
            });
        });
    });

    describe("unbindEvents", function () {
        describe("when useKeyboardArrows is false", function () {
            beforeEach(function () {
                window.removeEventListener = jest.genMockFunction();
                document.removeEventListener = jest.genMockFunction();
                componentInstance.unbindEvents();
            });

            it("should unbind resize to updateSizes", function () {
                expect(window.removeEventListener.mock.calls[0]).toEqual(["resize", componentInstance.updateSizes]);
            });

            it("should unbind DOMContentLoaded to updateSizes", function () {
                expect(window.removeEventListener.mock.calls[1]).toEqual(["DOMContentLoaded", componentInstance.updateSizes]);
            });

            it("should not unbind keydown to navigateWithKeyboard", function () {
                expect(document.removeEventListener.mock.calls.length).toBe(0);
            });
        });

        describe("when useKeyboardArrows is true", function () {
            beforeEach(function () {
                renderDefaultComponent({
                    useKeyboardArrows: true
                });

                window.removeEventListener = jest.genMockFunction();
                document.removeEventListener = jest.genMockFunction();
                componentInstance.unbindEvents();
            });

            it("should unbind resize to updateSizes", function () {
                expect(window.removeEventListener.mock.calls[0]).toEqual(["resize", componentInstance.updateSizes]);
            });

            it("should unbind DOMContentLoaded to updateSizes", function () {
                expect(window.removeEventListener.mock.calls[1]).toEqual(["DOMContentLoaded", componentInstance.updateSizes]);
            });

            it("should unbind keydown to navigateWithKeyboard", function () {
                expect(document.removeEventListener.mock.calls[0]).toEqual(["keydown", componentInstance.navigateWithKeyboard]);
            });
        });
    });

    describe("navigateWithKeyboard", function () {
        describe("Axis === horizontal", function () {
            beforeEach(function () {
                renderDefaultComponent({
                    axis: "horizontal",
                    useKeyboardArrows: true
                });

                componentInstance.increment = jest.genMockFunction();
                componentInstance.decrement = jest.genMockFunction();
            });

            it("should call only increment on ArrowRight (39)", function () {
                componentInstance.navigateWithKeyboard({ keyCode: 39 });

                expect(componentInstance.increment.mock.calls.length).toBe(1);
                expect(componentInstance.decrement.mock.calls.length).toBe(0);
            });

            it("should call only decrement on ArrowLeft (37)", function () {
                componentInstance.navigateWithKeyboard({ keyCode: 37 });

                expect(componentInstance.decrement.mock.calls.length).toBe(1);
                expect(componentInstance.increment.mock.calls.length).toBe(0);
            });

            it("should not call increment on ArrowDown (40)", function () {
                componentInstance.navigateWithKeyboard({ keyCode: 40 });

                expect(componentInstance.increment.mock.calls.length).toBe(0);
                expect(componentInstance.decrement.mock.calls.length).toBe(0);
            });

            it("should not call decrement on ArrowUp (38)", function () {
                componentInstance.navigateWithKeyboard({ keyCode: 38 });

                expect(componentInstance.decrement.mock.calls.length).toBe(0);
                expect(componentInstance.increment.mock.calls.length).toBe(0);
            });
        });

        describe("Axis === vertical", function () {
            beforeEach(function () {
                renderDefaultComponent({
                    axis: "vertical",
                    useKeyboardArrows: true
                });

                componentInstance.increment = jest.genMockFunction();
                componentInstance.decrement = jest.genMockFunction();
            });

            it("should call only increment on ArrowDown (40)", function () {
                componentInstance.navigateWithKeyboard({ keyCode: 40 });

                expect(componentInstance.increment.mock.calls.length).toBe(1);
                expect(componentInstance.decrement.mock.calls.length).toBe(0);
            });

            it("should call only decrement on ArrowUp (38)", function () {
                componentInstance.navigateWithKeyboard({ keyCode: 38 });

                expect(componentInstance.decrement.mock.calls.length).toBe(1);
                expect(componentInstance.increment.mock.calls.length).toBe(0);
            });

            it("should not call increment on ArrowRight (39)", function () {
                componentInstance.navigateWithKeyboard({ keyCode: 39 });

                expect(componentInstance.increment.mock.calls.length).toBe(0);
                expect(componentInstance.decrement.mock.calls.length).toBe(0);
            });

            it("should not call decrement on ArrowLeft (37)", function () {
                componentInstance.navigateWithKeyboard({ keyCode: 37 });

                expect(componentInstance.decrement.mock.calls.length).toBe(0);
                expect(componentInstance.increment.mock.calls.length).toBe(0);
            });
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

        it("should call selectItem sending selectedItem as 1", function () {
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

        it("should call setState sending the argument received", function () {
            expect(componentInstance.setState.mock.calls[0][0]).toEqual({
                selectedItem: 1,
                ramdomNumber: 2
            });
        });

        it("should call handleOnChange sending only selectedItem", function () {
            expect(componentInstance.handleOnChange.mock.calls[0][0]).toBe(1);
        });
    });

    it("should add a thumb-wrapper container", function () {
        expect(component.find(".thumbs-wrapper").length).toBe(1);
    });

    describe("Moving", function () {
        beforeEach(function () {
            componentInstance.showArrows = true;
            componentInstance.lastPosition = 3;
            componentInstance.visibleItems = 3;
        });

        it("should set the selectedItem from the props", function () {
            renderDefaultComponent({ selectedItem: 3 });
            expect(componentInstance.state.selectedItem).toBe(3);
        });

        it("should update the position of the Carousel if selectedItem is changed", function () {
            component.findWhere(function (n) {
                return n.node === componentInstance.itemsRef[2];
            }).simulate("click");
            expect(componentInstance.state.selectedItem).toBe(2);

            component.findWhere(function (n) {
                return n.node === componentInstance.itemsRef[3];
            }).simulate("click");
            expect(componentInstance.state.selectedItem).toBe(3);
        });
    });

    describe("Selecting", function () {
        it("should set the index as selectedItem when clicked", function () {
            expect(componentInstance.state.selectedItem).toBe(0);

            component.findWhere(function (n) {
                return n.node === componentInstance.itemsRef[1];
            }).simulate("click");
            expect(componentInstance.state.selectedItem).toBe(1);

            component.findWhere(function (n) {
                return n.node === componentInstance.itemsRef[3];
            }).simulate("click");
            expect(componentInstance.state.selectedItem).toBe(3);
        });

        it("should call a given onSelectItem function when an item is clicked", function () {
            var mockedFunction = jest.genMockFunction();

            renderDefaultComponent({ onClickItem: mockedFunction });

            component.findWhere(function (n) {
                return n.node === componentInstance.itemsRef[1];
            }).simulate("click");
            expect(mockedFunction).toBeCalled();
        });

        it("should be disabled when only 1 child is present", function () {
            var mockedFunction = jest.genMockFunction();

            renderDefaultComponent({
                children: _react2.default.createElement("img", { src: "assets/1.jpeg", key: "1" }),
                onClickItem: mockedFunction
            });
            expect(componentInstance.state.selectedItem).toBe(0);

            component.findWhere(function (n) {
                return n.node === componentInstance.itemsRef[0];
            }).simulate("click");
            expect(componentInstance.state.selectedItem).toBe(0);
            expect(mockedFunction).not.toBeCalled();
        });
    });

    describe("Navigating", function () {
        beforeEach(function () {
            componentInstance.showArrows = true;
        });

        it("should disable the left arrow if we are showing the first item", function () {
            component.findWhere(function (n) {
                return n.node === componentInstance.itemsRef[0];
            }).simulate("click");
            expect(_reactDom2.default.findDOMNode(componentInstance).querySelectorAll(".carousel-slider .control-prev.control-disabled").length).toBe(1);
        });

        it("should enable the left arrow if we are showing other than the first item", function () {
            component.findWhere(function (n) {
                return n.node === componentInstance.itemsRef[1];
            }).simulate("click");
            expect(_reactDom2.default.findDOMNode(componentInstance).querySelectorAll(".carousel-slider .control-prev.control-disabled").length).toBe(0);
        });

        it("should disable the right arrow if we reach the lastPosition", function () {
            component.findWhere(function (n) {
                return n.node === componentInstance.itemsRef[1];
            }).simulate("click");
            expect(_reactDom2.default.findDOMNode(componentInstance).querySelectorAll(".carousel-slider .control-next.control-disabled").length).toBe(0);

            component.findWhere(function (n) {
                return n.node === componentInstance.itemsRef[6];
            }).simulate("click");
            expect(_reactDom2.default.findDOMNode(componentInstance).querySelectorAll(".carousel-slider .control-next.control-disabled").length).toBe(1);
        });
    });

    describe("Infinite Loop", function () {
        beforeEach(function () {
            renderDefaultComponent({
                infiniteLoop: true
            });
        });

        it("should enable the prev arrow if we are showing the first item", function () {
            component.findWhere(function (n) {
                return n.node === componentInstance.itemsRef[0];
            }).simulate("click");
            expect(_reactDom2.default.findDOMNode(componentInstance).querySelectorAll(".carousel-slider .control-prev.control-disabled").length).toBe(0);
        });

        it("should enable the right arrow if we reach the lastPosition", function () {
            component.findWhere(function (n) {
                return n.node === componentInstance.itemsRef[6];
            }).simulate("click");
            expect(_reactDom2.default.findDOMNode(componentInstance).querySelectorAll(".carousel-slider .control-next.control-disabled").length).toBe(0);
        });

        it("should move to the first one if increment was called in the last", function () {
            componentInstance.setState({
                selectedItem: lastItemIndex
            });

            expect(componentInstance.state.selectedItem).toBe(lastItemIndex);

            componentInstance.increment();

            expect(componentInstance.state.selectedItem).toBe(0);
        });

        it("should move to the last one if decrement was called in the first", function () {
            expect(componentInstance.state.selectedItem).toBe(0);

            componentInstance.decrement();

            expect(componentInstance.state.selectedItem).toBe(lastItemIndex);
        });

        it("should render the clone slides", function () {
            expect(component.find(".slide").at(0).key()).toContain("itemKey6clone");
            expect(component.find(".slide").at(8).key()).toContain("itemKey0clone");
        });

        it("should set slide position directly and trigger a reflow when doing first to last transition", function () {
            componentInstance.setPosition = jest.genMockFunction();
            componentInstance.decrement();
            expect(componentInstance.setPosition).toBeCalledWith("-800%", true);
            componentInstance.setPosition.mockClear();
        });

        it("should set slide position directly and trigger a reflow when doing last to first transition", function () {
            renderDefaultComponent({
                infiniteLoop: true,
                selectedItem: 7
            });

            componentInstance.setPosition = jest.genMockFunction();
            componentInstance.increment();
            expect(componentInstance.setPosition).toHaveBeenCalled();
        });

        it("should not call setPosition if swiping with inifinite scrolling", function () {
            componentInstance.setPosition = jest.genMockFunction();
            componentInstance.decrement(1, true);
            expect(componentInstance.setPosition).not.toHaveBeenCalled();
        });

        it("should work with minimal children", function () {
            renderDefaultComponent({
                children: [_react2.default.createElement("img", { src: "assets/1.jpeg", key: "1" }), _react2.default.createElement("img", { src: "assets/2.jpeg", key: "2" })],
                infiniteLoop: true
            });
            componentInstance.decrement();
            expect(componentInstance.state.selectedItem).toBe(lastItemIndex);

            renderDefaultComponent({
                children: [_react2.default.createElement("img", { src: "assets/1.jpeg", key: "1" })],
                infiniteLoop: true
            });
            componentInstance.decrement();
            expect(componentInstance.state.selectedItem).toBe(lastItemIndex);
        });
    });

    describe("Auto Play", function () {
        beforeEach(function () {
            jest.useFakeTimers();
            window.addEventListener = jest.genMockFunction();

            renderDefaultComponent({
                autoPlay: true
            });
        });

        afterEach(function () {
            jest.useRealTimers();
        });

        it("should disable when only 1 child is present", function () {
            renderDefaultComponent({
                children: _react2.default.createElement("img", { src: "assets/1.jpeg", key: "1" }),
                autoPlay: true
            });

            expect(componentInstance.state.selectedItem).toBe(0);

            jest.runOnlyPendingTimers();

            expect(componentInstance.state.selectedItem).toBe(0);
        });

        it("should change items automatically", function () {
            expect(componentInstance.state.selectedItem).toBe(0);

            jest.runOnlyPendingTimers();

            expect(componentInstance.state.selectedItem).toBe(1);

            jest.runOnlyPendingTimers();

            expect(componentInstance.state.selectedItem).toBe(2);
        });

        it("should not move automatically if hovering", function () {
            componentInstance.stopOnHover();

            expect(componentInstance.state.selectedItem).toBe(0);

            jest.runOnlyPendingTimers();

            expect(componentInstance.state.selectedItem).toBe(0);

            componentInstance.autoPlay();

            jest.runOnlyPendingTimers();

            expect(componentInstance.state.selectedItem).toBe(1);
        });
    });

    describe("Mouse enter/leave", function () {
        describe("onMouseEnter", function () {
            it("should set isMouseEntered to true", function () {
                componentInstance.stopOnHover();
                expect(componentInstance.state.isMouseEntered).toBe(true);
            });

            it("should stop auto play when hovering", function () {
                componentInstance.clearAutoPlay = jest.genMockFunction();
                componentInstance.stopOnHover();
                expect(componentInstance.clearAutoPlay.mock.calls.length).toBe(1);
            });
        });

        describe("onMouseLeave", function () {
            it("should set isMouseEntered to false", function () {
                componentInstance.startOnLeave();
                expect(componentInstance.state.isMouseEntered).toBe(false);
            });

            it("should start auto play again after hovering", function () {
                componentInstance.autoPlay = jest.genMockFunction();
                componentInstance.startOnLeave();
                expect(componentInstance.autoPlay.mock.calls.length).toBe(1);
            });
        });
    });

    describe("Swiping", function () {
        describe("onSwipeStart", function () {
            it("should set swiping to true", function () {
                componentInstance.onSwipeStart();
                expect(componentInstance.state.swiping).toBe(true);
            });

            it("should stop autoplay", function () {
                componentInstance.clearAutoPlay = jest.genMockFunction();
                componentInstance.onSwipeStart();
                expect(componentInstance.clearAutoPlay.mock.calls.length).toBe(1);
            });
        });

        describe("onSwipeMove", function () {
            it("should return true to stop scrolling if there was movement in the same direction as the carousel axis", function () {
                expect(componentInstance.onSwipeMove({
                    x: 10,
                    y: 0
                })).toBe(true);
            });

            it("should return false to allow scrolling if there was no movement in the same direction as the carousel axis", function () {
                expect(componentInstance.onSwipeMove({
                    x: 0,
                    y: 10
                })).toBe(false);
            });
        });

        describe("onSwipeEnd", function () {
            it("should set swiping to false", function () {
                componentInstance.onSwipeEnd();
                expect(componentInstance.state.swiping).toBe(false);
            });
            it("should start autoplay again", function () {
                componentInstance.autoPlay = jest.genMockFunction();
                componentInstance.onSwipeEnd();
                expect(componentInstance.autoPlay.mock.calls.length).toBe(1);
            });
        });

        describe("verticalSwipe === 'standard'", function () {
            it("should pass the correct props to <Swipe />", function () {
                renderDefaultComponent({
                    axis: "vertical"
                });

                var swipeProps = component.find(_reactEasySwipe2.default).first().props();

                expect(swipeProps.onSwipeUp).toBe(componentInstance.onSwipeDownWard);
                expect(swipeProps.onSwipeDown).toBe(componentInstance.onSwipeUpWard);
            });
        });

        describe("verticalSwipe === 'natural'", function () {
            it("should pass the correct props to <Swipe />", function () {
                renderDefaultComponent({
                    axis: "vertical",
                    verticalSwipe: "natural"
                });

                var swipeProps = component.find(_reactEasySwipe2.default).first().props();

                expect(swipeProps.onSwipeUp).toBe(componentInstance.onSwipeUpWard);
                expect(swipeProps.onSwipeDown).toBe(componentInstance.onSwipeDownWard);
            });
        });
    });

    describe("center mode", function () {
        beforeEach(function () {
            renderDefaultComponent({
                centerMode: true
            });
        });

        describe("getPosition", function () {
            it("should return regular tranform calculation for vertical axis", function () {
                renderDefaultComponent({
                    centerMode: true,
                    axis: "vertical"
                });
                expect(componentInstance.getPosition(0)).toBe(0);
                expect(componentInstance.getPosition(1)).toBe(-100);
                expect(componentInstance.getPosition(2)).toBe(-200);
                expect(componentInstance.getPosition(3)).toBe(-300);
                expect(componentInstance.getPosition(4)).toBe(-400);
                expect(componentInstance.getPosition(5)).toBe(-500);
                expect(componentInstance.getPosition(6)).toBe(-600);
            });

            it("should return padded transform calculation for horizontal axis", function () {
                expect(componentInstance.getPosition(0)).toBe(0);
                expect(componentInstance.getPosition(1)).toBe(-70);
                expect(componentInstance.getPosition(2)).toBe(-150);
                expect(componentInstance.getPosition(3)).toBe(-230);
                expect(componentInstance.getPosition(4)).toBe(-310);
                expect(componentInstance.getPosition(5)).toBe(-390);
                // last one takes up more space
                expect(componentInstance.getPosition(6)).toBe(-460);
            });

            it("should return padded tranform calculation for custom centerSlidePercentage", function () {
                renderDefaultComponent({
                    centerMode: true,
                    centerSlidePercentage: 50
                });
                expect(componentInstance.getPosition(0)).toBe(0);
                expect(componentInstance.getPosition(1)).toBe(-25);
                expect(componentInstance.getPosition(2)).toBe(-75);
                expect(componentInstance.getPosition(3)).toBe(-125);
                expect(componentInstance.getPosition(4)).toBe(-175);
                expect(componentInstance.getPosition(5)).toBe(-225);
                expect(componentInstance.getPosition(6)).toBe(-250);
            });
        });

        describe("slide style", function () {
            it("should have a min-width of 80%", function () {
                var slide = (0, _enzyme.shallow)(component.find(".slide").get(0));
                expect(slide.prop("style")).toHaveProperty("minWidth", "80%");
            });

            it("should have min-width defined by centerSlidePercentage", function () {
                renderDefaultComponent({
                    centerMode: true,
                    centerSlidePercentage: 50
                });
                var slide = (0, _enzyme.shallow)(component.find(".slide").get(0));
                expect(slide.prop("style")).toHaveProperty("minWidth", "50%");
            });

            it("should not be present for vertical axis", function () {
                renderDefaultComponent({
                    centerMode: true,
                    axis: "vertical"
                });
                var slide = (0, _enzyme.shallow)(component.find(".slide").get(0));
                expect(slide.prop("style")).toBeUndefined();
            });
        });
    });

    describe("Snapshots", function () {
        it("default", function () {
            expect(renderForSnapshot({}, baseChildren)).toMatchSnapshot();
        });

        it("no thumbs", function () {
            expect(renderForSnapshot({
                showThumbs: false
            }, baseChildren)).toMatchSnapshot();
        });

        it("no arrows", function () {
            expect(renderForSnapshot({
                showArrows: false
            }, baseChildren)).toMatchSnapshot();
        });

        it("no indicators", function () {
            expect(renderForSnapshot({
                showIndicators: false
            }, baseChildren)).toMatchSnapshot();
        });

        it("no indicators", function () {
            expect(renderForSnapshot({
                showStatus: false
            }, baseChildren)).toMatchSnapshot();
        });

        it("custom class name", function () {
            expect(renderForSnapshot({
                className: "my-custom-carousel"
            }, baseChildren)).toMatchSnapshot();
        });

        it("custom width", function () {
            expect(renderForSnapshot({
                width: "700px"
            }, baseChildren)).toMatchSnapshot();
        });

        it("vertical axis", function () {
            expect(renderForSnapshot({
                axis: "vertical"
            }, baseChildren)).toMatchSnapshot();
        });

        it("no children at mount", function () {
            expect(renderForSnapshot({}, null)).toMatchSnapshot();
        });

        it("center mode", function () {
            expect(renderForSnapshot({
                centerMode: true
            }, baseChildren)).toMatchSnapshot();
        });

        it("swipeable false", function () {
            expect(renderForSnapshot({
                swipeable: false
            }, baseChildren)).toMatchSnapshot();
        });

        it("infinite loop", function () {
            expect(renderForSnapshot({
                infiniteLoop: true
            }, baseChildren)).toMatchSnapshot();
        });
    });

    jest.autoMockOn();
});