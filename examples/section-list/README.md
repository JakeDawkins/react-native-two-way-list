# Infinite SectionList

This is a work-in-progress for an 2-way infinite scrolling `SectionList` in React Native.

It's pretty much just a wrapper around SectionList that does:
- holds scroll position when adding sections to the top.
- fires a function (prop) when the user scrolls to the top of the list.

## Props

Can be used with all of [SectionList's props](https://facebook.github.io/react-native/docs/sectionlist.html).


### `onStartReached`

Function to fire when the user scrolls into the region defined by `onStartReachedThreshold` (or the very top if not defined). Only fires when user is scrolling toward the start.

### `onStartReachedThreshold`

How far from the start (in units of visible length of the list) the bottom edge of the
list must be from the start of the content to trigger the `onStartReached` callback.
Thus a value of 0.5 will trigger `onStartReached` when the start of the content is
within half the visible length of the list.

**IMPORTANT**: if this is 0/undefined AND `bounces={false}`, the user will have to scroll down and back up
   to trigger the callback.

![sample](/sample.gif)
