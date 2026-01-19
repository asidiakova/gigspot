# GigSpot — návod na inštaláciu

## Požiadavky

* **Node.js** 20+
* **pnpm** (odporúčané) alebo npm
* **Docker** (pre PostgreSQL databázu)

## Quick Start

### 1. Klonovanie a inštalácia závislostí

```bash
git clone <repository-url>
cd gigspot
pnpm install
```

### 2. Nastavenie prostredia

Vytvorte v top-level adresári projektu súbor `.env`:

```env
# Databáza (Docker)
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gigspot

# Pripojenie k databáze
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gigspot

# NextAuth
NEXTAUTH_SECRET=   # Vygenerujte príkazom: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000 # VOLITEĽNÉ: Základná URL aplikácie. Pre lokálny vývoj je to vždy http://localhost:3000. Mení sa len v produkcii.

# UploadThing (token získate na https://uploadthing.com)
UPLOADTHING_TOKEN=your-uploadthing-token
```

### 3. Spustenie databázy

```bash
docker compose up -d
```

Tým sa spustí kontajner PostgreSQL 16 na porte 5432.

### 4. Spustenie migrácií databázy

```bash
pnpm db:migrate
```

### 5. Spustenie vývojového servera

```bash
pnpm dev
```

Aplikácia bude dostupná na [http://localhost:3000](http://localhost:3000).

---

## Dostupné skripty

| Príkaz             | Popis                                    |
|--------------------|------------------------------------------|
| `pnpm dev`         | Spustí vývojový server                   |
| `pnpm build`       | Vytvorí build pre produkciu              |
| `pnpm start`       | Spustí produkčný server                  |
| `pnpm lint`        | Spustí ESLint                            |
| `pnpm format`      | Naformátuje kód pomocou Prettier         |
| `pnpm db:generate` | Vygeneruje novú migráciu po zmene schémy |
| `pnpm db:migrate`  | Aplikuje databázové migrácie             |

---

## Štruktúra projektu

```
src/
├── app/                    # Next.js App Router — stránky a API routy
│   ├── (auth)/             # Stránky pre autentifikáciu (login, signup)
│   ├── api/                # API endpointy
│   ├── events/             # Stránky udalostí
│   ├── profile/            # Užívateľský profil
│   └── users/              # Verejné profily užívateľov
├── components/             # React komponenty
│   └── ui/                 # shadcn/ui komponenty
├── db/                     # Pripojenie k databáze a schéma
├── domain/                 # Domain layer (business logic)
│   ├── entities/           # Definície entít (typy)
│   ├── errors.ts           # Domain error triedy
│   ├── repositories/       # Rozhrania repozitárov
│   ├── services/           # Business logic služby
│   └── validation/         # Zod validačné schémy
├── infrastructure/         # Infrastructure layer
│   ├── repositories/       # Implementácie repozitárov
│   ├── schemas/            # Mapovanie DB -> domain schémy
│   └── security/           # Hashovanie hesiel
└── lib/                    # Zdieľané utilitky
```

---

## Prehľad architektúry

Projekt používa vrstvenú architektúru:

* **Doménová vrstva** — Obsahuje business logiku, entity, validačné schémy a rozhrania repozitárov.
* **Vrstva infraštruktúry** — Implementuje repozitáre pomocou Drizzle ORM, stará sa o operácie s databázou.
* **Aplikačná vrstva** — Next.js stránky, API routy, React komponenty.

Dependency injection je spravované v `src/container.ts`.

---

## Pridávanie UI komponentov

Tento projekt používa [shadcn/ui](https://ui.shadcn.com/). Ako pridať nový komponent:

```bash
npx shadcn@latest add <component-name>
```

Komponenty sú uložené v `src/components/ui/`.

---

## Zmeny schémy databázy

1. Upravte `src/db/schema.ts`
2. Vygenerujte migráciu:

   ```bash
   pnpm db:generate
   ```
3. Aplikujte migráciu:

   ```bash
   pnpm db:migrate
   ```

---

## Užívateľské roly

* **User (Používateľ)** — Môže prezerať udalosti, zúčastňovať sa na nich, sledovať organizátorov.
* **Organizer (Organizátor)** — Môže vytvárať/upravovať/mazať udalosti, nahrávať plagáty, prezerať followerov.

Rola sa vyberá počas registrácie a určuje dostupné funkcie.

