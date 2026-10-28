# Transpologi

Protótipo visual local de logística interna. HTML, CSS e JavaScript sem build ou dependências obrigatórias. Abra esta pasta no VS Code.

## Executar

Na pasta do projeto:

```sh
python3 -m http.server 4173
```

Acesse http://localhost:4173. Também é possível abrir index.html com Live Server.

## Acesso de demonstração

E-mail: operacao@transpologi.demo. Senha: demo123.
Qualquer e-mail válido e senha com quatro caracteres funciona. Os perfis mudam a tela de entrada; não são controles reais de autorização. Não use credenciais pessoais.

## Fluxo

1. Solicitações: crie um pedido. Alta prioridade exige justificativa.
2. Preparação: libere carga e destino.
3. Plano do sistema: na Central, o sistema sugere veículo e rota para cada pedido liberado (prioridade, prazo, menor veículo livre que comporta a carga). Nada é enviado até o despachante confirmar, um a um ou o plano inteiro.
4. Aceite: o motorista precisa aceitar a tarefa e confirmar cada mudança de rota. Reprodução de áudio não conta como confirmação.
5. Sem resposta: passado o prazo (padrão 90 s, ajustável em Preferências), o despachante pode reenviar ou passar a tarefa a outro veículo livre e compatível. Se havia mudança de rota pendente, ela é substituída e o novo trajeto segue com o outro veículo. Com a carga já embarcada, só é possível reenviar ou falar pelo rádio.
6. Registro: consulte os eventos e exporte CSV.

## Painel do motorista

O despachante não acessa a tela do motorista. O motorista entra com o perfil Motorista e escolhe o veículo. Para demonstrar os dois lados, abra duas abas: uma como Despachante e outra como Motorista. Os dados sincronizam pelo localStorage.

Navegação: o motorista escolhe Waze, Google Maps ou Apple Maps (ou "Perguntar sempre"). Ao confirmar uma etapa, o app abre o navegador escolhido na próxima parada por link direto (por exemplo `https://waze.com/ul?ll=LAT,LNG&navigate=yes`). As coordenadas estão em `places` no `app.js` e são fictícias; troque pelas da unidade.

Ainda não implementado: aviso ao chegar a cerca de 200 m do destino (exige GPS em segundo plano e app nativo ou PWA com permissão de localização).

## Arquivos

- index.html: entrada
- styles.css: identidade visual, componentes e responsividade
- app.js: dados fictícios, telas, eventos e fluxo
- assets/warehouse.svg: ilustração vetorial própria

## Limites

Sem backend, autenticação real, envio de WhatsApp, GPS, solver ou integração industrial. O "sistema inteligente" é uma heurística local de disponibilidade e capacidade, não um motor de otimização. Dados fictícios. Referência à unidade Pecém apenas como cenário, sem vínculo comercial. As fontes Google são opcionais; há fallback local.

Não há edição automática de rotas nem cancelamento de compromissos por falha de comunicação. Protótipo não deve ser usado em operação real. Toda interação móvel deve ocorrer com veículo parado em local seguro e permitido.

## Avisos por voz

O painel do motorista tem voz opcional (recurso do navegador, nesta aba). Não envia áudio a outro dispositivo, não garante funcionamento em segundo plano e não comprova que o motorista ouviu. "Simular falta de conexão" (controles da demonstração) deixa o aviso pendente e bloqueia confirmações no painel, mantendo o registro pelo rádio.
