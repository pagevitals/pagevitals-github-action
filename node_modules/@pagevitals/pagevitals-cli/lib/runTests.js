const { makeApiCall, API_BASE_URL } = require('./apiHelper');
const { formatTable } = require('./tableFormatter');
const chalk = require('chalk');
const ora = require('ora');

async function runTests(options, apiToken, details) {
  const endpoint = `${API_BASE_URL}/${options.website}/testseries`;

  // Format the pages data
  options.page = options.page ? options.page.map(p => {
    const [pageId, device] = p.split(',');
    return { page_id: pageId, device };
  }) : undefined;

  let data = await makeApiCall(endpoint, 'post', options, apiToken);

  if (details.polling && details.polling.enabled) {
    data = await pollForCompletion(data, options, apiToken, details.polling);
  }

  return options.output === 'json' ? data : formatTestResults(data);
}

async function pollForCompletion(initialData, options, apiToken, pollingDetails) {
  const spinner = ora('Waiting for test completion...').start();
  let pollEndpoint = `${API_BASE_URL}/${options.website}/${pollingDetails.endpoint}`;

  pollEndpoint = pollEndpoint.replace(/{(\w+)}/g, (match, property) => {
    return initialData[property] || match;
  });

  while (true) {
    await new Promise(resolve => setTimeout(resolve, pollingDetails.interval));
    
    try {
      const response = await makeApiCall(pollEndpoint, 'get', {}, apiToken, false);
      if (response.status === 'completed' || response.status === 'failed') {
        spinner.succeed(`Test ${response.status}`);
        return response;
      }
    } catch (error) {
      spinner.fail('Polling failed');
      throw error;
    }
  }
}

function formatTestResults(data) {
  const { id, website, status, count, failed_tests, result } = data;
  
  let output = '\n';
  output += chalk.bold(`Test series ID: ${id}\n`);
  output += chalk.bold(`Website ID: ${website}\n`);
  output += chalk.bold(`Overall Status: ${status}\n`);
  output += chalk.bold(`Number of Tests: ${count}\n`);
  output += chalk.bold(`Failed Tests: ${failed_tests}\n\n`);

  const headers = ['Page', 'Device', 'Performance', 'Accessibility', 'Best Practices', 'SEO'];
  const columnWidths = [20, 8, 11, 13, 14, 5];
  const columnTypes = ["string", "string", "score", "score", "score", "score"];
  const rows = result.list.map(test => [
    test.page.alias,
    test.device,
    test.performance_score,
    test.accessibility_score,
    test.best_practices_score,
    test.seo_score
  ]);
  
  output += formatTable(headers, rows, columnWidths, columnTypes);

  return output;
}

module.exports = runTests;
