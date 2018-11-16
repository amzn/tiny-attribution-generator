// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: Apache-2.0

// This demo shows the package-lock.json file in this repo being run through the generator with a JSON output
// This JSON output is transformed to a ClearlyDefined input and run through the generator again with a TEXT output

const fs = require('fs');
const path = require('path');
const DocBuilder = require('../lib/docbuilder').default;
const JsonRenderer = require('../lib/outputs/json').default;
const TextRenderer = require('../lib/outputs/text').default;
const PackageLockSource = require('../lib/inputs/packagelock').default;
const ClearlyDefinedSource = require('../lib/inputs/clearlydefined').default;

const jsonRenderer = new JsonRenderer();
const jsonBuilder = new DocBuilder(jsonRenderer);
const clearlyDefinedBuilder = new DocBuilder(new TextRenderer());

const packageData = fs.readFileSync(
  path.join(__dirname, '../package-lock.json')
);

const packageLockSource = new PackageLockSource(packageData);
jsonBuilder
  .read(packageLockSource)
  .then(() => jsonBuilder.build())
  .then(jsonOutput => {
    const clearlydefinedInput = {
      coordinates: jsonOutput.packages.map(
        x =>
          x.name.indexOf('/') > -1
            ? `npm/npmjs/${x.name}/${x.version}`
            : `npm/npmjs/-/${x.name}/${x.version}`
      ),
    };
    return clearlyDefinedBuilder.read(
      new ClearlyDefinedSource(JSON.stringify(clearlydefinedInput))
    );
  })
  .then(() => {
    const output = clearlyDefinedBuilder.build();
    console.log(output);
  });
