## Git

### Commits

- Commite régulièrement, sans attendre qu'on te le demande : un commit par changement logique, dès qu'il est terminé.
- Chaque commit est atomique : un seul sujet et le moins de code possible, pour pouvoir le cherry-pick ou le revert seul.
- Ne mélange jamais une refacto, un correctif et une fonctionnalité dans le même commit.
- Écris les messages en anglais, au format Conventional Commits : `type(scope): résumé` (`feat`, `fix`, `refactor`, `docs`, `test`, `chore`…). Le résumé dit clairement ce que fait le commit, pour l'identifier sans lire le diff.

### Push

- Ne push jamais sans autorisation explicite. Le développeur s'en charge la plupart du temps.
- Après le rebase d'une branche déjà poussée, le push forcé suit la même règle, et utilise `--force-with-lease`, jamais `--force`.

### Branches et PR

- Travaille sur la branche courante. Ne crée une branche que si on te le demande.
- Pour mettre une branche à jour avec `main`, rebase-la sur `main`. Ne merge jamais `main` dans la branche.
- Fusionne les PR en « rebase and merge », pas en merge commit ni en squash.
