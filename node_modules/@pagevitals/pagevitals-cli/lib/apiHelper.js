const axios = require('axios');
const ora = require('ora');

const API_BASE_URL = 'https://api.pagevitals.com';

async function makeApiCall(endpoint, method, options, apiToken, showSpinnerResults = true) {
    const spinner = showSpinnerResults ? ora('Processing request...').start() : null;
    const headers = { 'Authorization': `Bearer ${apiToken}` };

    try {
        let response;
        if (method === 'get') {
            response = await axios.get(endpoint, { headers, params: options });
        } else if (method === 'post') {
            response = await axios.post(endpoint, options, { headers });
        } else {
            throw new Error(`Unsupported HTTP method: ${method}`);
        }

        spinner?.succeed('Request processed successfully');
        return response.data;
    } catch (error) {
        spinner?.fail('Request failed');
        throw error;
    }
}

module.exports = { makeApiCall, API_BASE_URL };
