# PageVitals Test Action

This GitHub Action allows you to trigger PageVitals tests for your website directly from your GitHub workflow.

## Inputs

- `api_key`: **Required**. Your PageVitals API Key (first you need to [obtain one](https://pagevitals.com/docs/rest-api/authentication/))
- `website_id`: **Required**. The ID of the site you want to test.
- `pages`: **Optional**. A list of pages/devices to be tested, if you don't want all pages to be tested.
- `description`: **Optional**. Add a release tag or commit message from GitHub, to be shown in PageVitals UI.
- `max_failed_tests`: **Optional**. Maximum number of failed tests before this action fails. Defaults to no maximum.
- `performance_threshold`: **Optional**. Minimum average performance score threshold (0-100). Defaults to no threshold.
- `accessibility_threshold`: **Optional**. Minimum average accessibility score threshold (0-100). Defaults to no threshold.
- `best_practices_threshold`: **Optional**. Minimum average best practices score threshold (0-100). Defaults to no threshold.
- `seo_threshold`: **Optional**. Minimum average SEO score threshold (0-100). Defaults to no threshold.
- `budgets_exceeded_threshold`: **Optional**. Fail the action if the number of budgets exceeded surpasses this value. Defaults to no threshold.

## Outputs

- `test_results`: A JSON string containing the full test results.

## Usage

### Just run the tests

If you just want to run all tests, and let the action succeed no matter what, simply use this:

```yaml
steps:
  - uses: actions/checkout@v3

  - name: Run PageVitals Test
    uses: pagevitals/pagevitals-github-action@v1
    with:
      api_key: ${{ secrets.PAGEVITALS_API_KEY }}
      website_id: k4hj3k5nm3
```

Make sure to set your PageVitals API key as a secret in your GitHub repository settings.

### Specify pages and devices

If you want to specify which pages and devices you want tested, you can use the `pages` parameter:

```yaml
steps:
  - uses: actions/checkout@v3

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

### Commit message or version number

You can add a description to the test series which can be seen in PageVitals UI. Typically this could be the release tag, or the latest commit message. In this example, the release tag is used:

```yaml
steps:
  - uses: actions/checkout@v3

  - name: Run PageVitals Test
    uses: pagevitals/pagevitals-github-action@v1
    with:
      api_key: ${{ secrets.PAGEVITALS_API_KEY }}
      website_id: k4hj3k5nm3
      description: ${{ github.event.release.tag_name }}
```

Other GitHub variables can be seen [here](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/accessing-contextual-information-about-workflow-runs#github-context)

### Fail based on thresholds

If you want the action to fail based on a number of thresholds such as max failed tests, exceeded budgets, or Lighthouse score thresholds, use this:

```yaml
steps:
  - uses: actions/checkout@v3

  - name: Run PageVitals Test
    uses: pagevitals/pagevitals-github-action@v1
    with:
      api_key: ${{ secrets.PAGEVITALS_API_KEY }}
      website_id: k4hj3k5nm3
      max_failed_tests: 0
      budgets_exceeded_threshold: 0
      performance_threshold: 90
      accessibility_threshold: 90
      best_practices_threshold: 90
      seo_threshold: 90
```

When using one or more of these thresholds, the action will fail if one or more of the thresholds are exceeded.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
