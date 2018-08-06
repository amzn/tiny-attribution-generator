/* Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import MetadataSource from './base';
import { Package } from '../structure';

export default class JSONSource implements MetadataSource {
  private packageMap: Map<string, Package>;

  constructor(json: string) {
    const content = JSON.parse(json);
    const packages = content.packages as Package[];
    const pkgkv = packages.map<[string, Package]>((p) => [`${p.name} ${p.version}`, p]);
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
        copyright: p.copyright,
        extra: p.extra,
      })),
    });
  }
}
