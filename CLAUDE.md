# SODAX UI - Project Rules

## npm install failures

If `npm install` fails, delete `node_modules` and `package-lock.json` and retry:

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps --ignore-scripts
```

The `--legacy-peer-deps` flag is needed because `@sodax/wallet-sdk` bundles an older version of `@sodax/types` that has peer dependency conflicts with the top-level version. The `--ignore-scripts` flag skips native module compilation (e.g., `usb`, `bufferutil`) which can fail in some environments.
