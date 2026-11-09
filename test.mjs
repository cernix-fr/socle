import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

const cli = join(import.meta.dirname, 'bin', 'socle.mjs')
const run = (cwd, ...args) => {
  const env = { ...process.env, HOME: cwd }
  delete env.CLAUDE_CONFIG_DIR
  delete env.CODEX_HOME
  return execFileSync(process.execPath, [cli, ...args], { cwd, env, stdio: 'pipe' }).toString()
}
const tmp = () => mkdtempSync(join(tmpdir(), 'socle-'))
const read = (...p) => readFileSync(join(...p), 'utf8')
const count = (s, sub) => s.split(sub).length - 1

test('init puis update conservent le contenu du projet', () => {
  const dir = tmp()
  writeFileSync(join(dir, 'AGENTS.md'), '# Mon projet\n\nRègle locale.\n')

  run(dir, 'init', 'base', 'base')
  let agents = read(dir, 'AGENTS.md')
  assert.match(agents, /^# Mon projet\n\nRègle locale\.\n\n<!-- socle:start modules=base -->\n/)
  assert.equal(read(dir, 'CLAUDE.md'), '@AGENTS.md\n')

  // Bloc modifié à la main : update le régénère sans dupliquer.
  writeFileSync(join(dir, 'AGENTS.md'), agents.replace('Communication', 'altéré'))
  run(dir, 'update')
  run(dir, 'init', 'base')
  agents = read(dir, 'AGENTS.md')
  assert.equal(count(agents, 'socle:start'), 1)
  assert.equal(count(agents, 'Règle locale.'), 1)
  assert.ok(agents.includes('## Communication'))
  assert.equal(read(dir, 'CLAUDE.md'), '@AGENTS.md\n')
})

test('CLAUDE.md existant : import ajouté une seule fois', () => {
  const dir = tmp()
  writeFileSync(join(dir, 'CLAUDE.md'), '# Notes Claude\n')
  run(dir, 'init', 'base')
  run(dir, 'init', 'base')
  assert.equal(read(dir, 'CLAUDE.md'), '# Notes Claude\n\n@AGENTS.md\n')
})

test('module inconnu et update sans bloc échouent', () => {
  const dir = tmp()
  assert.throws(() => run(dir, 'init', 'nexistepas'), /inconnu/)
  assert.throws(() => run(dir, 'update'), /Aucun bloc/)
})

test('global conserve le contenu existant', () => {
  const home = tmp()
  mkdirSync(join(home, '.claude'))
  writeFileSync(join(home, '.claude', 'CLAUDE.md'), '# Perso\n')
  run(home, 'global')
  run(home, 'global')
  const claude = read(home, '.claude', 'CLAUDE.md')
  assert.ok(claude.startsWith('# Perso\n\n<!-- socle:start -->'))
  assert.equal(count(claude, 'socle:start'), 1)
  assert.ok(read(home, '.codex', 'AGENTS.md').includes('Préférences personnelles'))
})
