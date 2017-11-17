# react-native-two-way-list

## What is it?

This is a project based off the need to support infinite scrolling in two directions.

`FlatList` and `SectionList` already support infinite scrolling well in one direction (down by default).
They do this with an `onEndReached` function that is passed by the caller. Whenever the user nears
the end of the list, the function is called, which usually loads more data, and appends it to the
end of the list data. The scroll position is maintained when the list updates, and the scroll seams pretty seamless.

These components effectively do the same for the _start_ of the list. When a user approaches the start,
the `onStartReached` callback is fired, and can load more data. Whenever new data is added,
the lists see _how much_ was added and set the scroll position of the list as closely as possible to where
the user was before data was added.

## Usage

### `Props`
Can be used with all of ReactNative's [SectionList](https://facebook.github.io/react-native/docs/sectionlist.html)/[FlatList](https://facebook.github.io/react-native/docs/flatlist.html) props in addition to the following

| Prop Name               | Type           | Default |
| ----------------------- |----------------| ------- |
| onStartReached          | `(void) => any`|         |
| onStartReachedThreshold | `number`       | `0`     |

#### `onStartReached`

Function to fire when the user scrolls into the region defined by `onStartReachedThreshold` (or the very beginning if not defined). Only fires when user is scrolling _toward_ the start.

**Note:** This function is called once per scroll, meaning once in the drag _or_ once in the resulting momentum that brings the scrollview within the start threshold.

#### `onStartReachedThreshold`

How far from the start (in units of visible length of the list) the start edge of the list must be from the start of the content to trigger the `onStartReached` callback. A value of 0.5 will trigger `onStartReached` when the start of the content is within half the visible length of the list. A Value of 0 will only fire the callback when the user is at the very start of the list (or above it from bouncing).

**Note:** if this is 0/undefined AND `bounces={false}` AND `initialScrollIndex` is not > 0, the user will have to scroll down and back up to trigger the callback. It is not fired if the list is at the start already, and there's no way to scroll up (from `bounce`)

![sample](/sample.gif)

## Installing Locally

```
npm i
```

## Examples

Working examples of these components in a react-native project can be found in the `/examples` directory. To run them, `cd` to the example you want to run and...

```
npm i
react-native run-ios
```
