# @cernix-fr/socle

Règles de base pour agents IA, à installer dans n'importe quel projet.

`AGENTS.md` est la source unique : Codex, Cursor, Copilot, Gemini et la plupart des outils le lisent. Pour Claude Code, un `CLAUDE.md` contenant `@AGENTS.md` est créé automatiquement.

## Utilisation dans un projet

Depuis la racine du projet (Node ≥ 20.11 requis, quelle que soit la stack du projet) :

```bash
npx @cernix-fr/socle list                      # modules disponibles
npx @cernix-fr/socle init base git typescript  # installe les modules choisis
npx @cernix-fr/socle@latest update             # met à jour avec la dernière version
```

Les règles sont écrites dans `AGENTS.md`, entre deux marqueurs :

```md
<!-- socle:start modules=base,git,typescript -->
…
<!-- socle:end -->
```

Tout ce qui est en dehors de ce bloc appartient au projet et n'est jamais modifié. `update` relit la liste des modules dans le marqueur.

## Règles personnelles (global)

```bash
npx @cernix-fr/socle global
```

Écrit `global/AGENTS.md` dans `~/.claude/CLAUDE.md` et `~/.codex/AGENTS.md` (ou `$CLAUDE_CONFIG_DIR` / `$CODEX_HOME`), avec les mêmes marqueurs. Le contenu existant de ces fichiers est conservé.

## Structure

```
rules/<module>.md   un fichier par thème ou par stack, installé par projet
global/AGENTS.md    préférences personnelles, installées sur la machine
bin/socle.mjs       la CLI (Node, sans dépendance)
```

Ajouter un module = ajouter un fichier dans `rules/`. Chaque fichier commence par son propre titre `##`.

## Publier une version

```bash
npm test
npm version patch   # ou minor / major
npm publish
git push --follow-tags
```
