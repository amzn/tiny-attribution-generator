// Copyright 2017-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { createHash } from 'crypto';
import uuidv4 from 'uuid/v4';

import { LicenseBucket, Package } from './structure';
import OutputRenderer from './outputs/base';
import MetadataSource from './inputs/base';
import SPDXLicenseDictionary from './licenses/spdx';
import LicenseDictionary from './licenses/base';

type TextTransform = (text: string, bucket: LicenseBucket) => string;
interface DocumentSummary {
  usedLicenses: UsedLicenseSummary;
}
type UsedLicenseSummary = { [bucket: string]: BucketSummary };
interface BucketSummary {
  name?: string;
  text: string;
  packages: Package[];
  tags: string[];
}

export default class DocBuilder {
  private buckets = new Map<string, LicenseBucket>();
  private textTransforms: TextTransform[] = [];

  constructor(
    private renderer: OutputRenderer<any>,
    private licenseDictionary: LicenseDictionary = new SPDXLicenseDictionary()
  ) {}

  addPackage(data: Package) {
    const pkg = validatePackage(data);

    // add an identifier if not present
    if (!pkg.uuid) {
      pkg.uuid = uuidv4();
    }

    // see if it's a known license
    const name = pkg.license;
    const license = name ? this.licenseDictionary.get(name) : undefined;

    // prefer package's license text
    let text = '';
    if (pkg.text != undefined && pkg.text.length > 0) {
      text = pkg.text;
    } else if (name) {
      // no provided license text => use our stored version if we have it
      text = license && license.text ? license.text : name;
    }

    // TODO: dedupe copyright strings from the license text; those should
    // only be in copyright fields. having them in the license text kinda
    // ruins license grouping and adds messy duplication to the output.

    // create a key based on the text (or name, if text is empty)
    const hash = DocBuilder.licenseHash(text);

    // sort unknown licenses at the end (~)
    const prefix = name || '';
    const id =
      license != undefined ? `${prefix}~${hash}` : `~${prefix}~${hash}`;

    // determine tags
    const tags: string[] = license ? license.tags : ['unknown'];

    // create or add to a bucket
    const bucket = this.buckets.get(id) || {
      id,
      name,
      text,
      tags,
      packages: [] as Package[],
    };

    bucket.packages.push(pkg);
    this.buckets.set(id, bucket);
  }

  async read(source: MetadataSource) {
    const packages = await source.listPackages();
    for (const packageId of packages) {
      const pkg = source.getPackage(packageId)!;

      this.addPackage(pkg);
    }
  }

  addTextTransform(func: TextTransform) {
    this.textTransforms.push(func);
  }

  build() {
    const licenseBuckets = this.finalize();
    return this.renderer.render(licenseBuckets);
  }

  private finalize() {
    // sort buckets by id (name, roughly)
    const sortedBuckets = Array.from(this.buckets.keys())
      .sort()
      .map(id => {
        // sort packages in each bucket
        const bucket = this.buckets.get(id)!;
        bucket.packages.sort((a, b) => a.name.localeCompare(b.name));
        return bucket;
      });

    // apply any transformations to the text
    if (this.textTransforms.length > 0) {
      for (const bucket of this.buckets.values()) {
        bucket.text = this.textTransforms.reduce(
          (acc, transform) => transform(acc, bucket),
          bucket.text
        );
      }
    }

    return sortedBuckets;
  }

  get summary(): DocumentSummary {
    const usedLicenses: UsedLicenseSummary = {};
    this.buckets.forEach((b, key) => {
      usedLicenses[key] = {
        name: b.name,
        text: b.text,
        packages: [...b.packages],
        tags: b.tags,
      };
    });

    return {
      usedLicenses,
    };
  }

  /**
   * Given a license's text, normalize it and create a hash for de-duping.
   */
  static licenseHash(text: string) {
    const hash = createHash('sha256');

    // we *don't* care about spacing/formatting, but we *do* care about text.
    // so just strip out all whitespace/punctuation/specials for the digest.
    text = text.toLowerCase().replace(/\W+/gu, '');

    hash.update(text);
    return hash.digest('hex');
  }
}

/**
 * Even though TypeScript enforces correct types, downstream consumers
 * may not. Sanity check and clean up fields to ensure things are OK.
 */
function validatePackage<E>(input: Package<E>): Package<E> {
  const p = {} as any;

  // only copy fields we know about
  const keys = [
    'uuid',
    'name',
    'version',
    'website',
    'license',
    'text',
    'copyrights',
    'extra',
  ];
  for (const key of keys) {
    p[key] = (input as any)[key];
    delete (input as any)[key];
  }

  // flag on leftover fields
  const remaining = Object.keys(input);
  if (remaining.length > 0) {
    throw new Error(
      `Package had leftover keys that t-a-g didn't understand: ${remaining}`
    );
  }

  if (isEmpty(p.name)) {
    throw new Error('Package name is empty');
  }

  if (isEmpty(p.version)) {
    throw new Error('Package version is empty');
  }

  // if copyrights is a string, make is a single-element array
  if (typeof p.copyrights == 'string') {
    p.copyrights = [p.copyrights];
  }

  // must supply either the license name or the text; neither is quite useless
  if (isEmpty(p.license) && isEmpty(p.text)) {
    throw new Error('Must supply either/both of `license` or `text`');
  }

  return p;
}

function isEmpty(thing: string | undefined) {
  return thing == undefined || thing.length === 0;
}
