#!/bin/bash

set -e

# Configuración
PREFIX="$HOME/.local"
SRC_DIR="$HOME/src"
ALSA_VER="1.2.10"

# Crear carpetas necesarias
mkdir -p "$PREFIX" "$SRC_DIR"
cd "$SRC_DIR"

# Descargar libasound (ALSA library)
if [ ! -f "alsa-lib-${ALSA_VER}.tar.bz2" ]; then
    echo "Descargando alsa-lib ${ALSA_VER}..."
    curl -LO "https://www.alsa-project.org/files/pub/lib/alsa-lib-${ALSA_VER}.tar.bz2"
fi

# Extraer y entrar al directorio
tar -xjf "alsa-lib-${ALSA_VER}.tar.bz2"
cd "alsa-lib-${ALSA_VER}"

# Configurar, compilar e instalar localmente
echo "Configurando la instalación local..."
./configure --prefix="$PREFIX"

echo "Compilando ALSA..."
make -j$(nproc)

echo "Instalando en $PREFIX..."
make install

# Mensaje final
echo ""
echo "✅ ALSA (libasound) ${ALSA_VER} fue instalado localmente en: $PREFIX"
echo ""
echo "Ahora puedes exportar estas variables para usarla al compilar proyectos como 'speaker':"
echo ""
echo "export CFLAGS=\"-I$PREFIX/include\""
echo "export LDFLAGS=\"-L$PREFIX/lib\""
echo "export LD_LIBRARY_PATH=\"$PREFIX/lib:\$LD_LIBRARY_PATH\""
