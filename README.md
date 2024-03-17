![Langauge](https://badge.langauge.io/thewizarodofoz/google-ad-manager-api)

# Google Ad Manager Node.js API

A modern wrapper around Google's [Ad Manager API](https://developers.google.com/ad-manager/docs/start).

## Features

- Promise based - use Promise or async/await
- Non opinionated about auth mechanisms - obtain a token however you like
- Typed (TypeScript)

## Install

```bash
npm i --save google-ad-manager-api
```

## Usage

### Step #1

Obtain an access token in whatever way you like, for example using [Google Auth Library](https://github.com/google/google-auth-library-nodejs)'s [JSON Web Tokens](https://github.com/google/google-auth-library-nodejs#json-web-tokens) mechanism:

```ts
const { auth } = require("google-auth-library");

const keys = {
  type: "service_account",
  project_id: "...",
  private_key_id: "...",
  private_key: "...",
  client_email: "...",
  client_id: "...",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "...",
};

const client = auth.fromJSON(keys);
client.scopes = ["https://www.googleapis.com/auth/GoogleAdManager"];
await client.authorize();
```

### Step #2:

Create a GoogleAdManager client:

```ts
import { GoogleAdManagerClient } from "google-ad-manager-api";
const GoogleClient = new GoogleAdManagerClient({
  networkCode: "...",
  apiVersion: "v201805",
});
```

### Step #3

Use the client to create a service, and pass the auth token from step #1: Pass the token directly to `getService`:

```ts
const lineItemService = await GoogleAdManager.getService(
  "LineItemService",
  <the token obtained from google-auth>
);
```

### Step #4

Invoke service methods:

```ts
// const res = await lineItemService.getLineItemsByStatement({
//   filterStatement: {
//     query: "WHERE name LIKE 'prebid%'",
//   },
// });

// console.log(res.results[0].id);
```

## Notes

- The [Ad Manager API](https://developers.google.com/ad-manager/docs/rel_notes) returns an `rval` field for each method invocation.
  To make things easier, this package will return the content of that field.
  For example, invocation of [`LineItemService.getLineItemsByStatement`](https://developers.google.com/ad-manager/docs/reference/v201805/LineItemService#getlineitemsbystatement) will return a [`LineItemPage`](https://developers.google.com/ad-manager/docs/reference/v201805/LineItemService.LineItemPage) object directly.
- Google auth tokens have expiration dates and they need to be updated or refreshed in some way. Because authentication management is outside the scope of this package, make sure to always pass the new tokens to the services instances using `service.setToken`.
