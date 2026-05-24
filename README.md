# 🍷 Cave de l'Arve — Vente Privée 2026

Site e-commerce Next.js 14 pour vente privée groupée de vins. 17 cuvées, paiement Stripe avec 3D Secure, emails Resend, déploiement Vercel.

**Vente prévue du 27 mai au 5 juin 2026 à 19h.**

---

## ⚡ TL;DR — Mise en ligne en 5 étapes

1. `npm install` → installer les dépendances
2. Créer un fichier `.env.local` à partir de `.env.example`
3. Compléter les infos manquantes dans `data/site-config.json` (SIRET, adresse exacte, téléphone)
4. Pousser sur GitHub, importer sur Vercel, ajouter les variables d'environnement
5. Configurer le webhook Stripe → l'URL pointe vers `https://ton-domaine.fr/api/webhook`

📋 **Checklist complète à la fin du document.**

---

## 🚀 Installation locale

```bash
# 1. Installer les dépendances
npm install

# 2. Copier le fichier d'environnement
cp .env.example .env.local

# 3. Remplir .env.local avec tes vraies clés

# 4. Lancer en mode développement
npm run dev
```

Le site est disponible sur **http://localhost:3000**.

---

## 🔑 Variables d'environnement (`.env.local`)

| Variable | Description | Où la trouver |
|----------|-------------|---------------|
| `STRIPE_SECRET_KEY` | Clé secrète Stripe | https://dashboard.stripe.com/apikeys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe | Idem |
| `STRIPE_WEBHOOK_SECRET` | Secret du webhook | Voir section "Webhook Stripe" |
| `RESEND_API_KEY` | Clé API Resend | https://resend.com/api-keys |
| `CONTACT_EMAIL` | Email qui reçoit les commandes | `agence.epicurios@outlook.com` |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site | `https://cave-arve.fr` (après déploiement) |

⚠️ **Pour le développement local**, utilise les clés Stripe en mode **test** (`sk_test_...` et `pk_test_...`).

---

## 🍇 Ajouter, modifier ou retirer un vin

Tous les vins sont dans **`data/wines.json`**. Chaque vin est un objet avec ce schéma :

```json
{
  "slug": "identifiant-unique-url",
  "name": "Nom complet du vin",
  "vintage": 2024,
  "color": "rouge",
  "appellation": "Pic-Saint-Loup AOC",
  "region": "Languedoc-Roussillon",
  "country": "France",
  "domain": "Maison Chape",
  "grapes": "40% Carignan, 30% Syrah, 30% Grenache",
  "alcohol": "14%",
  "volume": "0.75L",
  "price": 12,
  "minOrder": 1,
  "stock": 60,
  "featured": true,
  "image": "/images/wines/slug-du-vin.jpg",
  "shortDescription": "Phrase d'accroche commerciale.",
  "story": "L'histoire longue du domaine.",
  "tasting": {
    "robe": "Description visuelle.",
    "nez": "Description olfactive.",
    "bouche": "Description gustative."
  },
  "pairings": "Accords mets-vins.",
  "keeping": "À boire dans les 2 ans.",
  "awards": ["Liste des récompenses"],
  "tags": ["Étiquettes badges"]
}
```

**Pour ajouter un vin** : ajouter un nouvel objet dans le tableau JSON. Le `slug` doit être unique.
**Pour modifier un prix** : changer la valeur de `price` et redéployer.
**Pour retirer un vin** : supprimer l'objet du tableau.

---

## 📸 Ajouter les photos de bouteilles

Le site utilise actuellement des **placeholders SVG élégants** selon la couleur du vin.

Pour ajouter les vraies photos :
1. Place les images dans `public/images/wines/`
2. Nomme chaque fichier exactement comme le `slug` du vin, avec l'extension `.jpg`
   - Ex : `public/images/wines/chateau-montalbret-renaissance-2023.jpg`
3. Format recommandé : **JPG, 800 × 1200 px, fond blanc, 200-400 ko**

Si une image n'existe pas, le placeholder SVG reste affiché automatiquement.

---

## ⚙️ Modifier les paramètres généraux

Le fichier **`data/site-config.json`** centralise :
- **Identité** : nom, baseline, email, téléphone, SIRET, adresse
- **Dates de vente** : `startDate` et `endDate` (ISO 8601 avec timezone)
- **Options de livraison** : libellés, prix, communes
- **Mentions légales** : Évin, art. 293 B du CGI

Quand `endDate` est dépassée, le site **désactive automatiquement** paniers et paiements (la boutique reste consultable).

---

## 💳 Configuration Stripe

### 1. Créer un compte
**https://stripe.com/fr** — gratuit, commission ~1,5 % + 0,25 € par paiement.

### 2. Récupérer les clés
Dashboard → **Développeurs → Clés API**
- **Clé publiable** (`pk_live_...`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Clé secrète** (`sk_live_...`) → `STRIPE_SECRET_KEY`

⚠️ **Active la version "Live"** avant l'ouverture de la vente.

### 3. Configurer le webhook Stripe
Dashboard → **Développeurs → Webhooks → Ajouter un endpoint**
- **URL** : `https://ton-domaine.fr/api/webhook`
- **Événements à écouter** : `checkout.session.completed`
- Cliquer sur le webhook → **Révéler le secret de signature** (`whsec_...`)
- Reporter dans `STRIPE_WEBHOOK_SECRET` sur Vercel

### 4. 3D Secure
**Aucune configuration nécessaire** : Stripe applique automatiquement 3DS (SCA) pour toutes les cartes UE.

### 5. Remboursements
En cas de rupture de stock :
1. Dashboard Stripe → **Paiements**
2. Clic sur le paiement → **"Rembourser"**
3. Choisir remboursement partiel (montant du vin manquant) ou total
4. Le client est remboursé sous 5-10 jours sur sa carte

---

## ✉️ Configuration Resend

### 1. Créer un compte
**https://resend.com** — gratuit jusqu'à 3 000 emails/mois.

### 2. Vérifier ton domaine d'envoi
Resend → **Domains → Add Domain**
1. Entre ton nom de domaine (ex: `cave-arve.fr`)
2. Resend te donne 3 enregistrements DNS à ajouter chez ton registrar
3. Une fois propagés, le statut passe à "Verified" ✅

### 3. Récupérer la clé API
Resend → **API Keys → Create API Key** → reporter dans `RESEND_API_KEY`.

### 4. ⚠️ TRÈS IMPORTANT — Changer l'adresse d'expédition
L'adresse `onboarding@resend.dev` ne fonctionne **qu'en dev**.
Une fois ton domaine vérifié, remplace dans :
- `app/api/webhook/route.ts` (2 occurrences)
- `app/api/contact/route.ts` (1 occurrence)

```typescript
// Avant
from: `${siteConfig.site.name} <onboarding@resend.dev>`

// Après (exemple)
from: `Cave de l'Arve <commandes@cave-arve.fr>`
```

---

## 🌐 Déploiement sur Vercel

### 1. Pousser sur GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON-COMPTE/cave-arve.git
git push -u origin main
```

### 2. Importer sur Vercel
1. **https://vercel.com** → **Add New → Project → Import** le dépôt GitHub
2. Framework : **Next.js** (détecté automatiquement)
3. Avant "Deploy", ajoute toutes les variables d'environnement (copie-colle depuis ton `.env.local`)
4. **Deploy** 🚀

### 3. Configurer un nom de domaine personnalisé
Vercel → ton projet → **Settings → Domains → Add**
1. Entre ton domaine (`cave-arve.fr`)
2. Suis les instructions DNS de Vercel
3. Propagation 5 min à 48 h, HTTPS automatique ✅

### 4. Mettre à jour le webhook Stripe
Stripe → Webhook → **Update endpoint** avec la vraie URL `https://ton-domaine.fr/api/webhook`.

### 5. Mettre à jour `NEXT_PUBLIC_SITE_URL`
Vercel → Settings → Environment Variables → modifier `NEXT_PUBLIC_SITE_URL` avec ton vrai domaine. Redéployer.

---

## 📧 Comment les commandes arrivent

À chaque commande payée :
1. Stripe envoie un événement au webhook `/api/webhook`
2. Le webhook envoie **DEUX emails** via Resend :
   - **Au client** : confirmation de commande avec récap
   - **À toi** (`agence.epicurios@outlook.com`) : alerte avec tous les détails (vins, quantités, adresse, téléphone, total)

Tu peux ainsi préparer le colis dès réception.

---

## 🧪 Tester en local avant la mise en prod

### Tester un paiement
1. Lance `npm run dev`
2. Ajoute des vins au panier
3. Au checkout, utilise une carte de test Stripe :
   - **Carte qui marche** : `4242 4242 4242 4242`
   - **Carte 3DS requise** : `4000 0027 6000 3184`
   - **Carte refusée** : `4000 0000 0000 0002`
   - Date d'expiration : n'importe quelle date future
   - CVC : n'importe quel 3 chiffres

### Tester le webhook en local
Installer **Stripe CLI** : https://stripe.com/docs/stripe-cli

```bash
stripe listen --forward-to localhost:3000/api/webhook
# Te donne un STRIPE_WEBHOOK_SECRET temporaire à mettre dans .env.local

# Dans un autre terminal :
stripe trigger checkout.session.completed
```

---

## 🗂 Structure du projet

```
cave-arve/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts    # Création session Stripe
│   │   ├── webhook/route.ts     # Réception confirmation + emails
│   │   └── contact/route.ts     # Formulaire de contact
│   ├── boutique/page.tsx        # Grille des vins + filtres
│   ├── vins/[slug]/page.tsx     # Fiche produit dynamique
│   ├── panier/page.tsx          # Récap + sélection livraison
│   ├── confirmation/page.tsx    # Après paiement réussi
│   ├── domaine/page.tsx
│   ├── contact/page.tsx
│   ├── cgv/page.tsx
│   ├── mentions-legales/page.tsx
│   ├── confidentialite/page.tsx
│   ├── layout.tsx
│   ├── page.tsx                 # Page d'accueil
│   ├── sitemap.ts
│   ├── robots.ts
│   └── globals.css
├── components/                  # Composants UI
├── lib/
│   ├── cart.ts                  # Store Zustand (panier)
│   ├── data.ts                  # Helpers + accès données
│   └── types.ts                 # Types TypeScript
├── data/
│   ├── wines.json               # ★ Tes 17 vins
│   └── site-config.json         # ★ Paramètres modifiables
├── public/images/wines/         # Photos des bouteilles
├── .env.example
└── package.json
```

---

## ✅ CHECKLIST AVANT MISE EN LIGNE

### Données à compléter
- [ ] **SIRET** dans `data/site-config.json` → `site.siret`
- [ ] **Adresse postale** dans `data/site-config.json` → `site.address`
- [ ] **Téléphone** dans `data/site-config.json` → `site.phone`
- [ ] **Email** vérifié : `agence.epicurios@outlook.com` ✅ déjà préconfiguré
- [ ] **Photos** des bouteilles dans `public/images/wines/` (optionnel)

### Stripe
- [ ] Compte Stripe créé
- [ ] Mode **Live** activé
- [ ] `STRIPE_SECRET_KEY` (live) configurée sur Vercel
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (live) configurée sur Vercel
- [ ] Webhook créé → événement `checkout.session.completed` → URL `/api/webhook`
- [ ] `STRIPE_WEBHOOK_SECRET` (whsec_...) configuré sur Vercel

### Resend
- [ ] Compte Resend créé
- [ ] Domaine vérifié (DNS propagés)
- [ ] `RESEND_API_KEY` configurée sur Vercel
- [ ] **`onboarding@resend.dev` remplacé** dans les 2 routes API

### Vercel
- [ ] Projet importé depuis GitHub
- [ ] Toutes les variables d'environnement ajoutées
- [ ] Domaine personnalisé connecté
- [ ] `NEXT_PUBLIC_SITE_URL` mis à jour avec le vrai domaine
- [ ] Build "Deployment Ready" ✅

### Tests finaux
- [ ] J'ai passé une commande test sur l'URL de prod
- [ ] J'ai bien reçu l'email "confirmation client"
- [ ] J'ai bien reçu l'email "alerte admin" sur `agence.epicurios@outlook.com`
- [ ] J'ai vérifié que le paiement apparaît dans Stripe en "live"
- [ ] J'ai remboursé ma commande test depuis Stripe

### Communication
- [ ] Annonce de la vente prête (mail, WhatsApp, Insta…)
- [ ] Lien direct vers le site partagé

---

## ⚖️ Mentions légales intégrées

- ✅ Loi Évin (mention obligatoire) — Header, Footer, AgeGate, fiches produit, CGV
- ✅ Vérification d'âge 18+ bloquante au premier accès
- ✅ TVA art. 293 B du CGI (franchise auto-entrepreneur)
- ✅ Droit de rétractation L221-28
- ✅ RGPD (cookies techniques uniquement, aucun tracker tiers)
- ✅ CGV adaptées vente d'alcool en ligne

---

**Bonne vente ! 🍷**
