# Projeto Aquamon

Este é um guia de início rápido para configurar e executar o projeto Aquamon.

## Clonar o repositório

Execute o seguinte comando para clonar o repositório Aquamon:

git clone <https://github.com/Fernnandez/water-control>

## Node | npm

O projeto foi construido utlizando a [versão 18 do node.js](https://nodejs.org/docs/latest-v18.x/api/index.html)

## Instalação do Docker e Docker Compose

O Docker e o Docker Compose são utilizados para subir o serviço do PostgreSQL no projeto Aquamon.

Siga as instruções abaixo para instalá-los:

Se você não tiver o Docker instalado, siga as instruções abaixo para instalar o Docker e o Docker Compose:

1. **Docker**:

   - **Windows**: Baixe e instale o Docker Desktop a partir do [site oficial do Docker](https://www.docker.com/products/docker-desktop).
   - **Mac**: Baixe e instale o Docker Desktop a partir do [site oficial do Docker](https://www.docker.com/products/docker-desktop).
   - **Linux**: Siga as instruções de instalação do Docker para a sua distribuição específica. Consulte a [documentação oficial do Docker](https://docs.docker.com/engine/install/).

2. **Docker Compose**:
   - O Docker Compose geralmente já está incluído nas instalações do Docker Desktop para Windows e Mac. Para Linux, siga as instruções [aqui](https://docs.docker.com/compose/install/).

## API

Após clonar o repositório water-control, siga estas etapas para configurar a API:

1. Navegue até o diretório `api`:

`cd water-control/api`

2. Instale as dependências com o seguinte comando:

`npm install`

3. Suba o container Docker com a imagem do postgres

`docker compose up -d`

4. Inicie o servidor de desenvolvimento:

`npm run start:dev`

## Front-end

Para configurar o front-end do projeto aquamon, siga estas etapas:

1. Navegue até o diretório `front`:

`cd water-control/front`

2. Instale as dependências com o seguinte comando:

`npm install`

3. Inicie o servidor de desenvolvimento:

`npm run dev`

## Simulador

Para configurar o dispositivo simulado no projeto aquamon, siga estas etapas:

1. Navegue até o diretório `thing`:

`cd water-control/thing `

2. Instale as dependências com o seguinte comando:

`npm install`

3. Inicie o dispositivo simulado:

`npm start`

O simulador possui duas estruturas montadas no arquivo index.js

A primeira estrutura de código vai gerar dados aleatorios para o momento atual para os devices presentes no arquivo devices.js e publicar no broker MQTT 

Já a segunda estrutura irá gerar dados historicos de uma determinada data que pode ser parametrizada até o dia atual para todos os devices presentes no arquivo devices.js

## Informações adicionais

- **Nome do Projeto**: water-control
- **Licença**: MIT
- **Integrantes**:
  - Angelo Fernandes
  - Davi Luna
  - Pedro Marinho
- **Disciplina**: IOT
- **Professor**: David Cavalcanti.
