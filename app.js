const $ = (s) => document.querySelector(s),
  esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
const paths = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  box: "m3 7 9-4 9 4v10l-9 4-9-4ZM3 7l9 4 9-4M12 11v10M7 5l10 4",
  route: "M5 5h10a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h10M2 5h4M16 18l3 3-3 3",
  truck:
    "M2 6h12v11H2zM14 10h4l4 4v3h-8M5 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4M18 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4",
  chat: "M21 11a8 8 0 0 1-8 8H6l-4 3V7a4 4 0 0 1 4-4h11a4 4 0 0 1 4 4ZM7 8h9M7 12h6",
  clock: "M12 8v5l3 2M21 12a9 9 0 1 0-18 0 9 9 0 0 0 18 0",
  settings: "M4 6h16M4 12h16M4 18h16M8 3v6M16 9v6M9 15v6",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  plus: "M12 5v14M5 12h14",
  exit: "M9 3H3v18h6M9 12h12m-4-4 4 4-4 4",
  check: "m5 12 4 4L19 6",
  alert: "m12 3 10 18H2ZM12 9v5M12 17v1",
  users:
    "M16 21v-3a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v3M13 6a4 4 0 1 0-8 0 4 4 0 0 0 8 0M18 3a4 4 0 0 1 0 8M22 21v-3a4 4 0 0 0-3-4",
  menu: "M3 6h18M3 12h18M3 18h18",
};
const icon = (n) =>
  `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n] || paths.box}"/></svg>`;
const seed = () => ({
  vehicles: [
    {
      id: "V01",
      name: "Caminhão leve",
      plate: "TRP • 1001",
      driver: "Marcos Oliveira",
      cap: 1500,
      channel: "Painel do motorista",
      available: true,
    },
    {
      id: "V02",
      name: "Utilitário",
      plate: "TRP • 2002",
      driver: "Luiza Santos",
      cap: 500,
      channel: "Painel do motorista",
      available: true,
    },
    {
      id: "V03",
      name: "Caminhão leve",
      plate: "TRP • 3003",
      driver: "João Costa",
      cap: 1500,
      channel: "Rádio",
      available: true,
    },
  ],
  tasks: [
    {
      id: "TR-1048",
      material: "Kit de rolamentos",
      from: "Almoxarifado",
      to: "Oficina central",
      weight: 180,
      priority: "Urgente",
      deadline: "10:30",
      cargo: true,
      receive: true,
      state: "Fila",
      vehicle: null,
    },
    {
      id: "TR-1047",
      material: "Conjunto de válvulas",
      from: "Almoxarifado",
      to: "Manutenção B",
      weight: 320,
      priority: "Alta",
      deadline: "11:00",
      cargo: false,
      receive: true,
      state: "Fila",
      vehicle: null,
    },
    {
      id: "TR-1046",
      material: "Ferramentas de manutenção",
      from: "Almoxarifado",
      to: "Oficina central",
      weight: 90,
      priority: "Normal",
      deadline: "11:30",
      cargo: true,
      receive: false,
      state: "Fila",
      vehicle: null,
    },
    {
      id: "TR-1045",
      material: "Motor elétrico",
      from: "Almoxarifado",
      to: "Manutenção B",
      weight: 620,
      priority: "Alta",
      deadline: "10:45",
      cargo: true,
      receive: true,
      state: "Em transporte",
      vehicle: "V01",
      channel: "Painel do motorista",
    },
    {
      id: "TR-1044",
      material: "Elementos de fixação",
      from: "Almoxarifado",
      to: "Oficina central",
      weight: 120,
      priority: "Normal",
      deadline: "12:00",
      cargo: true,
      receive: true,
      state: "Fila",
      vehicle: null,
    },
    {
      id: "TR-1043",
      material: "Paletes retornáveis",
      from: "Oficina central",
      to: "Almoxarifado",
      weight: 240,
      priority: "Normal",
      deadline: "09:30",
      cargo: true,
      receive: true,
      state: "Entregue",
      vehicle: "V03",
      channel: "Rádio",
    },
  ],
  events: [
    {
      time: "09:42",
      text: "TR-1045 • coleta confirmada por Marcos Oliveira.",
      channel: "Painel do motorista",
    },
    {
      time: "09:28",
      text: "TR-1043 • entrega informada por João Costa.",
      channel: "Rádio",
    },
    {
      time: "09:15",
      text: "Turno iniciado. Três veículos cadastrados.",
      channel: "Operação",
    },
  ],
});

// Local demonstration only. Existing requests are retained across UI versions.
let db;
try { db = JSON.parse(localStorage.getItem('transpologi-data')) || seed(); } catch { db = seed(); }
db.changes ||= [];
db.positionTick ||= 0;
db.vehicles.forEach((v,i)=>{v.online ??= true; v.channel = v.channel==='Rádio'?'Rádio':'Painel do motorista';});
let user;
try {user = JSON.parse(sessionStorage.getItem('transpologi-user'));} catch {}
let view='operation', selected='V01', driverVehicle='V01', filter='Todos', search='', voiceEnabled=false, audioState='Ative a voz antes de iniciar o turno.', spokenId=null;
const views={operation:'Central de operação',requests:'Solicitações',fleet:'Frota e equipe',history:'Registro de eventos'};
const priorityRank={Urgente:0,Alta:1,Normal:2};
const save=()=>localStorage.setItem('transpologi-data',JSON.stringify(db));
const vehicle=id=>db.vehicles.find(v=>v.id===id);
const task=id=>db.tasks.find(t=>t.id===id);
const committed=id=>db.tasks.find(t=>t.vehicle===id&&t.state!=='Entregue');
const pending=id=>db.changes.find(c=>c.vehicle===id&&c.status==='Pendente');
const ready=t=>t.state==='Fila'&&t.cargo&&t.receive;
const readyTasks=()=>db.tasks.filter(ready).sort((a,b)=>priorityRank[a.priority]-priorityRank[b.priority]||a.deadline.localeCompare(b.deadline));
const when=()=>new Date().toLocaleTimeString('pt-BR',{timeZone:'America/Fortaleza',hour:'2-digit',minute:'2-digit'});
const label=(text,tone='neutral')=>`<span class="badge ${tone}">${esc(text)}</span>`;
function status(t){return t.state!=='Fila'?t.state:!t.cargo?'Preparar carga':!t.receive?'Confirmar destino':'Pronto para programar';}
function log(text,channel='Despachante'){db.events.unshift({text,channel,time:when()});save();}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),4000);}
function modal(title,body,footer=''){const m=$('#modal');m.innerHTML=`<div class="modal-head"><div><span class="kicker">TRANSpologi / OPERAÇÃO</span><h2>${title}</h2></div><button class="icon-btn" data-act="close" aria-label="Fechar">×</button></div><div class="modal-body">${body}</div>${footer?`<div class="modal-footer">${footer}</div>`:''}`;if(!m.open)m.showModal();}
function go(next){view=next;render();window.scrollTo({top:0,behavior:'instant'});}
function title(title,description,action=''){return `<div class="page-title"><div><h1>${title}</h1><p>${description}</p></div>${action}</div>`;}
function nav(){return `<aside class="sidebar"><a class="brand" href="#" data-act="home"><span class="brand-mark">↗</span>transpologi<span class="brand-dot">.</span></a><div class="workspace"><span class="workspace-icon">P</span><div><b>${esc(db.unit||'Unidade Pecém')}</b><small>Logística interna</small></div></div><div class="nav-caption">ACOMPANHAMENTO</div><button class="nav-link ${view==='operation'?'active':''}" data-view="operation">${icon('route')}<span>Central de operação</span></button><div class="nav-caption">GESTÃO</div>${[['requests','Solicitações','box'],['fleet','Frota e equipe','truck'],['history','Registro de eventos','clock']].map(([p,t,i])=>`<button class="nav-link ${view===p?'active':''}" data-view="${p}">${icon(i)}<span>${t}</span></button>`).join('')}<div class="sidebar-bottom"><div class="demo-note"><i></i><div>Ambiente de demonstração<small>Dados e posições simulados</small></div></div><button class="driver-switch" data-act="driver">${icon('users')} Abrir painel do motorista ${icon('arrow')}</button><button class="nav-link logout" data-act="logout">${icon('exit')} Sair da conta</button></div></aside>`;}
function login(){return `<div class="login"><section class="login-art"><a class="brand"><span class="brand-mark">↗</span>transpologi.</a><div><span class="kicker">LOGÍSTICA INTERNA</span><h1>Uma operação.<br>Cada movimento<br>no lugar certo.</h1><p>Pedidos, veículos e pessoas conectados<br>do almoxarifado à entrega.</p></div><img src="assets/warehouse.svg" alt="Armazém e veículo de transporte"><small>Preparar. Programar. Movimentar.</small></section><section class="login-form"><form id="login"><span class="kicker">BEM-VINDO AO TRANSpologi</span><h2>Acesse sua operação.</h2><p>Selecione o espaço de trabalho da demonstração.</p><label>E-mail<input type="email" name="email" value="operacao@transpologi.demo" required></label><label>Senha de demonstração<input type="password" name="password" value="demo123" minlength="4" required></label><label>Entrar como<select name="role"><option>Despachante</option><option>Motorista</option><option>Área solicitante</option></select></label><button class="btn primary wide">Entrar ${icon('arrow')}</button><small>Acesso simulado. Não use credenciais pessoais.</small></form></section></div>`;}
function render(){if(!user){$('#app').innerHTML=login();return;}if(view==='driver'){$('#app').innerHTML=driver();return;}$('#app').innerHTML=`${nav()}<div class="shell"><header class="topbar"><div class="row"><button class="icon-btn mobile-menu" data-act="menu" aria-label="Abrir menu">${icon('menu')}</button><span class="breadcrumb">Workspace <span>/</span> <b>${views[view]}</b></span></div><div class="row"><span class="shift">${esc(db.shift||'Turno A · 06h às 14h')}</span><button class="profile" data-act="account" aria-label="Preferências da conta">OP</button></div></header><main class="content">${({operation,requests,fleet,history})[view]()}</main><footer class="app-footer"><span>Transpologi / Logística interna</span><span>Protótipo demonstrativo · sem GPS ou motor de otimização</span></footer></div>`;}

const locations={'Almoxarifado':[180,260],'Oficina central':[590,140],'Manutenção B':[610,410],'Pátio de apoio':[180,410]};
const scenarios={
  bloqueio:{title:'Via principal bloqueada',via:'Corredor sul',reason:'A via principal foi interditada para manutenção.',impact:'+4 min',points:[[180,410],[610,410]]},
  trafego:{title:'Tráfego intenso na via principal',via:'Corredor leste',reason:'Há concentração de veículos na via principal.',impact:'+2 min',points:[[740,260],[740,410]]},
  acesso:{title:'Acesso habitual interditado',via:'Acesso técnico',reason:'O acesso habitual ao destino está temporariamente interditado.',impact:'+6 min',points:[[180,500],[740,500],[740,410]]}
};
function vehiclePoint(v){const t=committed(v.id),tick=db.positionTick%3; if(!t)return v.id==='V02'?[180+tick*14,410]:[180,260+tick*14];return t.state==='Em transporte'?[330+tick*40,260]:locations[t.from]||[180,260];}
function routePoints(v,change){const t=committed(v.id);if(!t)return '';const start=vehiclePoint(v),end=locations[t.to]||[610,410],route=change?.scenario||t.routeScenario;let points;
 if(route&&scenarios[route]) {const via=scenarios[route].points;points=[start,[180,start[1]],...via,[end[0],via.at(-1)[1]],end];}
 else points=[start,[end[0],start[1]],end];
 return points.map(p=>p.join(',')).join(' ');
}
function plantMap(){const v=vehicle(selected),change=pending(selected);return `<div class="map-surface"><div class="map-topline"><div><span class="live-dot"></span><b>Planta operacional</b><span>Mapa esquemático</span></div><button class="map-action" data-act="positions">${icon('clock')} Atualizar posições</button></div><svg class="plant" viewBox="0 0 900 580" role="img" aria-label="Mapa simulado da planta com os veículos V01, V02 e V03. Selecione um veículo na lista abaixo para ver o roteiro."><defs><pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#dce1db" stroke-width=".6"/></pattern><filter id="shadow"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity=".12"/></filter></defs><rect width="900" height="580" fill="#e9ede7"/><rect width="900" height="580" fill="url(#grid)"/><path d="M0 25 Q140 105 300 30T900 20V0H0Z M0 555Q300 495 500 558T900 550V580H0Z" fill="#dfe6d9"/>
<g stroke="#fafbf8" stroke-width="32" stroke-linejoin="round" fill="none"><path d="M70 260H830M180 70V510M610 70V510M740 100V510M180 140H740M180 410H740M180 500H740"/></g><g stroke="#c9d0c6" stroke-width="1" fill="none"><path d="M70 260H830M180 70V510M610 70V510M740 100V510M180 140H740M180 410H740M180 500H740" stroke-dasharray="8 9"/></g>
<g class="map-buildings"><path d="M70 104h95v115H70z"/><path d="M220 162h152v70H220z"/><path d="M405 163h155v69H405z"/><path d="M470 53h115v65H470z"/><path d="M640 305h80v80H640z"/><path d="M250 300h125v78H250z"/><path d="M420 300h140v78H420z"/><path d="M250 442h210v32H250z"/></g><g stroke="#c9cfca" stroke-width="6"><path d="M235 173h122m-122 14h122m-122 14h122m-122 14h122M420 173h125m-125 14h125m-125 14h125m-125 14h125M435 315h110m-110 18h110m-110 18h110"/></g>
<g class="map-labels"><text x="220" y="119">ALMOXARIFADO</text><text x="480" y="32">OFICINA CENTRAL</text><text x="640" y="435">MANUTENÇÃO B</text><text x="70" y="451">PÁTIO DE APOIO</text><text x="280" y="286" class="road-name">VIA PRINCIPAL</text><text x="335" y="434" class="road-name">CORREDOR SUL</text><text x="758" y="200" class="road-name" transform="rotate(90 758 200)">CORREDOR LESTE</text><text x="370" y="525" class="road-name">ACESSO TÉCNICO</text></g>
${committed(v.id)?`<polyline points="${routePoints(v)}" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${routePoints(v)}" fill="none" stroke="#da612d" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`:''}${change?`<polyline points="${routePoints(v,change)}" fill="none" stroke="#344847" stroke-width="5" stroke-dasharray="10 8" stroke-linejoin="round"/>`:''}
${db.vehicles.map(x=>{const [px,py]=vehiclePoint(x);return `<g class="map-vehicle" filter="url(#shadow)" data-vehicle="${x.id}" role="button" tabindex="0" aria-label="Selecionar veículo ${x.id}" transform="translate(${px},${py})"><circle r="26" fill="${x.id===selected?'#da612d':'#fff'}" stroke="${x.id===selected?'#fff':'#c5cdc6'}" stroke-width="3"/><path d="M-13-8H3V7H-13ZM3-3H9L14 2V7H3M-8 7v3M9 7v3" fill="none" stroke="${x.id===selected?'white':'#34453e'}" stroke-width="2"/><rect x="-26" y="32" width="52" height="23" rx="6" fill="#fff"/><text text-anchor="middle" y="48" font-size="12" fill="#26352d" font-weight="700">${x.id}</text></g>`}).join('')}
<g transform="translate(850,65)" class="north"><path d="M0-18l-8 25 8-5 8 5Z" fill="#748477"/><text x="0" y="-25" text-anchor="middle" font-size="11" fill="#748477">N</text></g></svg><div class="map-legend"><span><i class="line orange"></i>Roteiro confirmado</span>${change?'<span><i class="line dashed"></i>Mudança pendente</span>':''}<span>Posições fictícias · ${esc(db.positionsAt||'10:18')}</span></div></div>`;}
function stops(t){if(!t)return [];return [{place:t.from,action:'Coleta',done:t.state==='Em transporte'},...(t.routeScenario?[{place:scenarios[t.routeScenario].via,action:'Passagem',done:!!t.viaPassed}]:[]),{place:t.to,action:'Entrega',done:t.state==='Entregue'}];}
function changeBox(c){return `<div class="change-notice"><div class="row between"><b>Nova orientação enviada</b>${label('Pendente','amber')}</div><p>${esc(c.reason)}</p><div class="change-next">Seguir pelo <b>${esc(c.via)}</b></div><small>${vehicle(c.vehicle).online?'Aguardando confirmação do motorista.':'Dispositivo sem conexão. Contate pelo rádio.'}</small><button class="text-btn" data-act="viewchange" data-id="${c.id}">Ver antes e depois ${icon('arrow')}</button></div>`;}
function routePanel(){const v=vehicle(selected),t=committed(v.id),c=pending(v.id);const next=t&&stops(t).find(s=>!s.done);return `<section class="route-panel panel"><div class="panel-head"><div><span class="kicker">ROTEIRO DO VEÍCULO</span><h2>${v.id} <span>· ${esc(v.name)}</span></h2></div><span class="vehicle-avatar">${icon('truck')}</span></div><div class="driver-summary"><span class="avatar">${v.driver.split(' ').map(s=>s[0]).slice(0,2).join('')}</span><div><b>${esc(v.driver)}</b><small>${esc(v.plate)} · ${v.cap} kg</small></div>${label(v.online?'Conectado':'Sem conexão',v.online?'green':'neutral')}</div>${t?`${c?changeBox(c):''}<div class="next-destination"><span class="kicker">${t.state==='Aguardando confirmação'?'AGUARDANDO ACEITE':'PRÓXIMA PARADA'}</span><h3>${esc(next?.place||t.to)}</h3><p>${t.state==='Aguardando confirmação'?'O motorista ainda precisa aceitar a tarefa.':next?.action==='Coleta'?'Retirar a carga e confirmar a coleta.':next?.action==='Passagem'?'Desvio aprovado pelo despachante.':'Entregar a carga e confirmar o recebimento.'}</p></div><div class="route-list">${stops(t).map((s,i)=>`<div class="route-step ${s.done?'done':s===next?'upcoming':''}"><span class="step-circle">${s.done?'✓':i+1}</span><div><small>${s.done?'CONCLUÍDO':s.action.toUpperCase()}</small><b>${esc(s.place)}</b><span>${s.action==='Passagem'?'Orientação de desvio':`${esc(t.material)} · ${t.weight} kg`}</span></div></div>`).join('')}</div><div class="task-foot"><span>${t.id}</span><span>Prazo <b>${t.deadline}</b></span>${label(t.state,'green')}</div><div class="route-actions"><button class="btn primary wide" data-act="change" data-id="${v.id}" ${c?'disabled':''}>${icon('route')} Propor mudança de trajeto</button><button class="btn wide" data-act="radio" data-id="${t.id}">${icon('chat')} Registrar informação por rádio</button></div>`:`<div class="empty-vehicle">${icon('truck')}<h3>${v.available?'Pronto para a próxima tarefa':'Veículo indisponível'}</h3><p>${v.available?'Escolha um pedido na fila e programe o atendimento.':'Revise a disponibilidade em Frota e equipe.'}</p><button class="btn" data-view="requests">Ver solicitações ${icon('arrow')}</button></div>`}<button class="text-btn driver-preview" data-act="driver" data-id="${v.id}">Abrir visão deste motorista ${icon('arrow')}</button></section>`;}
function operation(){return `${title('Central de operação','Localize os veículos, acompanhe as paradas e gerencie mudanças.',`<button class="btn" data-act="driver">${icon('users')} Visão do motorista</button>`)}<div class="summary-strip"><div><span class="stat-symbol">${icon('truck')}</span><div><strong>${db.tasks.filter(t=>t.state==='Em transporte').length.toString().padStart(2,'0')}</strong><span>em transporte</span></div></div><div><span class="stat-symbol">${icon('box')}</span><div><strong>${readyTasks().length.toString().padStart(2,'0')}</strong><span>pedidos prontos</span></div></div><div><span class="stat-symbol amber">${icon('alert')}</span><div><strong>${db.changes.filter(c=>c.status==='Pendente').length.toString().padStart(2,'0')}</strong><span>mudanças sem confirmação</span></div></div><p><span class="live-dot"></span>Turno em acompanhamento<small>Operação simulada</small></p></div><div class="ops-layout"><div class="map-column"><div class="panel map-panel"><div class="panel-head"><h2>Onde está cada veículo</h2>${label('Posições simuladas')}</div>${plantMap()}<div class="vehicle-selector">${db.vehicles.map(v=>`<button data-vehicle="${v.id}" class="vehicle-select ${selected===v.id?'selected':''}"><span class="mini-truck">${icon('truck')}</span><div><b>${v.id}</b><small>${committed(v.id)?'Em atendimento':v.available?'Disponível':'Indisponível'}</small></div><span class="selection-dot"></span></button>`).join('')}</div></div><section class="panel ready-panel"><div class="panel-head"><div><h2>Prontos para programar</h2><p>Carga e destino já liberados</p></div><button class="text-btn" data-view="requests">Ver todos ${icon('arrow')}</button></div>${readyTasks().slice(0,3).map(t=>`<div class="queue-row"><div class="queue-icon">${icon('box')}</div><div class="queue-info"><b>${esc(t.material)}</b><small>${t.id} · ${esc(t.from)} → ${esc(t.to)}</small></div>${label(t.priority,t.priority==='Urgente'?'amber':'neutral')}<button class="btn small" data-act="assign" data-id="${t.id}">Programar ${icon('arrow')}</button></div>`).join('')||'<div class="empty">Nenhum pedido liberado para transporte.</div>'}</section></div>${routePanel()}</div>`;}

function requests(){let tasks=db.tasks.filter(t=>(filter==='Todos'||filter==='Prontos'&&ready(t)||filter==='Preparação'&&t.state==='Fila'&&!ready(t)||filter==='Em atendimento'&&t.vehicle&&t.state!=='Entregue'||filter==='Entregues'&&t.state==='Entregue')&&`${t.id} ${t.material} ${t.from} ${t.to}`.toLowerCase().includes(search.toLowerCase()));return `${title('Solicitações','Prepare os pedidos aqui. Acompanhe os veículos na Central de operação.',`<button class="btn primary" data-act="new">${icon('plus')} Nova solicitação</button>`)}<div class="process-strip"><span><b>01</b> Solicitar</span><i>→</i><span><b>02</b> Liberar carga e destino</span><i>→</i><span><b>03</b> Programar veículo</span><i>→</i><span><b>04</b> Acompanhar na central</span></div><section class="panel"><div class="request-tools"><div class="tabs">${['Todos','Preparação','Prontos','Em atendimento','Entregues'].map(f=>`<button data-filter="${f}" class="${f===filter?'active':''}">${f}</button>`).join('')}</div><input id="search" value="${esc(search)}" placeholder="Buscar pedido ou material" aria-label="Buscar solicitações"></div><div class="table-wrap"><table><thead><tr><th>Pedido / material</th><th>Origem → destino</th><th>Preparação</th><th>Prioridade / prazo</th><th>Situação</th><th></th></tr></thead><tbody>${tasks.map(t=>`<tr><td><b>${t.id}</b><small>${esc(t.material)} · ${t.weight} kg</small></td><td>${esc(t.from)}<small>→ ${esc(t.to)}</small></td><td><div class="prep-state ${t.cargo?'good':''}">${t.cargo?'✓':'○'} Carga pronta</div><div class="prep-state ${t.receive?'good':''}">${t.receive?'✓':'○'} Destino liberado</div></td><td>${label(t.priority,t.priority==='Urgente'?'amber':'neutral')}<small>${t.deadline}</small></td><td>${label(status(t),ready(t)?'green':'neutral')}<small>${t.vehicle||'Sem veículo'}</small></td><td><button class="btn small" data-act="detail" data-id="${t.id}">${t.state==='Fila'?'Gerenciar':'Detalhes'} ${icon('arrow')}</button></td></tr>`).join('')||'<tr><td colspan="6" class="empty">Nenhum pedido encontrado.</td></tr>'}</tbody></table></div></section>`;}
function fleet(){return `${title('Frota e equipe','Cadastre a disponibilidade e o canal de contato de cada motorista.')}<div class="fleet-grid">${db.vehicles.map(v=>`<article class="panel fleet-card"><div class="row between"><h2>${v.id}</h2>${label(v.available?committed(v.id)?'Em atendimento':'Disponível':'Indisponível',v.available?'green':'neutral')}</div><div class="fleet-illustration">${icon('truck')}</div><h3>${esc(v.name)}</h3><p>${esc(v.plate)}</p><div class="facts"><div><span>Motorista</span><b>${esc(v.driver)}</b></div><div><span>Capacidade</span><b>${v.cap} kg</b></div><div><span>Canal</span><b>${esc(v.channel)}</b></div><div><span>Conexão simulada</span><b>${v.online?'Conectado':'Sem conexão'}</b></div></div><button class="btn wide" data-act="vehicle" data-id="${v.id}">Gerenciar veículo</button><button class="text-btn" data-act="locate" data-id="${v.id}">Ver na central ${icon('arrow')}</button></article>`).join('')}</div>`;}
function history(){return `${title('Registro de eventos','Quem decidiu, o que mudou e como a informação foi confirmada.',`<button class="btn" data-act="export">Exportar CSV</button>`)}<section class="panel"><div class="event-list">${db.events.map(e=>`<div class="event"><span class="event-time">${esc(e.time)}</span><span class="event-dot"></span><div><p>${esc(e.text)}</p><small>${esc(e.channel)}</small></div></div>`).join('')}</div></section>`;}

function driver(){const v=vehicle(driverVehicle),t=committed(v.id),c=pending(v.id),next=t&&stops(t).find(s=>!s.done);return `<div class="driver-shell"><header class="driver-header"><a class="brand"><span class="brand-mark">↗</span>transpologi.</a><button class="btn small" data-view="operation">Voltar à central ${icon('arrow')}</button></header><div class="driver-mode"><span class="kicker">PAINEL DO MOTORISTA</span><select id="driver-select" aria-label="Motorista da demonstração">${db.vehicles.map(x=>`<option value="${x.id}" ${x.id===v.id?'selected':''}>${x.id} · ${esc(x.driver)}</option>`).join('')}</select></div><main class="driver-content"><div class="driver-heading"><div><h1>Olá, ${esc(v.driver.split(' ')[0])}.</h1><p>Seu próximo passo, sem complicação.</p></div>${label(v.online?'Conectado':'Sem conexão',v.online?'green':'neutral')}</div><div class="voice-bar"><span class="voice-icon">${icon('chat')}</span><div><b>Avisos por voz ${voiceEnabled?'ativados':'desativados'}</b><small id="audio-status">${esc(audioState)}</small></div><button class="btn small" data-act="voice">${voiceEnabled?'Desativar':'Ativar voz'}</button></div>${!v.online?'<div class="offline-banner"><b>Sem conexão</b><p>Novas orientações não chegam. Use o rádio para falar com a central.</p></div>':''}
${c&&v.online?`<section class="driver-change"><div class="row between"><span class="kicker">O ROTEIRO MUDOU</span>${label('Confirmação pendente','amber')}</div><h2>Siga pelo ${esc(c.via.toLowerCase())}.</h2><div class="reason"><small>POR QUE MUDOU</small><p>${esc(c.reason)}</p></div><p class="destination-note">A entrega continua em <b>${esc(t.to)}</b>. A carga permanece no seu veículo.</p><div class="driver-change-actions"><button class="btn" data-act="repeat" data-id="${c.id}">${icon('chat')} Ouvir orientação</button><button class="btn primary" data-act="ack" data-id="${c.id}">Entendi · estou parado ${icon('check')}</button></div></section>`:''}
${t?`<section class="driver-next"><div class="row between"><span class="kicker">${c?'INSTRUÇÃO ANTERIOR · MUDANÇA PENDENTE':'SUA PRÓXIMA PARADA'}</span><span class="task-code">${t.id}</span></div><h2>${esc(next?.place||t.to)}</h2><p>${t.state==='Aguardando confirmação'?'Aceite a tarefa antes de iniciar o atendimento.':next?.action==='Passagem'?'Passe pelo acesso indicado para seguir até a entrega.':next?.action==='Coleta'?'Retire a carga no local indicado.':'Entregue a carga ao responsável pelo recebimento.'}</p><div class="driver-cargo"><span>${icon('box')}</span><div><b>${esc(t.material)}</b><small>${t.weight} kg · entrega até ${t.deadline}</small></div></div><div class="driver-mini-route">${stops(t).map(s=>`<div class="${s.done?'done':''}"><i>${s.done?'✓':'•'}</i><span><small>${s.action}</small>${esc(s.place)}</span></div>`).join('')}</div><button class="btn primary wide driver-main-action" data-act="advance" data-id="${t.id}" ${c||!v.online?'disabled':''}>${t.state==='Aguardando confirmação'?'Aceitar tarefa · estou parado':t.state==='Confirmada'?'Confirmar coleta':t.routeScenario&&!t.viaPassed?'Confirmar passagem pelo acesso':'Confirmar entrega'} ${icon('check')}</button>${t.routeScenario?`<p class="accepted-change">Roteiro atualizado: ${esc(scenarios[t.routeScenario].reason)}</p>`:''}</section>`:`<section class="driver-next driver-empty">${icon('truck')}<h2>Nenhuma tarefa em aberto.</h2><p>Aguarde uma nova orientação da central.</p></section>`}<div class="driver-safety">${icon('alert')}<span>Não toque no dispositivo enquanto dirige. Confirme etapas somente com o veículo parado em local seguro e permitido.</span></div><details class="demo-controls"><summary>Controles da demonstração</summary><p>Simula a conexão deste dispositivo. Não altera a rede do computador.</p><button class="btn small" data-act="connection" data-id="${v.id}">${v.online?'Simular falta de conexão':'Restabelecer conexão'}</button></details><p class="driver-footnote">Áudio local nesta aba. Reprodução não comprova que o motorista ouviu. Funcionamento em segundo plano não garantido.</p></main></div>`;}

function voiceNotice(c){return `Mudança de roteiro. Siga pelo ${c.via}. Motivo: ${c.reason} A entrega continua em ${task(c.task).to}. Confirme apenas quando estiver parado em local seguro.`;}
let speechSequence=0;
function speak(message,id){if(!voiceEnabled)return;const sequence=++speechSequence;if(!('speechSynthesis'in window)){audioState='Voz indisponível neste navegador. Use o rádio.';return;}window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(message);utterance.lang='pt-BR';utterance.rate=.96;audioState='Reproduzindo orientação…';utterance.onend=()=>{if(sequence!==speechSequence)return;audioState='Aviso reproduzido · confirmação ainda necessária';const el=$('#audio-status');if(el)el.textContent=audioState;};utterance.onerror=()=>{if(sequence!==speechSequence)return;audioState='Não foi possível reproduzir. Use o rádio.';const el=$('#audio-status');if(el)el.textContent=audioState;};window.speechSynthesis.speak(utterance);spokenId=id;}
function deliverVoice(vId){const c=pending(vId),v=vehicle(vId);if(c&&v.online&&voiceEnabled&&spokenId!==c.id)speak(voiceNotice(c),c.id);}
function changePreview(t,s){return `<div class="change-compare"><div><small>ROTEIRO ANTERIOR</small><p>${esc(t.from)}</p><span>↓</span><p>${esc(t.to)}</p></div><div class="new-route"><small>NOVO TRAJETO</small><p>${esc(t.from)}</p><span>↓</span><b>${esc(s.via)}</b><span>↓</span><p>${esc(t.to)}</p></div></div><div class="reason-detail"><b>Motivo da mudança</b><p>${esc(s.reason)}</p><small>Impacto ilustrativo: ${s.impact} de deslocamento. Origem, carga e destino final preservados.</small></div><div class="audio-preview"><span>${icon('chat')}</span><div><b>O motorista vai ouvir</b><p>“Mudança de roteiro. Siga pelo ${esc(s.via)}. Motivo: ${esc(s.reason)} A entrega continua em ${esc(t.to)}. Confirme apenas quando estiver parado em local seguro.”</p></div></div>`;}
function changeDialog(id,scenario='bloqueio'){const v=vehicle(id),t=committed(id);if(!t)return toast('Programe uma tarefa antes de alterar o trajeto.');if(pending(id))return toast('Há uma mudança aguardando confirmação.');modal(`Alterar trajeto · ${id}`,`<form id="change-form" data-vehicle="${id}"><label>Ocorrência<select name="scenario" id="change-scenario">${Object.entries(scenarios).map(([k,s])=>`<option value="${k}" ${k===scenario?'selected':''}>${s.title}</option>`).join('')}</select></label>${changePreview(t,scenarios[scenario])}<p class="form-note">Cenário fictício para demonstração. O novo roteiro será marcado como confirmado após resposta do motorista ou registro pelo rádio.</p><button class="btn primary wide">Aprovar e enviar orientação ${icon('arrow')}</button></form>`);}
function showChange(id){const c=db.changes.find(c=>c.id===id),t=task(c.task);modal('Mudança de trajeto',`${label(c.status,c.status==='Pendente'?'amber':'green')}${changePreview(t,c)}<p class="form-note">${c.status==='Pendente'?'O motorista ainda não confirmou.':'Orientação confirmada. O roteiro ativo foi atualizado.'}</p>`,c.status==='Pendente'?`<button class="btn" data-act="cancel-change" data-id="${id}">Cancelar proposta</button><button class="btn primary" data-act="radio-change" data-id="${id}">Confirmar resposta pelo rádio</button>`:'<button class="btn" data-act="close">Fechar</button>');}
function acknowledge(c,channel){if(!c||c.status!=='Pendente')return toast('Esta mudança já foi tratada.');const t=task(c.task);if(t.state==='Entregue')return toast('A entrega já foi concluída.');c.status='Confirmada';c.confirmedBy=channel;t.routeScenario=c.scenario;t.viaPassed=false;log(`${c.vehicle} • trajeto alterado para ${c.via}. Motivo: ${c.reason} Confirmação por ${channel}.`,channel);$('#modal').close();render();toast('Orientação confirmada. Roteiro atualizado.');}
function advance(t,channel){if(!t||t.state==='Entregue')return toast('Tarefa já concluída.');if(pending(t.vehicle))return toast('Confirme a mudança de trajeto antes de atualizar a tarefa.');const v=vehicle(t.vehicle);if(!v.available&&t.state==='Confirmada')return toast('Veículo indisponível. Fale com a central.');if(t.state==='Em transporte'&&t.routeScenario&&!t.viaPassed){t.viaPassed=true;log(`${t.id} • passagem por ${scenarios[t.routeScenario].via} confirmada.`,channel);}else{t.state={'Aguardando confirmação':'Confirmada','Confirmada':'Em transporte','Em transporte':'Entregue'}[t.state]||t.state;log(`${t.id} • ${t.state.toLowerCase()} · ${v.driver}.`,channel);}render();toast('Etapa registrada.');}
function taskDetails(id){const t=task(id);modal(`${id} · ${esc(t.material)}`,`<div class="detail-route"><span>${esc(t.from)}</span>${icon('arrow')}<span>${esc(t.to)}</span></div><div class="facts"><div><span>Carga</span><b>${t.weight} kg</b></div><div><span>Prioridade</span><b>${t.priority}</b></div><div><span>Prazo</span><b>${t.deadline}</b></div><div><span>Situação</span><b>${status(t)}</b></div></div>${t.reason?`<p class="form-note">Observação: ${esc(t.reason)}</p>`:''}${t.state==='Fila'?`<div class="preparation-grid"><div><span class="step-label">01 · ORIGEM</span><h3>${t.cargo?'Carga liberada':'Carga em preparação'}</h3><button class="btn wide" data-act="cargo" data-id="${id}">${t.cargo?'Reabrir preparação':'Liberar carga'}</button></div><div><span class="step-label">02 · DESTINO</span><h3>${t.receive?'Recebimento livre':'Aguardando recebimento'}</h3><button class="btn wide" data-act="receive" data-id="${id}">${t.receive?'Bloquear recebimento':'Liberar destino'}</button></div></div>`:''}`,ready(t)?`<button class="btn primary" data-act="assign" data-id="${id}">Programar veículo ${icon('arrow')}</button>`:t.vehicle?`<button class="btn primary" data-act="locate" data-id="${t.vehicle}">Ver veículo na central ${icon('arrow')}</button>`:`<span class="form-note">Libere a carga e o destino para programar.</span>`);}
function assignDialog(id){const t=task(id);if(!ready(t))return toast('Libere carga e destino antes de programar.');modal('Programar atendimento',`<p class="form-note">${t.id} · ${esc(t.material)} · ${t.weight} kg</p><div class="detail-route">${esc(t.from)} ${icon('arrow')} ${esc(t.to)}</div>${db.vehicles.map(v=>{const allowed=v.available&&!committed(v.id)&&v.cap>=t.weight;return `<div class="assign-option"><span class="vehicle-avatar">${icon('truck')}</span><div><b>${v.id} · ${esc(v.name)}</b><p>${esc(v.driver)} · ${v.cap} kg</p><small>${!v.available?'Indisponível':committed(v.id)?'Já tem uma tarefa comprometida':v.cap<t.weight?'Capacidade insuficiente':'Disponível e compatível'}</small></div><button class="btn small ${allowed?'primary':''}" data-act="assign-confirm" data-id="${id}" data-v="${v.id}" ${allowed?'':'disabled'}>Programar</button></div>`}).join('')}`);}
function newRequest(){modal('Nova solicitação',`<form id="new-request" class="form-grid"><label class="full">Material<input name="material" placeholder="Ex.: Kit de rolamentos" required maxlength="70"></label><label>Origem<select name="from">${Object.keys(locations).map(s=>`<option>${s}</option>`).join('')}</select></label><label>Destino<select name="to">${['Oficina central','Manutenção B','Almoxarifado','Pátio de apoio'].map(s=>`<option>${s}</option>`).join('')}</select></label><label>Peso (kg)<input name="weight" type="number" min="1" max="20000" required value="100"></label><label>Prazo desejado<input name="deadline" type="time" value="11:00" required></label><label>Prioridade<select name="priority"><option>Normal</option><option>Alta</option><option>Urgente</option></select></label><label>Preparação<select name="cargo"><option value="false">Carga em preparação</option><option value="true">Carga liberada</option></select></label><label class="full">Motivo / observação<textarea name="reason" rows="2" maxlength="300" placeholder="Justifique uma prioridade alta ou urgente"></textarea></label><p class="form-note full">O destino precisará confirmar o recebimento antes da programação.</p><button class="btn primary full">Criar solicitação</button></form>`);}

document.addEventListener('click',e=>{
 const el=e.target.closest('[data-act],[data-view],[data-vehicle],[data-filter]');if(!el)return;
 if(el.dataset.view){$('#modal').close();go(el.dataset.view);return;}
 if(el.dataset.vehicle){selected=el.dataset.vehicle;render();return;}
 if(el.dataset.filter){filter=el.dataset.filter;render();return;}
 const a=el.dataset.act,id=el.dataset.id;
 if(a==='close')return $('#modal').close();
 if(a==='home'){e.preventDefault();return go('operation');}
 if(a==='menu')return $('.sidebar').classList.toggle('open');
 if(a==='logout'){++speechSequence;window.speechSynthesis?.cancel();voiceEnabled=false;user=null;sessionStorage.removeItem('transpologi-user');return render();}
 if(a==='driver'){driverVehicle=id||selected;deliverVoice(driverVehicle);return go('driver');}
 if(a==='locate'){$('#modal').close();selected=id;return go('operation');}
 if(a==='new')return newRequest();
 if(a==='detail')return taskDetails(id);
 if(a==='assign')return assignDialog(id);
 if(a==='assign-confirm'){const t=task(id),v=vehicle(el.dataset.v);if(!ready(t)||!v.available||committed(v.id)||t.weight>v.cap)return toast('As condições mudaram. Revise a disponibilidade.');t.vehicle=v.id;t.state='Aguardando confirmação';t.channel=v.channel;log(`${id} • atendimento programado para ${v.id}. Aguardando aceite do motorista.`);$('#modal').close();selected=v.id;go('operation');return toast('Tarefa programada. Aguarde a confirmação do motorista.');}
 if(a==='cargo'||a==='receive'){const t=task(id);if(t.state!=='Fila')return toast('Pedido já comprometido. Revise com o despachante.');t[a]=!t[a];log(`${id} • ${a==='cargo'?'preparação da carga':'disponibilidade do destino'} ${t[a]?'confirmada':'reaberta'}.`);render();return taskDetails(id);}
 if(a==='positions'){db.positionTick++;db.positionsAt=when();save();render();return toast('Posições fictícias atualizadas. Não são dados de GPS.');}
 if(a==='change')return changeDialog(id);
 if(a==='viewchange')return showChange(id);
 if(a==='cancel-change'){const c=db.changes.find(c=>c.id===id);if(c.status!=='Pendente')return toast('Esta mudança já foi tratada.');c.status='Cancelada';log(`${c.vehicle} • proposta de mudança cancelada. Mantido o roteiro anterior.`);$('#modal').close();render();return toast('Mudança cancelada.');}
 if(a==='radio-change'){const c=db.changes.find(c=>c.id===id);return modal('Confirmar orientação pelo rádio',`<p>Você recebeu de <b>${esc(vehicle(c.vehicle).driver)}</b> a confirmação para seguir pelo <b>${esc(c.via)}</b>?</p><p class="form-note">Registre apenas uma resposta efetivamente recebida. Ouvir o áudio não substitui esta confirmação.</p>`,`<button class="btn" data-act="close">Voltar</button><button class="btn primary" data-act="radio-ack" data-id="${id}">Sim, recebi a confirmação</button>`);}
 if(a==='radio-ack')return acknowledge(db.changes.find(c=>c.id===id),'Rádio');
 if(a==='ack'){const c=db.changes.find(c=>c.id===id);if(!vehicle(c.vehicle).online)return toast('Sem conexão. Confirme pelo rádio.');return acknowledge(c,'Motorista');}
 if(a==='voice'){if(!('speechSynthesis'in window))return toast('Este navegador não oferece voz. Use o rádio.');voiceEnabled=!voiceEnabled;if(voiceEnabled){const c=pending(driverVehicle);if(c&&vehicle(driverVehicle).online)speak(voiceNotice(c),c.id);else speak('Avisos por voz ativados. Interaja com o painel apenas quando estiver parado em local seguro.','activation');}else{++speechSequence;window.speechSynthesis.cancel();audioState='Avisos por voz desativados.';}return render();}
 if(a==='repeat'){const c=db.changes.find(c=>c.id===id);if(!vehicle(c.vehicle).online)return toast('Dispositivo sem conexão. Use o rádio.');if(!('speechSynthesis'in window))return toast('Voz indisponível neste navegador.');voiceEnabled=true;speak(voiceNotice(c),c.id);return render();}
 if(a==='connection'){const v=vehicle(id);v.online=!v.online;save();if(v.online)deliverVoice(id);else{++speechSequence;window.speechSynthesis?.cancel();audioState='Sem conexão. Use o rádio para receber novas orientações.';}render();return toast(v.online?'Conexão simulada restabelecida.':'Dispositivo em modo sem conexão.');}
 if(a==='advance'){const t=task(id);if(!vehicle(t.vehicle).online)return toast('Sem conexão. Atualize pelo rádio.');return advance(t,'Motorista');}
 if(a==='radio'){const t=task(id);if(pending(t.vehicle))return showChange(pending(t.vehicle).id);const next=t.state==='Aguardando confirmação'?'Aceite da tarefa':t.state==='Confirmada'?'Coleta realizada':t.routeScenario&&!t.viaPassed?'Passagem pelo acesso indicada':'Entrega realizada';return modal('Registrar resposta pelo rádio',`<p><b>${id} · ${esc(vehicle(t.vehicle).driver)}</b></p><p class="form-note">Próxima etapa: ${next}. Registre somente após receber a informação.</p>`,`<button class="btn" data-act="close">Voltar</button><button class="btn primary" data-act="radio-step" data-id="${id}">Confirmar registro</button>`);}
 if(a==='radio-step'){$('#modal').close();return advance(task(id),'Rádio');}
 if(a==='vehicle'){const v=vehicle(id);return modal(`Gerenciar veículo ${id}`,`<form id="vehicle-form" data-id="${id}"><label>Motorista<input name="driver" value="${esc(v.driver)}" required maxlength="60"></label><label>Disponibilidade<select name="available"><option value="true" ${v.available?'selected':''}>Disponível para operação</option><option value="false" ${!v.available?'selected':''}>Indisponível</option></select></label><label>Canal preferencial<select name="channel"><option ${v.channel==='Painel do motorista'?'selected':''}>Painel do motorista</option><option ${v.channel==='Rádio'?'selected':''}>Rádio</option></select></label><p class="form-note">Indisponibilizar o veículo não remove cargas ou compromissos existentes.</p><button class="btn primary wide">Salvar alterações</button></form>`);}
 if(a==='account')return modal('Preferências da demonstração',`<form id="prefs"><label>Unidade<input name="unit" value="${esc(db.unit||'Unidade Pecém')}" maxlength="50" required></label><label>Turno<select name="shift">${['Turno A · 06h às 14h','Turno B · 14h às 22h','Turno C · 22h às 06h'].map(s=>`<option ${db.shift===s?'selected':''}>${s}</option>`).join('')}</select></label><button class="btn primary wide">Salvar preferências</button></form><hr><p class="form-note">Perfil: ${esc(user.role)} · ${esc(user.email)}. Autenticação simulada.</p><button class="text-btn" data-act="reset">Restaurar cenário inicial</button>`);
 if(a==='reset')return modal('Restaurar demonstração','Os dados locais serão substituídos pelos pedidos e veículos do cenário inicial.',`<button class="btn" data-act="close">Cancelar</button><button class="btn primary" data-act="reset-confirm">Restaurar cenário</button>`);
 if(a==='reset-confirm'){db=seed();db.changes=[];db.positionTick=0;db.vehicles.forEach(v=>v.online=true);save();$('#modal').close();selected='V01';go('operation');return toast('Demonstração restaurada.');}
 if(a==='export'){const quote=s=>'"'+String(s).replace(/"/g,'""')+'"';const csv='\uFEFFHorário;Evento;Canal\n'+db.events.map(e=>[e.time,e.text,e.channel].map(quote).join(';')).join('\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='transpologi-eventos.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1500);return toast('Arquivo exportado.');}
});
document.addEventListener('keydown',e=>{const el=e.target.closest('[data-vehicle]');if(el&&el.tagName.toLowerCase()==='g'&&(e.key==='Enter'||e.key===' ')){e.preventDefault();selected=el.dataset.vehicle;render();}});
document.addEventListener('change',e=>{if(e.target.id==='driver-select'){driverVehicle=e.target.value;deliverVoice(driverVehicle);render();}if(e.target.id==='change-scenario')changeDialog($('#change-form').dataset.vehicle,e.target.value);});
document.addEventListener('input',e=>{if(e.target.id==='search'){const cursor=e.target.selectionStart;search=e.target.value;render();$('#search').focus();$('#search').setSelectionRange(cursor,cursor);}});
document.addEventListener('submit',e=>{e.preventDefault();const f=e.target,d=Object.fromEntries(new FormData(f));
 if(f.id==='login'){user={email:d.email,role:d.role};sessionStorage.setItem('transpologi-user',JSON.stringify(user));go(d.role==='Motorista'?'driver':d.role==='Área solicitante'?'requests':'operation');return;}
 if(f.id==='change-form'){const id=f.dataset.vehicle,t=committed(id);if(!t||pending(id))return toast('Revise a tarefa e as mudanças pendentes.');const s=scenarios[d.scenario];const c={...s,scenario:d.scenario,id:'MC-'+Date.now(),vehicle:id,task:t.id,status:'Pendente',at:when()};db.changes.unshift(c);log(`${id} • mudança proposta: ${s.via}. Motivo: ${s.reason} Aguardando confirmação.`);$('#modal').close();driverVehicle=id;deliverVoice(id);render();return toast(vehicle(id).online?'Orientação disponível no painel do motorista.':'Sem conexão: contate o motorista pelo rádio.');}
 if(f.id==='new-request'){if(d.from===d.to)return toast('Origem e destino devem ser diferentes.');if(d.priority!=='Normal'&&!d.reason.trim())return toast('Justifique a prioridade do pedido.');const id='TR-'+(Math.max(...db.tasks.map(t=>+t.id.split('-')[1]))+1);db.tasks.unshift({...d,id,weight:+d.weight,cargo:d.cargo==='true',receive:false,state:'Fila',vehicle:null});log(`${id} • solicitação criada.`,'Solicitante');$('#modal').close();filter='Todos';search='';go('requests');return toast('Pedido criado. Confirme a preparação para programar.');}
 if(f.id==='vehicle-form'){const v=vehicle(f.dataset.id);v.driver=d.driver;v.available=d.available==='true';v.channel=d.channel;log(`${v.id} • cadastro atualizado.`);$('#modal').close();render();return toast('Veículo atualizado.');}
 if(f.id==='prefs'){db.unit=d.unit;db.shift=d.shift;save();$('#modal').close();render();return toast('Preferências salvas.');}
});
$('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){const r=$('#modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#modal').close();}});
save();render();
