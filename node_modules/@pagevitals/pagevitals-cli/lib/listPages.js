const { makeApiCall, API_BASE_URL } = require('./apiHelper');
const { formatTable } = require('./tableFormatter');

async function listPages(options, apiToken) {
    const endpoint = `${API_BASE_URL}/${options.website}/settings/pages`;
    const data = await makeApiCall(endpoint, 'get', options, apiToken);
    return options.output === 'json' ? data : formatPagesTable(data);
}

function formatPagesTable(data) {
    const { result } = data;
    
    const headers = ['ID', 'Alias', 'URL'];
    const rows = result.list.map(page => [page.id, page.alias, page.url]);
    const columnWidths = [10, 28, 42];

    return formatTable(headers, rows, columnWidths);
}

module.exports = listPages;
