# DfE UI Toolkit

## Running this site locally

Clone this repository

    git clone git@github.com:DFE-Digital/frontend-toolkit.git

Install all dependencies

    npm install

Run the server

    npm run start

This will run current version of the toolkit in the port configured in server.js,
then you will be able to access it in other components setting the URL that points to the assets
to that local URL.

Update the compiled CSS

For dev purposes:

    npm run dev

It will compile and run the server. Compiled files will also have sourcemaps.

Before committing a final version to be merged:

    npm run build

It will only compile and will not add sourcemaps as these files are then released to prod.
