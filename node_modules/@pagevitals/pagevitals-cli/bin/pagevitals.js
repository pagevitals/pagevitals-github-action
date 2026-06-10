#!/usr/bin/env node

const { program } = require('commander');
const Conf = require('conf');
const listWebsites = require('../lib/listWebsites');
const listPages = require('../lib/listPages');
const runTests = require('../lib/runTests');
const apiCalls = require('../config/apiCalls.json');

const config = new Conf({ projectName: 'pagevitals' });

program.version('1.1.4');

// Set API token
program
    .command('token <token>')
    .description('Set the API token')
    .action((token) => {
        config.set('apiToken', token);
        console.log('API token set successfully.');
    });

// Dynamically create commands based on apiCalls.json
Object.entries(apiCalls).forEach(([command, details]) => {
    const cmd = program.command(command);
    cmd.description(details.description);

    details.options.forEach(option => {
        if (option.required) {
            cmd.requiredOption(option.flag, option.description, option.defaultValue);
        } else if (option.multiple) {
            cmd.option(option.flag, option.description, (value, previous) => previous.concat([value]), [], option.defaultValue);
        } else {
            cmd.option(option.flag, option.description, option.defaultValue);
        }
    });

    // Add the --output option to all commands
    cmd.option('--output <format>', 'Output format (json or console)', 'console');
    cmd.option('--token <token>', 'Set API token. Can also be set using the token operation');

    cmd.action(async (options) => {
        const apiToken = options.token || config.get('apiToken');
        if (!apiToken) {
            console.error('API token not set. Use "pagevitals token <token>" to set it.');
            process.exit(1);
        }
        
        try {
            let result;
            switch (command) {
            case 'list-websites':
                result = await listWebsites(options, apiToken);
                break;
            case 'list-pages':
                result = await listPages(options, apiToken);
                break;
            case 'run-tests':
                result = await runTests(options, apiToken, details);
                break;
            default:
                throw new Error(`Unknown command: ${command}`);
            }

            if (options.output === 'json') {
                console.log(JSON.stringify(result, null, 2));
            } else {
                console.log(result);
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    });
});

program.parse(process.argv);
