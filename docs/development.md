# Development
### Install dependencies
```bash
bun i && bunx playwright install --with-deps
```

#### Start extension in chromium
```bash
bun run dev:chromium
```

#### Linting
```bash
bun run lint
```

#### Build the extension
```bash
bun run build # all targets
```
```bash
bun run build:chromium # specific browser only
```
