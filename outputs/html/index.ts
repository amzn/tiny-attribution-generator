// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: Apache-2.0

import { LicenseBucket } from "../../structure";
import OutputRenderer from "../base";

export default class HtmlRenderer implements OutputRenderer<string> {
  private lines: string[] = [];

  constructor() {}

  render(buckets: LicenseBucket[]): string {
    this.lines = [];

    this.lines.push('<!doctype html>');
    this.lines.push('<html lang="en">');
    this.lines.push('<head>');
    this.lines.push('<title>OSS Attribution</title>');
    this.lines.push('<style>pre { white-space: pre-wrap; background: #eee; padding: 24px;}</style>')
    this.lines.push('</head>');
    this.lines.push('<body>');
    this.lines.push('<h1>OSS Attribution</h1>');

    this.lines.push('<ol>');
    for (const bucket of buckets) {
      for (const pkg of bucket.packages) {
        this.lines.push('<li>');
        this.lines.push('<details>');

        this.lines.push(`<summary>${pkg.name} ${pkg.version} - ${bucket.name}</summary>`);

        if (pkg.website) {
          this.lines.push(`<p><a href="${pkg.website}">${pkg.website}</a></p>`);
        }

        if (pkg.copyright) {
          this.lines.push(`<p>${this.encodeAngleBrackets(pkg.copyright)}</p>`);
        }

        this.lines.push(`<pre>${this.encodeAngleBrackets(bucket.text)}</pre>`);

        this.lines.push('</details>');
        this.lines.push('</li>');
      }
    }
    this.lines.push('</ol>');

    this.lines.push('</body>');
    this.lines.push('</html>');

    const final = this.lines.join('');
    return final;
  }

  private encodeAngleBrackets(str: string) {
    return str.replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
  }
}
