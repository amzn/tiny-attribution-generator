// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { LicenseBucket } from '../../structure';
import OutputRenderer from '../base';

export interface Annotation {
  lines: [number, number | undefined];
  [key: string]: any;
}

type AnnotationType = 'bucket' | 'license' | 'package';

interface Options {
  wrap?: number;
}

export default class TextRenderer implements OutputRenderer<string> {
  private openAnnotations: { [type: string]: Annotation } = {};
  private finalAnnotations: Annotation[] = [];
  private lineNum = 0;
  private chunks: string[] = [];

  private wrap?: number;

  constructor(options?: Options) {
    if (options) {
      this.wrap = options.wrap;
    }
  }

  render(buckets: LicenseBucket[]): string {
    this.chunks = [];
    this.lineNum = 0;

    // output each license with its bucket of packages
    for (const bucket of buckets) {
      this.startAnnotation('bucket', { id: bucket.id });

      // output package names and copyright statements
      for (const pkg of bucket.packages) {
        let statement = `** ${pkg.name}; version ${pkg.version} -- ${
          pkg.website
        }`;
        if (pkg.copyrights && pkg.copyrights.length > 0) {
          statement += `\n${pkg.copyrights.join('\n')}`;
        }

        this.startAnnotation('package', { uuid: pkg.uuid });
        this.addChunk(statement);
        this.endAnnotation('package');
      }

      // then output the license text itself
      this.addChunk(''); // spacing
      this.startAnnotation('license', { license: bucket.name });
      this.addChunk(bucket.text);
      this.endAnnotation('license');

      this.endAnnotation('bucket');
      this.addChunk('\n------\n');
    }

    // chop off the last chunk and join up
    const final = this.chunks.slice(0, -1).join('\n');
    return final;
  }

  get annotations(): Annotation[] {
    return this.finalAnnotations;
  }

  private startAnnotation(type: AnnotationType, extra: any) {
    this.openAnnotations[type] = { lines: [this.lineNum, undefined], ...extra };
  }

  private endAnnotation(type: AnnotationType) {
    const open = this.openAnnotations[type];
    open.type = type;
    open.lines[1] = this.lineNum;
    this.finalAnnotations.push(open);
    delete this.openAnnotations[type];
  }

  private addChunk(str: string) {
    const wrapped = this.wrap ? wordWrap(str, this.wrap) : str;
    const len = wrapped.split(/\r?\n/).length;
    this.lineNum += len;
    this.chunks.push(wrapped);
  }
}

/**
 * Word wrap a string, preserving existing indents.
 *
 * Additionally, trims trailing whitespace and normalizes word spacing.
 *
 * @param str String to wrap
 * @param size The maximum length of a line. This is one less than the "column"
 * displayed in editors; e.g. for an 80-column wrap, specify 79.
 */
export function wordWrap(str: string, size: number) {
  const lines = str.split(/\r?\n/);
  const output = [];

  for (const raw of lines) {
    // trim right
    const trimmed = raw.replace(/\s+$/, '');

    // fits? cool. stop here. (will also catch blank/whitespace-only lines)
    if (trimmed.length <= size) {
      output.push(trimmed);
      continue;
    }

    // determine indent from the index of the first non-whitespace character
    const indent = trimmed.search(/\S/);

    // split words up by any amount of spacing
    const words = trimmed.split(/\s+/);

    // start inserting words
    let outwords: string[] = [];
    let outlen: number = indent;
    let word: string | undefined;
    while ((word = words.shift()) != undefined) {
      // indent chars will cause an empty token
      if (word.length === 0) {
        continue;
      }
      const wordSpace = word.length + 1; // +1 for space character

      // will it fit? (adding one for end-of-line-space assumption)
      if (outlen + wordSpace <= size + 1) {
        // add it
        outwords.push(word);
        outlen += wordSpace;
        continue;
      }

      // if it doesn't fit, terminate this line and restart on the next.
      // but only if it has words on it, to allow for words that are longer
      // than the line length to begin with.
      if (outwords.length > 0) {
        output.push(' '.repeat(indent) + outwords.join(' '));
      }
      outwords = [word];
      outlen = indent + wordSpace;
    }

    // add in any leftovers that didn't hit the line limit
    if (outwords.length > 0) {
      output.push(' '.repeat(indent) + outwords.join(' '));
    }
  }

  return output.join('\n');
}
