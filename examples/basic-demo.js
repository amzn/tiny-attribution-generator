// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const DocBuilder = require('../lib/docbuilder').default;
const TextRenderer = require('../lib/outputs/text').default;
const JSONSource = require('../lib/inputs/json').default;

const renderer = new TextRenderer();
const builder = new DocBuilder(renderer);

const packageData = JSON.stringify({
  packages: [
    {
      name: 'Test Package',
      version: '1.0',
      license: 'MIT',
      copyrights: ['Copyright (c) Test Package author'],
    },
  ],
});

const source = new JSONSource(packageData);
builder.read(source);

const output = builder.build();
const annotations = renderer.annotations;

console.log(output);
console.log(annotations);
