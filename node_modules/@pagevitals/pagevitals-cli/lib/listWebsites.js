const { makeApiCall, API_BASE_URL } = require('./apiHelper');
const { formatTable } = require('./tableFormatter');

async function listWebsites(options, apiToken) {
    const endpoint = `${API_BASE_URL}/websites`;
    const data = await makeApiCall(endpoint, 'get', options, apiToken);
    return options.output === 'json' ? data : formatWebsitesTable(data);
}

function formatWebsitesTable(data) {
    const { result } = data;

    const headers = ['ID', 'Display Name', 'Domain'];
    const rows = result.list.map(website => [website.id, website.displayName, website.domain]);
    const columnWidths = [10, 28, 28];

    return formatTable(headers, rows, columnWidths);
}

module.exports = listWebsites;
