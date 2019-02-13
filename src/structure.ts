// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface Package<E = any> {
  uuid?: string;
  name: string;
  version: string;
  website?: string;
  license?: string;
  text?: string;
  copyrights?: string[];
  extra?: E;
}

export interface NamedLicense {
  name: string;
  text: string;
  tags: string[];
  [x: string]: any;
}

export interface LicenseBucket {
  id: string;
  name?: string;
  text: string;
  tags: string[];
  packages: Package[];
}
