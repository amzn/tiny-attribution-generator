// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: Apache-2.0

import HtmlRenderer from '../../src/outputs/html';
import * as fs from 'fs';
import * as path from 'path';

test('should render html doc', () => {
  const htmlRenderer = new HtmlRenderer(
    fs
      .readFileSync(path.join(__dirname, '../../default-htmltemplate.hbs'))
      .toString()
  );
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
<li><h2>LIC</h2>\
<ol>\
<li><details><summary>package1 1.0.0</summary></details></li>\
</ol>\
<pre>license text</pre></li>\
</ol>';

  expect(output).toBe(htmlFrame(expected));
});

test('should render website if present', () => {
  const htmlRenderer = new HtmlRenderer(
    fs
      .readFileSync(path.join(__dirname, '../../default-htmltemplate.hbs'))
      .toString()
  );
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
<li><h2>LIC</h2>\
<ol>\
<li>\
<details><summary>package1 1.0.0</summary>\
<p><a href="http://example.org">http://example.org</a></p>\
</details></li>\
<li><details><summary>package2 2.0.0</summary></details></li>\
</ol>\
<pre>license text</pre></li>\
</ol>';
  expect(output).toBe(htmlFrame(expected));
});

test('should render copyrights', () => {
  const htmlRenderer = new HtmlRenderer(
    fs
      .readFileSync(path.join(__dirname, '../../default-htmltemplate.hbs'))
      .toString()
  );
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
<li>\
<h2>LIC</h2>\
<ol>\
<li><details><summary>package1 1.0.0</summary>\
<ul><li>Copyright (c) holder</li></ul>\
</details></li>\
</ol>\
<pre>license text</pre></li>\
</ol>';
  expect(output).toBe(htmlFrame(expected));
});

test('should not render copyrights wrapper when empty', () => {
  const htmlRenderer = new HtmlRenderer(
    fs
      .readFileSync(path.join(__dirname, '../../default-htmltemplate.hbs'))
      .toString()
  );
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
<li><h2>LIC</h2>\
<ol><li><details><summary>package1 1.0.0</summary></details></li></ol>\
<pre>license text</pre></li>\
</ol>';
  expect(output).toBe(htmlFrame(expected));
});

test('should encode angle brackets in license', () => {
  const htmlRenderer = new HtmlRenderer(
    fs
      .readFileSync(path.join(__dirname, '../../default-htmltemplate.hbs'))
      .toString()
  );
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
<li><h2>LIC</h2>\
<ol><li><details><summary>package1 1.0.0</summary></details></li></ol>\
<pre>license text &lt;placeholder&gt;</pre></li>\
</ol>';
  expect(output).toBe(htmlFrame(expected));
});

const htmlFrame = (content: string) =>
  `<!DOCTYPE html><html lang="en"><head><title>OSS Attribution</title><meta charset="utf-8"><style>pre{white-space:pre-wrap;background:#eee;padding:24px}ol ol{list-style-type:lower-alpha}</style></head><body><h1>OSS Attribution</h1>${content}</body></html>`;

test('should render custom template', () => {
  const htmlRenderer = new HtmlRenderer('NOTHING');
  const output = htmlRenderer.render([]);
  expect(output).toBe('NOTHING');
});

test('should list names for custom template', () => {
  const template =
    '{{#buckets}}{{#packages}} {{name}} {{/packages}}{{/buckets}}';
  const htmlRenderer = new HtmlRenderer(template);
  const licenseBuckets = [
    {
      id: '',
      text: '',
      tags: [],
      packages: [
        {
          name: 'package1',
          version: '1.0.0',
        },
        {
          name: 'package2',
          version: '1.0.0',
        },
      ],
    },
  ];
  const output = htmlRenderer.render(licenseBuckets);
  expect(output).toBe('package1 package2');
});
