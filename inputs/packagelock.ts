// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: Apache-2.0

import MetadataSource from './base';
import { Package } from '../structure';

export default class PackageLockSource implements MetadataSource {
  private packageMap: Map<string, Package>;

  constructor(json: string) {
    const content = JSON.parse(json);
    const dependencies = Object.keys(content.dependencies).map(x => {
      return {
        name: x,
        version: content.dependencies[x].version,
        text: '_',
        isDev: content.dependencies[x].dev === true,
      };
    });
    const pkgkv = dependencies.map<[string, Package]>(p => [
      `${p.name} ${p.version}`,
      p,
    ]);
    this.packageMap = new Map(pkgkv);
  }

  async listPackages(): Promise<string[]> {
    return Array.from(this.packageMap.keys());
  }

  getPackage(id: string): Package | undefined {
    return this.packageMap.get(id);
  }
}
