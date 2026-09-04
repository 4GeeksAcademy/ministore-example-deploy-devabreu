# DESIGN.md: MiniStore Design System & Standards

## 1. Principles
- **True Flat Design**: Cero glassmorphism, cero efectos de blur difuso, bordes de 1px nítidos (`#e2e8f0` y `#1e293b`).
- **Typography First**: Uso de `Plus Jakarta Sans` de Google Fonts con escalas tipográficas consistentes y tracking ceñido para titulares de impacto (`-0.035em`).
- **Intentional Iconography**: Solo iconos vectoriales SVG limpios vía `lucide-react`. Sin emojis en interfaces de usuario ni en toasts.
- **Mobile-First Responsiveness**: Rejilla de productos en 2 columnas en teléfonos móviles (`col-6`), scroll horizontal táctil para categorías y áreas táctiles de mínimo 44px.

## 2. Color Tokens
| Token | Hex | Rol / Uso |
|---|---|---|
| `--bs-dark` / Hero | `#090d16` | Fondo del hero, atmósfera nocturna y marcas principales |
| `--flat-canvas` | `#f8fafc` | Fondo neutro claro de toda la aplicación |
| `--flat-surface` | `#ffffff` | Fondo de tarjetas, paneles y modales |
| `--flat-border` | `#e2e8f0` | Divisores y bordes sutiles de 1px |
| `--flat-border-hover` | `#cbd5e1` | Bordes activos y estados hover |
| `--flat-accent` | `#2563eb` | Azul cobalto para enlaces, botones primarios e inputs activos |
| `--flat-action` | `#059669` | Verde esmeralda para botones de compra, checkout y stock |
| `--flat-warning` | `#d97706` | Ámbar cálido para insignias de productos destacados |

## 3. Component Taxonomy
- **ProductCard**: Tarjeta compacta con contenedor de imagen 1:1, badge de categoría, truncado a 2 líneas, stock reactivo y botón de compra rápida.
- **Hero Spotlight**: Vitrina asimétrica con producto de la semana, precio rebajado y botón de acción directa.
- **Trust Strip**: Barra de 4 pilares con iconos vectoriales y descripción concisa.
- **Category Pills**: Píldoras de filtro con scroll horizontal sin barra visible en dispositivos móviles.
- **Interactive Forms**: Inputs planos sin sombras con bordes coloreados en foco.
- **Toasts**: Notificaciones sobrias con fondo oscuro `#0f172a` y bordes sólidos de 1px.
