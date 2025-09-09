import React, { useMemo, useState } from "react";
import { FloatingPortal, useFloating, autoUpdate, offset, flip, shift, size } from "@floating-ui/react";

/**
 * Producción Libros - MVP UI (JS limpio)
 * - Sin TypeScript en JSX para evitar errores de parser en la sandbox.
 * - Tabs: Control general / Configuracion (Maquinas, Tareas, Personal).
 */

// ===================== Iconos =====================
const ico = (p={}) => ({ width: 18, height: 18, stroke: 'currentColor', fill: 'none', strokeWidth: 2, ...p });
const IconCog = (p={}) => (<svg viewBox="0 0 24 24" {...ico(p)}><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="m19.4 15-.9 1.6-2-.3-1.1 1.7-1.9-1-1.9 1-1.1-1.7-2 .3-.9-1.6 1.6-1.2-.2-2 1.8-.8.8-1.8h2l.8 1.8 1.8.8-.2 2 1.6 1.2Z"/></svg>);
const IconPencil = (p={})=>(<svg viewBox="0 0 24 24" {...ico(p)}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>);
const IconUpload = (p={})=>(<svg viewBox="0 0 24 24" {...ico(p)}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5-5 5 5"/><path d="M12 5v12"/></svg>);
const IconTrash = (p={})=>(<svg viewBox="0 0 24 24" {...ico(p)}><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>);
const IconList = (p={})=>(<svg viewBox="0 0 24 24" {...ico(p)}><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/></svg>);
const IconRevert = (p={})=> (
  <svg viewBox="0 0 24 24" {...ico(p)}>
    <path d="M21 12a9 9 0 1 1-3-6"/>
    <path d="M21 3v6h-6"/>
  </svg>
);
const IconFactory = (p={})=>(<svg viewBox="0 0 24 24" {...ico(p)}><rect x="3" y="10" width="18" height="10"/><path d="M7 10V7l3 3M12 10V7l3 3"/></svg>);

// ===================== Helpers UI =====================
const Section = ({ title, icon, right, children }) => (
  <section className="bg-white/80 backdrop-blur border border-slate-200 rounded-xl">
    <header className="flex items-center justify-between px-4 py-2 border-b border-slate-200">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><span className="text-slate-500">{icon}</span>{title}</div>
      {right}
    </header>
    <div className="p-3">{children}</div>
  </section>
);
const Badge = ({ children, tone = "slate" }) => {
  const map = { slate:"bg-slate-100 text-slate-700", green:"bg-green-100 text-green-700", amber:"bg-amber-100 text-amber-700", red:"bg-red-100 text-red-700" };
  return <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${map[tone]}`}>{children}</span>;
};

// ===================== Control General (placeholder) =====================
function ControlGeneral(){
  return (
    <div className="grid grid-cols-[420px_1fr] gap-4">
      <Section title="Sin asignar (por pedido)" icon={<IconList/>}>
        <div className="text-xs text-slate-600">Acá va el listado de pedidos con actividades. (Lo retomamos luego.)</div>
      </Section>
      <Section title="Agenda por horas (vertical)" icon={<IconFactory/>} right={<div className="text-xs text-slate-500">07:00-19:00 &middot; bloques 30'</div>}>
        <div className="text-xs text-slate-600">Tablero por columnas (máquinas) y filas de tiempo.</div>
      </Section>
    </div>
  );
}

// ===================== MultiSelect con chips (Floating UI) =====================
function MultiSelectSearch({anchorId, options, selected, onChange}){
  const [open,setOpen]=useState(false);
  const [q,setQ]=useState('');
  const {refs, floatingStyles} = useFloating({
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange:setOpen,
    middleware:[offset(6), flip({padding:8}), shift({padding:8}), size({apply({rects, elements}){ Object.assign(elements.floating.style, { width: `${rects.reference.width}px` }); }})]
  });
  const items = options.filter(o=> o.label.toLowerCase().includes(q.toLowerCase()));
  const labelOf = id=> options.find(o=>o.id===id)?.label || id;
  return (
    <div className="w-full">
      <div id={anchorId} ref={refs.setReference} role="button" tabIndex={0} onClick={()=>{ setOpen(v=>!v); }} className="min-h-[36px] w-full border rounded px-2 py-1 text-sm bg-white flex items-center gap-1 flex-wrap cursor-pointer">
        {selected.length===0 && <span className="text-slate-500">Elegir…</span>}
        {selected.map(id=> (
          <span key={id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 border">
            <span className="truncate max-w-[160px]">{labelOf(id)}</span>
            <button className="text-slate-500 hover:text-slate-700" onClick={e=>{ e.stopPropagation(); onChange(selected.filter(x=>x!==id)); }}>✕</button>
          </span>
        ))}
      </div>
      {open && (
        <FloatingPortal>
          <div className="fixed inset-0 z-[999]" onClick={()=>setOpen(false)} />
          <div ref={refs.setFloating} style={floatingStyles} className="z-[1000]">
            <div className="bg-white border rounded shadow-lg max-h-80 overflow-auto w-full">
              <div className="sticky top-0 bg-white border-b p-1">
                <input placeholder="Buscar..." className="w-full border rounded px-2 py-1 text-sm" value={q} onChange={e=>setQ(e.target.value)} />
              </div>
              <div className="p-1">
                {items.map(o=>{ const isSel=selected.includes(o.id); return (
                  <button key={o.id} className={`w-full text-left px-2 py-1 text-sm rounded flex items-center justify-between hover:bg-slate-50 ${isSel?'bg-slate-100':''}`} onClick={()=>{ const next=isSel? selected.filter(x=>x!==o.id):[...selected,o.id]; onChange(next); }}>
                    <span className="truncate">{o.label}</span>{isSel && <span>✓</span>}
                  </button>
                );})}
                {items.length===0 && <div className="text-xs text-slate-500 px-2 py-2">Sin resultados</div>}
              </div>
              <div className="p-1 border-t flex items-center gap-2"><button className="flex-1 text-xs border rounded px-2 py-1" onClick={()=>setOpen(false)}>Cerrar</button></div>
            </div>
          </div>
        </FloatingPortal>
      )}
    </div>
  );
}

// ===================== Configuracion =====================
const PRODUCTS = [ {id:'libros', label:'Libros'}, {id:'revistas', label:'Revistas'}, {id:'catalogos', label:'Catalogos'} ];

function Configuracion(){
  const [cfg, setCfg] = useState({
    machines: [
      { id:'ricoh-8400', nombre:'Ricoh 8400 (ByN)', setupMin:3, teardownMin:0, prodMode:'por-formato', formatos:[{id:'f2332',nombre:'23x32',cpm:95},{id:'f2535',nombre:'25x35',cpm:82}], tareas:['imprimir-interior'] },
      { id:'ricoh-8300', nombre:'Ricoh 8300 (ByN)', setupMin:3, teardownMin:0, prodMode:'por-formato', formatos:[{id:'f2332b',nombre:'23x32',cpm:75},{id:'f2535b',nombre:'25x35',cpm:65}], tareas:['imprimir-interior'] },
      { id:'ricoh-7200', nombre:'Ricoh 7200 (Color/Tapas)', setupMin:2, teardownMin:0, prodMode:'por-formato', formatos:[{id:'f2332c',nombre:'23x32',cpm:45},{id:'f2535c',nombre:'25x35',cpm:35}], tareas:['imprimir-tapas','imprimir-interior'] },
      { id:'lam-01', nombre:'Laminadora', setupMin:3, teardownMin:0, prodMode:'por-paginas', pageRanges:[{id:'r1',maxPaginas:250,segPorLibro:15},{id:'r2',maxPaginas:9999,segPorLibro:20}], tareas:['laminar-tapas'] },
      { id:'enc-01', nombre:'Encuadernadora', setupMin:0, teardownMin:0, prodMode:'por-paginas', pageRanges:[{id:'e1',maxPaginas:9999,segPorLibro:48}], tareas:['encuadernar'] },
      { id:'gui-01', nombre:'Guillotina 1', setupMin:3, teardownMin:0, prodMode:'por-paginas', pageRanges:[{id:'g1',maxPaginas:9999,segPorLibro:30}], tareas:['guillotinar-interior','guillotinar-tapas','guillotinar-final'] },
      { id:'gui-02', nombre:'Guillotina 2', setupMin:3, teardownMin:0, prodMode:'por-paginas', pageRanges:[{id:'g2',maxPaginas:9999,segPorLibro:30}], tareas:['guillotinar-interior','guillotinar-tapas','guillotinar-final'] },
      { id:'gui-03', nombre:'Guillotina 3', setupMin:3, teardownMin:0, prodMode:'por-paginas', pageRanges:[{id:'g3',maxPaginas:9999,segPorLibro:30}], tareas:['guillotinar-interior','guillotinar-tapas','guillotinar-final'] },
    ],
    tareasCatalogo: [
      {id:'validar', label:'Validar archivos', productos:['libros'], dependeDe:[], requiereConfirmacion:false},
      {id:'enviar-muestra', label:'Enviar muestra', productos:['libros'], dependeDe:['validar'], requiereConfirmacion:true},
      {id:'imponer', label:'Imponer', productos:['libros'], dependeDe:['enviar-muestra'], requiereConfirmacion:false},
      {id:'enviar-interior', label:'Enviar interior a impresora', productos:['libros'], dependeDe:['imponer'], requiereConfirmacion:false},
      {id:'enviar-tapas', label:'Enviar tapas a impresora', productos:['libros'], dependeDe:['imponer'], requiereConfirmacion:false},
      {id:'imprimir-interior', label:'Imprimir interior', productos:['libros'], dependeDe:['enviar-interior'], requiereConfirmacion:false},
      {id:'imprimir-tapas', label:'Imprimir tapas', productos:['libros'], dependeDe:['enviar-tapas'], requiereConfirmacion:false},
      {id:'laminar-tapas', label:'Laminar tapas', productos:['libros'], dependeDe:['imprimir-tapas'], requiereConfirmacion:false},
      {id:'guillotinar-interior', label:'Guillotinar interior', productos:['libros'], dependeDe:['imprimir-interior'], requiereConfirmacion:false},
      {id:'guillotinar-tapas', label:'Guillotinar tapas', productos:['libros'], dependeDe:['laminar-tapas'], requiereConfirmacion:false},
      {id:'encuadernar', label:'Encuadernar', productos:['libros'], dependeDe:['guillotinar-interior','guillotinar-tapas'], requiereConfirmacion:false},
      {id:'guillotinar-final', label:'Guillotinar libro', productos:['libros'], dependeDe:['encuadernar'], requiereConfirmacion:false},
      {id:'empaquetar', label:'Empaquetar', productos:['libros'], dependeDe:['guillotinar-final'], requiereConfirmacion:false},
    ],
    dobladoSolapasSeg: 10,
    turnos:[{id:'t1',label:'Manana',desde:'09:00',hasta:'13:00'},{id:'t2',label:'Tarde',desde:'14:00',hasta:'18:00'}],
    operarios:[
      {id:'op1', nombre:'Operario 1', fijo:true, turnos:[], maquinas:['ricoh-8400','ricoh-8300','ricoh-7200'], semana:{
        lun:{on:true, desde:'09:00', hasta:'13:00'}, mar:{on:true, desde:'09:00', hasta:'13:00'}, mie:{on:true, desde:'09:00', hasta:'13:00'}, jue:{on:true, desde:'09:00', hasta:'13:00'}, vie:{on:true, desde:'09:00', hasta:'13:00'}, sab:{on:false, desde:'', hasta:''}, dom:{on:false, desde:'', hasta:''}
      }},
      {id:'op2', nombre:'Zafral 1', fijo:false, turnos:[], zafralSlots:[{id:'zs1', fecha:'2025-09-11', desde:'19:00', hasta:'23:00'}], maquinas:['ricoh-8400','ricoh-8300']},
    ],
  });
  const [sub,setSub] = useState('tareas');
  const [nuevaTareaNombre,setNuevaTareaNombre] = useState('');

  const taskOptions = useMemo(()=> cfg.tareasCatalogo.map(t=>({id:t.id,label:t.label})),[cfg.tareasCatalogo]);

  const addTareaCatalogo = ()=>{
    const name = (nuevaTareaNombre||'Nueva tarea').trim(); if(!name) return;
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    setCfg(p=> ({...p, tareasCatalogo:[...p.tareasCatalogo, {id, label:name, productos:['libros'], dependeDe:[], requiereConfirmacion:false, _edit:true}]}));
    setNuevaTareaNombre('');
  };
  const delTareaCatalogo = id=> setCfg(p=> ({...p, tareasCatalogo:p.tareasCatalogo.filter(x=>x.id!==id)}));

  const MachinesView = () => (
    <Section title="Maquinas (modelo genérico)" icon={<IconCog/>} right={<button className="text-xs border rounded px-2 py-1" onClick={()=> setCfg(p=> ({...p, machines:[...p.machines, {id:`m-${Date.now()}`, nombre:'Nueva maquina', setupMin:0, teardownMin:0, prodMode:'por-formato', formatos:[], pageRanges:[], tareas:[], _edit:true}]}))}>Agregar máquina</button>}>
      <div className="grid md:grid-cols-2 gap-3">
        {cfg.machines.map(m=> (
          <div key={m.id} className="border rounded-xl p-3 bg-white">
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold truncate">{m.nombre}</div>
              <div className="flex items-center gap-2">
                {!m._edit && (
                  <button className="border rounded p-1" title="Editar" onClick={()=> setCfg(p=> ({...p, machines:p.machines.map(x=> x.id===m.id? {...x, _edit:true, _backup:{...x}}:x)}))}><IconPencil/></button>
                )}
                {m._edit && (
                  <>
                    <button className="border rounded p-1" title="Guardar" onClick={()=> setCfg(p=> ({...p, machines:p.machines.map(x=> x.id===m.id? {...x, _edit:false, _backup: undefined}:x)}))}><IconUpload/></button>
                    <button className="border rounded p-1" title="Cancelar cambios" onClick={()=> setCfg(p=> ({...p, machines:p.machines.map(x=> x.id===m.id? (x._backup? {...x._backup, _edit:false, _backup: undefined}: {...x, _edit:false}):x)}))}><IconRevert/></button>
                    <button className="border rounded p-1" title="Eliminar" onClick={()=> setCfg(p=> ({...p, machines:p.machines.filter(x=> x.id!==m.id)}))}><IconTrash/></button>
                  </>
                )}
              </div>
            </div>

            {m._edit && (
              <>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div>
                    <div className="text-xs font-medium mb-1">Setup (min)</div>
                    <input type="number" className="w-full border rounded px-2 py-1 text-sm" value={m.setupMin} onChange={e=>{ const v=+e.target.value; setCfg(p=> ({...p, machines:p.machines.map(x=> x.id===m.id? {...x, setupMin:v}:x)})); }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1">Cierre (min)</div>
                    <input type="number" className="w-full border rounded px-2 py-1 text-sm" value={m.teardownMin} onChange={e=>{ const v=+e.target.value; setCfg(p=> ({...p, machines:p.machines.map(x=> x.id===m.id? {...x, teardownMin:v}:x)})); }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1">Los tiempos de produccion se calculan segun</div>
                    <select className="w-full border rounded px-2 py-1 text-sm" value={m.prodMode} onChange={e=>{ const v=e.target.value; setCfg(p=> ({...p, machines:p.machines.map(x=> x.id===m.id? {...x, prodMode:v}:x)})); }}>
                      <option value="por-formato">formato de impresion</option>
                      <option value="por-paginas">cantidad de paginas</option>
                    </select>
                  </div>
                </div>

                {m.prodMode==='por-formato' && (
                  <div className="mt-3">
                    <div className="text-xs font-medium mb-1">Tiempos de produccion</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(m.formatos||[]).map(f=> (
                        <span key={f.id} className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs bg-slate-100 border">
                          {f.nombre} &middot; {f.cpm} c/min
                          <button onClick={()=> setCfg(p=> ({...p, machines:p.machines.map(x=> x.id===m.id? {...x, formatos:(x.formatos||[]).filter(ff=> ff.id!==f.id)}:x)}))}>✕</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input id={`fmt-nom-${m.id}`} placeholder="Formato (e.g. 23x32)" className="border rounded px-2 py-1 text-sm" />
                      <input id={`fmt-cpm-${m.id}`} type="number" placeholder="c/min" className="w-24 border rounded px-2 py-1 text-sm" />
                      <button className="border rounded px-2 py-1 text-sm" onClick={()=>{
                        const nomEl = document.getElementById(`fmt-nom-${m.id}`);
                        const cpmEl = document.getElementById(`fmt-cpm-${m.id}`);
                        const nom = nomEl && nomEl.value ? String(nomEl.value).trim() : '';
                        const cpm = cpmEl && cpmEl.value ? +cpmEl.value : 0;
                        if(!nom || !cpm) return;
                        setCfg(p=> ({...p, machines:p.machines.map(x=> x.id===m.id? {...x, formatos:[...(x.formatos||[]), {id:`f-${Date.now()}`, nombre:nom, cpm}]}:x)}));
                        if(nomEl) nomEl.value=''; if(cpmEl) cpmEl.value='';
                      }}>＋</button>
                    </div>
                  </div>
                )}

                {m.prodMode==='por-paginas' && (
                  <div className="mt-3">
                    <div className="text-xs font-medium mb-1">Tiempos de produccion</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(m.pageRanges||[]).map(r=> (
                        <span key={r.id} className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs bg-slate-100 border">
                          &le; {r.maxPaginas} pag &middot; {r.segPorLibro}s/libro
                          <button onClick={()=> setCfg(p=> ({...p, machines:p.machines.map(x=> x.id===m.id? {...x, pageRanges:(x.pageRanges||[]).filter(rr=> rr.id!==r.id)}:x)}))}>✕</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input id={`rng-max-${m.id}`} type="number" placeholder="max paginas" className="border rounded px-2 py-1 text-sm" />
                      <input id={`rng-seg-${m.id}`} type="number" placeholder="seg/libro" className="w-28 border rounded px-2 py-1 text-sm" />
                      <button className="border rounded px-2 py-1 text-sm" onClick={()=>{
                        const maxEl = document.getElementById(`rng-max-${m.id}`);
                        const segEl = document.getElementById(`rng-seg-${m.id}`);
                        const max = maxEl && maxEl.value ? +maxEl.value : 0;
                        const seg = segEl && segEl.value ? +segEl.value : 0;
                        if(!max || !seg) return;
                        setCfg(p=> ({...p, machines:p.machines.map(x=> x.id===m.id? {...x, pageRanges:[...(x.pageRanges||[]), {id:`r-${Date.now()}`, maxPaginas:max, segPorLibro:seg}]}:x)}));
                        if(maxEl) maxEl.value=''; if(segEl) segEl.value='';
                      }}>＋</button>
                    </div>
                  </div>
                )}

                <div className="mt-3">
                  <div className="text-xs font-medium mb-1">Tareas que realiza</div>
                  <MultiSelectSearch anchorId={`mt-${m.id}`} options={taskOptions} selected={m.tareas} onChange={(next)=> setCfg(p=> ({...p, machines:p.machines.map(x=> x.id===m.id? {...x, tareas: next}:x)}))} />
                </div>
              </>
            )}

            {!m._edit && (
              <div className="text-sm text-slate-800 mt-2 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div><div className="text-[11px] text-slate-500">Setup</div><div className="font-medium">{m.setupMin} min</div></div>
                  <div><div className="text-[11px] text-slate-500">Cierre</div><div className="font-medium">{m.teardownMin} min</div></div>
                  <div><div className="text-[11px] text-slate-500">Calculo</div><div className="font-medium">{m.prodMode==='por-formato'?'por formato':'por paginas'}</div></div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">Tiempos de produccion</div>
                  {m.prodMode==='por-formato' ? (
                    <div className="flex flex-wrap gap-2">{(m.formatos||[]).map(f=> <Badge key={f.id}>{f.nombre} &middot; {f.cpm} c/min</Badge>)}</div>
                  ) : (
                    <ul className="list-disc pl-5 text-xs text-slate-700">{(m.pageRanges||[]).map(r=> <li key={r.id}>&le;{r.maxPaginas} pags &middot; {r.segPorLibro}s/libro</li>)}</ul>
                  )}
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">Tareas que realiza</div>
                  <div className="flex flex-wrap gap-2">{m.tareas.map(tid=> <Badge key={tid}>{taskOptions.find(t=>t.id===tid)?.label || tid}</Badge>)}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );

  const TareasView = () => (
    <Section title="Catalogo de tareas (producto, dependencias, confirmacion)" icon={<IconCog/>}>
      <div className="flex items-center gap-2 mb-3">
        <input className="border rounded px-2 py-1 text-sm max-w-[260px]" placeholder="Nueva tarea" value={nuevaTareaNombre} onChange={e=>setNuevaTareaNombre(e.target.value)} />
        <button className="text-xs border rounded px-2 py-1" onClick={addTareaCatalogo}><span className="inline-flex items-center gap-1"><IconUpload/>Agregar</span></button>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {cfg.tareasCatalogo.map(t=> (
          <div key={t.id} className="border rounded-xl p-3 bg-white">
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold truncate">{t.label}</div>
              <div className="flex items-center gap-2">
                {!t._edit && (
                  <button className="border rounded p-1" title="Editar" onClick={()=> setCfg(p=> ({...p, tareasCatalogo:p.tareasCatalogo.map(x=> x.id===t.id? {...x, _edit:true, _backup:{...x}}:x)}))}><IconPencil/></button>
                )}
                {t._edit && (
                  <>
                    <button className="border rounded p-1" title="Guardar" onClick={()=> setCfg(p=> ({...p, tareasCatalogo:p.tareasCatalogo.map(x=> x.id===t.id? {...x, label:(x._draftLabel!=null? x._draftLabel : x.label), _draftLabel: undefined, _edit:false, _backup: undefined}:x)}))}><IconUpload/></button>
                    <button className="border rounded p-1" title="Cancelar cambios" onClick={()=> setCfg(p=> ({...p, tareasCatalogo:p.tareasCatalogo.map(x=> x.id===t.id? (x._backup? {...x._backup, _edit:false, _backup: undefined}: {...x, _edit:false}):x)}))}><IconRevert/></button>
                    <button className="border rounded p-1" title="Eliminar" onClick={()=> delTareaCatalogo(t.id)}><IconTrash/></button>
                  </>
                )}
              </div>
            </div>

            {t._edit && (
              <input className="mt-2 w-full border rounded px-2 py-1 text-sm" value={t._draftLabel!=null ? t._draftLabel : t.label} onChange={e=>{ const label=e.target.value; setCfg(p=> ({...p, tareasCatalogo:p.tareasCatalogo.map(x=> x.id===t.id? {...x,_draftLabel:label}:x)})); }} />
            )}

            <div className="mt-2">
              <div className="text-xs font-medium mb-1">Aplica a productos</div>
              <MultiSelectSearch anchorId={`prod-${t.id}`} options={PRODUCTS} selected={t.productos} onChange={next=> setCfg(p=> ({...p, tareasCatalogo:p.tareasCatalogo.map(x=> x.id===t.id? {...x, productos: next}:x)}))} />
            </div>

            <div className="mt-2">
              <div className="text-xs font-medium mb-1">Tareas previas</div>
              <MultiSelectSearch anchorId={`dep-${t.id}`} options={taskOptions.filter(o=>o.id!==t.id)} selected={t.dependeDe} onChange={next=> setCfg(p=> ({...p, tareasCatalogo:p.tareasCatalogo.map(x=> x.id===t.id? {...x, dependeDe: next}:x)}))} />
            </div>

            <div className="mt-2">
              <div className="text-xs font-medium mb-1">Requiere confirmacion del cliente</div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!t.requiereConfirmacion} onChange={e=>{ const v=e.target.checked; setCfg(p=> ({...p, tareasCatalogo:p.tareasCatalogo.map(x=> x.id===t.id? {...x, requiereConfirmacion:v}:x)})); }} />
                <span>{t.requiereConfirmacion? 'Si':'No'}</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );

  const PersonalView = () => {
    const dias = ['lun','mar','mie','jue','vie','sab','dom'];
    const diaLbl = {lun:'Lun', mar:'Mar', mie:'Mie', jue:'Jue', vie:'Vie', sab:'Sab', dom:'Dom'};
    const machineOptions = cfg.machines.map(m=> ({id:m.id, label:m.nombre}));

    const addOperario = ()=> setCfg(p=> ({...p, operarios:[...p.operarios, {id:`op-${Date.now()}`, nombre:'Nuevo', fijo:true, turnos:[], maquinas:[], semana:{lun:{on:false,desde1:'',hasta1:'',desde2:'',hasta2:''},mar:{on:false,desde1:'',hasta1:'',desde2:'',hasta2:''},mie:{on:false,desde1:'',hasta1:'',desde2:'',hasta2:''},jue:{on:false,desde1:'',hasta1:'',desde2:'',hasta2:''},vie:{on:false,desde1:'',hasta1:'',desde2:'',hasta2:''},sab:{on:false,desde1:'',hasta1:'',desde2:'',hasta2:''},dom:{on:false,desde1:'',hasta1:'',desde2:'',hasta2:''}}, _edit:true}]}));

    const addZafralSlot = (oid)=> setCfg(p=> ({...p, operarios:p.operarios.map(o=> o.id===oid? {...o, zafralSlots:[...(o.zafralSlots||[]), {id:`zs-${Date.now()}`, fecha:'', desde:'', hasta:'', desde2:'', hasta2:''}]}:o)}));
    const rmZafralSlot = (oid, sid)=> setCfg(p=> ({...p, operarios:p.operarios.map(o=> o.id===oid? {...o, zafralSlots:(o.zafralSlots||[]).filter(s=> s.id!==sid)}:o)}));

    return (
      <Section title="Personal" icon={<IconCog/>} right={<button className="text-xs border rounded px-2 py-1" onClick={addOperario}>Agregar persona</button>}>
        <div className="grid md:grid-cols-2 gap-3">
          {cfg.operarios.map(o=> (
            <div key={o.id} className="border rounded-xl p-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold truncate">{o.nombre}</div>
                <div className="flex items-center gap-2">
                  {!o._edit && (
                    <button className="border rounded p-1" title="Editar" onClick={()=> setCfg(p=> ({...p, operarios:p.operarios.map(x=> x.id===o.id? {...x, _edit:true, _backup:{...x}}:x)}))}><IconPencil/></button>
                  )}
                  {o._edit && (
                    <>
                      <button className="border rounded p-1" title="Guardar" onClick={()=> setCfg(p=> ({...p, operarios:p.operarios.map(x=> x.id===o.id? {...x, _edit:false, _backup: undefined}:x)}))}><IconUpload/></button>
                      <button className="border rounded p-1" title="Cancelar cambios" onClick={()=> setCfg(p=> ({...p, operarios:p.operarios.map(x=> x.id===o.id? (x._backup? {...x._backup, _edit:false, _backup: undefined}: {...x, _edit:false}):x)}))}><IconRevert/></button>
                      <button className="border rounded p-1" title="Eliminar" onClick={()=> setCfg(p=> ({...p, operarios:p.operarios.filter(x=> x.id!==o.id)}))}><IconTrash/></button>
                    </>
                  )}
                </div>
              </div>

              {!o._edit && (
                <div className="text-sm text-slate-800 mt-2 space-y-3">
                  <div>
                    <div className="text-[11px] text-slate-500 mb-1">Maquinas</div>
                    <div className="flex flex-wrap gap-2">{o.maquinas.map(mid=> <Badge key={mid}>{(cfg.machines.find(m=>m.id===mid)||{}).nombre||mid}</Badge>)}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 mb-1">Horario</div>
                    <ul className="text-xs list-disc pl-5">
                      {dias.map(d=> {
                        const it=o.semana&&o.semana[d];
                        if(!(it&&it.on)) return null;
                        const r1 = (it.desde1&&it.hasta1)? `${it.desde1}-${it.hasta1}` : (it.desde&&it.hasta? `${it.desde}-${it.hasta}`:'');
                        const r2 = (it.desde2&&it.hasta2)? `, ${it.desde2}-${it.hasta2}` : '';
                        return <li key={d}>{diaLbl[d]}: {r1}{r2}</li>;
                      })}
                      {!o.fijo && (o.zafralSlots||[]).length>0 && (
                        (o.zafralSlots||[]).map(s=> <li key={s.id}>Zafral {s.fecha}: {s.desde}{s.hasta?`-${s.hasta}`:''}{s.desde2?`, ${s.desde2}`:''}{s.hasta2?`-${s.hasta2}`:''}</li>)
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {o._edit && (
                <>
                  <div className="mt-2">
                    <div className="text-xs font-medium mb-1">Maquinas que maneja</div>
                    <MultiSelectSearch anchorId={`opm-${o.id}`} options={machineOptions} selected={o.maquinas} onChange={(next)=> setCfg(p=> ({...p, operarios:p.operarios.map(x=> x.id===o.id? {...x, maquinas: next}:x)}))} />
                  </div>

                  {o.fijo ? (
                    <div className="mt-2">
                      <div className="text-xs font-medium mb-1">Horario por dia (hasta dos rangos)</div>
                      <div className="grid grid-cols-2 gap-2">
                        {dias.map(d=> (
                          <div key={d} className="border rounded p-2">
                            <label className="text-xs flex items-center gap-2">
                              <input type="checkbox" checked={!!(o.semana&&o.semana[d]&&o.semana[d].on)} onChange={e=>{ const on=e.target.checked; setCfg(p=> ({...p, operarios:p.operarios.map(x=> x.id===o.id? {...x, semana: {...(x.semana||{}), [d]: {...(x.semana?.[d]||{}), on}}}:x)})); }} />
                              <span className="font-medium">{diaLbl[d]}</span>
                            </label>
                            <div className="mt-1 grid grid-cols-2 gap-1">
                              <input placeholder="09:00" className="border rounded px-2 py-1 text-xs" defaultValue={(o.semana?.[d]?.desde1)||''} pattern="^([01]\d|2[0-3]):[0-5]\d$" title="HH:MM" maxLength={5} onBlur={e=>{ const v=e.target.value.trim(); if(!v) return; if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(v)){ e.target.classList.add('border-red-500'); return;} e.target.classList.remove('border-red-500'); setCfg(p=> ({...p, operarios:p.operarios.map(x=> x.id===o.id? {...x, semana: {...(x.semana||{}), [d]: {...(x.semana?.[d]||{}), desde1:v}}}:x)})); }} />
                              <input placeholder="13:00" className="border rounded px-2 py-1 text-xs" defaultValue={(o.semana?.[d]?.hasta1)||''} pattern="^([01]\d|2[0-3]):[0-5]\d$" title="HH:MM" maxLength={5} onBlur={e=>{ const v=e.target.value.trim(); if(!v) return; if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(v)){ e.target.classList.add('border-red-500'); return;} e.target.classList.remove('border-red-500'); setCfg(p=> ({...p, operarios:p.operarios.map(x=> x.id===o.id? {...x, semana: {...(x.semana||{}), [d]: {...(x.semana?.[d]||{}), hasta1:v}}}:x)})); }} />
                              <input placeholder="14:00" className="border rounded px-2 py-1 text-xs" defaultValue={(o.semana?.[d]?.desde2)||''} pattern="^([01]\d|2[0-3]):[0-5]\d$" title="HH:MM" maxLength={5} onBlur={e=>{ const v=e.target.value.trim(); if(!v) return; if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(v)){ e.target.classList.add('border-red-500'); return;} e.target.classList.remove('border-red-500'); setCfg(p=> ({...p, operarios:p.operarios.map(x=> x.id===o.id? {...x, semana: {...(x.semana||{}), [d]: {...(x.semana?.[d]||{}), desde2:v}}}:x)})); }} />
                              <input placeholder="18:00" className="border rounded px-2 py-1 text-xs" defaultValue={(o.semana?.[d]?.hasta2)||''} pattern="^([01]\d|2[0-3]):[0-5]\d$" title="HH:MM" maxLength={5} onBlur={e=>{ const v=e.target.value.trim(); if(!v) return; if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(v)){ e.target.classList.add('border-red-500'); return;} e.target.classList.remove('border-red-500'); setCfg(p=> ({...p, operarios:p.operarios.map(x=> x.id===o.id? {...x, semana: {...(x.semana||{}), [d]: {...(x.semana?.[d]||{}), hasta2:v}}}:x)})); }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <div className="text-xs font-medium mb-1">Agenda zafral (puede cruzar medianoche)</div>
                      <div className="space-y-2">
                        {(o.zafralSlots||[]).map(s=> (
                          <div key={s.id} className="border rounded p-2">
                            <div className="grid grid-cols-5 gap-1 items-center">
                              <input type="date" className="border rounded px-2 py-1 text-xs col-span-2" defaultValue={s.fecha||''} onBlur={e=>{ const v=e.target.value; if(!v) return; setCfg(p=> ({...p, operarios:p.operarios.map(x=> x.id===o.id? {...x, zafralSlots:(x.zafralSlots||[]).map(z=> z.id===s.id? {...z, fecha:v}:z)}:x)})); }} />
                              <input placeholder="19:00" className="border rounded px-2 py-1 text-xs" defaultValue={s.desde||''} pattern="^([01]\d|2[0-3]):[0-5]\d$" title="HH:MM" maxLength={5} onBlur={e=>{ const v=e.target.value.trim(); if(!v) return; if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(v)){ e.target.classList.add('border-red-500'); return;} e.target.classList.remove('border-red-500'); setCfg(p=> ({...p, operarios:p.operarios.map(x=> x.id===o.id? {...x, zafralSlots:(x.zafralSlots||[]).map(z=> z.id===s.id? {...z, desde:v}:z)}:x)})); }} />
                              <input placeholder="23:00" className="border rounded px-2 py-1 text-xs" defaultValue={s.hasta||''} pattern="^([01]\d|2[0-3]):[0-5]\d$" title="HH:MM" maxLength={5} onBlur={e=>{ const v=e.target.value.trim(); if(!v) return; if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(v)){ e.target.classList.add('border-red-500'); return;} e.target.classList.remove('border-red-500'); setCfg(p=> ({...p, operarios:p.operarios.map(x=> x.id===o.id? {...x, zafralSlots:(x.zafralSlots||[]).map(z=> z.id===s.id? {...z, hasta:v}:z)}:x)})); }} />
                              <button className="text-xs border rounded px-2 py-1" onClick={()=> rmZafralSlot(o.id, s.id)}>Quitar</button>
                            </div>
                            <div className="grid grid-cols-4 gap-1 mt-1">
                              <input placeholder="opc 2: 20:00" className="border rounded px-2 py-1 text-xs" defaultValue={s.desde2||''} pattern="^([01]\d|2[0-3]):[0-5]\d$" title="HH:MM" maxLength={5} onBlur={e=>{ const v=e.target.value.trim(); if(!v) return; if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(v)){ e.target.classList.add('border-red-500'); return;} e.target.classList.remove('border-red-500'); setCfg(p=> ({...p, operarios:p.operarios.map(x=> x.id===o.id? {...x, zafralSlots:(x.zafralSlots||[]).map(z=> z.id===s.id? {...z, desde2:v}:z)}:x)})); }} />
                              <input placeholder="opc 2: 23:59" className="border rounded px-2 py-1 text-xs" defaultValue={s.hasta2||''} pattern="^([01]\d|2[0-3]):[0-5]\d$" title="HH:MM" maxLength={5} onBlur={e=>{ const v=e.target.value.trim(); if(!v) return; if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(v)){ e.target.classList.add('border-red-500'); return;} e.target.classList.remove('border-red-500'); setCfg(p=> ({...p, operarios:p.operarios.map(x=> x.id===o.id? {...x, zafralSlots:(x.zafralSlots||[]).map(z=> z.id===s.id? {...z, hasta2:v}:z)}:x)})); }} />
                            </div>
                          </div>
                        ))}
                        <button className="text-xs border rounded px-2 py-1" onClick={()=> addZafralSlot(o.id)}>Agregar franja</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </Section>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button className={`text-xs border rounded px-3 py-1 ${sub==='machines'?'bg-slate-900 text-white':''}`} onClick={()=>setSub('machines')}>Maquinas</button>
        <button className={`text-xs border rounded px-3 py-1 ${sub==='tareas'?'bg-slate-900 text-white':''}`} onClick={()=>setSub('tareas')}>Tareas</button>
        <button className={`text-xs border rounded px-3 py-1 ${sub==='personal'?'bg-slate-900 text-white':''}`} onClick={()=>setSub('personal')}>Personal</button>
      </div>
      {sub==='machines' && <MachinesView/>}
      {sub==='tareas' && <TareasView/>}
      {sub==='personal' && <PersonalView/>}
    </div>
  );
}

// ===================== App (tabs principales) =====================
export default function App(){
  const [tab,setTab] = useState('config');
  return (
    <div className="min-h-screen bg-slate-50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Producción - Libros</h1>
        <div className="flex gap-2">
          <button className={`text-xs border rounded px-3 py-1 ${tab==='control'?'bg-slate-900 text-white':''}`} onClick={()=>setTab('control')}>Control general</button>
          <button className={`text-xs border rounded px-3 py-1 ${tab==='config'?'bg-slate-900 text-white':''}`} onClick={()=>setTab('config')}>Configuracion</button>
        </div>
      </div>
      {tab==='control'? <ControlGeneral/> : <Configuracion/>}
    </div>
  );
}
