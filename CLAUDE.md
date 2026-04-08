# CLAUDE.md — OS du Projet Drinkinator
> Derniere mise a jour : 2026-04-08

Application browser pure (ES modules). Pas de Node.js, pas de bundler, pas de build step.
Ouvrir `index.html` directement ou via un serveur statique.
UI en francais, code/commentaires en anglais.

## Glossaire Metier

| Terme canonique | Definition | Synonymes INTERDITS |
|---|---|---|
| **BAC** | Blood Alcohol Content, taux en g/L dans le sang | "taux", "alcoolemie", "niveau" |
| **Drink** | Objet `{ name, vol, abv, time }` — une consommation | "boisson", "conso", "item" |
| **BACParams** | Parametres corporels `{ weight, sexFactor, elimRate, limit }` | "profil", "config", "settings" |
| **Preset** | Template de boisson `{ name, vol, abv, icon }` | "modele", "default" |
| **elimRate** | Taux d'elimination alcool en g/L/h (Widmark) | "metabolism", "clearance" |
| **sexFactor** | Facteur de distribution Widmark (0.7 M / 0.6 F) | "ratio", "coefficient" |
| **limit** | Seuil legal en g/L pour la conduite | "seuil", "max", "threshold" |
| **Store** | Objet reactif retourne par `createDrinkStore()` | "state", "context", "manager" |
| **Barrel** | Fichier `index.js` qui re-exporte l'API publique d'un module | "facade", "proxy" |

## Regles d'Or (non negociables)

1. Aucun import circulaire. Jamais importer `app.js` depuis un module.
2. Fichiers < 150 lignes (hors `types.js` et `constants.js`).
3. Fonctions pures obligatoires dans `core/` — effets de bord isoles dans `app.js`.
4. Zero valeur hardcodee en dehors de `constants.js`.
5. Pas de default exports — toujours des named exports.
6. Pas de fusion de fichiers precedemment separes.
7. Pas de DOM dans `core/` (sauf localStorage/console dans logger).
8. Pas d'import `state/` depuis `ui/`.
9. Pas de re-export de `constants.js` via les barrels.
10. Pas de try/catch dans les modules purs — toutes les error boundaries dans `app.js`.
11. Utiliser le glossaire metier — pas de synonymes pour les termes definis.
12. Tout bug corrige = un test de non-regression dans `tests/repro/`.

## Architecture — Modele en Couches

```
Layer 0  (aucun import)     types.js, constants.js, data/
Layer 1  (importe L0)       core/  (calculs purs + logger + validation)
Layer 2  (importe L0 + L1)  state/ (lecture DOM -> objets, importe core/)
Layer 3  (importe L0)       ui/    (rendu DOM, pas d'import state/ ni core/)
Orchestrateur               app.js (importe tout, cable tout, error boundaries)
```

Regle : un module n'importe que depuis sa couche ou une couche inferieure.

## Carte des Modules

```
src/
  constants.js          Constantes partagees (Layer 0, import direct)
  types.js              JSDoc typedefs (Layer 0, pas d'export runtime)
  core/
    bac.js              drinkBAC(), computeBAC()
    search.js           findTimeTo() — recherche binaire
    format.js           fmtTime(), fmtDuration()
    params.js           sexFactor(), elimRate() — parametres Widmark
    logger.js           log.error/warn/info/debug/dump/clear + traceId
    validate.js         validateDrink(), validateBACParams()
    index.js            Barrel
  data/
    countries.js        COUNTRIES[]
    presets.js          PRESETS[]
    index.js            Barrel
  state/
    drink-store.js      createDrinkStore() — store reactif
    profile.js          readProfile(), toleranceLabel()
    index.js            Barrel
  ui/
    status.js           renderStatus()
    drink-list.js       renderDrinkList()
    modal.js            createTimeModal()
    index.js            Barrel
  app.js                Orchestrateur, event listeners, error boundaries
```

-> Voir `ARCHITECTURE.md` pour le graphe Mermaid complet.

## Protocole de Debug (obligatoire)

**Regle : Avant toute action, analyse les logs. Ne repare rien sans avoir reproduit.**

1. Ouvrir la console navigateur.
2. Executer `log.dump()` — identifier le premier `[ERROR]` ou anomalie.
3. Le `traceId` correle tous les logs d'une meme session.
4. Format console :
   - `[ERROR][module]` — erreur avec stack trace
   - `[INPUT][module]` — donnees d'entree au moment de l'erreur
   - `[STACK][module]` — stack trace detaillee
   - `[STATE][module]` — avertissements (validation echouee, etc.)
   - `[INFO][module]`  — evenements normaux (boot, etc.)
   - `[OUTPUT][module]` — resultats produits (debug)
5. Reproduire le bug dans `tests/repro/[bug-slug].test.html`.
6. Corriger le code source.
7. Verifier que le test passe ET que le log confirme la disparition de l'erreur.
8. `log.clear()` pour reinitialiser apres investigation.

## Validation Inter-Modules

Les echanges entre couches sont valides a la frontiere (dans `app.js`) :
- `validateBACParams(params)` — apres `readProfile()`, avant `computeBAC()`
- `validateDrink(drink)` — disponible pour valider un Drink avant ajout

Retour : `{ valid: boolean, reason?: string }`. Pas d'exception lancee.

## Ce que tu NE dois PAS faire

- Modifier `constants.js` sans verifier tous les consommateurs (grep).
- Refactorer un module sans avoir lu son barrel `index.js`.
- Supprimer un `log.*` sans justification dans le commit message.
- Ajouter du DOM dans `core/`.
- Importer directement un fichier interne (toujours passer par le barrel).
- Creer un fichier > 150 lignes.

## Conventions de Nommage

- Fichiers : `kebab-case.js`
- Fonctions exportees : `camelCase`
- Constantes exportees : `UPPER_SNAKE_CASE`
- Typedefs JSDoc : `PascalCase`
- Classes CSS / IDs DOM : `kebab-case`

## Ajouter une Fonctionnalite

1. Identifier la couche cible.
2. Creer un NOUVEAU fichier dans le dossier correspondant.
3. Ajouter l'export au barrel `index.js` du dossier.
4. Cabler dans `app.js`.
5. Si nouvelle constante -> `constants.js`.
6. Si nouveau type -> `types.js`.
7. Wrapper tout call site dans `app.js` avec `try/catch` + `log.error(...)`.
8. Ajouter un test dans `tests/integration/`.
