const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
    try {
        const apiKey = core.getInput('api_key');
        const websiteId = core.getInput('website_id');
        const performanceThreshold = parseInt(core.getInput('performance_threshold'));
        const pages = core.getInput('pages');
        const failOnExceededBudget = core.getInput('fail_if_budgets_are_exceeded') === 'true';

        // Set the API token
        await exec.exec('npx', ['@pagevitals/pagevitals-cli', 'token', apiKey]);

        // Prepare the command arguments
        let args = ['@pagevitals/pagevitals-cli', 'run-tests', '--website', websiteId, '--output', 'json'];

        // Add pages to test if provided
        if (pages) {
            const pageArray = JSON.parse(pages);
            pageArray.forEach(page => {
                args.push('--page', `${page.page_id},${page.device}`);
            });
        }

        // Run the tests
        let output = '';
        let error = '';
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    error += data.toString();
                }
            }
        };

        await exec.exec('npx', args, options);

        if (error) {
            core.setFailed(`Error running tests: ${error}`);
            return;
        }

        const results = JSON.parse(output);
        core.setOutput('test_results', JSON.stringify(results));

        // Check if performance meets the threshold
        const performanceScore = results.performance_score;
        if (performanceScore < performanceThreshold) {
            core.setFailed(`Performance score ${performanceScore} is below the threshold of ${performanceThreshold}`);
            return;
        }

        // Check if any budget is exceeded
        if (failOnExceededBudget && results.budgets_exceeded) {
            core.setFailed(`One or more budgets were exceeded in the test results`);
            return;
        }

        console.log(`Tests completed successfully. Performance score: ${performanceScore}`);

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();