// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: Apache-2.0

import MetadataSource from './base';
import { Package } from '../structure';
import request from 'request-promise-native';

export default class ClearlyDefinedSource implements MetadataSource {
  private coordinates: string[];
  private packageMap!: Map<string, Package>;

  constructor(json: string) {
    const content = JSON.parse(json);
    this.coordinates = content.coordinates as string[];
  }

  async listPackages(): Promise<string[]> {
    const response = await request(
      'https://api.clearlydefined.io/definitions',
      {
        method: 'post',
        json: this.coordinates,
      }
    );
    const keys = Object.keys(response);
    const pkgkv = await Promise.all(
      keys.map(x => this.toPackage(x, response[x]))
    );
    this.packageMap = new Map(pkgkv);
    return keys;
  }

  getPackage(id: string): Package | undefined {
    return this.packageMap.get(id);
  }

  private async toPackage(
    key: string,
    def: Defintion
  ): Promise<[string, Package]> {
    const licenseText = await this.fetchLicense(def.files);
    return [
      key,
      {
        name: [def.coordinates.namespace, def.coordinates.name]
          .filter(x => x)
          .join('/'),
        version: def.coordinates.revision,
        license: def.licensed.declared || '',
        website: def.described.projectWebsite || '',
        text: licenseText,
        copyrights: def.licensed.facets.core.attribution.parties,
      },
    ];
  }

  private async fetchLicense(files: File[]): Promise<string | undefined> {
    if (!files) return;
    for (const file of files.filter(x => x.token)) {
      try {
        const response = await request(
          `https://api.clearlydefined.io/attachments/${file.token}`,
          {
            method: 'get',
            json: false,
          }
        );
        return response;
      } catch (exception) {
        if (exception.statusCode !== 404) throw exception;
      }
    }
  }
}

interface Defintion {
  name: string;
  coordinates: Coordinates;
  licensed: Licensed;
  described: Described;
  files: File[];
}

interface Coordinates {
  type: string;
  provider: string;
  namespace: string;
  name: string;
  revision: string;
}

interface Licensed {
  declared: string;
  facets: any;
}

interface Described {
  projectWebsite: string;
}

interface File {
  token: string;
}
