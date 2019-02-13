// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import SPDXLicenseDictionary from '../../src/licenses/spdx';

test('should return an spdx license', () => {
  const dict = new SPDXLicenseDictionary();
  const mit = dict.get('MIT');
  expect(mit).toHaveProperty('text');
  expect(mit.text).toContain('Permission is hereby granted');
});

test('should return undefined for non-spdx licenses', () => {
  const dict = new SPDXLicenseDictionary();
  const wat = dict.get('_nonsensical-license-id');
  expect(wat).toBeUndefined();
});
