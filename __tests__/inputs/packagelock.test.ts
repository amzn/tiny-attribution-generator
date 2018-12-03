// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: Apache-2.0

import PackageLockSource from '../../inputs/packagelock';

test('should get package by key', () => {
  const source = new PackageLockSource(`
  {
    "name": "module",
    "version": "0.0.1",
    "dependencies": {
      "Test Package": {
        "version": "1.0.0"
      }
    }
  }`);

  const result = source.getPackage('Test Package 1.0.0');
  expect(result).toBeTruthy();
  expect(result).toEqual({
    name: 'Test Package',
    version: '1.0.0',
    text: '_',
  });
});

test('should not get package by bad key', () => {
  const source = new PackageLockSource(`
  {
    "name": "module",
    "version": "0.0.1",
    "dependencies": {
      "Test Package": {
        "version": "1.0.0"
      }
    }
  }`);

  const result = source.getPackage('junk');
  expect(result).toBeFalsy();
});

test('should list packages by key', async () => {
  const source = new PackageLockSource(`
  {
    "name": "module",
    "version": "0.0.1",
    "dependencies": {
      "Test Package": {
        "version": "1.0.0"
      },
      "Test Package 2": {
        "version": "2.0.0"
      },
      "Test Package 3": {
        "version": "3.0.0"
      }
    }
  }`);

  const result = await source.listPackages();
  expect(result).toEqual([
    'Test Package 1.0.0',
    'Test Package 2 2.0.0',
    'Test Package 3 3.0.0',
  ]);
});

test('should exclude dev by default', async () => {
  const source = new PackageLockSource(`
  {
    "name": "module",
    "version": "0.0.1",
    "dependencies": {
      "Test Package": {
        "version": "1.0.0"
      },
      "Test Package 2": {
        "version": "2.0.0",
        "dev": true
      },
      "Test Package 3": {
        "version": "3.0.0"
      }
    }
  }`);

  const result = await source.listPackages();
  expect(result).toEqual(['Test Package 1.0.0', 'Test Package 3 3.0.0']);
});

test('should include dev by config', async () => {
  const source = new PackageLockSource(
    `
  {
    "name": "module",
    "version": "0.0.1",
    "dependencies": {
      "Test Package": {
        "version": "1.0.0"
      },
      "Test Package 2": {
        "version": "2.0.0",
        "dev": true
      },
      "Test Package 3": {
        "version": "3.0.0"
      }
    }
  }`,
    false
  );

  const result = await source.listPackages();
  expect(result).toEqual([
    'Test Package 1.0.0',
    'Test Package 2 2.0.0',
    'Test Package 3 3.0.0',
  ]);
});

test('should list packages recursively', async () => {
  const source = new PackageLockSource(`
  {
    "name": "module",
    "version": "0.0.1",
    "dependencies": {
      "Test Package": {
        "version": "1.0.0",
        "dependencies": {
          "Test Package 2": {
            "version": "2.0.0",
            "dependencies": {
              "Test Package 3": {
                "version": "3.0.0"
              }
            }
          }
        }
      }
    }
  }`);

  const result = await source.listPackages();
  expect(result).toEqual([
    'Test Package 1.0.0',
    'Test Package 2 2.0.0',
    'Test Package 3 3.0.0',
  ]);
});
