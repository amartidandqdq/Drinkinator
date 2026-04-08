# AUDIT.md — Drinkinator
> Date : 2026-04-08

## Resume

Application browser pure (ES modules, 887 lignes JS, 20 fichiers).
Aucune dependance externe. Pas de Node.js, pas de build step.

## Points Critiques

### Bloquant

| # | Fichier | Probleme | Risque regression |
|---|---------|----------|-------------------|
| - | aucun | - | - |

Aucun point bloquant identifie. L'architecture est saine et acyclique.

### Majeur

| # | Fichier(s) | Probleme | Risque |
|---|-----------|----------|--------|
| 1 | `core/params.js` | Constantes Widmark hardcodees (0.7, 0.6, 0.10, 0.15, 0.085, 0.10) non extraites dans constants.js | Faible (module isole) |
| 2 | `ui/status.js:75,79` | Magic numbers 3 (timeline scale) et 0.01 (division safeguard) non extraits | Faible |
| 3 | `core/search.js:22` | Nombre d'iterations binaires (50) hardcode | Faible |
| 4 | Aucun test | Zero couverture de test. Aucun filet de securite pour regressions | Eleve |
| 5 | Logger | Pas de `traceId` pour correler les logs d'une meme session | Moyen |
| 6 | Logger | Pas de methode `debug()` ni de tag `[OUTPUT]` | Faible |

### Mineur

| # | Fichier | Probleme | Risque |
|---|---------|----------|--------|
| 7 | `state/profile.js:47` | Magic number 4.99 pour bucket tolerance labels | Negligeable |
| 8 | `ui/drink-list.js:23` | HTML inline dans JS (style hardcode) | Negligeable |
| 9 | `core/format.js:24-25` | Constante 60 (min/h) non extraite | Negligeable |

## Plan de Migration

```
Phase 0  [FAIT]  Audit           → Ce fichier
Phase 1          Fondations      → Logger (traceId, debug, [OUTPUT]) + constantes params.js
Phase 2  [FAIT]  Atomisation     → Tous fichiers < 150 lignes, barrels, validate.js
Phase 3          Gouvernance     → CLAUDE.md (template complet) + ARCHITECTURE.md (enrichi)
Phase 4          Tests           → tests/integration/ + tests/repro/ + test runner HTML
Phase 5          Verification    → Script check + validation finale
```

## Metriques Actuelles

- Fichiers JS : 20
- Lignes totales : 887
- Fichier le plus long : app.js (147 lignes)
- Dependances circulaires : 0
- Constantes centralisees : 11 (dans constants.js)
- Barrels : 4 (core, data, state, ui)
- Validateurs runtime : 2 (validateDrink, validateBACParams)
- Tests : 0
