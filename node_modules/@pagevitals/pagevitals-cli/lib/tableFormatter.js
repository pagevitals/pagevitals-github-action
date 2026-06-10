const chalk = require('chalk');

function formatTable(headers, rows, columnWidths, columnTypes) {
    let output = '\n';
  
    output += '┌' + columnWidths.map(w => '─'.repeat(w + 2)).join('┬') + '┐\n';
    output += '│ ' + headers.map((h, i) => chalk.bold(padRight(h, columnWidths[i]))).join(' │ ') + ' │\n';
    output += '├' + columnWidths.map(w => '─'.repeat(w + 2)).join('┼') + '┤\n';
  
    rows.forEach(row => {
        output += '│ ' + row.map((cell, i) => {
            const paddedCell = padRight(cell, columnWidths[i]);
            if (columnTypes?.[i] === 'score') {
                return colorScore(cell, columnWidths[i]);
            }
            return chalk.reset(paddedCell);
        }).join(' │ ') + ' │\n';
    });
  
    output += '└' + columnWidths.map(w => '─'.repeat(w + 2)).join('┴') + '┘\n';
  
    return output;
}

function padRight(str, length) {
    return (str + ' '.repeat(length)).slice(0, length);
}

function colorScore(score, padding) {
    const paddedScore = padRight(score?.toString() ?? "-", padding);
    
    if (score >= 90) return chalk.green(paddedScore);
    if (score >= 50) return chalk.yellow(paddedScore);
    return chalk.red(paddedScore);
}

module.exports = { formatTable, padRight };
