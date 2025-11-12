# DfE Sign-in UI Toolkit

**DfE Sign-in UI Toolkit** provides frontend scripts and styles via a CDN to support various DSI frontend components. This includes a snapshot of the GDS Design System, along with additional scripts and styles for custom frontend components. This service is part of the wider **login.dfe** project.

## Getting Started

### Install Dependencies

```
npm install
```

### Run application

Run the server

```
npm run start
```

This will run current version of the toolkit in the port configured in server.js, then you will be able to access it in other components setting the URL that points to the assets to that local URL.

### Update the compiled CSS

For dev purposes:

```
npm run dev
```

This will compile and run the server. Compiled files will also have sourcemaps.

**Before committing a final version to be merged:**

```
npm run build
```

This will compile the CSS without generating sourcemaps, producing the files that will be released to production.

### Code Quality and Formatting

Run ESLint:

```
npm run lint
```

Automatically fix lint issues:

```
npm run lint:fix
```

### Pre-commit Hooks

Pre-commit hooks are handled automatically via Husky. No additional setup is required.
