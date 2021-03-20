import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import Carousel, { Props } from '../components/Carousel';

class ControlledCarousel extends React.Component<Partial<Props>, { selectedItem: number }> {
    state = { selectedItem: 0 };

    onChange = (index: number) => {
        this.setState({ selectedItem: index });
    };

    render() {
        const { children, ...props } = this.props;

        return (
            <Carousel {...props} selectedItem={this.state.selectedItem} onChange={this.onChange}>
                {children}
            </Carousel>
        );
    }
}

describe('Controlled Carousel', () => {
    let component: ReactWrapper;
    let componentInstance: any;
    let carouselComponent: ReactWrapper;
    let carouselComponentInstance: any;
    let totalChildren: number;
    let lastItemIndex: number;

    const bootstrap = (props: Partial<Props>, children: Props['children']) => {
        component = mount<Partial<Props>>(<ControlledCarousel {...props}>{children}</ControlledCarousel>);
        componentInstance = component.instance();

        carouselComponent = component.childAt(0);
        carouselComponentInstance = carouselComponent.instance();

        totalChildren = children && children.length ? React.Children.count(componentInstance.props.children) : 0;
        lastItemIndex = totalChildren - 1;
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

    const renderDefaultComponent = ({ children = baseChildren, ...props }: Partial<Props>) => {
        bootstrap(props, children);
    };

    beforeEach(() => {
        renderDefaultComponent({});
    });

    describe('selectedItem', () => {
        it("should't change selectedItem state when selectedItem prop is given", () => {
            const initialSelectedItem = carouselComponentInstance.state.selectedItem;
            const newSelectedItem = 5;
            carouselComponentInstance.selectItem({ selectedItem: newSelectedItem });

            expect(carouselComponentInstance.state.selectedItem).toEqual(initialSelectedItem);
            expect(carouselComponentInstance.state.selectedItem).not.toEqual(newSelectedItem);
        });
        it("should't let the selectedItem prop go out of the boundaries", () => {
            const firstItemIndex = 0;

            carouselComponentInstance.selectItem({ selectedItem: lastItemIndex + 1 });
            expect(componentInstance.state.selectedItem).toBe(lastItemIndex);

            carouselComponentInstance.selectItem({ selectedItem: firstItemIndex - 1 });
            expect(componentInstance.state.selectedItem).toBe(firstItemIndex);
        });
    });
});
