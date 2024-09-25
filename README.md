# PageVitals Test Action

This GitHub Action allows you to trigger PageVitals tests for your website directly from your GitHub workflow.

## Inputs

- `api_key`: **Required**. Your PageVitals API Key (first you need to [obtain one](https://pagevitals.com/docs/rest-api/authentication/))
- `website_id`: **Required**. The ID of the site you want to test.
- `pages`: **Optional**. A list of pages/devices to be tested, if you don't want all pages to be tested.
- `performance_threshold`: **Optional**. The minimum acceptable performance score (0-100). Default is 90.
- `fail_if_budgets_are_exceeded`: **Optional**. Whether to fail the action if any budget is exceeded. Default is false.


## Outputs

- `test_results`: A JSON string containing the full test results.

## Usage

```yaml
steps:
  - uses: actions/checkout@v2

  - name: Run PageVitals Test
    uses: pagevitals/pagevitals-github-action@v1
    with:
      api_key: ${{ secrets.PAGEVITALS_API_KEY }}
      website_id: k4hj3k5nm3
      performance_threshold: 85
```

### Specify pages and deivces

If you want to specify which pages and devices you want tested, you can use the `pages` parameter:

```yaml
steps:
  - uses: actions/checkout@v2

  - name: Run PageVitals Test
    uses: pagevitals/pagevitals-github-action@v1
    with:
      api_key: ${{ secrets.PAGEVITALS_API_KEY }}
      website_id: k4hj3k5nm3
      pages:
        - page_id: fgisepkgou
          device: desktop
        - shares: f0gvcbwwle
          device: mobile
```

Make sure to set your PageVitals API key as a secret in your GitHub repository settings.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
