# Tempo Seguro

## Descrição
Tempo Seguro é uma aplicação web que permite registrar e acompanhar alertas de ocorrências climáticas em tempo real. No mapa é possível adicionar marcadores de situações como enchentes, deslizamentos e outros eventos. Os administradores aprovam os marcadores antes que eles fiquem visíveis para todos os usuários.

## Requisitos
- Node.js 20.x
- npm ou outro gerenciador de pacotes (yarn/pnpm)

## Instalação e execução
1. Instale as dependências:
```bash
npm install
```
2. Inicie o ambiente de desenvolvimento:
```bash
npm run dev
```
Após iniciar o servidor, serão exibidos os endereços para acesso. Para abrir a aplicação no celular, conecte-o à mesma rede e utilize o endereço IPv4 mostrado (por exemplo: `https://192.168.0.100:3000`).

## Build de produção
Para gerar os arquivos de produção, execute:
```bash
npm run build
```
E então:
```bash
npm run start
```

## Funcionamento do app
Ao abrir o mapa, o usuário pode localizar sua posição e clicar para adicionar um novo alerta. Depois de escolher o tipo de evento, o marcador é enviado ao servidor e fica pendente de aprovação. Quando aprovado por um administrador, todos os usuários recebem a notificação imediatamente. Dependendo da distância até o alerta, diferentes sons de aviso são reproduzidos.
