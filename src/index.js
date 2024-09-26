import { exec as _exec } from '@actions/exec';
import { getInput, setFailed, setOutput } from '@actions/core';

async function run() {
    try {
        const apiKey = getInput('api_key');
        const websiteId = getInput('website_id');
        const pages = getInput('pages');
        const description = getInput('description');
        
        const performanceThreshold = parseInt(getInput('performance_threshold'));
        const accessibilityThreshold = parseInt(getInput('accessibility_threshold'));
        const bestPracticesThreshold = parseInt(getInput('best_practices_threshold'));
        const seoThreshold = parseInt(getInput('seo_threshold'));
        const budgetsExceededThreshold = parseInt(getInput('budgets_exceeded_threshold'));
        const maxFailedTests =  parseInt(getInput('max_failed_tests'));

        // Prepare the command arguments
        let args = ['@pagevitals/pagevitals-cli', 'run-tests', '--token', apiKey, '--website', websiteId, '--output', 'json', '--initiator', 'GitHub'];

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

        await _exec('npx', args, options);

        if (error) {
            setFailed(`Error running tests: ${error}`);
            return;
        }

        const jsonResults = JSON.parse(output);
        setOutput('test_results', JSON.stringify(jsonResults));

        // Fail step if the whole test series fails
        if (jsonResults.status === "failed") {
            setFailed(`Test series failed. Number of failed tests: ${jsonResults.failed_tests}`);
            return;
        }

        // Check if max failed tests is exceeded
        if (!isNaN(maxFailedTests) && jsonResults.failed_tests > maxFailedTests) {
            setFailed(`Too many tests failed. Threshold: ${maxFailedTests}, actual failed tests: ${jsonResults.failed_tests}.`);
            return;
        }

        // Check if performance meets the threshold
        const avgPerformanceScore = jsonResult.result.list.reduce((total, next) => total + next.performance_score, 0) / jsonResults.results.list.length;
        if (!isNaN(performanceThreshold) && avgPerformanceScore < performanceThreshold) {
            setFailed(`Average performance score ${avgPerformanceScore} is below the threshold of ${performanceThreshold}`);
            return;
        }

        // Check if accessibility meets the threshold
        const avgAccessibilityScore = jsonResult.result.list.reduce((total, next) => total + next.accessibility_score, 0) / jsonResults.results.list.length;
        if (!isNaN(accessibilityThreshold) && avgAccessibilityScore < accessibilityThreshold) {
            setFailed(`Average accessibility score ${avgAccessibilityScore} is below the threshold of ${accessibilityThreshold}`);
            return;
        }

        // Check if performance meets the threshold
        const avgBestPracticesScore = jsonResults.result.list.reduce((total, next) => total + next.best_practices_score, 0) / jsonResults.results.list.length;
        if (!isNaN(bestPracticesThreshold) && avgBestPracticesScore < bestPracticesThreshold) {
            setFailed(`Average best practices score ${avgBestPracticesScore} is below the threshold of ${bestPracticesThreshold}`);
            return;
        }

        // Check if performance meets the threshold
        const avgSeoScore = jsonResults.result.list.reduce((total, next) => total + next.seo_score, 0) / jsonResults.results.list.length;
        if (!isNaN(seoThreshold) && avgSeoScore < seoThreshold) {
            setFailed(`Average SEO score ${avgSeoScore} is below the threshold of ${seoThreshold}`);
            return;
        }

        // Check if any budget is exceeded
        const budgetsExceeded = jsonResults.result.list.reduce((total, next) => total + next.seo_score, 0);
        if (!isNaN(budgetsExceededThreshold) && budgetsExceeded > budgetsExceededThreshold) {
            setFailed(`Exceeded budgets ${budgetsExceeded} is greater than the threshold of ${budgetsExceededThreshold}`);
            return;
        }

        console.log(`Tests completed successfully. Performance score: ${Math.round(avgPerformanceScore)}, 
            Accessibility score: ${Math.round(avgPerformanceScore)}, 
            Best practices score: ${Math.round(avgBestPracticesScore)}, 
            SEO score: ${Math.round(avgBestPracticesScore)}, 
            Budgets exceeded: ${budgetsExceeded}`);

    } catch (error) {
        setFailed(error.message);
    }
}

run();
