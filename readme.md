en caso de que linux no tenga ALSA instalado , es necesario descargarlo compilarlo e instalarlo en la carpeta para porde usar el npm install

```bash
chmod +x install_alsa_local.sh

./install_alsa_local.sh

export CFLAGS="-I$HOME/.local/include"
export LDFLAGS="-L$HOME/.local/lib"
export LD_LIBRARY_PATH="$HOME/.local/lib:$LD_LIBRARY_PATH"
```
