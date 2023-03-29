# Changelog

## 1.0.0 (2023-03-29)


### ⚠ BREAKING CHANGES

* **public-api-imports:** the name of the rule has been changed, you need to rename it in your eslint configs
* **path-checker:** the name of the rule has been changed, you need to rename it in your eslint configs
* **layer-imports:** the name of the rule has been changed, you need to rename it in your eslint configs

### Features

* **absolute-relative:** export validation ([d4243e2](https://github.com/conarti/eslint-plugin-fsd/commit/d4243e2bc26919078a219b7364b28d9798bbf177))
* add public-api-imports rule ([5c1cfe3](https://github.com/conarti/eslint-plugin-fsd/commit/5c1cfe3e0ad981a623bcf36a24853f50ba5f7dbd))
* **configs:** set 'all' config as 'recommended', enable 'allowTypeImports' by default ([e2f800d](https://github.com/conarti/eslint-plugin-fsd/commit/e2f800d011e42563126f1b5d925ef75da3c106a5))
* **get-layer-slice-from-path:** case insensitive ([7b81eed](https://github.com/conarti/eslint-plugin-fsd/commit/7b81eed1c97c5025c354c7679f8e85125cd48448))
* **get-layer-slice-from-path:** rename from 'getPathParts', fix implementation ([72c543f](https://github.com/conarti/eslint-plugin-fsd/commit/72c543f08bd71a2336caac1b0645c70188626671))
* **helpers:** add convert-to-absolute helper ([2d93396](https://github.com/conarti/eslint-plugin-fsd/commit/2d93396af5b17fbebdc6b9843ee987d3f2055758))
* **import-order:** add padding and separate type imports ([fb36189](https://github.com/conarti/eslint-plugin-fsd/commit/fb361896f064cc059b0869d4bc1f6059208c5330))
* **import-order:** disable rule for imports from the same slice ([90668ac](https://github.com/conarti/eslint-plugin-fsd/commit/90668ac816656e319d15ed471eeda084adfb7675))
* **import-order:** throw errors when has lines between groups ([38a5420](https://github.com/conarti/eslint-plugin-fsd/commit/38a542033b13cafaad9e38c6e58ed3e9793bd9c7))
* **layer-imports:** add a setting to disable checking for type imports ([8605f58](https://github.com/conarti/eslint-plugin-fsd/commit/8605f58f5a508858b10f29d1f17bc663cfd7fbb1))
* **layer-imports:** add functionality for ignoring by patterns ([751e86c](https://github.com/conarti/eslint-plugin-fsd/commit/751e86c34cde89a5d65bad6d02b3e4b802bcd446))
* **layer-imports:** don't throw an error when importing from the same slice ([28a002f](https://github.com/conarti/eslint-plugin-fsd/commit/28a002fbfb790bf1e872abac78950f5b068b5655))
* **layer-imports:** implementation without 'alias' option ([db41630](https://github.com/conarti/eslint-plugin-fsd/commit/db4163089ad3ba48e76d3a8fccd68572ed5c7edb))
* **layer-imports:** rename rule 'layer-imports' to 'layers-slices' ([b732ec1](https://github.com/conarti/eslint-plugin-fsd/commit/b732ec16b26920a6e457ee13993370dc2e703cd7))
* **layers-slices:** update error message ([3787909](https://github.com/conarti/eslint-plugin-fsd/commit/3787909dc35930120729b4a9bf62273aeaa8d6dd))
* **layers-slices:** validate relative paths ([1b153ab](https://github.com/conarti/eslint-plugin-fsd/commit/1b153ab450d8d26d2fe2bb4ecaa9ed2ba72833c1))
* **normalize-path:** don't remove aliases ([5e00cae](https://github.com/conarti/eslint-plugin-fsd/commit/5e00caef5713cd509f345c8f5647c844ac2064b2))
* **normalizePath:** automatic detection of aliases and their removal from the path ([c8ff1b2](https://github.com/conarti/eslint-plugin-fsd/commit/c8ff1b25f91842a1be2b92475f6a6603c28e9ba2))
* **path-checker:** add alias implementation ([d7d1f13](https://github.com/conarti/eslint-plugin-fsd/commit/d7d1f135401328c6071c924b162b2fffdfda592c))
* **path-checker:** checks 'should be absolute' ([6510e71](https://github.com/conarti/eslint-plugin-fsd/commit/6510e719982aa7010e7e068d86377bba0685e05e))
* **path-checker:** error if should relative import at files like {layer}/{filename} pattern ([e34ff41](https://github.com/conarti/eslint-plugin-fsd/commit/e34ff4139be131d80b093327920a8166b5d12b08))
* **path-checker:** implementation without 'alias' option ([5ba3dac](https://github.com/conarti/eslint-plugin-fsd/commit/5ba3dac6500d0fd1769f6c2d6f263f168fe39df3))
* **path-checker:** rename rule to 'absolute-relative' ([68ce50a](https://github.com/conarti/eslint-plugin-fsd/commit/68ce50a1ac475c0d4c11199c3a749e4e9ea33890))
* **public-api-imports:** add auto fix for rule ([7889f73](https://github.com/conarti/eslint-plugin-fsd/commit/7889f73a183e8a0e6e04cf7d100a7b034d587028))
* **public-api-imports:** automatically detect aliases in the path ([be743b8](https://github.com/conarti/eslint-plugin-fsd/commit/be743b87e9f9de9f45313b505214063fa4487474))
* **public-api-imports:** change rule fix to suggestion ([f0489f3](https://github.com/conarti/eslint-plugin-fsd/commit/f0489f3ca80e8e2038b8111ff30d1a68e76be6e4))
* **public-api-imports:** new implementation with auto-detect aliases and working with any paths ([1b3e2ad](https://github.com/conarti/eslint-plugin-fsd/commit/1b3e2ad5efc2d4b6b3b948a29942f178155fc435))
* **public-api-imports:** rename rule to 'public-api' ([fb6b6d3](https://github.com/conarti/eslint-plugin-fsd/commit/fb6b6d3f28c09ed66d5bdcc39d2dc3bc726e0c5b))
* **public-api:** add fixed path to error message ([4fddcde](https://github.com/conarti/eslint-plugin-fsd/commit/4fddcde76bc5abafcf5cbbb4635eac15e875b30f))
* **rules:** setup 'layer-imports' rule ([ec86bd3](https://github.com/conarti/eslint-plugin-fsd/commit/ec86bd30c39268bb7ea925c5a9c2cce39e6ba2a5))
* **rules:** show rule errors over paths instead 'import' ([74e2b79](https://github.com/conarti/eslint-plugin-fsd/commit/74e2b793aa5ed81174afb74a82afc720981c5399))
* setup configs ([65af4f0](https://github.com/conarti/eslint-plugin-fsd/commit/65af4f0a64e376da161d740551a20b0877605824))
* setup import-order rule, update docs ([b333104](https://github.com/conarti/eslint-plugin-fsd/commit/b333104538098e8ab460c32aa9e50073dc9ae35f))


### Bug Fixes

* **absolute-relative:** error when validating exported values (not re-exports) ([36a9b77](https://github.com/conarti/eslint-plugin-fsd/commit/36a9b77e4c5f2c5b126cd110c906452476fe8347))
* **get-layer-slice-from-path:** correction of work with segment names ([741bfa3](https://github.com/conarti/eslint-plugin-fsd/commit/741bfa3e17dca2e56f2b2e203a39be2c01fa93e4))
* **get-layer-slice-from-path:** don't find a file as a slice ([1de7f4b](https://github.com/conarti/eslint-plugin-fsd/commit/1de7f4b9e9a9c0f69ee733aa2b4f4d1c76b550ab))
* **get-layer-slice-from-path:** working with kebab-case paths ([9d61320](https://github.com/conarti/eslint-plugin-fsd/commit/9d61320ab726a1781d7b3574b383a6cbc42c5951))
* **layer-imports:** add 'processes' layer to error message ([11cbf93](https://github.com/conarti/eslint-plugin-fsd/commit/11cbf93cb3ab7e2a62705196122da82ac13765ba))
* **layer-imports:** allow imports from same layer for '{layer}/{file}' pattern ([f00cdaf](https://github.com/conarti/eslint-plugin-fsd/commit/f00cdaf43dcb25f4e84d8a5162b77ea72c3d7e52))
* **layer-imports:** disable imports from one layer except 'shared', correct validation mistakes, 'canNotImportLayer' -&gt; 'canImportLayer' ([5623b69](https://github.com/conarti/eslint-plugin-fsd/commit/5623b696c47d5da2cd8be2b6c7dbd53b03642636))
* **layers-slices:** remove extra '&gt;' ([70a219b](https://github.com/conarti/eslint-plugin-fsd/commit/70a219bb0911c330fa426fb28ae6b48bdd56d969))
* **normalize-path:** do not delete '.' ([ae463bb](https://github.com/conarti/eslint-plugin-fsd/commit/ae463bbf26ca65c74d6adc6fcce86bb23e91ac49))
* **path-checker:** imports inside 'app' and 'shared' should be relative ([5ebb65d](https://github.com/conarti/eslint-plugin-fsd/commit/5ebb65dd18cae92d2c8229b7455856c371d6a3a5))
* **path-checker:** shouldBeRelative - don't error for imports from another layer ([aad40c0](https://github.com/conarti/eslint-plugin-fsd/commit/aad40c028c208f07db92a6fdf8e04ef88f4ebfd8))
* **path-checker:** update message for relative path errors ([4aeea52](https://github.com/conarti/eslint-plugin-fsd/commit/4aeea52d4320430bf68f481743d26c997fb6071a))
* **public-api-imports:** disable for 'app' imports ([b5032e9](https://github.com/conarti/eslint-plugin-fsd/commit/b5032e9d78ac0e07991f69567149d489a060f5a9))
* **public-api-imports:** don't check imports from 'shared' ([2e0801b](https://github.com/conarti/eslint-plugin-fsd/commit/2e0801bc299143d6b55636ba5759e2892137d4d4))
* **public-api:** validation with grouping folders ([88d282a](https://github.com/conarti/eslint-plugin-fsd/commit/88d282a86c5246edbd4a479ad2a79384c57d255a))
* **public-api:** working with paths in 'kebab-case' ([1a73850](https://github.com/conarti/eslint-plugin-fsd/commit/1a73850f4b2f9d99af863ea63b86da1f798a71f9))


### Reverts

* add 'getByRegExp' and 'getAlias' to helpers public api ([e71f8aa](https://github.com/conarti/eslint-plugin-fsd/commit/e71f8aa4585107ed960b5dddfad413f133cee7d9))
