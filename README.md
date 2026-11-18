# La Sagrada

Sitio web estático para el emprendimiento La Sagrada, en Cochabamba, Bolivia. Está hecho con HTML, CSS y JavaScript sin frameworks, dependencias, servidor, pagos ni almacenamiento de datos. El catálogo y el carrito funcionan en el navegador; los pedidos y consultas se envían como mensajes preparados para WhatsApp.

## Abrir y editar en Visual Studio Code

1. Descarga y extrae `LA-SAGRADA.zip`.
2. En VS Code, usa **Archivo → Abrir carpeta** y selecciona la carpeta `LA-SAGRADA` (la que contiene `index.html`).
3. Abre `index.html` en un navegador. También puedes usar una extensión de servidor local, como Live Server, para recargar automáticamente al guardar. No hace falta ejecutar `npm install` ni instalar paquetes para que el sitio funcione.

## Archivos principales

- `index.html`: secciones, contenido, metadatos y estructura.
- `assets/css/styles.css`: estilos generales.
- `assets/css/responsive.css`: ajustes para tablets y celulares.
- `js/configuracion.js`: nombre, teléfonos, dirección, TikTok y búsqueda de Maps.
- `js/catalogo.js`: productos, descripción, presentación, precio y ruta de fotografía.
- `assets/images/logo-la-sagrada.png`: logotipo original proporcionado.
- `assets/images/productos/`: fotografías reales de productos, cuando estén disponibles.

## Cambiar datos y productos

Edita `js/configuracion.js` para actualizar los números. Los enlaces de WhatsApp se generan desde `whatsapp1` y `whatsapp2`; escribe el código de país junto al número, solo con dígitos. Para cambiar la dirección, actualiza `direccion` y `mapsQuery`. El botón de TikTok permanece inactivo mientras `tiktokUsuario` conserve `TU_USUARIO_TIKTOK`; al tener la cuenta real, cambia ese valor por el nombre de usuario sin `@`.

Edita `js/catalogo.js` para cambiar el producto inicial o agregar otros objetos al arreglo. Cada producto debe tener un `id` único, `nombre`, `descripcion`, `presentacion`, `precio` e `image`. Para agregar una foto, guárdala en `assets/images/productos/` y pon una ruta relativa, por ejemplo `assets/images/productos/hoja-coca.jpg`; añade su texto alternativo en `imageAlt`. El precio se muestra solo cuando se configura; la moneda se puede ajustar en `js/configuracion.js`. El carrito no calcula subtotales ni totales.

El formulario y el carrito no guardan datos personales ni hacen una compra automática. El cliente elige a qué número escribir; La Sagrada confirma disponibilidad, precio y coordinación directamente por WhatsApp.

## Publicar gratis con GitHub Pages

1. Extrae el ZIP y crea un repositorio en GitHub.
2. Sube **el contenido de la carpeta `LA-SAGRADA`** al nivel raíz del repositorio; `index.html` debe quedar en la raíz, no dentro de otra carpeta.
3. En el repositorio, abre **Settings → Pages**.
4. En **Build and deployment**, elige **Deploy from a branch**, selecciona la rama `main` y la carpeta `/(root)`, y guarda.
5. Espera a que termine la publicación y usa el enlace que muestra la página de configuración de Pages.

La web usa rutas relativas para que el logo, CSS, JavaScript y favicon también carguen en una página de proyecto bajo `usuario.github.io/nombre-del-repositorio/`. GitHub Pages sirve archivos estáticos; no necesita instalar dependencias ni compilar este sitio. La publicación puede tardar unos minutos.

## Estructura

```text
LA-SAGRADA/
├── index.html
├── README.md
├── favicon.ico
├── .nojekyll
├── .gitignore
├── assets/
│   ├── css/
│   │   ├── styles.css
│   │   └── responsive.css
│   └── images/
│       ├── logo-la-sagrada.png
│       ├── iconos/.gitkeep
│       └── productos/.gitkeep
└── js/
    ├── configuracion.js
    ├── catalogo.js
    └── main.js
```
