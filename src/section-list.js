// @flow
import React, { Component } from 'react';
import SectionList from 'react-native/Libraries/Lists/SectionList';
import get from 'lodash.get';
import isEqual from 'lodash.isequal';

type Props = {
  onStartReached?: ?(info: { distanceFromEnd: number }) => void,
  onStartReachedThreshold?: ?number,
  onMomentumScrollEnd?: (ScrollEvent) => any,
  onScrollBeginDrag?: (ScrollEvent) => any,
  onScroll?: (ScrollEvent) => any,
  onLayout?: (LayoutEvent) => any,
};

export default class extends Component<Props> {
  static defaultProps = {
    onStartReachedThreshold: 0,
  };
  
  _listRef: any;
  _onStartAlreadyCalled: boolean = false; // called already for a drag/momentum
  _startThreshold: number = 0; // px from top onStartReached will be called

  componentDidUpdate = (prevProps: Props, prevState: any) => {
    const oldSections = prevProps.sections;
    const newSections = this.props.sections;

    if (Array.isArray(oldSections) && Array.isArray(newSections)) {
      if (!oldSections.length || !newSections.length) return;

      // if items were added to start
      if (!isEqual(oldSections[0], newSections[0])) {
        const numAdded = newSections.length - oldSections.length;
        // XXX probably not the safest way to do this but ¯\_(ツ)_/¯
        const currentPos = get(
          this,
          '_listRef._wrapperListRef._listRef._scrollMetrics.offset',
        );

        this._listRef.scrollToLocation({
          sectionIndex: numAdded,
          itemIndex: 0,
          viewOffset: 0, // get the user back to where they were
          animated: false,
        });
      }
    }
  };

  render = () => (
    <SectionList
      {...this.props}
      overScrollMode="always"
      ref={ref => (this._listRef = ref)}
      onLayout={this.onLayout}
      onMomentumScrollEnd={this.onMomentumScrollEnd}
      onScroll={this.onScroll}
      onScrollBeginDrag={this.onScrollBeginDrag}
    />
  );

  onMomentumScrollEnd = (e: ScrollEvent): void => {
    const { nativeEvent: { contentOffset: { y } } } = e;
    this.props.onMomentumScrollEnd ? this.props.onMomentumScrollEnd(e) : null;
    this._onStartAlreadyCalled = false;
  };

  // reset the callback every time a user starts to drag
  onScrollBeginDrag = (e: ScrollEvent): void => {
    this.props.onScrollBeginDrag ? this.props.onScrollBeginDrag(e) : null;
    this._onStartAlreadyCalled = false;
  };

  onScroll = (e: ScrollEvent): void => {
    const { nativeEvent: { contentOffset: { y } } } = e;
    if (this.props.onScroll && typeof this.props.onScroll === 'function') {
      this.props.onScroll(e);
    }

    // XXX probably not the safest way to do this but ¯\_(ツ)_/¯
    const velocity = get(
      this,
      '_listRef._wrapperListRef._listRef._scrollMetrics.velocity',
    );

    if (
      y <= this._startThreshold && // nearing the top
      velocity < 0 && // scrolling _toward_ the top
      !this._onStartAlreadyCalled && // hasn't been called this drag/momentum
      typeof this.props.onStartReached === 'function'
    ) {
        this._onStartAlreadyCalled = true;
        this.props.onStartReached();
    }
  };

  onLayout = (e: LayoutEvent): void => {
    const { height } = e.nativeEvent.layout;
    const { onLayout, onStartReachedThreshold } = this.props;

    onLayout ? onLayout(e) : null;
    
    const threshold = onStartReachedThreshold ? onStartReachedThreshold : 0;
    this._startThreshold = height * threshold;
  };
}
