# Assets del Proyecto

## 🎨 Assets Requeridos

Coloca los siguientes archivos en `src/assets/`:

### Imágenes
- `logo.png` - Logo del Baby Shower (recomendado: 512x512px)
- `default-gift.png` - Imagen por defecto para regalos
- `hero-background.jpg` - Imagen de fondo para welcome

### Iconos
- `favicon.ico` - En la raíz `src/`
- Emojis inline en componentes (no requiere assets)

### Fuentes
- Google Fonts (Inter) se carga desde CDN en `index.html`

## 📁 Estructura Recomendada

```
src/assets/
├── images/
│   ├── logo.png
│   ├── default-gift.png
│   └── hero-background.jpg
├── icons/
│   └── (iconos SVG si los hay)
└── data/
    └── (datos mock si es necesario)
```

## 🎯 Nota

Los emojis se utilizan directamente en los componentes como texto Unicode, por lo que no requieren archivos de assets adicionales.

Para el favicon, puedes usar un emoji convertido a ICO o generar uno personalizado en sitios como:
- https://favicon.io/
- https://realfavicongenerator.net/
