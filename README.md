# Bookify — Backend

**Bookify** es una plataforma para clubs de lectura donde los usuarios pueden:
- Crear y gestionar clubs
- Votar libros del mes
- Subir libros propios o importarlos desde Open Library
- Comentar dentro de cada club
- Dejar reseñas y puntuaciones
- Recibir notificaciones internas sobre eventos relevantes

---

## Tecnologías usadas

- **Node.js** + **Express**
- **Prisma ORM** con **Turso (libSQL)**
- **SQLite** en desarrollo
- **JWT** para autenticación
- **Middleware personalizados** para control de roles y validación
- **Axios** para conexión con la Open Library API

---

## Funcionalidades principales

### Autenticación y usuarios
- Registro, login y logout
- Protección de rutas con JWT
- Roles: `admin`, `vip`, o sin rol
- `GET /api/users/profile` para ver el perfil completo del usuario (libros, clubs, reseñas, votos)

### Gestión de libros
- Subida manual de libros
- Importación desde Open Library (`/api/external-books/search`)
- Importación validada con control de duplicados
- Visualización por categoría
- Búsqueda de libros con filtros

### Clubs de lectura
- Crear club (el creador es admin del club)
- Unirse y salir de clubs
- Delegar admin a otro miembro
- Eliminar club (solo admin)
- Ver miembros y libros del club
- Añadir libros al club
- Votar libro del mes

### Comunicación interna
- Mini-foro dentro de cada club (mensajes tipo chat)
- Sistema de notificaciones internas:
  - Al nombrar admin
  - Cuando se selecciona libro del mes
  - Cuando alguien se une al club

### Reseñas y sugerencias
- Crear reseñas con puntuación de 1 a 5
- Vista detallada de reseñas por libro
- Sugerencias de nuevos libros o temáticas

---

## Seguridad y validaciones

- Validaciones por campo con `express-validator`
- Acceso restringido por `isAuthenticate` y `isAdmin`
- Errores estructurados con `HttpException`

---

## Mejoras previstas

- Importar libros desde CSV
- Paginación en listados
- Filtros por estado de lectura
- Vista dashboard con actividad reciente
