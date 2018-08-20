// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import MetadataSource from './base';
import { Package } from '../structure';

export default class JSONSource implements MetadataSource {
  private packageMap: Map<string, Package>;

  constructor(json: string) {
    const content = JSON.parse(json);
    const packages = content.packages as Package[];
    const pkgkv = packages.map<[string, Package]>(p => [
      `${p.name} ${p.version}`,
      p,
    ]);
    this.packageMap = new Map(pkgkv);
  }

  listPackages(): string[] {
    return Array.from(this.packageMap.keys());
  }

  getPackage(id: string): Package | undefined {
    return this.packageMap.get(id);
  }

  static packagesToJSON(packages: Package[]) {
    return JSON.stringify({
      packages: packages.map(p => ({
        name: p.name,
        version: p.version,
        website: p.website,
        license: p.license,
        text: p.text,
        copyrights: p.copyrights,
        extra: p.extra,
      })),
    });
  }
}
