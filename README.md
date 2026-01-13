# Serviço HTTP com InversifyJS (DIP / IoC)

Projeto acadêmico para demonstrar Inversão de Dependência (DIP) e Inversão de Controle (IoC) utilizando Node.js, TypeScript e InversifyJS.

Obs.: Deixamos o .env no repositório apenas para facilitar, mas sem dados reais.

## Executar HTTP
npm install

npm run dev

## Endpoint
GET http://localhost:PORTA/relatorio/N?email=DESTINO@EMAIL.COM
```
PORTA: porta local

N = quantidade de dados fictícios

DESTINO@EMAIL.COM = e-mail destino que receberá
```

## Executar Testes Unitários

npx vitest src\domain\report-http-adapter.spec.ts

npx vitest src\domain\report-service.spec.ts

---

## Discentes
PEDRO BONIFÁCIO BARBOSA Matrícula: 202426610040

WALLISON VINICIUS SILVA DE OLANDA Matrícula: 202226400001
