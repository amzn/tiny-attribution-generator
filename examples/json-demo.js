// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: Apache-2.0

const DocBuilder = require('../lib/docbuilder').default;
const TextRenderer = require('../lib/outputs/text').default;
const JsonRenderer = require('../lib/outputs/json').default;
const JSONSource = require('../lib/inputs/json').default;

const jsonRenderer = new JsonRenderer();
const textRenderer = new TextRenderer();
const jsonBuilder = new DocBuilder(jsonRenderer);
const textBuilder = new DocBuilder(textRenderer);

// Initial package data
const packageData = JSON.stringify({
  packages: [
    {
      name: 'aabb',
      version: '1.0.4',
      license: 'MIT',
      website: 'https://github.com/testpackage/aabb',
      copyrights: ['Copyright (c) Test copyright'],
    },
    {
      name: 'bbcc',
      version: '1.1.1',
      license: 'ISC',
      website: 'https://github.com/testpackage/bbcc',
    },
  ],
});

const jsonSource = new JSONSource(packageData);
jsonBuilder.read(jsonSource);

// Use the JsonRenderer to build
const jsonOutput = jsonBuilder.build();

// Push a new package onto the output of the previous builder
jsonOutput.packages.push({
  name: 'ccdd',
  version: '2.0.0',
  license: 'MIT',
  website: 'https://github.com/testpackage/ccdd',
});

// Build the final result with the TextRenderer
const nextPackageData = JSON.stringify(jsonOutput);
const textSource = new JSONSource(nextPackageData);
textBuilder.read(textSource);

const output = textBuilder.build();

console.log(output);
