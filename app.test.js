const app = require('./app');
const {parseArgs} = require("./app");
const sampleData = require('./data').data;

test('filterData match all', () => {
  expect(app.filterData("", sampleData)).toEqual(sampleData);
})

test('filterData match none', () => {
  expect(app.filterData("too complicated", sampleData)).toEqual([]);
})

test('filterData match specific', () => {
  expect(app.filterData("ry", sampleData)).toEqual([
    {
      name: 'Uzuzozne',
      people: [
        {
          name: 'Lillie Abbott',
          animals: [
            {
              name: 'John Dory'
            }
          ]
        }
      ]
    },
    {
      name: 'Satanwi',
      people: [
        {
          name: 'Anthony Bruno',
          animals: [
            {
              name: 'Oryx'
            }
          ]
        }
      ]
    }
  ]);
})

test('parseArgs invalid syntax', () => {
  expect(parseArgs(["node", "app.js", "--foo"])).toHaveProperty("error");
})

test('parseArgs valid syntax', () => {
  expect(parseArgs(["node", "app.js", "--filter=foo"])).toEqual({
    pattern: "foo"
  });
})

test('parseArgs default pattern', () => {
  expect(parseArgs(["node", "app.js"])).toEqual({
    pattern: ""
  });
})