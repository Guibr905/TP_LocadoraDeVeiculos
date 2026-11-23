const API = '';
const entityConfig = {
  fabricantes: {
    title: 'Fabricantes', desc: 'Cadastre e mantenha as marcas que compõem a frota.', singular: 'Fabricante', endpoint: '/api/fabricantes',
    fields: [['nome', 'Nome', 'text', true], ['paisOrigem', 'País de origem', 'text', false], ['anoFundacao', 'Ano de fundação', 'number', true]],
    filters: [['nome', 'Nome'], ['paisOrigem', 'País de origem'], ['anoFundacao', 'Ano de fundação']],
    columns: [['nome', 'Fabricante'], ['paisOrigem', 'País de origem'], ['anoFundacao', 'Fundação']], search: ['nome', 'paisOrigem', 'anoFundacao']
  },
  categorias: {
    title: 'Categorias', desc: 'Organize os veículos por tipo e valor de diária.', singular: 'Categoria', endpoint: '/api/categorias',
    fields: [['nome', 'Nome', 'text', true], ['descricao', 'Descrição', 'text', false], ['valorDiariaBase', 'Valor da diária base', 'number', true, '0.01']],
    filters: [['nome', 'Nome'], ['descricao', 'Descrição'], ['valorDiariaBase', 'Diária base (máx.)', 'number']],
    columns: [['nome', 'Categoria'], ['descricao', 'Descrição'], ['valorDiariaBase', 'Diária base', 'currency']], search: ['nome', 'descricao', 'valorDiariaBase']
  },
  veiculos: {
    title: 'Veículos', desc: 'Controle os veículos, seus dados e vínculos com fabricantes e categorias.', singular: 'Veículo', endpoint: '/api/veiculos',
    fields: [['modelo', 'Modelo', 'text', true], ['anoFabricacao', 'Ano de fabricação', 'number', true], ['quilometragem', 'Quilometragem', 'number', true], ['placa', 'Placa', 'text', true], ['fabricanteId', 'Fabricante', 'select-fabricante', true], ['categoriaId', 'Categoria', 'select-categoria', true]],
    filters: [['modelo', 'Modelo'], ['placa', 'Placa'], ['fabricanteId', 'Fabricante', 'select-fabricante'], ['categoriaId', 'Categoria', 'select-categoria'], ['anoFabricacao', 'Ano (máx.)', 'number']],
    columns: [['modelo', 'Veículo'], ['placa', 'Placa'], ['anoFabricacao', 'Ano'], ['fabricante.nome', 'Fabricante'], ['categoria.nome', 'Categoria'], ['quilometragem', 'Quilometragem', 'km']], search: ['modelo', 'placa', 'anoFabricacao', 'quilometragem', 'fabricante.nome', 'categoria.nome']
  },
  clientes: {
    title: 'Clientes', desc: 'Gerencie os dados cadastrais e os contatos dos clientes.', singular: 'Cliente', endpoint: '/api/clientes',
    fields: [['nome', 'Nome completo', 'text', true], ['cpf', 'CPF', 'text', true], ['email', 'E-mail', 'email', true], ['telefone', 'Telefone', 'tel', false]],
    filters: [['nome', 'Nome'], ['cpf', 'CPF'], ['email', 'E-mail'], ['telefone', 'Telefone']],
    columns: [['nome', 'Cliente'], ['cpf', 'CPF'], ['email', 'E-mail'], ['telefone', 'Telefone'], ['dataCadastro', 'Cadastro', 'date']], search: ['nome', 'cpf', 'email', 'telefone']
  },
  alugueis: {
    title: 'Aluguéis', desc: 'Acompanhe contratos, períodos de locação e devoluções.', singular: 'Aluguel', endpoint: '/api/alugueis',
    fields: [['clienteId', 'Cliente', 'select-cliente', true], ['veiculoId', 'Veículo', 'select-veiculo', true], ['dataRetirada', 'Data e hora da retirada', 'datetime-local', true], ['dataDevolucaoPrevista', 'Devolução prevista', 'datetime-local', true], ['valorDiaria', 'Valor da diária (R$)', 'number', true, '0.01'], ['quilometragemInicial', 'Quilometragem inicial', 'number', false], ['quilometragemFinal', 'Quilometragem final', 'number', false], ['dataDevolucaoReal', 'Devolução realizada', 'datetime-local', false], ['valorTotal', 'Valor total (R$)', 'number', false, '0.01']],
    filters: [['cliente.nome', 'Cliente'], ['veiculo.modelo', 'Veículo'], ['veiculo.placa', 'Placa'], ['dataRetirada', 'Retirada a partir de', 'date'], ['dataDevolucaoPrevista', 'Devolução até', 'date'], ['situacao', 'Situação', 'select-status']],
    columns: [['id', '#'], ['cliente.nome', 'Cliente'], ['veiculo.modelo', 'Veículo'], ['dataRetirada', 'Retirada', 'date'], ['dataDevolucaoPrevista', 'Devolução prevista', 'date'], ['valorTotal', 'Valor total', 'currency'], ['dataDevolucaoReal', 'Situação', 'rental-status']], search: ['cliente.nome', 'cliente.cpf', 'veiculo.modelo', 'veiculo.placa', 'dataRetirada', 'dataDevolucaoPrevista', 'valorTotal']
  }
};
let currentEntity = 'veiculos', currentRows = [], editingId = null, returnRentalId = null, cache = {};
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const money = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dateFmt = v => v ? new Date(v).toLocaleDateString('pt-BR') : '—';
const dateTimeLocal = v => { if (!v) return ''; const d = new Date(v); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16) };
const get = (obj, path) => path.split('.').reduce((o, k) => o == null ? undefined : o[k], obj);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function toast(msg, error = false) { const el = $('#toast'); el.textContent = msg; el.className = 'toast show' + (error ? ' error' : ''); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.className = 'toast', 3800) }
async function api(path, options = {}) { const res = await fetch(API + path, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } }); let body = null; const txt = await res.text(); if (txt) { try { body = JSON.parse(txt) } catch { body = txt } } if (!res.ok) { let msg = body?.msg || body?.title || body?.detail || (typeof body === 'string' ? body : ''); if (body?.errors) msg = Object.values(body.errors).flat().join(' '); throw new Error(msg || `Erro HTTP ${res.status}`) } return body }

function setPage(page) {

  $$('.page').forEach(p => p.classList.remove('active'));


  const target = entityConfig[page]
    ? $('#page-entity')
    : $('#page-' + page);


  if (target) {
    target.classList.add('active');
  }


  $$('.nav-link').forEach(b => {
    b.classList.toggle('active', b.dataset.page === page);
  });


  $('#crumb').textContent =
    page === 'inicio'
      ? 'Visão geral'
      : page === 'consultas'
        ? 'Consultas e relatórios'
        : entityConfig[page]?.title || 'Visão geral';

  $('#sidebar').classList.remove('open');


  if (entityConfig[page]) {
    loadEntity(page);
  }

  if (page === 'inicio') {
    loadDashboard();
  }

  if (page === 'consultas') {
    loadQueryOptions();
  }
}

async function loadEntity(name) { currentEntity = name; const c = entityConfig[name]; $('#entity-eyebrow').textContent = name === 'alugueis' ? 'OPERAÇÃO' : 'CADASTROS'; $('#entity-title').textContent = c.title; $('#entity-description').textContent = c.desc; $('#table-title').textContent = 'Todos os ' + c.title.toLowerCase(); $('#add-record').textContent = '＋ Novo ' + c.singular.toLowerCase(); renderFilters(c); $('#entity-table').innerHTML = '<div class="loading">Carregando registros...</div>'; try { currentRows = await api(c.endpoint) || []; cache[name] = currentRows; applyFilters() } catch (e) { $('#entity-table').innerHTML = `<div class="empty-state">Não foi possível carregar os dados. ${esc(e.message)}</div>`; $('#result-count').textContent = 'Falha ao consultar a API'; toast(e.message, true) } }
function renderFilters(c) { $('#filter-fields').innerHTML = c.filters.map(([key, label, type]) => { let control = ''; if (type === 'select-fabricante' || type === 'select-categoria') control = `<select data-filter="${key}"><option value="">Todos</option></select>`; else if (type === 'select-status') control = `<select data-filter="${key}"><option value="">Todas</option><option value="active">Em andamento</option><option value="closed">Devolvidos</option></select>`; else control = `<input data-filter="${key}" type="${type === 'number' ? 'number' : type === 'date' ? 'date' : 'search'}" placeholder="${type === 'number' ? 'Até...' : 'Pesquisar...'}">`; return `<div class="filter-field"><label>${label}</label>${control}</div>` }).join(''); populateFilterSelects() }
async function populateFilterSelects() { const fab = await safeList('fabricantes'), cat = await safeList('categorias'); $$('[data-filter="fabricanteId"]').forEach(s => s.innerHTML = '<option value="">Todos</option>' + fab.map(x => `<option value="${x.id}">${esc(x.nome)}</option>`).join('')); $$('[data-filter="categoriaId"]').forEach(s => s.innerHTML = '<option value="">Todas</option>' + cat.map(x => `<option value="${x.id}">${esc(x.nome)}</option>`).join('')) }
async function safeList(n) { if (cache[n]) return cache[n]; try { cache[n] = await api(entityConfig[n].endpoint) || []; return cache[n] } catch { return [] } }
function applyFilters() { const c = entityConfig[currentEntity]; let rows = [...currentRows]; $$('[data-filter]').forEach(el => { const key = el.dataset.filter, val = el.value.trim().toLocaleLowerCase('pt-BR'); if (!val) return; rows = rows.filter(row => { if (key === 'situacao') return val === 'active' ? !row.dataDevolucaoReal : !!row.dataDevolucaoReal; const raw = get(row, key); if (raw == null) return false; if (el.type === 'number') return Number(raw) <= Number(val); if (el.type === 'date') { const d = new Date(raw).toISOString().slice(0, 10); return key === 'dataRetirada' ? d >= val : d <= val } if (key === 'fabricanteId' || key === 'categoriaId') return String(raw) === val; return String(raw).toLocaleLowerCase('pt-BR').includes(val) }) }); renderTable(rows, c); $('#result-count').textContent = `${rows.length} registro(s) encontrado(s) de ${currentRows.length}` }
function renderTable(rows, c) { if (!rows.length) { $('#entity-table').innerHTML = '<div class="empty-state">Nenhum registro encontrado com os filtros informados.</div>'; return } const headers = c.columns.map(col => `<th>${col[1]}</th>`).join(''); const body = rows.map(r => `<tr>${c.columns.map(([key, label, format]) => `<td class="${key === c.columns[0][0] ? 'primary-cell' : ''}">${cellValue(r, key, format)}</td>`).join('')}<td><div class="actions-cell">${currentEntity === 'alugueis' && !r.dataDevolucaoReal ? `<button class="mini-btn" data-return="${r.id}">Devolver</button>` : ''}<button class="mini-btn" data-edit="${r.id}">Editar</button><button class="mini-btn danger" data-delete="${r.id}">Excluir</button></div></td></tr>`).join(''); $('#entity-table').innerHTML = `<table class="data-table"><thead><tr>${headers}<th>Ações</th></tr></thead><tbody>${body}</tbody></table>` }
function cellValue(r, key, format) { let v = get(r, key); if (format === 'currency') return `<b>${money(v)}</b>`; if (format === 'km') return `${Number(v || 0).toLocaleString('pt-BR')} km`; if (format === 'date') return dateFmt(v); if (format === 'rental-status') return r.dataDevolucaoReal ? '<span class="status closed">Devolvido</span>' : '<span class="status active">Em andamento</span>'; if (key === 'dataDevolucaoReal') return v ? dateFmt(v) : '<span class="status active">Em andamento</span>'; if (key === 'id') return `#${esc(v)}`; return esc(v ?? '—') }
function formField([key, label, type, required, step], row = {}) { let val = row[key] ?? ''; if (type === 'datetime-local') val = dateTimeLocal(val); let html = ''; if (type.startsWith('select-')) { const opts = type === 'select-fabricante' ? cache.fabricantes || [] : type === 'select-categoria' ? cache.categorias || [] : type === 'select-cliente' ? cache.clientes || [] : cache.veiculos || []; const name = x => type === 'select-fabricante' || type === 'select-categoria' || type === 'select-cliente' ? x.nome : `${x.modelo} • ${x.placa}`; html = `<select name="${key}" ${required ? 'required' : ''}><option value="">Selecione...</option>${opts.map(x => `<option value="${x.id}" ${String(val) === String(x.id) ? 'selected' : ''}>${esc(name(x))}</option>`).join('')}</select>` } else html = `<input name="${key}" type="${type}" value="${esc(val)}" ${required ? 'required' : ''} ${step ? `step="${step}"` : ''} ${type === 'number' ? 'min="0"' : ''} ${key === 'anoFundacao' ? 'min="1000" max="2100"' : ''}>`; return `<div class="form-field ${type === 'text' && key === 'descricao' ? 'full' : ''}"><label>${label}${required ? ' *' : ''}</label>${html}</div>` }
async function openForm(id = null) { editingId = id; const c = entityConfig[currentEntity]; await Promise.all(['fabricantes', 'categorias', 'clientes', 'veiculos'].map(n => safeList(n))); let row = id ? currentRows.find(x => x.id === id) : {}; if (id && !row) { row = await api(`${c.endpoint}/${id}`) } $('#modal-title').textContent = (id ? 'Editar ' : 'Novo ') + c.singular.toLowerCase(); $('#form-submit').textContent = id ? 'Salvar alterações' : 'Salvar registro'; $('#form-error').textContent = ''; $('#form-fields').innerHTML = c.fields.map(f => formField(f, row || {})).join(''); $('#modal-backdrop').classList.add('open') }
function closeForm() { $('#modal-backdrop').classList.remove('open'); editingId = null }
function buildPayload(form) { const data = {}; for (const [k, v] of new FormData(form).entries()) { const def = entityConfig[currentEntity].fields.find(f => f[0] === k); const type = def?.[2]; data[k] = type === 'number' || type?.startsWith('select-') ? (v === '' ? null : Number(v)) : type === 'datetime-local' ? (v ? new Date(v).toISOString() : null) : v } if (currentEntity === 'alugueis') { if (!editingId) { delete data.quilometragemInicial; delete data.quilometragemFinal; delete data.dataDevolucaoReal; delete data.valorTotal } else { const old = currentRows.find(x => x.id === editingId) || {}; data.quilometragemInicial = data.quilometragemInicial ?? old.quilometragemInicial ?? 0; data.quilometragemFinal = data.quilometragemFinal ?? old.quilometragemFinal ?? null; data.dataDevolucaoReal = data.dataDevolucaoReal ?? old.dataDevolucaoReal ?? null; data.valorTotal = data.valorTotal ?? old.valorTotal ?? 0 } } if (currentEntity === 'clientes' && !editingId) data.dataCadastro = new Date().toISOString(); if (editingId) data.id = editingId; return data }
async function submitForm(ev) { ev.preventDefault(); $('#form-error').textContent = ''; const c = entityConfig[currentEntity], wasEditing = editingId !== null, payload = buildPayload(ev.target); try { await api(editingId ? `${c.endpoint}/${editingId}` : c.endpoint, { method: editingId ? 'PUT' : 'POST', body: JSON.stringify(payload) }); closeForm(); toast(`${c.singular} ${wasEditing ? 'atualizado' : 'cadastrado'} com sucesso.`); cache = {}; await loadEntity(currentEntity); if (currentEntity === 'inicio') loadDashboard() } catch (e) { $('#form-error').textContent = e.message } }
async function deleteRecord(id) { const row = currentRows.find(x => x.id === id); if (!confirm(`Deseja realmente excluir este registro${row?.nome ? ' (' + row.nome + ')' : ''}?`)) return; try { await api(`${entityConfig[currentEntity].endpoint}/${id}`, { method: 'DELETE' }); toast('Registro excluído com sucesso.'); cache = {}; await loadEntity(currentEntity) } catch (e) { toast(e.message, true) } }
function openReturn(id) { returnRentalId = id; $('#km-final').value = ''; $('#return-error').textContent = ''; $('#return-backdrop').classList.add('open') }
async function submitReturn(e) { e.preventDefault(); $('#return-error').textContent = ''; try { await api(`/api/alugueis/${returnRentalId}/devolver`, { method: 'PATCH', body: JSON.stringify({ quilometragemFinal: Number($('#km-final').value) }) }); $('#return-backdrop').classList.remove('open'); toast('Devolução registrada com sucesso.'); cache = {}; await loadEntity('alugueis'); loadDashboard() } catch (err) { $('#return-error').textContent = err.message } }
async function loadDashboard() { try { const [v, c, a] = await Promise.all([api('/api/veiculos'), api('/api/clientes'), api('/api/alugueis')]); $('#stat-veiculos').textContent = v.length; $('#stat-clientes').textContent = c.length; const active = a.filter(x => !x.dataDevolucaoReal); $('#stat-ativos').textContent = active.length; $('#stat-receita').textContent = money(a.reduce((s, x) => s + Number(x.valorTotal || 0), 0)); $('#fleet-total').textContent = v.length; $('#fleet-active').textContent = active.length; $('#fleet-free').textContent = Math.max(v.length - active.length, 0); $('#fleet-active-bar').style.width = (v.length ? Math.min(100, active.length / v.length * 100) : 0) + '%'; const recent = [...a].sort((x, y) => new Date(y.dataRetirada) - new Date(x.dataRetirada)).slice(0, 5); $('#recent-rentals').innerHTML = recent.length ? `<table class="data-table"><thead><tr><th>Cliente</th><th>Veículo</th><th>Período</th><th>Situação</th></tr></thead><tbody>${recent.map(x => `<tr><td class="primary-cell">${esc(x.cliente?.nome || '—')}</td><td>${esc(x.veiculo?.modelo || '—')}<span class="sub-cell">${esc(x.veiculo?.placa || '')}</span></td><td>${dateFmt(x.dataRetirada)} – ${dateFmt(x.dataDevolucaoPrevista)}</td><td>${x.dataDevolucaoReal ? '<span class="status closed">Devolvido</span>' : '<span class="status active">Em andamento</span>'}</td></tr>`).join('')}</tbody></table>` : '<div class="empty-state">Ainda não há aluguéis cadastrados.</div>'; $('#api-status').textContent = 'Conectada'; } catch (e) { $('#api-status').textContent = 'Sem conexão'; $('#recent-rentals').innerHTML = `<div class="empty-state">Não foi possível consultar a API: ${esc(e.message)}</div>`;['veiculos', 'clientes', 'ativos'].forEach(x => $('#stat-' + x).textContent = '—'); toast('Não foi possível carregar o painel. Verifique a API.', true) } }
async function loadQueryOptions() { const [f, c] = await Promise.all([safeList('fabricantes'), safeList('categorias')]); $('#q-fabricante').innerHTML = '<option value="">Selecione um fabricante</option>' + f.map(x => `<option value="${esc(x.nome)}">${esc(x.nome)}</option>`).join(''); $('#q-categoria').innerHTML = '<option value="">Selecione uma categoria</option>' + c.map(x => `<option value="${x.id}">${esc(x.nome)}</option>`).join('') }
function renderReport(id, rows) { const el = $('#result-' + id); if (!rows || !rows.length) { el.innerHTML = '<div class="empty-state">Nenhum resultado encontrado.</div>'; return } const cols = Object.keys(rows[0]); el.innerHTML = `<table class="result-table"><thead><tr>${cols.map(k => `<th>${esc(k)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${cols.map(k => `<td>${esc(typeof r[k] === 'number' && k.toLowerCase().includes('valor') ? money(r[k]) : r[k] ?? '—')}</td>`).join('')}</tr>`).join('')}</tbody></table>` }
async function runQuery(type) { const routes = { 'veiculos-fabricante': () => { const v = $('#q-fabricante').value; if (!v) throw Error('Selecione um fabricante.'); return ['/api/filtros/veiculos-por-fabricante/' + encodeURIComponent(v), 'veiculos-fabricante'] }, 'alugueis-cliente': () => { const v = $('#q-cpf').value.trim(); if (!v) throw Error('Informe o CPF do cliente.'); return ['/api/filtros/alugueis-por-cliente/' + encodeURIComponent(v), 'alugueis-cliente'] }, 'fabricantes-veiculos': () => ['/api/filtros/fabricantes-com-veiculos', 'fabricantes-veiculos'], 'clientes-totais': () => ['/api/filtros/clientes-com-total-alugueis', 'clientes-totais'], 'alugueis-categoria': () => { const v = $('#q-categoria').value; if (!v) throw Error('Selecione uma categoria.'); return ['/api/filtros/alugueis-por-categoria/' + v, 'alugueis-categoria'] } }; try { const [url, id] = routes[type](); const el = $('#result-' + id); el.innerHTML = '<div class="loading">Consultando API...</div>'; const data = await api(url); renderReport(id, data) } catch (e) { toast(e.message, true) } }

document.addEventListener('click', e => { const nav = e.target.closest('[data-page]'); if (nav) { setPage(nav.dataset.page); return } const q = e.target.closest('[data-query]'); if (q) { runQuery(q.dataset.query); return } const edit = e.target.closest('[data-edit]'); if (edit) { openForm(Number(edit.dataset.edit)); return } const del = e.target.closest('[data-delete]'); if (del) { deleteRecord(Number(del.dataset.delete)); return } const ret = e.target.closest('[data-return]'); if (ret) { openReturn(Number(ret.dataset.return)); return } if (e.target.closest('[data-action="quick-rental"]')) { setPage('alugueis'); setTimeout(() => openForm(), 80) } });
$('#add-record').addEventListener('click', () => openForm()); $('#refresh-records').addEventListener('click', () => loadEntity(currentEntity)); $('#clear-filters').addEventListener('click', () => { $$('[data-filter]').forEach(x => x.value = ''); applyFilters() }); $('#filter-fields').addEventListener('input', applyFilters); $('#filter-fields').addEventListener('change', applyFilters);
$('#record-form').addEventListener('submit', submitForm); $('#modal-close').addEventListener('click', closeForm); $('#modal-cancel').addEventListener('click', closeForm); $('#modal-backdrop').addEventListener('click', e => { if (e.target.id === 'modal-backdrop') closeForm() }); $('#return-form').addEventListener('submit', submitReturn); $('#return-close').addEventListener('click', () => $('#return-backdrop').classList.remove('open')); $('#return-cancel').addEventListener('click', () => $('#return-backdrop').classList.remove('open')); $('#mobile-menu').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
$('#today').textContent = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());
(async () => { try { await api('/api/fabricantes'); $('#api-status').textContent = 'Conectada' } catch { $('#api-status').textContent = 'Sem conexão' } loadDashboard() })();
