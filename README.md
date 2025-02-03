```bash
nom init -y 
npm i -D typescript tsx @types/node
npx tsc --init

npm i express
npm i -D @types/express

npm i -D @swc/core @swc/cli

## descargar dependencia de prima 
npm i prisma @prisma/client

## inicializar prisma 
npm prisma 

## para encriptar las contraseñas
npm i bcrypt
npm i -D @types/bcrypt

## libreria JsonWebToken
npm i jsonwebtoken
npm i -D @types/jsonwebtoken

##SEGURIDAD
## limite de intentos en el login
npm i express-rate-limit
## protege de la mayoria de ataques conocidos
npm i helmet
## 
npm i compression

## para trabajar con cookies
npm i cookie-parser

## dependencia de cors
npm i cors
npm i --save-dev @types/cors

## para validar TODO 
npm i express-validator

# instalar ncu 
npm install -g npm-check-updates
## comprueba las dependencias que tienen nuevas versiones
npx npm-check-updates
## actualiza las dependencias
npx npm-check-updates -u
```
