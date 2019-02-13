// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: Apache-2.0

import { LicenseBucket } from '../../structure';
import OutputRenderer from '../base';
import * as fs from 'fs';
import * as path from 'path';
import { compile } from 'handlebars';
import { minify } from 'html-minifier';

export default class HtmlRenderer implements OutputRenderer<string> {
  constructor(private template?: string) {}

  render(buckets: LicenseBucket[]): string {
    if (!this.template) {
      this.template = fs
        .readFileSync(path.join(__dirname, '../../../default-htmltemplate.hbs'))
        .toString();
    }
    const compiler = compile(this.template);
    const result = compiler({ buckets });
    return minify(result, {
      collapseWhitespace: true,
      minifyCSS: true,
    });
  }
}
