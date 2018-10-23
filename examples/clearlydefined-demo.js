// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: Apache-2.0

const DocBuilder = require('../lib/docbuilder').default;
const TextRenderer = require('../lib/outputs/text').default;
const ClearlyDefinedSource = require('../lib/inputs/clearlydefined').default;

const renderer = new TextRenderer();
const builder = new DocBuilder(renderer);

// see https://docs.clearlydefined.io/using-data
const packageData = JSON.stringify({
  coordinates: [
    'npm/npmjs/-/lodash/4.17.11',
    'npm/npmjs/-/request/2.88.0',
    'npm/npmjs/@angular/core/6.0.1',
    'nuget/nuget/-/newtonsoft.json/11.0.2',
    'git/github/facebook/react/v15.6.1',
  ],
});

const source = new ClearlyDefinedSource(packageData);
builder.read(source).then(() => {
  const output = builder.build();
  const annotations = renderer.annotations;

  console.log(output);
  console.log(annotations);
});
