// const getTotalItemIndex = sections => {
//   return sections.reduce((acc, section) => acc + section.data.length + 1, 0);
// };
//
// const getTotalHeight = (layoutFn, data, totalItemIndex) => {
//   new Array(totalItemIndex).fill().map((x, i) => {
//     const layout = layoutFn(data, i);
//     console.log({ i, layout });
//   });
//   const { offset, length } = layoutFn(data, totalItemIndex - 1);
//   return offset + length;
// };
