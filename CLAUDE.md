# Aspirateurs Quantiques - WordPress + Claude Code

## Infos generales

- **URL** : http://<SERVER_IP>/wptest (remplacer par l'IP locale)
- **Chemin** : /var/www/html/wptest
- **WordPress** : 6.9.1 (fr_FR)
- **PHP** : 8.2+
- **Base de donnees** : MariaDB 10.11+, base `wptest`, user `wptest`, pass `wptest123`
- **Theme** : Twenty Twenty-Five + CSS custom psychedelique 70s

## Utilisateurs WordPress

| Login  | Mot de passe  | Role          | Usage                    |
|--------|---------------|---------------|--------------------------|
| remmmi | 123456        | administrator | Compte admin principal   |
| claude | claude123456  | administrator | Compte API (Claude Code) |

## Acces API

- **REST API** : http://<SERVER_IP>/wptest/wp-json/wp/v2/
- **User API** : claude
- **Application Password** : w56d Wwx7 ZFnm fKJU i9Ri Doyf

## Installation rapide

```bash
git clone git@github.com:remmmi/wp-aspiquantum.git
cd wp-aspiquantum
sudo bash install.sh
```

Le script detecte automatiquement l'IP locale et adapte les URLs.

## WP-CLI

WP-CLI est installe par le script. Toujours utiliser --path=/var/www/html/wptest.

```bash
wp post list --post_type=page --path=/var/www/html/wptest
wp plugin list --path=/var/www/html/wptest
wp db export backup.sql --path=/var/www/html/wptest
```

## MCP Server (WordPress MCP Adapter)

Le plugin mcp-adapter (officiel WordPress) est installe. Transport STDIO via WP-CLI.

### Configuration Claude Code

Ajouter dans ~/.claude.json (section mcpServers) ou dans le project settings :

```json
{
  "mcpServers": {
    "wordpress": {
      "command": "wp",
      "args": [
        "--path=/var/www/html/wptest",
        "--user=claude",
        "mcp-adapter",
        "serve"
      ]
    }
  }
}
```

### Setup automatique

```bash
mkdir -p ~/.claude/projects/-var-www-html-wptest
cat > ~/.claude/projects/-var-www-html-wptest/settings.json << 'EOF'
{
  "mcpServers": {
    "wordpress": {
      "command": "wp",
      "args": [
        "--path=/var/www/html/wptest",
        "--user=claude",
        "mcp-adapter",
        "serve"
      ]
    }
  }
}
EOF
```

### Verification

```bash
wp mcp-adapter list --path=/var/www/html/wptest
```

## Pages du site

| Page | Contenu |
|------|---------|
| Accueil | Hero cosmique, 3 piliers, citation Teilhard de Chardin |
| Nos Aspirateurs | 4 modeles : Quantum 3000 (333 EUR) a Cosmic Vortex 9000 Pro (999 EUR) |
| La Science Quantique | Superposition Poussiereuse, Intrication Domestique, Filtre de Schrodinger |
| Temoignages Cosmiques | 5 temoignages hilarants |
| Le Rituel | 5 etapes sacrees d'aspiration consciente |
| FAQ Cosmique | 6 questions absurdes |
| Contact Vibratoire | Telepathie, pigeon voyageur, avertissement legal |

## Permissions fichiers

- Owner: <user>:www-data, dossiers 750, fichiers 640
- Le script install.sh corrige automatiquement les permissions
- Apres chaque edition de fichier par Claude Code, les permissions changent (m:m au lieu de m:www-data)
- Corriger apres edition : `sudo chown m:www-data <fichier> && sudo chmod 640 <fichier>`

## Ce que le script install.sh ne gere PAS

Le script installe WordPress, la DB, WP-CLI, Apache, MariaDB, le plugin MCP et les permissions.
Il ne gere PAS :

### 1. Claude Code CLI

```bash
# Installer Node.js 22+ (si pas deja fait)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer Claude Code
npm install -g @anthropic-ai/claude-code
```

### 2. Configuration MCP pour Claude Code

Le MCP WordPress utilise WP-CLI en transport STDIO. Apres install.sh :

```bash
# Creer le project settings Claude Code
mkdir -p ~/.claude/projects/-var-www-html-wptest

cat > ~/.claude/projects/-var-www-html-wptest/settings.json << 'EOF'
{
  "mcpServers": {
    "wordpress": {
      "command": "wp",
      "args": [
        "--path=/var/www/html/wptest",
        "--user=claude",
        "mcp-adapter",
        "serve"
      ]
    }
  }
}
EOF
```

Ou ajouter dans `~/.claude.json` section `mcpServers` pour un acces global.

### 3. MCP Chrome DevTools (optionnel)

Pour controler un navigateur Chrome via MCP :

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

Necessite Node.js et un Chrome/Chromium ouvert avec `--remote-debugging-port=9222`.

### 4. MariaDB avec mot de passe root existant

Le script suppose un acces root sans mdp (install fraiche Debian).
Si MariaDB a deja un mot de passe root, les commandes SQL de l'etape 2 echoueront.
Solution : lancer manuellement avec `mysql -u root -p` et entrer le mdp.

### 5. Application Password

L'application password du user claude est incluse dans le dump DB (hash).
Elle fonctionne directement apres import. Pas besoin de la recreer.
Si necessaire : `wp user application-password create claude "claude-code" --porcelain --path=/var/www/html/wptest`

### 6. HTTPS

Le site tourne en HTTP. Les Application Passwords WordPress sont desactivees par defaut en HTTP.
Le mu-plugin `allow-app-passwords-http.php` contourne cette restriction (installe par le script).
En production, utiliser un vrai certificat SSL (Let's Encrypt).
