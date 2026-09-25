# Build do Chat trelicas (desktop)

Este checkout do Fluxer gera um app desktop que abre `https://chat.trelicas.net.br:2456` em vez do servidor oficial.

- URL do servidor: `SELF_HOSTED_APP_URL` em `src/common/Constants.ts`
- Nome e identificadores do app: `SELF_HOSTED_IDENTITY` em `src/common/DesktopIdentity.ts` e `selfHostedIdentity` em `electron-builder.config.cjs` (mantenha os dois iguais)
- A atualização automática pelo feed oficial fica desligada, para o app não ser trocado pela versão oficial.

Cada sistema precisa ser compilado nele mesmo, porque os addons nativos em Rust só compilam no sistema de destino.

## Antes de começar

Leve este checkout, com as alterações, para a máquina de build. Pode ser por um remoto git seu ou copiando a pasta sem `node_modules`, `target` e `fluxer_desktop/dist-electron`.

Use a mesma versão em todas as plataformas, no formato `ANO.MDD.N` (ex.: `2026.925.0`). Aumente o último número a cada novo build.

## Linux x64

Compile no **Ubuntu 22.04 x64**. O empacotamento rejeita binários que exigem glibc acima de 2.35, então um build feito no Ubuntu 24.04 ou mais novo falha. Em outra distribuição, use um container:

```bash
docker run -it --rm -v "$PWD":/src -w /src ubuntu:22.04 bash
apt update && apt install -y sudo
```

Na máquina (ou no container), a partir da raiz do repositório:

```bash
sudo apt update && sudo apt install -y curl git ca-certificates build-essential
```

Instale o Node.js 24 ou mais novo (por exemplo, com o nvm) e depois:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && . "$HOME/.cargo/env"
npm install -g pnpm@11.27.0
cargo run --locked --manifest-path tools/ci/Cargo.toml -- build-desktop --step install_linux_deps
pnpm install --frozen-lockfile
```

O passo `install_linux_deps` é o mesmo do CI oficial. Ele instala as bibliotecas de sistema, o `fpm` e compila os headers do PipeWire e a libfido2.

Build:

```bash
cd fluxer_desktop
export VERSION=2026.925.0
export BUILD_CHANNEL=stable RELEASE_CHANNEL=stable PUBLIC_RELEASE_CHANNEL=stable \
  BUILD_VERSION=$VERSION PUBLIC_BUILD_VERSION=$VERSION \
  ELECTRON_ARCH=x64 FLUXER_DESKTOP_PRODUCTION=true USE_SYSTEM_FPM=true
pnpm build
pnpm exec electron-builder --config electron-builder.config.cjs --linux --x64
```

Os pacotes `.AppImage`, `.deb`, `.rpm` e `.tar.gz` ficam em `fluxer_desktop/dist-electron/`.

## Windows x64

Instale:

- Git
- Node.js 24 ou mais novo, e depois `npm install -g pnpm@11.27.0`
- Rust pelo rustup (o padrão, `x86_64-pc-windows-msvc`)
- Visual Studio 2022 Build Tools com a carga de trabalho "Desenvolvimento para desktop com C++" (MSVC e Windows SDK)
- Python 3

Deixe o repositório num caminho curto, como `C:\f\fluxer`, e ative caminhos longos no git:

```powershell
git config --global core.longpaths true
```

Abra o **x64 Native Tools Command Prompt for VS 2022**, rode `powershell` e, na raiz do repositório:

```powershell
pnpm install --frozen-lockfile
cd fluxer_desktop
$env:VERSION = "2026.925.0"
$env:BUILD_VERSION = $env:VERSION; $env:PUBLIC_BUILD_VERSION = $env:VERSION
$env:BUILD_CHANNEL = "stable"; $env:RELEASE_CHANNEL = "stable"; $env:PUBLIC_RELEASE_CHANNEL = "stable"
$env:ELECTRON_ARCH = "x64"; $env:FLUXER_DESKTOP_PRODUCTION = "true"
pnpm build
pnpm exec electron-builder --config electron-builder.config.cjs --win --x64
Compress-Archive -Path "dist-electron\win-unpacked\*" -DestinationPath "dist-electron\Chat-trelicas-$env:VERSION-win-x64.zip"
```

O app fica em `dist-electron\win-unpacked\Chat trelicas.exe`. Distribua o `.zip`: quem for usar extrai a pasta e abre o `.exe`.

## macOS Apple Silicon

Num Mac com Apple Silicon, a partir da raiz do repositório:

```bash
pnpm install --frozen-lockfile
cd fluxer_desktop
export VERSION=2026.925.0
export BUILD_CHANNEL=stable RELEASE_CHANNEL=stable PUBLIC_RELEASE_CHANNEL=stable \
  BUILD_VERSION=$VERSION PUBLIC_BUILD_VERSION=$VERSION \
  ELECTRON_ARCH=arm64 FLUXER_DESKTOP_PRODUCTION=true
pnpm build
pnpm exec electron-builder --config electron-builder.config.cjs --mac --arm64
```

O `.dmg` e o `.zip` ficam em `fluxer_desktop/dist-electron/`.

## Avisos na primeira abertura

Os builds não têm assinatura de desenvolvedor. Na primeira vez:

- **macOS:** o sistema bloqueia o app. Tente abri-lo uma vez, vá em Ajustes do Sistema → Privacidade e Segurança e clique em "Abrir Mesmo Assim". Pelo terminal: `xattr -dr com.apple.quarantine "/Applications/Chat trelicas.app"`.
- **Windows:** o SmartScreen mostra "O Windows protegeu o computador". Clique em "Mais informações" → "Executar assim mesmo".
