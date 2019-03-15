// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import TextRenderer, { wordWrap } from '../../src/outputs/text';
import { LicenseBucket } from '../../src/structure';

describe('text renderer', () => {
  const buckets: LicenseBucket[] = [
    {
      id: 'abcd',
      text: 'some license text here\n\n    indented text too, isnt this fun',
      name: 'dummy-license',
      tags: [],
      packages: [
        {
          name: 'test package',
          version: '0.0',
          copyrights: ['copyright me, now'],
        },
      ],
    },
  ];

  test('renders', () => {
    const renderer = new TextRenderer();
    const output = renderer.render(buckets);
    expect(output).toContain('copyright me, now');
    expect(output).toContain('some license text here');
  });

  test('word wraps when requested', () => {
    const renderer = new TextRenderer({ wrap: 20 });
    const output = renderer.render(buckets);
    expect(output).toContain('some license text\nhere');
    expect(output).toContain('    indented text\n    too');
  });

  test('has useful annotations', () => {
    const renderer = new TextRenderer();
    const output = renderer.render(buckets);

    const annotations = renderer.annotations;
    const bucketAnnotation = annotations.find(a => a.type === 'bucket');
    const licenseAnnotation = annotations.find(a => a.type === 'license');

    const lines = output.split('\n');

    // the bucket should cover the whole thing (since theres only one)
    expect(lines.length).toEqual(
      bucketAnnotation.lines[1] - bucketAnnotation.lines[0]
    );

    // the license should contain the text, of course
    const licenseSection = lines.slice(
      licenseAnnotation.lines[0],
      licenseAnnotation.lines[1]
    );
    expect(licenseSection.join('\n')).toEqual(buckets[0].text);
  });
});

describe('word wrapping', () => {
  const input = `
    This is my test license file. It should word wrap this, preserving indent.`;

  const output20col = `
    This is my test
    license file.
    It should word
    wrap this,
    preserving
    indent.`;

  const output10col = `
    This
    is my
    test
    license
    file.
    It
    should
    word
    wrap
    this,
    preserving
    indent.`;

  test('should word wrap to 20 columns preserving indents', () => {
    const wrapped = wordWrap(input, 19); // 19 => len of 20 col
    expect(wrapped).toEqual(output20col);
  });

  test('should not break words when they are too long', () => {
    const wrapped = wordWrap(input, 9); // 9 => len of 10 col
    expect(wrapped).toEqual(output10col);
  });

  test('should not do crazy things with long words', () => {
    const wrapped = wordWrap('arstneio', 4);
    expect(wrapped).toEqual('arstneio');
  });

  test('should do nothing with short enough lines', () => {
    const wrapped = wordWrap(input, 99);
    expect(wrapped).toEqual(input);
  });

  test('should not wrap lines exactly matching size', () => {
    const wrapped = wordWrap('ab cd', 5);
    expect(wrapped).toEqual('ab cd');
    const wrappedIndent = wordWrap('  ab cd', 7);
    expect(wrappedIndent).toEqual('  ab cd');
  });
});
