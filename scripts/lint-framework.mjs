// Vue template coverage remains mandatory; settings live in the central Vite+ config.
import { ESLint } from 'eslint'
import { frameworkLintConfig, frameworkLintFiles } from '../vite.config.js'

const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: frameworkLintConfig })
const results = await eslint.lintFiles(frameworkLintFiles)
const formatter = await eslint.loadFormatter('stylish')
const output = formatter.format(results)
if (output) console.log(output)
if (results.some((result) => result.errorCount > 0)) process.exitCode = 1
