# 1. Cloner / créer le dossier racine glink.mg/
# 2. Installer toutes les dépendances en une fois
npm run install:all

# 3. Migrer la base de données
npm run migrate

# 4. Lancer back + front simultanément
npm run dev
```

Le terminal affichera les deux serveurs avec des couleurs distinctes :
```
[BACK]  🚀 glink.mg backend running on :3000
[FRONT] ➜  Local: http://localhost:5173