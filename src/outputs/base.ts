// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LicenseBucket } from '../structure';

export default interface OutputRenderer<O> {
  render(licenseData: LicenseBucket[]): O;
}
