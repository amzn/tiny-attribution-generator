// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: Apache-2.0

import ClearlyDefinedSource from '../../src/inputs/clearlydefined';
import nock from 'nock';

test('should get package by key with after list call', async () => {
  const source = new ClearlyDefinedSource(
    JSON.stringify({
      coordinates: ['npm/npmjs/-/package1/1.0.0'],
    })
  );
  nockDefintions({
    'npm/npmjs/-/package1/1.0.0': {
      described: {
        projectWebsite: 'https://github.com/test/package1',
        tools: ['clearlydefined/1.0.1'],
      },
      licensed: {
        declared: 'MIT',
        facets: {
          core: {
            attribution: {
              parties: ['(c) Test copy', 'Copyright (c) Test copy'],
            },
          },
        },
      },
      files: [],
      coordinates: { name: 'package1', revision: '1.0.0' },
      score: {},
    },
  });

  await source.listPackages();
  const result = source.getPackage('npm/npmjs/-/package1/1.0.0');
  expect(result).toBeTruthy();
  expect(result).toEqual({
    name: 'package1',
    version: '1.0.0',
    license: 'MIT',
    website: 'https://github.com/test/package1',
    text: undefined,
    copyrights: ['(c) Test copy', 'Copyright (c) Test copy'],
  });
});

test('should not get package by key with no list call', () => {
  const source = new ClearlyDefinedSource(
    JSON.stringify({
      coordinates: ['npm/npmjs/-/package/1.0.0'],
    })
  );

  const result = source.getPackage('npm/npmjs/-/package/1.0.0');
  expect(result).toBeFalsy();
});

test('should get license text', async () => {
  const source = new ClearlyDefinedSource(
    JSON.stringify({
      coordinates: ['npm/npmjs/-/haslicense/1.0.0'],
    })
  );
  nockDefintions({
    'npm/npmjs/-/haslicense/1.0.0': {
      described: {},
      licensed: {
        declared: 'MIT',
      },
      files: [
        {
          path: 'LICENSE',
          token: 'thisisatoken',
          natures: ['license'],
        },
      ],
      coordinates: { name: 'haslicense', revision: '1.0.0' },
    },
  });
  nockAttachments('thisisatoken', 'THIS IS A LICENSE');

  await source.listPackages();
  const result = source.getPackage('npm/npmjs/-/haslicense/1.0.0');
  expect(result).toEqual({
    name: 'haslicense',
    version: '1.0.0',
    license: 'MIT',
    text: 'THIS IS A LICENSE',
    copyrights: undefined,
    website: '',
  });
});

test('should skip file by natures', async () => {
  const source = new ClearlyDefinedSource(
    JSON.stringify({
      coordinates: [
        'npm/npmjs/-/haslicense/1.0.0',
        'npm/npmjs/-/hasfile/1.0.0',
      ],
    })
  );
  nockDefintions({
    'npm/npmjs/-/haslicense/1.0.0': {
      described: {},
      licensed: {
        declared: 'MIT',
      },
      files: [
        {
          path: 'LICENSE',
          token: 'thisistoken1',
          natures: ['license'],
        },
      ],
      coordinates: { name: 'haslicense', revision: '1.0.0' },
    },
    'npm/npmjs/-/hasfile/1.0.0': {
      described: {},
      licensed: {
        declared: 'MIT',
      },
      files: [
        {
          path: 'package.json',
          token: 'thisistoken2',
          natures: ['manifest'],
        },
      ],
      coordinates: { name: 'hasfile', revision: '1.0.0' },
    },
  });
  nockAttachments('thisistoken1', 'LICENSE first one');

  await source.listPackages();
  const result1 = source.getPackage('npm/npmjs/-/haslicense/1.0.0');
  expect(result1).toEqual({
    name: 'haslicense',
    version: '1.0.0',
    license: 'MIT',
    text: 'LICENSE first one',
    copyrights: undefined,
    website: '',
  });

  const result2 = source.getPackage('npm/npmjs/-/hasfile/1.0.0');
  expect(result2).toEqual({
    name: 'hasfile',
    version: '1.0.0',
    license: 'MIT',
    text: undefined,
    copyrights: undefined,
    website: '',
  });
});

test('should list packages by key', async () => {
  const source = new ClearlyDefinedSource(
    JSON.stringify({
      coordinates: ['npm/npmjs/-/package2/1.0.0'],
    })
  );
  nockDefintions({
    'npm/npmjs/-/package2/1.0.0': {
      described: {},
      licensed: {},
      coordinates: { name: 'package2', revision: '1.0.0' },
    },
  });

  const result = await source.listPackages();
  expect(result).toEqual(['npm/npmjs/-/package2/1.0.0']);
});

test('should resolve all packages listed', async () => {
  const source = new ClearlyDefinedSource(
    JSON.stringify({
      coordinates: [
        'npm/npmjs/-/package3/1.0.0',
        'npm/npmjs/-/package4/1.0.0',
        'npm/npmjs/-/package4/2.0.0',
      ],
    })
  );
  nockDefintions({
    'npm/npmjs/-/package3/1.0.0': {
      described: {},
      licensed: {},
      coordinates: { name: 'package3', revision: '1.0.0' },
    },
    'npm/npmjs/-/package4/1.0.0': {
      described: {},
      licensed: {},
      coordinates: { name: 'package4', revision: '1.0.0' },
    },
    'npm/npmjs/-/package4/2.0.0': {
      described: {},
      licensed: {},
      coordinates: { name: 'package4', revision: '2.0.0' },
    },
  });

  const keys = await source.listPackages();
  for (const key of keys) {
    expect(source.getPackage(key)).toBeTruthy();
  }
});

function nockDefintions(response: any) {
  nock('https://api.clearlydefined.io')
    .post('/definitions')
    .reply(200, response);
}

function nockAttachments(token: string, text: string) {
  nock('https://api.clearlydefined.io')
    .get(`/attachments/${token}`)
    .reply(200, text);
}
