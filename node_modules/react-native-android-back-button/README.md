# react-native-android-back-button

Control your React Native app's Android back button behavior with a component instead of an imperative API. 

### Installation

`npm install react-native-android-back-button` or
`yarn add react-native-android-back-button`


### Usage


```jsx
import React, { Component } from "react"
import { Text, View } from "react-native"
import AndroidBackButton from "react-native-android-back-button"

class Foo extends React.Component {
  render() {
    return (
      <View>
        <Text>My cool app</Text>
        <AndroidBackButton
          onPress={ /* your function here */ }
         />
      </View>
    )
  }
}
```


Use the `AndroidBackButton` component with an `onPress` function property to define the behavior when a user presses the back button on an Android phone or Android hardware emulator.

If `onPress` returns a falsey value, pressing the back button will quit the app. If `onPress` returns a truthy value, pressing the back button does nothing.

You can mount as many `AndroidBackButton` instances as you like, but the `onPress` function executed will come from the innermost mounted instance.

It is up to you to implement the desired behavior for instances when you do not want to exit the app.

For instance, you may wish to use the back button to navigate back through routes in your app's navigation stack. Assuming you have access to a `navigator` instance, you could write something like this:


```js
function popIfExists() {
  if (navigator.getCurrentIndex() > 0) {
    navigator.pop()
    return true // do not exit app
  } else {
    return false // exit app
  }
}

<AndroidBackButton
  onPress={popIfExists}
/>

```

:warning: When you use `react-native-android-back-button`, ensure that no other parts of your application manually attach listener callbacks to React Native's `BackAndroid` module. You should only interact with the internal `BackAndroid` via this package's exported `AndroidBackButton` component.

### Author

Scott Luptowski

[@scottluptowski](https://twitter.com/scottluptowski)

[Website](http://www.scottluptowski.com)

### License

MIT
