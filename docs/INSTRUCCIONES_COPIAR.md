# Instalación con un solo comando en Codespaces

1. Descarga `taskflow-nosql-proyecto.zip` desde ChatGPT.
2. Arrástralo y suéltalo sobre el explorador de archivos en GitHub Codespaces, dentro de la **raíz del repositorio** (la carpeta que contiene `README.md`).
3. Abre la terminal de Codespaces en esa misma carpeta.
4. Ejecuta:

```bash
unzip -o taskflow-nosql-proyecto.zip && rm taskflow-nosql-proyecto.zip && git add . && git commit -m "feat: TaskFlow NoSQL con Firestore y CI/CD" && git push origin main
```

**Nota:** el ZIP contiene rutas relativas y sobrescribe el README inicial con documentación completa. El despliegue automático no funcionará hasta configurar Firebase y las variables de GitHub; lee el README.
