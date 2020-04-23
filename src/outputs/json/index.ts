// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: Apache-2.0

import OutputRenderer from '../base';
import { LicenseBucket } from '../../structure';

/*
 * This is used to facilitate chaining across different toolsets
 */
export default class JsonRenderer implements OutputRenderer<any> {
  constructor() {}

  render(buckets: LicenseBucket[]): any {
    return {
      packages: buckets
        .map(x =>
          x.packages.map(y => {
            y.text = y.text == '' ? x.text : y.text;
            return y;
          })
        )
        .reduce((a, b) => {
          return a.concat(b);
        }, []),
    };
  }
}
