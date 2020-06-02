# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).


## [Unreleased]


## [1.5.0] - 2020-06-02
### Changed

 - Improve README. #27

### Added

 - Add `serverline.getCollection()` will return { stdout, stderr }. #27


## [1.4.2] - 2019-08-28
### Fixed

 - `serverline.question()` doesn't work #24


## [1.4.1] - 2019-08-28
### Fixed

 - `serverline.resume()` called `rl.pause()` instead of `rl.resume()` #23
 - `serverline.question()` was missing #23


## [1.4.0] - 2019-08-22
### Changed

 - `serverline.init()` can accept an object `options`. #11
 - Code review (#12, #13).

### Added

 - Add `colorMode` and `inspectOptions` properties in options for `serverline.init(options)`. #11
 - Add `ignoreErrors`, `forceTerminalContext` properties in options for `serverline.init(options)`. #13

### Fixed

 - Fix error in Serverline Streams when `rl.history` are not defined. #13
 - Fix error when output is redirect (with `npm start > file.txt`, `npm start | tee file.txt`, child_process, ...). #13
 - Fix display error when prompt.length != 2 and multiline prompt #16


## [1.3.1] - 2019-08-20
### Fixed

 - Fix Escape Code : bug was appeared when the last console.log had several lines and prompt was on the bottom of the screen #6


## [1.3.0] - 2019-08-20
### Changed

 - Improve README.md #5

### Added

 - Add `_debugModuleSupport(require('debug'))` function for debug module #5


## [1.2.0] - 2019-08-20
### Changed

 - Improve README.md #4
 - Improve Events system #4

### Added

 - Add resume function #4


## [1.1.0] - 2019-08-20
### Changed

 - Rewrite README.md #3

### Added

 - Add close function #3
