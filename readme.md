# Syntetizador por consola para reproduccion de melodias monofonicas y acordes polyfonicos.

## video explicativo
[Video explicativo](https://www.tiktok.com/@davidgomez071/video/7527883515514391814)

## Descripción del problema.
- Los usuarios desean poder reproducir audio sintetizado por consola usando node.js a fin de poder tener versatilidad a la hora de programar ya que esto habilitaria la opcion de poder tener notificaciones que puedan ser reconocidas por un tono o melodia corta, asu vez , permite polyfonias de acortdes y construccion de melodias monofonicas construyendo objetos o arrays.

## Librería utilizada (nombre y link oficial).
- disclaimer: se intentaron usar un numero variado de librerias y fue absurdamente complicado hacer posible siquiera la sintetizazion de una nota simple en base a una funcion senoseidal. (ver commits anteriores y package.json)

### xevEmitter
Link para [xevEmitter](https://www.npmjs.com/package/xev-emitter),Es una librería de Node.js que permite escuchar eventos de teclado (y mouse, si quieres) directamente desde la entrada estándar (stdin) del sistema, de forma parecida a como lo haría la herramienta xev de Linux, pero funcionando dentro del entorno de Node.js.

### Speaker
Link para [speaker](https://www.npmjs.com/package/speaker) La librería speaker de Node.js permite reproducir audio PCM (audio en bruto sin comprimir) directamente a través del dispositivo de salida de audio del sistema, como parlantes o audífonos.

## Implementaciones de las librerias

**xevEmitter** fue usado con el objetivo de poder simular la funcionalidad de un teclado (instrumento musuical) ya que permite detectar cuando una tecla es presionada y cuando la misma deja de serlo , con lo cual se pueden tocar notas el tiempo que se requiera pero al levantar la tecla , esta dejara de sonar.

Por otra parte **speaker** fue utilizado con la finalidad de poder tener un enlace entre el codigo y los altavoces/audifonos del dispositivo, es valido para cualquier salida de audio



## Instrucciones de instalación y uso del programa.

- usar el comando :
```bash
    npm install
```
Esto instalara todas las dependencias nesarias para el funcionamiento correcto del programa.
*(recuerde que debe tener instalado node.js en su sistema operativo asi como tambien npm y nvm)*

- luego para ejecutar el programa :
```bash
    xev | node main.js
```
esto ejecutara el programa y abrira una ventana con el nombre **Event Tester**, para poder reconocer las opciones del teclado es necesario que tenga seleccionada la ventana **Event Tester** por defecto, de esta manera podra reconocer el teclado, para salir del programa es necesario clickear la consola seguido del comando **ctrl + c**

- Opciones disponibles,*(las opciones disponibles debe ser elejidas usando la barra numerica superior del teclado y no el pad numerico del mismo,en caso contraio no detectara las opciones)*

1 usar sinteizador: Podra usar el teclado como un syntetizador simple ,puede tocar hasta 4 notas en conjunto.

2 reproducir "cumpleaños feliz": Permite al usuario escuchar una melodia simple con la finalidad de ver los alcanzes del programa, esta melodia maneja duracion de notas y valor de la frecuencia como variables dentro de un objeto que pueden ser declaradas y reproducidas . (ver comentarios del codigo para mas info)

3 reproducir acorde: Permite ver los alcances del programa para la creacion de polifonias con acordes de triadas simples.(ver comentarios del codigo para mas info)


# Posibles problemas y soluciones

- La reproduccion del sonido no es perfecta y tiene entrecortes entre nota y nota, para eso ajustar las variables segun crea conveniente *(leer comentarios en main.js)*

- No es compatible con libreias como redline o keypress *(no en esta verion de momento)*

- Es muy probable quede instalar codecs necesarios de audio para el sistema linux que no vienen por defecto

- Esta distribucion del programa solo funciona en maquinas con sistema linux, NO compila en windows o en WSL,no ha sido testeado en dispositivos con macOS

- En caso de que linux no tenga ALSA instalado , es necesario descargarlo compilarlo e instalarlo en la carpeta para porde usar el npm install, ejecutar estos comandos linea por linea.

Esto permite la installacion de los comandos para instalar ALSA

```bash
chmod +x install_alsa_local.sh
```

Este comando permite la instalacion de ALSA descargando el fichero y compilandolo para su posterior agregacion al sistema.
```bash
./install_alsa_local.sh
```

Esta linea le dice al compilador y al sistema dónde buscar archivos necesarios para compilar el programa
```bash
export CFLAGS="-I$HOME/.local/include"
export LDFLAGS="-L$HOME/.local/lib"
export LD_LIBRARY_PATH="$HOME/.local/lib:$LD_LIBRARY_PATH"
```

- Usar una maquna virtual para correr linux general latencia entre el input y el ouput del sonido




# Glosario de terminos

- **PCM** : (Pulse Code Modulation) es el formato más básico de audio digital: una secuencia de números que representan la amplitud de una onda de sonido a intervalos regulares (muestras).

- **ALSA** significa Advanced Linux Sound Architecture (Arquitectura Avanzada de Sonido para Linux).
Es el subsistema principal de sonido en Linux que permite a las aplicaciones reproducir y capturar audio a través del hardware del sistema.