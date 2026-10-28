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
2. Preparação: libere carga e recebimento.
3. Planejamento: compare veículos e aprove um compatível disponível.
4. Comunicação: confirme, registre coleta e entrega pelo simulador ou pelo rádio.
5. Histórico: consulte os eventos e exporte CSV.
6. Frota: altere disponibilidade e canal. Ocorrências não liberam cargas embarcadas.

Dados em localStorage, sessão em sessionStorage. Configurações > Restaurar demonstração repõe o cenário inicial.

## Arquivos

- index.html: entrada
- styles.css: identidade visual, componentes e responsividade
- app.js: dados fictícios, telas, eventos e fluxo
- assets/warehouse.svg: ilustração vetorial própria

## Limites

Sem backend, autenticação real, envio de WhatsApp, GPS, solver ou integração industrial. Atribuições por regras locais de disponibilidade/capacidade. Dados fictícios. Referência à unidade Pecém apenas como cenário, sem vínculo comercial. As fontes Google são opcionais; há fallback local.

Não há edição automática de rotas nem cancelamento de compromissos por falha de comunicação. Protótipo não deve ser usado em operação real. Toda interação móvel deve ocorrer com veículo parado em local seguro e permitido.

## Roteiro e avisos por voz

Roteiro mostra a ordem de coletas e entregas por veículo, separando compromissos das sugestões por prioridade e prazo. Não calcula trajetos geográficos ou otimização matemática.

Comunicação contém um painel de motorista com voz opcional. Clique em Ativar avisos e depois Testar alerta de mudança. A fala usa o recurso do navegador, nesta aba; não envia áudio a outro dispositivo e não garante funcionamento em segundo plano ou com a tela bloqueada. Simular falta de conexão deixa o aviso pendente e bloqueia confirmações do painel, mantendo o registro pelo rádio. O teste não muda a rota e não confirma leitura.
