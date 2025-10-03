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
O pacote RN é publicado quando você cria uma tag com prefixo `rn-v`.

1. Bump de versão em `packages/sparkfx-rn/package.json`
2. Commit e tag:
   ```bash
   git add -A
   git commit -m "chore(release): rn v0.1.0"
   git tag rn-v0.1.0
   git push --follow-tags
   ```
3. Workflow `.github/workflows/npm-publish.yml` executa build e publish

Configure o segredo `NPM_TOKEN` no repositório (Settings > Secrets > Actions).

## Convenções
- Commits: conventional commits (feat, fix, chore, docs, test)
- Branches: feature/minha-feature, fix/bug-x
- PRs: descreva efeito/feature, screenshots/gifs quando possível

Feliz contribuição! ⚡
