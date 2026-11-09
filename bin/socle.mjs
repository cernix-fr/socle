#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const BLOCK = /<!-- socle:start[^>]*-->[\s\S]*?<!-- socle:end -->/
const MODULES = /<!-- socle:start modules=(\S+) -->/

const USAGE = `Usage :
  socle init <modules...>   Écrit les modules dans AGENTS.md (+ CLAUDE.md) du dossier courant
  socle update              Régénère le bloc avec les modules déjà installés
  socle list                Liste les modules disponibles
  socle global              Installe les règles perso dans ~/.claude/CLAUDE.md et ~/.codex/AGENTS.md`

const read = (file) => (existsSync(file) ? readFileSync(file, 'utf8') : '')

function die(message) {
  console.error(message)
  process.exit(1)
}

function available() {
  return readdirSync(join(ROOT, 'rules'))
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.slice(0, -3))
    .sort()
}

// Remplace le bloc socle s'il existe, sinon l'ajoute en fin de fichier.
// Tout ce qui est hors du bloc est conservé.
function upsert(file, body, attrs = '') {
  const block = `<!-- socle:start${attrs} -->\n${body.trim()}\n<!-- socle:end -->`
  const current = read(file)
  const next = BLOCK.test(current)
    ? current.replace(BLOCK, () => block)
    : `${current.trimEnd()}${current.trim() ? '\n\n' : ''}${block}\n`
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, next)
  console.log(`✓ ${file}`)
}

function installProject(dir, modules) {
  modules = [...new Set(modules)]
  const known = available()
  const unknown = modules.filter((m) => !known.includes(m))
  if (unknown.length) die(`Module(s) inconnu(s) : ${unknown.join(', ')}\nDisponibles : ${known.join(', ')}`)

  const body = modules.map((m) => read(join(ROOT, 'rules', `${m}.md`)).trim()).join('\n\n')
  upsert(join(dir, 'AGENTS.md'), body, ` modules=${modules.join(',')}`)

  // Claude Code ne lit pas AGENTS.md : CLAUDE.md l'importe.
  const claude = join(dir, 'CLAUDE.md')
  const current = read(claude)
  if (!current.includes('@AGENTS.md')) {
    writeFileSync(claude, `${current.trimEnd()}\n\n@AGENTS.md\n`.trimStart())
    console.log(`✓ ${claude}`)
  }
}

const [command, ...args] = process.argv.slice(2)
const cwd = process.cwd()

switch (command) {
  case 'init':
    if (!args.length) die(`Aucun module indiqué.\n\n${USAGE}`)
    installProject(cwd, args)
    break
  case 'update': {
    const match = read(join(cwd, 'AGENTS.md')).match(MODULES)
    if (!match) die('Aucun bloc socle dans AGENTS.md. Lance d’abord : socle init <modules...>')
    installProject(cwd, match[1].split(','))
    break
  }
  case 'list':
    console.log(available().join('\n'))
    break
  case 'global': {
    // Copie (pas de symlink) : avec npx, le package vit dans un cache temporaire.
    const body = read(join(ROOT, 'global', 'AGENTS.md'))
    upsert(join(process.env.CLAUDE_CONFIG_DIR || join(homedir(), '.claude'), 'CLAUDE.md'), body)
    upsert(join(process.env.CODEX_HOME || join(homedir(), '.codex'), 'AGENTS.md'), body)
    break
  }
  default:
    console.log(USAGE)
}
