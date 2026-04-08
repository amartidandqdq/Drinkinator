# Drinkinator

Estimateur de taux d'alcoolemie (BAC) dans le navigateur. Calcule le taux d'alcool dans le sang et l'air expire en temps reel, estime le delai avant de repasser sous le seuil legal et le delai avant sobriete complete.

## Fonctionnalites

- **Calcul BAC en temps reel** (formule de Widmark) — sang (g/L) et air expire (mg/L)
- **11 presets de boissons** (biere, vin, spiritueux, cocktails...)
- **Boisson personnalisee** (volume + degre)
- **Seuils legaux de 21 pays** europeens + mode personnalise
- **Profil utilisateur** : poids, sexe, tolerance
- **Estimation temporelle** : delai avant de pouvoir conduire, delai avant sobriete
- **Barre de progression visuelle** avec code couleur (OK / attention / interdit)
- **Choix horaire flexible** : maintenant, heure precise, ou "il y a X minutes"

## Demarrage rapide

Aucune installation requise. Ouvrir `index.html` dans un navigateur :

```bash
# Option 1 — ouvrir directement
open index.html

# Option 2 — serveur statique
npx serve .
# puis ouvrir http://localhost:3000
```

## Architecture

Application browser pure — ES modules, pas de Node.js, pas de bundler, pas de build step.

```
src/
  constants.js        Constantes partagees (19 valeurs)
  types.js            Typedefs JSDoc
  core/               Logique pure (BAC, recherche, formatage, validation, logger)
  data/               Donnees statiques (pays, presets)
  state/              Gestion d'etat (store reactif, lecture profil)
  ui/                 Composants de rendu (status, liste, modal)
  app.js              Orchestrateur unique
tests/
  test-runner.html    Test runner browser (33 tests)
  integration/        Suites de tests par module
  repro/              Tests de non-regression
```

Voir [`ARCHITECTURE.md`](ARCHITECTURE.md) pour le graphe de dependances Mermaid et les contrats d'interface.

## Tests

Ouvrir `tests/test-runner.html` dans un navigateur :

```bash
npx serve . 
# puis ouvrir http://localhost:3000/tests/test-runner.html
```

5 suites, 33 tests couvrant : calcul BAC, parametres Widmark, formatage, validation, store.

## Contribuer

Lire [`CLAUDE.md`](CLAUDE.md) avant toute modification — il contient le glossaire metier, les regles d'architecture et le protocole de debug obligatoire.

Regles essentielles :
- Fichiers < 150 lignes
- Fonctions pures dans `core/`
- Zero import circulaire
- Toute constante dans `constants.js`
- Error boundaries uniquement dans `app.js`

## Avertissement

Cet outil fournit des estimations approximatives. Le taux reel depend de nombreux facteurs (repas, hydratation, metabolisme, medicaments, etc.). Ne vous fiez jamais uniquement a ce calculateur pour decider de conduire. **En cas de doute, ne conduisez pas.**

## Licence

MIT
