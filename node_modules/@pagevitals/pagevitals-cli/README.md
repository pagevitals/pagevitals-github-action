# PageVitals CLI

PageVitals CLI is a command-line interface tool for interacting with the PageVitals API, allowing you to run performance tests and manage your PageVitals account from the terminal.

## Installation

```bash
npm install -g pagevitals-cli
```

## Usage

### Setting API Token

Before using the CLI, you need to set your API token. You can do this by running:

```bash
pagevitals token <your_api_token>
```

### Listing Websites

To list all websites associated with your account and their IDs:

```bash
pagevitals list-websites
```

### Listing Pages

To list all pages for a specific website:

```bash
pagevitals list-pages --website <website_id>
```

### Running Tests

To run performance tests for a website, use the following command:

```bash
pagevitals run-tests --website <website_id>
```

If you want to limit the pages and devices you're testing, use the --page command like this:

```bash
pagevitals run-tests --website <website_id> --page <page_id1>,<device1> --page <page_id2,<device2> ...
```

For more information on available commands, use:

```bash
pagevitals --help
```

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## About PageVitals

PageVitals is a comprehensive web performance monitoring and optimization platform. Learn more at [https://pagevitals.com](https://pagevitals.com).

## Changelog

For a detailed changelog, please see [CHANGELOG.md](CHANGELOG.md).

## Security

If you discover any security-related issues, please email security@pagevitals.com instead of using the issue tracker.
