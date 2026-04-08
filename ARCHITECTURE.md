# Architecture — Graphe de Dependances

## Diagramme des Modules

```mermaid
graph TD
    subgraph "Layer 0 — Aucun import"
        TYPES[types.js]
        CONST[constants.js]
        COUNTRIES[data/countries.js]
        PRESETS[data/presets.js]
        DATA_IDX[data/index.js]
    end

    subgraph "Layer 1 — core/"
        BAC[core/bac.js]
        SEARCH[core/search.js]
        FORMAT[core/format.js]
        PARAMS[core/params.js]
        LOGGER[core/logger.js]
        VALIDATE[core/validate.js]
        CORE_IDX[core/index.js]
    end

    subgraph "Layer 2 — state/"
        STORE[state/drink-store.js]
        PROFILE[state/profile.js]
        STATE_IDX[state/index.js]
    end

    subgraph "Layer 3 — ui/"
        STATUS[ui/status.js]
        DRINKLIST[ui/drink-list.js]
        MODAL[ui/modal.js]
        UI_IDX[ui/index.js]
    end

    APP[app.js — Orchestrateur]

    DATA_IDX --> COUNTRIES
    DATA_IDX --> PRESETS

    BAC --> CONST
    SEARCH --> CONST
    FORMAT --> CONST
    PARAMS --> CONST
    LOGGER --> CONST

    CORE_IDX --> BAC
    CORE_IDX --> SEARCH
    CORE_IDX --> FORMAT
    CORE_IDX --> PARAMS
    CORE_IDX --> LOGGER
    CORE_IDX --> VALIDATE

    PROFILE --> PARAMS
    PROFILE --> CONST
    STATE_IDX --> STORE
    STATE_IDX --> PROFILE

    STATUS --> CONST
    MODAL --> CONST
    UI_IDX --> STATUS
    UI_IDX --> DRINKLIST
    UI_IDX --> MODAL

    APP --> DATA_IDX
    APP --> CORE_IDX
    APP --> STATE_IDX
    APP --> UI_IDX
    APP --> CONST
```

## Points d'Entree

| Entree | Fichier | Description |
|--------|---------|-------------|
| Application | `index.html` | Charge `src/app.js` via `<script type="module">` |
| Orchestrateur | `src/app.js` | Unique point de cablage — importe tous les barrels |
| Tests | `tests/test-runner.html` | Charge et execute les suites de tests |

## Effets de Bord Connus

| Module | Effet de bord | Declencheur |
|--------|---------------|-------------|
| `core/logger.js` | Ecriture `localStorage` + `console.*` | Tout appel `log.*()` |
| `state/drink-store.js` | Appel callback `onChange` | `add()`, `remove()`, `clear()` |
| `state/profile.js` | Lecture DOM (inputs) | `readProfile()` |
| `ui/status.js` | Mutation DOM (panel, timeline) | `renderStatus()` |
| `ui/drink-list.js` | Mutation DOM (liste) | `renderDrinkList()` |
| `ui/modal.js` | Mutation DOM (overlay) + event listeners | `createTimeModal()` |
| `app.js` | `setInterval(update, 30s)` | Boot |

## Contrats d'Interface (API stable)

| Module | Export | Signature | Garanti stable |
|--------|--------|-----------|---------------|
| `core/bac` | `drinkBAC` | `(Drink, BACParams) -> number` | Oui |
| `core/bac` | `computeBAC` | `(Drink[], Date, BACParams) -> number` | Oui |
| `core/search` | `findTimeTo` | `(number, Drink[], Date, BACParams, computeBAC) -> number` | Oui |
| `core/format` | `fmtTime` | `(number, Date) -> string` | Oui |
| `core/format` | `fmtDuration` | `(number) -> string` | Oui |
| `core/params` | `sexFactor` | `(string) -> number` | Oui |
| `core/params` | `elimRate` | `(string, number) -> number` | Oui |
| `core/validate` | `validateDrink` | `(any) -> { valid, reason? }` | Oui |
| `core/validate` | `validateBACParams` | `(any) -> { valid, reason? }` | Oui |
| `core/logger` | `log` | `{ error, warn, info, debug, dump, clear, traceId }` | Oui |
| `state/drink-store` | `createDrinkStore` | `(Function) -> { add, remove, clear, getAll }` | Oui |
| `state/profile` | `readProfile` | `(ProfileDOM, Country[]) -> BACParams` | Oui |

## Flux de Donnees

```mermaid
flowchart LR
    DOM[DOM inputs] --> PROFILE[readProfile]
    PROFILE --> VALIDATE[validateBACParams]
    VALIDATE --> PARAMS[BACParams]
    STORE[drink-store] --> DRINKS[Drink array]
    PARAMS --> COMPUTE[computeBAC]
    DRINKS --> COMPUTE
    COMPUTE --> BAC_VAL[BAC value]
    BAC_VAL --> RENDER[renderStatus]
    BAC_VAL --> TIMELINE[findTimeTo]
    TIMELINE --> RENDER
    DRINKS --> LIST[renderDrinkList]
    BAC_VAL --> LIST
```
