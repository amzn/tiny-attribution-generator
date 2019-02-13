// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: Apache-2.0

import MetadataSource from './base';
import { Package } from '../structure';
import request from 'superagent';
import { get } from 'lodash';

export default class ClearlyDefinedSource implements MetadataSource {
  private coordinates: string[];
  private packageMap = new Map<string, Package>();

  constructor(json: string) {
    const content = JSON.parse(json);
    this.coordinates = content.coordinates as string[];
  }

  async listPackages(): Promise<string[]> {
    const pageSize = 500;
    let data: { [coordinates: string]: Definition } = {};
    for (let i = 0; i < Math.ceil(this.coordinates.length / pageSize); i++) {
      const response = await request
        .post('https://api.clearlydefined.io/definitions')
        .send(this.coordinates.slice(i * pageSize, i * pageSize + pageSize));
      data = { ...data, ...response.body };
    }
    const keys = Object.keys(data);
    const pkgkv = await Promise.all(keys.map(x => this.toPackage(x, data[x])));
    this.packageMap = new Map(pkgkv);
    return keys;
  }

  getPackage(id: string): Package | undefined {
    return this.packageMap.get(id);
  }

  private async toPackage(
    key: string,
    def: Definition
  ): Promise<[string, Package]> {
    const licenseText = await this.fetchLicense(def.files);
    return [
      key,
      {
        name: [def.coordinates.namespace, def.coordinates.name]
          .filter(x => x)
          .join('/'),
        version: def.coordinates.revision,
        license: get(def, 'licensed.declared') || '',
        website: get(def, 'described.projectWebsite') || '',
        text: licenseText,
        copyrights: get(def, 'licensed.facets.core.attribution.parties'),
      },
    ];
  }

  private async fetchLicense(files: File[]): Promise<string | undefined> {
    if (!files) return;
    for (const file of files.filter(this.isLicense)) {
      try {
        const response = await request.get(
          `https://api.clearlydefined.io/attachments/${file.token}`
        );
        return response.text;
      } catch (exception) {
        if (exception.statusCode !== 404) throw exception;
      }
    }
  }
  private isLicense(file: File): boolean {
    return !!(
      file &&
      file.token &&
      file.natures &&
      file.natures.indexOf('license') > -1
    );
  }
}

interface Definition {
  name: string;
  coordinates: Coordinates;
  licensed: any;
  described: any;
  files: File[];
}

interface Coordinates {
  type: string;
  provider: string;
  namespace: string;
  name: string;
  revision: string;
}

interface File {
  token: string;
  natures: string[];
}
