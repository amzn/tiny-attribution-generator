// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: Apache-2.0

import MetadataSource from './base';
import { Package } from '../structure';

export default class PackageLockSource implements MetadataSource {
  private packageMap: Map<string, Package>;

  constructor(json: string, private readonly excludeDev = true) {
    const content = JSON.parse(json);
    const dependencies = this.extractPackages(content.dependencies, []);
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

  extractPackages(deps: dependencyNode, all: Package[]) {
    if (!deps) return all;
    Object.keys(deps).map(name => {
      if (!this.excludeDev || !deps[name].dev) {
        all.push({
          name,
          version: deps[name].version,
          text: '_',
        });
      }
      this.extractPackages(deps[name].dependencies, all);
    });
    return all;
  }
}

interface dependencyNode {
  [name: string]: dependency;
}

interface dependency {
  version: string;
  dev: boolean;
  dependencies: dependencyNode;
}
