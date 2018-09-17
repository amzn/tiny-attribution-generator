// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: Apache-2.0

import JsonRenderer from '../../outputs/json';

test('should render json', () => {
  const jsonRenderer = new JsonRenderer();
  const licenseBuckets = [
    {
      id: '1',
      text: 'license text',
      name: 'LIC',
      tags: [],
      packages: [
        {
          name: 'package1',
          version: '1.0.0',
        },
      ],
    },
  ];
  const output = jsonRenderer.render(licenseBuckets);
  expect(output).toEqual({
    packages: [
      {
        name: 'package1',
        version: '1.0.0',
      },
    ],
  });
});

test('should flatten buckets', () => {
  const jsonRenderer = new JsonRenderer();
  const licenseBuckets = [
    {
      id: '1',
      text: 'license text',
      name: 'LIC',
      tags: [],
      packages: [
        {
          name: 'package1',
          version: '1.0.0',
        },
      ],
    },
    {
      id: '2',
      text: 'second license text',
      name: 'MIT',
      tags: [],
      packages: [
        {
          name: 'package2',
          version: '2.0.0',
        },
      ],
    },
  ];
  const output = jsonRenderer.render(licenseBuckets);
  expect(output).toEqual({
    packages: [
      {
        name: 'package1',
        version: '1.0.0',
      },
      {
        name: 'package2',
        version: '2.0.0',
      },
    ],
  });
});
