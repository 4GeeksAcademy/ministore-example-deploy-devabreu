# PRODUCT.md: MiniStore E-Commerce

## 1. Product Vision
MiniStore es un mini e-commerce de alto rendimiento con diseño Flat contemporáneo, arquitectura desacoplada (Flask REST API + React 18 SPA) y almacenamiento relacional robusto en PostgreSQL 18. Diseñado para ofrecer una experiencia de compra fluida, inmediata y libre de fricciones tanto en dispositivos móviles como en pantallas de escritorio.

## 2. Target Users & Personas
- **Comprador Rápido**: Busca productos cotidianos de tecnología, audio, moda y hogar; valora un catálogo limpio, buscador en tiempo real y proceso de checkout en 2 pasos.
- **Usuario Registrado**: Gestiona historial de compras, direcciones de entrega y seguimiento de pedidos con autenticación segura JWT.
- **Administrador de Tienda**: Visualiza catálogo, disponibilidad de stock y órdenes en base de datos.

## 3. Core Capabilities & User Journeys
1. **Descubrimiento y Catálogo**:
   - Hero banner editorial con producto destacado y barra de confianza (4 pilares de servicio).
   - Filtro reactivo por categorías con navegación horizontal táctil en smartphones.
   - Búsqueda en tiempo real por término y filtro rápido por destacados.
2. **Ficha y Detalle de Producto**:
   - Fotografía de alta resolución con etiqueta de disponibilidad y cálculo de inventario.
   - Selector de unidades con validación de límite de stock.
   - Añadido al carrito con notificación toast inmediata.
3. **Carrito de Compras Persistente**:
   - Persistencia local mediante `localStorage` y estado global centralizado en `store.js`.
   - Modificación dinámica de cantidades y eliminación con animaciones de salida.
   - Cálculo automático de subtotal, envío gratuito y total general.
4. **Checkout y Procesamiento de Órdenes**:
   - Validación de sesión con redirección inteligente post-login.
   - Formulario de dirección y referencias de entrega.
   - Transacción atómica en PostgreSQL 18 con decremento de stock en tiempo real.
5. **Autenticación y Seguridad**:
   - Cifrado unidireccional de contraseñas con salting Bcrypt.
   - Tokens de acceso Bearer JWT (`flask-jwt-extended`).
   - Acceso rápido con credenciales demo en un clic para facilitar pruebas.

## 4. Quality & Performance Metrics
- Tiempo de compilación de frontend < 1.5s mediante Vite.
- Respuestas de API JSON en < 15ms sobre PostgreSQL 18 local.
- Compatibilidad completa con despliegue en Render (build scripts y variables de entorno automatizadas).
