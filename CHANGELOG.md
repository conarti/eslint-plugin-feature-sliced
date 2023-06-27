## [1.0.3](https://github.com/conarti/eslint-plugin-fsd/compare/v1.0.2...v1.0.3) (2023-06-27)


### Bug Fixes

* **configs:** add 'rules' config definition at main entry point ([a9eba73](https://github.com/conarti/eslint-plugin-fsd/commit/a9eba7319090177d284c9d846afb31f8f024d2d0))



## [1.0.2](https://github.com/conarti/eslint-plugin-fsd/compare/v1.0.1...v1.0.2) (2023-06-27)


### Features

* **configs:** add config contain only rules ([e811a84](https://github.com/conarti/eslint-plugin-fsd/commit/e811a84900f63c95c72efa960e58c591b2d456d5))



## [1.0.1](https://github.com/conarti/eslint-plugin-fsd/compare/v1.0.0...v1.0.1) (2023-06-27)

### Bug Fixes

* **configs:** update definitions using new plugin name ([6d9b4f1](https://github.com/conarti/eslint-plugin-fsd/commit/b76283a7ae98d2a5f16494ede9a5a0f6b6d9b4f1))


# [1.0.0](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.39...v1.0.0) (2023-06-27)

This version refactored to typescript and vitest, as well as fixed important bugs and redesigned the rules.
Also, with the release of this version, the repository will be renamed to '@conarti/eslint-plugin-feature-sliced' and package with old name will be deprecated.

### Bug Fixes

* **absolute-relative:** correct use default options ([85283af](https://github.com/conarti/eslint-plugin-fsd/commit/85283af4ac13fe41217f624a426013b01e7ee966))
* **absolute-relative:** should correct understand node module imports ([061e815](https://github.com/conarti/eslint-plugin-fsd/commit/061e815c8f43b5b7c3c4960d53919f4073e2ba6f))
* **import-order:** change to correct global config import path ([a079822](https://github.com/conarti/eslint-plugin-fsd/commit/a079822fc697f52dbf07afddbef49460a3a3b0dd))
* **layers-slices:** add schema for new 'ignoreInFilesPatterns' option ([e9aaffc](https://github.com/conarti/eslint-plugin-fsd/commit/e9aaffc2924139229be2faec2a024891209fa6ed))
* **layers-slices:** correct use default options ([c66179e](https://github.com/conarti/eslint-plugin-fsd/commit/c66179e98287f8db0f30fbf7d9c0a3d62c09a445))
* **layers-slices:** remove the incorrect check after correcting the logic for obtaining layer slices ([627c240](https://github.com/conarti/eslint-plugin-fsd/commit/627c2402f8957788f0071a28c2848a0d2bae44ac))
* **public-api:** correct use default options ([c2f36b6](https://github.com/conarti/eslint-plugin-fsd/commit/c2f36b6cb81bae2a1f7f950768f9022e6a76c130))
* **public-api:** report only 1 "import to layers public api is not allowed" error per file ([8672f55](https://github.com/conarti/eslint-plugin-fsd/commit/8672f554a079a0caa04fcef553c25fcf1819c917))
* **public-api:** should work with multiple layer names in path (correct understand layer) ([c09bc09](https://github.com/conarti/eslint-plugin-fsd/commit/c09bc09b8d438d29e7dbb54e4c28cd135e3ea22f))


### Features

* use 'cwd' to understand paths ([3493d74](https://github.com/conarti/eslint-plugin-fsd/commit/3493d74def5df0bf066c0728df04a84405f36b7e))
* **import-order:** add different variations of configurations ([05e87f0](https://github.com/conarti/eslint-plugin-fsd/commit/05e87f07dc56c800b6d512c13dfa894a190360b7))
* **layers-slices:** 'allowTypeImports' option is set to 'true' by default ([7a3fc34](https://github.com/conarti/eslint-plugin-fsd/commit/7a3fc349de407642e2740926878a95461ad31de7))
* **layers-slices:** add 'ignoreInFilesPatterns' option ([b6b6fe3](https://github.com/conarti/eslint-plugin-fsd/commit/b6b6fe3824281364c604913f7f814969d3e6cfd0))
* **public-api:** add 'ignoreInFilesPatterns' option ([b2b3641](https://github.com/conarti/eslint-plugin-fsd/commit/b2b36417e5d626ccb38383dc569590d0685f417c))
* **public-api:** don't allow layers public api ([755a07c](https://github.com/conarti/eslint-plugin-fsd/commit/755a07c12658c7cecdb75cb863b07621908b6704))



## [0.0.39](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.38...v0.0.39) (2023-05-28)


### Bug Fixes

* **layers-slices:** remove import path normalization to check if it is ignored ([6569e75](https://github.com/conarti/eslint-plugin-fsd/commit/6569e7537f18efa9eba5010ac37e68dcd6eef57e))
* **import-order:** error when using 'recommended' config without 'eslint-plugin-import' package installed (now the rule simply won't work, and you can always use 'recommended' config) ([8f3dfa7](https://github.com/conarti/eslint-plugin-fsd/commit/8f3dfa73c3d44b6287e6267a2d62f74f1791ea30))


### Features

* **absolute-relative:** improve logic for getting layer and slice from paths (now understands relative paths) ([c6d264a](https://github.com/conarti/eslint-plugin-fsd/commit/c6d264aa9f0226162842e758af04082ca418edc1))
* **public-api:** add the option which adjust the level of validation ([ab6b7e5](https://github.com/conarti/eslint-plugin-fsd/commit/ab6b7e568c7e9dc2e8791b8fc2bd55ba4815d83f)), closes [#5](https://github.com/conarti/eslint-plugin-fsd/issues/5)



## [0.0.38](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.37...v0.0.38) (2023-05-11)


### Features

* **public-api:** validate 'export ... from ...' syntax ([db343f4](https://github.com/conarti/eslint-plugin-fsd/commit/db343f4586f91b97c2a86a2a861ebdf810d9b185))



## [0.0.37](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.36...v0.0.37) (2023-05-08)


### Bug Fixes

* **import-order:** cycle fsd imports errors bug ([f0107ed](https://github.com/conarti/eslint-plugin-fsd/commit/f0107ed90a10764b0bc2d9a70bd35ca6f69bda62))



## [0.0.36](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.35...v0.0.36) (2023-05-03)


### Features

* **absolute-relative:** add 'ignoreInFilesPatterns' options for ignoring validations in files by patterns ([ec87cd1](https://github.com/conarti/eslint-plugin-fsd/commit/ec87cd192626503aa005b28cf36071e34224bcd4))



## [0.0.35](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.34...v0.0.35) (2023-04-30)


### Bug Fixes

* **public-api:** incorrect working if segment files has segment-like naming ([4e7cade](https://github.com/conarti/eslint-plugin-fsd/commit/4e7cadecc3211f5e795258c04e68bc6623a04d1e))



## [0.0.34](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.33...v0.0.34) (2023-04-30)


### Bug Fixes

* **layers-slices:** incorrect work with 'layers-like' names at not layer path part ([d13544b](https://github.com/conarti/eslint-plugin-fsd/commit/d13544b8311993be895133b8860b71e13fe868aa))


### Features

* **layers-slices:** allow imports inside 'app' layer ([a2cc503](https://github.com/conarti/eslint-plugin-fsd/commit/a2cc503cb2991b5cb7ad9f5acf3699a13ba75823))



## [0.0.33](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.32...v0.0.33) (2023-04-30)


### Bug Fixes

* **layers-slices:** correctly understand layers from paths if usual folder names is same as layer names ([0.0.33](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.32...v0.0.33))



## [0.0.32](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.31...v0.0.32) (2023-04-17)


### Bug Fixes

* **public-api:** incorrect getting slices from the path ([5876679](https://github.com/conarti/eslint-plugin-fsd/commit/5876679c69eb2248970b8680a9bf07775b1eed3f))
* **public-api:** incorrect validation imports from 'index' files ([a335984](https://github.com/conarti/eslint-plugin-fsd/commit/a335984c33546b015e670ad95575c5ee3120cce5))
* **public-api:** incorrect validation within same segment ([61425a4](https://github.com/conarti/eslint-plugin-fsd/commit/61425a455bcc3c86a74f5278cdf606f327378be5))



## [0.0.31](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.30...v0.0.31) (2023-04-16)


### Bug Fixes

* **public-api:** working with file extension if import was from segment ([64ac21c](https://github.com/conarti/eslint-plugin-fsd/commit/64ac21c53c73b343600ec6708fa7a2b78852d90a))


### Features

* **absolute-relative:** validate in import expressions ([d0e82f0](https://github.com/conarti/eslint-plugin-fsd/commit/d0e82f00ddf8b296761abbfec3446e3adb9c9983))
* **layers-slices:** validate in import expressions ([de3971b](https://github.com/conarti/eslint-plugin-fsd/commit/de3971b01bd9bfa983cea26fcd3ecfc9ded73e36))
* **public-api:** validate in import expressions ([c439acc](https://github.com/conarti/eslint-plugin-fsd/commit/c439acc3c259d2d05ec52d1d8ff35b3254fc38ab))



## [0.0.30](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.29...v0.0.30) (2023-04-16)


### Bug Fixes

* **public-api:** don't replace quotes style to single after fix invalid paths ([5881993](https://github.com/conarti/eslint-plugin-fsd/commit/588199320d3ae6139f3016bf874b3119a6416407))


## [0.0.29](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.28...v0.0.29) (2023-04-16)


### Features

* **convert-to-absolute:** add work with absolute target path ([b36fb06](https://github.com/conarti/eslint-plugin-fsd/commit/b36fb06a912f327d4fba0fd07a823a748ba997c7))
* **public-api:** add relative path validation ([af2a104](https://github.com/conarti/eslint-plugin-fsd/commit/af2a10459db3afeba1e12b52c5eba27ea436cee0))
* **public-api:** validate relative paths ([93e287c](https://github.com/conarti/eslint-plugin-fsd/commit/93e287c2651dd81c8e56b38cc845c4a76f7c341a))



## [0.0.28](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.27...v0.0.28) (2023-04-09)


### Bug Fixes

* incorrect working with windows paths ([7efc4c5](https://github.com/conarti/eslint-plugin-fsd/commit/7efc4c59e6c1357ff69cafdef4b4d820463a4a16))
* set rules meta type to 'problem' ([89c7fdd](https://github.com/conarti/eslint-plugin-fsd/commit/89c7fdd78dfa0dfa5278ace29da1b8038515deba))



## [0.0.27](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.26...v0.0.27) (2023-04-04)


### Reverts

* Revert "refactor(configs): extract 'base' config from 'recommended'" ([c7f7bd9](https://github.com/conarti/eslint-plugin-fsd/commit/c7f7bd958b541c499515ae24893dce8b108a94e4))
* Revert "refactor(import-order): move to 'configs'" ([8ef7228](https://github.com/conarti/eslint-plugin-fsd/commit/8ef7228eac949145cce04834f2600ab303d09643))



## [0.0.26](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.25...v0.0.26) (2023-04-04)


### Bug Fixes

* incorrect handling of windows paths ([f4d8877](https://github.com/conarti/eslint-plugin-fsd/commit/f4d887792555263aac7883121d70bd6835064098))
* **public-api:** validation with sub-grouping folders ([675546e](https://github.com/conarti/eslint-plugin-fsd/commit/675546eec3159366896040cd812eb2fe470a0e95))



## [0.0.25](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.24...v0.0.25) (2023-03-29)


### Bug Fixes

* **public-api:** validation with grouping folders ([88d282a](https://github.com/conarti/eslint-plugin-fsd/commit/88d282a86c5246edbd4a479ad2a79384c57d255a))
* **public-api:** working with paths in 'kebab-case' ([1a73850](https://github.com/conarti/eslint-plugin-fsd/commit/1a73850f4b2f9d99af863ea63b86da1f798a71f9))



## [0.0.24](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.23...v0.0.24) (2023-03-06)


### Bug Fixes

* **absolute-relative:** error when validating exported values (not re-exports) ([36a9b77](https://github.com/conarti/eslint-plugin-fsd/commit/36a9b77e4c5f2c5b126cd110c906452476fe8347))



## [0.0.23](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.22...v0.0.23) (2023-03-06)


### Features

* **absolute-relative:** export validation ([d4243e2](https://github.com/conarti/eslint-plugin-fsd/commit/d4243e2bc26919078a219b7364b28d9798bbf177))



## [0.0.22](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.21...v0.0.22) (2023-03-06)


### Bug Fixes

* **get-layer-slice-from-path:** correction of work with segment names ([741bfa3](https://github.com/conarti/eslint-plugin-fsd/commit/741bfa3e17dca2e56f2b2e203a39be2c01fa93e4))


### Features

* **get-layer-slice-from-path:** case insensitive ([7b81eed](https://github.com/conarti/eslint-plugin-fsd/commit/7b81eed1c97c5025c354c7679f8e85125cd48448))



## [0.0.21](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.20...v0.0.21) (2023-03-06)


### Bug Fixes

* **normalize-path:** do not delete '.' ([ae463bb](https://github.com/conarti/eslint-plugin-fsd/commit/ae463bbf26ca65c74d6adc6fcce86bb23e91ac49))



## [0.0.20](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.19...v0.0.20) (2023-03-06)


### Bug Fixes

* **get-layer-slice-from-path:** working with kebab-case paths ([9d61320](https://github.com/conarti/eslint-plugin-fsd/commit/9d61320ab726a1781d7b3574b383a6cbc42c5951))


### Features

* **helpers:** add convert-to-absolute helper ([2d93396](https://github.com/conarti/eslint-plugin-fsd/commit/2d93396af5b17fbebdc6b9843ee987d3f2055758))
* **layers-slices:** validate relative paths ([1b153ab](https://github.com/conarti/eslint-plugin-fsd/commit/1b153ab450d8d26d2fe2bb4ecaa9ed2ba72833c1))



## [0.0.19](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.18...v0.0.19) (2023-03-04)


* feat(public-api-imports)!: rename rule to 'public-api' ([fb6b6d3](https://github.com/conarti/eslint-plugin-fsd/commit/fb6b6d3f28c09ed66d5bdcc39d2dc3bc726e0c5b))


### Features

* **public-api-imports:** change rule fix to suggestion ([f0489f3](https://github.com/conarti/eslint-plugin-fsd/commit/f0489f3ca80e8e2038b8111ff30d1a68e76be6e4))
* **public-api:** add fixed path to error message ([4fddcde](https://github.com/conarti/eslint-plugin-fsd/commit/4fddcde76bc5abafcf5cbbb4635eac15e875b30f))


### BREAKING CHANGES

* the name of the rule has been changed, you need to rename it in your eslint configs



## [0.0.18](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.17...v0.0.18) (2023-03-03)


### Bug Fixes

* **layers-slices:** remove extra '>' ([70a219b](https://github.com/conarti/eslint-plugin-fsd/commit/70a219bb0911c330fa426fb28ae6b48bdd56d969))


* feat(path-checker)!: rename rule to 'absolute-relative' ([68ce50a](https://github.com/conarti/eslint-plugin-fsd/commit/68ce50a1ac475c0d4c11199c3a749e4e9ea33890))


### Features

* **import-order:** add padding and separate type imports ([fb36189](https://github.com/conarti/eslint-plugin-fsd/commit/fb361896f064cc059b0869d4bc1f6059208c5330))
* **layers-slices:** update error message ([3787909](https://github.com/conarti/eslint-plugin-fsd/commit/3787909dc35930120729b4a9bf62273aeaa8d6dd))
* **rules:** show rule errors over paths instead 'import' ([74e2b79](https://github.com/conarti/eslint-plugin-fsd/commit/74e2b793aa5ed81174afb74a82afc720981c5399))


### BREAKING CHANGES

* the name of the rule has been changed, you need to rename it in your eslint configs



## [0.0.17](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.16...v0.0.17) (2023-03-03)


### Bug Fixes

* **layer-imports:** add 'processes' layer to error message ([11cbf93](https://github.com/conarti/eslint-plugin-fsd/commit/11cbf93cb3ab7e2a62705196122da82ac13765ba))


* feat(layer-imports)!: rename rule 'layer-imports' to 'layers-slices' ([b732ec1](https://github.com/conarti/eslint-plugin-fsd/commit/b732ec16b26920a6e457ee13993370dc2e703cd7))


### Features

* **layer-imports:** don't throw an error when importing from the same slice ([28a002f](https://github.com/conarti/eslint-plugin-fsd/commit/28a002fbfb790bf1e872abac78950f5b068b5655))


### BREAKING CHANGES

* the name of the rule has been changed, you need to rename it in your eslint configs



## [0.0.16](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.15...v0.0.16) (2023-02-22)


### Features

* **layer-imports:** add functionality for ignoring by patterns ([751e86c](https://github.com/conarti/eslint-plugin-fsd/commit/751e86c34cde89a5d65bad6d02b3e4b802bcd446))



## [0.0.15](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.14...v0.0.15) (2023-02-21)


### Bug Fixes

* **path-checker:** imports inside 'app' and 'shared' should be relative ([5ebb65d](https://github.com/conarti/eslint-plugin-fsd/commit/5ebb65dd18cae92d2c8229b7455856c371d6a3a5))
* **path-checker:** update message for relative path errors ([4aeea52](https://github.com/conarti/eslint-plugin-fsd/commit/4aeea52d4320430bf68f481743d26c997fb6071a))


### Features

* **configs:** set 'all' config as 'recommended', enable 'allowTypeImports' by default ([e2f800d](https://github.com/conarti/eslint-plugin-fsd/commit/e2f800d011e42563126f1b5d925ef75da3c106a5))
* **layer-imports:** add a setting to disable checking for type imports ([8605f58](https://github.com/conarti/eslint-plugin-fsd/commit/8605f58f5a508858b10f29d1f17bc663cfd7fbb1))



## [0.0.14](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.13...v0.0.14) (2023-02-12)


### Bug Fixes

* **path-checker:** shouldBeRelative - don't error for imports from another layer ([aad40c0](https://github.com/conarti/eslint-plugin-fsd/commit/aad40c028c208f07db92a6fdf8e04ef88f4ebfd8))



## [0.0.13](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.12...v0.0.13) (2023-02-12)


### Bug Fixes

* **get-layer-slice-from-path:** don't find a file as a slice ([1de7f4b](https://github.com/conarti/eslint-plugin-fsd/commit/1de7f4b9e9a9c0f69ee733aa2b4f4d1c76b550ab))
* **layer-imports:** allow imports from same layer for '{layer}/{file}' pattern ([f00cdaf](https://github.com/conarti/eslint-plugin-fsd/commit/f00cdaf43dcb25f4e84d8a5162b77ea72c3d7e52))


### Features

* **path-checker:** error if should relative import at files like {layer}/{filename} pattern ([e34ff41](https://github.com/conarti/eslint-plugin-fsd/commit/e34ff4139be131d80b093327920a8166b5d12b08))



## [0.0.12](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.11...v0.0.12) (2023-02-12)


### Bug Fixes

* **public-api-imports:** don't check imports from 'shared' ([2e0801b](https://github.com/conarti/eslint-plugin-fsd/commit/2e0801bc299143d6b55636ba5759e2892137d4d4))



## [0.0.11](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.10...v0.0.11) (2023-02-12)


### Bug Fixes

* **layer-imports:** disable imports from one layer except 'shared', correct validation mistakes, 'canNotImportLayer' -> 'canImportLayer' ([5623b69](https://github.com/conarti/eslint-plugin-fsd/commit/5623b696c47d5da2cd8be2b6c7dbd53b03642636))


### Features

* **get-layer-slice-from-path:** rename from 'getPathParts', fix implementation ([72c543f](https://github.com/conarti/eslint-plugin-fsd/commit/72c543f08bd71a2336caac1b0645c70188626671))
* **layer-imports:** implementation without 'alias' option ([db41630](https://github.com/conarti/eslint-plugin-fsd/commit/db4163089ad3ba48e76d3a8fccd68572ed5c7edb))
* **normalize-path:** don't remove aliases ([5e00cae](https://github.com/conarti/eslint-plugin-fsd/commit/5e00caef5713cd509f345c8f5647c844ac2064b2))
* **normalizePath:** automatic detection of aliases and their removal from the path ([c8ff1b2](https://github.com/conarti/eslint-plugin-fsd/commit/c8ff1b25f91842a1be2b92475f6a6603c28e9ba2))
* **path-checker:** checks 'should be absolute' ([6510e71](https://github.com/conarti/eslint-plugin-fsd/commit/6510e719982aa7010e7e068d86377bba0685e05e))
* **path-checker:** implementation without 'alias' option ([5ba3dac](https://github.com/conarti/eslint-plugin-fsd/commit/5ba3dac6500d0fd1769f6c2d6f263f168fe39df3))
* **public-api-imports:** automatically detect aliases in the path ([be743b8](https://github.com/conarti/eslint-plugin-fsd/commit/be743b87e9f9de9f45313b505214063fa4487474))
* **public-api-imports:** new implementation with auto-detect aliases and working with any paths ([1b3e2ad](https://github.com/conarti/eslint-plugin-fsd/commit/1b3e2ad5efc2d4b6b3b948a29942f178155fc435))


### Reverts

* add 'getByRegExp' and 'getAlias' to helpers public api ([e71f8aa](https://github.com/conarti/eslint-plugin-fsd/commit/e71f8aa4585107ed960b5dddfad413f133cee7d9))



## [0.0.10](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.9...v0.0.10) (2023-01-17)


### Features

* **import-order:** disable rule for imports from the same slice ([90668ac](https://github.com/conarti/eslint-plugin-fsd/commit/90668ac816656e319d15ed471eeda084adfb7675))


### Reverts

* Revert "refactor(layer-imports): change function canNotImportLayer to canImportLayer, move to global helpers" ([284ca0c](https://github.com/conarti/eslint-plugin-fsd/commit/284ca0c8993d05d14d54e91ffd52a70b5f0facb1))



## [0.0.9](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.8-beta1...v0.0.9) (2023-01-16)


### Features

* **import-order:** throw errors when has lines between groups ([38a5420](https://github.com/conarti/eslint-plugin-fsd/commit/38a542033b13cafaad9e38c6e58ed3e9793bd9c7))



## [0.0.8-beta1](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.8...v0.0.8-beta1) (2023-01-16)


### Features

* setup configs ([65af4f0](https://github.com/conarti/eslint-plugin-fsd/commit/65af4f0a64e376da161d740551a20b0877605824))



## [0.0.8](https://github.com/conarti/eslint-plugin-fsd/compare/v0.0.7...v0.0.8) (2023-01-16)


### Features

* setup import-order rule, update docs ([b333104](https://github.com/conarti/eslint-plugin-fsd/commit/b333104538098e8ab460c32aa9e50073dc9ae35f))



## [0.0.7](https://github.com/conarti/eslint-plugin-fsd/compare/d7d1f135401328c6071c924b162b2fffdfda592c...v0.0.7) (2023-01-06)


### Bug Fixes

* **public-api-imports:** disable for 'app' imports ([b5032e9](https://github.com/conarti/eslint-plugin-fsd/commit/b5032e9d78ac0e07991f69567149d489a060f5a9))


### Features

* add public-api-imports rule ([5c1cfe3](https://github.com/conarti/eslint-plugin-fsd/commit/5c1cfe3e0ad981a623bcf36a24853f50ba5f7dbd))
* **path-checker:** add alias implementation ([d7d1f13](https://github.com/conarti/eslint-plugin-fsd/commit/d7d1f135401328c6071c924b162b2fffdfda592c))
* **public-api-imports:** add auto fix for rule ([7889f73](https://github.com/conarti/eslint-plugin-fsd/commit/7889f73a183e8a0e6e04cf7d100a7b034d587028))
* **rules:** setup 'layer-imports' rule ([ec86bd3](https://github.com/conarti/eslint-plugin-fsd/commit/ec86bd30c39268bb7ea925c5a9c2cce39e6ba2a5))



