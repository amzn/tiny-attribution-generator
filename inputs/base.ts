// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Package } from '../structure';

type PackageIdentifier = string;

export default interface MetadataSource {
  listPackages(): PackageIdentifier[];
  getPackage(id: PackageIdentifier): Package | undefined;
}
