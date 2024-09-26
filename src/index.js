const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
    try {
        const apiKey = core.getInput('api_key');
        const websiteId = core.getInput('website_id');
        const pages = core.getInput('pages');
        const description = core.getInput('description');
        
        const performanceThreshold = parseInt(core.getInput('performance_threshold'));
        const accessibilityThreshold = parseInt(core.getInput('accessibility_threshold'));
        const bestPracticesThreshold = parseInt(core.getInput('best_practices_threshold'));
        const seoThreshold = parseInt(core.getInput('seo_threshold'));
        const budgetsExceededThreshold = parseInt(core.getInput('budgets_exceeded_threshold'));
        const maxFailedTests =  parseInt(core.getInput('max_failed_tests'));

        // Set the API token
        await exec.exec('npx', ['@pagevitals/pagevitals-cli', 'token', apiKey]);

        // Prepare the command arguments
        let args = ['@pagevitals/pagevitals-cli', 'run-tests', '--website', websiteId, '--output', 'json', '--initiator', 'GitHub'];

        if (description) {
            args.push("--description", description);
        }

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

        const jsonResults = JSON.parse(output);
        core.setOutput('test_results', JSON.stringify(jsonResults));

        // Fail step if the whole test series fails
        if (jsonResults.status === "failed") {
            core.setFailed(`Test series failed. Number of failed tests: ${jsonResults.failed_tests}`);
            return;
        }

        // Check if max failed tests is exceeded
        if (!isNaN(maxFailedTests) && jsonResults.failed_tests > maxFailedTests) {
            core.setFailed(`Too many tests failed. Threshold: ${maxFailedTests}, actual failed tests: ${jsonResults.failed_tests}.`);
            return;
        }

        // Check if performance meets the threshold
        const avgPerformanceScore = jsonResult.result.list.reduce((total, next) => total + next.performance_score, 0) / jsonResults.results.list.length;
        if (!isNaN(performanceThreshold) && avgPerformanceScore < performanceThreshold) {
            core.setFailed(`Average performance score ${avgPerformanceScore} is below the threshold of ${performanceThreshold}`);
            return;
        }

        // Check if accessibility meets the threshold
        const avgAccessibilityScore = jsonResult.result.list.reduce((total, next) => total + next.accessibility_score, 0) / jsonResults.results.list.length;
        if (!isNaN(accessibilityThreshold) && avgAccessibilityScore < accessibilityThreshold) {
            core.setFailed(`Average accessibility score ${avgAccessibilityScore} is below the threshold of ${accessibilityThreshold}`);
            return;
        }

        // Check if performance meets the threshold
        const avgBestPracticesScore = jsonResults.result.list.reduce((total, next) => total + next.best_practices_score, 0) / jsonResults.results.list.length;
        if (!isNaN(bestPracticesThreshold) && avgBestPracticesScore < bestPracticesThreshold) {
            core.setFailed(`Average best practices score ${avgBestPracticesScore} is below the threshold of ${bestPracticesThreshold}`);
            return;
        }

        // Check if performance meets the threshold
        const avgSeoScore = jsonResults.result.list.reduce((total, next) => total + next.seo_score, 0) / jsonResults.results.list.length;
        if (!isNaN(seoThreshold) && avgSeoScore < seoThreshold) {
            core.setFailed(`Average SEO score ${avgSeoScore} is below the threshold of ${seoThreshold}`);
            return;
        }

        // Check if any budget is exceeded
        const budgetsExceeded = jsonResults.result.list.reduce((total, next) => total + next.seo_score, 0);
        if (!isNaN(budgetsExceededThreshold) && budgetsExceeded > budgetsExceededThreshold) {
            core.setFailed(`Exceeded budgets ${budgetsExceeded} is greater than the threshold of ${budgetsExceededThreshold}`);
            return;
        }

        console.log(`Tests completed successfully. Performance score: ${Math.round(avgPerformanceScore)}, 
            Accessibility score: ${Math.round(avgPerformanceScore)}, 
            Best practices score: ${Math.round(avgBestPracticesScore)}, 
            SEO score: ${Math.round(avgBestPracticesScore)}, 
            Budgets exceeded: ${budgetsExceeded}`);

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
