/**
 * Filter and count data according to README.md
 * @param {string} pattern
 *        A case-sensitive string pattern
 * @param {boolean} count
 *        Whether to add counting information according to README.md
 * @param {Array} data
 *        An array of countries element
 * @returns {Array}
 *        A new array containing filtered countries, people and animals
 */
function filterCountData(pattern, count, data) {

  // here we use the function Array.reduce() to map and filter the input data at the same time

  function peopleReducer(result, people) {
    const animals = people.animals.filter(animal => animal.name.includes(pattern));
    if (animals.length > 0) {
      result.push({
        ...people,
        name: count ? `${people.name} [${animals.length}]` : people.name,
        animals
      });
    }
    return result;
  }

  function countryReducer(result, country) {
    const people = country.people.reduce(peopleReducer, []);
    if (people.length > 0) {
      result.push({
        ...country,
        name: count ? `${country.name} [${people.length}]` : country.name,
        people
      });
    }
    return result;
  }

  return data.reduce(countryReducer, []);
}

/**
 * Parse command-line arguments
 * @param   {Array} argv
 *          Similar to process.argv
 * @returns {{pattern: string|undefined, count: boolean|undefined, error: undefined|{reason: string}}}}
 *          An object containing either the parsed options if arguments are valid or an error.
 */
function parseArgs(argv) {

  // if no pattern is provided, the default value is an empty string, which does not filter anything.
  let pattern = "";
  let count = false;

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith("--filter=")) {
      pattern = arg.split("=")[1];
    }
    else if (arg === "--count") {
      count = true;
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
    count
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

  const result = filterCountData(options.pattern, options.count, sampleData);

  console.log(JSON.stringify(result, null, 2));
}

// do not run the main function if imported by unit tests
if (require.main === module) {
  main(process.argv)
}

module.exports = {
  filterCountData,
  parseArgs
}