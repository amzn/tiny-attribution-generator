// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: Apache-2.0

import JSONSource from '../../inputs/json';

test('should get package by key', () => {
  const source = new JSONSource(
    JSON.stringify({
      packages: [
        {
          name: 'Test Package',
          version: '1.0',
          license: 'MIT',
          copyrights: ['Copyright (c) Test Package author'],
        },
      ],
    })
  );

  const result = source.getPackage('Test Package 1.0');
  expect(result).toBeTruthy();
  expect(result).toEqual({
    name: 'Test Package',
    version: '1.0',
    license: 'MIT',
    copyrights: ['Copyright (c) Test Package author'],
  });
});

test('should not get package by bad key', () => {
  const source = new JSONSource(
    JSON.stringify({
      packages: [
        {
          name: 'Test Package',
          version: '1.0',
          license: 'MIT',
          copyrights: ['Copyright (c) Test Package author'],
        },
      ],
    })
  );

  const result = source.getPackage('junk');
  expect(result).toBeFalsy();
});

test('should list packages by key', async () => {
  const source = new JSONSource(
    JSON.stringify({
      packages: [
        {
          name: 'Test Package',
          version: '1.0',
          license: 'MIT',
          copyrights: ['Copyright (c) Test Package author'],
        },
        {
          name: 'Test Package',
          version: '2.0',
          license: 'MIT',
          copyrights: ['Copyright (c) Test Package author'],
        },
        {
          name: 'Test Package 2',
          version: '1.0',
          license: 'MIT',
          copyrights: ['Copyright (c) Test Package author'],
        },
      ],
    })
  );

  const result = await source.listPackages();
  expect(result).toEqual([
    'Test Package 1.0',
    'Test Package 2.0',
    'Test Package 2 1.0',
  ]);
});

test('should resolve all packages listed', async () => {
  const source = new JSONSource(
    JSON.stringify({
      packages: [
        {
          name: 'Test Package',
          version: '1.0',
          license: 'MIT',
          copyrights: ['Copyright (c) Test Package author'],
        },
        {
          name: 'Test Package',
          version: '2.0',
          license: 'MIT',
          copyrights: ['Copyright (c) Test Package author'],
        },
        {
          name: 'Test Package 2',
          version: '1.0',
          license: 'MIT',
          copyrights: ['Copyright (c) Test Package author'],
        },
      ],
    })
  );

  const keys = await source.listPackages();
  for (const key of keys) {
    expect(source.getPackage(key)).toBeTruthy();
  }
});

test('should convert to JSON', () => {
  const result = JSONSource.packagesToJSON([
    {
      name: 'Test Package',
      version: '1.0',
      license: 'MIT',
      copyrights: ['Copyright (c) Test Package author'],
    },
  ]);
  expect(result).toBe(
    '{"packages":[{"name":"Test Package","version":"1.0","license":"MIT","copyrights":["Copyright (c) Test Package author"]}]}'
  );
});
