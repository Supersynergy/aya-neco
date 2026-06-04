set shell := ["zsh", "-cu"]

setup:
  bun install

dev:
  trap 'kill 0' EXIT; bun --cwd apps/api dev & bun --cwd apps/app dev --host 127.0.0.1

test:
  bun run test

lint:
  bun --cwd apps/app lint

build:
  bun --cwd apps/app build

examples:
  bun run examples

check:
  bun run check

preview:
  bun --cwd apps/app preview --host 127.0.0.1

check-structure:
  test -d apps/app/src
  test -d apps/api/src
  test -d packages/domain
  test -d packages/domain/src
  test -d packages/icons
  test -d docs/adr

release-check: check-structure check
  test -f README.md
  test -f LICENSE
  test -f NOTICE
  test -f docs/assets/social-preview.png
  test -f docs/ONCE-WODA-INTEGRATION.md
  test -f packages/once-woda/module.manifest.json
