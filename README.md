# Morrow

A small Expo Router storefront demo with a curated product catalog, product details, and a persistent shopping bag.

## Run locally

```bash
npm install
npx expo start
```

Use the Expo CLI prompts to open the app on a device, emulator, or web browser.

## Features

- Sign-in and registration forms validated with Yup and React Hook Form.
- Remember-me saves only the demo profile on the device; passwords are never stored.
- Searchable, filterable sample catalog with product detail pages.
- Shopping bag quantities and items persist locally with AsyncStorage.
- Checkout is a demo interaction and does not collect payment.

Authentication is intentionally demo-only: any email and password that pass form validation can sign in. No account data is sent to a server. Replace the local demo flow with an authentication service before using this app with real accounts.
