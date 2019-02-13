// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: Apache-2.0

import { LicenseBucket } from '../../structure';
import OutputRenderer from '../base';
import { compile } from 'handlebars';

export default class TemplateRenderer implements OutputRenderer<string> {
  constructor(private template: string) {}

  render(buckets: LicenseBucket[]): string {
    const compiler = compile(this.template);
    const result = compiler({ buckets });
    return result;
  }
}
