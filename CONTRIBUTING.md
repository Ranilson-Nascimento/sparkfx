# Contribuindo para SparkFX

Obrigado pelo interesse! Este guia resume como rodar localmente, publicar a documentação e lançar no npm.

## Requisitos
- Node 18+ e npm
- Conta no npm com token (NPM_TOKEN)

## Rodando localmente
- Web (docs): abra `docs/index.html` ou sirva o repositório e acesse http://localhost:4173/docs/
- Expo Demo: `cd examples/expo-sparkfx-demo && npm install && npm start`

## GitHub Pages
A página `docs/` é publicada automaticamente via GitHub Actions.
- Workflow: `.github/workflows/pages.yml`
- Dispare com push para `main`/`master`
- Acesse: `https://Ranilson-Nascimento.github.io/sparkfx/`

## Publicação no npm (@ranilson/sparkfx-rn)
Publicação é automática via semantic-release quando há push na branch `main` seguindo Conventional Commits.

Pré-requisitos:
- Segredo `NPM_TOKEN` configurado (Settings > Secrets > Actions)

Como funciona:
- Commits com `feat:`, `fix:`, etc. geram versão automaticamente
- Changelog e `packages/sparkfx-rn/package.json` são atualizados
- O pacote é publicado no npm

Workflows relevantes:
- `.github/workflows/release.yml` (semantic-release)
- `.github/workflows/pages.yml` (GitHub Pages)

## Convenções
- Commits: conventional commits (feat, fix, chore, docs, test)
- Branches: feature/minha-feature, fix/bug-x
- PRs: descreva efeito/feature, screenshots/gifs quando possível

Feliz contribuição! 
