# Mulher Segura — Agosto Lilás

Aplicação web educativa e informativa sobre prevenção e enfrentamento da violência contra a mulher.

## Objetivo

Reunir, em uma interface simples e responsiva, informações sobre canais oficiais de atendimento, denúncia, direitos, rede de proteção e caminhos para buscar ajuda.

> **Importante:** este projeto não substitui serviços oficiais de emergência, atendimento profissional ou registro formal de denúncias.

## Funcionalidades

- Página inicial com orientações e relatos ilustrativos;
- canais de ajuda e emergência;
- fluxo orientativo de denúncia;
- consulta de delegacias e abertura de rotas no Google Maps;
- seção de direitos;
- assistente virtual local com respostas pré-programadas;
- navegação responsiva;
- suporte a navegação por teclado e preferências de movimento reduzido.

## Tecnologias

- HTML5 semântico;
- CSS3;
- JavaScript (ES6+);
- APIs nativas do navegador, como Geolocation;
- Google Maps para visualização/rotas externas.

## Estrutura

```text
Agosto-lilas/
├── index.html
├── 1.webp
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── robots.txt
├── sitemap.xml
└── README.md
```

## Execução

O projeto é estático. Pode ser aberto localmente no navegador ou publicado em serviços de hospedagem estática.

Para desenvolvimento local, recomenda-se utilizar um servidor HTTP simples em vez de abrir o arquivo diretamente via `file://`, especialmente para testar recursos que dependem do navegador, como geolocalização.

## Privacidade e segurança

O assistente virtual atual funciona localmente no navegador e não envia as mensagens para um servidor.

A funcionalidade de localização depende da permissão concedida pelo navegador e deve ser tratada como um recurso opcional.

Caso o projeto evolua para armazenamento de relatos, cadastros ou outros dados pessoais, será necessária uma arquitetura de backend, controle de acesso, proteção de dados e adequação à LGPD.

## Canais oficiais

O projeto direciona o usuário para canais oficiais, incluindo Ligue 180, Disque Denúncia 181 em São Paulo e Delegacia Eletrônica.

Os endereços oficiais podem mudar. Em uma versão de produção, recomenda-se revisar periodicamente todos os links e informações institucionais.

## Status

Projeto em evolução e com foco educacional/acadêmico.

## Licença

A licença do projeto ainda não foi definida. Antes de reutilizar ou distribuir o código, defina uma licença compatível com o objetivo do projeto.
