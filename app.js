/**
 * Filter data according to README.md
 * @param {string} pattern
 *        A case-sensitive string pattern
 * @param {Array} data
 *        An array of countries element
 * @returns {Array}
 *        A new array containing filtered countries, people and animals
 */
function filterData(pattern, data) {

  // here we use the function Array.reduce() to map and filter the input data at the same time

  function peopleReducer(result, people) {
    const animals = people.animals.filter(animal => animal.name.includes(pattern));
    if (animals.length > 0) {
      result.push({...people, animals});
    }
    return result;
  }

  function countryReducer(result, country) {
    const people = country.people.reduce(peopleReducer, []);
    if (people.length > 0) {
      result.push({...country, people});
    }
    return result;
  }

  return data.reduce(countryReducer, []);
}

/**
 * Parse command-line arguments
 * @param   {Array} argv
 *          Similar to process.argv
 * @returns {{pattern: string|undefined, error: undefined|{reason: string}}}}
 *          An object containing either the parsed options if arguments are valid or an error.
 */
function parseArgs(argv) {

  // if no pattern is provided, the default value is an empty string, which does not filter anything.
  let pattern = "";

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith("--filter=")) {
      pattern = arg.split("=")[1];
    }
    else {
      return {
        error: {
          reason: `unknown argument '${arg}'`
        }
      }
    }
  }

  return {
    pattern,
  }
}

function main(argv) {

  const sampleData = require("./data.js").data;
  const options = parseArgs(argv);

  if (options.error) {
    console.error('Error:', options.error.reason);
    console.error("Usage: node app.js [--filter=<pattern>]")
    process.exit(1);
  }

  const result = filterData(options.pattern, sampleData);

  console.log(JSON.stringify(result, null, 2));
}

// do not run the main function if imported by unit tests
if (require.main === module) {
  main(process.argv)
}

module.exports = {
  filterData,
  parseArgs
}