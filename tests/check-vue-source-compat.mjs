// Optional isolated source/declaration check, not an installed/built package check.
import assert from 'node:assert/strict'
import { cpSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const modules = process.env.VUE_COMPAT_NODE_MODULES
assert.ok(
  modules,
  'Set VUE_COMPAT_NODE_MODULES to isolated Vue/compiler-sfc, TypeScript and vue-tsc dependencies'
)
const host = resolve(modules)
const version = JSON.parse(readFileSync(resolve(host, 'vue/package.json'))).version
const fixture = mkdtempSync(resolve(tmpdir(), 'lb-source-types-'))
try {
  symlinkSync(host, resolve(fixture, 'node_modules'), 'dir')
  for (const path of ['src', 'types', 'tests/fixtures', 'reference/examples'])
    cpSync(resolve(path), resolve(fixture, path), { recursive: true })
  const manifest = JSON.parse(readFileSync('package.json', 'utf8'))
  // Package self-reference resolves copied declaration exports, never repository node_modules.
  writeFileSync(
    resolve(fixture, 'package.json'),
    JSON.stringify({ name: manifest.name, type: 'module', exports: manifest.exports })
  )
  const config = JSON.parse(readFileSync('tsconfig.json', 'utf8'))
  config.compilerOptions.skipLibCheck = false
  writeFileSync(resolve(fixture, 'tsconfig.json'), JSON.stringify(config))
  for (const [bin, project] of [
    ['vue-tsc', 'tsconfig.json'],
    ['tsc', 'tests/fixtures/tsconfig.consumer.json'],
    ['tsc', 'tests/fixtures/tsconfig.node-consumer.json']
  ]) {
    const result = spawnSync(resolve(host, '.bin', bin), ['--noEmit', '--project', project], {
      cwd: fixture,
      encoding: 'utf8'
    })
    assert.equal(
      result.status,
      0,
      `${bin} ${project} against Vue ${version}:\n${result.stdout}\n${result.stderr}`
    )
  }
  console.log(
    `PASS isolated Vue ${version}: strict source and declaration checks (Bundler + NodeNext, skipLibCheck=false)`
  )
} finally {
  rmSync(fixture, { recursive: true, force: true })
}
