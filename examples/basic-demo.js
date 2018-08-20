// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const DocBuilder = require('tiny-attribution-generator').default;
const TextRenderer = require('tiny-attribution-generator/lib/outputs/text')
  .default;
const JSONSource = require('tiny-attribution-generator/lib/inputs/json')
  .default;

const renderer = new TextRenderer();
const builder = new DocBuilder(renderer);

const packageData = JSON.stringify({
  packages: [
    {
      name: 'Test Package',
      version: '1.0',
      license: 'MIT',
      copyrights: ['Copyright (c) Test Package author']
    },
  ],
});

const source = new JSONSource(packageData);
builder.read(source);

const output = builder.build();
const annotations = renderer.annotations;

console.log(output);
console.log(annotations);
