/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SectionList } from '../../';

import { groupBy } from 'lodash/fp';

const ITEM_HEIGHT = 150;
const HEADER_HEIGHT = 150;
const MARGIN = 8;

const ContentItem = ({item}) => {
  return (
    <View
      style={{ height: ITEM_HEIGHT, backgroundColor: 'blue', marginBottom: MARGIN }}>
      <Text style={{color: 'white'}}>{item.num}</Text>
    </View>
  );
};

const HeaderItem = ({ title }) => {
  return (
    <View
      style={{
        height: HEADER_HEIGHT,
        backgroundColor: 'white',
        marginBottom: MARGIN,
      }}>
      <Text style={{fontSize: 24}}>GROUP {title}</Text>
    </View>
  );
};

let counter = 0;
const generateRandomItem = () => ({ id: Math.floor(Math.random() * 100000) });
const groupByRemainder = groupBy(({ id }) => id % 7);
const makeSections = (groups, i) =>
  Object.keys(groups).map(g => ({ data: groups[g].map(data => ({...data, num: counter++})), title: i }));
const makeRandomSections = i => {
  const arr = new Array(15).fill().map(generateRandomItem);
  return makeSections(groupByRemainder(arr), i);
};

export default class App extends Component<{}> {
  _counter = 0;
  state = {
    sections: makeRandomSections(0),
  };

  render() {
    return (
      <View style={{ marginTop: 16, flex: 1 }}>
        <SectionList
          bounces={false}
          flashScrollIndicators={true}
          initialNumToRender={30}
          keyExtractor={item => item.id}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={20}
          sections={this.state.sections}
          stickySectionHeadersEnabled={false}
          style={styles.list}
          // contentContainerStyle={style}
          scrollEventThrottle={16}
          renderSectionHeader={({ section }) => {
            return <HeaderItem title={section.title} />;
          }}
          renderItem={ContentItem}
          getItemLayout={this.getItemLayout}
          // initialScrollIndex={initialScrollIndex}
          onViewableItemsChanged={info => {
            // console.log({ info });
          }}
          onStartReachedThreshold={0.5}
          onStartReached={this.onStartReached}
        />
      </View>
    );
  }

  onStartReached = () => {
    this._counter = this._counter + 1;
    const sectionsToAdd = makeRandomSections(this._counter);
    this.setState(({ sections }) => ({
      sections: [...sectionsToAdd, ...sections],
    }));
  };

  onEndReached = () => {
    // this._counter = this._counter + 1;
    // const sectionsToAdd = makeRandomSections(this._counter);
    // this.setState(({ sections }) => ({
    //   sections: [...sections, ...sectionsToAdd],
    // }));
  };

  flattenDataShape = sections => {
    let sectionIndex = 0;
    return sections.reduce((flattened, section) => {
      let itemIndex = 0;
      return [
        ...flattened,
        { title: section.title, __type: 'section_header', sectionIndex: sectionIndex++ },
        ...section.data.map(d => ({
          __type: 'data',
          data: d,
          itemIndex: itemIndex++,
        })),
        { __type: 'section_footer' },
      ];
    }, []);
  };

  getItemLayout = (data, i) => {
    const flat = this.flattenDataShape(data);
    const offsets = flat.map((item) => {
      if(item.__type === 'section_header') return HEADER_HEIGHT + MARGIN;
      if(item.__type === 'data') return ITEM_HEIGHT + MARGIN;
      return 0; // section footer
    });

    const res = {
      length: offsets[i] || 0,
      offset: offsets.slice(0, Math.max(i - 1, 0)).reduce((a, o) => a + o, 0),
      index: i,
    };

    return res;
  };
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
