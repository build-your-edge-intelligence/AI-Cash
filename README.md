# BUILD YOUR EDGE — BFR & Cash Management

Application HTML premium connectée au classeur `Cash_Management.xlsx`.

## Lancer l'application

1. Double-cliquer sur `start-app.cmd`.
2. L'application s'ouvre à l'adresse `http://localhost:4173`.
3. Modifier le classeur `Cash_Management.xlsx` dans Excel.
4. Enregistrer le fichier. Les données apparaissent automatiquement dans l'application sous deux secondes, sans nouvel upload.

## Synchronisation

Les huit onglets sont lus automatiquement : `0_Accueil`, `1_Balance_GL`, `2_Clients`, `3_Fournisseurs`, `4_Stocks`, `5_Dashboard`, `Lecture` et `Cash Management`.

Le bouton **Uploader un fichier Excel** reste disponible. Sur un navigateur Chromium lancé depuis `localhost`, l'application conserve l'autorisation de lecture du fichier choisi et surveille ses prochains enregistrements. Le classeur peut donc rester dans son dossier d'origine.

Le bouton **Voir les chiffres démo** affiche un scénario fictif complet sans modifier le fichier Excel. Cliquez sur **Retour aux données Excel** pour reprendre la source synchronisée.

Le nom de l'entreprise affiché vient de `0_Accueil!D8`. Aucune identité n'est codée en dur dans l'interface.

## Périmètre Cash Management

Le cockpit couvre la trésorerie opérationnelle clients–fournisseurs–stocks, le BFR, le cycle de cash, les risques d'échéance et le calendrier sur 13 semaines. Une position bancaire complète nécessiterait en plus les banques, la paie, la fiscalité, la dette, le CAPEX et les lignes de crédit.

Sur GitHub Pages, la page relit le classeur publié. La synchronisation instantanée avec un fichier local reste disponible en lançant `start-app.cmd`.
