// Copyright 2018-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/// <reference path="./stub.d.ts" />

import DocBuilder from './docbuilder';
export default DocBuilder;

export * from './structure';

import MetadataSource from './inputs/base';
export { MetadataSource };
import LicenseDictionary from './licenses/base';
export { LicenseDictionary };
import OutputRenderer from './outputs/base';
export { OutputRenderer };
