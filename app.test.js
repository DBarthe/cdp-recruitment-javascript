const app = require('./app');
const sampleData = require('./data').data;

test('filterCountData match all', () => {
  expect(app.filterCountData("", false, sampleData)).toEqual(sampleData);
})

test('filterCountData match none', () => {
  expect(app.filterCountData("too complicated", false, sampleData)).toEqual([]);
})

test('filterCountData match specific', () => {
  expect(app.filterCountData("ry", false, sampleData)).toEqual([
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

test('filterCountData count correct numbers', () => {
  for (const country of app.filterCountData("", true, sampleData)) {
    expect(country.name).toMatch(new RegExp(`.* \\[${country.people.length}\\]`))
    for (const person of country.people) {
      expect(person.name).toMatch(new RegExp(`.* \\[${person.animals.length}\\]`))
    }
  }
})

test('filterCountData count exact match', () => {

  const testData = [{
    name: "c1",
    people: [{
      name: "p1",
      animals: [{
        name: "a1"
      }, {
        name: "a2"
      }, {
        name: "a3"
      }]
    }, {
      name: "p2",
      animals: [{
        name: "a4"
      }]
    }]
  }, {
    name: "c2",
    people: [{
      name: "p3",
      animals: [{
        name: "a5"
      }]
    }]
  }]

  const expectedResult = [{
    name: "c1 [2]",
    people: [{
      name: "p1 [3]",
      animals: [{
        name: "a1"
      }, {
        name: "a2"
      }, {
        name: "a3"
      }]
    }, {
      name: "p2 [1]",
      animals: [{
        name: "a4",
      }]
    }]
  }, {
    name: "c2 [1]",
    people: [{
      name: "p3 [1]",
      animals: [{
        name: "a5"
      }]
    }]
  }]

  expect(app.filterCountData("", true, testData)).toEqual(expectedResult);
})



test('parseArgs invalid syntax', () => {
  expect(app.parseArgs(["node", "app.js", "--foo"])).toHaveProperty("error");
})

test('parseArgs valid syntax filter', () => {
  expect(app.parseArgs(["node", "app.js", "--filter=foo"])).toEqual({
    pattern: "foo",
    count: false
  });
})

test('parseArgs valid syntax count', () => {
  expect(app.parseArgs(["node", "app.js", "--count"])).toEqual({
    pattern: "",
    count: true
  });
})

test('parseArgs valid syntax count and filter', () => {
  expect(app.parseArgs(["node", "app.js", "--filter=foo", "--count"])).toEqual({
    pattern: "foo",
    count: true
  });
})

test('parseArgs default values', () => {
  expect(app.parseArgs(["node", "app.js"])).toEqual({
    pattern: "",
    count: false
  });
})