# Pokémon Pokédex

Pokédex interativa do Super Módulo de React JS. Consome a [PokéAPI](https://pokeapi.co/) via Route Handlers do Next.js e apresenta a National Dex com busca, paginação responsiva e uma página de detalhe com carrossel, estatísticas, fraquezas, gênero e cadeia evolutiva (incluindo Mega Evoluções).

Repositório: [github.com/MichaelXG/pokemon-pokedex](https://github.com/MichaelXG/pokemon-pokedex)

## Funcionalidades

- **Lista da Dex** — cards com artwork oficial, número e tipos (ícones)
- **Busca** — filtro por nome ou número, com feedback quando não há resultado
- **Paginação automática** — a quantidade de cards por página se ajusta à largura da tela (`ResizeObserver`)
- **Detalhe em carrossel** — navega entre Pokémon com teclado (← →) ou swipe; sem setas visíveis
- **Sobre** — tipos, altura, peso, habilidades e distribuição de gênero
- **Fraquezas** — calculadas a partir das relações de dano da PokéAPI (tipos duplos incluídos)
- **Status** — barras segmentadas no estilo Pokémon (PS, Ataque, Defesa, At. Esp., Def. Esp., Velocidade)
- **Evoluções** — cadeia completa em uma linha, com Mega Evoluções quando existirem
- **Áudio** — clips locais em `/public/songs` quando disponíveis; caso contrário, fala o nome com `speechSynthesis`

## Stack

| Área | Tecnologia |
| --- | --- |
| UI | React 18 + Next.js 13 (App Router) |
| Linguagem | TypeScript 5 |
| Estilo | Sass (CSS Modules) + Framer Motion |
| Dados | PokéAPI (`pokeapi.co/api/v2`) |
| Testes | Vitest |
| Qualidade | ESLint + Prettier |

## Rotas

| Rota | Descrição |
| --- | --- |
| `/` | Home — busca, grade e paginação |
| `/pokemon/[id]` | Detalhe do Pokémon |
| `/api/pokemon` | Lista paginada (`page`, `limit`, `q`) |
| `/api/pokemon/[id]` | Detalhe mapeado (stats, tipos, gênero, fraquezas…) |
| `/api/pokemon/[id]/evolutions` | Cadeia evolutiva + Megas |
| `/api/pokemon/meta` | Metadados da Dex (total de IDs) |

As respostas da API são revalidadas em cache por 24h.

## Estrutura

```
pokemon-pokedex/
├── public/                 # favicon, logo, ícones de tipos, clips de áudio
├── src/
│   ├── app/                # layout, home, detalhe e Route Handlers
│   ├── components/         # cards, busca, carrossel, evoluções, stats, áudio
│   ├── context/            # estado de paginação e busca
│   ├── hooks/              # usePokemon, useFitPageSize
│   ├── lib/                # cliente PokéAPI, fraquezas, gênero, testes
│   ├── interfaces/         # tipos TypeScript do domínio
│   └── utils/              # formatação de nome/id e labels de tipos
└── vitest.config.ts
```

## Como executar

Requisito: [Node.js](https://nodejs.org/) 18 ou superior.

```bash
git clone https://github.com/MichaelXG/pokemon-pokedex.git
cd pokemon-pokedex
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Se a porta 3000 estiver ocupada, o Next.js sobe na próxima porta livre.

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Sobe o build (`next start`) |
| `npm run lint` | ESLint |
| `npm test` | Testes unitários (Vitest) |

Os testes cobrem cálculo de fraquezas, distribuição de gênero e o ajuste de cards por linha.

## Observações

- A PokéAPI não disponibiliza vozes falando o nome do Pokémon. Os cries oficiais são bipes de jogo; por isso o áudio usa MP3s locais e, na falta deles, síntese de fala no navegador.
- Mega Evoluções vêm de `species.varieties` (nomes com `-mega`), não do ID da forma na Dex.
- Interface em português (`pt-BR`).

## Autor

[Michael Xavier Gomes](https://github.com/MichaelXG)
