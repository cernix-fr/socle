## Communication

- Réponds toujours en français.
- Ne réponds jamais seulement « c'est fait ». Termine toujours par un court récapitulatif des modifications : fichiers touchés, ce qui a changé, ce qui reste à faire ou n'a pas été vérifié.

## Code

- Écris le code en anglais : noms de variables, fonctions, classes, fichiers et messages de log.
- Écris les commentaires en anglais, et seulement quand ils apportent une information que le code ne donne pas. Une fonction bien nommée qui fait exactement ce que son nom décrit n'a pas besoin de commentaire.
- Déclare les types, interfaces, enums et classes dans des fichiers dédiés, jamais dans le fichier qui les utilise :
  - les types et interfaces d'un même module sont regroupés dans un fichier dédié (ex. `user.types.ts`) ;
  - une classe par fichier.
- Utilise les alias d'import du projet (ex. `@/components/…`) quand ils existent, plutôt que des chemins relatifs.
- N'imbrique jamais de ternaires. Préfère des variables bien nommées, des `if`/`else` plats et des retours anticipés. Un ternaire simple reste acceptable.
- Ne masque jamais une erreur : pas de `catch` vide, ni de valeur par défaut (`return null`, `?? []`) qui fait passer un échec pour un résultat vide. Propage l'erreur ou affiche-la.
- N'ajoute pas de dépendance pour ce que quelques lignes de code suffisent à faire.
- N'édite jamais à la main un fichier généré (types de base de données, clients d'API…). Modifie sa source et relance le générateur.

## Tests et vérification

- Si le projet a des tests unitaires, écris des tests pour chaque fonction écrite ou modifiée.
- Après une modification, lance les tests qui couvrent le code touché et indique le résultat.
- Ne conclus jamais au succès sur un signal indirect. Vérifie à la source qui fait foi : données en base, rendu à l'écran, réponse réelle de l'API.
- Ne présente jamais une estimation ou une supposition comme une vérification. Si quelque chose n'a pas pu être vérifié, dis-le.

## Production et secrets

- N'écris jamais sur un environnement de production : migrations et données en base, serveurs, déploiements. La lecture seule est permise. Pour toute écriture, donne la commande et laisse le développeur la lancer.
- Fais les essais et les vérifications sur une base locale ou une copie, jamais sur les données réelles.
- Ne commite jamais de secret, de fichier `.env` ni de donnée personnelle. Les notes privées vont dans un dossier ignoré par git.
