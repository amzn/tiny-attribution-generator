// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: Apache-2.0

import HtmlRenderer from '../../outputs/html';

test('should render html doc', () => {
  const htmlRenderer = new HtmlRenderer();
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
  const output = htmlRenderer.render(licenseBuckets);
  const expected =
    '<ol>\
<li><details><summary>package1 1.0.0 - LIC</summary><pre>license text</pre></details></li>\
</ol>';
  expect(output).toBe(htmlFrame(expected));
});

test('should render website if present', () => {
  const htmlRenderer = new HtmlRenderer();
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
          website: 'http://example.org',
        },
        {
          name: 'package2',
          version: '2.0.0',
        },
      ],
    },
  ];
  const output = htmlRenderer.render(licenseBuckets);
  const expected =
    '<ol>\
<li><details><summary>package1 1.0.0 - LIC</summary>\
<p><a href="http://example.org">http://example.org</a></p>\
<pre>license text</pre></details></li>\
<li><details><summary>package2 2.0.0 - LIC</summary>\
<pre>license text</pre></details></li>\
</ol>';
  expect(output).toBe(htmlFrame(expected));
});

test('should render copyrights', () => {
  const htmlRenderer = new HtmlRenderer();
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
          copyrights: ['Copyright (c) holder'],
        },
      ],
    },
  ];
  const output = htmlRenderer.render(licenseBuckets);
  const expected =
    '<ol>\
<li><details><summary>package1 1.0.0 - LIC</summary>\
<ul><li>Copyright (c) holder</li></ul>\
<pre>license text</pre></details></li>\
</ol>';
  expect(output).toBe(htmlFrame(expected));
});

test('should not render copyrights wrapper when empty', () => {
  const htmlRenderer = new HtmlRenderer();
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
          copyrights: [],
        },
      ],
    },
  ];
  const output = htmlRenderer.render(licenseBuckets);
  const expected =
    '<ol>\
<li><details><summary>package1 1.0.0 - LIC</summary>\
<pre>license text</pre></details></li>\
</ol>';
  expect(output).toBe(htmlFrame(expected));
});

test('should encode angle brackets in license', () => {
  const htmlRenderer = new HtmlRenderer();
  const licenseBuckets = [
    {
      id: '1',
      text: 'license text <placeholder>',
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
  const output = htmlRenderer.render(licenseBuckets);
  const expected =
    '<ol>\
<li><details><summary>package1 1.0.0 - LIC</summary>\
<pre>license text &lt;placeholder&gt;</pre></details></li>\
</ol>';
  expect(output).toBe(htmlFrame(expected));
});

const htmlFrame = (content: string) =>
  `<!doctype html><html lang="en"><head><title>OSS Attribution</title><style>pre{white-space:pre-wrap;background:#eee;padding:24px}</style></head><body><h1>OSS Attribution</h1>${content}</body></html>`;
