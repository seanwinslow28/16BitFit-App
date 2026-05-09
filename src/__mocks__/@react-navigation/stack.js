const React = require('react');

module.exports = {
  createStackNavigator: () => ({
    Navigator: ({children, initialRouteName}) => {
      // Render only the initial screen for testing
      const screens = React.Children.toArray(children);
      const initialScreen = screens.find(
        child => child.props && child.props.name === initialRouteName,
      );

      if (initialScreen && initialScreen.props.component) {
        const Component = initialScreen.props.component;
        return React.createElement(Component);
      }

      return React.createElement('View', null, children);
    },
    Screen: () => null,
  }),
  CardStyleInterpolators: {
    forHorizontalIOS: {},
    forVerticalIOS: {},
    forModalPresentationIOS: {},
    forFadeFromBottomAndroid: {},
    forRevealFromBottomAndroid: {},
  },
  TransitionSpecs: {
    TransitionIOSSpec: {},
    FadeInFromBottomAndroidSpec: {},
    FadeOutToBottomAndroidSpec: {},
    RevealFromBottomAndroidSpec: {},
  },
  HeaderStyleInterpolators: {
    forUIKit: {},
    forFade: {},
    forStatic: {},
  },
  TransitionPresets: {
    SlideFromRightIOS: {},
    ModalSlideFromBottomIOS: {},
    ModalPresentationIOS: {},
    FadeFromBottomAndroid: {},
    RevealFromBottomAndroid: {},
    ScaleFromCenterAndroid: {},
    DefaultTransition: {},
    ModalTransition: {},
  },
};
