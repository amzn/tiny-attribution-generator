// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: Apache-2.0

import DocBuilder from '../src/docbuilder';
import OutputRenderer from '../src/outputs/base';
import { LicenseBucket } from '../src/structure';

test('should bucket packages of different licenses apart', () => {
  const outputRenderer = new NameRenderer();
  const docbuilder = new DocBuilder(outputRenderer);
  docbuilder.addPackage({
    name: 'package1',
    version: '1.0.0',
    text: 'license text 1',
  });
  docbuilder.addPackage({
    name: 'package2',
    version: '1.0.0',
    text: 'license text 2',
  });
  const output = docbuilder.build();
  expect(output).toEqual([['package1'], ['package2']]);
});

test('should bucket packages of same license together', () => {
  const outputRenderer = new NameRenderer();
  const docbuilder = new DocBuilder(outputRenderer);
  docbuilder.addPackage({
    name: 'package1',
    version: '1.0.0',
    text: 'license text',
  });
  docbuilder.addPackage({
    name: 'package2',
    version: '1.0.0',
    text: 'license text',
  });
  const output = docbuilder.build();
  expect(output).toEqual([['package1', 'package2']]);
});

test('applies text transformations', () => {
  const outputRenderer = new TextOnlyRenderer();
  const builder = new DocBuilder(outputRenderer);
  builder.addPackage({
    name: 'testpackage',
    version: '0.0.0',
    text: 'abcdefg',
    license: '000-sortmefirst',
  });
  builder.addPackage({
    name: 'anothertest',
    version: '1.0.0',
    text: 'arstneio',
    license: '999',
  });

  const upper = (text: string, bucket: LicenseBucket) => {
    if (bucket.text.includes('arstneio')) {
      return bucket.text.toUpperCase();
    }
    return bucket.text;
  };
  builder.addTextTransform(upper);

  const output = builder.build();
  expect(output).toEqual('abcdefg\n\nARSTNEIO');
});

class NameRenderer implements OutputRenderer<string[][]> {
  render(buckets: LicenseBucket[]): string[][] {
    return buckets.map(b => b.packages.map(p => p.name)).sort();
  }
}

class TextOnlyRenderer implements OutputRenderer<string> {
  render(buckets: LicenseBucket[]): string {
    return buckets.map(b => b.text).join('\n\n');
  }
}
