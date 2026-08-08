/* Stackline — app logic: views, sync, rendering
   Generated file. Edit and re-upload just this one when behaviour changes. */
/* ============================================================
   Sync layer. localStorage stays the source of truth locally
   (so the app is identical if Firebase is unavailable); the
   cloud is a mirror that makes it device-independent.
   Conflicts resolve last-write-wins per log date.
============================================================ */
let SYNC = {on:false, user:null, busy:false, last:null, err:null, snapshot:null};

function stampLogs(){
  // give any log that changed since the last snapshot a fresh timestamp
  const snap = SYNC.snapshot || {};
  const now = Date.now();
  state.logs.forEach(l=>{
    const key = l.date;
    const cur = JSON.stringify(Object.assign({}, l, {_u:0}));
    if(snap[key] !== cur){ l._u = now; }
  });
}
function takeSnapshot(){
  const s={};
  state.logs.forEach(l=> s[l.date] = JSON.stringify(Object.assign({}, l, {_u:0})));
  SYNC.snapshot = s;
}
function metaBlob(){
  return {
    prefs:      {data: state.prefs,      u: state.prefs._u      || Date.now()},
    routines:   {data: state.routines,   u: state.meta_routinesU || Date.now()},
    milestones: {data: state.milestones, u: state.meta_milestonesU || Date.now()},
    customDrills:{data: state.customDrills, u: state.meta_drillsU || Date.now()},
    deskLogs:   {data: state.deskLogs,    u: state.meta_deskU   || Date.now()},
    daySwaps:   {data: state.daySwaps,    u: state.meta_deskU   || Date.now()},
    classLogs:  {data: state.classLogs,   u: state.meta_classU  || Date.now()},
    customMoves:{data: state.customMoves, u: state.meta_classU  || Date.now()},
    schedule:   {data: state.schedule,    u: state.meta_schedU  || Date.now()}
  };
}
async function syncPush(){
  if(!SYNC.on || !window.SL_FB || !window.SL_FB.user) return;
  try{
    SYNC.busy=true; updateSyncUI();
    stampLogs();
    await window.SL_FB.push(Object.assign({logs: state.logs, deletes: SYNC.pendingDeletes||[]}, metaBlob()));
    SYNC.pendingDeletes = [];
    takeSnapshot();
    SYNC.last = Date.now(); SYNC.err=null;
  }catch(e){ SYNC.err = e.message||String(e); }
  finally{ SYNC.busy=false; updateSyncUI(); }
}
async function syncPull(){
  if(!SYNC.on || !window.SL_FB || !window.SL_FB.user) return;
  try{
    SYNC.busy=true; updateSyncUI();
    const cloud = await window.SL_FB.pull();
    if(cloud){
      // logs: newest wins per date
      const byDate = {};
      state.logs.forEach(l=> byDate[l.date]=l);
      cloud.logs.forEach(cl=>{
        const local = byDate[cl.date];
        if(!local || (cl._u||0) > (local._u||0)) byDate[cl.date]=cl;
      });
      state.logs = Object.values(byDate).sort((a,b)=> a.date<b.date?-1:1);
      // meta: newest wins wholesale
      if(cloud.prefs && (cloud.prefs.u||0) > (state.prefs._u||0)) state.prefs = Object.assign(state.prefs, cloud.prefs.data);
      if(cloud.routines && (cloud.routines.u||0) > (state.meta_routinesU||0)){
        state.routines = cloud.routines.data; state.meta_routinesU = cloud.routines.u;
      }
      if(cloud.milestones && (cloud.milestones.u||0) > (state.meta_milestonesU||0)){
        state.milestones = cloud.milestones.data; state.meta_milestonesU = cloud.milestones.u;
      }
      if(cloud.customDrills && (cloud.customDrills.u||0) > (state.meta_drillsU||0)){
        state.customDrills = cloud.customDrills.data||[]; state.meta_drillsU = cloud.customDrills.u;
      }
      if(cloud.deskLogs && (cloud.deskLogs.u||0) > (state.meta_deskU||0)){
        state.deskLogs = cloud.deskLogs.data||[]; state.meta_deskU = cloud.deskLogs.u;
      }
      if(cloud.daySwaps) state.daySwaps = Object.assign({}, cloud.daySwaps.data||{}, state.daySwaps||{});
      if(cloud.classLogs && (cloud.classLogs.u||0) > (state.meta_classU||0)){
        state.classLogs = cloud.classLogs.data||[]; state.meta_classU = cloud.classLogs.u;
      }
      if(cloud.customMoves && (cloud.customMoves.u||0) > (state.meta_classU||0)) state.customMoves = cloud.customMoves.data||[];
      if(cloud.schedule && (cloud.schedule.u||0) > (state.meta_schedU||0)){
        state.schedule = cloud.schedule.data||null; state.meta_schedU = cloud.schedule.u; }
      saveLocalOnly(); takeSnapshot(); applyTheme(); render(curView);
    }
    SYNC.last=Date.now(); SYNC.err=null;
  }catch(e){ SYNC.err = e.message||String(e); }
  finally{ SYNC.busy=false; updateSyncUI(); }
}
function updateSyncUI(){
  const dot=$("#sync-dot"); if(!dot) return;
  dot.className = "syncdot " + (SYNC.err?"err":SYNC.busy?"busy":SYNC.on?"on":"off");
  dot.title = SYNC.err ? ("Sync error: "+SYNC.err)
            : SYNC.busy ? "Syncing…" : SYNC.on ? "Synced" : "Local only";
}
window.addEventListener("sl-auth", async (e)=>{
  const u = e.detail && e.detail.user;
  SYNC.user = u; SYNC.on = !!u;
  updateSyncUI();
  if(u){ await syncPull(); await syncPush(); }
});

/* ---------- tiny helpers ---------- */
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s==null?"":s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const todayISO = (off=0) => { const d=new Date(); d.setDate(d.getDate()+off); return d.toISOString().slice(0,10); };
const fmtDate = iso => new Date(iso+"T12:00:00").toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});
const avg = a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : null;
const r1 = n => n==null ? "—" : (Math.round(n*10)/10).toFixed(1);
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("on"); clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove("on"),1900); }
const routineById = id => state.routines.find(r=>r.id===id);
const logByDate = d => state.logs.find(l=>l.date===d);
const FATIGUE_LBL = {low:"Low fatigue", med:"Moderate", high:"Higher effort"};

const ICONS = {
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5Z"/></svg>',
  build:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  log:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.9 6.3 6.8.7-5.1 4.6 1.4 6.7L12 16.9 5.9 20.3l1.5-6.7L2.3 9l6.8-.7L12 2Z"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M4.5 12.5l5 5 10-11"/></svg>',
  info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8v.5"/></svg>',
  vid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="6" width="13" height="12" rx="3"/><path d="m16 10 5-3v10l-5-3" stroke-linejoin="round"/></svg>',
  img:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m4 18 5-5 3 3 4-4 4 4" stroke-linejoin="round"/></svg>',
  doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" stroke-linecap="round"><path d="M6 3h9l4 4v14H6z" stroke-linejoin="round"/><path d="M9 12h7M9 16h7"/></svg>',
  link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" stroke-linecap="round"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>',
};
const MEDIA_IC = {video:ICONS.vid, gif:ICONS.img, image:ICONS.img, article:ICONS.doc, custom:ICONS.link};

/* line-angle gauge — the app's signature */
/* ---------- sheet modal ---------- */
let sheetBack = null;
function openSheet(title, bodyHTML, footHTML, backFn){
  sheetBack = backFn || null;
  const hd = $("#sheet-close");
  if(hd){
    hd.innerHTML = sheetBack
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="17" height="17"><path d="M15 5l-7 7 7 7"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="17" height="17"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    hd.setAttribute("aria-label", sheetBack ? "Back" : "Close");
  }
  $("#sheet-title").textContent = title;
  $("#sheet-body").innerHTML = bodyHTML;
  const f=$("#sheet-foot");
  if(footHTML){ f.style.display="flex"; f.innerHTML=footHTML; } else { f.style.display="none"; f.innerHTML=""; }
  $("#scrim").classList.add("on"); $("#sheet").classList.add("on");
  document.body.style.overflow="hidden";
}
function closeSheet(){
  sheetBack = null;
  $("#scrim").classList.remove("on"); $("#sheet").classList.remove("on");
  document.body.style.overflow="";
}
$("#sheet-close").onclick = ()=>{ const b=sheetBack; if(b){ sheetBack=null; b(); } else closeSheet(); };
$("#scrim").onclick = ()=>{ sheetBack=null; closeSheet(); };

/* ---------- theme + nav ---------- */
function applyTheme(){
  document.documentElement.dataset.theme = state.prefs.theme;
  const sun='<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
  const moon='<path d="M20 13.5A8.5 8.5 0 0 1 10.5 4 7.5 7.5 0 1 0 20 13.5Z" stroke-linejoin="round"/>';
  $("#ic-theme").innerHTML = state.prefs.theme==="dark" ? sun : moon;
  const mt=document.querySelector('meta[name=theme-color]');
  if(mt) mt.content = state.prefs.theme==="dark" ? "#141311" : "#F3EFE7";
}
$("#btn-theme").onclick = ()=>{ state.prefs.theme = state.prefs.theme==="dark"?"light":"dark"; applyTheme(); save(); };

let curView="today";
function show(v){
  curView=v;
  $$(".view").forEach(x=>x.classList.remove("on"));
  $("#view-"+v).classList.add("on");
  $$("nav.tabs button").forEach(b=>b.classList.toggle("on", b.dataset.v===v));
  render(v);
  window.scrollTo({top:0});
}
$$("nav.tabs button").forEach(b=> b.onclick=()=>show(b.dataset.v));
function render(v){
  ({today:renderToday, week:renderWeek, skills:renderSkills, builder:renderBuilder, library:renderLibrary, progress:renderProgress})[v]();
}

/* ============================================================
   Smart recommendation logic
============================================================ */
function last7Adherence(){
  let n=0; for(let i=0;i<7;i++){ if(logByDate(todayISO(-i))) n++; } return n;
}
function recommendToday(){
  const dow = new Date().getDay();
  const plan = planFor(dow);
  let routine = routineById(plan.routine) || state.routines[0];
  const notes=[];
  const y = logByDate(todayISO(-1));
  const recentEnergy = avg(state.logs.filter(l=> l.date>=todayISO(-2) && l.energy!=null).map(l=>l.energy));
  if(recentEnergy!=null && recentEnergy<=4 && routine.id!=="r-reset"){
    routine = routineById("r-reset") || routine;
    notes.push("Recovery has been low (energy ≤4 recently) — swapped in the Low-Fatigue Reset. Hold the range, spend nothing.");
  } else if(y && y.energy!=null && y.energy<=3 && routine.fatigue!=="low"){
    routine = routineById("r-reset") || routine;
    notes.push("Yesterday's energy was rough — today's block is downgraded to the shortest effective option.");
  }
  const adh = last7Adherence();
  if(adh<=2 && state.logs.length>=3 && routine.minutes>6){
    routine = routineById("r-reset") || routine;
    notes.push("Only "+adh+" logged day(s) this week. Rebuild the streak with the 5-minute reset — consistency beats volume.");
  }
  return {plan, routine, notes};
}

/* ============================================================
   TODAY view
============================================================ */
function streak(){
  let n=0; for(let i=0;i<60;i++){ if(logByDate(todayISO(-i))) n++; else if(i>0) break; else if(!logByDate(todayISO(0))) continue; }
  // count consecutive days ending today or yesterday
  n=0; let skipToday = !logByDate(todayISO(0));
  for(let i = skipToday?1:0; i<90; i++){ if(logByDate(todayISO(-i))) n++; else break; }
  return n;
}
function renderToday(){
  const today = todayISO();
  const {plan, routine, notes} = recommendToday();
  const ov = dayOverride(today);
  const isRest = ov && ov.type==="rest";
  const isOwn  = ov && ov.type==="own";
  const clsName = ov && ov.label ? ov.label
                : isRest ? "Rest day" : isOwn ? "Own training" : plan.cls;
  const dayLog = logByDate(today), clsLog = classLogFor(today);
  const runDone = dayLog && (dayLog.routineId===routine.id);
  const deskN = deskToday();

  // the day's jobs
  const jobs = [];
  if(!isRest) jobs.push({k:"routine", nm:routine.name, mt:routine.minutes+" min · "+routine.items.length+" drills",
    done:runDone, act:runDone?"Redo":"Start", primary:!runDone});
  if(!isRest) jobs.push({k:"class",
    nm: isOwn ? "Own training session" : clsName,
    mt: clsLog ? clsLog.items.length+" exercise"+(clsLog.items.length!==1?"s":"")+" logged" : (isOwn?"Build a session and log it":"Not logged yet"),
    done: !!clsLog, act: clsLog?"Edit":(isOwn?"Build":"Log")});
  jobs.push({k:"checkin", nm:"Day check-in", mt: dayLog?("Line "+(dayLog.line??"–")+" · overhead "+(dayLog.mob??"–")+" · energy "+(dayLog.energy??"–")):"Shoulder line, overhead, energy",
    done: !!dayLog, act: dayLog?"Edit":"Log"});
  const doneN = jobs.filter(j=>j.done).length, totalN = jobs.length;
  const pct = totalN? doneN/totalN : 0, circ = 2*Math.PI*15.5;

  const row = j => `<button class="trow ${j.done?"done":""} ${j.primary?"primary":""}" data-job="${j.k}">
      <div class="mark ${j.done?"on":""}">${j.done?ICONS.check:(j.primary?'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5Z"/></svg>':"")}</div>
      <div class="bd"><div class="nm">${esc(j.nm)}</div><div class="mt">${esc(j.mt)}</div></div>
      <span class="go">${j.act} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m9 6 6 6-6 6"/></svg></span>
    </button>`;

  $("#view-today").innerHTML = `
  <div class="thead">
    <div class="tring">
      <svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--line)" stroke-width="3.4"/>
        <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--teal)" stroke-width="3.4" stroke-linecap="round"
          stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${(circ*(1-pct)).toFixed(1)}"/></svg>
      <div class="lbl"><b>${doneN}/${totalN}</b><span>DONE</span></div>
    </div>
    <div class="day">${new Date().toLocaleDateString(undefined,{weekday:"long", day:"numeric", month:"long"})}</div>
    <h2>${esc(clsName)}</h2>
    ${!isRest?`<button class="whybtn" id="t-why">${esc(plan.focus)} — why?
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4m0-4v.01"/></svg></button>
      <div class="whybox" id="t-whybox">${esc(plan.why)}
        ${notes.map(n=>`<div style="margin-top:8px">${esc(n)}</div>`).join("")}</div>`:""}
    <div class="row" style="gap:8px;margin-top:12px;flex-wrap:wrap">
      <span class="streakpill">🔥 <b>${streak()||0}</b> day streak</span>
      <button class="streakpill" id="t-daytype" style="cursor:pointer">⇄ Change day</button>
    </div>
  </div>

  ${isRest? `<div class="notice teal" style="margin-top:16px">${ICONS.info}<span>Rest day. Nothing scheduled — desk resets below if you want them.</span></div>`:""}
  ${(!isRest && plan.kind==="mobility")? `<div class="notice" style="margin-top:16px">${ICONS.info}<span>Your class today is already a mobility session — the block below is only a short top-up, not a second session.</span></div>`:""}

  <div class="eyebrow">Today</div>
  <div class="tlist">${jobs.map(row).join("")}</div>

  <div class="eyebrow">Optional</div>
  <div class="tlist">
    <button class="trow" data-job="desk">
      <div class="mark ${deskN?"on":"opt"}">${deskN?ICONS.check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'}</div>
      <div class="bd"><div class="nm">Desk resets</div><div class="mt">${deskN?deskN+" done today":"90 seconds at work"}</div></div>
      <span class="go">＋ Add</span>
    </button>
    <button class="trow" data-job="session">
      <div class="mark opt"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></div>
      <div class="bd"><div class="nm">Build a session</div><div class="mt">Pick your own exercises</div></div>
      <span class="go">Build</span>
    </button>
  </div>`;

  const wb=$("#t-why"); if(wb) wb.onclick=()=> $("#t-whybox").classList.toggle("on");
  $("#t-daytype").onclick=()=> openDayOverride(today);
  $$("#view-today [data-job]").forEach(b=> b.onclick=()=>{
    const k=b.dataset.job;
    if(k==="routine") startRoutine(routine.id, today);
    else if(k==="class") isOwn? openSessionBuilder([], "Own training") : openClassLog(today);
    else if(k==="checkin") openLogForm(today);
    else if(k==="desk") show("today"), openDeskPicker();
    else if(k==="session") openSessionBuilder([], "Own session");
  });
}
function openDeskPicker(){
  openSheet("Desk resets",
    `<p class="sub" style="margin-bottom:12px">About 90 seconds. Tracked separately from training.</p>
     <div class="exl">${DESK_SETS.map(s=>`<button class="exi" data-ds="${s.id}" style="width:100%;text-align:left;font:inherit;color:inherit">
       <div class="bd"><div class="nm">${esc(s.name)}</div><div class="mt">${esc(s.note)}</div></div>
       <span class="go" style="color:var(--teal);font-size:.74rem;font-weight:700">Start</span></button>`).join("")}</div>`);
  $$("#sheet-body [data-ds]").forEach(b=> b.onclick=()=> openDeskSet(b.dataset.ds));
}

/* ---------- skill session picker + runner ---------- */
function openSkillPicker(skillId){
  const sk = skillById(skillId); if(!sk) return;
  const lvl = skillLevel(skillId);
  const dow = new Date().getDay();
  const clash = (dow===1||dow===4) ? "Heads up: today is a handstand class day, so your shoulders already get loaded hard. Nothing stopping you — just know this stacks on top." : "";
  openSheet(sk.name,
   `<div class="wrap" style="margin-bottom:12px">
      <span class="tag teal">Level ${lvl}</span>
      <span class="tag">${esc((sk.levels[lvl]||sk.levels[1]).name)}</span>
    </div>
    <p class="sub" style="font-size:.86rem;margin-bottom:12px">${esc(sk.goal)}</p>
    <div class="notice teal">${ICONS.info}<span><b>Where you are:</b> ${esc(sk.yourEdge)}</span></div>
    ${clash?`<div class="notice">${ICONS.info}<span>${esc(clash)}</span></div>`:""}
    <div class="sec"><div class="eyebrow">Pick your time budget</div>
      ${SKILL_PRESETS.map(p=>{
        const s = skillSession(skillId, p.id);
        return `<div class="media-opt" data-preset="${p.id}" style="cursor:pointer">
          <div class="mic">${p.mins}′</div>
          <div class="bd"><b>${esc(p.name)} — ${s.drills.length} drills</b><span>${esc(p.note)}</span></div>
          <span class="tag teal">Start</span>
        </div>`;}).join("")}
    </div>
    <div class="sec"><div class="eyebrow">Level ${lvl} chain — in priority order</div>
      <div class="exl">${(sk.levels[lvl]||sk.levels[1]).drills.map((d,i)=>{
        const e=exById(d.ex); if(!e) return "";
        return `<div class="exi" data-open-ex="${e.id}"><div class="ic">${i+1}</div>
          <div class="bd"><div class="nm">${esc(e.name)}</div><div class="mt">${d.sets}× ${d.hold||d.reps}${d.note?" · "+esc(d.note):""}</div></div>
          ${i<3?'<span class="tag teal">core</span>':''}</div>`;}).join("")}</div>
    </div>
    <div class="notice"><span style="font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:.62rem;display:block;margin-bottom:3px">Where coaches disagree</span>${esc(sk.debate)}</div>
    <div class="sec"><div class="eyebrow">Level</div>
      <p class="tiny" style="margin-bottom:8px">Estimated from your logged sessions. Override it if it's wrong.</p>
      <div class="wrap">${[1,2,3,4].map(n=>`<button class="chip ${n===lvl?"on":""}" data-setlvl="${n}">Level ${n}</button>`).join("")}</div>
    </div>`);
  $$("#sheet-body [data-preset]").forEach(el=> el.onclick=()=> startSkillSession(skillId, el.dataset.preset));
  $$("#sheet-body [data-open-ex]").forEach(el=> el.onclick=()=> openExercise(el.dataset.openEx, ()=>openSkillPicker(skillId)));
  $$("#sheet-body [data-setlvl]").forEach(b=> b.onclick=()=>{
    state.prefs.skillLevels = state.prefs.skillLevels||{};
    state.prefs.skillLevels[skillId] = +b.dataset.setlvl;
    save(); openSkillPicker(skillId); toast("Level set");
  });
}
let skillRun = null;
function startSkillSession(skillId, presetId){
  const s = skillSession(skillId, presetId); if(!s) return;
  skillRun = {skill:skillId, preset:presetId, done:new Set()};
  const body = s.drills.map((d,i)=>{
    const e=exById(d.ex); if(!e) return "";
    return `<div class="exi" data-i="${i}">
      <div class="check" data-chk="${i}">${ICONS.check}</div>
      <div class="bd" data-open-ex="${e.id}"><div class="nm">${esc(e.name)}</div>
        <div class="mt">${d.sets} set${d.sets>1?"s":""} · ${d.hold||d.reps}${d.note?" · "+esc(d.note):""}</div>
        <div class="tiny" style="margin-top:3px">${esc(e.cues.split(".")[0])}.</div></div>
      <span class="tag">${catAb(e.cats[0])}</span>
    </div>`;}).join("");
  openSheet(s.skill.short+" — "+s.preset.name,
    `<div class="row between" style="margin-bottom:12px">
       <span class="sub">Level ${s.level} · ${esc(s.levelName)} · ~${s.preset.mins} min</span>
       <span class="tag teal" id="sk-count">0 / ${s.drills.length}</span></div>
     <div class="exl">${body}</div>
     <div class="notice teal" style="margin-top:14px">${ICONS.info}<span>Drills are in priority order — the first three matter most if you run short on time.</span></div>`,
    `<button class="btn ghost" id="sk-cancel">Close</button>
     <button class="btn primary" style="flex:1" id="sk-finish">Finish & log</button>`);
  $$("#sheet-body [data-chk]").forEach(c=> c.onclick=()=>{
    const i=+c.dataset.chk;
    skillRun.done.has(i)?skillRun.done.delete(i):skillRun.done.add(i);
    c.classList.toggle("on"); c.closest(".exi").classList.toggle("done");
    $("#sk-count").textContent = skillRun.done.size+" / "+s.drills.length;
  });
  $$("#sheet-body [data-open-ex]").forEach(el=> el.onclick=()=> openExercise(el.dataset.openEx, ()=>startSkillSession(skillId, presetId)));
  $("#sk-cancel").onclick = closeSheet;
  $("#sk-finish").onclick = ()=>{
    const doneEx = [...skillRun.done].map(i=> s.drills[i].ex);
    openLogForm(todayISO(), {skillPre:{skill:skillId, preset:presetId, level:s.level, done:doneEx}});
  };
}


/* ============================================================
   Per-day swaps. Swapping affects TODAY only — the saved routine
   is never modified, so tomorrow is unchanged.
============================================================ */
function swapsFor(date){ return (state.daySwaps||{})[date||todayISO()] || {}; }
function applySwaps(items, date){
  const sw = swapsFor(date);
  return items.map(it=> sw[it.ex] ? Object.assign({}, it, {ex:sw[it.ex], _swappedFrom:it.ex}) : it);
}
function setSwap(date, fromId, toId){
  state.daySwaps = state.daySwaps || {};
  const d = state.daySwaps[date] = state.daySwaps[date] || {};
  if(toId && toId!==fromId) d[fromId] = toId; else delete d[fromId];
  if(!Object.keys(d).length) delete state.daySwaps[date];
  save();
}
/* Easier / Harder / Alternative, derived from the progression chains */
function swapOptions(exId){
  const ex = exById(exId); if(!ex) return {easier:null, harder:null, alts:[]};
  const chain = catProgression(ex.cats[0]);
  const i = chain.findIndex(x=>x.id===exId);
  const easier = i>0 ? chain[i-1] : null;
  const harder = i>=0 && i<chain.length-1 ? chain[i+1] : null;
  const alts = chain.filter(x=> x.id!==exId && x.level===ex.level
                && (!easier||x.id!==easier.id) && (!harder||x.id!==harder.id));
  return {easier, harder, alts};
}
function openSwapSheet(origId, date, back){
  const cur = exById(origId); if(!cur) return;
  const sw = swapsFor(date);
  const activeId = sw[origId] || origId;
  const {easier, harder, alts} = swapOptions(origId);
  const card = (e, label) => !e ? `<div class="swapcol"><div class="swaplbl">${label}</div>
      <div class="swapopt empty"><span class="tiny">None</span></div></div>`
    : `<div class="swapcol"><div class="swaplbl">${label}</div>
       <div class="swapopt ${activeId===e.id?"on":""}" data-swap="${e.id}">
         <div class="nm">${esc(e.name)}</div><span class="lv">${LEVELS[e.level].split(" · ")[0]}</span>
       </div></div>`;
  openSheet("Swap for today?",
   `<p class="sub" style="margin-bottom:4px">${esc(cur.name)}</p>
    <p class="tiny" style="margin-bottom:12px">${fmtDate(date)} only — your saved routine stays as it is.</p>
    <div class="swapgrid">
      ${card(easier,"Easier")}${card(harder,"Harder")}
      ${alts.length? card(alts[0],"Alternative") : card(null,"Alternative")}
    </div>
    ${alts.length>1? `<div class="wrap" style="margin-top:10px">${alts.slice(1).map(a=>`<button class="chip ${activeId===a.id?"on":""}" data-swap="${a.id}">${esc(a.name)}</button>`).join("")}</div>`:""}
    <label class="f">Or pick any drill</label>
    <select id="swap-any"><option value="">— search all ${EX_ALL().length} drills —</option>
      ${EX_ALL().filter(e=>!e.desk).map(e=>`<option value="${e.id}" ${activeId===e.id?"selected":""}>${esc(e.name)} · ${LEVELS[e.level].split(" · ")[0]}</option>`).join("")}
    </select>
    ${sw[origId]? `<div class="notice teal" style="margin-top:12px">${ICONS.info}<span>Currently swapped to <b>${esc((exById(sw[origId])||{}).name||"?")}</b> for today.</span></div>`:""}`,
   `${sw[origId]? '<button class="btn" id="swap-reset">Undo swap</button>':''}
    <button class="btn primary" style="flex:1" id="swap-keep">${sw[origId]?"Done":"Keep original"}</button>`,
   back);
  const choose = id=>{ setSwap(date, origId, id); closeSheet(); if(back) back(); else render(curView); toast("Swapped for today"); };
  $$("#sheet-body [data-swap]").forEach(b=> b.onclick=()=> choose(b.dataset.swap));
  $("#swap-any").onchange = e=>{ if(e.target.value) choose(e.target.value); };
  const rs=$("#swap-reset");
  if(rs) rs.onclick=()=>{ setSwap(date, origId, null); closeSheet(); if(back) back(); else render(curView); toast("Swap removed"); };
  $("#swap-keep").onclick=()=>{ closeSheet(); if(back) back(); };
}

/* ============================================================
   Routine runner + logging
============================================================ */
let run = null;
function startRoutine(id, date){
  const r = routineById(id); if(!r) return;
  date = date || todayISO();
  if(!run || run.rid!==id || run.date!==date) run = {rid:id, date:date, done:new Set()};
  renderRunner();
}
/* Re-rendered rather than rebuilt, so ticks survive opening a drill and coming back. */
function renderRunner(){
  if(!run) return;
  const r = routineById(run.rid); if(!r) return;
  const items = applySwaps(r.items, run.date);
  const body = items.map((it,i)=>{
    const ex=exById(it.ex); if(!ex) return "";
    const done = run.done.has(i);
    return `<div class="exi ${done?"done":""}" data-i="${i}">
      <div class="check ${done?"on":""}" data-chk="${i}">${ICONS.check}</div>
      <div class="bd" data-open-ex="${ex.id}"><div class="nm">${esc(ex.name)}${it._swappedFrom?' <span class="tag teal">swapped</span>':''}</div>
        <div class="mt">${it.sets} set${it.sets>1?"s":""} · ${it.hold&&it.hold!=="—"?esc(it.hold)+" hold":esc(it.reps)+" reps"}${it.note?" · "+esc(it.note):""}</div>
        <div class="tiny" style="margin-top:3px">${esc((ex.cues||"").split(".")[0])}.</div></div>
      <button class="iconbtn" style="width:32px;height:32px" data-swapbtn="${it._swappedFrom||it.ex}" aria-label="Swap this drill">⇄</button>
    </div>`;
  }).join("");
  openSheet(r.name,
    `<div class="row between" style="margin-bottom:12px">
       <span class="sub">${r.minutes} min · ${FATIGUE_LBL[r.fatigue]||r.fatigue}</span>
       <span class="tag teal" id="run-count">${run.done.size} / ${items.length}</span></div>
     <div class="exl">${body}</div>
     <div class="notice teal" style="margin-top:14px">${ICONS.info}<span>Tap a name for cues and video. Tap ⇄ to swap a drill for today only.</span></div>`,
    `<button class="btn ghost" id="run-cancel">Close</button>
     <button class="btn primary" style="flex:1" id="run-finish">Finish & log</button>`);
  $$("#sheet-body [data-chk]").forEach(cb=> cb.onclick=()=>{
    const i=+cb.dataset.chk;
    run.done.has(i)?run.done.delete(i):run.done.add(i);
    cb.classList.toggle("on"); cb.closest(".exi").classList.toggle("done");
    $("#run-count").textContent = run.done.size+" / "+items.length;
  });
  $$("#sheet-body [data-open-ex]").forEach(el=> el.onclick=()=> openExercise(el.dataset.openEx, renderRunner));
  $$("#sheet-body [data-swapbtn]").forEach(b=> b.onclick=()=> openSwapSheet(b.dataset.swapbtn, run.date, renderRunner));
  $("#run-cancel").onclick = ()=>{ run=null; closeSheet(); };
  $("#run-finish").onclick = ()=>{
    const doneEx = [...run.done].map(i=> items[i] && items[i].ex).filter(Boolean);
    openLogForm(run.date, {routineId:run.rid, done:doneEx});
  };
}

const FEEL = [["rough","Rough","Wrecked, sore, or run down",3],
              ["ok","Normal","Nothing special either way",6],
              ["good","Good","Fresh and moving well",8]];
const TIGHT = ["Lats","Pecs","Upper traps","T-spine","Wrists","Neck","Low back","Hips","Hamstrings"];
function openLogForm(date, pre={}){
  const ex0 = logByDate(date);
  const skillPre = pre.skillPre; delete pre.skillPre;
  const d = Object.assign({date, routineId:"", done:[], feel:"ok", tight:[], pain:"", notes:"", skills:[]}, ex0||{}, pre);
  d.skills = (d.skills||[]).slice();
  if(skillPre){
    d.skills = d.skills.filter(s=> s.skill!==skillPre.skill)
                       .concat([{skill:skillPre.skill, preset:skillPre.preset, level:skillPre.level, metric:""}]);
    d.done = [...new Set([...(d.done||[]), ...skillPre.done])];
  }
  const tightChips = TIGHT.map(t=>`<button class="chip ${d.tight.includes(t)?"on":""}" data-tt="${t}">${t}</button>`).join("");
  const doneNames = (d.done||[]).map(id=>(exById(id)||{}).name).filter(Boolean);
  openSheet("How did today go? — "+fmtDate(date),
   `<label class="f">Date</label><input type="date" id="lg-date" value="${d.date}" max="${todayISO()}">

    <label class="f">How did it feel?</label>
    <div class="feelrow">${FEEL.map(f=>`<button class="feel ${d.feel===f[0]?"on":""}" data-feel="${f[0]}">
        <b>${f[1]}</b><span>${f[2]}</span></button>`).join("")}</div>

    ${doneNames.length?`<div class="notice teal" style="margin-top:14px">${ICONS.check}<span>${doneNames.length} drill${doneNames.length!==1?"s":""} ticked in your block: ${esc(doneNames.slice(0,4).join(", "))}${doneNames.length>4?" and "+(doneNames.length-4)+" more":""}</span></div>`:""}

    ${d.skills.length? `<div class="sec" style="margin-top:16px"><div class="eyebrow teal">Skill work today</div>
      ${d.skills.map((s,i)=>{ const sk=skillById(s.skill)||treeById(s.skill); if(!sk) return "";
        return `<div class="card" style="padding:13px 14px;margin-bottom:10px">
          <b style="font-size:.9rem">${esc(sk.name)}</b>
          <input type="text" data-skm="${i}" placeholder="Best result — e.g. 12 s" value="${esc(s.metric||"")}" style="margin-top:8px">
          <button class="btn small danger" style="margin-top:10px" data-skrm="${i}">Remove</button>
        </div>`;}).join("")}</div>` : ""}

    <label class="f">Anything tight?</label><div class="wrap">${tightChips}</div>
    <label class="f">Pain or discomfort</label>
    <input type="text" id="lg-pain" placeholder="e.g. slight pinch left front delt" value="${esc(d.pain)}">
    <label class="f">Notes</label>
    <textarea id="lg-notes" placeholder="What changed? What limited you?">${esc(d.notes)}</textarea>`,
   `${ex0?'<button class="btn danger" id="lg-del">Delete</button>':""}
    <button class="btn primary" style="flex:1" id="lg-save">Save</button>`);
  let feel=d.feel;
  const tightSet=new Set(d.tight), skillsArr=d.skills.map(s=>Object.assign({},s));
  $$("#sheet-body [data-feel]").forEach(b=> b.onclick=()=>{
    feel=b.dataset.feel; $$("#sheet-body [data-feel]").forEach(x=>x.classList.toggle("on", x.dataset.feel===feel)); });
  $$("#sheet-body [data-tt]").forEach(cb=> cb.onclick=()=>{ const t=cb.dataset.tt;
    tightSet.has(t)?tightSet.delete(t):tightSet.add(t); cb.classList.toggle("on"); });
  $$("#sheet-body [data-skm]").forEach(inp=> inp.oninput=e=>{ skillsArr[+inp.dataset.skm].metric=e.target.value; });
  $$("#sheet-body [data-skrm]").forEach(b=> b.onclick=()=>{ skillsArr.splice(+b.dataset.skrm,1);
    openLogForm(date, Object.assign({},d,{skills:skillsArr, feel:feel, tight:[...tightSet]})); });
  if(ex0) $("#lg-del").onclick=()=>{ state.logs=state.logs.filter(l=>l.date!==date); save(); closeSheet(); render(curView); toast("Deleted"); };
  $("#lg-save").onclick=()=>{
    const nd=$("#lg-date").value||date;
    const entry={date:nd, routineId:d.routineId, done:d.done||[], feel:feel,
      energy:(FEEL.find(f=>f[0]===feel)||FEEL[1])[3], tight:[...tightSet],
      pain:$("#lg-pain").value.trim(), notes:$("#lg-notes").value.trim(), skills:skillsArr};
    state.logs=state.logs.filter(l=> l.date!==nd && l.date!==date);
    state.logs.push(entry); state.logs.sort((a,b)=>a.date<b.date?-1:1);
    save(); closeSheet(); render(curView); toast("Saved ✓");
  };
}


/* ============================================================
   SCHEDULE EDITOR — the week is user-owned, not baked in.
============================================================ */
function openScheduleEditor(){
  const sch = getSchedule();
  const order=[1,2,3,4,5,6,0];
  openSheet("Your week",
   `<p class="sub" style="margin-bottom:12px">Set what you actually do each day. The app adapts its support blocks to it.</p>
    ${order.map(d=>{ const p2=sch.find(s=>s.dow===d)||{};
      const k=DAY_KINDS.find(x=>x.id===p2.kind)||DAY_KINDS[5];
      return `<button class="exi" data-eday="${d}" style="width:100%;text-align:left;font:inherit;color:inherit;margin-bottom:8px">
        <div class="ic">${p2.day.slice(0,3).toUpperCase()}</div>
        <div class="bd"><div class="nm">${esc(p2.cls||"—")}</div>
          <div class="mt">${esc(k.name)} · ${esc((routineById(p2.routine)||{}).name||"no block")}</div></div>
        <span class="go" style="color:var(--teal);font-size:.72rem;font-weight:700">Edit</span>
      </button>`;}).join("")}
    <button class="btn ghost block" style="margin-top:10px" id="sch-reset">Reset to the default week</button>`);
  $$("#sheet-body [data-eday]").forEach(b=> b.onclick=()=> openDayEditor(+b.dataset.eday));
  $("#sch-reset").onclick=()=>{
    state.schedule=null; state.meta_schedU=Date.now(); save(); closeSheet(); render(curView); toast("Week reset"); };
}
function openDayEditor(dow){
  const p2 = planFor(dow);
  openSheet(p2.day,
   `<label class="f">What happens this day</label>
    <input type="text" id="ed-cls" value="${esc(p2.cls)}" placeholder="e.g. Handstands, Rest, Own training">
    <label class="f">Kind of day</label>
    <div class="exl">${DAY_KINDS.map(k=>`
      <button class="exi" data-ek="${k.id}" style="width:100%;text-align:left;font:inherit;color:inherit;${p2.kind===k.id?"border-color:var(--teal)":""}">
        <div class="bd"><div class="nm">${k.name}</div><div class="mt">${k.note}</div></div>
        ${p2.kind===k.id?'<span class="tag teal">now</span>':""}</button>`).join("")}</div>
    <label class="f">Support block</label>
    <select id="ed-routine"><option value="">— none —</option>
      ${state.routines.map(r=>`<option value="${r.id}" ${r.id===p2.routine?"selected":""}>${esc(r.name)} · ${r.minutes} min</option>`).join("")}</select>
    <label class="f">Why this block, on this day</label>
    <textarea id="ed-why" placeholder="Shown on Today so future-you remembers the reasoning">${esc(p2.why||"")}</textarea>`,
   `<button class="btn ghost" id="ed-back">Back</button>
    <button class="btn primary" style="flex:1" id="ed-save">Save day</button>`,
   ()=>openScheduleEditor());
  let kind=p2.kind;
  $$("#sheet-body [data-ek]").forEach(b=> b.onclick=()=>{
    kind=b.dataset.ek;
    $$("#sheet-body [data-ek]").forEach(x=> x.style.borderColor = x.dataset.ek===kind?"var(--teal)":"");
  });
  $("#ed-back").onclick=()=>openScheduleEditor();
  $("#ed-save").onclick=()=>{
    const rid=$("#ed-routine").value;
    const r=routineById(rid);
    setPlan(dow, {cls:$("#ed-cls").value.trim()||p2.cls, kind:kind, routine:rid,
      why:$("#ed-why").value.trim(), time:r?r.minutes+" min":"—",
      fatigue:r?(FATIGUE_LBL[r.fatigue]||r.fatigue):"None",
      focus:r?r.name:"No block"});
    openScheduleEditor(); render(curView); toast("Day updated");
  };
}

/* ============================================================
   WEEK view
============================================================ */
let weekTab = "days";
function renderWeek(){
  if(weekTab==="routines") return renderRoutinesList();
  const dow = new Date().getDay();
  const order = [1,2,3,4,5,6,0];
  $("#view-week").innerHTML = `
   <div class="segrow"><button class="seg on" data-wt="days">Week</button><button class="seg" data-wt="routines">Routines</button></div>
   <div class="row between" style="margin-bottom:12px;gap:10px">
     <div class="eyebrow" style="flex:1;margin:0">Your week</div>
     <button class="btn small" id="wk-edit">Edit week</button></div>
   ${order.map(i=>{
     const p=planFor(i); const r=routineById(p.routine);
     return `<div class="dayc ${i===dow?"today":""}">
       <div class="rail"><div class="dd">${p.day.slice(0,3).toUpperCase()}</div><div class="dot"></div><div class="stem"></div></div>
       <div class="card" data-day="${i}">
         <div class="row between"><div class="h-md">${esc(p.cls)}</div>${i===dow?'<span class="tag teal">Today</span>':""}</div>
         <div class="sub" style="margin:3px 0 9px">${esc(p.focus)}</div>
         <div class="wrap">
           <span class="tag teal">${esc(p.time)}</span>
           <span class="tag">${esc(p.fatigue)} cost</span>
           ${r?`<span class="tag amber">${esc(r.name)}</span>`:""}
         </div>
         <div class="kv" style="margin-top:9px;border:none;padding-bottom:0"><b>Key goal</b><span>${esc(p.goal)}</span></div>
       </div></div>`;
   }).join("")}`;
  $$("#view-week [data-wt]").forEach(b=> b.onclick=()=>{ weekTab=b.dataset.wt; renderWeek(); });
  const we=$("#wk-edit"); if(we) we.onclick=()=> openScheduleEditor();
  $$("#view-week [data-day]").forEach(el=> el.onclick=()=> openWeekDay(+el.dataset.day));
}

function renderRoutinesList(){
  $("#view-week").innerHTML = `
   <div class="segrow"><button class="seg" data-wt="days">Week</button><button class="seg on" data-wt="routines">Routines</button></div>
   <div class="row between" style="margin-bottom:12px;gap:10px">
     <div class="eyebrow" style="flex:1;margin:0">Your routines</div>
     <button class="btn small primary" id="rt-new">＋ New</button>
   </div>
   ${state.routines.map(r=>{
     const days=(r.days||[]).map(d=>planFor(d).day.slice(0,3)).join(" ");
     return `<div class="card">
       <div class="row between" style="gap:10px">
         <div style="flex:1;min-width:0"><div class="h-md">${esc(r.name)}</div>
           <div class="sub" style="font-size:.78rem;margin-top:2px">${esc(r.useCase||"")}</div></div>
         <span class="tag ${r.seeded&&!r.edited?"":"teal"}">${r.seeded&&!r.edited?"seeded":"custom"}</span>
       </div>
       <div class="wrap" style="margin-top:9px">
         <span class="tag teal">${r.minutes} min</span><span class="tag">${FATIGUE_LBL[r.fatigue]}</span>
         <span class="tag">${r.items.length} drills</span>${days?`<span class="tag amber">${days}</span>`:""}
       </div>
       <div class="exl" style="margin-top:10px">${r.items.slice(0,4).map((it,i)=>{
         const e=exById(it.ex); if(!e) return "";
         return `<div class="exi" style="padding:8px 10px" data-rex="${e.id}">
           <div class="ic" style="width:26px;height:26px;font-size:.66rem">${i+1}</div>
           <div class="bd"><div class="nm" style="font-size:.83rem">${esc(e.name)}</div>
           <div class="mt">${it.sets}× ${it.hold&&it.hold!=="—"?esc(it.hold):esc(it.reps)}</div></div></div>`;}).join("")}
         ${r.items.length>4?`<div class="tiny" style="padding-left:4px">+ ${r.items.length-4} more</div>`:""}</div>
       <div class="row" style="margin-top:11px;gap:7px;flex-wrap:wrap">
         <button class="btn small primary" data-rstart2="${r.id}">${ICONS.play}Start</button>
         <button class="btn small" data-redit2="${r.id}">Edit</button>
         <button class="btn small" data-rdup2="${r.id}">Duplicate</button>
         <button class="btn small danger" data-rdel2="${r.id}">Delete</button>
       </div></div>`;}).join("")}`;
  $$("#view-week [data-wt]").forEach(b=> b.onclick=()=>{ weekTab=b.dataset.wt; renderWeek(); });
  $$("#view-week [data-rex]").forEach(el=> el.onclick=()=> openExercise(el.dataset.rex));
  $$("#view-week [data-rstart2]").forEach(b=> b.onclick=()=> startRoutine(b.dataset.rstart2));
  $$("#view-week [data-redit2]").forEach(b=> b.onclick=()=>{
    const r=routineById(b.dataset.redit2);
    draft={name:r.name,minutes:r.minutes,fatigue:r.fatigue,days:(r.days||[]).slice(),
           items:JSON.parse(JSON.stringify(r.items)),editingId:r.id};
    show("builder"); window.scrollTo({top:0}); });
  $$("#view-week [data-rdup2]").forEach(b=> b.onclick=()=>{
    const r=routineById(b.dataset.rdup2);
    state.routines.push(Object.assign(JSON.parse(JSON.stringify(r)),
      {id:"r-"+Date.now().toString(36), name:r.name+" (copy)", seeded:false, edited:false}));
    save(); renderRoutinesList(); toast("Duplicated"); });
  $$("#view-week [data-rdel2]").forEach(b=> b.onclick=()=>{
    const r=routineById(b.dataset.rdel2);
    openSheet("Delete routine?", `<p class="sub">“${esc(r.name)}” will be removed.</p>`,
      `<button class="btn ghost" id="rd-no">Keep</button><button class="btn danger" style="flex:1" id="rd-yes">Delete</button>`);
    $("#rd-no").onclick=closeSheet;
    $("#rd-yes").onclick=()=>{ state.routines=state.routines.filter(x=>x.id!==r.id); save(); closeSheet(); renderRoutinesList(); toast("Deleted"); }; });
  $("#rt-new").onclick=()=>{ draft={name:"",items:[],editingId:null,minutes:10,fatigue:"low",days:[]}; show("builder"); };
}
function openWeekDay(dow){
  const p = planFor(dow), r = routineById(p.routine);
  if(!r) return;
  openSheet(p.day+" — recommended block",
    `<p class="sub" style="margin-bottom:12px">${esc(p.why)}</p>
     <div class="eyebrow teal" style="margin-bottom:10px">${esc(r.name)} · ${r.minutes} min · ${FATIGUE_LBL[r.fatigue]}</div>
     <div class="exl">${r.items.map((it,ix)=>{
       const e=exById(it.ex); if(!e) return "";
       return `<div class="exi" data-open-ex="${e.id}"><div class="ic">${String(ix+1).padStart(2,"0")}</div>
         <div class="bd"><div class="nm">${esc(e.name)}</div>
         <div class="mt">${it.sets}× ${it.hold&&it.hold!=="—"?esc(it.hold):esc(it.reps)}</div></div>
         <span class="tag">${catAb(e.cats[0])}</span></div>`;}).join("")}</div>`,
    `<button class="btn primary block" id="wk-start">${ICONS.play}Start this block</button>`);
  $("#wk-start").onclick=()=> startRoutine(r.id);
  $$("#sheet-body [data-open-ex]").forEach(el=> el.onclick=()=> openExercise(el.dataset.openEx, ()=>openWeekDay(dow)));
}
/* ============================================================
   LIBRARY view — exercise cards, filters, favorites, media prefs
============================================================ */
let lib = {q:"", cat:"", when:"", fat:"", fav:false, review:false, desk:false, ref:false, showFilters:false, mode:"browse"};
function exerciseUsage(){
  const m={}; state.logs.forEach(l=> (l.done||[]).forEach(id=> m[id]=(m[id]||0)+1)); return m;
}
const lvlBadge = lvl => `<span class="tag" style="background:var(--surface2)">Lv ${lvl}</span>`;
let libCat = null, libSub = null;
function renderLibrary(){
  if(lib.mode==="progression"){ renderLibraryProgression(exerciseUsage()); return; }
  if(libCat) return renderLibraryCategory();
  const usage = exerciseUsage();
  // search cuts across everything
  if(lib.q.trim()){
    const q=lib.q.toLowerCase();
    const drills = EX_ALL().filter(e=> (e.name+" "+(e.targets||"")).toLowerCase().includes(q));
    const dn = new Set(drills.map(d=>d.name.toLowerCase()));
    const moves = searchCatalog(lib.q).filter(m=>!dn.has(m.name.toLowerCase()));
    $("#view-library").innerHTML = libSearchBar() +
      `<div class="eyebrow" style="margin:16px 0 9px">Your drills · ${drills.length}</div>
       <div class="exl">${drills.map(e=>drillRow(e,usage)).join("")||'<p class="tiny">None.</p>'}</div>
       <div class="eyebrow" style="margin:20px 0 9px">Movements · ${moves.length}</div>
       <div class="exl">${moves.map(refRow).join("")||'<p class="tiny">None.</p>'}</div>`;
    bindLibrary();
    return;
  }
  $("#view-library").innerHTML = libSearchBar() +
    `${needsReview().length? `<button class="btn small block" id="lib-review" style="margin-bottom:12px">⚑ ${needsReview().length} drills need a video check</button>`:""}
     <div class="catgrid">${TAXONOMY.map(t=>{
       const n = taxContents(t.id);
       return `<button class="ccard" data-tax="${t.id}">
         <div class="figs">${taxMap(t,86)}</div>
         <h3>${esc(t.name)}</h3>
         <div class="n">${n.drills.length} drill${n.drills.length!==1?"s":""} · ${n.moves.length} movement${n.moves.length!==1?"s":""}</div>
         <div class="subs">${(t.subs||[]).slice(0,4).map(s=>`<span>${esc(s.name)}</span>`).join("")}</div>
       </button>`;}).join("")}</div>
     <div class="notice teal" style="margin-top:14px">${ICONS.info}<span>Tap a category to see every drill and movement in it. Teal shows what it trains; amber shows what it lengthens.</span></div>`;
  bindLibrary();
}
function libSearchBar(){
  return `<div class="searchbar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
    <input type="text" id="lib-q" placeholder="Search ${EX_ALL().length + catalogFlat().length} drills and movements…" value="${esc(lib.q)}"></div>`;
}
function drillRow(e, usage){
  const upgraded=(state.prefs.upgradesInUse[e.id]||[]).length>0;
  const v=vidFor(e.id), vrev = v && v.status!=="ok";
  return `<div class="exi">
    <div class="ic">${catAb(e.cats[0])}</div>
    <div class="bd" data-open-ex="${e.id}">
      <div class="nm">${esc(e.name)}${upgraded?' <span class="tag teal">upgraded</span>':''}${vrev?' <span class="tag amber">video?</span>':''}${e.custom?' <span class="tag">yours</span>':''}</div>
      <div class="mt">${e.cats.map(catName).join(" · ")}${usage&&usage[e.id]?` · used ${usage[e.id]}×`:""}</div>
    </div>
    <span class="tag">Lv ${e.level}</span>
    <button class="fav ${state.prefs.favs.includes(e.id)?"on":""}" data-fav="${e.id}" aria-label="Favorite" style="width:32px">${ICONS.star}</button>
  </div>`;
}
function refRow(m){
  const used=(state.classLogs||[]).reduce((n,cl)=>n+(cl.items||[]).filter(i=>i.name===m.name).length,0);
  return `<div class="exi ref" data-ref="${esc(m.name)}">
    <div class="ic" style="background:var(--surface2);color:var(--faint)">${m.lvl||"–"}</div>
    <div class="bd"><div class="nm">${esc(m.name)}</div><div class="mt">${esc(m.fam)}${used?` · logged ${used}×`:""}</div></div>
    <span class="tag">ref</span></div>`;
}
function renderLibraryCategory(){
  const t=taxById(libCat), usage=exerciseUsage();
  const {drills,moves}=taxContents(libCat, libSub);
  $("#view-library").innerHTML = `
    <button class="backbar" id="lib-back">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg>
      All categories</button>
    <div class="cathead">
      <div class="figs">${taxMap(t,96)}</div>
      <div><h2>${esc(t.name)}</h2><p class="sub" style="font-size:.82rem">${esc(t.blurb)}</p></div>
    </div>
    <div class="chiprow" style="margin-top:12px">
      <button class="chip ${!libSub?"on":""}" data-sub="">All</button>
      ${(t.subs||[]).map(s=>`<button class="chip ${libSub===s.id?"on":""}" data-sub="${s.id}">${esc(s.name)}</button>`).join("")}
    </div>
    <div class="eyebrow" style="margin:14px 0 9px">Your drills · ${drills.length}</div>
    <div class="exl">${drills.length? drills.map(e=>drillRow(e,usage)).join("")
      : '<p class="tiny">No detailed drills here yet — promote a movement below to build one.</p>'}</div>
    <div class="eyebrow" style="margin:20px 0 9px">Movements · ${moves.length}</div>
    <div class="exl">${moves.length? moves.map(refRow).join("") : '<p class="tiny">None.</p>'}</div>`;
  bindLibrary();
}
function bindLibrary(){
  const q=$("#lib-q");
  if(q) q.oninput=e=>{ lib.q=e.target.value; libCat=null; libSub=null; renderLibrary();
    const n=$("#lib-q"); if(n){ n.focus(); n.setSelectionRange(n.value.length,n.value.length); } };
  $$("#view-library [data-tax]").forEach(b=> b.onclick=()=>{ libCat=b.dataset.tax; libSub=null; renderLibrary(); window.scrollTo({top:0}); });
  $$("#view-library [data-sub]").forEach(b=> b.onclick=()=>{ libSub=b.dataset.sub||null; renderLibraryCategory(); });
  const bk=$("#lib-back"); if(bk) bk.onclick=()=>{ libCat=null; libSub=null; renderLibrary(); };
  const rv=$("#lib-review"); if(rv) rv.onclick=()=>{ lib.q=""; libCat=null; renderLibraryReview(); };
  $$("#view-library [data-open-ex]").forEach(el=> el.onclick=()=> openExercise(el.dataset.openEx));
  $$("#view-library [data-ref]").forEach(el=> el.onclick=()=> openRefMove(el.dataset.ref));
  $$("#view-library [data-fav]").forEach(b=> b.onclick=(ev)=>{ ev.stopPropagation();
    const id=b.dataset.fav, f=state.prefs.favs;
    f.includes(id)? state.prefs.favs=f.filter(x=>x!==id) : f.push(id);
    save(); renderLibrary(); });
}
function renderLibraryReview(){
  const list=needsReview();
  $("#view-library").innerHTML = `
    <button class="backbar" id="lib-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg>All categories</button>
    <div class="eyebrow" style="margin:14px 0 9px">Video check · ${list.length}</div>
    <div class="exl">${list.map(e=>drillRow(e,exerciseUsage())).join("")}</div>`;
  bindLibrary();
}
function renderLibraryProgression(usage){
  const cats = lib.cat ? CATS.filter(c=>c.id===lib.cat) : CATS;
  $("#view-library").innerHTML = `
    <div class="chiprow">
      <button class="chip on" id="lib-mode">☰ By category</button>
      ${CATS.map(c=>`<button class="chip ${lib.cat===c.id?"on":""}" data-fc="${c.id}">${c.name}</button>`).join("")}
    </div>
    <div class="notice teal">${ICONS.info}<span>Each bottleneck is ordered Level 1 (foundation) → 4 (loaded/advanced). Your step is estimated from your last 14 days of overhead-mobility logs.</span></div>
    ${cats.map(c=>{
      const chain = catProgression(c.id);
      if(!chain.length) return "";
      const rec = recommendedLevel(c.id);
      return `<div class="sec"><div class="eyebrow teal">${c.name}</div>
        <div class="exl">${chain.map(e=>`
          <div class="exi ${e.level===rec?"":""}" style="${e.level===rec?"border-color:var(--teal)":""}" data-open-ex="${e.id}">
            <div class="ic">${e.level}</div>
            <div class="bd"><div class="nm">${esc(e.name)}${e.level===rec?' <span class="tag teal" style="margin-left:4px">your step</span>':''}</div>
            <div class="mt">${LEVELS[e.level]}${usage[e.id]?` · used ${usage[e.id]}×`:""}</div></div>
          </div>`).join("")}</div>
      </div>`;
    }).join("")}`;
  $("#lib-mode").onclick = ()=>{ lib.mode="browse"; renderLibrary(); };
  $$("#view-library [data-fc]").forEach(b=> b.onclick=()=>{ lib.cat = lib.cat===b.dataset.fc?"":b.dataset.fc; renderLibrary(); });
  $$("#view-library [data-open-ex]").forEach(el=> el.onclick=()=> openExercise(el.dataset.openEx));
}


function openRefMove(name){
  const all = catalogFlat().find(x=>x.name===name) || {name:name, fam:"—", lvl:0};
  const uses = [];
  (state.classLogs||[]).forEach(cl=> (cl.items||[]).forEach(it=>{ if(it.name===name) uses.push({d:cl.date, n:it.numbers, a:it.assist}); }));
  const inTrees = TREES.filter(t=> t.stages.some(s=>(s.match||[]).includes(name)) ||
    t.support.strength.includes(name) || t.support.mobility.includes(name));
  openSheet(name,
   `<div class="wrap" style="margin-bottom:12px">
      <span class="tag">${esc(all.fam)}</span>${all.lvl?`<span class="tag">Level ${all.lvl}</span>`:""}
      <span class="tag amber">Reference only</span>
    </div>
    <div class="notice teal">${ICONS.info}<span>This is a catalog movement — it exists so you can log it. It has no steps or video yet. Promote it to a full drill when it becomes part of your training.</span></div>
    ${uses.length?`<div class="sec" style="margin-top:16px"><div class="eyebrow">Your history</div>
      <div class="card">${uses.slice(-8).reverse().map(u=>`<div class="kv"><b>${fmtDate(u.d)}</b><span>${esc(u.n||"—")}${u.a&&u.a!=="none"?" · "+esc((ASSIST.find(a=>a[0]===u.a)||[])[1]||""):""}</span></div>`).join("")}</div></div>`
      :`<p class="tiny" style="margin-top:14px">Not logged yet.</p>`}
    ${inTrees.length?`<div class="sec"><div class="eyebrow">Feeds into</div>
      <div class="wrap">${inTrees.map(t=>`<button class="chip" data-gotree="${t.id}">${esc(t.name)}</button>`).join("")}</div></div>`:""}`,
   `<button class="btn primary block" id="ref-promote">${ICONS.build}Promote to a full drill</button>`);
  $$("#sheet-body [data-gotree]").forEach(b=> b.onclick=()=> openTree(b.dataset.gotree));
  $("#ref-promote").onclick=()=>{ closeSheet(); show("builder"); openDrillEditor(); setTimeout(()=>{ const f=$("#dl-name"); if(f) f.value=name; },60); };
}
function mediaList(e){
  const list = e.media.slice();
  const custom = state.prefs.customMedia[e.id];
  if(custom) list.push({t:"custom", label:"My saved resource", src:"Custom link", url:custom});
  return list;
}
function openSheetEx(t,b,f,back){ openSheet(t,b,f,back); }
function openExercise(id, back){
  const e = exById(id); if(!e) return;
  const prefIx = state.prefs.media[id] ?? 0;
  const media = mediaList(e);
  const sect=(t,v)=>`<div class="kv"><b>${t}</b><span>${esc(v)}</span></div>`;
  const chain = catProgression(e.cats[0]);
  const idx = chain.findIndex(x=>x.id===e.id);
  const prev = idx>0 ? chain[idx-1] : null, next = idx<chain.length-1 ? chain[idx+1] : null;
  const V = vidFor(id);
  const vidHTML = !V ? "" : (!V.yt ? `
    <div class="vidwrap">
      <div class="vidmissing">${ICONS.vid}<div><b>No video picked yet</b><div class="tiny" style="margin-top:2px">${esc(V.why||"")}</div></div></div>
      <div class="row" style="margin-top:9px;gap:8px">
        <input type="text" id="v-custom" placeholder="Paste a YouTube link…" style="flex:1;padding:9px 11px">
        <button class="btn small" id="v-save">Use</button>
      </div>
    </div>` : `
    <div class="vidwrap">
      <div class="vidbox" id="vidbox">
        <img src="https://img.youtube.com/vi/${V.yt}/maxresdefault.jpg"
             data-yt="${V.yt}" data-nm="${esc(e.name)}" onerror="vidThumbFail(this)" alt="">
        <div class="vidplay" id="v-play"><i>${ICONS.play}</i></div>
        ${V.start? `<div class="vidstamp">▶ ${mmss(V.start)}</div>`:""}
        ${V.status!=="ok"? `<div class="vidflag">Needs your review</div>`:""}
      </div>
      <div class="row between" style="margin-top:7px;padding:0 2px;gap:8px">
        <span class="tiny" style="flex:1;min-width:0">${esc(V.title)} · ${esc(V.src)}</span>
        <a href="https://www.youtube.com/watch?v=${V.yt}${V.start?"&t="+V.start+"s":""}" target="_blank" rel="noopener"
           style="color:var(--teal);font-size:.74rem;font-weight:700;text-decoration:none">YouTube ↗</a>
      </div>
      ${V.status!=="ok"? `<div class="notice" style="margin-top:9px">${ICONS.info}<span>${esc(V.why||"Needs confirming.")}</span></div>`:""}
      <div class="row" style="margin-top:9px;gap:8px;flex-wrap:wrap">
        <input type="text" id="v-time" placeholder="start m:ss" value="${V.start?mmss(V.start):""}" style="width:104px;padding:9px 11px">
        <button class="btn small" id="v-settime">Set start</button>
        ${V.status!=="ok"? `<button class="btn small primary" id="v-confirm">Looks right ✓</button>`:""}
      </div>
      <div class="row" style="margin-top:7px;gap:8px">
        <input type="text" id="v-custom" placeholder="Or paste a better YouTube link…" style="flex:1;padding:9px 11px">
        <button class="btn small" id="v-save">Swap</button>
      </div>
    </div>`);
  const HT = howTo(id);
  const {easier, harder} = swapOptions(id);
  const acc = (icon,title,count,inner,openByDefault)=> `
    <div class="acc${openByDefault?" open":""}"><button data-acc>
      <div class="ic">${icon}</div><span class="t">${title}</span>
      ${count?`<span class="n">${count}</span>`:""}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>
    </button><div class="inner">${inner}</div></div>`;
  const navRow = (d,dir)=> d
    ? `<button class="navrow" data-go="${d.id}">
         <span class="dir ${dir==="Harder"?"up":"down"}">${dir}</span>
         <span class="bd"><b>${esc(d.name)}</b><i>${esc(LEVELS[d.level])}</i></span>
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m9 6 6 6-6 6"/></svg>
       </button>`
    : `<button class="navrow" data-go="none"><span class="dir down">${dir}</span>
         <span class="bd"><b>${dir==="Harder"?"Top of the chain":"Start of the chain"}</b><i>${esc(dir==="Harder"?e.progression:e.regression)}</i></span></button>`;
  openSheetEx(e.name,
   vidHTML +
   `<div class="wrap" style="margin-bottom:12px">
      <span class="tag teal">${LEVELS[e.level]}</span>
      ${e.cats.map(x=>`<span class="tag">${catName(x)}</span>`).join("")}
      <span class="tag">${FATIGUE_LBL[e.fatigue]}</span>
      ${e.when.map(w=>`<span class="tag amber">${WHEN[w]}</span>`).join("")}
    </div>
    ${e.discreet==="obvious"?`<div class="notice" style="margin-bottom:2px">${ICONS.info}<span>${esc(e.discreetNote)}</span></div>`:""}

    <div class="keybox">
      <p class="desc">${esc(HT? HT.desc : e.targets)}</p>
      ${HT? `<div class="keyhd">How to do it</div>
        <ol class="steps">${HT.steps.map(s=>`<li>${esc(s)}</li>`).join("")}
          ${HT.check?`<li class="warn">${esc(HT.check)}</li>`:""}</ol>` : ""}
      <div class="keyline"${HT?' style="margin-top:14px"':''}><b>Dosage</b><span>${esc(e.dosage)}</span></div>
      <div class="keyline"><b>Cues</b><span>${esc(e.cues)}</span></div>
    </div>

    ${acc(ICONS.info,"Watch out for", (e.mistakes.match(/;/g)||[]).length+1,
      `<ul class="bul">${e.mistakes.split(";").map(x=>`<li>${esc(x.trim())}</li>`).join("")}</ul>`)}

    ${acc('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M5 10l7-7 7 7"/></svg>',
      "Why it helps your handstand","",`<p style="font-size:.86rem">${esc(e.why)}</p>`)}

    ${acc('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20 20 4M14 4h6v6"/></svg>',
      "Making it harder or easier","",
      navRow(harder,"Harder")+navRow(easier,"Easier")+
      `<div class="sec" style="margin-top:12px"><div class="eyebrow teal" style="margin-bottom:8px">Upgrades</div>
       ${e.upgrades.map((u,i)=>{
         const inUse=(state.prefs.upgradesInUse[id]||[]).includes(i);
         return `<div class="media-opt ${inUse?"pref":""}">
           <div class="mic">${inUse?ICONS.check:ICONS.build}</div>
           <div class="bd"><b>${esc(u.label)}</b><span>${esc(u.detail)}</span></div>
           <button class="check ${inUse?"on":""}" data-upg="${i}" aria-label="Mark as in use">${ICONS.check}</button>
         </div>`;}).join("")}</div>`)}

    ${acc(ICONS.doc,"Source & more videos", media.length,
      `<p class="tiny" style="margin-bottom:10px">${esc(e.source)}</p>
       ${media.map((m,i)=>`
        <div class="media-opt ${i===prefIx?"pref":""}">
          <div class="mic">${MEDIA_IC[m.t]||ICONS.link}</div>
          <div class="bd"><b>${esc(m.label)}${i===prefIx?" · preferred":""}</b><span>${esc(m.src)}</span></div>
          <a href="${m.url}" target="_blank" rel="noopener">Open</a>
          <button class="check ${i===prefIx?"on":""}" data-pref="${i}" aria-label="Set preferred">${ICONS.check}</button>
        </div>`).join("")}
       <div class="row" style="margin-top:10px">
         <input type="text" id="ex-custom" placeholder="Paste your own link…" value="${esc(state.prefs.customMedia[id]||"")}" style="flex:1">
         <button class="btn small" id="ex-custom-save">Save</button>
       </div>`)}

    ${musclesFor(id)?`
      <div class="eyebrow" style="margin:20px 0 9px">Muscle map</div>
      <div class="musclebox"><div id="mm-${id}"></div>
        <div class="mmlegend">
          ${musclesFor(id).work?'<span><i style="background:var(--teal)"></i>Working</span>':''}
          ${musclesFor(id).stretch?'<span><i style="background:var(--amber)"></i>Lengthening</span>':''}
          <span class="tiny" style="opacity:.7">faded = secondary</span>
        </div>
      </div>
      <div class="wrap" style="margin-top:10px">${muscleChips(id)}</div>`:""}
    ${!HT?`<div class="notice" style="margin-top:14px">${ICONS.info}<span>Step-by-step instructions for this drill haven't been written yet.</span></div>`:""}`,
   `<button class="btn ${state.prefs.favs.includes(id)?"":"ghost"}" id="ex-fav">★</button>
    ${e.custom?'<button class="btn" id="ex-edit">Edit</button>':""}
    <button class="btn primary" style="flex:1" id="ex-add">${ICONS.build}Add to routine draft</button>`, back);
  $$("#sheet-body [data-acc]").forEach(b=> b.onclick=()=> b.parentElement.classList.toggle("open"));
  $$("#sheet-body .navrow[data-go]").forEach(b=>{ if(b.dataset.go!=="none") b.onclick=()=> openExercise(b.dataset.go, back); });
  const eed=$("#ex-edit"); if(eed) eed.onclick=()=> openDrillEditor(id);
  if(musclesFor(id)) setTimeout(()=>renderMuscleMap("mm-"+id, id), 30);
  // ---- video block wiring ----
  const vp=$("#v-play");
  if(vp) vp.onclick=()=>{
    const s=(state.prefs.videoStart||{})[id]||0;
    const box=$("#vidbox");
    if(box && box.classList.contains("blocked")){
      window.open("https://www.youtube.com/watch?v="+V.yt+(s?"&t="+s+"s":""),"_blank","noopener");
      return;
    }
    $("#vidbox").innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+V.yt+'?start='+s+
      '&autoplay=1&rel=0&modestbranding=1&playsinline=1" title="'+esc(e.name)+'" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
  };
  const vt=$("#v-settime");
  if(vt) vt.onclick=()=>{
    state.prefs.videoStart = state.prefs.videoStart||{};
    const secs = parseTime($("#v-time").value);
    if(secs) state.prefs.videoStart[id]=secs; else delete state.prefs.videoStart[id];
    save(); openExercise(id, back); toast(secs?("Starts at "+mmss(secs)):"Start time cleared");
  };
  const vc=$("#v-confirm");
  if(vc) vc.onclick=()=>{
    state.prefs.videoConfirmed = state.prefs.videoConfirmed||{};
    state.prefs.videoConfirmed[id]=true; save(); openExercise(id, back); toast("Marked as confirmed ✓");
  };
  const vs=$("#v-save");
  if(vs) vs.onclick=()=>{
    const raw=$("#v-custom").value.trim();
    const m=raw.match(/(?:v=|shorts\/|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
    if(!m){ toast("Couldn't read that YouTube link"); return; }
    state.prefs.videoOverride = state.prefs.videoOverride||{};
    state.prefs.videoOverride[id]=m[1];
    const ts=raw.match(/[?&]t=(\d+)/); 
    if(ts){ state.prefs.videoStart=state.prefs.videoStart||{}; state.prefs.videoStart[id]=+ts[1]; }
    save(); openExercise(id, back); toast("Video swapped ✓");
  };
  $$("#sheet-body [data-pref]").forEach(b=> b.onclick=()=>{ state.prefs.media[id]=+b.dataset.pref; save(); openExercise(id, back); toast("Preferred media set"); });
  $$("#sheet-body [data-upg]").forEach(b=> b.onclick=()=>{
    const i=+b.dataset.upg; const arr = state.prefs.upgradesInUse[id] = state.prefs.upgradesInUse[id]||[];
    const at = arr.indexOf(i);
    at>-1 ? arr.splice(at,1) : arr.push(i);
    save(); openExercise(id, back); toast(at>-1?"Removed from your setup":"Marked as in use");
  });
  $$("#sheet-body [data-nav-ex]").forEach(b=> b.onclick=()=> openExercise(b.dataset.navEx, back));
  $("#ex-custom-save").onclick=()=>{ const v=$("#ex-custom").value.trim(); if(v) state.prefs.customMedia[id]=v; else delete state.prefs.customMedia[id]; save(); openExercise(id, back); toast(v?"Custom link saved":"Custom link removed"); };
  $("#ex-fav").onclick=()=>{ const f=state.prefs.favs; f.includes(id)?state.prefs.favs=f.filter(x=>x!==id):f.push(id); save(); openExercise(id, back); };
  $("#ex-add").onclick=()=>{ addToDraft(id); closeSheet(); show("builder"); };
}


/* ============================================================
   Drill builder — create/edit your own drills.
   Only name + category are required so a drill can be captured
   in ~20 seconds after class and fleshed out later.
============================================================ */
function openDrillEditor(editId){
  const ex = editId ? (state.customDrills||[]).find(d=>d.id===editId) : null;
  const d = Object.assign({
    id:"", name:"", cats:[], level:2, fatigue:"low", when:["skill"],
    targets:"", why:"", dosage:"", cues:"", mistakes:"", progression:"", regression:"", pairs:"",
    source:"", yt:"", videoTitle:"", upgrades:[]
  }, ex||{});
  const catChips = CATS.map(x=>`<button class="chip ${d.cats.includes(x.id)?"on":""}" data-dc="${x.id}">${x.name}</button>`).join("");
  const whenChips = Object.entries(WHEN).map(([k,v])=>`<button class="chip ${d.when.includes(k)?"on":""}" data-dw="${k}">${v}</button>`).join("");
  const f = (id,lbl,val,ph,ta)=> `<label class="f">${lbl}</label>` +
    (ta? `<textarea id="${id}" placeholder="${esc(ph)}">${esc(val)}</textarea>`
       : `<input type="text" id="${id}" placeholder="${esc(ph)}" value="${esc(val)}">`);
  openSheet(ex?"Edit drill":"New drill",
   `<div class="notice teal">${ICONS.info}<span>Only the name and a category are required. Everything else can wait — add it when you have time.</span></div>
    <div class="sec" style="margin-top:14px"><div class="eyebrow teal">Essentials</div>
      ${f("dl-name","Drill name", d.name, "e.g. Straddle pulse on blocks")}
      <label class="f">Category — tap all that apply</label><div class="wrap">${catChips}</div>
      <div class="grid2" style="margin-top:12px">
        <div><label class="f">Level</label><select id="dl-level">
          ${[1,2,3,4].map(n=>`<option value="${n}" ${d.level==n?"selected":""}>${LEVELS[n]}</option>`).join("")}</select></div>
        <div><label class="f">Fatigue</label><select id="dl-fat">
          ${["low","med","high"].map(x=>`<option value="${x}" ${d.fatigue===x?"selected":""}>${FATIGUE_LBL[x]}</option>`).join("")}</select></div>
      </div>
      <label class="f">Best used</label><div class="wrap">${whenChips}</div>
      ${f("dl-dosage","Dosage", d.dosage, "e.g. 3 × 8, or 3 × 30 s hold")}
    </div>
    <div class="sec"><div class="eyebrow">Video</div>
      ${f("dl-yt","YouTube link", d.yt? "https://www.youtube.com/watch?v="+d.yt : "", "Paste a link — timestamps (&t=) are kept")}
      ${f("dl-vtitle","Video label", d.videoTitle, "e.g. Coach demo, Saturday class")}
    </div>
    <div class="sec"><div class="eyebrow">Coaching detail — optional</div>
      ${f("dl-cues","Cues", d.cues, "The one or two things that matter most", true)}
      ${f("dl-targets","What it targets", d.targets, "Muscles / quality trained")}
      ${f("dl-why","Why it helps your handstand", d.why, "The transfer — why this earns a slot", true)}
      ${f("dl-mistakes","Common mistakes", d.mistakes, "What goes wrong", true)}
      ${f("dl-prog","Next progression", d.progression, "How it gets harder")}
      ${f("dl-reg","Regression", d.regression, "How to scale it back")}
      ${f("dl-pairs","Pairs well with", d.pairs, "What to do before or after")}
      ${f("dl-source","Where it came from", d.source, "e.g. Saturday class with [coach], or a link")}
    </div>`,
   `${ex?'<button class="btn danger" id="dl-del">Delete</button>':""}
    <button class="btn primary" style="flex:1" id="dl-save">${ex?"Save changes":"Create drill"}</button>`);

  const catSet=new Set(d.cats), whenSet=new Set(d.when);
  $$("#sheet-body [data-dc]").forEach(b=> b.onclick=()=>{ const k=b.dataset.dc; catSet.has(k)?catSet.delete(k):catSet.add(k); b.classList.toggle("on"); });
  $$("#sheet-body [data-dw]").forEach(b=> b.onclick=()=>{ const k=b.dataset.dw; whenSet.has(k)?whenSet.delete(k):whenSet.add(k); b.classList.toggle("on"); });

  if(ex) $("#dl-del").onclick=()=>{
    openSheet("Delete drill?", `<p class="sub">“${esc(ex.name)}” will be removed. Routines that use it will show it as missing, and past logs are unaffected.</p>`,
      `<button class="btn ghost" id="dd-no">Keep</button><button class="btn danger" style="flex:1" id="dd-yes">Delete</button>`);
    $("#dd-no").onclick=()=>openDrillEditor(editId);
    $("#dd-yes").onclick=()=>{
      state.customDrills = (state.customDrills||[]).filter(x=>x.id!==editId);
      state.meta_drillsU = Date.now(); save(); closeSheet(); render(curView); toast("Drill deleted");
    };
  };
  $("#dl-save").onclick=()=>{
    const name=$("#dl-name").value.trim();
    if(!name){ toast("Give the drill a name"); $("#dl-name").focus(); return; }
    if(!catSet.size){ toast("Pick at least one category"); return; }
    const raw=$("#dl-yt").value.trim();
    const m=raw.match(/(?:v=|shorts\/|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
    const entry = {
      id: editId || ("cx-"+Date.now().toString(36)),
      custom:true, name:name, cats:[...catSet], level:+$("#dl-level").value, fatigue:$("#dl-fat").value,
      when:[...whenSet].length?[...whenSet]:["skill"],
      dosage:$("#dl-dosage").value.trim(), cues:$("#dl-cues").value.trim(), targets:$("#dl-targets").value.trim(),
      why:$("#dl-why").value.trim(), mistakes:$("#dl-mistakes").value.trim(),
      progression:$("#dl-prog").value.trim(), regression:$("#dl-reg").value.trim(),
      pairs:$("#dl-pairs").value.trim(), source:$("#dl-source").value.trim() || "Your own drill",
      yt: m? m[1] : "", videoTitle:$("#dl-vtitle").value.trim(),
      upgrades: d.upgrades && d.upgrades.length ? d.upgrades : [],
      media: []
    };
    if(m){
      const ts=raw.match(/[?&]t=(\d+)/);
      if(ts){ state.prefs.videoStart=state.prefs.videoStart||{}; state.prefs.videoStart[entry.id]=+ts[1]; }
    }
    state.customDrills = (state.customDrills||[]).filter(x=>x.id!==entry.id).concat([entry]);
    state.meta_drillsU = Date.now();
    save(); closeSheet(); render(curView); toast(editId?"Drill updated ✓":"Drill created ✓");
  };
}


/* ---------- desk resets: tracked separately from training ---------- */
const DESK_SETS = [
  {id:"chair", name:"At the chair", note:"No standing up required.", pick:["desk-chair-tspine","desk-hipflexor-seated","desk-chest-opener"]},
  {id:"ball",  name:"On the ball",  note:"Swap the chair for a few minutes.", pick:["ball-tspine-drape","ball-pelvic-tilts","ball-side-bend"]},
  {id:"hips",  name:"Hips reset",   note:"The one that helps your line most.", pick:["desk-hipflexor-seated","desk-fig4","desk-standing-hipflexor"]},
  {id:"neck",  name:"Neck & wrists",note:"After a long typing block.",  pick:["desk-chin-tucks","desk-wrist-reset","desk-twist"]}
];
const deskToday = () => (state.deskLogs||[]).filter(d=>d.date===todayISO()).length;
function deskStreak(){
  let n=0, skip=!(state.deskLogs||[]).some(d=>d.date===todayISO());
  for(let i=skip?1:0;i<90;i++){ if((state.deskLogs||[]).some(d=>d.date===todayISO(-i))) n++; else break; }
  return n;
}
function openDeskSet(setId){
  const set = DESK_SETS.find(s=>s.id===setId); if(!set) return;
  const drills = set.pick.map(exById).filter(Boolean);
  const done=new Set();
  openSheet(set.name,
    `<p class="sub" style="margin-bottom:12px;font-size:.85rem">${esc(set.note)} About 90 seconds.</p>
     <div class="exl">${drills.map((e,i)=>`
       <div class="exi" data-i="${i}">
         <div class="check" data-dk="${i}">${ICONS.check}</div>
         <div class="bd" data-open-ex="${e.id}"><div class="nm">${esc(e.name)}</div>
           <div class="mt">${esc(e.dosage)}</div>
           <div class="tiny" style="margin-top:3px">${e.discreet==="obvious"?'<span style="color:var(--amber)">Needs a private spot</span>':esc((e.cues||"").split(".")[0])+"."}</div></div>
       </div>`).join("")}</div>
     <div class="notice teal" style="margin-top:14px">${ICONS.info}<span>Desk resets are tracked separately — they never affect your training adherence.</span></div>`,
    `<button class="btn ghost" id="dk-close">Close</button>
     <button class="btn primary" style="flex:1" id="dk-done">Done ✓</button>`);
  $$("#sheet-body [data-dk]").forEach(b=> b.onclick=()=>{
    const i=+b.dataset.dk; done.has(i)?done.delete(i):done.add(i);
    b.classList.toggle("on"); b.closest(".exi").classList.toggle("done");
  });
  $$("#sheet-body [data-open-ex]").forEach(el=> el.onclick=()=> openExercise(el.dataset.openEx, ()=>openDeskSet(setId)));
  $("#dk-close").onclick=closeSheet;
  $("#dk-done").onclick=()=>{
    state.deskLogs = (state.deskLogs||[]).concat([{date:todayISO(), set:setId, n:done.size||drills.length, t:Date.now()}]);
    state.meta_deskU = Date.now(); save(); closeSheet(); render(curView);
    toast("Desk reset logged · "+deskToday()+" today");
  };
}


/* ============================================================
   Muscle tagging per drill.
   mode "work"    = muscle contracting under load  (teal)
   mode "stretch" = tissue being lengthened        (amber)
   Some drills are genuinely both — those list each separately.
============================================================ */
const MUSCLES = {
  // --- shoulder / overhead mobility ---
  "wall-slides":          {work:{p:["traps_lower","serratus"],s:["delts"]}, stretch:{p:["pecs"],s:["lats"]}},
  "dislocates":           {stretch:{p:["pecs","delts_front"],s:["lats","biceps"]}},
  "scap-wall-slides":     {work:{p:["traps_lower","serratus"],s:["delts","traps_upper"]}, stretch:{p:["pecs"],s:[]}},
  "pails-rails-flexion":  {work:{p:["lats","delts"],s:["traps_lower"]}, stretch:{p:["lats"],s:["triceps","pecs"]}},
  "oh-lat-stretch":       {stretch:{p:["lats"],s:["triceps","obliques"]}},
  "bench-lat-opener":     {stretch:{p:["lats"],s:["triceps","erectors","pecs"]}},
  "lat-pnf":              {work:{p:["lats"],s:[]}, stretch:{p:["lats"],s:["triceps","obliques"]}},
  "lat-pails-rails":      {work:{p:["lats"],s:["triceps"]}, stretch:{p:["lats"],s:["triceps","obliques"]}},
  "pec-doorway":          {stretch:{p:["pecs"],s:["delts_front","biceps"]}},
  "pec-doorway-upgraded": {work:{p:["pecs"],s:[]}, stretch:{p:["pecs"],s:["delts_front","biceps"]}},
  "tspine-ext":           {stretch:{p:["erectors","pecs"],s:["abs"]}},
  "wall-angels":          {work:{p:["traps_lower","rhomboids"],s:["serratus","delts"]}, stretch:{p:["pecs"],s:["lats"]}},
  "scapular-pushups":     {work:{p:["serratus"],s:["traps_lower","pecs","triceps"]}},
  "pike-shrugs":          {work:{p:["traps_upper","serratus"],s:["delts","triceps"]}},
  "wf-shrugs":            {work:{p:["traps_upper","serratus"],s:["delts","triceps","abs"]}},
  "free-handstand-shrug": {work:{p:["traps_upper","serratus","delts"],s:["triceps","abs","glutes"]}},
  // --- line / rib control ---
  "hollow-line":          {work:{p:["abs"],s:["obliques","hipflexors","quads"]}},
  "bodyline-drill":       {work:{p:["abs","glutes"],s:["obliques","erectors","delts"]}},
  "wf-hold":              {work:{p:["delts","traps_upper","abs"],s:["serratus","triceps","glutes","forearms"]}},
  "wall-toe-finger-pulls":{work:{p:["delts","forearms","abs"],s:["traps_upper","glutes"]}},
  "kickup-practice":      {work:{p:["delts","abs"],s:["triceps","forearms","glutes"]}},
  "finger-balance":       {work:{p:["forearms"],s:["delts","abs"]}},
  "freestanding-holds":   {work:{p:["delts","abs","forearms"],s:["traps_upper","triceps","glutes","erectors"]}},
  // --- wrists ---
  "wrist-prep":           {stretch:{p:["forearms"],s:[]}},
  "first-knuckle-pushups":{work:{p:["forearms"],s:["triceps"]}},
  "reverse-wrist-pushups":{work:{p:["forearms"],s:[]}},
  // --- compression / press ---
  "pancake":              {stretch:{p:["adductors","hamstrings"],s:["erectors","calves"]}},
  "seated-pike-lifts":    {work:{p:["hipflexors","abs"],s:["quads"]}, stretch:{p:["hamstrings"],s:[]}},
  "straddle-liftoffs":    {work:{p:["hipflexors","abs","delts"],s:["triceps","adductors","serratus"]}},
  "lsit-parallettes":     {work:{p:["hipflexors","abs"],s:["triceps","delts","quads"]}},
  "press-walks":          {work:{p:["delts","abs"],s:["hipflexors","triceps"]}, stretch:{p:["hamstrings"],s:["adductors"]}},
  "straddle-negatives":   {work:{p:["delts","lats","abs"],s:["traps_upper","triceps","hipflexors","serratus"]}},
  "elevated-press":       {work:{p:["delts","abs","hipflexors"],s:["traps_upper","triceps","serratus","adductors"]}},
  "full-straddle-press":  {work:{p:["delts","abs","hipflexors"],s:["traps_upper","triceps","serratus","adductors","lats"]}},
  // --- desk ---
  "desk-chair-tspine":    {stretch:{p:["erectors","pecs"],s:["abs"]}},
  "desk-hipflexor-seated":{stretch:{p:["hipflexors"],s:["quads"]}},
  "desk-fig4":            {stretch:{p:["glutes"],s:["erectors"]}},
  "desk-twist":           {stretch:{p:["obliques","erectors"],s:[]}},
  "desk-chest-opener":    {stretch:{p:["pecs"],s:["delts_front"]}},
  "desk-chin-tucks":      {work:{p:["neck"],s:["traps_upper"]}},
  "desk-wrist-reset":     {stretch:{p:["forearms"],s:[]}},
  "ball-tspine-drape":    {stretch:{p:["erectors","pecs"],s:["abs","lats"]}},
  "ball-pelvic-tilts":    {work:{p:["abs"],s:["hipflexors","glutes","erectors"]}},
  "ball-side-bend":       {stretch:{p:["lats","obliques"],s:[]}},
  "ball-marching":        {work:{p:["hipflexors","abs"],s:["quads","obliques"]}},
  "desk-standing-hipflexor":{stretch:{p:["hipflexors","quads"],s:["abs"]}}
};
const MUSCLE_LBL = {lats:"Lats",traps_upper:"Upper traps",traps_lower:"Lower traps",traps:"Traps",
  rhomboids:"Mid traps / rhomboids",serratus:"Serratus",delts_front:"Front delts",delts_rear:"Rear delts",delts:"Delts",
  pecs:"Pecs",triceps:"Triceps",biceps:"Biceps",forearms:"Forearms",abs:"Abs",obliques:"Obliques",
  erectors:"Spinal erectors",glutes:"Glutes",hamstrings:"Hamstrings",quads:"Quads",hipflexors:"Hip flexors",
  adductors:"Adductors",calves:"Calves",neck:"Neck"};

function musclesFor(exId){
  const cd=(state.customDrills||[]).find(d=>d.id===exId);
  if(cd && cd.muscles) return cd.muscles;
  return MUSCLES[exId]||null;
}
function renderMuscleMap(hostId, exId){
  const M = musclesFor(exId), SM = window.SL_MUSCLES;
  const host = document.getElementById(hostId);
  if(!host) return;
  if(!M){ host.innerHTML = '<p class="tiny" style="text-align:center;padding:14px">No muscle map for this drill yet.</p>'; return; }
  if(!SM || !SM.ready){
    host.innerHTML = '<p class="tiny" style="text-align:center;padding:14px">Muscle map couldn\u2019t load here \u2014 works on the live site.</p>'; return; }
  const TEAL="#33C2AD", TEAL_S="rgba(51,194,173,.42)", AMB="#D89A5B", AMB_S="rgba(216,154,91,.42)";
  const light = document.documentElement.dataset.theme!=="dark";
  const cTeal = light? "#0E7C6E":TEAL, cTealS = light? "rgba(14,124,110,.38)":TEAL_S;
  const cAmb  = light? "#A9622B":AMB,  cAmbS  = light? "rgba(169,98,43,.38)":AMB_S;
  // build id -> colour
  const paint={};
  const apply=(groups,colour)=> (groups||[]).forEach(g=> (SM.groups[g]||[]).forEach(id=>{ if(!paint[id]) paint[id]=colour; }));
  if(M.work){ apply(M.work.p,cTeal); apply(M.work.s,cTealS); }
  if(M.stretch){ apply(M.stretch.p,cAmb); apply(M.stretch.s,cAmbS); }
  host.innerHTML = '<div class="mmviews"><div id="'+hostId+'-f"></div><div id="'+hostId+'-b"></div></div>';

  // The library never puts ids on its <path> elements — they only exist in a private
  // Map — but paths are appended in the same order as the muscle definitions for that
  // view, and each carries the .body-chart-muscle class. So match by position.
  const mk = (el, view, defsForView) => {
    if(!el) return;
    // intensity 1 keeps the library from dimming the path to 0.6 opacity
    const bodyState = {};
    defsForView.forEach(d=>{ if(paint[d.id]) bodyState[d.id] = {intensity:1, selected:false}; });
    const chart = new SM.BodyChart(el, {view:view, bodyState:bodyState, enableTransitions:false});
    const repaint = ()=>{
      const paths = el.querySelectorAll("path.body-chart-muscle");
      if(paths.length !== defsForView.length){
        console.warn("muscle map: expected", defsForView.length, "paths, got", paths.length);
      }
      paths.forEach((pth, i)=>{
        const def = defsForView[i]; if(!def) return;
        const col = paint[def.id];
        if(col){ pth.style.fill = col; pth.style.fillOpacity = "1"; }
        else   { pth.style.fill = ""; }
      });
    };
    repaint();
    // hover/refresh inside the library rewrites the fill attribute; style wins, but
    // re-apply after any interaction just in case
    el.addEventListener("mouseleave", repaint);
    return chart;
  };
  const F = SM.defs.filter(d=> d.view === SM.ViewSide.FRONT);
  const B = SM.defs.filter(d=> d.view === SM.ViewSide.BACK);
  mk(document.getElementById(hostId+"-f"), SM.ViewSide.FRONT, F);
  mk(document.getElementById(hostId+"-b"), SM.ViewSide.BACK,  B);
}
function muscleChips(exId){
  const M=musclesFor(exId); if(!M) return "";
  const out=[];
  if(M.work){ (M.work.p||[]).forEach(g=>out.push('<span class="tag work">'+MUSCLE_LBL[g]+'</span>'));
              (M.work.s||[]).forEach(g=>out.push('<span class="tag">'+MUSCLE_LBL[g]+'</span>')); }
  if(M.stretch){ (M.stretch.p||[]).forEach(g=>out.push('<span class="tag len">'+MUSCLE_LBL[g]+'</span>'));
                 (M.stretch.s||[]).forEach(g=>out.push('<span class="tag">'+MUSCLE_LBL[g]+'</span>')); }
  return out.join("");
}


/* ============================================================
   Plain-language description + numbered execution steps.
   Written so a drill can be followed without the video.
   "check" is the self-test that tells you if you're doing it wrong.
   Drills not yet rewritten fall back to their existing fields.
============================================================ */
const HOWTO = {
"wall-slides":{desc:"You stand with your back flat against a wall and slide your arms up it, keeping your forearms touching the whole way. It trains your shoulders to travel overhead without your ribs flaring open.",
 steps:["Stand with your back to a wall, feet about 20–30 cm away from it.",
  "Press your lower back flat to the wall so there is no gap behind it. Pull your ribs down toward your hips.",
  "Put the backs of your hands and forearms on the wall, elbows bent about 90°, upper arms just below shoulder height. That is your start position.",
  "Slide your arms slowly up the wall, keeping hands, forearms, back and head in contact, until your elbows are nearly straight.",
  "Pause 2 seconds at the top. Your forearms should still be touching the wall.",
  "Slide back down even more slowly to the start. That is one rep."],
 check:"If your lower back lifts off the wall, you have gone too high. Stop just below that point — that is your working range for now."},

"dislocates":{desc:"Holding a broomstick with a wide grip, you take it from in front of your hips, over your head, and down behind your back — then reverse it. It opens the whole overhead arc under almost no load.",
 steps:["Hold a broomstick in front of your thighs with straight arms, palms facing down, hands much wider than your shoulders.",
  "Stand tall, squeeze your glutes lightly and pull your ribs down so your lower back does not arch.",
  "Keeping your elbows completely straight, raise the stick forward and up over your head.",
  "Continue the arc behind you until the stick reaches your backside, or as far as your shoulders comfortably allow.",
  "Reverse the same path slowly back to the front. That is one rep.",
  "Move at a steady, unhurried pace — this is a mobility drill, not a swing."],
 check:"If your elbows bend or your lower back arches to get the stick over, your grip is too narrow. Widen it until you can pass through with straight arms."},

"wrist-prep":{desc:"A short circuit of leans, circles and finger presses that warms the wrists before they take your bodyweight. It is the one thing not to skip before any inverted work.",
 steps:["Kneel and place both palms flat on the floor, fingers pointing forward, shoulders stacked over your hands.",
  "Rock your weight gently forward over your hands, then back. Repeat 10 times, moving slowly.",
  "Turn your hands so the fingers point back toward your knees. Rock gently back and forth 10 times.",
  "Place hands with fingers pointing left, rock side to side 10 times. Repeat with fingers pointing right.",
  "Come onto your fingertips, lift the palms slightly off the floor, then lower. Repeat 10 times.",
  "Finish with 10 slow wrist circles in each direction."],
 check:"You are chasing warmth and looseness, not a stretch. If anything sharpens into pain, reduce how much weight you put over the hands."},

"scapular-pushups":{desc:"In a push-up position with locked elbows, you let your chest sink between your shoulder blades and then push the floor away. Only your shoulder blades move.",
 steps:["Set up in a high push-up position, hands under your shoulders, body in a straight line from head to heels.",
  "Lock your elbows straight and keep them straight for the entire set.",
  "Let your chest sink slowly toward the floor by allowing your shoulder blades to squeeze together. Your arms do not bend.",
  "Pause for a moment at the bottom.",
  "Push the floor away hard, spreading your shoulder blades apart and rounding your upper back slightly. Pause at the top.",
  "That is one rep. Keep the range small and controlled."],
 check:"If your elbows are bending, you are doing a push-up. Reset and let only the shoulder blades travel."},

"hollow-line":{desc:"You lie on your back and lift your arms and legs off the floor, holding a shallow banana shape with your lower back pressed down. It is the core shape every straight handstand is built on.",
 steps:["Lie on your back with your arms by your sides and knees bent.",
  "Exhale fully and press your lower back into the floor. There should be no gap under it.",
  "Keeping that pressure, lift your head, shoulders and feet a few centimetres off the floor.",
  "Straighten your legs and reach your arms overhead beside your ears, only as far as you can while keeping your lower back down.",
  "Hold, breathing shallowly. Keep your chin gently tucked, not jammed to your chest.",
  "Lower under control when the hold ends."],
 check:"Slide a hand under your lower back. If it fits, you have lost the position — bend the knees or bring the arms forward until the gap closes."},

"wf-hold":{desc:"You walk your feet up a wall until your chest faces it and your body is vertical, then hold. The wall gives honest feedback on whether your line is actually straight.",
 steps:["Kneel with your back to a wall and put your feet on it behind you, hands on the floor.",
  "Walk your hands toward the wall and your feet up it at the same time, staying in control.",
  "Keep walking in until your chest and hips are close to the wall and your body is vertical.",
  "Push the floor away hard so your shoulders travel up toward your ears — do not sag.",
  "Squeeze your glutes, pull your ribs toward the wall, and reach your toes for the ceiling.",
  "Hold for the set time, then walk your hands back out to come down."],
 check:"If your ribs and hips are away from the wall while your feet touch it, you are arching. Walk your hands closer and shorten the hold until the whole front of your body can stay near the wall."},

"pails-rails-flexion":{desc:"You take your shoulders to the end of their overhead range, then push against that end range and pull deeper into it using your own muscle. It turns a passive stretch into range you can actually control.",
 steps:["Warm the shoulders first with dislocates or wall slides — never start cold.",
  "Get into a supported overhead stretch: hands on a bench or elevated surface, chest sinking, arms overhead.",
  "Relax into the stretch for 20–30 seconds and breathe.",
  "PAIL: press your arms down into the surface at about 20–30% effort, as if trying to push out of the stretch. Hold 10 seconds, breathing.",
  "RAIL: without moving, switch to actively pulling yourself deeper into the stretch using your shoulder and back muscles. Hold 10 seconds.",
  "Relax, sink slightly deeper, and repeat for 2–3 rounds."],
 check:"Both contractions should be effortful but silent — no shaking or breath-holding. If you cannot breathe through them, use less force."},

"scap-wall-slides":{desc:"A wall slide where you hover your forearms off the wall at the top. That hover is what turns passive overhead range into range you can hold on your own.",
 steps:["Set up exactly as for a normal wall slide — back flat, ribs down, forearms on the wall.",
  "Slide your arms up the wall to the top of your comfortable range.",
  "At the top, lift your forearms and hands 1–2 cm off the wall without moving anything else.",
  "Hold that hover for 2–3 seconds. Your back must stay flat on the wall.",
  "Place the forearms back on the wall and slide down slowly.",
  "That is one rep. Shaking during the hover is normal."],
 check:"If your ribs pop off the wall the moment you hover, lower the height at which you hover until you can hold it with the back flat."},

"pike-shrugs":{desc:"From a pike position with hips high, you shrug your shoulders up and down while keeping your elbows locked. It builds the push-tall action of a handstand without being upside down.",
 steps:["Start in a push-up position, then walk your feet toward your hands so your hips lift high into an upside-down V.",
  "For more difficulty, put your feet on a low box.",
  "Lock your elbows straight and keep your head in a neutral position between your arms.",
  "Let your shoulders sink toward your ears by relaxing the shoulder blades — arms stay straight.",
  "Push the floor away and lift your shoulders up away from your ears as far as you can. Pause 1 second at the top.",
  "Lower slowly. That is one rep."],
 check:"If your elbows bend or your head bobs toward the floor, you are doing a pike push-up. Only the shoulder blades should move."},

"bench-lat-opener":{desc:"You kneel with your elbows on a raised surface and let your chest sink between your arms. Gravity opens the exact angle between arm and torso that a handstand needs.",
 steps:["Kneel about an arm's length from a bench, chair or sofa.",
  "Place your elbows on the surface, shoulder width apart, forearms pointing up. Hold a stick between your hands if you have one.",
  "Sit your hips back toward your heels until your arms are fully extended overhead.",
  "Exhale and pull your ribs down toward your hips — do not let your lower back sag.",
  "Let your chest melt down between your arms. Breathe slowly and sink a little further on each exhale.",
  "Hold for the set time, then come up gently."],
 check:"The stretch should be felt in your armpits and upper back. If you feel it pinching in your lower back, tuck your hips more and lift the surface higher."},

"oh-lat-stretch":{desc:"You put one hand high on a wall or doorframe, then sink your armpit down and away. It lengthens the lat, which is usually what pulls your arms forward in a handstand.",
 steps:["Stand facing a wall, an arm's length away.","Place one hand flat on the wall well above head height, thumb pointing up.","Step the same-side foot back and bend slightly at the hips so your torso lowers.","Exhale and pull your ribs down toward your hips — do not let them flare forward.","Sink your armpit toward the floor. You should feel it along the side of your ribs, from armpit to hip.","Hold, breathing into your side ribs, then swap sides."],
 check:"If you feel it in your lower back rather than your side, your ribs are flared. Tuck them down and reduce the lean until the stretch moves back into the armpit."},

"lat-pnf":{desc:"The overhead lat stretch with a short push-then-relax cycle added. The brief contraction lets you sink noticeably deeper on the release.",
 steps:["Set up in the overhead lat stretch with your hand high on a wall.","Sink into the stretch and hold for 20 seconds, breathing normally.","Press your hand down into the wall at about 20–30% of your strength, as if trying to pull your arm back down. Hold 5–6 seconds.","Stop pushing and relax completely for a breath.","Sink further into the stretch — you should find noticeably more range. Hold 10–15 seconds.","Repeat for 3 rounds, then swap sides."],
 check:"The push should be gentle. If you are straining, gripping or holding your breath, you are pushing far too hard — drop the effort by half."},

"lat-pails-rails":{desc:"The lat stretch taken to its loaded end: you contract into the stretch, then contract to pull yourself deeper. It builds strength at the range you have, not just the range itself.",
 steps:["Warm up first — never do this cold.","Get into a deep overhead lat stretch, hand high on a wall or elbows on a bench.","Relax into the position for 20–30 seconds.","PAIL: press your arm into the surface at about 20–30% effort, as if pushing out of the stretch. Hold 10 seconds, breathing.","RAIL: without changing position, switch to actively pulling yourself deeper using your lat and shoulder. Hold 10 seconds.","Relax, sink slightly deeper, repeat 2–3 rounds per side."],
 check:"You should be able to talk through both contractions. Shaking or breath-holding means too much force — this is control work, not a max effort."},

"pec-doorway":{desc:"You place a forearm on a doorframe and step through until you feel your chest open. It counters the rounded-shoulder position that blocks the final part of your handstand stack.",
 steps:["Stand in a doorway. Place one forearm flat on the frame, elbow bent 90°, upper arm level with your shoulder.","Keep your ribs down and your torso upright — do not lean forward from the waist.","Step the same-side foot through the doorway until you feel a stretch across your chest.","Gently draw that shoulder blade back and down to deepen it.","Hold, then repeat with the elbow higher, above shoulder height, to catch a different part of the muscle.","Swap sides."],
 check:"You should feel this across the chest. If it pinches at the front of the shoulder joint, step back, lower the elbow, and reduce the range."},

"pec-doorway-upgraded":{desc:"The doorway stretch with a push-and-release cycle. The contraction makes the new range stick for longer than a plain hold.",
 steps:["Set up in the doorway pec stretch and lean in until you feel a comfortable stretch.","Hold for 20 seconds, breathing steadily.","Press your forearm into the doorframe at about 20–30% effort, as if trying to close your arm across your chest. Hold 5 seconds.","Release the push completely and take one breath.","Step slightly further through the doorway — you should find more range.","Repeat for 2–3 rounds per side."],
 check:"If your torso rotates away from the working arm to fake depth, reset. Chest stays square, only the stretch deepens."},

"tspine-ext":{desc:"You lie back over a foam roller placed across your mid-back and extend over it, moving up one segment at a time. It restores extension in the upper back so the lower back does not arch instead.",
 steps:["Lie on your back with a foam roller across your mid-back, knees bent, feet flat.","Support your head with both hands, elbows pointing forward — this stops your neck straining.","Lift your hips slightly off the floor so your weight is on the roller.","Exhale and drape your upper back backward over the roller, letting your chest open. Keep your ribs down.","Return to neutral. Do 6–8 slow extensions here.","Roll the foam roller 2–3 cm higher up your back and repeat. Cover 3–4 positions in total."],
 check:"If your lower back is doing the arching, your ribs are flaring. Keep them pulled down and let the movement come only from where the roller touches."},

"wall-angels":{desc:"Standing with your back against a wall, you slide your arms up and down while keeping head, back and arms in contact. It trains upper-back extension and shoulder blade movement at the same time.",
 steps:["Stand with your back against a wall, feet 15–20 cm out from it.","Press your lower back, upper back and the back of your head flat to the wall.","Put your arms against the wall in a goalpost shape — elbows bent 90°, at shoulder height.","Keeping every point in contact, slide your arms slowly up until your elbows are almost straight.","Slide back down until your elbows are level with your ribs, squeezing the shoulder blades.","Move slowly — 3 seconds up, 3 seconds down."],
 check:"Contact is the whole point. The moment your wrists, head, or lower back leave the wall, that is your limit — work only within that range."},

"wf-shrugs":{desc:"In a chest-to-wall handstand you shrug your shoulders up and down while keeping your elbows locked. This is the strength that keeps your shoulders stacked upside down.",
 steps:["Walk up into a chest-to-wall handstand as usual.","Lock your elbows straight and keep them straight throughout.","Let your shoulders sink slowly toward your ears by relaxing the shoulder blades. Do not bend the arms.","Push the floor away hard and lift your shoulders as far from your ears as you can.","Pause 2 seconds at the top, staying tall.","Lower slowly. That is one rep — do 5–8 before coming down."],
 check:"If your elbows bend or your body sways away from the wall, stop the set. Quality here matters far more than the rep count."},

"free-handstand-shrug":{desc:"The same shrug, done in a freestanding handstand with no wall. It is the final test of whether your shoulder elevation holds up when you also have to balance.",
 steps:["Only attempt this once you can hold a freestanding handstand for 20–30 seconds consistently.","Kick up to a freestanding handstand and find your balance first.","With balance settled and elbows locked, let your shoulders sink slightly toward your ears.","Push tall again, lifting your shoulders away from your ears.","Keep the range small — much smaller than the wall version. Balance comes first.","Do 3–5 controlled reps, then bail with a cartwheel."],
 check:"If shrugging makes you lose balance every time, go back to wall shrugs. This drill assumes balance is already reliable."},

"bodyline-drill":{desc:"You hold a straight body shape on the floor, first face-down and then face-up, to find which end of your line breaks. It is the handstand shape practised where you can actually see it.",
 steps:["Front line: get into a forearm plank with elbows under shoulders.","Squeeze your glutes, pull your ribs down and tuck your hips slightly so your body is one straight line. Hold 15–20 seconds.","Rest fully.","Back line: lie face-down with arms stretched overhead beside your ears.","Lift your arms, chest and legs just off the floor, keeping your ribs down and neck long. Hold 15–20 seconds.","Alternate the two for 2–3 rounds each."],
 check:"Whichever of the two shakes or sags first is your weak line — and it is the same one that breaks in your handstand. Give it the extra set."},

"wall-toe-finger-pulls":{desc:"From a wall handstand you pull your toes off the wall using your fingers, hold, then let them back. It is the first taste of real balance without leaving the wall behind.",
 steps:["Chest-to-wall: walk up until your body is vertical and close to the wall.","Press hard through your fingertips to shift your weight slightly toward your hands.","As you press, let one or both toes leave the wall. Hold 2–3 seconds.","Ease the finger pressure and let the toes drift back to the wall.","Repeat 5–8 times.","Back-to-wall version: kick up with your back to the wall, then press the fingers to pull the heels away and hold."],
 check:"Pull with your fingers, not by kicking off the wall with your feet. If your shoulders drift past your hands, you have gone too far — reduce the shift."},

"kickup-practice":{desc:"You practise the entry into a handstand on its own, treating each attempt as a rep rather than a failed handstand. Consistent entry means you spend your session actually handstanding.",
 steps:["Face a wall about 30 cm away, or work in open space if you have a reliable bail.","Place your hands shoulder-width apart, fingers spread, arms locked straight.","Put your stronger leg forward in a lunge and lift your hips over your shoulders before you kick.","Kick the back leg up gently — use far less force than feels natural — and bring the other leg to meet it.","Try to arrive balanced rather than crashing into the wall. Hold whatever you catch for a moment.","Come down under control. Rest a few seconds, then repeat. Do 8–10 deliberate attempts."],
 check:"Count how many out of ten you catch. If you are consistently overshooting into the wall, you are kicking two or three times harder than you need to."},

"finger-balance":{desc:"You learn the two corrections that keep a handstand alive: press the fingertips when you tip forward, press the palm when you tip back. It is the actual mechanism of balancing.",
 steps:["Kick up with your back to the wall, hands about one hand's length from it.","Find a tall, stacked position with your heels resting lightly on the wall.","Squeeze your fingertips into the floor. Feel your weight shift and your heels lift away from the wall.","Hold that hover for as long as you can — start with 2–3 seconds.","Ease the fingertip pressure and let your heels return gently to the wall.","Repeat 5–8 times per set."],
 check:"Set up too far from the wall and you will arch into a banana and overload your wrists. If your back is arching, move your hands closer to the wall."},

"freestanding-holds":{desc:"Unsupported handstand holds, accumulated across many short attempts. There is no substitute for time spent actually balancing.",
 steps:["Warm your wrists thoroughly first.","Work in open space with room to bail — know your cartwheel exit before you start.","Kick up gently and aim to arrive stacked: fingers gripping, ribs closed, glutes on, toes reaching up.","Balance with small finger and palm pressure changes. Do not try to correct with your hips.","Hold until you lose it, then bail cleanly rather than collapsing.","Rest 30–60 seconds and go again. Do 8–10 attempts."],
 check:"Add up your total seconds across all attempts, not just your best hold. Total time is what drives progress, and it is far less frustrating to track."},

"first-knuckle-pushups":{desc:"Push-ups performed on the first knuckles with the palm lifted, building the wrist strength that absorbs balance corrections.",
 steps:["Start on hands and knees with palms flat on the floor.","Press through the index and middle finger knuckles and lift your palm slightly off the floor.","Hold that lifted position and take your weight onto the knuckles.","Lower the palm back toward the floor slowly, under control.","Push back up to the lifted position. That is one rep.","Do 8–10 reps. Progress from knees to a full plank position as it gets easier."],
 check:"Keep the weight on the index and middle knuckles. If it rolls to the pinky side, reduce the load and reset your hand position."},

"reverse-wrist-pushups":{desc:"The opposite of the first-knuckle push-up: you load the back of the hand to build extensor strength and balance out all the flexion handstands demand.",
 steps:["Kneel and place the backs of your hands on the floor, fingers pointing toward each other or toward your knees.","Start with very little weight over the hands — this position is unfamiliar.","Press the backs of your hands into the floor and lift your wrists slightly upward.","Lower slowly back down under control.","Do 8–10 slow reps.","If both hands at once is too much, work one hand at a time."],
 check:"Go gently. Wrist extensors are usually undertrained, so early sessions should feel easy. Never force the range."},

"pancake":{desc:"You sit with your legs wide apart and fold forward with a flat back. It opens the hamstrings and inner thighs, which is where the press handstand starts from.",
 steps:["Sit on the floor and take your legs as wide as is comfortable, kneecaps pointing at the ceiling.","Sit up tall on your sit bones. If you are rolling backward, sit on a folded towel or cushion.","Place your hands on the floor in front of you.","Keeping your back flat, hinge forward from the hips — imagine leading with your chest, not your head.","Walk your hands forward only as far as you can go without your lower back rounding.","Hold, breathing steadily, then walk back up."],
 check:"Flat back beats depth every time. If your lower back is rounding, you have gone too far — come back up until it is flat again."},

"seated-pike-lifts":{desc:"Sitting with legs straight, you lift them off the floor using only your hip flexors. This is the engine that gets your feet off the ground in a press.",
 steps:["Sit on the floor with your legs straight out in front and your back as upright as you can manage.","Place your hands lightly on the floor beside your hips — for balance only, not to push.","Point your toes and tighten your thighs so the legs are rigid.","Pull your legs up toward your chest, lifting the heels off the floor. Keep the knees locked.","Hold at the top for a second, then lower slowly without letting the legs drop.","Do 8–10 reps."],
 check:"If your torso rocks backward to help the legs up, you are cheating. Keep your chest still — only the legs move, even if that means barely lifting."},

"straddle-liftoffs":{desc:"With hands on parallettes and legs straddled wide, you lean forward until your feet lift off the floor. This is the takeoff of the press, isolated and held.",
 steps:["Place your low parallettes about shoulder-width apart and stand between them with your legs straddled wide.","Bend forward and grip the parallettes, arms locked straight.","Round your upper back slightly and pull your hips up toward your hands.","Lean your shoulders forward past your hands — this is what makes your feet feel light.","Keep leaning and lifting until your toes leave the floor. Hold 3–5 seconds.","Lower under control. Do 5 lifts per set."],
 check:"If you are jumping rather than lifting, you are leaning too little. The forward shoulder lean does the work — the legs only follow."},

"lsit-parallettes":{desc:"Supporting yourself on parallettes with straight legs held out in front. It builds the straight-arm support and compression the press needs.",
 steps:["Sit between your parallettes with legs straight out in front of you.","Grip the bars and press down hard, locking your elbows straight.","Push your shoulders down away from your ears — do not let yourself sink into a shrug.","Lift your hips off the floor, then lift your heels until your legs are level.","Point your toes and keep the knees locked. Hold.","Lower under control before your form breaks."],
 check:"Stop the clock the moment your knees bend or hips sag. A strict 10 seconds is worth more than a sloppy 25."},

"press-walks":{desc:"From a wide stand with hands on the floor, you shift your shoulders forward until your feet get light, then rock back. It teaches the weight shift that makes a press possible.",
 steps:["Stand with your legs in a wide straddle and place both hands flat on the floor in front of you.","Lock your elbows straight and keep them straight throughout.","Slowly shift your shoulders forward so they travel past your hands.","Keep shifting until your heels get light and most of your weight is over your hands.","Pause there for a moment, then rock back to the start.","Repeat 5–8 times."],
 check:"Film it from the side once. Almost everyone believes their shoulders pass their hands when they do not — that shift is the whole drill."},

"straddle-negatives":{desc:"From a handstand you straddle your legs and lower them slowly to the floor with straight arms. It is the press performed backwards, and it is the strongest single press builder.",
 steps:["Kick up to a handstand — against a wall at first, freestanding once controlled.","Straddle your legs wide.","Lean your shoulders slightly forward and begin lowering your legs toward the floor.","Keep pushing the floor away the entire time — your arms stay locked and your shoulders stay tall.","Take at least 4 seconds to reach the floor. Slower is better.","Stand up, reset, and repeat for 3–5 reps."],
 check:"If you drop through the middle rather than controlling it, the drill is too hard right now. Use the wall and shorten the range you control."},

"elevated-press":{desc:"You press to a handstand starting with your feet on a raised surface, removing the hardest few centimetres. Lowering that height over months is how the full press is built.",
 steps:["Place your hands on the floor and your feet on a box, chair or your parallettes.","Straddle your legs wide and keep your arms locked straight.","Lift your hips up over your shoulders first — hips lead, not legs.","Lean your shoulders forward past your hands so your feet become light.","Let your feet float off the surface and bring your legs up and together into the handstand.","Come down slowly and reset. Do 4–6 quality attempts."],
 check:"If you are jumping off the box, the height is too low for now. Raise it until you can press smoothly, then lower it again over weeks."},

"full-straddle-press":{desc:"The complete skill: from standing, hands to the floor, straddle up to a handstand with straight arms and no jump.",
 steps:["Do this at the start of a session while you are fresh.","Stand with legs in a wide straddle and place your hands flat on the floor.","Lock your elbows and keep them locked throughout.","Round your upper back slightly and pull your hips up over your shoulders.","Lean your shoulders forward past your hands — your feet will get light on their own.","Lift the legs, bring them together overhead and hold the handstand. Come down slowly."],
 check:"If it feels like a leg lift, the lean came too late. Slow the whole thing down and get the hips over the shoulders before anything leaves the floor."},

"desk-chair-tspine":{desc:"You lean back over the top of your chair to extend your upper back. It is the direct counter to hours of rounding forward at a screen.",
 steps:["Sit toward the front of your chair so the backrest sits at the level of your shoulder blades.","Put your hands behind your head with your elbows pointing outward.","Pull your ribs down and keep your lower back neutral.","Exhale and lean your upper back backward over the top of the backrest, opening your chest.","Hold 20–30 seconds, or repeat 8 slow extensions.","Come up gently."],
 check:"The bend should happen where the chair touches your back. If you feel it in your lower back, sit further forward and keep the ribs down."},

"desk-hipflexor-seated":{desc:"You slide one leg back beside your chair and press the hip forward. It targets the muscle that hours of sitting shortens most — and that shortening is what tilts your pelvis in a handstand.",
 steps:["Scoot to the front edge of your chair, sitting on one side of it.","Let the outside leg slide back and down so the knee is behind your hip.","Sit tall and tuck your tailbone under — this is what makes the stretch work.","Squeeze the glute of the back leg and press that hip gently forward.","Hold 20–30 seconds, breathing.","Swap sides."],
 check:"If you feel it in your lower back instead of the front of your hip, you are arching. Tuck the tailbone harder and reduce the forward press."},

"desk-fig4":{desc:"Ankle crossed over the opposite knee, then a fold forward. It opens the glutes and hip rotators that stiffen from sitting.",
 steps:["Sit upright in your chair with both feet flat on the floor.","Cross one ankle over the opposite knee so your shin is roughly parallel to the floor.","Let the raised knee relax outward.","Keeping your back flat, hinge forward from the hips until you feel a stretch in the glute.","Hold 30 seconds, breathing.","Come up slowly and swap sides."],
 check:"You should feel this in the glute, not the knee. If your knee complains, do not press down on it — just let it fall open on its own."},

"desk-twist":{desc:"A seated rotation with the hips kept square. It keeps the mid-back rotating rather than stiffening into one fixed screen posture.",
 steps:["Sit tall with both feet flat on the floor and knees pointing forward.","Grow taller through the spine before you rotate.","Turn your chest to one side, keeping your hips square and facing forward.","Use the chair arm or the seat back for light leverage at the end of the range.","Hold 20 seconds, breathing — exhale to find a little more rotation.","Return to centre and swap sides."],
 check:"If your knees or hips turn with you, the rotation is coming from the wrong place. Lock the hips forward and rotate from the ribs up."},

"desk-chest-opener":{desc:"Hands behind your head, elbows wide, leaning back over the chair. It undoes the rounded-shoulder position directly.",
 steps:["Sit upright with your feet flat on the floor.","Place both hands behind your head, fingers loosely interlocked.","Open your elbows out wide to the sides.","Squeeze your shoulder blades together and lift your chest toward the ceiling.","Hold 10–15 seconds, breathing into your chest.","Release and repeat once more."],
 check:"Watch that your elbows stay wide. The moment they drift forward, the stretch disappears — even if you still feel like you are doing it."},

"desk-chin-tucks":{desc:"You glide your head straight backward over your shoulders. It counters the forward head position that screens create and that drags the upper back with it.",
 steps:["Sit or stand tall with your shoulders relaxed.","Look straight ahead — keep your eyes level throughout.","Glide your head straight back over your shoulders, making a double chin.","Do not tilt your head down. The movement is backward, not downward.","Hold 3 seconds, then release.","Repeat 10 times."],
 check:"If your chin is dipping toward your chest, you are nodding instead of gliding. Keep your gaze level and move the head straight back."},

"desk-wrist-reset":{desc:"A quick circuit of circles, spreads and stretches for wrists that have been typing for hours. Cheap insurance for the joints that take your bodyweight in training.",
 steps:["Drop your hands off the edge of the desk and shake them out loosely.","Make 10 slow wrist circles in each direction.","Spread your fingers as wide as you can for 5 seconds, then make a fist for 5 seconds. Repeat 5 times.","Press your palms together in front of your chest and lower the hands until you feel a forearm stretch. Hold 15 seconds.","Turn the hands so the fingertips point down, backs of hands together, and hold 15 seconds.","Shake the hands out again."],
 check:"This should feel like relief, not a stretch you have to endure. Back off anything that tingles or goes numb."},

"ball-tspine-drape":{desc:"You lie back over a yoga ball and let your upper back open across it. It gives more extension than any chair can, and it is the single best desk-adjacent drill for your line.",
 steps:["Sit on the ball, then walk your feet forward so the ball rolls up your back.","Stop when the ball sits under your mid-back and your hips are supported.","Support your head with your hands at first.","Slowly let your upper back drape backward over the ball, opening your chest.","Once comfortable, take your arms out wide or overhead for more.","Hold 20–30 seconds, breathing. Walk your feet back to come up."],
 check:"Come up slowly and never let your head hang unsupported if you feel dizzy. Build the range over sessions rather than forcing it on day one."},

"ball-pelvic-tilts":{desc:"Sitting on the ball, you tilt your pelvis forward and back and circle it. It trains the exact pelvic control that shuts down a banana back.",
 steps:["Sit tall on the ball with feet flat on the floor, knees at about 90°.","Place your hands on your hips so you can feel what moves.","Tilt your pelvis forward, arching your lower back slightly.","Tilt it backward, tucking your tailbone under and flattening your lower back. Exhale into this one.","Alternate slowly for 10–15 tilts.","Then circle the pelvis 10 times in each direction."],
 check:"Only the pelvis should move. If your head and shoulders are swaying, make the movement smaller until everything above the waist stays still."},

"ball-side-bend":{desc:"Seated on the ball, you reach one arm overhead and bend to the side. It reaches the lats — one of your main bottlenecks — without leaving your desk.",
 steps:["Sit tall on the ball with both feet planted firmly.","Reach one arm straight up overhead.","Grow taller through that side first, lengthening out of the armpit.","Bend sideways over the opposite side, keeping your chest facing forward.","Feel it along the side of your ribs and armpit. Hold 15 seconds or pulse gently 8–10 times.","Return upright and swap sides."],
 check:"Keep both sit bones on the ball. If the opposite hip lifts, you are bending too far — shorten the range."},

"ball-marching":{desc:"Seated on the ball, you lift alternate knees and circle the hips. It keeps your hips moving through the workday rather than locked at ninety degrees.",
 steps:["Sit tall on the ball, feet flat, hands resting lightly on your hips.","Lift one knee a few centimetres, hold a moment, and lower it.","Alternate legs at a slow, controlled pace for 30–60 seconds.","Keep the ball still underneath you — do not bounce.","Then plant both feet and circle your hips 10 times in each direction.","Progress by taking your hands off your hips entirely."],
 check:"If the ball is rolling around under you, you are moving too fast. Slow down until the ball stays put and your trunk does the stabilising."},

"desk-standing-hipflexor":{desc:"A split-stance lunge stretch done standing beside your desk. The deeper version of the seated hip flexor stretch, for when you can step away.",
 steps:["Stand beside your desk and take a long step back with one foot.","Bend both knees slightly and keep your torso upright.","Tuck your tailbone under so your pelvis rotates backward — do this before anything else.","Squeeze the glute of the back leg and press your hips gently forward.","Hold 20–30 seconds, breathing.","Swap sides. For more, reach the same-side arm overhead and slightly across."],
 check:"If you cannot feel anything, you are almost certainly arching your lower back instead of tucking. Tuck the tailbone first, then press forward."}
};
function howTo(id){
  const cd=(state.customDrills||[]).find(d=>d.id===id);
  if(cd && cd.howto) return cd.howto;
  return HOWTO[id]||null;
}


/* ============================================================
   CLASS LOG — the 80% of training that happens in class.
   Designed for ~30 seconds on a phone, tired, after a session.
============================================================ */
const classLogFor = d => (state.classLogs||[]).find(x=>x.date===d);
function openClassLog(date){
  date = date || todayISO();
  const existing = classLogFor(date);
  const plan = planFor(new Date(date+"T12:00:00").getDay());
  const L = existing ? JSON.parse(JSON.stringify(existing))
                     : {date:date, cls:plan.cls, items:[], notes:""};
  let picking = false, query = "";

  const itemRow = (it,i)=> `
    <div class="clitem">
      <div class="row between" style="gap:8px">
        <div style="flex:1;min-width:0">
          <div class="nm">${i+1}. ${esc(it.name)}${it.unnamed?' <span class="tag amber">name later</span>':''}</div>
          ${it.variation?`<div class="tiny">${esc(it.variation)}</div>`:""}
        </div>
        <button class="iconbtn" style="width:30px;height:30px" data-rm="${i}" aria-label="Remove">✕</button>
      </div>
      <div class="row" style="gap:7px;margin-top:8px;flex-wrap:wrap">
        <input type="text" data-num="${i}" value="${esc(it.numbers||"")}" placeholder="3×3 · 20s each side ×3" style="flex:1;min-width:130px;padding:9px 11px">
      </div>
      <div class="chiprow" style="margin-top:7px;padding-bottom:2px">
        ${ASSIST.map(a=>`<button class="chip ${((it.assist||"none")===a[0])?"on":""}" data-as="${i}|${a[0]}">${a[1]}</button>`).join("")}
      </div>
      <div class="chiprow" style="padding-bottom:2px">
        ${VARIATIONS.slice(0,10).map(v=>`<button class="chip ${it.variation===v?"on":""}" data-va="${i}|${v}">${v}</button>`).join("")}
        <button class="chip" data-vmore="${i}">more…</button>
      </div>
    </div>`;

  const results = picking ? searchCatalog(query) : [];
  const recents = recentMoves(10);

  openSheet((existing?"Edit class — ":"Log class — ")+fmtDate(date),
   `<label class="f">Date</label>
    <input type="date" id="cl-date" value="${date}" max="${todayISO()}">
    <label class="f">Class</label>
    <input type="text" id="cl-cls" value="${esc(L.cls)}" placeholder="e.g. Calisthenics skills">
    <label class="f">How to log it</label>
    <div class="feelrow" style="grid-template-columns:1fr 1fr">
      <button class="feel ${L.mode!=="summary"?"on":""}" data-mode="items"><b>Exercise by exercise</b><span>Skills, strength — the numbers matter</span></button>
      <button class="feel ${L.mode==="summary"?"on":""}" data-mode="summary"><b>Just the session</b><span>Yoga, stretching — too many to list</span></button>
    </div>

    ${L.mode==="summary" ? `
      <label class="f">How long?</label>
      <input type="text" id="cl-dur" value="${esc(L.duration||"")}" placeholder="e.g. 60 min">
      <label class="f">Focus — optional</label>
      <div class="wrap">${["Hips","Hamstrings","Shoulders","Spine","Full body","Balance","Breathing"].map(f=>
        `<button class="chip ${(L.focus||[]).includes(f)?"on":""}" data-cf="${f}">${f}</button>`).join("")}</div>
      <div class="notice teal" style="margin-top:12px">${ICONS.info}<span>Logged as one session. It still counts toward your week — it just isn't broken into exercises.</span></div>`
    : (L.items.length? `<label class="f">What you did</label><div class="cllist">${L.items.map(itemRow).join("")}</div>`
      : `<div class="empty" style="padding:20px">${ICONS.build}Nothing added yet.</div>`)}

    ${L.mode==="summary"?"":`<div class="sec" style="margin-top:14px"><div class="eyebrow teal">Add an exercise</div>
      <div class="searchbar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input type="text" id="cl-q" placeholder="Search ${catalogFlat().length} movements…" value="${esc(query)}">
      </div>
      <div id="cl-res"></div>
      ${recents.length? `<div class="tiny" style="margin:10px 0 6px">Recently used</div>
        <div class="wrap">${recents.map(r=>`<button class="chip" data-add="${esc(r.name)}">${esc(r.name)}</button>`).join("")}</div>`:""}
      <div class="row" style="margin-top:10px;gap:8px">
        <button class="btn small" id="cl-unnamed">＋ Add one I can't name</button>
      </div>
    </div>`}

    <label class="f">Notes</label>
    <textarea id="cl-notes" placeholder="How it felt, what the coach corrected…">${esc(L.notes||"")}</textarea>`,
   `${existing?'<button class="btn danger" id="cl-del">Delete</button>':""}
    <button class="btn primary" style="flex:1" id="cl-save">Save class</button>`);

  const rerender = ()=>{ closeSheet(); state._clDraft = L; openClassLogFrom(L, date, existing); };
  const add = (name, unnamed)=>{ L.items.push({name:name, variation:"", assist:"none", numbers:"", unnamed:!!unnamed}); rerender(); };

  const resBox = $("#cl-res");
  const showResults = ()=>{
    if(!$("#cl-q")) return;
    const q = $("#cl-q").value;
    const r = searchCatalog(q);
    if(!q.trim()){ resBox.innerHTML=""; return; }
    resBox.innerHTML = r.length
      ? `<div class="exl" style="margin-top:8px">${r.map(x=>`
          <div class="exi" data-add="${esc(x.name)}" style="padding:9px 11px">
            <div class="bd"><div class="nm">${esc(x.name)}</div><div class="mt">${esc(x.fam)}</div></div>
            ${x.lvl?`<span class="tag">Lv ${x.lvl}</span>`:""}
          </div>`).join("")}</div>`
      : `<div class="tiny" style="margin-top:10px">No match. <button class="btn small" id="cl-new">Add “${esc(q)}” as a new movement</button></div>`;
    resBox.querySelectorAll("[data-add]").forEach(b=> b.onclick=()=> add(b.dataset.add));
    const nb=resBox.querySelector("#cl-new");
    if(nb) nb.onclick=()=>{
      const nm=$("#cl-q").value.trim();
      state.customMoves=(state.customMoves||[]).concat([{name:nm, fam:"Mine", lvl:0}]);
      state.meta_classU=Date.now(); save(); add(nm);
    };
  };
  const focusSet = new Set(L.focus||[]);
  $$("#sheet-body [data-mode]").forEach(b=> b.onclick=()=>{
    L.mode = b.dataset.mode; L.cls=$("#cl-cls").value; rerender(); });
  $$("#sheet-body [data-cf]").forEach(b=> b.onclick=()=>{
    const f=b.dataset.cf; focusSet.has(f)?focusSet.delete(f):focusSet.add(f);
    b.classList.toggle("on"); L.focus=[...focusSet]; });
  const clq=$("#cl-q"); if(clq) clq.oninput = showResults;
  $$("#sheet-body [data-add]").forEach(b=> b.onclick=()=> add(b.dataset.add));
  const cun=$("#cl-unnamed"); if(cun) cun.onclick = ()=> add("Unnamed drill — describe in notes", true);
  $$("#sheet-body [data-rm]").forEach(b=> b.onclick=()=>{ L.items.splice(+b.dataset.rm,1); rerender(); });
  $$("#sheet-body [data-num]").forEach(inp=> inp.oninput=e=> L.items[+inp.dataset.num].numbers=e.target.value);
  $$("#sheet-body [data-as]").forEach(b=> b.onclick=()=>{
    const [i,v]=b.dataset.as.split("|"); L.items[+i].assist=v; rerender(); });
  $$("#sheet-body [data-va]").forEach(b=> b.onclick=()=>{
    const [i,v]=b.dataset.va.split("|"); const it=L.items[+i];
    it.variation = it.variation===v ? "" : v; rerender(); });
  $$("#sheet-body [data-vmore]").forEach(b=> b.onclick=()=>{
    const i=+b.dataset.vmore;
    openSheet("Variation", `<div class="wrap">${VARIATIONS.map(v=>`<button class="chip ${L.items[i].variation===v?"on":""}" data-vv="${v}">${v}</button>`).join("")}</div>`,
      `<button class="btn primary block" id="vv-done">Done</button>`, ()=>rerender());
    $$("#sheet-body [data-vv]").forEach(x=> x.onclick=()=>{
      L.items[i].variation = L.items[i].variation===x.dataset.vv ? "" : x.dataset.vv; rerender(); });
    $("#vv-done").onclick=()=>rerender();
  });
  if(existing) $("#cl-del").onclick=()=>{
    state.classLogs=(state.classLogs||[]).filter(x=>x.date!==date);
    state.meta_classU=Date.now(); save(); closeSheet(); render(curView); toast("Class log deleted"); };
  $("#cl-save").onclick=()=>{
    const nd=$("#cl-date").value||date;
    L.cls=$("#cl-cls").value.trim()||plan.cls;
    L.notes=$("#cl-notes").value.trim();
    if(nd!==date){ state.classLogs=(state.classLogs||[]).filter(x=>x.date!==date); L.date=nd; date=nd; }
    L.duration = $("#cl-dur")? $("#cl-dur").value.trim() : (L.duration||"");
    L.focus = [...focusSet];
    if(L.mode!=="summary" && !L.items.length && !L.notes){ toast("Add at least one exercise"); return; }
    state.classLogs=(state.classLogs||[]).filter(x=>x.date!==date).concat([L]).sort((a,b)=>a.date<b.date?-1:1);
    state.meta_classU=Date.now(); save(); closeSheet(); render(curView); toast("Class logged ✓");
  };
}
function openClassLogFrom(L, date, existing){
  state.classLogs=(state.classLogs||[]).filter(x=>x.date!==date);
  if(existing || L.items.length) state.classLogs.push(L);
  openClassLog(date);
}
/* personal bests across logged class work */
function personalBests(){
  const best={};
  (state.classLogs||[]).forEach(cl=> (cl.items||[]).forEach(it=>{
    if(!it.numbers) return;
    const key = it.name + (it.variation? " · "+it.variation : "");
    const nums = (it.numbers.match(/\d+(\.\d+)?/g)||[]).map(Number);
    const top = nums.length? Math.max(...nums) : 0;
    if(!best[key] || top > best[key].top) best[key]={top:top, raw:it.numbers, date:cl.date, assist:it.assist};
  }));
  return best;
}



/* ============================================================
   SESSION BUILDER — pick exercises, run them, log them.
   Covers sick days, gym-closed weeks, and self-directed training.
============================================================ */
let sess = null;
function openSessionBuilder(preIds, title){
  sess = {title: title||"Own session", items:(preIds||[]).map(id=>{
    const e=exById(id); return {name: e?e.name:id, ref:id, numbers:"", variation:"", assist:"none"};
  }), date: todayISO()};
  renderSessionBuilder();
}
function renderSessionBuilder(){
  const rows = sess.items.map((it,i)=>`
    <div class="clitem">
      <div class="row between" style="gap:8px">
        <div style="flex:1;min-width:0"><div class="nm">${i+1}. ${esc(it.name)}</div></div>
        <button class="iconbtn" style="width:30px;height:30px" data-srm="${i}" aria-label="Remove">✕</button>
      </div>
      <input type="text" data-snum="${i}" value="${esc(it.numbers)}" placeholder="3×8 · 30s ×3" style="margin-top:8px;padding:9px 11px">
    </div>`).join("");
  openSheet("Build a session",
   `<label class="f">Name</label><input type="text" id="ss-title" value="${esc(sess.title)}">
    <label class="f">Date</label><input type="date" id="ss-date" value="${sess.date}" max="${todayISO()}">
    ${sess.items.length?`<label class="f">Exercises</label><div class="cllist">${rows}</div>`
      :`<div class="empty" style="padding:20px">${ICONS.build}Add exercises below.</div>`}
    <div class="sec" style="margin-top:14px"><div class="eyebrow teal">Add</div>
      <div class="searchbar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input type="text" id="ss-q" placeholder="Search drills and movements…">
      </div>
      <div id="ss-res"></div>
      <div class="tiny" style="margin:12px 0 6px">Or pull in a whole block</div>
      <div class="wrap">${state.routines.map(r=>`<button class="chip" data-sr="${r.id}">${esc(r.name)}</button>`).join("")}</div>
      <div class="tiny" style="margin:12px 0 6px">Skill stages — adds drills, target movements and support</div>
      <div class="wrap">${TREES.map(t=>{const p=treeProgress(t);
        return `<button class="chip" data-sk="${t.id}">${esc(t.name)} · stage ${p.current}</button>`;}).join("")}</div>
      ${sess.items.length>10?`<div class="notice" style="margin-top:12px">${ICONS.info}<span>${sess.items.length} exercises is a long session. Consider splitting it across days.</span></div>`:""}
    </div>`,
   `<button class="btn ghost" id="ss-cancel">Close</button>
    <button class="btn primary" style="flex:1" id="ss-save">Save session</button>`);
  const res=$("#ss-res");
  const show=()=>{
    const q=$("#ss-q").value.trim().toLowerCase();
    if(!q){ res.innerHTML=""; return; }
    const drills = EX_ALL().filter(e=>e.name.toLowerCase().includes(q)).slice(0,8)
      .map(e=>({name:e.name, sub:"Your drill · "+catName(e.cats[0]), ref:e.id}));
    const moves = searchCatalog(q).slice(0,10).map(x=>({name:x.name, sub:x.fam, ref:null}));
    const all=drills.concat(moves);
    res.innerHTML = all.length? `<div class="exl" style="margin-top:8px">${all.map((x,i)=>`
      <div class="exi" data-sadd="${i}" style="padding:9px 11px">
        <div class="bd"><div class="nm">${esc(x.name)}</div><div class="mt">${esc(x.sub)}</div></div>
      </div>`).join("")}</div>` : `<p class="tiny" style="margin-top:10px">Nothing found.</p>`;
    res.querySelectorAll("[data-sadd]").forEach(b=> b.onclick=()=>{
      const x=all[+b.dataset.sadd];
      sess.items.push({name:x.name, ref:x.ref, numbers:"", variation:"", assist:"none"});
      sess.title=$("#ss-title").value; sess.date=$("#ss-date").value; renderSessionBuilder();
    });
  };
  $("#ss-q").oninput=show;
  $$("#sheet-body [data-srm]").forEach(b=> b.onclick=()=>{ sess.items.splice(+b.dataset.srm,1); renderSessionBuilder(); });
  $$("#sheet-body [data-snum]").forEach(inp=> inp.oninput=e=> sess.items[+inp.dataset.snum].numbers=e.target.value);
  $$("#sheet-body [data-sk]").forEach(b=> b.onclick=()=>{
    const t=treeById(b.dataset.sk); const p=treeProgress(t);
    const st=t.stages.find(s=>s.n===p.current)||t.stages[0];
    const have=new Set(sess.items.map(x=>x.name));
    (st.match||[]).forEach(m=>{ if(!have.has(m)){ sess.items.push({name:m, ref:null, numbers:"", variation:"", assist:"none"}); have.add(m); } });
    (st.drills||[]).forEach(d=>{ const e=exById(d); if(e&&!have.has(e.name)){ sess.items.push({name:e.name, ref:d, numbers:"", variation:"", assist:"none"}); have.add(e.name); } });
    (t.support.strength||[]).slice(0,2).forEach(m=>{ if(!have.has(m)){ sess.items.push({name:m, ref:null, numbers:"", variation:"", assist:"none"}); have.add(m); } });
    sess.title = sess.items.length && sess.title==="Own session" ? t.name+" stage "+p.current : sess.title;
    renderSessionBuilder(); toast(t.name+" stage "+p.current+" added");
  });
  $$("#sheet-body [data-sr]").forEach(b=> b.onclick=()=>{
    const r=routineById(b.dataset.sr);
    r.items.forEach(it=>{ const e=exById(it.ex); if(e) sess.items.push({name:e.name, ref:e.id,
      numbers:(it.sets+"×"+(it.hold&&it.hold!=="—"?it.hold:it.reps)), variation:"", assist:"none"}); });
    renderSessionBuilder();
  });
  $("#ss-cancel").onclick=closeSheet;
  $("#ss-save").onclick=()=>{
    if(!sess.items.length){ toast("Add at least one exercise"); return; }
    const d=$("#ss-date").value||todayISO();
    const entry={date:d, cls:$("#ss-title").value.trim()||"Own session", items:sess.items.map(x=>({
      name:x.name, variation:x.variation||"", assist:x.assist||"none", numbers:x.numbers||""})), notes:"", own:true};
    state.classLogs=(state.classLogs||[]).filter(x=>x.date!==d).concat([entry]).sort((a,b)=>a.date<b.date?-1:1);
    state.meta_classU=Date.now(); save(); closeSheet(); render(curView); toast("Session logged ✓");
  };
}
/* ---------- day override ---------- */
function dayOverride(date){ return (state.prefs.dayType||{})[date||todayISO()] || null; }
function setDayOverride(date, type, label){
  state.prefs.dayType = state.prefs.dayType||{};
  if(type) state.prefs.dayType[date] = {type:type, label:label||""};
  else delete state.prefs.dayType[date];
  save();
}
function openDayOverride(date){
  const cur = dayOverride(date);
  const plan = planFor(new Date(date+"T12:00:00").getDay());
  openSheet("What kind of day is this?",
   `<p class="sub" style="margin-bottom:12px">${fmtDate(date)} — normally <b>${esc(plan.cls)}</b>.</p>
    <div class="exl">
      ${[["","As scheduled",plan.cls],
         ["other","Different class","Swapped for another class"],
         ["own","Own training","No class — training on your own"],
         ["rest","Rest day","Not training today"]].map(o=>`
        <button class="exi" data-dt="${o[0]}" style="width:100%;text-align:left;font:inherit;color:inherit;${(cur?cur.type:"")===o[0]?"border-color:var(--teal)":""}">
          <div class="bd"><div class="nm">${o[1]}</div><div class="mt">${esc(o[2])}</div></div>
          ${(cur?cur.type:"")===o[0]?'<span class="tag teal">now</span>':""}
        </button>`).join("")}
    </div>
    <label class="f">Label (optional)</label>
    <input type="text" id="dt-label" placeholder="e.g. Skills class instead" value="${esc(cur&&cur.label||"")}">`,
   `<button class="btn primary block" id="dt-done">Done</button>`);
  $$("#sheet-body [data-dt]").forEach(b=> b.onclick=()=>{
    setDayOverride(date, b.dataset.dt, $("#dt-label").value.trim());
    closeSheet(); render(curView); toast("Day updated");
  });
  $("#dt-done").onclick=()=>{ setDayOverride(date, (cur?cur.type:""), $("#dt-label").value.trim()); closeSheet(); render(curView); };
}

/* ============================================================
   SKILLS view — ladders, position from logged evidence
============================================================ */
let skillOpen = null;
function renderSkills(){
  const cards = TREES.map(t=>{
    const p = treeProgress(t);
    const st = t.stages.find(s=>s.n===p.current) || t.stages[0];
    const pct = Math.round(((p.current-1)/(t.stages.length-1))*100);
    return `<div class="card" data-tree="${t.id}" style="cursor:pointer">
      <div class="row between" style="gap:10px">
        <div style="flex:1;min-width:0">
          <div class="h-md">${esc(t.name)}</div>
          <div class="sub" style="font-size:.79rem;margin-top:2px">Stage ${p.current} of ${t.stages.length} · ${esc(st.name)}</div>
        </div>
        ${t.depth==="full"?'<span class="tag teal">detailed</span>':'<span class="tag">outline</span>'}
      </div>
      <div class="ladder">${t.stages.map(s=>`<i class="${s.n<p.current?"done":s.n===p.current?"now":""}"></i>`).join("")}</div>
      <div class="row between" style="margin-top:7px"><span class="tiny">${pct}% through the ladder</span>
        <span class="tiny">${p.manual?"set by you":"from your logs"}</span></div>
    </div>`;}).join("");
  $("#view-skills").innerHTML = `
    <div class="eyebrow teal" style="margin-bottom:10px">Skills — where you are on each</div>
    ${cards}
    <div class="notice teal" style="margin-top:14px">${ICONS.info}<span>Your stage is worked out from what you log in class. Log a movement and the ladder moves on its own.</span></div>`;
  $$("#view-skills [data-tree]").forEach(el=> el.onclick=()=> openTree(el.dataset.tree));
}
function openTree(id){
  const t = treeById(id); if(!t) return;
  const p = treeProgress(t);
  openSheet(t.name,
   `<p class="sub" style="font-size:.88rem;margin-bottom:10px">${esc(t.goal)}</p>
    <div class="notice teal">${ICONS.info}<span><b>Prerequisites:</b> ${esc(t.prereq)}</span></div>

    <div class="sec" style="margin-top:16px"><div class="eyebrow teal">The ladder</div>
      ${t.stages.map(s=>{
        const info = p.stages.find(x=>x.stage.n===s.n);
        const state_ = s.n<p.current?"done":s.n===p.current?"now":"todo";
        return `<div class="stg ${state_}">
          <div class="stgn">${s.n}</div>
          <div class="stgb">
            <div class="row between" style="gap:8px"><b>${esc(s.name)}</b>
              ${info.count?`<span class="tag teal">${info.count}× logged</span>`:""}</div>
            <div class="tiny" style="margin-top:2px">Target: ${esc(s.target)}</div>
            ${info.best?`<div class="tiny" style="color:var(--teal);margin-top:3px">Best: ${esc(info.best.raw)} · ${fmtDate(info.best.date)}</div>`:""}
            <div class="sub" style="font-size:.79rem;margin-top:6px">${esc(s.crit)}</div>
            ${state_==="now"?`<div class="tiny" style="margin-top:6px;font-style:italic">${esc(s.why)}</div>`:""}
            ${s.drills.length?`<div class="wrap" style="margin-top:8px">${s.drills.map(d=>{const e=exById(d);return e?`<button class="chip" data-drill="${d}">${esc(e.name)}</button>`:"";}).join("")}</div>`:""}
          </div></div>`;}).join("")}
    </div>

    <div class="sec"><div class="eyebrow">Supporting work</div>
      <div class="card"><div class="tiny" style="font-weight:700;margin-bottom:6px">Strength</div>
        <div class="wrap">${t.support.strength.map(s=>`<span class="tag">${esc(s)}</span>`).join("")}</div>
        <div class="tiny" style="font-weight:700;margin:12px 0 6px">Mobility</div>
        <div class="wrap">${t.support.mobility.map(s=>`<span class="tag">${esc(s)}</span>`).join("")}</div>
      </div>
    </div>

    <div class="sec"><div class="eyebrow">Realistic expectations</div>
      <div class="card">
        <p class="sub" style="font-size:.83rem">${esc(t.reality)}</p>
        <div class="kv" style="margin-top:10px"><b>Volume</b><span>${esc(t.volume)}</span></div>
        <div class="kv"><b>If you plateau</b><span>${esc(t.plateau)}</span></div>
      </div>
    </div>

    <div class="sec"><div class="eyebrow">Stage</div>
      <p class="tiny" style="margin-bottom:8px">Worked out from your logs. Override if it is wrong.</p>
      <div class="wrap">${t.stages.map(s=>`<button class="chip ${s.n===p.current?"on":""}" data-setstage="${s.n}">${s.n}</button>`).join("")}
        ${p.manual?'<button class="chip" data-setstage="auto">↺ auto</button>':""}</div>
    </div>`,
   `<button class="btn primary block" id="tree-build">${ICONS.build}Build a session from this</button>`);
  $$("#sheet-body [data-drill]").forEach(b=> b.onclick=()=> openExercise(b.dataset.drill, ()=>openTree(id)));
  $$("#sheet-body [data-setstage]").forEach(b=> b.onclick=()=>{
    state.prefs.treeStage = state.prefs.treeStage||{};
    if(b.dataset.setstage==="auto") delete state.prefs.treeStage[id];
    else state.prefs.treeStage[id] = +b.dataset.setstage;
    save(); openTree(id); render(curView); });
  $("#tree-build").onclick=()=>{
    const st = t.stages.find(s=>s.n===p.current)||t.stages[0];
    openSessionBuilder(st.drills.slice(), t.name+" — stage "+p.current);
  };
}

/* ============================================================
   BUILDER view — draft routine, browse + compare, dosage
============================================================ */
let draft = {name:"", items:[], editingId:null, minutes:10, fatigue:"low", days:[]};
let bCat = "flexion";
let cmp = new Set();
function addToDraft(exId){
  if(draft.items.some(i=>i.ex===exId)){ toast("Already in draft"); return; }
  const e=exById(exId);
  draft.items.push({ex:exId, sets:2, reps:"8", hold:"", note:""});
  toast(e.name+" added to draft");
}
function renderBuilder(){
  const catExs = catProgression(bCat);
  const bRec = recommendedLevel(bCat);
  $("#view-builder").innerHTML = `

   <div class="eyebrow teal" style="margin-bottom:10px">Routine draft ${draft.editingId?"· editing "+esc((routineById(draft.editingId)||{}).name||""):""}</div>
   <div class="card">
     <label class="f">Routine name</label>
     <input type="text" id="dr-name" placeholder='e.g. "Daily shoulder opener", "Handstand prep A"' value="${esc(draft.name)}">
     <div class="grid2" style="margin-top:12px">
       <div><label class="f">Est. minutes</label><input type="number" id="dr-min" min="1" max="60" value="${draft.minutes}"></div>
       <div><label class="f">Fatigue cost</label><select id="dr-fat">
         ${["low","med","high"].map(f=>`<option value="${f}" ${draft.fatigue===f?"selected":""}>${FATIGUE_LBL[f]}</option>`).join("")}</select></div>
     </div>
     <label class="f">Frequency — days to run it</label>
     <div class="wrap">${[1,2,3,4,5,6,0].map(d=>`<button class="chip ${draft.days.includes(d)?"on":""}" data-dd="${d}">${planFor(d).day.slice(0,3)}</button>`).join("")}</div>
     ${draft.items.length? `<label class="f">Drills — set the dosage</label>
       <div class="exl">${draft.items.map((it,i)=>{
         const e=exById(it.ex);
         return `<div style="background:var(--surface2);border:1px solid var(--line);border-radius:12px;padding:11px 12px">
           <div class="row between"><b style="font-size:.88rem">${i+1}. ${esc(e.name)}</b>
             <div class="row" style="gap:4px">
               <button class="iconbtn" style="width:30px;height:30px" data-up="${i}" aria-label="Move up">↑</button>
               <button class="iconbtn" style="width:30px;height:30px" data-rm="${i}" aria-label="Remove">✕</button>
             </div></div>
           <div class="row" style="margin-top:9px;gap:8px;flex-wrap:wrap">
             <div class="stepper"><button data-st="${i}|-1">−</button><input inputmode="numeric" data-sets="${i}" value="${it.sets}"><button data-st="${i}|1">+</button></div>
             <input type="text" data-reps="${i}" placeholder="reps (e.g. 8)" value="${esc(it.reps)}" style="width:88px;padding:9px 10px">
             <input type="text" data-hold="${i}" placeholder="hold (e.g. 30 s)" value="${esc(it.hold)}" style="width:96px;padding:9px 10px">
             <input type="text" data-note="${i}" placeholder="note" value="${esc(it.note)}" style="flex:1;min-width:90px;padding:9px 10px">
           </div>
           <div class="tiny" style="margin-top:6px">Guide: ${esc(e.dosage)}</div>
         </div>`;}).join("")}</div>`
      : `<div class="empty" style="padding:22px">${ICONS.build}Empty draft — add drills from the categories below.</div>`}
     <div class="row" style="margin-top:14px;gap:8px">
       <button class="btn ghost small" id="dr-clear">Clear</button>
       <button class="btn primary" style="flex:1" id="dr-save">${draft.editingId?"Save changes":"Save routine"}</button>
     </div>
   </div>

   <div class="sec"><div class="row between" style="margin-bottom:10px;gap:10px">
       <div class="eyebrow" style="flex:1;margin:0">Browse by bottleneck category</div>
       <button class="btn small primary" id="b-newdrill">${ICONS.build}New drill</button>
     </div>
     <div class="chiprow">${CATS.map(c=>`<button class="chip ${bCat===c.id?"on":""}" data-bc="${c.id}">${c.name}</button>`).join("")}</div>
     <div class="row between" style="margin:2px 0 10px;gap:8px">
       <span class="tiny">Lv 1→4, foundation to loaded. Tap ⊕ to add, ▢ to compare.</span>
       <button class="btn small ${cmp.size>=2?"primary":""}" id="b-cmp" ${cmp.size<2?"disabled style='opacity:.4'":""}>Compare (${cmp.size})</button>
     </div>
     <div class="exl">${catExs.map(e=>`
       <div class="exi" ${e.level===bRec?'style="border-color:var(--teal)"':''}>
         <button class="check ${cmp.has(e.id)?"on":""}" data-cmp="${e.id}" aria-label="Select to compare">${ICONS.check}</button>
         <div class="bd" data-open-ex="${e.id}">
           <div class="nm">${esc(e.name)}${e.level===bRec?' <span class="tag teal" style="margin-left:4px">your step</span>':''}</div>
           <div class="mt">${esc(e.targets)}</div>
           <div class="tiny" style="margin-top:2px">Best: ${e.when.map(w=>WHEN[w]).join(", ")} · ${FATIGUE_LBL[e.fatigue]}</div>
         </div>
         ${lvlBadge(e.level)}
         <button class="iconbtn" style="color:var(--teal)" data-badd="${e.id}" aria-label="Add">⊕</button>
       </div>`).join("")}</div>
   </div>

   <div class="sec"><div class="eyebrow">Saved routines</div>
     ${state.routines.map(r=>`
       <div class="card">
         <div class="row between"><div class="h-md">${esc(r.name)}</div>
           <span class="tag ${r.seeded&&!r.edited?"":"teal"}">${r.seeded&&!r.edited?"seeded":"custom"}</span></div>
         <div class="sub" style="margin:3px 0 8px;font-size:.8rem">${esc(r.useCase||"")}</div>
         <div class="wrap"><span class="tag teal">${r.minutes} min</span><span class="tag">${FATIGUE_LBL[r.fatigue]}</span>
           <span class="tag">${r.items.length} drills</span>
           ${(r.days||[]).length?`<span class="tag amber">${r.days.map(d=>planFor(d).day.slice(0,3)).join(" ")}</span>`:""}</div>
         <div class="row" style="margin-top:11px;gap:7px;flex-wrap:wrap">
           <button class="btn small primary" data-rstart="${r.id}">${ICONS.play}Start</button>
           <button class="btn small" data-redit="${r.id}">Edit</button>
           <button class="btn small" data-rdup="${r.id}">Duplicate</button>
           <button class="btn small" data-rjson="${r.id}">JSON</button>
           <button class="btn small danger" data-rdel="${r.id}">Delete</button>
         </div>
       </div>`).join("")}
   </div>`;
  $("#dr-name").oninput=e=>draft.name=e.target.value;
  $("#dr-min").oninput=e=>draft.minutes=+e.target.value||10;
  $("#dr-fat").onchange=e=>draft.fatigue=e.target.value;
  $$("#view-builder [data-dd]").forEach(c=> c.onclick=()=>{ const d=+c.dataset.dd; draft.days.includes(d)?draft.days=draft.days.filter(x=>x!==d):draft.days.push(d); renderBuilder(); });
  $$("#view-builder [data-st]").forEach(b=> b.onclick=()=>{ const [i,dir]=b.dataset.st.split("|"); const it=draft.items[+i]; it.sets=Math.max(1,Math.min(9,it.sets+ +dir)); renderBuilder(); });
  $$("#view-builder [data-sets]").forEach(inp=> inp.onchange=e=>{ draft.items[+inp.dataset.sets].sets=Math.max(1,+e.target.value||1); });
  ["reps","hold","note"].forEach(k=> $$(`#view-builder [data-${k}]`).forEach(inp=> inp.oninput=e=> draft.items[+inp.dataset[k]][k]=e.target.value));
  $$("#view-builder [data-rm]").forEach(b=> b.onclick=()=>{ draft.items.splice(+b.dataset.rm,1); renderBuilder(); });
  $$("#view-builder [data-up]").forEach(b=> b.onclick=()=>{ const i=+b.dataset.up; if(i>0){ [draft.items[i-1],draft.items[i]]=[draft.items[i],draft.items[i-1]]; renderBuilder(); } });
  $("#dr-clear").onclick=()=>{ draft={name:"",items:[],editingId:null,minutes:10,fatigue:"low",days:[]}; renderBuilder(); };
  $("#dr-save").onclick=()=>{
    if(!draft.name.trim()){ toast("Name the routine first"); $("#dr-name").focus(); return; }
    if(!draft.items.length){ toast("Add at least one drill"); return; }
    if(draft.editingId){
      const r=routineById(draft.editingId);
      Object.assign(r,{name:draft.name.trim(),minutes:draft.minutes,fatigue:draft.fatigue,days:draft.days.slice(),items:JSON.parse(JSON.stringify(draft.items)),edited:true});
      toast("Routine updated");
    } else {
      state.routines.push({id:"r-"+Date.now().toString(36),name:draft.name.trim(),minutes:draft.minutes,fatigue:draft.fatigue,days:draft.days.slice(),useCase:"Custom routine",items:JSON.parse(JSON.stringify(draft.items))});
      toast("Routine saved");
    }
    draft={name:"",items:[],editingId:null,minutes:10,fatigue:"low",days:[]};
    save(); renderBuilder();
  };
  $$("#view-builder [data-bc]").forEach(c=> c.onclick=()=>{ bCat=c.dataset.bc; cmp.clear(); renderBuilder(); });
  $$("#view-builder [data-badd]").forEach(b=> b.onclick=()=>{ addToDraft(b.dataset.badd); renderBuilder(); });
  $$("#view-builder [data-cmp]").forEach(b=> b.onclick=()=>{ const id=b.dataset.cmp; cmp.has(id)?cmp.delete(id):(cmp.size<3&&cmp.add(id)); renderBuilder(); });
  $$("#view-builder [data-open-ex]").forEach(el=> el.onclick=()=> openExercise(el.dataset.openEx));
  $("#b-newdrill").onclick=()=> openDrillEditor();
  $("#b-cmp").onclick=()=>{ if(cmp.size>=2) openCompare([...cmp]); };
  $$("#view-builder [data-rstart]").forEach(b=> b.onclick=()=> startRoutine(b.dataset.rstart));
  $$("#view-builder [data-redit]").forEach(b=> b.onclick=()=>{
    const r=routineById(b.dataset.redit);
    draft={name:r.name,minutes:r.minutes,fatigue:r.fatigue,days:(r.days||[]).slice(),items:JSON.parse(JSON.stringify(r.items)),editingId:r.id};
    renderBuilder(); window.scrollTo({top:0,behavior:"smooth"});
  });
  $$("#view-builder [data-rdup]").forEach(b=> b.onclick=()=>{
    const r=routineById(b.dataset.rdup);
    state.routines.push(Object.assign(JSON.parse(JSON.stringify(r)),{id:"r-"+Date.now().toString(36),name:r.name+" (copy)",seeded:false,edited:false,useCase:r.useCase}));
    save(); renderBuilder(); toast("Duplicated — edit the copy");
  });
  $$("#view-builder [data-rjson]").forEach(b=> b.onclick=()=> showExport("Routine JSON — "+routineById(b.dataset.rjson).name, JSON.stringify(routineById(b.dataset.rjson),null,2), "routine.json"));
  $$("#view-builder [data-rdel]").forEach(b=> b.onclick=()=>{
    const r=routineById(b.dataset.rdel);
    openSheet("Delete routine?", `<p class="sub">“${esc(r.name)}” will be removed. Logs that reference it stay intact.</p>`,
      `<button class="btn ghost" id="del-no">Keep</button><button class="btn danger" style="flex:1" id="del-yes">Delete</button>`);
    $("#del-no").onclick=closeSheet;
    $("#del-yes").onclick=()=>{ state.routines=state.routines.filter(x=>x.id!==r.id); save(); closeSheet(); renderBuilder(); toast("Deleted"); };
  });
}
function openCompare(ids){
  const rows=[["Targets","targets"],["Handstand transfer","why"],["Dosage","dosage"],["Fatigue","fatigue"],["Best time","when"],["Progression","progression"],["Watch for","mistakes"]];
  openSheet("Compare drills",
    ids.map(id=>{const e=exById(id);return `
      <div class="card" style="margin-bottom:12px">
        <div class="row between"><div class="h-md">${esc(e.name)}</div><button class="btn small primary" data-cadd="${e.id}">⊕ Add</button></div>
        ${rows.map(([lbl,k])=>{
          let v = e[k]; if(k==="when") v=e.when.map(w=>WHEN[w]).join(", "); if(k==="fatigue") v=FATIGUE_LBL[v];
          return `<div class="kv"><b>${lbl}</b><span>${esc(v)}</span></div>`;}).join("")}
      </div>`;}).join(""));
  $$("#sheet-body [data-cadd]").forEach(b=> b.onclick=()=>{ addToDraft(b.dataset.cadd); closeSheet(); cmp.clear(); renderBuilder(); });
}

/* ============================================================
   PROGRESS view — charts, insights, milestones
============================================================ */
function lineChart(series, labels, w=560, h=170){
  const pad={l:26,r:8,t:10,b:20};
  const n = labels.length; if(!n) return "";
  const x = i => pad.l + (w-pad.l-pad.r) * (n===1?0.5:i/(n-1));
  const y = v => pad.t + (h-pad.t-pad.b) * (1 - v/10);
  const grid = [0,5,10].map(v=>`<line x1="${pad.l}" y1="${y(v)}" x2="${w-pad.r}" y2="${y(v)}" stroke="var(--line)" stroke-width="1"/><text x="${pad.l-6}" y="${y(v)+3.5}" font-size="9" fill="var(--faint)" text-anchor="end">${v}</text>`).join("");
  const paths = series.map(s=>{
    const pts = s.data.map((v,i)=> v==null?null:[x(i),y(v)]).filter(Boolean);
    if(!pts.length) return "";
    const d = pts.map((p,i)=>(i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1)).join(" ");
    return `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`+
      pts.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="${s.color}"/>`).join("");
  }).join("");
  const step = Math.max(1, Math.ceil(n/6));
  const xl = labels.map((l,i)=> i%step? "" : `<text x="${x(i)}" y="${h-5}" font-size="8.5" fill="var(--faint)" text-anchor="middle">${l}</text>`).join("");
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto">${grid}${paths}${xl}</svg>`;
}
function barChart(vals, labels, max, w=560, h=150){
  const pad={l:8,r:8,t:14,b:20}; const n=vals.length;
  const bw = (w-pad.l-pad.r)/n * .58;
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto">
    ${vals.map((v,i)=>{
      const cx = pad.l + (w-pad.l-pad.r)*(i+.5)/n;
      const bh = max? (h-pad.t-pad.b)*(v/max) : 0;
      return `<rect x="${cx-bw/2}" y="${h-pad.b-bh}" width="${bw}" height="${Math.max(bh,2)}" rx="4" fill="${v?'var(--teal)':'var(--line2)'}" opacity="${v?'.9':'.6'}"/>
        <text x="${cx}" y="${h-pad.b-bh-4}" font-size="9" fill="var(--muted)" text-anchor="middle" font-weight="700">${v||""}</text>
        <text x="${cx}" y="${h-6}" font-size="9" fill="var(--faint)" text-anchor="middle">${labels[i]}</text>`;
    }).join("")}</svg>`;
}
let progRange = 30, progTab = "week";

/* ---- weekly analyzer: what the week actually contained ---- */
function weekWindow(offset){
  const now=new Date(); now.setDate(now.getDate() - (offset||0)*7);
  const dow=(now.getDay()+6)%7;               // Monday-start
  const start=new Date(now); start.setDate(now.getDate()-dow);
  const days=[]; for(let i=0;i<7;i++){ const d=new Date(start); d.setDate(start.getDate()+i);
    days.push(d.toISOString().slice(0,10)); }
  return days;
}
function analyseWeek(offset){
  const days = weekWindow(offset);
  const cls  = (state.classLogs||[]).filter(c=>days.includes(c.date));
  const logs = (state.logs||[]).filter(l=>days.includes(l.date));
  const desk = (state.deskLogs||[]).filter(d=>days.includes(d.date));
  const items = [];
  cls.forEach(c=> (c.items||[]).forEach(it=> items.push(it)));
  // volume by category, using our drills where we can map them
  const catCount = {};
  logs.forEach(l=> (l.done||[]).forEach(id=>{ const e=exById(id); if(e) e.cats.forEach(k=> catCount[k]=(catCount[k]||0)+1); }));
  // which skill ladders saw work
  const skillHits = {};
  TREES.forEach(t=>{
    let n=0;
    t.stages.forEach(st=> (st.match||[]).forEach(m=>{ items.forEach(it=>{ if((it.name||"").toLowerCase()===m.toLowerCase()) n++; }); }));
    if(n) skillHits[t.id]=n;
  });
  const missing = TREES.filter(t=>!skillHits[t.id]);
  const coldCats = CATS.filter(k=> !catCount[k.id]);
  const trained = new Set(days.filter(d=> cls.some(c=>c.date===d) || logs.some(l=>l.date===d)));
  const feels = logs.map(l=>l.feel).filter(Boolean);
  const rough = feels.filter(f=>f==="rough").length;
  return {days, cls, logs, desk, items, catCount, skillHits, missing, coldCats,
          trainedN:trained.size, rough, feels};
}
function renderProgress(){
  const tabs = `<div class="segrow">
    <button class="seg ${progTab==="week"?"on":""}" data-pt="week">This week</button>
    <button class="seg ${progTab==="skills"?"on":""}" data-pt="skills">Skills</button>
    <button class="seg ${progTab==="bests"?"on":""}" data-pt="bests">Bests</button>
    <button class="seg ${progTab==="history"?"on":""}" data-pt="history">History</button></div>`;
  let body="";
  if(progTab==="week") body = viewWeekAnalysis();
  else if(progTab==="skills") body = viewSkillProgress();
  else if(progTab==="bests") body = viewBests();
  else body = viewHistory();
  $("#view-progress").innerHTML = tabs + body;
  $$("#view-progress [data-pt]").forEach(b=> b.onclick=()=>{ progTab=b.dataset.pt; renderProgress(); });
  $$("#view-progress [data-editcl]").forEach(el=> el.onclick=()=> openClassLog(el.dataset.editcl));
  $$("#view-progress [data-editlog]").forEach(el=> el.onclick=()=> openLogForm(el.dataset.editlog));
  $$("#view-progress [data-gotree]").forEach(el=> el.onclick=()=> openTree(el.dataset.gotree));
  const pac=$("#pg-addclass"); if(pac) pac.onclick=()=> openClassLog(todayISO(-1));
  const dm=$("#demo-data"); if(dm) dm.onclick=loadDemo;
  const cd=$("#clear-demo"); if(cd) cd.onclick=clearDemoLogs;
}
function viewWeekAnalysis(){
  const a = analyseWeek(0), p = analyseWeek(1);
  const dayDots = a.days.map(d=>{
    const has = a.cls.some(c=>c.date===d)||a.logs.some(l=>l.date===d);
    const nm = new Date(d+"T12:00:00").toLocaleDateString(undefined,{weekday:"narrow"});
    return `<div class="wd ${has?"on":""}"><span>${nm}</span><i></i></div>`;}).join("");
  const insights=[];
  if(a.trainedN>=5) insights.push(`Trained on ${a.trainedN} of 7 days — that's the consistency that actually moves range.`);
  else if(a.trainedN) insights.push(`${a.trainedN} of 7 days logged. Last week was ${p.trainedN}.`);
  else insights.push("Nothing logged this week yet.");
  if(a.missing.length && a.items.length) insights.push(`No work logged toward: ${a.missing.map(t=>t.name).join(", ")}.`);
  if(a.coldCats.length) insights.push(`Untouched categories: ${a.coldCats.slice(0,4).map(c=>c.name).join(", ")}${a.coldCats.length>4?" and "+(a.coldCats.length-4)+" more":""}.`);
  if(a.rough>=2) insights.push(`${a.rough} rough days this week — worth a lighter week before pushing again.`);
  if(a.desk.length) insights.push(`${a.desk.length} desk resets logged.`);
  const topCats = Object.entries(a.catCount).sort((x,y)=>y[1]-x[1]).slice(0,6);
  const max = topCats.length? topCats[0][1] : 1;
  return `
   <div class="card"><div class="row between"><div class="h-md">This week</div>
     <span class="tag teal">${a.trainedN}/7 days</span></div>
     <div class="wdrow">${dayDots}</div>
     <div class="statgrid" style="margin-top:12px">
       <div class="stat"><div class="n">${a.cls.length}</div><div class="l">sessions</div></div>
       <div class="stat"><div class="n">${a.items.length}</div><div class="l">exercises</div></div>
       <div class="stat"><div class="n">${a.desk.length}</div><div class="l">desk resets</div></div>
     </div></div>

   <div class="sec"><div class="eyebrow">What the week covered</div>
     <div class="card">${topCats.length? topCats.map(([k,v])=>{
       const cat=CATS.find(x=>x.id===k)||{name:k};
       return `<div class="bar"><span class="bl">${esc(cat.name)}</span>
         <span class="bt"><i style="width:${Math.round(100*v/max)}%"></i></span><b>${v}</b></div>`;}).join("")
       : '<span class="sub" style="font-size:.82rem">No support work logged yet this week.</span>'}</div></div>

   <div class="sec"><div class="eyebrow">Skills touched</div>
     <div class="card">${TREES.map(t=>{
       const n=a.skillHits[t.id]||0;
       return `<div class="kv" data-gotree="${t.id}" style="cursor:pointer">
         <b>${esc(t.name)}</b><span>${n? n+" logged":'<span style="color:var(--amber)">nothing this week</span>'}</span></div>`;}).join("")}
     </div></div>

   <div class="sec"><div class="eyebrow">Read on the week</div>
     <div class="card">${insights.map(t=>`<div class="kv"><span style="text-align:left;color:var(--ink);font-size:.85rem">${esc(t)}</span></div>`).join("")}</div></div>`;
}
function viewSkillProgress(){
  return `<div class="eyebrow" style="margin-bottom:10px">Ladder positions</div>
   ${TREES.map(t=>{ const p=treeProgress(t);
     const moved = p.stages.filter(s=>s.count>0).length;
     return `<div class="card" data-gotree="${t.id}" style="cursor:pointer">
       <div class="row between"><div class="h-md">${esc(t.name)}</div><span class="tag teal">Stage ${p.current}</span></div>
       <div class="ladder">${t.stages.map(s=>`<i class="${s.n<p.current?"done":s.n===p.current?"now":""}"></i>`).join("")}</div>
       <div class="tiny" style="margin-top:7px">${moved} of ${t.stages.length} stages have logged work</div>
       ${p.stages.filter(s=>s.best).slice(-2).map(s=>`<div class="kv"><b>${esc(s.stage.name)}</b><span>${esc(s.best.raw)} · ${fmtDate(s.best.date)}</span></div>`).join("")}
     </div>`;}).join("")}`;
}
function viewBests(){
  const pb=personalBests(); const keys=Object.keys(pb).sort();
  return `<div class="eyebrow" style="margin-bottom:10px">Personal bests — everything logged</div>
    <div class="card">${keys.length? keys.map(k=>`<div class="kv"><b>${esc(k)}</b><span>${esc(pb[k].raw)} · ${fmtDate(pb[k].date)}</span></div>`).join("")
      : '<span class="sub" style="font-size:.82rem">Log a few sessions and your bests build up here.</span>'}</div>`;
}
function viewHistory(){
  const logs=(state.logs||[]).slice().sort((a,b)=>a.date<b.date?-1:1);
  const demoN=logs.filter(l=>l.demo).length;
  return `${demoN?`<button class="btn danger block" style="margin-bottom:12px" id="clear-demo">Clear ${demoN} demo log${demoN>1?"s":""}</button>`:""}
   <div class="row between" style="margin-bottom:10px;gap:10px">
     <div class="eyebrow" style="flex:1;margin:0">Sessions</div>
     <button class="btn small" id="pg-addclass">＋ Log a past day</button></div>
   <div class="card">${(state.classLogs||[]).length
     ? (state.classLogs||[]).slice(-15).reverse().map(cl=>`<div class="kv" data-editcl="${cl.date}" style="cursor:pointer">
         <b>${fmtDate(cl.date)}</b><span>${esc(cl.cls)} · ${cl.items.length} exercise${cl.items.length!==1?"s":""}</span></div>`).join("")
     : '<span class="sub" style="font-size:.82rem">No sessions logged yet.</span>'}</div>
   <div class="eyebrow" style="margin:20px 0 10px">Check-ins</div>
   <div class="card">${logs.length? logs.slice(-15).reverse().map(l=>{
       const f=(FEEL.find(x=>x[0]===l.feel)||[])[1]||"—";
       return `<div class="kv" data-editlog="${l.date}" style="cursor:pointer"><b>${fmtDate(l.date)}${l.demo?' <span class="tag amber">demo</span>':''}</b>
         <span>${f}${(l.tight||[]).length?" · "+l.tight.join(", "):""}</span></div>`;}).join("")
     : `<span class="sub" style="font-size:.82rem">No check-ins yet.</span>
        <div style="margin-top:12px"><button class="btn small" id="demo-data">Load demo data</button></div>`}</div>`;
}
function loadDemo(){
  for(let i=14;i>=1;i--){
    if(i%7===5) continue;
    const d=todayISO(-i), dow=new Date(d+"T12:00:00").getDay();
    if(logByDate(d)) continue;
    const rid=planFor(dow).routine;
    state.logs.push({date:d, routineId:rid, done:(routineById(rid)?.items||[]).map(x=>x.ex),
      feel:i%4===0?"rough":i%3===0?"good":"ok", energy:i%4===0?3:i%3===0?8:6,
      tight:i%3===0?["Lats"]:i%4===0?["Pecs","T-spine"]:[], pain:"", notes:"", skills:[], demo:true});
  }
  state.logs.sort((a,b)=>a.date<b.date?-1:1);
  save(); renderProgress(); toast("Demo data loaded");
}
function clearDemoLogs(){
  const n=state.logs.filter(l=>l.demo).length;
  if(!n){ toast("No demo data"); return; }
  SYNC.pendingDeletes=(SYNC.pendingDeletes||[]).concat(state.logs.filter(l=>l.demo).map(l=>l.date));
  state.logs=state.logs.filter(l=>!l.demo); save(); renderProgress(); toast("Demo data cleared");
}

/* ============================================================
   Data sheet — export CSV / JSON, import
============================================================ */
function showExport(title, content, fname){
  openSheet(title,
   `<textarea style="min-height:200px;font-size:.72rem;font-family:monospace" id="exp-ta" readonly>${esc(content)}</textarea>
    <p class="tiny" style="margin-top:8px">Download it, or long-press the text to copy.</p>`,
   `<button class="btn" id="exp-copy">Copy</button><button class="btn primary" style="flex:1" id="exp-dl">Download ${esc(fname)}</button>`);
  $("#exp-copy").onclick=()=>{ $("#exp-ta").select(); try{document.execCommand("copy"); toast("Copied");}catch(e){ navigator.clipboard?.writeText(content).then(()=>toast("Copied")); } };
  $("#exp-dl").onclick=()=>{
    try{
      const a=document.createElement("a");
      a.href=URL.createObjectURL(new Blob([content],{type:fname.endsWith(".csv")?"text/csv":"application/json"}));
      a.download=fname; document.body.appendChild(a); a.click(); a.remove(); toast("Downloading…");
    }catch(e){ toast("Download blocked — copy instead"); }
  };
}
function classCSV(){
  const head=["date","class","order","exercise","variation","assistance","numbers","notes"];
  const q=v=>'"'+String(v==null?"":v).replace(/"/g,'""')+'"';
  const rows=[head.join(",")];
  (state.classLogs||[]).forEach(cl=>(cl.items||[]).forEach((it,i)=>{
    rows.push([cl.date,cl.cls,i+1,it.name,it.variation||"",(ASSIST.find(a=>a[0]===it.assist)||[])[1]||"",it.numbers||"",cl.notes||""].map(q).join(","));
  }));
  return rows.join("\n");
}
function logsCSV(){
  const head=["date","routine","drills_completed","dosage","feel","energy","tightness","pain","notes","skill_sessions"];
  const q=v=>'"'+String(v==null?"":v).replace(/"/g,'""')+'"';
  return [head.join(",")].concat(state.logs.map(l=>[
    l.date, routineById(l.routineId)?.name||"", (l.done||[]).map(id=>exById(id)?.name||id).join("; "),
    l.dosage||"", l.feel||"", l.energy, (l.tight||[]).join("; "), l.pain||"", l.notes||"",
    (l.skills||[]).map(s=>`${skillById(s.skill)?.name||s.skill} Lv${s.level} ${s.preset}${s.metric?" | "+s.metric:""}${s.metric2?" | "+s.metric2:""}`).join(" ;; ")
  ].map(q).join(","))).join("\n");
}
$("#btn-data").onclick=()=>{
  const su = SYNC.user;
  const acctHTML = su
    ? `<div class="acct">
         <div class="av">${esc((su.name||su.email||"?").slice(0,1).toUpperCase())}</div>
         <div class="bd"><b>Synced${SYNC.last?" · "+new Date(SYNC.last).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}):""}</b><span>${esc(su.email||"")}</span></div>
         <button class="btn small" id="d-signout">Sign out</button>
       </div>
       ${SYNC.err?`<div class="notice" style="margin-bottom:12px">${ICONS.info}<span>Last sync failed: ${esc(SYNC.err)}</span></div>`:""}
       <button class="btn block" id="d-syncnow" style="margin-bottom:12px">${ICONS.link}Sync now</button>`
    : `<div class="acct">
         <div class="av">↯</div>
         <div class="bd"><b>Not signed in</b><span>Logs are on this device only</span></div>
       </div>
       <button class="btn primary block" id="d-signin" style="margin-bottom:6px">Sign in with Google</button>
       <p class="tiny" style="margin-bottom:14px">Signing in copies your existing logs to the cloud and keeps every device in step. Nothing is deleted.</p>`;
  openSheet("Data",
   acctHTML + `<div class="exl">
      <button class="btn block" id="d-csv">${ICONS.doc}Export logs → CSV</button>
      <button class="btn block" id="d-ccsv">${ICONS.doc}Export class log → CSV</button>
      <button class="btn block" id="d-json">${ICONS.doc}Export everything → JSON</button>
      <button class="btn block" id="d-rjson">${ICONS.doc}Export routines → JSON</button>
      <label class="btn block" style="cursor:pointer">${ICONS.link}Import JSON backup<input type="file" id="d-imp" accept=".json,application/json" hidden></label>
    </div>
    <p class="tiny" style="text-align:center;margin-top:14px">Stackline · version ${APP_VERSION}</p>
    <div class="notice teal">${ICONS.info}<span>Signed in, your logs sync to the cloud and follow you across devices. Signed out, they save on this device only — export a backup now and then.</span></div>`);
  const bi=$("#d-signin");
  if(bi) bi.onclick=async()=>{
    if(!window.SL_FB || !window.SL_FB.available){ toast("Sync unavailable here"); return; }
    try{ toast("Opening Google sign-in…"); await window.SL_FB.signIn(); closeSheet(); }
    catch(e){ toast("Sign-in failed — try again"); }
  };
  const bo=$("#d-signout");
  if(bo) bo.onclick=async()=>{ await window.SL_FB.signOut(); SYNC.on=false; SYNC.user=null; updateSyncUI(); closeSheet(); toast("Signed out — local data kept"); };
  const bs=$("#d-syncnow");
  if(bs) bs.onclick=async()=>{ await syncPull(); await syncPush(); toast(SYNC.err?"Sync failed":"Synced ✓"); };
  $("#d-csv").onclick=()=> showExport("Logs CSV", logsCSV(), "stackline-logs.csv");
  $("#d-ccsv").onclick=()=> showExport("Class CSV", classCSV(), "stackline-classes.csv");
  $("#d-json").onclick=()=> showExport("Full backup", JSON.stringify({routines:state.routines,logs:state.logs,milestones:state.milestones,prefs:state.prefs},null,2), "stackline-backup.json");
  $("#d-rjson").onclick=()=> showExport("Routines JSON", JSON.stringify(state.routines,null,2), "stackline-routines.json");
  $("#d-imp").onchange=e=>{
    const f=e.target.files[0]; if(!f) return;
    const rd=new FileReader();
    rd.onload=()=>{ try{
      const d=JSON.parse(rd.result);
      if(Array.isArray(d)) { // routines-only file
        d.forEach(r=>{ if(r.id&&r.items&&!routineById(r.id)) state.routines.push(r); });
      } else {
        if(Array.isArray(d.logs)) d.logs.forEach(l=>{ if(l.date&&!logByDate(l.date)) state.logs.push(l); });
        if(Array.isArray(d.routines)) d.routines.forEach(r=>{ if(r.id&&!routineById(r.id)) state.routines.push(r); });
        if(Array.isArray(d.milestones)) state.milestones.push(...d.milestones);
        if(d.prefs) state.prefs=Object.assign(state.prefs,d.prefs);
      }
      state.logs.sort((a,b)=>a.date<b.date?-1:1);
      save(); closeSheet(); render(curView); applyTheme(); toast("Import merged ✓");
    }catch(err){ toast("Couldn't read that file"); } };
    rd.readAsText(f);
  };
};

/* ---------- boot ---------- */
(async function(){
  await loadState();
  applyTheme();
  render("today");
})();
