# TaskFlow NoSQL: creación y despliegue de una aplicación con Cloud Firestore

> **Borrador para publicar individualmente**. Completa los enlaces y capturas después del despliegue. No digas que se probaron funciones sin verificarlas.

## Introducción

Para la Actividad Grupal 01-U2 del curso Base de Datos II desarrollamos TaskFlow NoSQL, una aplicación web para administrar tareas. La solución utiliza Cloud Firestore, una base de datos NoSQL orientada a documentos, distinta de Redis, MongoDB, Neo4j y Prometheus.

## Objetivo

Demostrar desarrollo, persistencia NoSQL, operaciones CRUD, publicación en nube y automatización de despliegue.

## Arquitectura y tecnologías

Frontend HTML, CSS y JavaScript; Firebase Authentication para identidades; Cloud Firestore para documentos; Firebase Hosting para la web; GitHub para el repositorio y GitHub Actions para CI/CD.

**Flujo funcional:** Navegador → Firebase Authentication → Cloud Firestore.

**Flujo de despliegue:** GitHub push a main → GitHub Actions → Firebase Hosting.

## Modelo NoSQL

Los documentos de la colección `tasks` incluyen `userId`, `title`, `description`, `priority`, `completed`, `createdAt` y `updatedAt`. Cada documento pertenece a un usuario mediante `userId`.

## Funciones principales

- **Create:** guardar nuevas tareas con `addDoc()`.
- **Read:** escuchar tareas del usuario en tiempo real con `onSnapshot()`.
- **Update:** modificar texto o estado con `updateDoc()`.
- **Delete:** eliminar tareas con `deleteDoc()`.
- **Consultas:** buscar texto y filtrar por estado y prioridad.

## Seguridad

Las reglas de Firestore exigen autenticación y verifican que el identificador del propietario coincida con la sesión activa; también validan campos y tipos. No usamos una base de datos públicamente abierta.

## Despliegue automático

El workflow `.github/workflows/deploy.yml` se activa al hacer push a `main` y publica el directorio `public` en Firebase Hosting usando credenciales almacenadas como secreto de GitHub. Las reglas Firestore se despliegan por separado.

## Evidencias de ejecución

[INSERTAR CAPTURA REAL DE INTERFAZ]

[INSERTAR CAPTURA REAL DE DOCUMENTO FIRESTORE]

[INSERTAR CAPTURA REAL DE GITHUB ACTIONS EXITOSO]

## Pruebas

[ESCRIBIR RESULTADOS REALES: inicio de sesión, crear, editar, completar, eliminar, persistencia y autenticación]

## Conclusiones

Este proyecto ilustra cómo una aplicación estática puede utilizar una base de datos documental en la nube sin administrar un servidor propio. Las reglas por usuario contribuyen a la seguridad, y GitHub Actions ayuda a mantener actualizado el despliegue.

## Enlaces

- Código: https://github.com/Mirandaasd/taskflow-nosql-firebase-Copiar
- Aplicación: [PENDIENTE]
- Video: [PENDIENTE]

## Referencias

- https://firebase.google.com/docs/firestore
- https://firebase.google.com/docs/auth/web/password-auth
- https://firebase.google.com/docs/hosting
- https://github.com/FirebaseExtended/action-hosting-deploy
