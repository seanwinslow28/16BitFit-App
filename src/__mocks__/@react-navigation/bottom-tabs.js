const React = require('react');

const BottomTab = {
  Navigator: ({children}) =>
    React.createElement('BottomTabNavigator', null, children),
  Screen: ({children}) =>
    React.createElement('BottomTabScreen', null, children),
};

module.exports = {
  createBottomTabNavigator: () => BottomTab,
};
