# TaskFlow NoSQL — Actividad Grupal 01 U2

Gestor web de tareas con Firebase Authentication, Google Cloud Firestore (NoSQL), Firebase Hosting y GitHub Actions. No usa Redis, MongoDB, Neo4j ni Prometheus.

Repositorio: https://github.com/Mirandaasd/taskflow-nosql-firebase-Copiar

## Funciones

- Registro e inicio de sesión con correo y contraseña
- Crear, consultar en tiempo real, actualizar, completar y eliminar tareas (CRUD)
- Buscar y filtrar por estado y prioridad
- Cada usuario solo puede acceder a sus propias tareas mediante reglas de Firestore
- Diseño responsive

## PASO 1: Crear proyecto Firebase

1. Abre https://console.firebase.google.com/ y crea un proyecto (por ejemplo, `taskflow-nosql-u2`).
2. Ve a **Configuración del proyecto > Tus aplicaciones > Web** y registra una app web.
3. Copia los valores de `firebaseConfig` y reemplaza los marcadores en `public/firebase-config.js`.
4. Ve a **Authentication > Sign-in method** y habilita **Correo electrónico/Contraseña**.
5. Ve a **Firestore Database**, crea la base de datos (puedes usar una región de Sudamérica si está disponible) y elige **modo producción**. Publica las reglas antes de probar.
6. En Authentication > Settings > Authorized domains, revisa que el dominio de Hosting esté autorizado.

`firebaseConfig` contiene identificadores públicos del SDK web, no claves de cuenta de servicio. No subas contraseñas ni JSON privados.

## PASO 2: Publicar reglas y Hosting

En GitHub Codespaces, desde la raíz del repositorio:

```bash
npm install -g firebase-tools
firebase login --no-localhost
firebase deploy --project TU_PROJECT_ID --only firestore:rules,hosting
```

Si Firebase CLI solicita iniciar sesión, sigue el enlace y autoriza desde tu cuenta. El Hosting tendrá una dirección como `https://TU_PROJECT_ID.web.app`. Si la cuenta tiene restricciones o solicita habilitar servicios de pago, comprueba los requisitos antes de continuar; no actives facturación sin evaluarla.

## PASO 3: Activar despliegue automático

En GitHub > Settings > Secrets and variables > Actions configura:

- **Variable:** `FIREBASE_PROJECT_ID` = el ID real del proyecto Firebase.
- **Secreto:** `FIREBASE_SERVICE_ACCOUNT` = JSON completo de una cuenta de servicio autorizada a desplegar Hosting. **Nunca lo subas al repositorio ni lo compartas en el chat**.

Para obtenerlo, usa la integración oficial `firebase init hosting:github` o las indicaciones de https://firebase.google.com/docs/hosting/github-integration. Si el asistente crea un secreto con nombre distinto, adapta el workflow o crea `FIREBASE_SERVICE_ACCOUNT` apropiadamente. Las credenciales deben tener permisos mínimos.

En cada `git push` a `main`, el archivo `.github/workflows/deploy.yml` iniciará el despliegue automático de Hosting. Comprueba los logs en https://github.com/Mirandaasd/taskflow-nosql-firebase-Copiar/actions.

**Importante:** la automatización despliega Hosting; si modificas las reglas de seguridad, vuelve a desplegarlas manualmente con `firebase deploy --project TU_PROJECT_ID --only firestore:rules`.

## PASO 4: Probar y documentar

- [ ] Registrarse y acceder
- [ ] Crear tarea y verificar documento en Firestore
- [ ] Editar descripción y prioridad
- [ ] Marcar tarea completada
- [ ] Eliminar tarea
- [ ] Cerrar sesión y comprobar aislamiento entre usuarios
- [ ] GitHub Actions ejecutado exitosamente
- [ ] URL pública abre desde ventana de incógnito

## Archivos

`public/` contiene frontend y configuración, `firestore.rules` protege los datos, `firebase.json` configura hosting, `.github/workflows/deploy.yml` define CI/CD, `docs/` contiene entregables para completar con evidencias reales.

No se deben presentar como exitosos despliegues o pruebas antes de verificarlos.
