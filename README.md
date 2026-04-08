# Drinkinator

Estimateur de taux d'alcool dans le sang, directement dans votre navigateur.

Drinkinator calcule en temps reel votre taux d'alcoolemie a partir des boissons consommees, de votre profil corporel et du temps ecoule. Il vous indique quand vous repasserez sous le seuil legal pour conduire.

> **Avertissement** : Cet outil fournit des estimations approximatives basees sur la formule de Widmark. Le taux reel depend de nombreux facteurs (repas, hydratation, metabolisme, medicaments, etc.). Ne vous fiez jamais uniquement a ce calculateur pour decider de conduire. **En cas de doute, ne conduisez pas.**

---

## Comment utiliser Drinkinator

### 1. Ouvrir l'application

- **Le plus simple** : telecharger le projet, puis double-cliquer sur le fichier `index.html`. Il s'ouvre dans votre navigateur (Chrome, Firefox, Edge, Safari...).
- Aucune installation requise. Pas besoin d'internet une fois le fichier ouvert.

### 2. Remplir votre profil

En haut de la page, renseignez :

| Champ | Description |
|-------|------------|
| **Poids (kg)** | Votre poids en kilogrammes |
| **Sexe** | Homme ou Femme — influe sur le calcul (les femmes ont un facteur de distribution different) |
| **Tolerance** | Curseur de "Tres faible" a "Tres elevee" — ajuste la vitesse d'elimination de l'alcool par votre corps |

### 3. Choisir votre pays

Selectionnez votre pays dans le menu deroulant. Le seuil legal de conduite sera automatiquement applique (ex: 0.5 g/L en France, 0.2 g/L en Suede, 0.8 g/L au Royaume-Uni).

21 pays europeens sont disponibles. Vous pouvez aussi choisir "Autre" et entrer un seuil personnalise.

### 4. Ajouter vos consommations

Cliquez sur l'un des **11 boutons de boissons predefinies** :

| Boisson | Volume | Degre |
|---------|--------|-------|
| Light beer | 250 mL | 4.5% |
| Beer (pint) | 500 mL | 4.5% |
| Red wine | 130 mL | 13% |
| White wine | 130 mL | 12% |
| Triple beer | 330 mL | 9% |
| Cider | 250 mL | 2.5% |
| Martini | 80 mL | 17% |
| Whisky | 40 mL | 40% |
| Vodka shot | 40 mL | 40% |
| Champagne | 130 mL | 12% |
| Cocktail | 200 mL | 15% |

Pour une boisson qui n'est pas dans la liste, ouvrez **"+ Boisson personnalisee"** et entrez le volume (mL) et le degre d'alcool (%).

### 5. Choisir l'heure de consommation

Apres avoir clique sur une boisson, une fenetre s'ouvre avec 3 options :

- **Maintenant** : vous venez de la boire
- **Heure precise** : indiquez l'heure exacte (ex: 20:30)
- **Il y a...** : cliquez sur un bouton rapide (15 min, 30 min, 1h, 2h...) ou entrez une duree personnalisee

### 6. Lire les resultats

Le panneau en haut de la page se met a jour en temps reel :

| Indicateur | Signification |
|-----------|--------------|
| **Sang : X.XX g/L** | Taux d'alcool estime dans le sang |
| **Air expire : X.XX mg/L** | Equivalent pour un ethylotest |
| **OK** (vert) | Vous etes sobre, aucune consommation |
| **OK (pas sobre)** (jaune) | Taux positif mais sous la limite legale |
| **INTERDIT** (rouge) | Taux au-dessus de la limite legale — ne conduisez pas |
| **Sous la limite dans : Xh XX** | Temps estime avant de repasser sous le seuil legal |
| **Sobre dans : Xh XX** | Temps estime avant un taux a zero |

La **barre de progression** montre visuellement votre taux par rapport a la limite legale.

### 7. Gerer vos consommations

- Chaque boisson ajoutee apparait dans la liste sous les boutons
- Cliquez sur le **X** a cote d'une boisson pour la retirer
- Cliquez sur **"Tout effacer"** pour recommencer a zero

---

## Fonctionnalites

- Calcul en temps reel (se rafraichit toutes les 30 secondes)
- 11 boissons predefinies + mode personnalise
- Seuils legaux de 21 pays europeens
- Affichage sang (g/L) et air expire (mg/L)
- Estimation du temps avant de pouvoir conduire
- Barre de progression visuelle avec code couleur
- Fonctionne 100% hors ligne, aucune donnee envoyee

---

## Pour les developpeurs

### Demarrage

Aucune dependance. Ouvrir `index.html` directement ou via un serveur statique :

```bash
npx serve .
# puis ouvrir http://localhost:3000
```

### Architecture

Application browser pure — ES modules, pas de Node.js, pas de bundler.

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

### Tests

Ouvrir `tests/test-runner.html` dans un navigateur. 5 suites, 33 tests.

### Contribuer

Lire [`CLAUDE.md`](CLAUDE.md) avant toute modification — glossaire metier, regles d'architecture, protocole de debug.

---

## Licence

MIT
