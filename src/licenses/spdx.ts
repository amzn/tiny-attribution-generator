// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import LicenseDictionary from './base';
import spdxLicenses from 'spdx-license-list/full';
import { NamedLicense } from '../structure';

export default class SPDXLicenseDictionary implements LicenseDictionary {
  get(name: string): NamedLicense | undefined {
    const license = spdxLicenses[name];
    if (license == undefined) {
      return;
    }

    return {
      name,
      text: license.licenseText,
      tags: [],
    };
  }
}
