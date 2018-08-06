## Tiny Attribution Generator

A small tool and library to create attribution notices from various formats

## Work In Progress!

This is a project being built to extract the "document generation" piece from [oss-attribution-builder](https://github.com/amzn/oss-attribution-builder), so that you don't need a whole website & project manager just to create attribution documents.

It is/will be a library, and a command-line tool.

TODO of wants:

* Flexible input formats
* Flexible output formats (full-scale templates? use an existing template engine?)
* Integrate "tags" from parent project in some fashion:
  * License transformations
  * Validations, annotations
  * Custom text input, maybe
* Use SPDX as default license source, but allow for others (this may already be done, kinda)

Ideally this'd look like a processor in a pipeline:

```
  * generic package structures --.
  * npm license data ------------|                  .--> text output
  * cargo license data ----------+--- generator ----+--> html output
  * pypi license data -----------|    & validator   |--> android activity
  * clearlydefined data ---------'                  '--> ...
  * ...
```

## License

This library is licensed under the Apache 2.0 License.
