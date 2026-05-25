import { useState, useEffect, useCallback, useRef } from "react";

// ─── SECTIONS ─────────────────────────────────────────────────────────────────
const SECTIONS_PDM = [
  { id:"executive_summary",  label:"Executive Summary",    icon:"◈", group:"Fondamenta" },
  { id:"analisi_interna",    label:"Analisi Interna",      icon:"⊕", group:"Fondamenta" },
  { id:"analisi_esterna",    label:"Analisi Esterna + PEST",icon:"◎",group:"Fondamenta" },
  { id:"swot",               label:"SWOT & Matrice",       icon:"◉", group:"Fondamenta" },
  { id:"segmentazione",      label:"Segmentazione",        icon:"◆", group:"Target" },
  { id:"personas",           label:"Buyer Personas",       icon:"◇", group:"Target" },
  { id:"posizionamento_usp", label:"Posizionamento + USP", icon:"○", group:"Target" },
  { id:"obiettivi_smart",    label:"Obiettivi SMART",      icon:"◍", group:"Strategia" },
  { id:"marketing_mix_7p",   label:"Marketing Mix 7P",     icon:"◌", group:"Strategia" },
  { id:"canali_media_mix",   label:"Canali & Media Mix",   icon:"◐", group:"Strategia" },
  { id:"value_proposition",  label:"Value Proposition",    icon:"□", group:"Strategia" },
  { id:"funnel_strategy",    label:"Funnel Strategy",      icon:"▽", group:"Strategia" },
  { id:"pricing_strategy",   label:"Pricing Strategy",     icon:"▷", group:"Strategia" },
  { id:"piano_operativo",    label:"Piano Operativo",      icon:"▸", group:"Esecuzione" },
  { id:"lead_nurturing",     label:"Lead Nurturing",       icon:"▣", group:"Esecuzione" },
  { id:"roadmap",            label:"Roadmap Milestones",   icon:"▨", group:"Esecuzione" },
  { id:"tech_stack",         label:"Tech Stack",           icon:"▤", group:"Esecuzione" },
  { id:"kpi_dashboard",      label:"KPI Dashboard",        icon:"▥", group:"Monitoraggio" },
  { id:"budget_media",       label:"Budget & Media Plan",  icon:"▦", group:"Monitoraggio" },
];

const SECTIONS_PDC = [
  { id:"obiettivi_comunicativi", label:"Obiettivi Comunicativi", icon:"◈", group:"Fondamenta" },
  { id:"contesto_comunicativo",  label:"Contesto Comunicativo",  icon:"⊕", group:"Fondamenta" },
  { id:"creative_territory",     label:"Creative Territory",     icon:"◎", group:"Fondamenta" },
  { id:"tone_of_voice",          label:"Tone of Voice",          icon:"◉", group:"Identità" },
  { id:"message_house",          label:"Message House",          icon:"◆", group:"Identità" },
  { id:"copy_strategy",          label:"Copy Strategy",          icon:"◇", group:"Identità" },
  { id:"buyer_insights",         label:"Buyer Insights",         icon:"○", group:"Identità" },
  { id:"architettura_canali",    label:"Architettura Canali",    icon:"◍", group:"Operativo" },
  { id:"piano_editoriale_canale",label:"Piano Editoriale Canale",icon:"◌", group:"Operativo" },
  { id:"campaign_moments",       label:"Campaign Moments",       icon:"◐", group:"Operativo" },
  { id:"funnel_comunicativo",    label:"Funnel Comunicativo",    icon:"▽", group:"Operativo" },
  { id:"adv_social",             label:"Piano ADV Social",       icon:"□", group:"Operativo" },
  { id:"partnership_editoriali", label:"Partnership Editoriali", icon:"▷", group:"Operativo" },
];

const GROUPS_PDM = ["Fondamenta","Target","Strategia","Esecuzione","Monitoraggio"];
const GROUPS_PDC = ["Fondamenta","Identità","Operativo"];

const COLORS_PDM = { Fondamenta:"#0EA5E9", Target:"#8B5CF6", Strategia:"#10B981", Esecuzione:"#F59E0B", Monitoraggio:"#EC4899" };
const COLORS_PDC = { Fondamenta:"#6366F1", Identità:"#EF4444", Operativo:"#0D9488" };

// ─── EDITORIALE SECTIONS ──────────────────────────────────────────────────────
const SECTIONS_ED = [
  { id:"ped",             label:"Piano Editoriale",  icon:"◈", group:"Pianificazione" },
  { id:"calendario",      label:"Calendario",         icon:"◐", group:"Pianificazione" },
  { id:"campagne_exec",   label:"Campagne",           icon:"◑", group:"Pianificazione" },
  { id:"feed",           label:"Feed",              icon:"▦", group:"Esecuzione" },
  { id:"content_tracker", label:"Kanban Board",     icon:"▣", group:"Esecuzione" },
  { id:"publishing",      label:"Publishing Hub",   icon:"▨", group:"Esecuzione" },
  { id:"funnel",          label:"Funnel TOFU/MOFU/BOFU", icon:"△", group:"Monitoraggio" },
  { id:"perf_log",        label:"Performance Log",     icon:"▤", group:"Monitoraggio" },
  { id:"monthly_review",  label:"Monthly Review",       icon:"▥", group:"Monitoraggio" },
  { id:"strategy_update", label:"Aggiornamento Strategia", icon:"⟳", group:"Monitoraggio" },
  { id:"cicli",           label:"Ciclo & Pivot",        icon:"◎", group:"Monitoraggio" },
];
const GROUPS_ED   = ["Pianificazione","Esecuzione","Monitoraggio"];
const COLORS_ED   = { Pianificazione:"#10B981", Esecuzione:"#F59E0B", Monitoraggio:"#8B5CF6" };

// Global Meta (una connessione Nassa per tutto l'agency) 
const NMS_META_KEY = "nms-global-meta";
const loadGlobalMeta  = async () => { try { const r=await window.storage.get(NMS_META_KEY); return r?JSON.parse(r.value):null; } catch { return null; } };
const saveGlobalMeta  = async m  => { try { await window.storage.set(NMS_META_KEY,JSON.stringify(m)); } catch {} };

// ─── META & KANBAN CONSTANTS ─────────────────────────────────────────────────
const META_APP_ID = "1543498264065807";
const META_API    = "https://graph.facebook.com/v19.0";
const META_SCOPES = ["pages_show_list","instagram_basic","instagram_content_publish",
  "instagram_manage_comments","pages_read_engagement","pages_manage_posts",
  "public_profile","business_management"].join(",");

const KAN_COLS = {
  idea:       { emoji:"💡", label:"Idea",        bg:"#FFF8E1", tx:"#92400E" },
  produzione: { emoji:"✏️",  label:"Produzione",  bg:"#FEF3C7", tx:"#D97706" },
  semaforo:   { emoji:"🚦", label:"Semaforo",    bg:"#EDE9FE", tx:"#7C3AED" },
  approvato:  { emoji:"✅", label:"Approvato",   bg:"#ECFDF5", tx:"#059669" },
  live:       { emoji:"🚀", label:"Live",         bg:"#F0FDF4", tx:"#16A34A" },
};
const KAN_NEXT = { idea:"produzione", produzione:"semaforo", semaforo:"approvato", approvato:"live" };
const KAN_NEXT_LABEL = { idea:"→ Produzione", produzione:"→ Semaforo", semaforo:"→ Approvato", approvato:"📤 Approva" };

const CANALE_COLOR = { LinkedIn:"#0A66C2", Instagram:"#E1306C", Email:"#10B981", Blog:"#F59E0B", TikTok:"#111", YouTube:"#FF0000", Facebook:"#1877F2", Altro:"#64748B" };

const TASK_COLORS   = ["#16A34A","#1565C0","#8E44AD","#C2185B","#E65100","#F57F17","#0A66C2","#795548","#37474F","#00838F"];

const PACCHETTI = [
  { id:"starter",     label:"Starter",     emoji:"🥉", price:"490",   desc:"15h/mese · Retainer" },
  { id:"essential",   label:"Essential",   emoji:"🥈", price:"790",   desc:"28h/mese · Retainer" },
  { id:"professional",label:"Professional",emoji:"🥇", price:"1.200", desc:"45h/mese · Retainer" },
  { id:"premium",     label:"Premium",     emoji:"💎", price:"1.800", desc:"70h/mese · Retainer" },
  { id:"full_service",label:"Full Service",emoji:"🚀", price:"2.800", desc:"120h/mese · Retainer" },
  { id:"one_shot",    label:"One Shot",    emoji:"⚡", price:"—",     desc:"Progetto chiuso · A preventivo" },
];

function clientSlug(nome){ return nome.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""); }

function emptyClient(){
  return {
    id:uid(), nome:"Nuovo Cliente",
    referente:"", email:"", settore:"",
    pacchetto:"professional", dataInizio:new Date().toISOString().slice(0,10),
    social:{ ig:"", fb:"", linkedin:"", tiktok:"", sito:"" },
    meta:null,
    portal:{ pin:"", mostraFeed:true, mostraPipeline:false },
    projectIds:[], createdAt:Date.now()
  };
}
const RUOLI_NMS     = ["Direzione Creativa","Strategia","Art Director","SMM","Grafico Senior","AI & Google","Video Maker","Fotografo","Marketing Operativo","Grafico Junior","Copywriter","Sviluppatore"];
const DEFAULT_MEMBERS_NMS = [
  { id:"luca",     nome:"Luca Giunta",       ruolo:"Direzione Creativa",  colore:"#16A34A", tariffa:80, ore:40 },
  { id:"alberto",  nome:"Alberto Arcidiac.", ruolo:"Direzione Creativa",  colore:"#1565C0", tariffa:80, ore:40 },
  { id:"giacomo",  nome:"Giacomo",           ruolo:"Art Director",        colore:"#8E44AD", tariffa:60, ore:32 },
  { id:"paolone",  nome:"Paolone",           ruolo:"Marketing Operativo", colore:"#E65100", tariffa:40, ore:32 },
  { id:"akash",    nome:"Akash",             ruolo:"AI & Google",         colore:"#0A66C2", tariffa:50, ore:24 },
  { id:"paoletto", nome:"Paoletto",          ruolo:"Video Maker",         colore:"#C2185B", tariffa:40, ore:24 },
  { id:"hermes",   nome:"Hermes",            ruolo:"Grafico Junior",      colore:"#F57F17", tariffa:30, ore:32 },
  { id:"matteo",   nome:"Matteo",            ruolo:"Grafico Junior",      colore:"#795548", tariffa:30, ore:24 },
];

// TeamPlanner storage helpers (window.storage, chiavi separate da progetti)
const TP_SK_MEMBERS = "nms-tp:members";
const tpGet = async k => { try { const r=await window.storage.get(k); return r?JSON.parse(r.value):null; } catch { return null; } };
const tpSet = async (k,v) => { try { await window.storage.set(k,JSON.stringify(v)); } catch {} };

function getWeekKey(date) {
  const d=new Date(date),day=d.getDay()||7;
  d.setDate(d.getDate()+4-day);
  const y=d.getFullYear(),w=Math.ceil(((d-new Date(y,0,1))/86400000+1)/7);
  return y+"-W"+String(w).padStart(2,"0");
}
function getMondayOfWeek(weekKey) {
  const [y,w]=weekKey.split("-W").map(Number);
  const jan4=new Date(y,0,4),dow=jan4.getDay()||7;
  const mon=new Date(jan4); mon.setDate(jan4.getDate()-dow+1+(w-1)*7); return mon;
}
function addDays(date,n){ const d=new Date(date); d.setDate(d.getDate()+n); return d; }
function fmtISO(d){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function fmtShort(d){ return String(d.getDate()).padStart(2,"0")+"/"+String(d.getMonth()+1).padStart(2,"0"); }

// ─── META PUBLISH FUNCTIONS (1:1 from App.jsx) ───────────────────────────────
function openMetaOAuth(onPages) {
  const redirectUri = encodeURIComponent("https://nassa-gestione.vercel.app/api/meta-oauth");
  const url = `https://www.facebook.com/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${redirectUri}&scope=${META_SCOPES}&response_type=code`;
  const popup = window.open(url,"MetaLogin","width=620,height=720,left=200,top=80");
  if(!popup||popup.closed){ alert("Popup bloccato — abilita i popup nelle impostazioni del browser."); return; }
  function handleMsg(e) {
    if(e.data?.type==="META_OAUTH_PAGES"){ window.removeEventListener("message",handleMsg); clearInterval(poll); onPages(e.data.pages); }
    if(e.data?.type==="META_OAUTH_ERROR"){ window.removeEventListener("message",handleMsg); clearInterval(poll); alert("Errore Meta: "+e.data.error); }
  }
  window.addEventListener("message",handleMsg);
  const poll=setInterval(()=>{ try{ if(popup.closed){ clearInterval(poll); window.removeEventListener("message",handleMsg); } }catch{} },800);
}
async function pollIgMedia(mediaId,token,maxAttempts=24) {
  for(let i=0;i<maxAttempts;i++){
    await new Promise(r=>setTimeout(r,4000));
    const r=await fetch(`${META_API}/${mediaId}?fields=status_code&access_token=${encodeURIComponent(token)}`);
    const d=await r.json();
    if(d.status_code==="FINISHED") return;
    if(d.status_code==="ERROR") throw new Error("Instagram: errore elaborazione video");
  }
  throw new Error("Instagram: timeout — riprova tra qualche minuto");
}
async function igPublish(igUserId,token,post,scheduleUnix) {
  const tipo=post.tipo||"post"; let creationId;
  if(tipo==="reel") {
    const r=await fetch(`${META_API}/${igUserId}/media`,{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({media_type:"REELS",video_url:post.videoUrl||"",caption:post.caption||"",access_token:token,...(scheduleUnix?{scheduled_publish_time:scheduleUnix}:{})})});
    const d=await r.json(); if(d.error) throw new Error("IG reel: "+d.error.message);
    creationId=d.id; await pollIgMedia(creationId,token);
  } else {
    const r=await fetch(`${META_API}/${igUserId}/media`,{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({image_url:post.immagineUrl||"",caption:post.caption||"",access_token:token,...(scheduleUnix?{scheduled_publish_time:scheduleUnix}:{})})});
    const d=await r.json(); if(d.error) throw new Error("IG post: "+d.error.message);
    creationId=d.id;
  }
  const pub=await fetch(`${META_API}/${igUserId}/media_publish`,{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({creation_id:creationId,access_token:token})});
  const pd=await pub.json(); if(pd.error) throw new Error("IG publish: "+pd.error.message);
  return pd;
}
async function fbPublish(pageId,token,post,scheduleUnix) {
  const tipo=post.tipo||"post",isVideo=tipo==="reel";
  const endpoint=isVideo?`${META_API}/${pageId}/videos`:`${META_API}/${pageId}/photos`;
  const body=isVideo
    ?{file_url:post.videoUrl||"",description:post.caption||"",access_token:token,...(scheduleUnix?{published:false,scheduled_publish_time:scheduleUnix}:{published:true})}
    :{url:post.immagineUrl||"",caption:post.caption||"",access_token:token,...(scheduleUnix?{published:false,scheduled_publish_time:scheduleUnix}:{published:true})};
  const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const d=await r.json(); if(d.error) throw new Error("Facebook: "+d.error.message);
  return d;
}

// ─── KOSMETIKAL DEMO ──────────────────────────────────────────────────────────
const KOSMETIKAL_IV = {
  nome:"Kosmetikal", settore:"Contract manufacturing cosmetico", anno:"2003",
  sede:"Pesaro, Marche", sito:"kosmetikal.it",
  descrizione:"Kosmetikal è un laboratorio cosmetico italiano specializzato in contract manufacturing B2B. Produce formule cosmetiche su specifica per brand terzi tramite due percorsi: Full Service (sviluppo formula + produzione + packaging + certificazioni PIF/CPNP) e White Label (400+ formule pronte, lotti da 10 kg). Gestisce l'intero ciclo internamente senza subappaltatori.",
  differenziale:"Library Advanced: 7 attivi biotech (esosomi, PDRN, peptidi, Spicule, biofermentati, Active Water, cellule staminali vegetali) con schede tecniche e dati di stabilità scaricabili PRIMA del contratto. Certificazione COSMOS Organic d'azienda — non solo di prodotto. Focalizzazione dichiarata: nessun integratore, nessun medical device, nessun brand cosmetico proprio che compete con i clienti.",
  valori:"Advanced before natural · Documenta, non dichiara · Focalizzazione come garanzia strutturale",
  target:"B2B esclusivo. 5 personas: P1 Brand Builder Avanzato (brand mid-size che vogliono attivi biotech verificabili), P2 Startup Visionaria (primo lancio, rischio zero), P3 Buyer Corporate Internazionale (conformità normativa come standard), P4 Buyer Bio Consapevole (COSMOS Organic d'azienda non di prodotto), P5 Cacciatore di Frontiera — target primario (R&D director che sa distinguere chi bluffa).",
  b2x:"B2B — contract manufacturing per brand cosmetici italiani e internazionali",
  mercati:"Italia (primario) · UK · Germania · Francia · Benelux (espansione piano 2026)",
  prodotti:"Full Service: dal brief al prodotto finito, un solo interlocutore, PIF+CPNP inclusi. White Label: 400+ formule pronte, lotti da 10 kg. Library Advanced: risorsa scaricabile — 7 schede tecniche attivi biotech con meccanismo d'azione, veicoli testati, dati di stabilità. Struttura: 1.600 mq, 30 collaboratori, 300.000 kg/anno, 8.000+ formulazioni testate dal 2003.",
  pricing:"Contract manufacturing a commessa. Lotti White Label da 10 kg (accessibile a startup). Budget marketing cliente per brand strutturati: produzione €3.723/mese + Ads €3.000/mese (scenario medio).",
  competitor:"Cosmoderma · Delta BKB · Reynaldi",
  diff_competitor:"Nessun competitor italiano mid-size pubblica schede tecniche verificabili degli attivi prima del contratto. La finestra competitiva è aperta: 12-18 mesi prima che altri la occupino. Kosmetikal ha la Library Advanced come asset esclusivo. COSMOS Organic d'azienda vs solo di prodotto (Reynaldi). Ciclo in-house vs subappaltatori non dichiarati (P3 pain point).",
  canali_attuali:"LinkedIn pagina aziendale (discontinua) · LinkedIn Silvye Malfarà CEO (non attivo) · Instagram (registro non allineato) · Facebook (solo derivato) · Sito web (da allineare al posizionamento Advanced)",
  advertising:"Nessuno attivo. Da attivare: LinkedIn Ads (CPLQ target <60€ — P5 e P3) + Meta Ads Instagram (CPLQ target <35€ — P2). Condizione: prima il piano organico in regime di crociera.",
  obiettivo1:"50 download/mese Library Advanced entro ottobre 2025. 10 lead qualificati/mese da organico LinkedIn entro dicembre 2025. 8 lead/mese entro dicembre 2026. 40% lead con documento tecnico pre-contatto entro dicembre 2026.",
  obiettivo2:"30% lead da mercati esteri entro dicembre 2026. Top 3 keyword 'laboratorio cosmetico esosomi'. 6 menzioni media di settore/anno. Engagement rate LinkedIn 5% entro dicembre 2026.",
  budget:"Scenario medio raccomandato: €3.000/mese Ads (35% LinkedIn + 30% Google + 20% Meta + 15% produzione esterna). Produzione contenuti: €3.723/mese. Totale annuale: ~€83.000.",
  problema:"Comunicazione precedente ancorata al biologico come identità primaria — non comunica il posizionamento Advanced Natural Cosmetic Lab. Nessun piano editoriale sistematico. Nessuna voce pubblica di Silvye Malfarà. La Library Advanced — il differenziale principale — non era mai stata comunicata pubblicamente. Il buyer qualificato non trovava prove materiali del payoff Advanced.",
  cosa_non_funziona:"Presenza social discontinua. Registro non allineato al posizionamento Industrial Biotech. Nessun contenuto tecnico sugli attivi biotech. Assenza totale di strategia di content marketing B2B sistematica.",
  team:"Silvye Malfarà (CEO — approvazione finale, 3-4h/sett) · Responsabile Marketing esterno (15-20h/sett) · Copywriter esterno (6-8h/sett) · Designer esterno (3-4h/sett) · Team R&S per validazione tecnica contenuti (2-3h/sett)",
  risorse:"Google Analytics 4 · Meta Business Suite · Metricool (analytics, non scheduling) · Canva Pro · LinkedIn Campaign Manager · Google Ads",
  note:"Payoff ufficiale: 'Advanced. Then natural.' Creative Territory: 'Laboratorio biotech italiano. Dimostra con documenti quello che altri dichiarano con aggettivi.' Target primario comunicazione: P5 Cacciatore di Frontiera. Se la comunicazione convince P5, convince automaticamente anche P1, P3 e P2 — è la barra più alta. Cosmetica Biodiversa (marchio registrato) rinviata al piano comunicativo 2027.",
};

const KOSMETIKAL_PDM = {
  sections: {
    executive_summary: { versions:[], content:`## Executive Summary

### Il Contesto
Il contract manufacturing cosmetico italiano ha un problema strutturale: molti laboratori producono bene, ma nessuno rende verificabile la propria competenza prima della firma del contratto. Il buyer B2B seleziona il partner sulla base di presentazioni commerciali e impressioni — non di prove materiali. Il risultato: un mercato dove la fiducia è scarsa e il rischio di scelta sbagliata è alto.

### L'Azienda
Kosmetikal è un laboratorio cosmetico italiano fondato nel 2003 a Pesaro. Produce formule cosmetiche su specifica per brand terzi (Full Service e White Label). 1.600 mq di stabilimento, 30 collaboratori, 300.000 kg/anno, 8.000+ formulazioni testate. L'intero ciclo — formulazione, produzione, packaging, certificazioni normative (PIF, CPNP) — è gestito internamente senza subappaltatori.

### La Sfida Strategica
Kosmetikal ha una sostanza tecnica verificabile. Non ha ancora la forma comunicativa che la rende riconoscibile. La comunicazione precedente era ancorata al biologico come identità primaria — generica, priva di prove materiali del termine Advanced. Il buyer qualificato non trovava Kosmetikal quando cercava un partner per formulazioni con esosomi.

### L'Approccio
1. **Library Advanced come prova prima della fiducia** — 7 schede tecniche scaricabili prima del contratto
2. **Registro Industrial Biotech** — dati prima degli aggettivi, su tutti i canali
3. **LinkedIn sistematico** — piano editoriale tecnico che nessun competitor italiano mid-size ha ancora
4. **Voce pubblica di Silvye Malfarà** — la conduzione familiare visibile come garanzia relazionale

### I KPI Chiave
| Obiettivo | Metrica | Target | Orizzonte |
|-----------|---------|--------|-----------|
| Lead generation qualificata | Lead qualificati/mese con doc. tecnico pre-contatto | 8/mese con 40% doc. pre-contatto | Dic. 2026 |
| Brand authority biotech | Download Library Advanced/mese | 50 (ott. 2025) → 150 (dic. 2026) | 18 mesi |
| Internazionalizzazione | % lead da mercati esteri | 30% del totale | Dic. 2026 |
| Riconoscibilità tecnica | Posizione keyword 'laboratorio cosmetico esosomi' | Top 3 Google IT | Dic. 2026 |

### Le 3 Priorità Immediate
1. **Entro 30 giugno 2025** — LinkedIn Silvye attivo con primo post. Dichiarazione focalizzazione live sul sito. Baseline KPI rilevata.
2. **Entro 15 settembre 2025** — Library Advanced pubblica dietro form. Piano editoriale LinkedIn in regime di crociera. Comunicato PR a 6 media target.
3. **Entro 31 dicembre 2025** — 5 landing page verticali live. Blog tecnico con 3 articoli. Almeno 2 menzioni media di settore confermate.`},

    posizionamento_usp: { versions:[], content:`## Posizionamento + USP

### Insight Dominante
Nel contract manufacturing cosmetico, il buyer non cerca il laboratorio più innovativo. Cerca il laboratorio di cui può fidarsi senza doverlo credere sulla parola — perché ha già pagato il prezzo di una scelta sbagliata.

### Formula USP
**"Per brand cosmetici che vogliono attivi biotech verificabili nel loro prodotto, Kosmetikal è l'unico contract manufacturer italiano che trasforma la competenza formulativa in documenti scaricabili prima del contratto — perché la Library Advanced con 7 schede tecniche esiste ed è pubblica."**

### Brand Promise
**"Dimostra. Poi convince."**
Perché funziona: non promette qualità — la promettono tutti. Promette una cosa specifica e verificabile: la documentazione come standard, non come conseguenza del contratto.

### Territorio di Posizionamento
- **Cosa siamo:** Il laboratorio cosmetico italiano che dà le prove tecniche prima della firma
- **Cosa NON siamo:** Un terzista generico · un laboratorio "biologico" · un fornitore flessibile di tutto per tutti
- **Con chi non competeremo:** Brand consumer (no brand propri) · medical device · integratori alimentari

### Matrice di Posizionamento
- Asse X: Profondità tecnica documentata (bassa → alta)
- Asse Y: Accessibilità della prova pre-contratto (nessuna → totale)

| Competitor | Profondità tecnica | Prova pre-contratto | Note |
|---|---|---|---|
| **Kosmetikal** | Alta | Totale | Library Advanced pubblica |
| Cosmoderma | Media | Nessuna | Presenza LinkedIn bassa |
| Delta BKB | Media | Parziale | Registro narrativo-artigianale |
| Reynaldi | Media | Nessuna | Registro valoriale-ESG |`},

    obiettivi_smart: { versions:[], content:`## Obiettivi SMART

### Obiettivi di Marketing (OM)
| Cod. | Obiettivo | Metrica | Baseline | Target | Scadenza | Priorità |
|------|-----------|---------|----------|--------|----------|----------|
| OM1 | Lead generation qualificata | Lead qualificati/mese con budget+timeline definiti | ⚠️ Da rilevare | 8/mese | Dic. 2026 | Alta |
| OM2 | Brand authority biotech | Download Library Advanced + menzioni PR | 0 | 150 download/mese + 6 menzioni/anno | Dic. 2026 | Alta |
| OM3 | Internazionalizzazione | % lead da mercati esteri | ⚠️ Da rilevare | 30% del totale | Dic. 2026 | Media |

### Obiettivi di Comunicazione (OC)
| Cod. | Tipo | Deriva da | Obiettivo | Metrica | Orizzonte |
|------|------|-----------|-----------|---------|-----------|
| OC1 | Cognitivo | OM2 | Rendere verificabile il posizionamento Advanced | % buyer con documento tecnico pre-contatto | 6-9 mesi |
| OC2 | Cognitivo | OM2 | Costruire riconoscibilità nel cluster biotech | Menzioni PR + posizione keyword | 12-18 mesi |
| OC3 | Comportamentale | OM1 | Qualificare il lead prima del contatto | % lead con budget+timeline al primo contatto | 3-6 mesi |
| OC4 | Affettivo | OM1 | Costruire fiducia prima della conversazione | Engagement LinkedIn + apertura newsletter | 6-12 mesi |
| OC5 | Comportamentale | OM3 | Internazionalizzare senza diluire il registro | % lead esteri + traffico sito EN | 9-12 mesi |

### Logica della Traduzione OM → OC
OC1 apre la porta (il buyer scopre le prove) → OC4 costruisce la relazione (il buyer inizia a fidarsi) → OC2 genera riconoscibilità spontanea → OC3 converte (il buyer compila il form) → OC5 scala internazionalmente. Investire solo su OC3 e OC5 senza costruire OC1 e OC4 produce lead in volume ma non in qualità.`},

    budget_media: { versions:[], content:`## Budget & Media Plan

### Scenari di Investimento
| Voce | Scenario Conservativo | Scenario Medio | Scenario Ottimale |
|------|---|---|---|
| Produzione contenuti/mese | €2.626 | €3.723 | €4.818 |
| Budget Ads/mese | €1.500 | €3.000 | €5.000 |
| Tool e software/mese | €34 | €45 | €55 |
| **TOTALE/MESE** | **≈ €4.300** | **≈ €6.900** | **≈ €10.000** |
| **TOTALE/ANNO** | **≈ €52.000** | **≈ €83.000** | **≈ €122.000** |

*Raccomandazione: partire con lo Scenario Medio e scalare in base ai risultati Q4 2025.*

### Allocazione Budget Ads (Scenario Medio — €3.000/mese)
| Canale | % | Budget/mese | CPLQ target | Condizione attivazione |
|--------|---|-------------|-------------|----------------------|
| LinkedIn Ads | 35% | €1.050 | < 60€ | Library Advanced live + 30 post pubblicati |
| Google Ads Search | 30% | €900 | < 35€ | Sito EN operativo + keyword strategy definita |
| Meta Ads (Instagram) | 20% | €600 | < 35€ | LP Full Service + LP White Label live + Pixel |
| Produzione esterna | 15% | €450 | — | Da subito |

### Costi una Tantum (setup — stima)
| Voce | Costo stimato | Priorità |
|------|---|---|
| Shooting fotografico sessione 1 (40+ scatti) | €800-1.200 | Alta — entro ago. 2025 |
| Sviluppo landing page verticali (5 LP) | €2.000-4.000 | Alta — entro set. 2025 |
| Setup analytics completo (GA4 + Pixel + Tag) | €300-500 | Alta — entro lug. 2025 |
| Ottimizzazione profili LinkedIn (pagina + Silvye) | €200-400 | Alta — entro giu. 2025 |

### Le 3 Decisioni da Prendere Subito
1. **Scenario di investimento Ads**: Conservativo (€1.500) · Medio (€3.000) · Aggressivo (€5.000) — raccomandazione: Medio
2. **Responsabile Marketing**: part-time esterno (€1.200-2.000/mese) vs full-time interno (€1.800-2.800 netto) — per Fase 1: esterno
3. **Copywriter e designer**: due profili singoli (più economico, più coordinamento) vs micro-agenzia B2B social (unico punto di contatto)`},
  }
};

const KOSMETIKAL_PDC = {
  sections: {
    creative_territory: { versions:[], content:`## Creative Territory

### La Tensione di Mercato
Il mercato cosmetico è pieno di laboratori che dichiarano l'innovazione. Quelli che la dimostrano con documenti verificabili prima del contratto si contano sulle dita di una mano.

### La Promessa
Kosmetikal è il laboratorio biotech italiano che dimostra, non dichiara.

### Le Prove Materiali

**Prova 1 — La libreria esiste ed è scaricabile**
"Non diciamo di avere gli esosomi. Mostriamo come li formuliamo — meccanismo d'azione, veicoli testati, dati di stabilità. Sette schede. Prima del contratto."

**Prova 2 — Il sistema è tracciabile**
"Ogni lotto produce un campione di riferimento conservato 3 anni con codifica univoca. Non su richiesta — come standard."

**Prova 3 — La scelta è dichiarata**
"Non facciamo integratori. Non facciamo medical device. Non abbiamo brand cosmetici propri. Lo scriviamo sul sito. La focalizzazione non è un limite — è una garanzia strutturale contro i conflitti di interesse."

**Prova 4 — La guida è visibile**
"Silvye Malfarà. CEO e Innovation Strategy. Profilo LinkedIn attivo. Voce editoriale riconoscibile. Chi compra da Kosmetikal sa con chi parla."

### Il Territorio in una Frase
**"Laboratorio biotech italiano. Dimostra con documenti quello che altri dichiarano con aggettivi."**

### Coordinate Visive Essenziali
| Elemento | Standard | ✅ Sì | ❌ No |
|----------|---------|-------|-------|
| Palette | Charcoal #1C1C1A · Beige #F5F0EB · Oro #8B6F47 | Nero industriale + bianco caldo + bronzo | Colori saturi, pastello beauty, gradients |
| Tipografia | Georgia (titoli) · Arial (corpo) · Courier New (dati) | Gerarchia: dato numerico > aggettivo | Font arrotondati (Nunito, Poppins) |
| Fotografia | Luce naturale dura, soggetti tecnici, zero filtri | Close-up strumentazione, mani al lavoro | Stock photo, render 3D, luce pubblicitaria |
| Infografiche | Max 3 colori, dati prominenti, fonte sempre citata | Dato grande + testo descrittivo piccolo | Icone decorative, molecole 3D |`},

    tone_of_voice: { versions:[], content:`## Tone of Voice — Regole Operative

### Posizionamento — Scala Nielsen
| Dimensione | Polo A | 1 | 2 | 3 | 4 | 5 | Polo B |
|---|---|---|---|---|---|---|---|
| Registro | Informale | | | ✦ | | | Formale |
| Tono | Divertente | | | | ✦ | | Serio |
| Rispetto | Irriverente | | | | ✦ | | Rispettoso |
| Energia | Entusiasta | | | ✦ | | | Distaccato |

**Posizione:** Registro-3 / Tono-4 / Rispetto-4 / Energia-3
**Identità sonora:** Preciso · Verificabile · Dichiarativo · Industriale · Affidabile

---

**Regola 1 — I numeri vengono prima degli aggettivi**
- ❌ "Kosmetikal vanta una lunga esperienza nella formulazione cosmetica avanzata."
- ✅ "Dal 2003. 8.000+ formulazioni testate. 7 attivi biotech integrati."

**Regola 2 — Frasi corte. Soggetto → verbo → oggetto**
- ❌ "Essendo un laboratorio specializzato nelle biotecnologie, siamo in grado di offrire un servizio completo."
- ✅ "Kosmetikal gestisce l'intero ciclo internamente. Dal brief al prodotto finito. Un solo interlocutore."

**Regola 3 — Dichiarativo, non interrogativo**
- ❌ "Vuoi sapere come possiamo aiutarti a sviluppare la tua linea cosmetica?"
- ✅ "Il percorso Full Service gestisce ogni fase internamente. PIF e CPNP inclusi."

**Regola 4 — Mai aggettivi senza prova**
- ❌ "Il nostro innovativo laboratorio R&S sviluppa formulazioni all'avanguardia."
- ✅ "65 mq di R&S dedicati. 8.000+ formulazioni testate. Sette attivi biotech con protocolli validati."

**Regola 5 — La naturalità non si celebra — si qualifica**
- ❌ "Utilizziamo ingredienti naturali selezionati con cura."
- ✅ "Ingredienti di origine naturale. Certificazione COSMOS Organic d'azienda. Fornitori AIAB tracciabili."

**Regola 6 — Il registro non cambia con il canale — il formato sì**
- ❌ (Instagram) "✨ La natura ci ispira ogni giorno! 🌿 Scopri la nostra filosofia green!"
- ✅ (Instagram) "Turboemulsore. 1.300 kg per ciclo. Temperatura controllata. Questo è il momento in cui la formula diventa prodotto."

**Regola 7 — La voce di Silvye è personale ma non informale**
- ❌ "Siamo lieti di annunciare il lancio della nostra Library Advanced, uno strumento innovativo che..."
- ✅ "Ho impiegato tre anni a capire perché i nostri clienti faticavano a scegliere. La risposta era semplice: non avevano le prove."

**Regola 8 — Le emoji non appartengono al territorio**
- ❌ "🌿 Sostenibilità · 🔬 Scienza · ✨ Qualità"
- ✅ Testo. Dati. Punto. Mai emoji — su nessun canale.

### Parametri Grammaticali
- Pronome: Lei (formale B2B) nelle comunicazioni commerciali · tu (LinkedIn) per contenuti editoriali
- Emoji: Mai — nessun canale, nessun formato
- Aperture: Sempre dichiarative — mai domande retoriche
- Parole vietate: innovativo · avanzato · all'avanguardia · eccellente · leader · premium (senza prova)`},

    message_house: { versions:[], content:`## Message House

### TETTO — Brand Promise
**"Laboratorio biotech italiano. Dimostra con documenti quello che altri dichiarano con aggettivi."**

---

### Pilastro 1: La libreria esiste
**Messaggio:** "7 attivi biotech formulati e testati. Schede tecniche scaricabili prima del contratto."
**Prova materiale:** Library Advanced — 7 schede con meccanismo d'azione, veicoli testati, dati di stabilità
**Si manifesta in:** LinkedIn Pilastro A · Homepage sito (hero) · Cosmoprof (materiale stampato)

### Pilastro 2: Il sistema è tracciabile
**Messaggio:** "Ciclo produttivo interamente in-house. Un solo interlocutore. PIF e CPNP inclusi come standard."
**Prova materiale:** ISO 9001 · ISO 22716/GMP · CPNP su ogni formula come default
**Si manifesta in:** Dossier RFQ · Landing page Full Service · LinkedIn Pilastro B

### Pilastro 3: La guida è visibile
**Messaggio:** "Silvye Malfarà. CEO e Innovation Strategy. Voce pubblica su LinkedIn."
**Prova materiale:** Profilo LinkedIn Silvye attivo · Post personali firmati · Company profile v5.2
**Si manifesta in:** LinkedIn profilo Silvye · Cosmoprof · Email nurturing

### Pilastro 4: La scelta è dichiarata
**Messaggio:** "No integratori. No medical device. No brand cosmetici propri. La focalizzazione è una garanzia."
**Prova materiale:** Dichiarazione esplicita sul sito · Company profile · Presentazioni commerciali
**Si manifesta in:** LinkedIn Pilastro C · Risposta commerciale FAQ · Sito sezione Chi siamo

---

### Reason Why — Sistema di Prove
| Livello | Reason Why | Prova materiale | Buyer primario | Fase funnel |
|---------|---|---|---|---|
| Primaria | Library Advanced pubblica e verificabile | 7 schede tecniche scaricabili | P5, P1 | Considerazione |
| Strutturale | Ciclo produttivo interamente in-house | PIF+CPNP interni · grafica interna | P3, P1 | Valutazione |
| Sistemica | Certificazioni come sistema aziendale (non di prodotto) | ISO 9001 · COSMOS Organic d'azienda | P3, P4 | Valutazione |
| Distintiva | Focalizzazione dichiarata senza conflitti | Dichiarazione esplicita sul sito | P1, P3 | Awareness |
| Relazionale | Conduzione familiare visibile e responsabile | Silvye Malfarà — nome, volto, LinkedIn | P2, P5 | Fiducia |

---

### Declinazione per Buyer
| Buyer | Pilastro primario | Pilastro secondario | Prova da esibire subito |
|-------|---|---|---|
| P5 Cacciatore Frontiera | P1 — La libreria esiste | P2 — Sistema tracciabile | Library Advanced + call R&S pre-brief |
| P1 Brand Builder | P1 — La libreria esiste | P4 — Scelta dichiarata | Library Advanced — schede stabilità |
| P2 Startup Visionaria | P3 — Guida visibile | P2 — Sistema tracciabile | Silvye come volto + percorso chiaro |
| P3 Buyer Corporate | P4 — Scelta dichiarata | P2 — Sistema tracciabile | ISO + PIF/CPNP + dossier RFQ |
| P4 Buyer Bio | P2 — Sistema tracciabile | P1 — Libreria esiste | Manifesto COSMOS Organic d'azienda |`},

    copy_strategy: { versions:[], content:`## Master Copy Strategy

### 1. Il Contesto Competitivo
Il contract manufacturing cosmetico italiano ha un problema strutturale. Non è la qualità — molti laboratori producono bene. È la verificabilità. Il mercato è pieno di laboratori che dichiarano l'innovazione con aggettivi senza che il buyer possa verificare nulla prima di firmare un contratto.

### 2. L'Insight Dominante
Da tutte e cinque le personas emerge un denominatore comune — non la stessa tensione, ma tutte convergono verso lo stesso punto:

**"Nel contract manufacturing cosmetico, il buyer non cerca il laboratorio più innovativo. Cerca il laboratorio di cui può fidarsi senza doverlo credere sulla parola."**

| Persona | Tensione | Denominatore |
|---------|---|---|
| P5 Cacciatore Frontiera | "Sa riconoscere chi bluffa sugli attivi biotech" | Ha già vissuto la delusione del laboratorio che dichiarava senza dimostrare |
| P1 Brand Builder | "Il laboratorio precedente non sapeva lavorare con attivi biotech avanzati" | Ha già pagato il prezzo della scelta sbagliata |
| P2 Startup Visionaria | "Non può permettersi un errore sul fornitore nel primo anno" | Teme di vivere la delusione — non l'ha ancora vissuta |
| P3 Buyer Corporate | "Ogni gap normativo è un ritardo al lancio" | Ha già subito le conseguenze di un partner che non documentava |
| P4 Buyer Bio | "Ha già pagato il prezzo del greenwashing" | Ha già vissuto la delusione del laboratorio che dichiarava senza certificazione |

### 3. L'Obiettivo di Comunicazione
*Cosa deve pensare il target dopo ogni contatto con la comunicazione di Kosmetikal:*
**"Questo laboratorio non mi sta chiedendo di fidarmi. Mi sta dando le prove per verificare."**

### 4. La Promessa Principale
**Versione lunga (interna):** "Kosmetikal è il primo laboratorio cosmetico italiano che trasforma la competenza biotech in documenti verificabili — prima ancora che tu decida di lavorare con noi."
**Versione breve (claim):** "Dimostra. Poi convince."
**Payoff pubblico:** "Advanced. Then natural."

### 5. Mandatories

**MUST HAVE**
- M1: Un dato numerico verificabile in ogni pezzo di comunicazione
- M2: Il payoff "Advanced. Then natural." in ogni documento ufficiale (homepage, company profile, Library Advanced, firma email, stand Cosmoprof) — sempre in inglese
- M3: La gerarchia Advanced → Natural rispettata: mai aprire con "Siamo un laboratorio biologico"
- M4: Una prova materiale per ogni affermazione tecnica
- M5: Validazione R&S di ogni contenuto che tocca la chimica

**MUST NOT**
- MN1: Aggettivi senza prova: innovativo · avanzato · all'avanguardia · leader · eccellente · premium
- MN2: Il biologico come identità primaria
- MN3: Emoji in qualsiasi formato — mai, su nessun canale
- MN4: Domande retoriche come apertura — sempre dichiarative
- MN5: Greenwashing implicito: sostenibile · eco · green senza certificazione specifica
- MN6: Cosmetica Biodiversa come storia emotiva (piano 2027)
- MN7: Linguaggio consumer: "la tua pelle ci ringrazia" · "scopri il segreto"
- MN8: Competitor nominati nella comunicazione pubblica`},

    campaign_moments: { versions:[], content:`## Campaign Moments

### CM1 — Lancio Library Advanced
**Periodo:** Settembre 2025 · 3 settimane attive + 4 settimane coda
**Big Idea:** *"La libreria è pubblica. Adesso puoi verificarla."*
**Trigger:** Lancio dello strumento più potente del posizionamento Advanced — la prova materiale che nessun competitor ha
**Obiettivo:** 50 download/mese entro ottobre 2025 · 10 lead qualificati entro 30 giorni dal lancio

| Canale | Sett. 1 (pre) | Sett. 2 (lancio) | Sett. 3 (profondità) | Coda |
|---|---|---|---|---|
| LinkedIn pagina | Teaser: il problema | Post lancio | Serie un attivo/sett. | Always on |
| LinkedIn Silvye | Teaser personale | Post lancio personale | Commento tecnico | 1/mese su Library |
| Instagram | Teaser visivo | Carosello 7 schede | Reel formulazione | 1 post/2 settimane |
| Email | — | Email lancio | Sequenza nurturing | Newsletter mensile |
| PR | — | Comunicato stampa | Follow-up media | — |

**KPI specifici:** Download Library: 50 (30gg) → 150 (90gg) · Lead qualificati: 10 (30gg) → 30 (90gg) · Menzioni PR: 2 (30gg) → 4 (90gg)

---

### CM2 — Cosmoprof 2026
**Periodo:** Marzo-Giugno 2026 · 6 settimane pre-fiera + evento + 2 settimane post
**Big Idea:** *"Incontra il laboratorio. Non lo stand."*
**Obiettivo:** 40 contatti qualificati · 20 appuntamenti pre-fissati · 15 brief aperti entro 30 giorni

| Fase | Periodo | Azioni chiave |
|---|---|---|
| Pre-fiera | 6 settimane prima | Annuncio presenza · LP "Prenota incontro con Silvye" · Email outreach · LinkedIn Ads target partecipanti |
| In fiera | Durante evento | 1-2 post LinkedIn/giorno · Instagram Stories dietro le quinte · Documentazione conversazioni in CRM |
| Post-fiera | 2 settimane dopo | Follow-up individuale entro 48h · Pipeline aggiornato con ogni contatto |

---

### CM3 — Posizionamento Internazionale
**Periodo:** Ottobre-Dicembre 2026 · 8 settimane attive
**Big Idea:** *"Made in Italy Biotech. Per il tuo mercato."*
**Obiettivo:** 30% lead da mercati esteri (UK, Germania, Francia, Benelux)

| Settimane | Focus | Messaggio chiave EN |
|---|---|---|
| 1-2 | Il problema | "Most Italian cosmetic labs don't manage PIF and CPNP internally." |
| 3-4 | La soluzione | "PIF. CPNP. CE 1223/2009. Managed internally. Included." |
| 5-6 | La prova | "ISO 9001. ISO 22716/GMP. COSMOS Organic company-level." |
| 7-8 | L'invito | "If you're looking for an Italian biotech lab — let's talk. A technical conversation." |`},
  }
};

function createKosmetikal() {
  const clientId = "demo-client-kosmetikal";
  const proj = {
    id: "demo-kosmetikal",
    clientId,
    name: "Piano Marketing 2025-2026",
    createdAt: Date.now(),
    interview: KOSMETIKAL_IV,
    context: buildCtx(KOSMETIKAL_IV),
    pdm: KOSMETIKAL_PDM,
    pdc: KOSMETIKAL_PDC,
    ed:  { sections:{}, contentItems:[], campagne:[], calendarEvents:[], perfLogs:[], feedItems:[] },
    tasks:[
      {id:uid(),text:"Sessione input con Silvye — 7 domande Appendice A",priority:"high",tag:"Strategia",assignee:"S + A",done:false,createdAt:Date.now()},
      {id:uid(),text:"Confermare lista 7 attivi biotech Library Advanced",priority:"high",tag:"Strategia",assignee:"S",done:false,createdAt:Date.now()},
      {id:uid(),text:"Briefing copywriter voce Winniefred",priority:"high",tag:"Contenuti",assignee:"A + T",done:false,createdAt:Date.now()},
      {id:uid(),text:"Ottimizzazione profilo LinkedIn pagina Kosmetikal",priority:"med",tag:"Social",assignee:"T",done:false,createdAt:Date.now()},
      {id:uid(),text:"Setup Meta Business Manager + Pixel Instagram",priority:"med",tag:"Tecnico",assignee:"T",done:false,createdAt:Date.now()},
      {id:uid(),text:"Copy Strategy v1.1 — sezione prezzo completata",priority:"high",tag:"Strategia",assignee:"A",done:true,createdAt:Date.now()-86400000},
    ],
    milestones:[],
    budget:{ produzione:[{id:uid(),label:"Copywriter esterno",valore:1060},{id:uid(),label:"Designer esterno",valore:525},{id:uid(),label:"Fotografo (equiv. mensile)",valore:100}], ads:{linkedin:1050,google:900,meta:600,altri:450}, note:"" },
  };
  const client = {
    id: clientId,
    nome: "Kosmetikal",
    referente: "Silvye Malfarà", email: "silvye@kosmetikal.it", settore: "Contract manufacturing cosmetico",
    pacchetto: "professional", dataInizio: "2025-06-01",
    social: { ig:"@kosmetikal", fb:"", linkedin:"linkedin.com/company/kosmetikal", tiktok:"", sito:"kosmetikal.it" },
    meta: null,
    portal: { pin:"", mostraFeed:true, mostraPipeline:false },
    projectIds: [proj.id],
    createdAt: Date.now()
  };
  return { client, project: proj };
}

// ─── DATA RULE ────────────────────────────────────────────────────────────────
const DR = `REGOLA DATI: Usa SOLO le informazioni presenti nell'input. Per ogni dato non fornito scrivi ⚠️ DA RILEVARE. Non inventare numeri, nomi, competitor o quote. Segnala chiaramente quando un'affermazione è un'ipotesi strategica vs un fatto verificato.`;

// ─── PROMPTS PDM ──────────────────────────────────────────────────────────────
const P_PDM = {

executive_summary: c => `${DR}
Produci la sezione EXECUTIVE SUMMARY del Piano di Marketing in italiano con markdown.

## Executive Summary

### Il Contesto
[1-2 frasi sul mercato e sul problema che l'azienda risolve — dall'input]

### L'Azienda
[Chi è, cosa fa, da dove viene — basato sull'input]

### La Sfida Strategica
[Il problema centrale che questo piano risolve — dall'input]

### L'Approccio
[La logica strategica in 3-4 punti — dall'input]

### I KPI Chiave
| Obiettivo | Metrica | Target | Orizzonte |
|-----------|---------|--------|-----------|
[solo obiettivi esplicitati nell'input]

### Le 3 Priorità Immediate
1. [azione — con timeframe]
2. [azione — con timeframe]
3. [azione — con timeframe]

---
INPUT: ${c}`,

analisi_interna: c => `${DR}
Produci la sezione ANALISI INTERNA in italiano con markdown.

## Analisi Interna

### Profilo Aziendale
| Campo | Dato |
|-------|------|
| Settore | [dall'input] |
| Anno fondazione | [dall'input o ⚠️ DA RILEVARE] |
| Dimensione | [dall'input o ⚠️ DA RILEVARE] |
| Sede | [dall'input] |
| Modello di business | [dall'input] |

### Portfolio Prodotti / Servizi
[Per ogni prodotto/servizio menzionato nell'input: nome, descrizione breve, target, pricing se disponibile]

### Punti di Forza (interni, verificabili)
[Solo quelli menzionati nell'input o chiaramente deducibili dal profilo aziendale]

### Punti di Debolezza (interni, verificabili)
[Solo quelli menzionati nell'input — mai inventare problemi non dichiarati]

### Asset Strategici
[Brevetti, certificazioni, tecnologie, relazioni, dati — dall'input o ⚠️ DA RILEVARE]

### Capacità Produttiva / Operativa
[Dall'input o ⚠️ DA RILEVARE — non inventare capacità]

---
INPUT: ${c}`,

analisi_esterna: c => `${DR}
Produci la sezione ANALISI ESTERNA + PEST in italiano con markdown.

## Analisi Esterna + PEST

### Il Mercato
- **Dimensione TAM:** [dall'input o ⚠️ DA STIMARE con fonte]
- **Segmento SAM:** [dall'input o ⚠️ DA STIMARE]
- **Target realistico SOM:** [dall'input o ⚠️ DA STIMARE]
- **Trend primario:** [dal settore descritto nell'input]

### Analisi PEST

#### Politico-Legale
| Fattore | Impatto | Implicazione operativa |
|---------|---------|----------------------|
[fattori rilevanti per il settore descritto — segnala se dedotti]

#### Economico
| Fattore | Impatto | Implicazione operativa |
|---------|---------|----------------------|
[fattori rilevanti per il settore]

#### Socio-Culturale
| Fattore | Impatto | Implicazione operativa |
|---------|---------|----------------------|
[fattori rilevanti per il settore]

#### Tecnologico
| Fattore | Impatto | Implicazione operativa |
|---------|---------|----------------------|
[fattori rilevanti per il settore]

### Analisi Competitor
*Solo competitor menzionati nell'input — per gli altri ⚠️ DA RILEVARE*

| Competitor | Posizionamento | Punti di forza | Debolezze | Gap che occupiamo |
|------------|---------------|----------------|-----------|-------------------|
[compila solo con dati forniti nell'input]

### Opportunità di Mercato
[Derivate dall'analisi PEST e dai gap competitivi — segnala se ipotesi]

### Minacce di Mercato
[Derivate dall'analisi PEST e dal profilo competitivo]

---
INPUT: ${c}`,

swot: c => `${DR}
Produci la sezione SWOT + MATRICE STRATEGICA in italiano con markdown.

## SWOT & Matrice Strategica

### SWOT
| | Positivo | Negativo |
|-|----------|----------|
| **Interno** | **Strengths** [punti di forza dall'input] | **Weaknesses** [debolezze dall'input] |
| **Esterno** | **Opportunities** [opportunità dall'input] | **Threats** [minacce dall'input] |

### Dettaglio

**Strengths (forze interne)**
[Elenco con breve motivazione — solo dall'input]

**Weaknesses (debolezze interne)**
[Elenco — solo dall'input, mai inventare]

**Opportunities (opportunità esterne)**
[Elenco derivato dal contesto di mercato]

**Threats (minacce esterne)**
[Elenco derivato dal contesto di mercato]

### Matrice Strategica
| | Opportunità | Minacce |
|-|-------------|---------|
| **Forze** | **SO — Sfrutta forze per cogliere opportunità** [2-3 azioni strategiche] | **ST — Usa forze per difendersi dalle minacce** [2-3 azioni] |
| **Debolezze** | **WO — Supera debolezze per cogliere opportunità** [2-3 azioni] | **WT — Minimizza debolezze ed evita minacce** [2-3 azioni] |

### Priorità Strategiche Emergenti
[Le 3 priorità più urgenti derivate dalla matrice — con motivazione]

---
INPUT: ${c}`,

segmentazione: c => `${DR}
Produci la sezione SEGMENTAZIONE MERCATO in italiano con markdown.

## Segmentazione Mercato

### Variabili di Segmentazione
[Geografica / Demografica / Psicografica / Comportamentale — rilevanti per il settore descritto]

### Segmenti Identificati
*Solo segmenti supportati dai dati dell'input — non inventare*

#### Segmento 1: [nome derivato dall'input]
- **Dimensione stimata:** [dall'input o ⚠️ DA STIMARE con fonte]
- **Caratteristiche:** [dall'input]
- **Bisogno primario:** [dall'input]
- **Potenziale:** [Alto/Medio/Basso — motivato]
- **Attuale penetrazione:** [dall'input o ⚠️ DA RILEVARE]

[Ripeti per ogni segmento identificato dall'input]

### Matrice Priorità Segmenti
| Segmento | Dimensione | Accessibilità | Redditività | Priorità |
|----------|-----------|---------------|-------------|----------|
[solo segmenti dall'input]

### Segmento Primario — Focus Strategico
[Il segmento su cui concentrare le risorse — con motivazione basata sull'input]

---
INPUT: ${c}`,

personas: c => `${DR}
Produci la sezione BUYER PERSONAS in italiano con markdown. Max 3 personas giustificate dall'input.

## Buyer Personas

---

### Persona 1: [Nome archetipico — dal target descritto nell'input]
*Archetipo basato sull'input — non una persona reale*

**Profilo**
- Età/ruolo: [dall'input o range plausibile per il settore]
- Contesto: [dall'input]

**Obiettivo primario:** [dall'input]
**Pain point principale:** [dall'input]
**Canali preferiti:** [dall'input o ⚠️ DA RILEVARE]

**⚡ Insight — La tensione irrisolta**
*Non il pain point — la cosa che lo blocca psicologicamente prima di decidere*
[frase che cattura la tensione specifica — basata sull'input]

**Messaggio leva:** "[frase che tocca esattamente quella tensione]"

**Cosa NON dire mai a questa persona**
[1-2 approcci che lo attivano negativamente]

**Sequenza funnel**
| Fase | Messaggio | CTA |
|------|-----------|-----|
| Awareness | [capisce il problema, non promuove] | — |
| Considerazione | [prova materiale del differenziale] | [CTA tecnica] |
| Conversione | [rimuove l'ultima barriera] | [CTA diretta] |

[Ripeti per Persona 2, Persona 3 — solo se giustificate dall'input]

---
INPUT: ${c}`,

posizionamento_usp: c => `${DR}
Produci la sezione POSIZIONAMENTO + USP in italiano con markdown.

## Posizionamento + USP

### Insight Dominante
*Il denominatore comune tra tutte le personas — la tensione di mercato che il brand risolve*
[Una frase. Derivata dall'input. Non generica.]

### Formula USP
**"Per [target dall'input] che [problema dall'input], [brand] è l'unico [categoria] che [beneficio dall'input] perché [reason to believe dall'input o ⚠️ DA DEFINIRE]."**

### Brand Promise (Payoff operativo)
**"[frase breve e verificabile — non un aggettivo, una promessa]"**
Perché funziona: [spiegazione basata sull'input]

### Territorio di Posizionamento
- **Cosa siamo:** [dall'input]
- **Cosa NON siamo:** [dall'input o derivato dal posizionamento]
- **Con chi NON competeremo:** [scelte di focalizzazione]

### Matrice di Posizionamento
- Asse X: [variabile rilevante per il settore]
- Asse Y: [variabile rilevante per il settore]

| Competitor | Pos. X | Pos. Y | Note |
|------------|--------|--------|------|
| **[Brand]** | | | Il nostro spazio |
[solo competitor dall'input]

---
INPUT: ${c}`,

obiettivi_smart: c => `${DR}
Produci la sezione OBIETTIVI SMART in italiano con markdown.

## Obiettivi SMART

*Ogni obiettivo: Specifico, Misurabile, Attuabile, Rilevante, Temporalizzato.*

### Obiettivi di Marketing (OM)

| Cod. | Obiettivo | Metrica | Baseline | Target | Scadenza | Priorità |
|------|-----------|---------|----------|--------|----------|----------|
| OM1 | [dall'input] | [KPI] | [⚠️ Da rilevare o dall'input] | [target] | [scadenza] | Alta |
[solo obiettivi esplicitati nell'input — mai inventare target]

### Obiettivi di Comunicazione (OC)
*Traduzione degli OM in obiettivi comunicativi: Cognitivo / Affettivo / Comportamentale*

| Cod. | Tipo | OC derivato da | Obiettivo | Metrica | Orizzonte |
|------|------|----------------|-----------|---------|-----------|
| OC1 | Cognitivo | OM? | [far sapere — rendere verificabile il posizionamento] | [metrica] | [orizzonte] |
| OC2 | Affettivo | OM? | [far sentire — costruire fiducia prima della conversazione] | [metrica] | [orizzonte] |
| OC3 | Comportamentale | OM? | [far fare — qualificare il lead prima del contatto] | [metrica] | [orizzonte] |

### Logica della Traduzione OM → OC
[Spiega perché ogni OC serve a raggiungere l'OM corrispondente]

---
INPUT: ${c}`,

marketing_mix_7p: c => `${DR}
Produci la sezione MARKETING MIX 7P in italiano con markdown.

## Marketing Mix 7P

### Product (Prodotto)
- **Core product:** [dall'input]
- **Differenziali:** [dall'input]
- **Proof points:** [dall'input o ⚠️ DA RACCOGLIERE]

### Price (Prezzo)
- **Strategia di pricing:** [dall'input — premium/penetrazione/valore]
- **Range:** [dall'input o ⚠️ DA DEFINIRE]
- **Confronto con competitor:** [dall'input o ⚠️ DA RILEVARE]

### Place (Distribuzione)
- **Canali:** [dall'input]
- **Copertura:** [dall'input]
- **Intermediari:** [dall'input o ⚠️ DA DEFINIRE]

### Promotion (Comunicazione)
- **Mix comunicativo:** [dall'input]
- **Canali prioritari:** [dall'input]
- **Messaggio chiave:** [dalla Brand Promise]

### People (Persone)
- **Team front-line:** [dall'input]
- **Standard di servizio:** [dall'input o ⚠️ DA DEFINIRE]

### Process (Processo)
- **Customer journey:** [dall'input]
- **Pain points del processo:** [dall'input o ⚠️ DA MAPPARE]

### Physical Evidence (Evidenza fisica)
- **Touchpoint fisici/digitali:** [dall'input]
- **Standard visivi:** [dall'input o ⚠️ DA DEFINIRE]

---
INPUT: ${c}`,

canali_media_mix: c => `${DR}
Produci la sezione CANALI & MEDIA MIX in italiano con markdown.

## Canali & Media Mix

### Architettura OEPS
| Tipo | Canale | Obiettivo | Budget % | Controllo | Priorità |
|------|--------|-----------|----------|-----------|----------|
| Owned | [sito, blog, email] | [dall'input] | Solo produzione | Totale | |
| Earned | [PR, referral, menzioni] | [dall'input] | Solo tempo | Zero | |
| Paid | [Ads] | [dall'input] | [dall'input o ⚠️] | Parziale | |
| Shared | [eventi, partner] | [dall'input] | [dall'input o ⚠️] | Condiviso | |

### Priorità Canali per Fase Funnel
| Canale | Fonte | TOFU | MOFU | BOFU | Buyer primario |
|--------|-------|------|------|------|----------------|
[solo canali menzionati nell'input]

### Scheda per Canale Prioritario

#### [Canale 1 — identificato dall'input]
- **Ruolo:** [awareness/lead gen/conversione/retention]
- **Buyer target:** [dalla segmentazione]
- **Frequenza:** [standard di settore]
- **KPI:** [metriche chiave]
- **Budget stimato:** [dall'input o ⚠️ DA DEFINIRE]
- **Condizione di attivazione:** [cosa deve essere pronto prima di attivare]

[Ripeti per canali rilevanti]

### Piano ADV — Targeting per Campagna
*Solo se ADV menzionato nell'input*

| Campagna | Buyer | Piattaforma | Targeting | CPLQ target | Condizione attivazione |
|----------|-------|-------------|-----------|-------------|----------------------|
[dall'input o ⚠️ DA DEFINIRE con il cliente]

---
INPUT: ${c}`,

value_proposition: c => `${DR}
Produci la sezione VALUE PROPOSITION CANVAS in italiano con markdown.

## Value Proposition Canvas

### Profilo Cliente (per il buyer primario)

**Jobs to be done** *(cosa sta cercando di fare — funzionale, sociale, emotivo)*
[dall'input]

**Pains** *(frustrazioni, rischi, ostacoli)*
[dall'input]

**Gains** *(benefici desiderati, aspettative, sorprese positive)*
[dall'input]

### Mappa del Valore

**Pain relievers** *(come il prodotto allevia i pain)*
[dall'input — con corrispondenza esplicita ai pain identificati]

**Gain creators** *(come crea i gain desiderati)*
[dall'input — con corrispondenza ai gain identificati]

**Products & Services** *(le offerte concrete che generano valore)*
[dall'input]

### Fit Strategico
*Dove c'è il fit più forte — e dove mancano ancora prove materiali*

| Pain/Gain | Coperto da | Prova materiale | Stato |
|-----------|-----------|-----------------|-------|
[dall'input — segnala ⚠️ dove mancano prove]

---
INPUT: ${c}`,

funnel_strategy: c => `${DR}
Produci la sezione FUNNEL STRATEGY completa in italiano con markdown. Ogni stage deve avere obiettivi SMART, non generici.

## Funnel Strategy — TOFU / MOFU / BOFU

### Distribuzione target contenuti
| Stage | % target mensile | Obiettivo primario | KPI di riferimento |
|---|---|---|---|
| **TOFU** (Awareness) | [%] | [obiettivo SMART — es. +500 impression/sett su LI] | [KPI — es. Reach, Impression, Follower growth] |
| **MOFU** (Consideration) | [%] | [obiettivo SMART — es. 50 download Library/mese] | [KPI — es. CTR, Download, Email open rate] |
| **BOFU** (Conversion) | [%] | [obiettivo SMART — es. 10 richieste preventivo/mese] | [KPI — es. Lead qualificati, CPL, Conversion rate] |

*Nota: le % devono sommare 100%. Base di partenza: TOFU 40% · MOFU 40% · BOFU 20% — adatta al settore e stadio del brand.*

### Target audience per stage

**TOFU — Chi stiamo attirando**
- Profilo: [ruolo, settore, dimensione azienda]
- Consapevolezza del problema: [nulla / generica / presente]
- Trigger di ingresso nel funnel: [evento o momento che li porta a cercare]

**MOFU — Chi stiamo qualificando**
- Profilo: [differenza rispetto al TOFU — già sa del problema]
- Obiezioni principali: [perché non ha ancora scelto noi]
- Contenuti che li convertono da TOFU a MOFU: [tipo di contenuto]

**BOFU — Chi stiamo convertendo**
- Profilo: [già conosce la soluzione, valuta i fornitori]
- Decisore vs influencer: [chi firma l'acquisto vs chi raccomanda]
- Barriera finale all'acquisto: [paura del rischio, prezzo, timing, procurement]

### KPI per stage con target numerico
| Stage | KPI | Target mensile | Frequenza misurazione |
|---|---|---|---|
| TOFU | [es. Reach LinkedIn] | [numero] | [settimanale/mensile] |
| MOFU | [es. CTR su contenuti educativi] | [%] | [settimanale] |
| BOFU | [es. Lead qualificati] | [numero] | [settimanale] |

### Durata media per stage
- Da TOFU a MOFU: [stima in giorni/settimane — basata sul ciclo di vendita]
- Da MOFU a BOFU: [stima]
- Da BOFU a cliente: [stima]

### Canali per stage
| Stage | Canale primario | Canale secondario | Formato preferito |
|---|---|---|---|
| TOFU | [es. LinkedIn organico] | [es. SEO / Google] | [es. Post educativi, Reel] |
| MOFU | [es. Email / Newsletter] | [es. LinkedIn Ads retargeting] | [es. Carousel, Webinar, Case study] |
| BOFU | [es. Sales enablement] | [es. Google Search intent] | [es. Testimonial, Demo, Offerta] |

---
INPUT: ${c}`,

pricing_strategy: c => `${DR}
Produci la sezione PRICING STRATEGY in italiano con markdown.

## Pricing Strategy

### Posizionamento di Prezzo
[Dall'input: premium / valore / penetrazione / skimming — con motivazione]

### Struttura di Pricing
| Prodotto/Servizio | Prezzo | Logica | Confronto competitor |
|-------------------|--------|--------|---------------------|
[dall'input — per prezzi non noti: ⚠️ DA DEFINIRE]

### Modello di Revenue
[Dall'input: transazionale / abbonamento / retainer / progetto / freemium]

### Elasticità al Prezzo
[Basata sul profilo del buyer primario e sul settore — segnala se ipotesi]

### Politica Sconti e Condizioni
[Dall'input o ⚠️ DA DEFINIRE]

### Pricing vs Competitor
[Solo se competitor e prezzi sono nell'input — altrimenti ⚠️ DA RILEVARE]

---
INPUT: ${c}`,

piano_operativo: c => `${DR}
Produci la sezione PIANO OPERATIVO in italiano con markdown.

## Piano Operativo

### Fase 1 — Setup (Mese 1-2)
| Azione | Responsabile | Deliverable | Deadline | Dipendenze |
|--------|-------------|-------------|----------|-----------|
[azioni di setup necessarie basate sull'input]

### Fase 2 — Lancio (Mese 2-4)
| Azione | Responsabile | Deliverable | Deadline | Dipendenze |
[azioni di lancio basate sull'input]

### Fase 3 — Crescita (Mese 4-12)
| Azione | Responsabile | Deliverable | Deadline | Dipendenze |
[azioni di crescita basate sull'input]

### Team e Risorse Necessarie
| Ruolo | Interno/Esterno | Ore/mese stimate | Costo mensile |
|-------|----------------|-----------------|---------------|
[dall'input o stime standard per il tipo di business]

### Dipendenze Critiche
[Cosa deve essere fatto prima che altre azioni possano partire]

### Rischi e Contingenze
| Rischio | Prob. | Impatto | Piano B |
|---------|-------|---------|---------|
[3-5 rischi realistici per il tipo di business descritto]

---
INPUT: ${c}`,

lead_nurturing: c => `${DR}
Produci la sezione LEAD NURTURING FLOWS in italiano con markdown.

## Lead Nurturing Flows

### Logica del Nurturing
[Dall'input: come si qualifica un lead, quanto dura il ciclo di vendita, chi decide]

### Flow 1 — [Nome flusso — derivato dal buyer primario dell'input]

**Trigger:** [cosa attiva il flow — es. download risorsa, form contatto]
**Buyer:** [persona di riferimento]
**Durata:** [giorni/settimane]

| Step | Canale | Messaggio | CTA | Timing |
|------|--------|-----------|-----|--------|
| 1 | [email/LinkedIn/etc] | [messaggio non commerciale — porta valore] | [CTA tecnica] | Giorno 0 |
| 2 | | | | Giorno 3 |
| 3 | | | | Giorno 7 |
| 4 | | | [CTA commerciale] | Giorno 14 |

**Condizione di uscita dal flow:** [qualificato / non qualificato / silenzio]

[Aggiungi Flow 2 per buyer secondario se giustificato dall'input]

### Criteri di Qualificazione Lead
| Criterio | Segnale | Strumento |
|----------|---------|-----------|
[dall'input o standard per il settore]

### DM Template — Risposta al Lead Qualificato
[Template concreto per il primo contatto con lead qualificato — calibrato sul buyer primario dell'input]

---
INPUT: ${c}`,

roadmap: c => `${DR}
Produci la sezione ROADMAP MILESTONES in italiano con markdown.

## Roadmap Milestones

### Timeline Visiva

**Q1 (Mesi 1-3)**
- [ ] [Milestone 1 — deliverable concreto]
- [ ] [Milestone 2]
- [ ] [Milestone 3]

**Q2 (Mesi 4-6)**
- [ ] [Milestone 1]
- [ ] [Milestone 2]

**Q3 (Mesi 7-9)**
- [ ] [Milestone 1]
- [ ] [Milestone 2]

**Q4 (Mesi 10-12)**
- [ ] [Milestone 1]
- [ ] Review annuale e piano anno successivo

### Milestone Critiche — Gate Go/No-Go
| Milestone | Criteri di successo | Data | Decisione se KO |
|-----------|---------------------|------|-----------------|
[le 3-4 milestone che bloccano le fasi successive]

### Quick Wins (prime 30 giorni)
[3-5 azioni ad alto impatto e bassa complessità eseguibili subito]

---
INPUT: ${c}`,

tech_stack: c => `${DR}
Produci la sezione TECH STACK MARKETING in italiano con markdown.

## Tech Stack Marketing

*Una funzione = uno strumento. Niente tool ridondanti.*

| Funzione | Tool raccomandato | Alternativa | Costo/mese | Priorità |
|----------|------------------|-------------|------------|----------|
| CRM / Pipeline | [dall'input o raccomandazione per il settore] | | | Alta |
| Email marketing | | | | Alta |
| Analytics | Google Analytics 4 | | Gratuito | Alta |
| Social scheduling | [dall'input o raccomandazione] | | | Media |
| ADV tracking | Meta Pixel + GA4 | | Gratuito | Alta |
| Project management | [dall'input o raccomandazione] | | | Media |
| Design contenuti | | | | Media |
[integra con tool menzionati nell'input]

### Integrazioni Critiche
[Come i tool comunicano tra loro — pipeline dati]

### Stack Minimale (budget limitato)
[Configurazione con 3-4 tool essenziali per iniziare senza sprechi]

### Setup e Tempi di Configurazione
| Tool | Tempo setup | Chi lo configura | Priorità |
|------|-------------|-----------------|----------|
[stime realistiche]

---
INPUT: ${c}`,

kpi_dashboard: c => `${DR}
Produci la sezione KPI DASHBOARD in italiano con markdown.

## KPI Dashboard

### Livello 1 — Business KPI (mensili — per il CEO)
| KPI | Come si misura | Baseline | Target Q4 | Tool |
|-----|---------------|----------|-----------|------|
| Fatturato da canali digitali | | ⚠️ Da rilevare | | CRM |
| Numero lead qualificati/mese | | ⚠️ Da rilevare | | CRM |
| Costo per Lead Qualificato (CPLQ) | | ⚠️ Da rilevare | | Ads Manager |
| Tasso di conversione lead→cliente | | ⚠️ Da rilevare | | CRM |
[adatta ai KPI esplicitati nell'input]

### Livello 2 — Marketing KPI (settimanali — per il team)
| KPI | Canale | Come si misura | Target | Frequenza |
|-----|--------|---------------|--------|-----------|
[KPI operativi per i canali identificati nell'input]

### Livello 3 — Content KPI (per contenuto)
| KPI | Cosa misura | Benchmark | Target |
|-----|-------------|-----------|--------|
| Save rate | Contenuti salvati / reach | [settore] | |
| Click rate | Click / reach | [settore] | |
[adatta al tipo di contenuto e canali]

### Sanity Check Mensile
*La domanda unica che vale più di tutti i report:*
"[una domanda specifica che verifica se la comunicazione sta raggiungendo il buyer giusto — dall'input]"

### Soglie di Allerta — Kill Switch
| Metrica | Soglia critica | Durata | Azione |
|---------|---------------|--------|--------|
| CPLQ | > 2x target | 7 giorni | Pausa campagna + revisione |
[3-5 soglie operative]

---
INPUT: ${c}`,

budget_media: c => `${DR}
Produci la sezione BUDGET & MEDIA PLAN in italiano con markdown.

## Budget & Media Plan

### Scenari di Investimento

| Voce | Scenario Conservativo | Scenario Medio | Scenario Ottimale |
|------|-----------------------|----------------|-------------------|
| Produzione contenuti/mese | [stima] | [stima] | [stima] |
| Budget Ads/mese | [dall'input o stima] | | |
| Tool e software/mese | [stima] | | |
| Personale/consulenze/mese | [dall'input o ⚠️ DA DEFINIRE] | | |
| **TOTALE/MESE** | | | |
| **TOTALE/ANNO** | | | |

*⚠️ Budget dall'input: [cifra se fornita — altrimenti indicare range tipico per il settore]*

### Allocazione Budget Ads per Canale
| Canale | % budget Ads | CPLQ target | Condizione attivazione |
|--------|-------------|-------------|----------------------|
[solo canali Ads identificati nell'input]

### Costi una Tantum (setup)
| Voce | Costo stimato | Priorità |
|------|--------------|----------|
| Setup analytics + pixel | [stima] | Alta |
| Shooting fotografico/video | [dall'input o ⚠️] | |
[integra con quanto emerge dall'input]

### ROI Atteso
| Scenario | Investimento annuale | Lead attesi | Clienti attesi | ROAS stimato |
|----------|---------------------|-------------|----------------|-------------|
[solo se ci sono abbastanza dati nell'input — altrimenti ⚠️ DA CALCOLARE con dati reali]

### 3 Decisioni da Prendere Subito
1. [decisione su budget/scenario da scegliere]
2. [decisione su interno vs esterno]
3. [decisione su tool/configurazione]

---
INPUT: ${c}`,
};

// ─── PROMPTS PDC ──────────────────────────────────────────────────────────────
const P_PDC = {

obiettivi_comunicativi: c => `${DR}
Produci la sezione OBIETTIVI COMUNICATIVI in italiano con markdown.

## Obiettivi Comunicativi

### La Logica della Traduzione
*Gli obiettivi di marketing dicono cosa ottenere. Gli obiettivi di comunicazione dicono cosa deve fare la comunicazione per ottenerlo. Non sono la stessa cosa.*

### Dalla Matrice OM → OC
| OC | Tipo | Deriva da | Obiettivo | Metrica primaria | Orizzonte |
|----|------|-----------|-----------|-----------------|-----------|
| OC1 | Cognitivo | [OM?] | [rendere verificabile il posizionamento] | [metrica] | [6-9 mesi] |
| OC2 | Cognitivo | [OM?] | [costruire riconoscibilità nel cluster] | [metrica] | [12-18 mesi] |
| OC3 | Comportamentale | [OM?] | [qualificare il lead prima del contatto] | [metrica] | [3-6 mesi] |
| OC4 | Affettivo | [OM?] | [costruire fiducia prima della conversazione] | [metrica] | [6-12 mesi] |
| OC5 | Comportamentale | [OM?] | [internazionalizzare / espandere] | [metrica] | [9-12 mesi] |

*Adatta il numero e il tipo di OC agli obiettivi reali dell'input*

### La Sequenza Logica
[Spiega la logica causale: quale OC deve essere raggiunto prima degli altri e perché]

### Cosa la Comunicazione NON deve fare
[Basato sull'input: 3-4 cose da evitare esplicitamente]

---
INPUT: ${c}`,

contesto_comunicativo: c => `${DR}
Produci la sezione ANALISI CONTESTO COMUNICATIVO in italiano con markdown.

## Contesto Comunicativo

### Situazione di Partenza
[Dal brief: gap tra identità reale e percezione esterna, punti critici della comunicazione attuale]

### Come Comunicano i Competitor
*Solo competitor menzionati nell'input — per gli altri ⚠️ DA RILEVARE*

| Competitor | Canale primario | Registro | Frequenza | Gap che occupiamo |
|------------|----------------|---------|-----------|-------------------|
[dall'input]

**La finestra competitiva:**
[Lo spazio libero identificato dall'analisi — segnala se ipotesi]

### Mappatura Stakeholder
| Stakeholder | Tipo | Priorità | Bisogno informativo | Canale preferito |
|-------------|------|---------|---------------------|-----------------|
| [Clienti primari] | Cliente | Alta | | |
| [Media di settore] | Media | Alta | | |
| [Partner] | Partner | Media | | |
| [Team interno] | Interno | Media | Brand ambassador del posizionamento |  |
[adatta agli stakeholder rilevanti per il business descritto]

### Baseline Comunicativa da Rilevare
*Prima di attivare qualsiasi campagna*
[Lista di dati da misurare: follower, ER, traffico, posizione keyword — adattata ai canali dell'input]

---
INPUT: ${c}`,

creative_territory: c => `${DR}
Produci la sezione CREATIVE TERRITORY in italiano con markdown.

## Creative Territory

*Lo spazio mentale in cui il brand deve vivere nella testa del buyer. Viene prima del tono di voce. Orienta ogni scelta comunicativa.*

### La Tensione di Mercato
*Il problema strutturale del mercato che il brand risolve — non con aggettivi, con un dato o un'osservazione verificabile*
[Una frase. Non generica. Derivata dall'input.]

### La Promessa
*Cosa fa il brand di diverso da tutti gli altri — verificabile, non solo dichiarato*
[Una frase. Con un verbo di azione. Non "siamo" — "facciamo" / "dimostriamo" / "documentiamo"]

### Le Prove Materiali
*Le cose concrete che rendono la promessa credibile — non aggettivi, asset verificabili*

**Prova 1 — [nome]**
"[come si dimostra — dall'input]"

**Prova 2 — [nome]**
"[come si dimostra]"

**Prova 3 — [nome]**
"[come si dimostra]"

[Aggiungi Prova 4 solo se giustificata dall'input]

### Il Territorio in una Frase
*La guida rapida per chiunque produca comunicazione*
**"[Frase operativa — corta, verificabile, non un aggettivo]"**

### Coordinate Visive Essenziali
| Elemento | Standard | Cosa sì | Cosa no |
|----------|---------|---------|---------|
| Palette | [dall'input o ⚠️ DA DEFINIRE] | | |
| Tipografia | | | |
| Fotografia | | | |
| Tono visivo | | | |

---
INPUT: ${c}`,

tone_of_voice: c => `${DR}
Produci la sezione TONE OF VOICE — REGOLE OPERATIVE in italiano con markdown.

## Tone of Voice — Regole Operative

*Non è una descrizione del tono — sono istruzioni per chi produce contenuti. Ogni regola ha un esempio concreto.*

### Posizionamento — Scala Nielsen
| Dimensione | Polo A | 1 | 2 | 3 | 4 | 5 | Polo B |
|---|---|---|---|---|---|---|---|
| Registro | Informale | | | | | | Formale |
| Tono | Divertente | | | | | | Serio |
| Rispetto | Irriverente | | | | | | Rispettoso |
| Energia | Entusiasta | | | | | | Distaccato |
**Posizione:** [motivata dall'input] · **Identità sonora:** [5 aggettivi]

---

**Regola 1 — [titolo derivato dall'input]**
- ❌ "[esempio sbagliato — concreto per il settore]"
- ✅ "[esempio corretto — concreto per il settore]"

**Regola 2 — [titolo]**
- ❌ "[esempio]" · ✅ "[esempio]"

**Regola 3 — [titolo]**
- ❌ "[esempio]" · ✅ "[esempio]"

**Regola 4 — [titolo]**
- ❌ "[esempio]" · ✅ "[esempio]"

**Regola 5 — [titolo]**
- ❌ "[esempio]" · ✅ "[esempio]"

[Aggiungi Regola 6-8 solo se giustificate dall'input]

### Parametri Grammaticali
- Pronome: [dall'input] · Emoji: [sì/no — con criterio] · Lunghezza caption: [per canale]
- Parole vietate: [dall'input + evidenti per il settore]
- Aperture: [sempre dichiarative / mai retoriche?]

### Il Brand è / Non è
| È | Non è |
|---|-------|
[almeno 5 righe — dall'input]

---
INPUT: ${c}`,

message_house: c => `${DR}
Produci la sezione MESSAGE HOUSE in italiano con markdown.

## Message House

### TETTO — Brand Promise
*La frase che unifica tutta la comunicazione. Corta. Verificabile. Non un aggettivo.*
**"[brand promise — dall'input]"**

---

### Pilastro 1: [nome — dall'input]
**Messaggio:** [frase concreta]
**Prova materiale:** [dall'input o ⚠️ DA RACCOGLIERE]
**Si manifesta in:** [formato/canale]

### Pilastro 2: [nome]
**Messaggio:** [frase]
**Prova materiale:** [dall'input o ⚠️ DA RACCOGLIERE]
**Si manifesta in:** [formato/canale]

### Pilastro 3: [nome]
**Messaggio:** [frase]
**Prova materiale:** [dall'input o ⚠️ DA RACCOGLIERE]
**Si manifesta in:** [formato/canale]

[Aggiungi Pilastro 4 solo se giustificato dall'input]

---

### Reason Why — Sistema di Prove
| Livello | Reason Why | Prova materiale | Buyer primario | Fase funnel |
|---------|-----------|-----------------|----------------|-------------|
| Primaria | [la prova più forte e immediata — dall'input] | | | Considerazione |
| Strutturale | [garanzia di processo — dall'input] | | | Valutazione |
| Distintiva | [focalizzazione dichiarata — dall'input] | | | Awareness |

---

### Declinazione per Buyer
| Buyer | Pilastro primario | Pilastro secondario | Prova da esibire subito |
|-------|-------------------|---------------------|------------------------|
[solo per le personas identificate nell'input]

### Cosa Dire vs Cosa NON Dire
| ✅ Dire | ❌ Non dire mai |
|--------|----------------|
[almeno 5 righe — dall'input]

---
INPUT: ${c}`,

copy_strategy: c => `${DR}
Produci la sezione MASTER COPY STRATEGY in italiano con markdown.

## Master Copy Strategy
*La bussola per ogni pezzo di comunicazione. Risponde a: perché un buyer dovrebbe scegliere noi invece di qualsiasi altro?*

### 1. Il Contesto Competitivo
[Il problema strutturale del mercato — dall'input]

### 2. L'Insight Dominante
*Il denominatore comune tra tutte le personas. Non è ovvio — è il punto di leva che il mercato ignora.*
**"[frase che cattura la tensione profonda di mercato]"**

| Persona | Tensione | Denominatore |
|---------|----------|--------------|
[dall'input]

### 3. L'Obiettivo di Comunicazione
*Cosa deve pensare il target dopo ogni contatto con la comunicazione:*
**"[frase in prima persona del buyer]"**

| Livello | Obiettivo | Come si misura |
|---------|-----------|----------------|
| Cognitivo | [far sapere] | [metrica] |
| Affettivo | [far sentire] | [metrica] |
| Comportamentale | [far fare] | [metrica] |

### 4. La Promessa Principale
**Versione lunga:** "[promessa completa — interna, per il copywriter]"
**Versione breve:** "[claim operativo — per headline]"
**Payoff pubblico:** "[payoff ufficiale]"

### 5. Mandatories

**MUST HAVE — sempre presenti**
- M1: [un dato verificabile in ogni pezzo di comunicazione]
- M2: [il payoff ufficiale in ogni documento pubblico]
- M3: [gerarchia dei valori rispettata]
- M4: [prova materiale per ogni affermazione tecnica]
- M5: [validazione di chi ha competenza per ogni claim tecnico]

**MUST NOT — mai**
- MN1: Aggettivi senza prova: [lista]
- MN2: [cosa non comunicare mai come identità primaria]
- MN3: [formato/stile incompatibile con il posizionamento]
- MN4: Aperture retoriche — sempre dichiarative
- MN5: [linguaggio che segnalizza il profilo sbagliato]

---
INPUT: ${c}`,

buyer_insights: c => `${DR}
Produci la sezione BUYER INSIGHTS in italiano con markdown. Per ogni persona: insight specifico, tensione, messaggio leva, cosa non dire, sequenza funnel.

## Buyer Insights

*L'insight non è la descrizione del buyer — è la tensione irrisolta nella sua testa. È il punto di leva del messaggio.*

---

### [Persona 1 — dal target dell'input]

**Insight:** *"[la tensione in prima persona — cosa pensa quando valuta un fornitore]"*

**Promessa declinata per questa persona:**
*"[come si traduce la brand promise per questa persona specifica]"*

**Reason Why specifica:** [la prova materiale che questa persona cerca — dall'input]

**Messaggio chiave operativo:** *"[frase usabile direttamente in comunicazione]"*

**Cosa NON dire mai a questa persona**
- ❌ "[frase che lo attiva negativamente — con motivazione]"
- ❌ "[altra frase da evitare]"

**Sequenza messaggi**
| Fase | Messaggio | CTA |
|------|-----------|-----|
| Awareness | [capisce il problema] | — |
| Considerazione | [prova materiale] | [CTA tecnica] |
| Conversione | [rimuove barriera specifica] | [CTA diretta] |

[Ripeti per ogni persona identificata nell'input]

---
INPUT: ${c}`,

architettura_canali: c => `${DR}
Produci la sezione ARCHITETTURA CANALI (OEPS) in italiano con markdown.

## Architettura Canali — OEPS

### La Regola del Mix
*Prima si costruisce l'Owned. Poi si investe nel Paid per accelerare. Gli Earned arrivano come conseguenza della qualità dell'Owned. Gli Shared si presidiano con continuità.*

### OWNED — Costruzione e Presidio
| Asset | Obiettivo | Frequenza | Responsabile |
|-------|-----------|-----------|-------------|
[dall'input — per ogni asset owned identificato]

### EARNED — Guadagnato con Qualità
| Canale Earned | Obiettivo | Output atteso | Chi lo genera |
|---------------|-----------|---------------|--------------|
[dall'input — PR, referral, menzioni spontanee]

### PAID — Acquistato per Amplificare
| Campagna | Buyer | Piattaforma | % Budget Ads | CPLQ target |
|----------|-------|-------------|-------------|-------------|
[dall'input — solo canali Ads identificati]

### SHARED — Condiviso con Partner
| Partner/Canale | Tipo | Opportunità | Output |
|----------------|------|-------------|--------|
[dall'input — eventi, associazioni, partnership]

### Piano ADV Dettagliato
*Targeting per campagna prioritaria*

**Campagna [nome — dalla buyer primaria]**
| Parametro | Valore |
|-----------|--------|
| Job title / Interesse | [dall'input] |
| Settore | [dall'input] |
| Paesi | [dall'input] |
| Formato | [dall'input] |
| CPLQ target | [dall'input o ⚠️ DA DEFINIRE] |
| Condizione attivazione | [cosa deve essere pronto prima di attivare] |

### Soglie di Intervento — Kill Switch
| Livello | Condizione | Azione | Tempistica |
|---------|-----------|--------|-----------|
| 🔴 | CPLQ > 2x target per 7 giorni | Pausa + revisione | Entro 7gg |
| 🔴 | CTR < soglia per 14 giorni | A/B test | Entro 14gg |
| 🟡 | Lead < 50% target per 30gg | Revisione audience | Entro 1 mese |

---
INPUT: ${c}`,

piano_editoriale_canale: c => `${DR}
Produci la sezione PIANO EDITORIALE PER CANALE in italiano con markdown.

## Piano Editoriale per Canale

*Per ogni canale attivo: pilastri editoriali, frequenza, struttura dei contenuti, KPI.*

---

### [Canale 1 — identificato dall'input, es. LinkedIn Pagina]
**Ruolo:** [brand authority / lead gen / awareness — dall'input]
**Buyer target:** [dalla segmentazione]
**Frequenza:** [post/settimana — standard per il canale e le risorse disponibili]

| Pilastro | % contenuti | Frequenza | Esempio di contenuto |
|----------|------------|-----------|---------------------|
| [Pilastro A] | [%] | [1/sett] | [esempio concreto — coerente col settore] |
| [Pilastro B] | [%] | [1/sett] | [esempio] |
| [Pilastro C] | [%] | [1/1,5 sett] | [esempio] |

**Struttura del post [canale]:**
[Regole operative specifiche per questo canale — riga 1, spazio bianco, sviluppo, chiusura]

**KPI specifici:**
| KPI | Baseline | Target 6m | Target 12m |
|-----|----------|-----------|-----------|
[metriche chiave per il canale]

---

### [Canale 2 — se identificato nell'input]
[Struttura analoga]

---

### Hashtag Strategy
| Hashtag | Canale | Pilastro | Competizione | Quando |
|---------|--------|---------|--------------|--------|
[dall'input o adattato al settore]

**Hashtag proprietario da costruire:** [suggerisce un hashtag di brand]

### Community Management
| Tipo interazione | Chi gestisce | Tempistica | Escalation |
|-----------------|-------------|-----------|-----------|
[dall'input o standard per il settore]

---
INPUT: ${c}`,

campaign_moments: c => `${DR}
Produci la sezione CAMPAIGN MOMENTS in italiano con markdown.

## Campaign Moments

*I Campaign Moments non sono campagne pubblicitarie — sono momenti comunicativi concentrati con big idea unificante, arco narrativo, durata definita e KPI propri. Distinti dall'always-on.*

---

### CM1 — [Nome — derivato da un momento strategico dell'input]
**Periodo:** [mesi/stagione — dall'input]
**Big Idea:** *"[la frase unificante — coerente con il brand promise]"*
**Trigger:** [perché proprio questo momento — lancio, evento, stagionalità, traguardo]
**Obiettivo:** [specifico e misurabile]

| Canale | Fase pre | Fase lancio | Fase profondità | Coda |
|--------|---------|------------|-----------------|------|
[canali attivi per questa campagna]

**KPI specifici:**
| KPI | Target 30gg | Target 90gg |
|-----|------------|------------|
[KPI propri di questa campagna]

---

### CM2 — [Nome]
**Periodo:** [periodo] · **Big Idea:** *"[frase]"*
[struttura analoga]

---

### CM3 — [Nome] *(solo se giustificato dall'input)*
[struttura analoga]

---

### Regole Operative
1. Always-on non si sospende durante una campagna — si amplifica
2. Ogni campagna ha un brief creativo prodotto 4 settimane prima del lancio
3. Il brief include: big idea, canali attivati, formati, copy guidelines, KPI
4. [regola specifica derivata dall'input]

---
INPUT: ${c}`,

funnel_comunicativo: c => `${DR}
Produci la sezione FUNNEL COMUNICATIVO in italiano con markdown. Per ogni stage definisci messaggi, formati e CTA in modo specifico per questo brand.

## Funnel Comunicativo — Esecuzione per Stage

### TOFU — Attira (Awareness)
**Messaggio chiave:** *"[headline del messaggio — problema/desiderio senza proporre ancora la soluzione]"*
**Tono:** [come deve sentirsi chi legge questo contenuto]

| Formato | Piattaforma | Frequenza | Esempio titolo concreto |
|---------|------------|-----------|------------------------|
| [es. Post educativo] | [es. LinkedIn] | [es. 3x/sett] | [titolo reale basato sull'input] |
| [Reel / Video short] | [Instagram] | [1-2x/sett] | [titolo reale] |

**CTA TOFU:** [azione senza frizione — es. Scopri di più, Leggi l'articolo, Seguici]
**Cosa NON fare:** [es. non proporre ancora la demo, non citare il prezzo]

---

### MOFU — Educa e Qualifica (Consideration)
**Messaggio chiave:** *"[headline che introduce la soluzione — differenziale vs alternative]"*
**Tono:** [esperto che spiega, non che vende]

| Formato | Piattaforma | Frequenza | Esempio titolo concreto |
|---------|------------|-----------|------------------------|
| [es. Carousel approfondimento] | [LinkedIn] | [1x/sett] | [titolo reale] |
| [es. Lead magnet / Download] | [Email + LI] | [1x/2sett] | [titolo reale] |

**CTA MOFU:** [azione con valore — es. Scarica la guida, Iscriviti al webinar, Leggi il case study]
**Trigger di qualifica:** [segnale che indica che il lead è pronto per BOFU — es. 3+ contenuti consumati, download effettuato]

---

### BOFU — Converti (Decision)
**Messaggio chiave:** *"[headline che rimuove l'ultima obiezione e spinge all'azione]"*
**Tono:** [diretto, fiducioso, orientato al risultato]

| Formato | Piattaforma | Frequenza | Esempio titolo concreto |
|---------|------------|-----------|------------------------|
| [es. Testimonial / Case study] | [LI + Email] | [1x/2sett] | [titolo reale] |
| [es. Offerta / Trial / Demo] | [Ads retargeting] | [ongoing] | [titolo reale] |

**CTA BOFU:** [azione ad alta intenzione — es. Richiedi una demo, Contattaci, Scarica il preventivo]
**Sequenza di nurturing BOFU:** [quante email, con quale cadenza, quale contenuto per email]

---

### Matrice Funnel Completa
| Stage | % contenuti | Messaggio | Formato primario | CTA | KPI |
|-------|------------|-----------|-----------------|-----|-----|
| TOFU | [%] | [sintesi] | [formato] | [CTA] | [metrica] |
| MOFU | [%] | [sintesi] | [formato] | [CTA] | [metrica] |
| BOFU | [%] | [sintesi] | [formato] | [CTA] | [metrica] |

### Contenuto di transizione (da uno stage all'altro)
- **TOFU → MOFU:** [il contenuto/momento che qualifica — es. download, webinar, 3+ like]
- **MOFU → BOFU:** [il contenuto/momento che converte — es. richiesta info, trial, preventivo]

---
INPUT: ${c}`,

adv_social: c => `${DR}
Produci la sezione PIANO ADV SOCIAL in italiano con markdown.

## Piano ADV Social

### Logica — Amplificatore, non Motore
*Le campagne a pagamento amplificano quello che il piano organico ha già costruito. Non sostituiscono la presenza organica.*

### Condizioni di Attivazione
| Campagna | Condizione | Data prevista | Budget % |
|----------|-----------|--------------|----------|
[dall'input — cosa deve essere pronto prima di attivare ogni campagna]

### Targeting per Campagna Prioritaria

**Campagna: [nome — buyer primario]**
| Parametro | Targeting |
|-----------|-----------|
| Job title / Interessi | [dall'input] |
| Età / Settore | [dall'input] |
| Paesi | [dall'input] |
| Dimensione azienda | [B2B: dall'input] |
| Formato | [video/carosello/lead gen — motivato] |
| CPLQ target | [dall'input o stima settore] |

**Campagna: [nome — buyer secondario]**
[struttura analoga]

### Stack di Tracking — Configurazione Obbligatoria
| Tool | Funzione | Da configurare entro | Costo |
|------|---------|---------------------|-------|
| Google Analytics 4 | Traffico + conversioni + source | [subito] | Gratuito |
| Meta Pixel + CAPI | Tracciamento Meta Ads + retargeting | [prima lancio] | Gratuito |
| LinkedIn Insight Tag | Tracciamento LinkedIn Ads + demografica | [prima lancio] | Gratuito |
| UTM parameters | Tag tutti i link social | Da subito | Gratuito |

### Budget ADV — Tre Scenari
| Scenario | Budget/mese | LinkedIn | Google | Meta | Note |
|----------|------------|---------|--------|------|------|
| Conservativo | [stima] | [%] | [%] | [%] | Minimo per dati significativi |
| Medio (raccomandato) | [stima] | | | | |
| Aggressivo | [stima] | | | | Post Q4 se risultati |

---
INPUT: ${c}`,

partnership_editoriali: c => `${DR}
Produci la sezione PARTNERSHIP EDITORIALI in italiano con markdown.

## Partnership Editoriali

*Nel B2B non esistono influencer nel senso consumer. Esistono opinion leader tecnici, giornalisti specializzati e associazioni di categoria. La logica non è il pagamento per una menzione — è la costruzione di relazioni professionali che generano valore per entrambe le parti.*

### I Tre Tipi di Partnership

| Tipo | Descrizione | Output | Frequenza |
|------|-------------|--------|-----------|
| Co-authorship tecnica | [nome di settore/esperto] co-firma un contenuto. Distribuito da entrambi i profili. | Articolo/post con doppia firma + reach verso audience esterna | [dall'input o 2-3/anno] |
| Guest contribution | Scambio di contenuti con partner complementari senza costi media | 1 contributo ogni 3 mesi | [dall'input] |
| Citazioni strategiche | Post che cita un opinion leader di settore con tag giustificato | Visibilità qualificata verso il pubblico del taggato | 1-2/settimana |

### Target Partner Prioritari
| Partner | Tipo | Opportunità | Output atteso |
|---------|------|-------------|--------------|
[dall'input — media, associazioni, esperti di settore identificati]

### Piano PR — Media Relations
| Angolo editoriale | Media target | Timing | Hook principale |
|-------------------|-------------|--------|----------------|
[dall'input — angoli costruiti per il giornalista, non comunicati generici]

### Cosa NON è Partnership Editoriale
[Basato sul settore e posizionamento dell'input — es. pagare per citazioni, influencer consumer, campagne hashtag collettivi incompatibili col registro]

---
INPUT: ${c}`,
};

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2,9);

async function callClaude(prompt, maxTokens=1000) {
  let attempts = 0;
  while (true) {
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:maxTokens,
          messages:[{role:"user",content:prompt}] })
      });
      const d = await r.json();
      return d.content?.map(b=>b.text||"").join("") || "";
    } catch(e) { attempts++; if(attempts>=2) throw e; await new Promise(r=>setTimeout(r,1500)); }
  }
}

const SK = "nms-v1";
async function load() { try { const r=await window.storage.get(SK); return r?JSON.parse(r.value):null; } catch{ return null; } }
async function save(d) { try { await window.storage.set(SK,JSON.stringify(d)); } catch{} }

function buildCtx(iv) {
  const lines = [
    `AZIENDA: ${iv.nome||"N/A"}`,
    iv.settore && `SETTORE: ${iv.settore}`,
    iv.anno && `FONDAZIONE: ${iv.anno}`,
    iv.sede && `SEDE: ${iv.sede}`,
    iv.sito && `SITO: ${iv.sito}`,
    iv.descrizione && `COSA FA: ${iv.descrizione}`,
    iv.differenziale && `DIFFERENZIALE: ${iv.differenziale}`,
    iv.valori && `VALORI: ${iv.valori}`,
    iv.target && `TARGET: ${iv.target}`,
    iv.b2x && `MODELLO: ${iv.b2x}`,
    iv.mercati && `MERCATI: ${iv.mercati}`,
    iv.prodotti && `PRODOTTI/SERVIZI: ${iv.prodotti}`,
    iv.pricing && `PRICING: ${iv.pricing}`,
    iv.competitor && `COMPETITOR: ${iv.competitor}`,
    iv.diff_competitor && `DIFFERENZIALE VS COMPETITOR: ${iv.diff_competitor}`,
    iv.canali_attuali && `CANALI ATTUALI: ${iv.canali_attuali}`,
    iv.advertising && `ADVERTISING: ${iv.advertising}`,
    iv.obiettivo1 && `OBIETTIVO PRIMARIO: ${iv.obiettivo1}`,
    iv.obiettivo2 && `OBIETTIVO SECONDARIO: ${iv.obiettivo2}`,
    iv.budget && `BUDGET MARKETING: ${iv.budget}`,
    iv.problema && `PROBLEMA PRINCIPALE: ${iv.problema}`,
    iv.cosa_non_funziona && `COSA NON FUNZIONA: ${iv.cosa_non_funziona}`,
    iv.team && `TEAM MARKETING: ${iv.team}`,
    iv.risorse && `RISORSE DISPONIBILI: ${iv.risorse}`,
    iv.origini && `ORIGINI: ${iv.origini}`,
    iv.svolte && `SVOLTE CHIAVE: ${iv.svolte}`,
    iv.valori_maturati && `VALORI MATURATI: ${iv.valori_maturati}`,
    iv.note && `NOTE AGGIUNTIVE: ${iv.note}`,
  ].filter(Boolean).join("\n");
  return lines;
}

function renderMd(raw) {
  if(!raw) return "";
  const esc = raw.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const lines = esc.split("\n");
  const out = []; let tRows=[], inT=false;
  const flushT = () => {
    if(!tRows.length) return;
    const [h,,,..._] = tRows; const body=tRows.slice(2);
    out.push(`<div class="tbl-wrap"><table><thead><tr>${(h||[]).map(c=>`<th>${c}</th>`).join("")}</tr></thead><tbody>${body.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
    tRows=[]; inT=false;
  };
  for(const l of lines){
    const t=l.trim();
    if(t.startsWith("|")&&t.endsWith("|")){ inT=true; tRows.push(t.slice(1,-1).split("|").map(c=>c.trim())); continue; }
    if(inT) flushT();
    if(!t){out.push("<br/>");continue;}
    if(t.startsWith("### ")){out.push(`<h3>${t.slice(4)}</h3>`);continue;}
    if(t.startsWith("## ")){out.push(`<h2>${t.slice(3)}</h2>`);continue;}
    if(t.startsWith("# ")){out.push(`<h1>${t.slice(2)}</h1>`);continue;}
    if(t==="---"){out.push("<hr/>");continue;}
    let p=t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>")
           .replace(/✅/g,'<span class="ok">✅</span>').replace(/❌/g,'<span class="ko">❌</span>')
           .replace(/⚠️/g,'<span class="warn">⚠️</span>');
    if(t.startsWith("- [ ] ")){out.push(`<li class="check">${p.slice(6)}</li>`);continue;}
    if(t.startsWith("- [x] ")){out.push(`<li class="check done">${p.slice(6)}</li>`);continue;}
    if(t.startsWith("- ")){out.push(`<li>${p.slice(2)}</li>`);continue;}
    const nm=t.match(/^(\d+)\. (.+)/);
    if(nm){out.push(`<oli>${nm[2].replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")}</oli>`);continue;}
    out.push(`<p>${p}</p>`);
  }
  if(inT) flushT();
  return out.join("\n")
    .replace(/(<li>.*?<\/li>\n?)+/gs,m=>`<ul>${m}</ul>`)
    .replace(/(<oli>.*?<\/oli>\n?)+/gs,m=>`<ol>${m.replace(/<\/?oli>/g,s=>s.includes("/")?"</li>":"<li>")}</ol>`);
}

// ─── PROMPTS ED ───────────────────────────────────────────────────────────────
const P_ED = {

ped: (c,prev) => `Sei un esperto di content marketing B2B. Genera un PIANO EDITORIALE MENSILE completo in italiano con markdown.
I titoli dei contenuti devono essere CONCRETI e usabili direttamente — non placeholder. Basa tutto sul contesto del progetto.

## Piano Editoriale — ${new Date().toLocaleString("it-IT",{month:"long",year:"numeric"})}

### Obiettivo del Mese
[Focus prioritario derivato dalla strategia — cosa si vuole ottenere questo mese]

### Distribuzione per Pilastro
| Pilastro | % | N. contenuti | Canale primario |
|---|---|---|---|
[dai pilastri definiti nella strategia del progetto]

### Calendario Contenuti
| # | Settimana | Formato | Pilastro | Titolo / Idea contenuto | Canale | Funnel |
|---|---|---|---|---|---|---|
| 1 | Sett. 1 | Post | [pilastro] | [titolo concreto — non placeholder] | LinkedIn | TOFU |
[genera 16-20 contenuti concreti distribuiti su 4 settimane — titoli specifici e usabili]

### Content Mix del Mese
- Post LinkedIn pagina: [n] · Post profilo CEO: [n] · Post Instagram: [n] · Reel: [n]

### Top 3 Contenuti Prioritari — Copy Guida
*Per questi 3 il copywriter parte da qui:*

**1. [Titolo]**
- Apertura (max 10 parole): [prima riga — dichiarativa, con dato]
- Sviluppo: [direzione del contenuto]
- CTA: [call to action tecnica]

**2. [Titolo]**
[struttura analoga]

**3. [Titolo]**
[struttura analoga]

${prev?`### Note dal Mese Precedente\n${prev.slice(0,300)}`:""}
---
CONTESTO PROGETTO:
${c}`,

monthly_review: c => `Produci un REPORT DI REVISIONE MENSILE strategico in italiano con markdown.

## Monthly Review

### Performance vs Obiettivi
| KPI | Target mensile | Consuntivo | Delta | Trend |
|---|---|---|---|---|
[dai KPI definiti nel piano — per valori non inseriti usa ⚠️ Da rilevare]

### Top 3 Contenuti del Mese
[I contenuti che hanno performato meglio — con motivazione strategica, non solo il numero]

### Bottom 3 — Cosa Non Ha Funzionato
[Con ipotesi di causa — non generica]

### L'Insight del Mese
[La cosa più importante imparata — quella che cambia qualcosa nel piano del mese prossimo]

### Aggiustamenti Operativi
1. [aggiustamento concreto con effetto atteso]
2. [aggiustamento]
3. [aggiustamento]

### Il Sanity Check
*I contenuti pubblicati questo mese avrebbero convinto il buyer primario a fare il passo successivo?*
[Sì/No con motivazione — senza pietà]

---
CONTESTO: ${c}`,

strategy_update: c => `Sei un consulente di marketing strategico. Analizza le performance e produci un piano di AGGIORNAMENTO STRATEGIA in italiano con markdown.

## Aggiornamento Strategia — ${new Date().toLocaleString("it-IT",{month:"long",year:"numeric"})}

### Diagnosi: Cosa i dati ci stanno dicendo
[3-4 insight strategici derivati dalle performance — non vanity metrics, ma implicazioni di business]

### Cosa aggiornare nel Piano di Marketing
| Sezione | Azione | Priorità |
|---|---|---|
| [es. Obiettivi SMART] | [aggiornamento specifico con nuovo dato] | 🔴/🟡/🟢 |
[elenca solo le sezioni che richiedono aggiornamento reale, non tutto]

### Cosa aggiornare nel Piano di Comunicazione
| Sezione | Azione | Priorità |
|---|---|---|
| [es. Campaign Moments] | [aggiornamento specifico] | 🔴/🟡/🟢 |

### Cosa aggiornare nell'Editoriale
- **Pilastri**: [se la distribuzione % va ribilanciata, perché]
- **Formati**: [se un formato performa meglio, vai verso quello]
- **Canali**: [se un canale sovra/sotto performa, cosa fare]
- **ToV**: [se il tono non sta funzionando con il target, aggiusta]

### Decisioni da prendere prima del prossimo ciclo
1. [decisione concreta — non generica]
2. [decisione concreta]
3. [decisione concreta]

### Non cambiare
[Cosa sta funzionando e NON va toccato — importante quanto quello da cambiare]

---
CONTESTO PROGETTO: ${c}`,

cicli: c => `Sei un consulente di marketing che chiude il ciclo trimestrale. Produci la CHIUSURA DI CICLO e il brief per il prossimo ciclo in italiano con markdown.

## Ciclo & Pivot — Q${Math.ceil((new Date().getMonth()+1)/3)} ${new Date().getFullYear()}

### Il Ciclo che chiudiamo
**Durata**: [data inizio → data fine]
**Obiettivo dichiarato**: [cosa volevamo ottenere]
**Obiettivo raggiunto**: [percentuale e valutazione onesta]
**Verdetto**: ✅ Ciclo completato / ⚠️ Ciclo parziale / 🔄 Pivot necessario

### I 3 Risultati più importanti
1. [risultato concreto con numero]
2. [risultato concreto]
3. [risultato concreto]

### La Lezione del Ciclo
> [Una frase sola. La cosa più importante imparata. Quella che cambia come lavoriamo.]

### Pivot o Continuità?
**Scenario A — Continuità** (se il ciclo ha funzionato):
[Cosa manteniamo identico, cosa amplifichiamo]

**Scenario B — Pivot parziale** (se qualcosa non ha funzionato):
[Cosa cambiamo, perché, cosa testiamo nel prossimo ciclo]

**Scenario C — Pivot strategico** (se i dati dicono altro):
[Riorientamento del focus, nuova ipotesi da testare]

### Brief Prossimo Ciclo — Q${Math.ceil((new Date().getMonth()+1)/3)%4+1}
- **Focus prioritario**: [una cosa sola — massimo focus]
- **KPI primario da battere**: [numero specifico]
- **Esperimento da fare**: [una cosa nuova da testare]
- **Cosa smettere di fare**: [una cosa sola che spreca risorse]
- **Prima azione entro 7 giorni**: [concreta, assegnata a qualcuno]

---
CONTESTO PROGETTO: ${c}`,
};

// ─── ED COMPONENTS ────────────────────────────────────────────────────────────
const CT_STATUSES  = ["idea","produzione","revisione","approvato","live"];
const CT_LABELS    = { idea:"💡 Idea", produzione:"✍️ Produzione", revisione:"👁️ Revisione", approvato:"✅ Approvato", live:"🚀 Live" };
const CT_COLORS_BG = { idea:"#F1F5F9", produzione:"#FEF3C7", revisione:"#EDE9FE", approvato:"#ECFDF5", live:"#F0FDF4" };
const CT_COLORS_TX = { idea:"#64748B", produzione:"#D97706", revisione:"#7C3AED", approvato:"#059669", live:"#16A34A" };
const CANALI_LIST  = ["LinkedIn","Instagram","Email","Blog","TikTok","YouTube","Facebook","Altro"];
const FUNNEL_LIST  = ["TOFU","MOFU","BOFU"];

function CampagneExecED({project, onUpdate}){
  const campagne = project.ed?.campagne || [];
  const pdcCM    = project.pdc?.sections?.campaign_moments?.content||"";
  const [adding, setAdding] = useState(false);
  const [form,  setForm]    = useState({nome:"",bigIdea:"",periodo:"",stato:"planning",kpiRealizzati:"",note:""});

  function upEd(fn){ onUpdate({...project, ed:{...(project.ed||{}), ...fn(project.ed||{})}}); }
  function addCamp(){
    if(!form.nome) return;
    upEd(ed=>({...ed, campagne:[...(ed.campagne||[]),{...form,id:uid()}]}));
    setAdding(false); setForm({nome:"",bigIdea:"",periodo:"",stato:"planning",kpiRealizzati:"",note:""});
  }
  function upStato(id,stato){ upEd(ed=>({...ed, campagne:(ed.campagne||[]).map(c=>c.id===id?{...c,stato}:c)})); }
  function del(id){ upEd(ed=>({...ed, campagne:(ed.campagne||[]).filter(c=>c.id!==id)})); }

  const STATI = {planning:{label:"In pianificazione",c:"#94A3B8"}, live:{label:"Live",c:"#10B981"}, concluded:{label:"Conclusa",c:"#6366F1"}, archived:{label:"Archiviata",c:"#CBD5E1"}};

  return(
    <div className="camp-exec-wrap">
      {pdcCM&&<div className="camp-ref-box"><div className="camp-ref-label">📣 Campaign Moments da Piano Comunicazione</div><div className="camp-ref-preview">{pdcCM.slice(0,280)}…</div></div>}
      <div className="camp-exec-hdr">
        <div className="camp-exec-title">Esecuzione Campagne</div>
        <button className="btn-outline sm" onClick={()=>setAdding(true)}>+ Campagna</button>
      </div>
      {adding&&(
        <div className="ct-form">
          <div className="fg-row">
            <div className="fg"><label className="lbl">Nome campagna *</label><input className="inp" placeholder="es. CM1 — Library Advanced" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})}/></div>
            <div className="fg"><label className="lbl">Periodo</label><input className="inp" placeholder="es. Set → Ott 2025" value={form.periodo} onChange={e=>setForm({...form,periodo:e.target.value})}/></div>
          </div>
          <div className="fg"><label className="lbl">Big Idea</label><input className="inp" placeholder='"La libreria è pubblica. Adesso puoi verificarla."' value={form.bigIdea} onChange={e=>setForm({...form,bigIdea:e.target.value})}/></div>
          <div className="fg"><label className="lbl">KPI realizzati</label><textarea className="txta" rows={2} placeholder="Download: 42/50 · Lead qualificati: 8/10 · Menzioni PR: 1/2" value={form.kpiRealizzati} onChange={e=>setForm({...form,kpiRealizzati:e.target.value})}/></div>
          <div className="form-actions"><button className="btn-ghost sm" onClick={()=>setAdding(false)}>Annulla</button><button className="btn-primary sm" onClick={addCamp} disabled={!form.nome}>Aggiungi</button></div>
        </div>
      )}
      {campagne.length===0&&!adding&&<div className="ct-empty">Nessuna campagna tracciata. Aggiungi le campagne dal Piano di Comunicazione.</div>}
      <div className="ct-list">
        {campagne.map(c=>(
          <div key={c.id} className="ct-row">
            <div className="ct-row-main">
              <span className="ct-status-badge" style={{background:STATI[c.stato]?.c+"22",color:STATI[c.stato]?.c}}>{STATI[c.stato]?.label||c.stato}</span>
              <div className="ct-info">
                <div className="ct-title">{c.nome}</div>
                {c.bigIdea&&<div className="ct-meta">"{c.bigIdea}" · {c.periodo}</div>}
                {c.kpiRealizzati&&<div className="ct-kpi-row">{c.kpiRealizzati}</div>}
              </div>
              <div className="ct-actions">
                <select className="inp" style={{width:140,fontSize:11}} value={c.stato} onChange={e=>upStato(c.id,e.target.value)}>
                  {Object.entries(STATI).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                </select>
                <button className="ct-del" onClick={()=>del(c.id)}>×</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PerfLogED({project, onUpdate}){
  const logs = project.ed?.perfLogs || [];
  const [adding, setAdding] = useState(false);
  const [form, setForm]     = useState({mese:"",follower_li:"",er_li:"",download:"",lead:"",follower_ig:"",er_ig:"",cplq:"",note:""});

  function upEd(fn){ onUpdate({...project, ed:{...(project.ed||{}), ...fn(project.ed||{})}}); }
  function addLog(){
    if(!form.mese) return;
    upEd(ed=>({...ed, perfLogs:[...(ed.perfLogs||[]),{...form,id:uid()}]}));
    setAdding(false); setForm({mese:"",follower_li:"",er_li:"",download:"",lead:"",follower_ig:"",er_ig:"",cplq:"",note:""});
  }
  function del(id){ upEd(ed=>({...ed, perfLogs:(ed.perfLogs||[]).filter(l=>l.id!==id)})); }

  const FIELDS=[
    {k:"follower_li",label:"Follower LinkedIn"},{k:"er_li",label:"ER% LinkedIn"},{k:"download",label:"Download Library"},
    {k:"lead",label:"Lead qualificati"},{k:"follower_ig",label:"Follower Instagram"},{k:"er_ig",label:"ER% Instagram"},{k:"cplq",label:"CPLQ Ads (€)"},
  ];

  return(
    <div className="ct-wrap">
      <div className="ct-hdr">
        <div className="ct-title-sm">Storico performance mensile</div>
        <button className="btn-primary sm" onClick={()=>setAdding(true)}>+ Mese</button>
      </div>
      {adding&&(
        <div className="ct-form">
          <div className="fg"><label className="lbl">Mese *</label><input className="inp" type="month" value={form.mese} onChange={e=>setForm({...form,mese:e.target.value})}/></div>
          <div className="fg-row3">
            {FIELDS.map(f=>(
              <div key={f.k} className="fg"><label className="lbl">{f.label}</label><input className="inp" placeholder="—" value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}/></div>
            ))}
          </div>
          <div className="fg"><label className="lbl">Note</label><textarea className="txta" rows={2} placeholder="Insight del mese, anomalie, contesto" value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/></div>
          <div className="form-actions"><button className="btn-ghost sm" onClick={()=>setAdding(false)}>Annulla</button><button className="btn-primary sm" onClick={addLog} disabled={!form.mese}>Salva</button></div>
        </div>
      )}
      {logs.length===0&&!adding&&<div className="ct-empty">Nessun dato inserito. Aggiungi il primo mese di performance.</div>}
      <div className="perf-table-wrap">
        {logs.length>0&&(
          <table className="perf-table">
            <thead><tr><th>Mese</th>{FIELDS.map(f=><th key={f.k}>{f.label}</th>)}<th></th></tr></thead>
            <tbody>{logs.slice().reverse().map((l,i)=>{
              const prev = logs.slice().reverse()[i+1];
              return(
                <tr key={l.id}>
                  <td style={{fontWeight:600}}>{l.mese}</td>
                  {FIELDS.map(f=>{
                    const curr=parseFloat(l[f.k]);
                    const prv =parseFloat(prev?.[f.k]);
                    const delta=!isNaN(curr)&&!isNaN(prv)?curr-prv:null;
                    return(
                      <td key={f.k}>
                        {l[f.k]||"—"}
                        {delta!==null&&<span style={{fontSize:10,marginLeft:4,color:delta>=0?"#10B981":"#EF4444"}}>{delta>=0?"+":""}{delta.toFixed(1)}</span>}
                      </td>
                    );
                  })}
                  <td><button className="ct-del" onClick={()=>del(l.id)}>×</button></td>
                </tr>
              );
            })}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function CalendarSimpleED({project}){
  const items  = project.ed?.contentItems || [];
  const [month,setMonth] = useState(new Date().getMonth());
  const [year, setYear]  = useState(new Date().getFullYear());
  const MONTHS_IT = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  const DAYS_IT   = ["L","M","M","G","V","S","D"];

  const firstDay = new Date(year,month,1).getDay();
  const offset   = (firstDay+6)%7;
  const daysInMonth = new Date(year,month+1,0).getDate();

  function itemsForDay(d){
    const ds = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return items.filter(i=>i.dueDate===ds);
  }

  const CANALE_COLOR={LinkedIn:"#0077B5",Instagram:"#E1306C",Email:"#10B981",Blog:"#F59E0B",Facebook:"#1877F2",Altro:"#64748B"};

  return(
    <div className="cal-simple-wrap">
      <div className="cal-nav">
        <button className="btn-ghost sm" onClick={()=>{ if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); }}>←</button>
        <div className="cal-month-label">{MONTHS_IT[month]} {year}</div>
        <button className="btn-ghost sm" onClick={()=>{ if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); }}>→</button>
      </div>
      <div className="cal-grid-hdr">{DAYS_IT.map((d,i)=><div key={i} className="cal-day-hdr">{d}</div>)}</div>
      <div className="cal-grid">
        {Array(offset).fill(null).map((_,i)=><div key={"e"+i} className="cal-cell empty"/>)}
        {Array(daysInMonth).fill(null).map((_,i)=>{
          const d=i+1;
          const di=itemsForDay(d);
          const isToday=d===new Date().getDate()&&month===new Date().getMonth()&&year===new Date().getFullYear();
          return(
            <div key={d} className={`cal-cell ${isToday?"today":""}`}>
              <div className={`cal-num ${isToday?"cal-num-today":""}`}>{d}</div>
              {di.map(item=>(
                <div key={item.id} className="cal-chip" style={{background:(CANALE_COLOR[item.canale]||"#64748B")+"22",color:CANALE_COLOR[item.canale]||"#64748B"}}>
                  {item.format} {item.title.slice(0,20)}{item.title.length>20?"…":""}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div className="cal-legend">
        {Object.entries(CANALE_COLOR).map(([k,v])=><span key={k} className="cal-leg-item" style={{color:v}}>● {k}</span>)}
      </div>
    </div>
  );
}

// ─── FUNNEL VIEW ─────────────────────────────────────────────────────────────
const FUNNEL_STAGES = [
  { id:"TOFU", label:"Top of Funnel", sub:"Awareness — attira nuovi contatti", color:"#0EA5E9", bg:"#EFF8FF", icon:"▲" },
  { id:"MOFU", label:"Middle of Funnel", sub:"Consideration — educa e qualifica", color:"#8B5CF6", bg:"#F5F3FF", icon:"◆" },
  { id:"BOFU", label:"Bottom of Funnel", sub:"Conversion — porta alla decisione", color:"#10B981", bg:"#ECFDF5", icon:"▼" },
];

function FunnelViewED({ project, onUpdate }) {
  const feedItems    = project.ed?.feedItems    || [];
  const kanbanItems  = project.ed?.contentItems || [];
  const allItems     = [...feedItems, ...kanbanItems.filter(k=>!feedItems.some(f=>f.id===k.id))];
  const tot = allItems.length;

  // Funnel target percentages (editable, stored in project.ed.funnelTargets)
  const funnelTargets = project.ed?.funnelTargets || { TOFU:40, MOFU:40, BOFU:20 };
  function setTarget(stage,v){
    const n=Math.max(0,Math.min(100,parseInt(v)||0));
    if(onUpdate) onUpdate({...project,ed:{...(project.ed||{}),funnelTargets:{...funnelTargets,[stage]:n}}});
  }

  const byStage = { TOFU:[], MOFU:[], BOFU:[], "":[] };
  allItems.forEach(item=>{
    const f=(item.funnel||"").toUpperCase();
    if(byStage[f]) byStage[f].push(item);
    else byStage[""].push(item);
  });

  const untagged = byStage[""].length;

  // Reference content from PdM and PdC
  const funnelStrategyContent = project.pdm?.sections?.funnel_strategy?.content||"";
  const funnelComContent      = project.pdc?.sections?.funnel_comunicativo?.content||"";

  // Gap analysis
  const gaps=[];
  if(tot===0){ gaps.push({level:"warn",msg:"Nessun contenuto ancora inserito nel Feed o nel Kanban Board."}); }
  else {
    const tofu=byStage.TOFU.length,mofu=byStage.MOFU.length,bofu=byStage.BOFU.length;
    if(tofu===0)   gaps.push({level:"err",msg:"Nessun contenuto TOFU. Non stai attirando nuovi contatti."});
    if(mofu===0)   gaps.push({level:"err",msg:"Nessun contenuto MOFU. Manca la fase di educazione/qualifica."});
    if(bofu===0)   gaps.push({level:"warn",msg:"Nessun contenuto BOFU. Chi è già convinto non ha CTA chiare."});
    if(untagged>0) gaps.push({level:"info",msg:`${untagged} contenut${untagged===1?"o":"i"} senza tag funnel — assegna TOFU/MOFU/BOFU.`});
    if(gaps.length===0) gaps.push({level:"ok",msg:"Distribuzione funnel senza gap critici ✓"});
  }
  const GAP_STYLE={err:{bg:"#FFF0F3",tx:"#E11D48",icon:"❌"},warn:{bg:"#FFFBEB",tx:"#D97706",icon:"⚠️"},info:{bg:"#EFF8FF",tx:"#0284C7",icon:"ℹ️"},ok:{bg:"#ECFDF5",tx:"#059669",icon:"✅"}};

  // Delta helper
  function delta(stage){
    const real=tot?Math.round(byStage[stage].length/tot*100):0;
    const tgt=funnelTargets[stage]||0;
    const d=real-tgt;
    return {real,tgt,d};
  }
  function statusIcon(d){ return Math.abs(d)<=5?"✅ In target":d>0?"⚠️ Sopra target":"⚠️ Sotto target"; }
  function statusColor(d){ return Math.abs(d)<=5?"var(--ok)":d>0?"var(--warn)":"var(--err)"; }

  const totalPct=Object.values(funnelTargets).reduce((s,v)=>s+v,0);

  return(
    <div className="funnel-wrap">

      {/* CONFRONTO TARGET VS REALE */}
      <div className="funnel-compare-section">
        <div className="funnel-compare-hdr">
          <div style={{fontWeight:700,fontSize:13,color:"var(--ink)"}}>Confronto Strategia vs Distribuzione Reale</div>
          <div style={{fontSize:10,color:"var(--ink4)"}}>{tot} contenuti totali (Feed + Kanban){totalPct!==100?` · ⚠️ Totale target: ${totalPct}% (deve fare 100%)`:""}</div>
        </div>
        <table className="funnel-cmp-table">
          <thead>
            <tr>
              <th>Stage</th>
              <th>Target %<br/><span style={{fontWeight:400,fontSize:9,color:"var(--ink4)"}}>da Funnel Strategy PdM</span></th>
              <th>Reale %<br/><span style={{fontWeight:400,fontSize:9,color:"var(--ink4)"}}>contenuti attuali</span></th>
              <th>Delta</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {FUNNEL_STAGES.map(stage=>{
              const {real,tgt,d}=delta(stage.id);
              return(
                <tr key={stage.id}>
                  <td style={{fontWeight:700,color:stage.color}}>
                    <span style={{marginRight:6}}>{stage.icon}</span>{stage.id}
                    <div style={{fontSize:9,color:"var(--ink4)",fontWeight:400}}>{stage.label}</div>
                  </td>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <input type="number" min={0} max={100} value={funnelTargets[stage.id]||0}
                        onChange={e=>setTarget(stage.id,e.target.value)}
                        className="funnel-target-inp"/>
                      <span style={{fontSize:11,color:"var(--ink4)"}}>%</span>
                    </div>
                    {!funnelStrategyContent&&<div style={{fontSize:9,color:"var(--ink5)"}}>Genera Funnel Strategy in PdM</div>}
                  </td>
                  <td style={{fontWeight:700,fontSize:14,color:stage.color}}>
                    {real}%
                    <div style={{fontSize:10,color:"var(--ink4)",fontWeight:400}}>{byStage[stage.id].length} post</div>
                  </td>
                  <td style={{fontWeight:700,color:statusColor(d)}}>
                    {d>0?"+":""}{d}pp
                  </td>
                  <td style={{fontSize:11,color:statusColor(d)}}>{tot>0?statusIcon(d):"—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!funnelStrategyContent&&!funnelComContent&&(
          <div style={{fontSize:11,color:"var(--ink4)",fontStyle:"italic",marginTop:8,padding:"8px 12px",background:"var(--bg)",borderRadius:6}}>
            💡 I target % sono modificabili manualmente. Genera <strong>Funnel Strategy</strong> (PdM → Strategia) e <strong>Funnel Comunicativo</strong> (PdC → Operativo) per avere il riferimento strategico completo.
          </div>
        )}
      </div>

      {/* REFERENCE CARDS — PdM + PdC */}
      {(funnelStrategyContent||funnelComContent)&&(
        <div className="funnel-refs">
          {funnelStrategyContent&&(
            <div className="funnel-ref-card">
              <div className="funnel-ref-label">📊 Funnel Strategy — da Piano di Marketing</div>
              <div className="funnel-ref-preview" dangerouslySetInnerHTML={{__html:renderMd(funnelStrategyContent.slice(0,600)+(funnelStrategyContent.length>600?"…":""))}}/>
            </div>
          )}
          {funnelComContent&&(
            <div className="funnel-ref-card">
              <div className="funnel-ref-label">📣 Funnel Comunicativo — da Piano di Comunicazione</div>
              <div className="funnel-ref-preview" dangerouslySetInnerHTML={{__html:renderMd(funnelComContent.slice(0,600)+(funnelComContent.length>600?"…":""))}}/>
            </div>
          )}
        </div>
      )}

      {/* DISTRIBUZIONE VISIVA */}
      <div className="funnel-cols">
        {FUNNEL_STAGES.map(stage=>{
          const items=byStage[stage.id]||[];
          const pct=tot?Math.round(items.length/tot*100):0;
          return(
            <div key={stage.id} className="funnel-col" style={{borderTop:`3px solid ${stage.color}`}}>
              <div className="funnel-col-hdr" style={{background:stage.bg}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:18}}>{stage.icon}</span>
                  <div><div style={{fontSize:12,fontWeight:800,color:stage.color}}>{stage.id}</div><div style={{fontSize:10,color:"var(--ink4)"}}>{stage.sub}</div></div>
                </div>
                <div className="funnel-col-cnt" style={{color:stage.color,background:"#fff"}}>{items.length}</div>
              </div>
              <div className="funnel-col-body">
                {items.length===0&&<div className="funnel-empty">Nessun contenuto</div>}
                {items.slice(0,5).map(item=>(
                  <div key={item.id} className="funnel-item-row">
                    <span style={{fontSize:11}}>{FEED_TIPI_ICON[item.tipo||item.format?.toLowerCase()]||"📄"}</span>
                    <span className="funnel-item-title">{item.titolo||item.title||"—"}</span>
                    <span style={{fontSize:9,color:"var(--ink5)",flexShrink:0}}>{item.canale||(Array.isArray(item.piattaforme)?item.piattaforme[0]:"")||""}</span>
                  </div>
                ))}
                {items.length>5&&<div style={{fontSize:10,color:"var(--ink4)",padding:"4px 0"}}>+{items.length-5} altri</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* GAP ANALYSIS */}
      <div style={{marginTop:16}}>
        <div style={{fontSize:11,fontWeight:700,color:"var(--ink)",marginBottom:8}}>Analisi gap</div>
        {gaps.map((g,i)=>{ const st=GAP_STYLE[g.level]; return(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"8px 12px",background:st.bg,borderRadius:6,marginBottom:6,fontSize:11,color:st.tx}}><span style={{flexShrink:0}}>{st.icon}</span><span>{g.msg}</span></div>); })}
      </div>

      {untagged>0&&<div style={{marginTop:12}}><div style={{fontSize:11,color:"var(--ink4)",marginBottom:6}}>Contenuti senza tag funnel ({untagged})</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{byStage[""].map(item=><span key={item.id} style={{fontSize:10,padding:"2px 8px",background:"var(--bg2)",borderRadius:99,color:"var(--ink3)"}}>{item.titolo||item.title||item.id}</span>)}</div></div>}
    </div>
  );
}

// ─── EDITORIALE SECTION CONTENT ───────────────────────────────────────────────
const ED_SPECIAL = ["calendario","content_tracker","publishing","perf_log","campagne_exec","funnel"];

function EdSectionContent({project, secId, onUpdate, globalMeta}){
  const curSec   = SECTIONS_ED.find(s=>s.id===secId);
  const secData  = project.ed?.sections?.[secId];
  const content  = secData?.content||"";
  const versions = secData?.versions||[];
  const gc       = COLORS_ED[curSec?.group]||"#10B981";

  const [generating,setGenerating]=useState(false);
  const [editing,   setEditing]   =useState(false);
  const [editText,  setEditText]  =useState("");
  const [showVer,   setShowVer]   =useState(false);
  const [toast,     setToast]     =useState("");
  const [showExport,setShowExport]=useState(false);

  function showToast(m){ setToast(m); setTimeout(()=>setToast(""),2200); }

  function upEdSection(text){
    const prev = project.ed||{sections:{}};
    const existing = prev.sections?.[secId]||{};
    const newVersions = text&&existing.content ? [...(existing.versions||[]),{text:existing.content,ts:Date.now()}].slice(-5) : (existing.versions||[]);
    onUpdate({...project, ed:{...prev, sections:{...prev.sections,[secId]:{content:text,versions:newVersions}}}});
  }

  async function generate(){
    if(!P_ED[secId]) return;
    setGenerating(true);
    try {
      const ctx  = buildCtx(project.interview||{});
      const pdmCtx = Object.entries(project.pdm?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,200)||""}`).join("\n");
      const pdcCtx = Object.entries(project.pdc?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,200)||""}`).join("\n");
      const fullCtx = ctx + "\n\n## Strategia Marketing:\n" + pdmCtx + "\n\n## Comunicazione:\n" + pdcCtx;
      const prevLog = (project.ed?.perfLogs||[]).slice(-1)[0];
      const text = await callClaude(P_ED[secId](fullCtx, prevLog?.note));
      upEdSection(text);
      showToast("Generato ✓");
    } catch { showToast("Errore — riprova"); }
    setGenerating(false);
  }

  // Special components
  if(secId==="funnel") return(
    <div className="sec-body">
      <div className="sec-body-hdr"><div className="sec-body-title" style={{borderLeft:`3px solid ${gc}`,paddingLeft:12}}>Funnel TOFU / MOFU / BOFU</div></div>
      <div className="sec-content"><FunnelViewED project={project} onUpdate={onUpdate}/></div>
    </div>
  );
  if(secId==="feed") return(
    <div className="sec-body">
      <div className="sec-body-hdr"><div className="sec-body-title" style={{borderLeft:`3px solid ${gc}`,paddingLeft:12}}>Feed</div></div>
      <div className="sec-content" style={{padding:0,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <FeedED project={project} onUpdate={onUpdate} globalMeta={globalMeta}/>
      </div>
    </div>
  );
  if(secId==="content_tracker") return(
    <div className="sec-body">
      {toast&&<Toast msg={toast}/>}
      <div className="sec-body-hdr"><div className="sec-body-title" style={{borderLeft:`3px solid ${gc}`,paddingLeft:12}}>{curSec?.label}</div></div>
      <div className="sec-content"><KanbanBoardED project={project} onUpdate={onUpdate}/></div>
    </div>
  );
  if(secId==="publishing") return(
    <div className="sec-body">
      <div className="sec-body-hdr"><div className="sec-body-title" style={{borderLeft:`3px solid ${gc}`,paddingLeft:12}}>{curSec?.label}</div></div>
      <div className="sec-content"><PublishingHubED project={project} onUpdate={onUpdate} globalMeta={globalMeta}/></div>
    </div>
  );
  if(secId==="perf_log") return(
    <div className="sec-body">
      <div className="sec-body-hdr"><div className="sec-body-title" style={{borderLeft:`3px solid ${gc}`,paddingLeft:12}}>{curSec?.label}</div></div>
      <div className="sec-content"><PerfLogED project={project} onUpdate={onUpdate}/></div>
    </div>
  );
  if(secId==="calendario") return(
    <div className="sec-body">
      <div className="sec-body-hdr"><div className="sec-body-title" style={{borderLeft:`3px solid ${gc}`,paddingLeft:12}}>{curSec?.label}</div></div>
      <div className="sec-content"><CalendarSimpleED project={project}/></div>
    </div>
  );
  if(secId==="campagne_exec") return(
    <div className="sec-body">
      <div className="sec-body-hdr"><div className="sec-body-title" style={{borderLeft:`3px solid ${gc}`,paddingLeft:12}}>{curSec?.label}</div></div>
      <div className="sec-content"><CampagneExecED project={project} onUpdate={onUpdate}/></div>
    </div>
  );

  // AI sections (ped, monthly_review)
  return(
    <div className="sec-body">
      {toast&&<Toast msg={toast}/>}
      <div className="sec-body-hdr">
        <div className="sec-body-title" style={{borderLeft:`3px solid ${gc}`,paddingLeft:12}}>{curSec?.label}</div>
        <div className="sec-acts">
          {content&&!editing&&<button className="btn-outline sm" onClick={()=>{setEditText(content);setEditing(true);}}>Modifica</button>}
          {content&&versions.length>0&&<button className="btn-ghost sm" onClick={()=>setShowVer(v=>!v)}>{showVer?"Chiudi":"Versioni"}</button>}
          {editing&&<><button className="btn-primary sm" onClick={()=>{upEdSection(editText);setEditing(false);showToast("Salvato ✓");}}>Salva</button><button className="btn-ghost sm" onClick={()=>setEditing(false)}>Annulla</button></>}
          {P_ED[secId]&&<button className="btn-primary sm" onClick={generate} disabled={generating}>{generating?"...":"Genera"}</button>}
          {content&&<div className="exp-wrap"><button className="btn-ghost sm" onClick={()=>setShowExport(e=>!e)}>↓ Esporta</button>{showExport&&<ExportPanel label={curSec?.label||secId} content={content} projectName={project.name||"Progetto"} secId={secId} onClose={()=>setShowExport(false)}/>}</div>}
        </div>
      </div>
      <div className="sec-content">
        {showVer&&versions.map((v,i)=>(
          <div key={i} className="vitem" style={{marginBottom:8}}>
            <div className="vdate">{new Date(v.ts).toLocaleDateString("it-IT")}</div>
            <div className="vpreview">{v.text.slice(0,100)}…</div>
            <button className="btn-ghost sm" onClick={()=>{upEdSection(v.text);setShowVer(false);showToast("Ripristinato ✓");}}>Ripristina</button>
          </div>
        ))}
        {editing
          ? <textarea className="edit-txta" value={editText} onChange={e=>setEditText(e.target.value)}/>
          : content
            ? <div className="md-out" dangerouslySetInnerHTML={{__html:renderMd(content)}}/>
            : !generating&&(
                <div className="sec-empty">
                  <div className="se-glyph" style={{color:gc}}>{curSec?.icon}</div>
                  <div className="se-msg">Sezione non ancora generata</div>
                  {P_ED[secId]&&<button className="btn-primary" onClick={generate}>Genera →</button>}
                </div>
              )
        }
        {generating&&<div className="gen-row"><div className="spin"/>Generazione…</div>}
      </div>
    </div>
  );
}
// ─── PROJECT OVERVIEW ─────────────────────────────────────────────────────────
const MS_ST = {
  done:    { dot:"#10B981", bg:"#ECFDF5", tx:"#059669", label:"✓ Fatto" },
  active:  { dot:"#0EA5E9", bg:"#EFF8FF", tx:"#0284C7", label:"In corso" },
  pending: { dot:"#CBD5E1", bg:"#F1F5F9", tx:"#64748B", label:"Pending" },
};
const TASK_TAGS     = ["Strategia","Social","Contenuti","Tecnico","Altro"];
const TASK_PRIORS   = { high:{label:"Alta",color:"#EF4444"}, med:{label:"Media",color:"#F59E0B"}, low:{label:"Bassa",color:"#94A3B8"} };

function computeProjectMeta(project){
  const pdmF=SECTIONS_PDM.filter(s=>project.pdm?.sections?.[s.id]?.content).length;
  const pdcF=SECTIONS_PDC.filter(s=>project.pdc?.sections?.[s.id]?.content).length;
  const edF =SECTIONS_ED.filter(s=>!ED_SPECIAL.includes(s.id)&&project.ed?.sections?.[s.id]?.content).length;
  const totAI=SECTIONS_PDM.length+SECTIONS_PDC.length+SECTIONS_ED.filter(s=>!ED_SPECIAL.includes(s.id)).length;
  const pct=Math.round(((pdmF+pdcF+edF)/totAI)*100);
  const tasks=project.tasks||[];
  const open=tasks.filter(t=>!t.done).length;
  const urgent=tasks.filter(t=>!t.done&&t.priority==="high").length;
  const feeds=(project.ed?.feedItems||[]).filter(f=>f.data&&f.stato!=="live").sort((a,b)=>a.data.localeCompare(b.data));
  const nextPost=feeds[0];
  return {pct,pdmF,pdcF,edF,totAI,open,urgent,nextPost};
}

function getAutoMilestones(project){
  const iv=project.interview||{};
  const hasIV=Object.values(iv).some(v=>v?.trim?.().length>2);
  const pdmF=SECTIONS_PDM.filter(s=>project.pdm?.sections?.[s.id]?.content).length;
  const pdcF=SECTIONS_PDC.filter(s=>project.pdc?.sections?.[s.id]?.content).length;
  const pdmPct=pdmF/SECTIONS_PDM.length; const pdcPct=pdcF/SECTIONS_PDC.length;
  const hasPED=!!project.ed?.sections?.ped?.content;
  const feedN=(project.ed?.feedItems||[]).length;
  return [
    {id:"a-brief", name:"Brief e analisi",          status:hasIV?"done":"pending",                    auto:true},
    {id:"a-pdm",   name:"Piano di Marketing",        status:pdmPct>0.5?"done":pdmPct>0?"active":"pending", auto:true},
    {id:"a-pdc",   name:"Piano di Comunicazione",    status:pdcPct>0.5?"done":pdcPct>0?"active":"pending", auto:true},
    {id:"a-ped",   name:"Piano Editoriale attivo",   status:hasPED?"done":"pending",                   auto:true},
    {id:"a-feed",  name:"Feed operativo (+3 post)",  status:feedN>=3?"done":feedN>0?"active":"pending", auto:true},
  ];
}

function AIShortcutModal({title,content,onClose}){
  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{maxWidth:700}} onClick={e=>e.stopPropagation()}>
        <div className="modal-head"><div className="modal-title">{title}</div><button className="btn-ghost sm" onClick={onClose}>✕</button></div>
        <div className="modal-body" style={{maxHeight:"60vh",overflowY:"auto"}}><div className="md-out" dangerouslySetInnerHTML={{__html:renderMd(content)}}/></div>
        <div className="modal-foot"><button className="btn-ghost sm" onClick={()=>navigator.clipboard?.writeText(content)}>📋 Copia</button><button className="btn-primary sm" onClick={onClose}>Chiudi</button></div>
      </div>
    </div>
  );
}

function MilestoneSection({project,onUpdate}){
  const auto=getAutoMilestones(project);
  const custom=project.milestones||[];
  const [adding,setAdding]=useState(false);
  const [form,setForm]=useState({name:"",date:"",status:"pending"});
  function add(){ if(!form.name) return; onUpdate({...project,milestones:[...custom,{...form,id:uid()}]}); setAdding(false); setForm({name:"",date:"",status:"pending"}); }
  function del(id){ onUpdate({...project,milestones:custom.filter(m=>m.id!==id)}); }
  function cycleStatus(id){ const c={done:"active",active:"pending",pending:"done"}; onUpdate({...project,milestones:custom.map(m=>m.id===id?{...m,status:c[m.status]}:m)}); }
  const all=[...auto,...custom];
  return(
    <div>
      <div className="ov-sec-hdr"><div className="ov-sec-title">Milestone di progetto</div><button className="btn-outline sm" onClick={()=>setAdding(true)}>+ Aggiungi</button></div>
      {adding&&(
        <div className="ct-form" style={{marginBottom:10}}>
          <div className="fg-row3">
            <div className="fg"><label className="lbl">Milestone *</label><input className="inp" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="es. Brand Book v1.0" autoFocus/></div>
            <div className="fg"><label className="lbl">Data target</label><input className="inp" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
            <div className="fg"><label className="lbl">Stato</label><select className="inp" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="pending">Pending</option><option value="active">In corso</option><option value="done">Fatto</option></select></div>
          </div>
          <div className="form-actions"><button className="btn-ghost sm" onClick={()=>setAdding(false)}>Annulla</button><button className="btn-primary sm" onClick={add} disabled={!form.name}>Aggiungi</button></div>
        </div>
      )}
      <div className="ms-list">
        {all.map(ms=>{
          const st=MS_ST[ms.status]||MS_ST.pending;
          const isCustom=!ms.id?.startsWith("a-");
          return(
            <div key={ms.id} className="ms-row">
              <div className={`ms-dot-el ${isCustom?"ms-dot-click":""}`} style={{background:st.dot}} onClick={isCustom?()=>cycleStatus(ms.id):undefined}/>
              <div className="ms-info-el"><div className="ms-name">{ms.name}</div>{ms.date&&<div className="ms-date">{ms.date}</div>}</div>
              <span className="ms-badge" style={{background:st.bg,color:st.tx}}>{st.label}</span>
              {isCustom&&<button className="ct-del" onClick={()=>del(ms.id)}>×</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProjectTaskSection({project,onUpdate}){
  const tasks=project.tasks||[];
  const [adding,setAdding]=useState(false);
  const [filter,setFilter]=useState("tutti");
  const [form,setForm]=useState({text:"",priority:"med",tag:"Strategia",assignee:""});
  function addTask(){ if(!form.text) return; onUpdate({...project,tasks:[{...form,id:uid(),done:false,createdAt:Date.now()},...tasks]}); setAdding(false); setForm({text:"",priority:"med",tag:"Strategia",assignee:""}); }
  function toggle(id){ onUpdate({...project,tasks:tasks.map(t=>t.id===id?{...t,done:!t.done}:t)}); }
  function del(id){ onUpdate({...project,tasks:tasks.filter(t=>t.id!==id)}); }
  const shown=filter==="tutti"?tasks:tasks.filter(t=>t.tag===filter);
  const urgent=tasks.filter(t=>!t.done&&t.priority==="high");
  return(
    <div>
      <div className="ov-sec-hdr"><div className="ov-sec-title">Task <span style={{fontSize:10,color:"var(--ink4)",fontWeight:400}}>({tasks.filter(t=>!t.done).length} aperti{urgent.length>0?` · ${urgent.length} urgenti`:""})</span></div><button className="btn-outline sm" onClick={()=>setAdding(true)}>+ Task</button></div>
      {adding&&(
        <div className="ct-form" style={{marginBottom:10}}>
          <div className="fg"><label className="lbl">Descrizione *</label><input className="inp" value={form.text} onChange={e=>setForm({...form,text:e.target.value})} placeholder="es. Sessione input con cliente — Appendice A" autoFocus/></div>
          <div className="fg-row3" style={{marginTop:8}}>
            <div className="fg"><label className="lbl">Priorità</label><select className="inp" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option value="high">🔴 Alta</option><option value="med">🟡 Media</option><option value="low">⚪ Bassa</option></select></div>
            <div className="fg"><label className="lbl">Categoria</label><select className="inp" value={form.tag} onChange={e=>setForm({...form,tag:e.target.value})}>{TASK_TAGS.map(t=><option key={t}>{t}</option>)}</select></div>
            <div className="fg"><label className="lbl">Assegnatario</label><input className="inp" placeholder="es. A · S · T · Luca" value={form.assignee} onChange={e=>setForm({...form,assignee:e.target.value})}/></div>
          </div>
          <div className="form-actions"><button className="btn-ghost sm" onClick={()=>setAdding(false)}>Annulla</button><button className="btn-primary sm" onClick={addTask} disabled={!form.text}>Aggiungi</button></div>
        </div>
      )}
      <div className="task-filter-bar">
        {["tutti",...TASK_TAGS].map(f=><button key={f} className={`task-filter-btn ${filter===f?"active":""}`} onClick={()=>setFilter(f)}>{f==="tutti"?"Tutti":f}</button>)}
      </div>
      {shown.length===0&&<div className="ct-empty">Nessun task{filter!=="tutti"?" in questa categoria":""}.</div>}
      <div className="ov-task-list">
        {shown.map(task=>(
          <div key={task.id} className={`ov-task-row ${task.done?"ov-task-done":""}`}>
            <div className="ov-task-check" onClick={()=>toggle(task.id)}>{task.done?"✓":""}</div>
            <div className="ov-task-prio" style={{background:TASK_PRIORS[task.priority]?.color||"#94A3B8"}}/>
            <div className="ov-task-text">{task.text}</div>
            <span className="ov-task-tag">{task.tag}</span>
            {task.assignee&&<div className="ov-task-who">{task.assignee}</div>}
            <button className="ct-del" onClick={()=>del(task.id)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentLibrarySection({project,onGoToModule}){
  const [aiModal,setAiModal]=useState(null);
  const [loading,setLoading]=useState(null);
  const pdmF=SECTIONS_PDM.filter(s=>project.pdm?.sections?.[s.id]?.content).length;
  const pdcF=SECTIONS_PDC.filter(s=>project.pdc?.sections?.[s.id]?.content).length;
  const hasCS=!!project.pdc?.sections?.copy_strategy?.content;
  const hasBV=!!project.pdc?.sections?.tone_of_voice?.content;
  const hasPED=!!project.ed?.sections?.ped?.content;
  const docs=[
    {id:"pdm",key:"pdm",label:"Piano di Marketing",meta:"Strategia · Target · 7P · Budget · Roadmap",ver:"v1",filled:pdmF/SECTIONS_PDM.length,mod:"pdm"},
    {id:"pdc",key:"pdc",label:"Piano di Comunicazione",meta:"ToV · Message House · Campaign Moments",ver:"v1",filled:pdcF/SECTIONS_PDC.length,mod:"pdc"},
    {id:"cs",key:"copy_strategy",label:"Copy Strategy",meta:"Promessa · Reason Why · Per Persona · Prezzo",ver:"v1",filled:hasCS?1:0,mod:"pdc"},
    {id:"bv",key:"tone_of_voice",label:"Brand Voice",meta:"ToV · Parole guida · Regole operative",ver:"v1",filled:hasBV?1:0,mod:"pdc"},
    {id:"ped",key:"ped",label:"Piano Editoriale",meta:"Pilastri · Calendario mensile · Copy guida",ver:"v1",filled:hasPED?1:0,mod:"ed"},
  ];

  async function summarize(doc){
    const content=doc.mod==="pdm"
      ?Object.entries(project.pdm?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,300)||""}`).join("\n")
      :doc.mod==="pdc"
      ?Object.entries(project.pdc?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,300)||""}`).join("\n")
      :project.ed?.sections?.[doc.key]?.content||"";
    if(!content?.trim()) return;
    setLoading(doc.id);
    try {
      const txt=await callClaude(`Riassumi in italiano in modo strutturato i punti chiave di questo documento. Usa bullet points. Sii diretto e sintetico.\n\nDOCUMENTO: ${doc.label}\n\n${content.slice(0,3000)}`);
      setAiModal({title:doc.label,content:txt});
    } catch{}
    setLoading(null);
  }

  return(
    <div>
      <div className="ov-sec-hdr"><div className="ov-sec-title">Sistema documentale</div></div>
      <div className="doc-grid-ov">
        {docs.map(doc=>{
          const done=doc.filled>=0.5;
          const partial=doc.filled>0&&doc.filled<0.5;
          return(
            <div key={doc.id} className={`doc-card-ov ${!done&&!partial?"doc-pending":""}`}
              onClick={done||partial?()=>summarize(doc):()=>onGoToModule(doc.mod)}>
              <div className="doc-card-ov-hdr">
                <div className="doc-card-ov-title">{doc.label}</div>
                {(done||partial)&&<span className="doc-ver-badge">{doc.ver}</span>}
              </div>
              <div className="doc-card-ov-meta">{doc.meta}</div>
              {done&&<div className="doc-card-ov-action">{loading===doc.id?"...":"✦ Riassumi →"}</div>}
              {!done&&!partial&&<div className="doc-card-ov-action" style={{color:"var(--ink5)"}}>→ Genera</div>}
              {partial&&<div className="doc-card-ov-action" style={{color:"var(--warn)"}}>In lavorazione</div>}
            </div>
          );
        })}
      </div>
      {aiModal&&<AIShortcutModal title={aiModal.title} content={aiModal.content} onClose={()=>setAiModal(null)}/>}
    </div>
  );
}

function BudgetSection({project,onUpdate}){
  const budget=project.budget||{produzione:[],ads:{linkedin:0,google:0,meta:0,altri:0},note:""};
  function upBudget(fn){ onUpdate({...project,budget:{...budget,...fn(budget)}}); }
  function addProdRow(){ upBudget(b=>({...b,produzione:[...b.produzione,{id:uid(),label:"",valore:0}]})); }
  function updateProd(id,k,v){ upBudget(b=>({...b,produzione:b.produzione.map(r=>r.id===id?{...r,[k]:v}:r)})); }
  function delProd(id){ upBudget(b=>({...b,produzione:b.produzione.filter(r=>r.id!==id)})); }
  function setAds(k,v){ upBudget(b=>({...b,ads:{...(b.ads||{}), [k]:parseFloat(v)||0}})); }
  const totProd=(budget.produzione||[]).reduce((s,r)=>s+(parseFloat(r.valore)||0),0);
  const ads=budget.ads||{};
  const totAds=(parseFloat(ads.linkedin)||0)+(parseFloat(ads.google)||0)+(parseFloat(ads.meta)||0)+(parseFloat(ads.altri)||0);
  const totale=totProd+totAds;
  return(
    <div className="budget-wrap">
      <div className="ov-sec-hdr"><div className="ov-sec-title">Retainer & Budget mensile</div></div>
      <div className="budget-grid">
        <div className="budget-col">
          <div className="budget-col-title">Budget produzione</div>
          {(budget.produzione||[]).map(row=>(
            <div key={row.id} className="budget-row">
              <input className="inp budget-inp-label" placeholder="es. Copywriter esterno" value={row.label} onChange={e=>updateProd(row.id,"label",e.target.value)}/>
              <input className="inp budget-inp-val" type="number" placeholder="0" value={row.valore||""} onChange={e=>updateProd(row.id,"valore",e.target.value)}/>
              <span className="budget-eur">€</span>
              <button className="ct-del" onClick={()=>delProd(row.id)}>×</button>
            </div>
          ))}
          <button className="btn-ghost sm" onClick={addProdRow} style={{marginTop:6}}>+ Voce</button>
          <div className="budget-total">Totale produzione: <strong>€ {totProd.toLocaleString("it-IT")}</strong></div>
        </div>
        <div className="budget-col">
          <div className="budget-col-title">Budget Ads mensile</div>
          {[{k:"linkedin",label:"LinkedIn Ads"},{k:"google",label:"Google Ads"},{k:"meta",label:"Meta Ads"},{k:"altri",label:"Altri / Contingency"}].map(a=>(
            <div key={a.k} className="budget-row">
              <span className="budget-label">{a.label}</span>
              <input className="inp budget-inp-val" type="number" placeholder="0" value={ads[a.k]||""} onChange={e=>setAds(a.k,e.target.value)}/>
              <span className="budget-eur">€</span>
            </div>
          ))}
          <div className="budget-total">Totale Ads: <strong>€ {totAds.toLocaleString("it-IT")}</strong></div>
        </div>
      </div>
      <div className="budget-totale">
        <span>Totale mensile (scenario medio)</span>
        <span className="budget-totale-val">€ {totale.toLocaleString("it-IT")}</span>
        <span style={{fontSize:11,color:"var(--ink4)"}}>≈ € {(totale*12).toLocaleString("it-IT")} / anno</span>
      </div>
    </div>
  );
}

function AIShortcutsSection({project}){
  const [modal,setModal]=useState(null);
  const [loading,setLoading]=useState(null);
  const ctx=buildCtx(project.interview||{});
  const pdmCtx=Object.entries(project.pdm?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,200)||""}`).join("\n");
  const pdcCtx=Object.entries(project.pdc?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,200)||""}`).join("\n");
  const fullCtx=`${ctx}\n\n## Piano Marketing:\n${pdmCtx}\n\n## Comunicazione:\n${pdcCtx}`;
  const tasks=(project.tasks||[]).filter(t=>!t.done).slice(0,8).map(t=>`- [${t.priority}] ${t.text}`).join("\n");
  const mts=getAutoMilestones(project).map(m=>`- ${m.name}: ${m.status}`).join("\n");

  async function run(id,prompt){
    setLoading(id);
    try { const t=await callClaude(prompt); setModal({title:SHORTCUTS.find(s=>s.id===id)?.label,content:t}); }
    catch{ setModal({title:"Errore",content:"Errore di generazione. Riprova."}); }
    setLoading(null);
  }

  const SHORTCUTS=[
    {id:"report",   label:"Report mensile",       icon:"📊", prompt:`Genera un report mensile di stato del progetto in italiano con markdown.\n\n## Report Mensile — ${new Date().toLocaleString("it-IT",{month:"long",year:"numeric"})}\n\n### Stato Avanzamento\n[usa le milestone qui sotto]\n${mts}\n\n### Task aperti prioritari\n${tasks}\n\n### Next steps (prossime 2 settimane)\n[3-5 azioni concrete]\n\nCONTESTO: ${fullCtx.slice(0,2000)}`},
    {id:"tasks",    label:"Task prossimo sprint",  icon:"📋", prompt:`Suggerisci una lista di task prioritari per il prossimo sprint (2 settimane) di questo progetto in italiano. Formato: ogni task con [PRIORITÀ] tag categoria — assegnatario.\n\nMilestone:\n${mts}\n\nTask aperti attuali:\n${tasks}\n\nCONTESTO: ${fullCtx.slice(0,2000)}`},
    {id:"retainer", label:"Proposta retainer",     icon:"💰", prompt:`Crea una proposta di retainer mensile professionale in italiano per presentarla al cliente. Includi: scenario conservativo, medio, aggressivo con ROI atteso per ciascuno.\n\nCONTESTO: ${fullCtx.slice(0,2000)}`},
    {id:"ped",      label:"PED mese prossimo",     icon:"📅", prompt:`Genera un piano editoriale mensile completo per il mese prossimo in italiano con markdown. Includi: distribuzione pilastri, calendario contenuti (16-20 pezzi), copy guida per i top 3 contenuti.\n\nCONTESTO STRATEGICO: ${fullCtx.slice(0,3000)}`},
  ];

  return(
    <div>
      <div className="ov-sec-hdr"><div className="ov-sec-title">✦ AI Shortcuts</div></div>
      <div className="ai-shortcuts-grid">
        {SHORTCUTS.map(s=>(
          <button key={s.id} className="ai-shortcut-btn" onClick={()=>run(s.id,s.prompt)} disabled={loading===s.id}>
            <span className="ai-sc-icon">{s.icon}</span>
            <span>{loading===s.id?"Generazione…":s.label+" →"}</span>
          </button>
        ))}
      </div>
      {modal&&<AIShortcutModal title={modal.title} content={modal.content} onClose={()=>setModal(null)}/>}
    </div>
  );
}

function ProjectOverview({project,onUpdate,onGoToModule}){
  const m=computeProjectMeta(project);
  const METRICS=[
    {label:"Completamento",value:m.pct+"%",sub:`${m.pdmF+m.pdcF+m.edF}/${m.totAI} sezioni`},
    {label:"Task aperti",   value:m.open,  sub:m.urgent>0?`${m.urgent} urgenti questa settimana`:"Nessun urgente"},
    {label:"Sezioni generate",value:m.pdmF+m.pdcF+m.edF,sub:`PdM ${m.pdmF} · PdC ${m.pdcF} · Ed ${m.edF}`},
    {label:"Prossima pubbl.",value:m.nextPost?.data||"—",sub:m.nextPost?.titolo?.slice(0,24)||"Nessun post pianificato"},
  ];
  return(
    <div className="ov-wrap">
      {/* METRICS */}
      <div className="ov-metrics">
        {METRICS.map((c,i)=>(
          <div key={i} className="ov-metric-card">
            <div className="ov-metric-label">{c.label}</div>
            <div className="ov-metric-value">{c.value}</div>
            <div className="ov-metric-sub">{c.sub}</div>
          </div>
        ))}
      </div>
      {/* TWO COL */}
      <div className="ov-two-col">
        <div className="ov-left">
          <div className="ov-card"><MilestoneSection project={project} onUpdate={onUpdate}/></div>
          <div className="ov-card"><ProjectTaskSection project={project} onUpdate={onUpdate}/></div>
        </div>
        <div className="ov-right">
          <div className="ov-card"><DocumentLibrarySection project={project} onGoToModule={onGoToModule}/></div>
          <div className="ov-card"><AIShortcutsSection project={project}/></div>
        </div>
      </div>
      {/* BUDGET */}
      <div className="ov-card ov-card-full"><BudgetSection project={project} onUpdate={onUpdate}/></div>
    </div>
  );
}

// ─── CLIENT SETTINGS VIEW ─────────────────────────────────────────────────────
function Toggle({checked, onChange}){
  return <div className={`toggle ${checked?"on":""}`} onClick={()=>onChange(!checked)}><div className="toggle-knob"/></div>;
}

function ClientSettingsView({ client, globalMeta, projects, onUpdate, onAddProject, onSelectProject, onClose }){
  const [tab,   setTab]   = useState("anagrafica");
  const [f,     setF]     = useState({...client});
  const [copied,setCopied]= useState(false);

  function set(k,v){ setF(p=>({...p,[k]:v})); }
  function setSocial(k,v){ setF(p=>({...p,social:{...p.social,[k]:v}})); }
  function setPortal(k,v){ setF(p=>({...p,portal:{...p.portal,[k]:v}})); }
  function setMeta(m){ setF(p=>({...p,meta:m})); }
  function save(){ onUpdate({...f}); }

  const clientProjects = projects.filter(p=>p.clientId===client.id);
  const slug = clientSlug(client.nome);
  const portalUrl = `https://nassa-gestione.vercel.app/#/c/${slug}`;
  const pacchettoObj = PACCHETTI.find(p=>p.id===f.pacchetto)||PACCHETTI[2];

  // Meta page selection from global BM
  const allPages = globalMeta?.allPages||[];

  function selectMetaPage(pageId, tipo){
    const pg = allPages.find(p=>p.id===pageId);
    if(!pg) return;
    if(tipo==="ig"){
      setMeta({...(f.meta||{}), igUserId:pg.igId||"", igToken:pg.token, nomePagina:pg.nome});
    } else {
      setMeta({...(f.meta||{}), fbPageId:pg.id, fbToken:pg.token, nomePagina:pg.nome});
    }
  }

  const TABS = [{id:"anagrafica",label:"📋 Anagrafica"},{id:"social",label:"📱 Social & Meta"},{id:"portale",label:"🔗 Portale"},{id:"progetti",label:"📂 Progetti"}];

  return(
    <div className="cs-wrap">
      <div className="cs-header">
        <div className="cs-title">
          <div className="cs-avatar">{f.nome[0]||"?"}</div>
          <div>
            <div className="cs-nome">{f.nome}</div>
            <div className="cs-sub">{pacchettoObj.emoji} {pacchettoObj.label} · {clientProjects.length} progett{clientProjects.length!==1?"i":"o"}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn-primary sm" onClick={save}>Salva</button>
          <button className="btn-ghost sm" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="cs-tabs">
        {TABS.map(t=><button key={t.id} className={`cs-tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
      </div>

      <div className="cs-body">

        {/* ── ANAGRAFICA ── */}
        {tab==="anagrafica"&&(
          <div className="cs-card">
            <div className="cs-card-title">📋 Informazioni cliente</div>
            <div className="fg-row">
              <div className="fg"><label className="lbl">Nome *</label><input className="inp" value={f.nome} onChange={e=>set("nome",e.target.value)}/></div>
              <div className="fg"><label className="lbl">Referente</label><input className="inp" placeholder="Nome cognome" value={f.referente} onChange={e=>set("referente",e.target.value)}/></div>
              <div className="fg"><label className="lbl">Email</label><input className="inp" type="email" placeholder="email@cliente.it" value={f.email} onChange={e=>set("email",e.target.value)}/></div>
            </div>
            <div className="fg-row" style={{marginTop:10}}>
              <div className="fg"><label className="lbl">Settore</label><input className="inp" placeholder="es. Food & Beverage" value={f.settore} onChange={e=>set("settore",e.target.value)}/></div>
              <div className="fg"><label className="lbl">Pacchetto</label>
                <select className="inp" value={f.pacchetto} onChange={e=>set("pacchetto",e.target.value)}>
                  {PACCHETTI.map(p=><option key={p.id} value={p.id}>{p.emoji} {p.label} — €{p.price}/mese · {p.desc}</option>)}
                </select>
              </div>
              <div className="fg"><label className="lbl">Data inizio</label><input className="inp" type="date" value={f.dataInizio} onChange={e=>set("dataInizio",e.target.value)}/></div>
            </div>
          </div>
        )}

        {/* ── SOCIAL & META ── */}
        {tab==="social"&&(<>
          <div className="cs-card">
            <div className="cs-card-title">📱 Account social del cliente <span style={{fontSize:10,color:"var(--ink4)",fontWeight:400}}>— usati per le pubblicazioni</span></div>
            {[
              {k:"ig",   label:"Instagram", color:"#E1306C", icon:"IG", ph:"@username o URL profilo"},
              {k:"fb",   label:"Facebook",  color:"#1877F2", icon:"FB", ph:"URL pagina o @username"},
              {k:"linkedin",label:"LinkedIn",color:"#0A66C2",icon:"LI", ph:"URL profilo o pagina"},
            ].map(s=>(
              <div key={s.k} className="social-row">
                <span className="social-badge" style={{background:s.color}}>{s.icon}</span>
                <span className="social-label">{s.label}</span>
                <input className="inp" placeholder={s.ph} value={f.social[s.k]||""} onChange={e=>setSocial(s.k,e.target.value)}/>
              </div>
            ))}
            {[
              {k:"tiktok",label:"TikTok",color:"#111",icon:"TK",ph:"@username o URL"},
              {k:"sito",  label:"Sito web",color:"#64748B",icon:"🌐",ph:"es. nassastudio.it"},
            ].map(s=>(
              <div key={s.k} className="social-row">
                <span className="social-badge" style={{background:s.color,fontSize:s.k==="sito"?12:9}}>{s.icon}</span>
                <span className="social-label">{s.label}</span>
                <input className="inp" placeholder={s.ph} value={f.social[s.k]||""} onChange={e=>setSocial(s.k,e.target.value)}/>
                {s.k==="sito"&&f.social.sito&&<a href={"https://"+f.social.sito.replace(/^https?:\/\//,"")} target="_blank" rel="noreferrer" className="btn-ghost sm" style={{flexShrink:0}}>Apri ↗</a>}
              </div>
            ))}
          </div>

          <div className="cs-card">
            <div className="cs-card-title">🔗 Connetti Meta (Instagram + Facebook)</div>
            <ClientMetaConnect clientMeta={f.meta} onChange={setMeta}/>
          </div>
        </>)}

        {/* ── PORTALE ── */}
        {tab==="portale"&&(
          <div className="cs-card">
            <div className="cs-card-title">🔗 Portale cliente</div>
            <div className="portal-url-row">
              <div className="portal-url">{portalUrl}</div>
              <button className="btn-ghost sm" onClick={()=>{navigator.clipboard?.writeText(portalUrl);setCopied(true);setTimeout(()=>setCopied(false),2000);}}>
                {copied?"✓ Copiato":"🔗 Copia link"}
              </button>
            </div>
            <div className="portal-toggles">
              <div className="portal-toggle-row">
                <div><div style={{fontWeight:700,fontSize:13}}>Mostra Feed</div><div style={{fontSize:11,color:"var(--ink4)"}}>Il cliente può vedere e approvare i post del feed</div></div>
                <Toggle checked={f.portal.mostraFeed} onChange={v=>setPortal("mostraFeed",v)}/>
              </div>
              <div className="portal-toggle-row">
                <div><div style={{fontWeight:700,fontSize:13}}>Mostra Pipeline (Kanban)</div><div style={{fontSize:11,color:"var(--ink4)"}}>Il cliente può vedere lo stato dei contenuti in produzione</div></div>
                <Toggle checked={f.portal.mostraPipeline} onChange={v=>setPortal("mostraPipeline",v)}/>
              </div>
            </div>
            <div style={{marginTop:16}}>
              <label className="lbl">PIN cliente (opzionale)</label>
              <input className="inp" type="password" placeholder="••••••••" style={{maxWidth:200}} value={f.portal.pin} onChange={e=>setPortal("pin",e.target.value)}/>
              <div style={{fontSize:10,color:"var(--ink4)",marginTop:4}}>Protegge il link cliente</div>
            </div>
          </div>
        )}

        {/* ── PROGETTI ── */}
        {tab==="progetti"&&(
          <div className="cs-card">
            <div className="cs-card-title" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span>📂 Progetti ({clientProjects.length})</span>
              <button className="btn-primary sm" onClick={()=>onAddProject(client.id)}>+ Nuovo progetto</button>
            </div>
            {clientProjects.length===0&&<div className="ct-empty">Nessun progetto. Crea il primo progetto per questo cliente.</div>}
            {clientProjects.map(proj=>{
              const pdmF=SECTIONS_PDM.filter(s=>proj.pdm?.sections?.[s.id]?.content).length;
              const pdcF=SECTIONS_PDC.filter(s=>proj.pdc?.sections?.[s.id]?.content).length;
              const tot=SECTIONS_PDM.length+SECTIONS_PDC.length;
              const pct=Math.round(((pdmF+pdcF)/tot)*100);
              return(
                <div key={proj.id} className="cs-proj-row" onClick={()=>onSelectProject(proj.id)}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13}}>{proj.name}</div>
                    <div style={{fontSize:10,color:"var(--ink4)",marginTop:2}}>{new Date(proj.createdAt).toLocaleDateString("it-IT")}</div>
                    <div className="dc-bar" style={{marginTop:6,width:180}}><div className="dc-fill" style={{width:pct+"%"}}/></div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:11,fontWeight:700,color:"var(--gold)"}}>{pct}%</div>
                    <div style={{fontSize:10,color:"var(--ink4)"}}>{pdmF+pdcF}/{tot} sez.</div>
                  </div>
                  <div style={{color:"var(--gold)",fontSize:16}}>→</div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

// ─── CLIENT PORTAL PREVIEW ────────────────────────────────────────────────────
function ClientPortalPreview({ client, projects, onBack, onUpdateProject }){
  const clientProjects = projects.filter(p=>p.clientId===client.id);
  const allFeed = clientProjects.flatMap(p=>(p.ed?.feedItems||[]).filter(f=>f.stato==="semaforo"||f.stato==="approvato"));

  function approveItem(id){
    if(!onUpdateProject) return;
    clientProjects.forEach(proj=>{
      const item=proj.ed?.feedItems?.find(f=>f.id===id);
      if(item) onUpdateProject({...proj,ed:{...proj.ed,feedItems:proj.ed.feedItems.map(f=>f.id===id?{...f,stato:"approvato"}:f)}});
    });
  }
  function rejectItem(id){
    if(!onUpdateProject) return;
    clientProjects.forEach(proj=>{
      const item=proj.ed?.feedItems?.find(f=>f.id===id);
      if(item) onUpdateProject({...proj,ed:{...proj.ed,feedItems:proj.ed.feedItems.map(f=>f.id===id?{...f,stato:"non-approvato"}:f)}});
    });
  }

  return(
    <div className="portal-wrap">
      <div className="portal-header">
        <div className="portal-agency">NASSA STUDIO</div>
        <div className="portal-client">{client.nome}</div>
        <button className="btn-ghost sm" onClick={onBack}>← Torna al pannello</button>
      </div>
      <div className="portal-body">
        <div className="portal-section-title">Post da approvare</div>
        {allFeed.filter(f=>f.stato==="semaforo").length===0&&<div className="ct-empty">Nessun post in attesa di approvazione.</div>}
        {allFeed.filter(f=>f.stato==="semaforo").map(item=>(
          <div key={item.id} className="portal-post-row">
            {item.immagineUrl&&<img src={item.immagineUrl} className="portal-post-thumb" alt="" onError={e=>e.target.style.display="none"}/>}
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14}}>{item.titolo}</div>
              {item.caption&&<div className="portal-post-caption">{item.caption}</div>}
              <div style={{fontSize:10,color:"var(--ink4)",marginTop:4}}>{(item.piattaforme||[]).join(" · ")} · {item.data}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn-primary sm" style={{background:"var(--ok)"}} onClick={()=>approveItem(item.id)}>✓ Approva</button>
              <button className="btn-ghost sm" style={{color:"var(--err)"}} onClick={()=>rejectItem(item.id)}>✗ Rifiuta</button>
            </div>
          </div>
        ))}
        <div className="portal-section-title" style={{marginTop:24}}>Post approvati</div>
        {allFeed.filter(f=>f.stato==="approvato").map(item=>(
          <div key={item.id} className="portal-post-row">
            {item.immagineUrl&&<img src={item.immagineUrl} className="portal-post-thumb" alt="" onError={e=>e.target.style.display="none"}/>}
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{item.titolo}</div><div style={{fontSize:10,color:"var(--ok)",marginTop:2}}>✅ Approvato</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FEED CONSTANTS ───────────────────────────────────────────────────────────
const FEED_TIPI       = ["post","carousel","reel","storia"];
const FEED_TIPI_ICON  = { post:"📄", carousel:"🖼️", reel:"🎬", storia:"⬜" };
const FEED_TIPI_LABEL = { post:"Post", carousel:"Carousel", reel:"Reel", storia:"Storia" };
const FEED_PIATTAFORME = [
  { id:"instagram", label:"Instagram", color:"#E1306C" },
  { id:"facebook",  label:"Facebook",  color:"#1877F2" },
  { id:"linkedin",  label:"LinkedIn",  color:"#0A66C2" },
  { id:"tiktok",    label:"TikTok",    color:"#111111" },
];
const FEED_STATI = ["bozza","approvato","pubblicato","non-approvato"];
const FEED_STATI_STYLE = {
  bozza:           { label:"Bozza",          bg:"#F1F5F9", tx:"#64748B" },
  approvato:       { label:"✅ Approvato",    bg:"#ECFDF5", tx:"#059669" },
  pubblicato:      { label:"🚀 Pubblicato",   bg:"#EFF8FF", tx:"#0EA5E9" },
  "non-approvato": { label:"❌ Non approvato",bg:"#FFF0F3", tx:"#E11D48" },
};
const FEED_CTA_OPTIONS = ["— Nessuna CTA —","Scopri di più","Contattaci","Scarica","Prenota","Iscriviti","Acquista","Compila il form"];

function emptyFeedItem() {
  return { id:uid(), titolo:"Nuovo post", tipo:"post",
    piattaforme:["instagram"], stato:"bozza", data:"",
    immagineUrl:"", immagineBase64:"", videoUrl:"",
    membersAssigned:[], caption:"", cta:"", ctaLink:"",
    collaborazioni:"", tagMenzioni:"", createdAt:Date.now() };
}

// ── Image upload helper ──────────────────────────────────────────────────────
async function fileToBase64(file, maxW=720, maxH=720) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objUrl);
      let {width:w, height:h} = img;
      const ratio = Math.min(maxW/w, maxH/h, 1);
      w = Math.round(w*ratio); h = Math.round(h*ratio);
      const canvas = document.createElement("canvas");
      canvas.width=w; canvas.height=h;
      canvas.getContext("2d").drawImage(img,0,0,w,h);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = reject;
    img.src = objUrl;
  });
}

// ─── PHONE PREVIEW ────────────────────────────────────────────────────────────
function PhonePreview({ feedItems, selectedId }) {
  return (
    <div className="phone-wrap">
      <div className="phone-frame">
        <div className="phone-notch"/>
        <div className="phone-screen">
          <div className="ig-header">
            <div className="ig-avatar">{feedItems[0]?"F":"N"}</div>
            <div className="ig-name">Feed</div>
            <div className="ig-header-icons">⊕ ☰</div>
          </div>
          <div className="ig-stats">
            <div className="ig-stat"><div className="ig-stat-n">{feedItems.length}</div><div className="ig-stat-l">Post</div></div>
            <div className="ig-stat"><div className="ig-stat-n">—</div><div className="ig-stat-l">Follower</div></div>
            <div className="ig-stat"><div className="ig-stat-n">—</div><div className="ig-stat-l">Seguiti</div></div>
          </div>
          <div className="ig-grid">
            {feedItems.map(item => {
              const src = item.immagineBase64||item.immagineUrl||"";
              const isSel = item.id===selectedId;
              return (
                <div key={item.id} className={`ig-cell ${isSel?"ig-cell-sel":""}`}>
                  {src ? <img src={src} alt="" className="ig-cell-img" onError={e=>e.target.style.display="none"}/>
                       : <div className="ig-cell-empty"><span style={{fontSize:18}}>{FEED_TIPI_ICON[item.tipo]||"📄"}</span></div>}
                  {item.tipo==="reel"&&<div className="ig-reel-badge">▶</div>}
                  {item.tipo==="carousel"&&<div className="ig-reel-badge">⊞</div>}
                  {item.stato!=="bozza"&&<div className="ig-cell-badge">{FEED_STATI_STYLE[item.stato]?.label?.split(" ")[0]}</div>}
                </div>
              );
            })}
            {Array(Math.max(0,6-feedItems.length)).fill(null).map((_,i)=><div key={"e"+i} className="ig-cell ig-cell-empty-gray"/>)}
          </div>
          {selectedId&&(()=>{
            const it=feedItems.find(f=>f.id===selectedId);
            if(!it) return null;
            return(
              <div className="ig-post-preview">
                <div className="ig-post-hdr">
                  <div className="ig-avatar" style={{width:22,height:22,fontSize:9}}>N</div>
                  <div style={{fontSize:11,fontWeight:700}}>Feed</div>
                </div>
                {(it.immagineBase64||it.immagineUrl)&&<img src={it.immagineBase64||it.immagineUrl} alt="" style={{width:"100%",display:"block"}} onError={e=>e.target.style.display="none"}/>}
                {it.caption&&<div className="ig-post-caption">{it.caption.slice(0,120)}{it.caption.length>120?"…":""}</div>}
              </div>
            );
          })()}
          {!selectedId&&<div className="ig-bottom-hint">Clicca un post per vederlo</div>}
        </div>
      </div>
    </div>
  );
}

// ─── POST FORM MODAL ─────────────────────────────────────────────────────────
function PostFormModal({ item, members, onSave, onDelete, onClose }) {
  const [f, setF] = useState({
    piattaforme: ["instagram"],
    membersAssigned: [],
    ...item,
  });
  const [imgLoading, setImgLoading] = useState(false);
  const [vidObjUrl, setVidObjUrl]   = useState(item.videoUrl||"");

  function set(k,v){ setF(p=>({...p,[k]:v})); }

  function togglePiat(id){
    const curr = f.piattaforme||[];
    set("piattaforme", curr.includes(id) ? curr.filter(p=>p!==id) : [...curr,id]);
  }
  function toggleMember(id){
    const curr = f.membersAssigned||[];
    set("membersAssigned", curr.includes(id) ? curr.filter(m=>m!==id) : [...curr,id]);
  }

  async function handleImageFile(e){
    const file = e.target.files?.[0]; if(!file) return;
    setImgLoading(true);
    try {
      const b64 = await fileToBase64(file);
      set("immagineBase64", b64);
      set("immagineUrl",""); // clear URL if uploading directly
    } catch {}
    setImgLoading(false);
    e.target.value="";
  }

  function handleVideoFile(e){
    const file = e.target.files?.[0]; if(!file) return;
    // Object URL for preview only — won't persist across reloads
    if(vidObjUrl.startsWith("blob:")) URL.revokeObjectURL(vidObjUrl);
    const url = URL.createObjectURL(file);
    setVidObjUrl(url);
    set("videoUrl", url);
    e.target.value="";
  }

  const previewSrc = f.immagineBase64 || f.immagineUrl || "";
  const isVideo = f.tipo==="reel" || f.tipo==="storia";

  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="post-form-modal" onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div className="pf-header">
          <div className="pf-thumb">
            {previewSrc
              ? <img src={previewSrc} alt="" onError={e=>e.target.style.display="none"}/>
              : <div className="pf-thumb-empty">{FEED_TIPI_ICON[f.tipo]}</div>}
          </div>
          <input className="pf-title-inp" value={f.titolo||""} onChange={e=>set("titolo",e.target.value)} placeholder="Titolo post"/>
          <div style={{display:"flex",gap:6,marginLeft:"auto",flexShrink:0}}>
            {onDelete&&<button className="pf-icon-btn pf-del-btn" onClick={()=>{onDelete(f.id);onClose();}}>🗑</button>}
            <button className="pf-icon-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="pf-body">
          {/* Tipo tabs */}
          <div className="pf-tabs">
            {FEED_TIPI.map(t=>(
              <button key={t} className={`pf-tab ${f.tipo===t?"active":""}`} onClick={()=>set("tipo",t)}>
                {FEED_TIPI_ICON[t]} {FEED_TIPI_LABEL[t]}
              </button>
            ))}
          </div>

          {/* Piattaforme */}
          <div className="pf-section-label">PIATTAFORME</div>
          <div className="pf-chips">
            {FEED_PIATTAFORME.map(p=>{
              const on=(f.piattaforme||[]).includes(p.id);
              return(
                <button key={p.id} className={`pf-chip ${on?"active":""}`}
                  style={on?{background:p.color,borderColor:p.color,color:"#fff"}:{borderColor:p.color+"40",color:p.color}}
                  onClick={()=>togglePiat(p.id)}>{p.label}</button>
              );
            })}
          </div>

          {/* Stato + Data */}
          <div className="fg-row" style={{marginBottom:14}}>
            <div className="fg">
              <label className="lbl">Stato</label>
              <select className="inp" value={f.stato||"bozza"} onChange={e=>set("stato",e.target.value)}
                style={{color:FEED_STATI_STYLE[f.stato]?.tx||"#64748B",fontWeight:600}}>
                {FEED_STATI.map(s=><option key={s} value={s}>{FEED_STATI_STYLE[s]?.label||s}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="lbl">Data pubblicazione</label>
              <input className="inp" type="date" value={f.data||""} onChange={e=>set("data",e.target.value)}/>
            </div>
          </div>

          {/* MEDIA */}
          {!isVideo&&(<>
            <div className="pf-section-label">IMMAGINE POST</div>
            {previewSrc&&(
              <div className="pf-img-row">
                <img src={previewSrc} className="pf-img-thumb" alt="" onError={e=>e.target.style.display="none"}/>
                <div className="pf-img-url">{f.immagineBase64?"✓ Immagine caricata":f.immagineUrl}</div>
                <button className="btn-ghost sm" onClick={()=>{set("immagineBase64","");set("immagineUrl","");}}>Rimuovi</button>
              </div>
            )}
            <div className="pf-media-row">
              <label className="pf-upload-btn">
                {imgLoading?"Caricamento…":"📤 Carica immagine"}
                <input type="file" accept="image/*" style={{display:"none"}} onChange={handleImageFile} disabled={imgLoading}/>
              </label>
              <span style={{fontSize:11,color:"var(--ink4)",alignSelf:"center"}}>oppure</span>
              <input className="inp" style={{flex:1}} placeholder="Incolla URL (Dropbox, Drive, web…)" value={f.immagineUrl||""} onChange={e=>{set("immagineUrl",e.target.value);set("immagineBase64","");}}/>
            </div>
          </>)}

          {isVideo&&(<>
            <div className="pf-section-label">{f.tipo==="reel"?"REEL — VIDEO":"STORIA — VIDEO / IMMAGINE"}</div>
            {vidObjUrl&&vidObjUrl.startsWith("blob:")&&(
              <video src={vidObjUrl} className="pf-video-preview" controls muted/>
            )}
            <div className="pf-media-row">
              <label className="pf-upload-btn">
                📹 Carica video
                <input type="file" accept="video/*" style={{display:"none"}} onChange={handleVideoFile}/>
              </label>
              <span style={{fontSize:11,color:"var(--ink4)",alignSelf:"center"}}>oppure</span>
              <input className="inp" style={{flex:1}} placeholder="URL Dropbox / Drive (per pubblicazione Meta)" value={f.videoUrl&&!f.videoUrl.startsWith("blob:")?f.videoUrl:""} onChange={e=>{ set("videoUrl",e.target.value); setVidObjUrl(e.target.value); }}/>
            </div>
            {vidObjUrl.startsWith("blob:")&&(
              <div className="pf-media-hint">⚠️ Il video è caricato in locale (anteprima). Per pubblicare su Meta inserisci anche l'URL pubblico Dropbox.</div>
            )}
          </>)}

          {/* Team */}
          {members.length>0&&(<>
            <div className="pf-section-label" style={{marginTop:14}}>👥 TEAM ASSEGNATO</div>
            <div className="pf-members">
              {members.map(m=>{
                const on=(f.membersAssigned||[]).includes(m.id);
                return(
                  <button key={m.id} className={`pf-member-chip ${on?"active":""}`}
                    style={on?{background:m.colore,borderColor:m.colore,color:"#fff"}:{borderColor:m.colore+"40"}}
                    onClick={()=>toggleMember(m.id)}>
                    <span className="pf-mem-avatar" style={{background:on?"rgba(255,255,255,.3)":m.colore}}>{m.nome[0]}</span>
                    {m.nome.split(" ")[0]}{on&&" ×"}
                  </button>
                );
              })}
            </div>
          </>)}

          {/* Caption */}
          <div style={{marginTop:14}}>
            <label className="lbl">CAPTION</label>
            <textarea className="txta" rows={5} value={f.caption||""} onChange={e=>set("caption",e.target.value)} placeholder="Scrivi la caption del post…"/>
          </div>

          {/* CTA + Link */}
          <div className="fg-row" style={{marginTop:10}}>
            <div className="fg">
              <label className="lbl">🚀 CTA</label>
              <select className="inp" value={f.cta||""} onChange={e=>set("cta",e.target.value)}>
                {FEED_CTA_OPTIONS.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="lbl">🔗 LINK</label>
              <input className="inp" placeholder="https://..." value={f.ctaLink||""} onChange={e=>set("ctaLink",e.target.value)}/>
            </div>
          </div>

          {/* Collaborazioni + Tag */}
          <div style={{marginTop:10}}>
            <label className="lbl">🤝 COLLABORAZIONI</label>
            <input className="inp" placeholder="@account1, @account2" value={f.collaborazioni||""} onChange={e=>set("collaborazioni",e.target.value)}/>
          </div>
          <div style={{marginTop:8}}>
            <label className="lbl">👆 TAG (MENZIONI)</label>
            <input className="inp" placeholder="@persona1, @brand2 — separati da virgola" value={f.tagMenzioni||""} onChange={e=>set("tagMenzioni",e.target.value)}/>
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn-ghost sm" onClick={onClose}>Annulla</button>
          <button className="btn-primary sm" onClick={()=>onSave(f)} disabled={!f.titolo?.trim()}>Salva</button>
        </div>
      </div>
    </div>
  );
}

// ─── FEED SECTION ─────────────────────────────────────────────────────────────
function FeedED({ project, onUpdate, globalMeta }) {
  const feedItems = project.ed?.feedItems || [];
  const [selectedId, setSelectedId] = useState(null);
  const [editItem,   setEditItem]   = useState(null);
  const [members,    setMembers]    = useState([]);
  const [pubPost,    setPubPost]    = useState(null);

  useEffect(()=>{ tpGet(TP_SK_MEMBERS).then(m=>setMembers(m||DEFAULT_MEMBERS_NMS)); },[]);

  function upFeed(fn){ onUpdate({...project,ed:{...(project.ed||{}),...fn(project.ed||{})}}); }

  function save(item){
    upFeed(ed=>{
      const exists = (ed.feedItems||[]).some(f=>f.id===item.id);
      return { ...ed, feedItems: exists
        ? (ed.feedItems||[]).map(f=>f.id===item.id?item:f)
        : [...(ed.feedItems||[]), item]
      };
    });
    setEditItem(null);
  }

  function del(id){
    upFeed(ed=>({...ed,feedItems:(ed.feedItems||[]).filter(f=>f.id!==id)}));
    setEditItem(null); setSelectedId(null);
  }

  function addNew(){ setEditItem(emptyFeedItem()); }

  function handleRowClick(item){
    setSelectedId(prev => prev===item.id ? null : item.id);
  }

  return(
    <div className="feed-wrap">
      {/* LEFT — Feed list */}
      <div className="feed-list">
        <div className="feed-list-hdr">
          <div className="feed-list-count">Post nel feed ({feedItems.length})</div>
          <button className="btn-primary sm" onClick={addNew}>+ Aggiungi</button>
        </div>
        {feedItems.length===0&&(
          <div className="ct-empty" style={{paddingTop:40}}>
            Nessun post. Clicca "+ Aggiungi" per creare il primo contenuto.
          </div>
        )}
        {feedItems.map(item=>{
          const piats = (item.piattaforme||[]).map(id=>FEED_PIATTAFORME.find(p=>p.id===id)).filter(Boolean);
          const stati = FEED_STATI_STYLE[item.stato]||FEED_STATI_STYLE.bozza;
          const assignedMems = (item.membersAssigned||[]).map(id=>members.find(m=>m.id===id)).filter(Boolean);
          const src = item.immagineBase64||item.immagineUrl||"";
          const isSel = selectedId===item.id;
          return(
            <div key={item.id} className={`feed-row ${isSel?"feed-row-sel":""}`} onClick={()=>handleRowClick(item)}>
              <div className="feed-thumb" onClick={e=>{e.stopPropagation();setEditItem(item);}}>
                {src
                  ?<img src={src} alt="" onError={e=>e.target.style.display="none"}/>
                  :<div className="feed-thumb-placeholder">
                    <span style={{fontSize:20}}>{FEED_TIPI_ICON[item.tipo]||"📄"}</span>
                    <span style={{fontSize:9,color:"var(--ink4)"}}>Carica</span>
                  </div>
                }
              </div>
              <div className="feed-row-body">
                <div className="feed-row-title" onClick={e=>{e.stopPropagation();setEditItem(item);}}>{item.titolo}</div>
                <div className="feed-row-meta">
                  {piats.map(p=><span key={p.id} style={{color:p.color,fontWeight:700,fontSize:10,marginRight:4}}>{p.label}</span>)}
                  <span className="feed-stato-badge" style={{background:stati.bg,color:stati.tx}}>{stati.label}</span>
                  {item.data&&<span style={{fontSize:10,color:"var(--ink4)"}}>{item.data}</span>}
                </div>
                {assignedMems.length>0&&(
                  <div className="feed-row-team">
                    {assignedMems.map(m=><div key={m.id} className="feed-mem-dot" style={{background:m.colore}} title={m.nome}>{m.nome[0]}</div>)}
                    <span style={{fontSize:10,color:"var(--ink4)"}}>{assignedMems.map(m=>m.nome.split(" ")[0]).join(", ")}</span>
                  </div>
                )}
              </div>
              <div className="feed-row-acts" onClick={e=>e.stopPropagation()}>
                {item.stato==="approvato"&&globalMeta&&(
                  <button className="btn-primary sm" onClick={()=>setPubPost(item)}>📤</button>
                )}
                <button className="btn-ghost sm" onClick={e=>{e.stopPropagation();setEditItem(item);}}>✎</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT — Phone preview */}
      <PhonePreview feedItems={feedItems} selectedId={selectedId}/>

      {/* POST FORM MODAL */}
      {editItem&&(
        <PostFormModal
          item={editItem}
          members={members}
          onSave={save}
          onDelete={feedItems.some(f=>f.id===editItem.id)?del:null}
          onClose={()=>setEditItem(null)}
        />
      )}

      {/* PUBLISH MODAL */}
      {pubPost&&(
        <PublishModal
          post={{...pubPost}}
          meta={globalMeta}
          onClose={()=>setPubPost(null)}
          onPublished={()=>{
            upFeed(ed=>({...ed,feedItems:(ed.feedItems||[]).map(f=>f.id===pubPost.id?{...f,stato:"pubblicato"}:f)}));
            setPubPost(null);
          }}
        />
      )}
    </div>
  );
}


// ─── GLOBAL META CONNECT (barra sidebar) ──────────────────────────────────────
// ─── PER-CLIENT META CONNECT ─────────────────────────────────────────────────
// Each client has their own independent Meta connection (OAuth or BM token).
function ClientMetaConnect({ clientMeta, onChange }) {
  const [mode,      setMode]      = useState("oauth");
  const [pages,     setPages]     = useState([]);
  const [conn,      setConn]      = useState(false);
  const [bmToken,   setBmToken]   = useState("");
  const [bmLoading, setBmLoading] = useState(false);
  const [bmError,   setBmError]   = useState("");

  function connectOAuth() {
    setConn(true);
    openMetaOAuth(pgs => { setPages(pgs); setConn(false); });
  }

  async function connectBMToken() {
    if (!bmToken.trim()) return;
    setBmLoading(true); setBmError("");
    try {
      const res  = await fetch(
        `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,name,username}&access_token=${bmToken.trim()}`
      );
      const data = await res.json();
      if (data.error) { setBmError(data.error.message); setBmLoading(false); return; }
      const pgs  = (data.data || []).map(p => ({
        id: p.id, name: p.name,
        access_token: p.access_token || bmToken.trim(),
        instagram_business_account: p.instagram_business_account,
      }));
      if (!pgs.length) { setBmError("Nessuna pagina trovata. Verifica i permessi del token."); setBmLoading(false); return; }
      setPages(pgs);
    } catch(e) { setBmError(e.message || "Errore di rete."); }
    setBmLoading(false);
  }

  function confirmPage(pg) {
    const allPages = pages.map(p => ({
      id: p.id, nome: p.name,
      igId: p.instagram_business_account?.id || "",
      token: p.access_token,
    }));
    onChange({ ...(clientMeta||{}), allPages, nome: pg.name, connMethod: mode });
    setPages([]); setBmToken("");
  }

  // Page selection modal
  if (pages.length > 0) return (
    <div className="gm-modal-overlay" onClick={() => setPages([])}>
      <div className="gm-modal" onClick={e => e.stopPropagation()}>
        <div style={{fontWeight:700,marginBottom:4,fontSize:13}}>Seleziona pagina principale</div>
        <div style={{fontSize:11,color:"var(--ink4)",marginBottom:12}}>Le altre pagine restano disponibili per le pubblicazioni.</div>
        {pages.map(pg => (
          <div key={pg.id} className="meta-page-row" onClick={() => confirmPage(pg)}>
            <div style={{fontWeight:600}}>{pg.name}</div>
            <div style={{fontSize:10,color:"var(--ink4)"}}>{pg.instagram_business_account ? "✅ IG connesso" : "⚠️ Nessun IG collegato"}</div>
          </div>
        ))}
        <button className="btn-ghost sm" style={{marginTop:8}} onClick={() => setPages([])}>Annulla</button>
      </div>
    </div>
  );

  // Already connected
  if (clientMeta?.allPages?.length > 0) {
    const allPages = clientMeta.allPages;
    function selIG(pageId) { const pg=allPages.find(p=>p.id===pageId); if(pg) onChange({...clientMeta,igUserId:pg.igId,igToken:pg.token,nomePagina:pg.nome}); }
    function selFB(pageId) { const pg=allPages.find(p=>p.id===pageId); if(pg) onChange({...clientMeta,fbPageId:pg.id,fbToken:pg.token,nomePagina:pg.nome}); }
    return (
      <div>
        <div className="meta-box connected" style={{marginBottom:12}}>
          <div className="meta-connected-row">
            <span className="meta-dot-ok"/>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:13}}>{clientMeta.nome||"Meta connesso"}</div>
              <div style={{fontSize:11,color:"var(--ink4)"}}>{allPages.length} pagine · {clientMeta.connMethod==="token"?"🏢 Business Manager Token":"🔐 OAuth"}</div>
            </div>
            <button className="btn-ghost sm" onClick={()=>onChange(null)}>Disconnetti tutto</button>
          </div>
        </div>
        <div className="meta-platforms-grid">
          <div className="meta-plat-card" style={{borderColor:clientMeta.igUserId?"#10B981":"#E2E8F0"}}>
            <div className="meta-plat-hdr" style={{color:"#E1306C"}}><span className="social-badge" style={{background:"#E1306C"}}>IG</span> Instagram {clientMeta.igUserId&&<span className="meta-conn-badge">✓</span>}</div>
            {clientMeta.igUserId
              ?<><div className="meta-plat-val">@{clientMeta.nomePagina||"connesso"}</div><button className="btn-ghost sm" onClick={()=>onChange({...clientMeta,igUserId:"",igToken:""})}>Disconnetti</button></>
              :<select className="inp" onChange={e=>selIG(e.target.value)}><option value="">Seleziona pagina IG…</option>{allPages.filter(p=>p.igId).map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}</select>
            }
          </div>
          <div className="meta-plat-card" style={{borderColor:clientMeta.fbPageId?"#10B981":"#E2E8F0"}}>
            <div className="meta-plat-hdr" style={{color:"#1877F2"}}><span className="social-badge" style={{background:"#1877F2"}}>FB</span> Facebook {clientMeta.fbPageId&&<span className="meta-conn-badge">✓</span>}</div>
            {clientMeta.fbPageId
              ?<><div className="meta-plat-val">{clientMeta.nomePagina||"connesso"}</div><button className="btn-ghost sm" onClick={()=>onChange({...clientMeta,fbPageId:"",fbToken:""})}>Disconnetti</button></>
              :<select className="inp" onChange={e=>selFB(e.target.value)}><option value="">Seleziona pagina FB…</option>{allPages.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}</select>
            }
          </div>
        </div>
        <button className="btn-ghost sm" style={{marginTop:10}} onClick={()=>onChange(null)}>🔄 Ricollega / Cambia account</button>
      </div>
    );
  }

  // Not connected — show method picker
  return (
    <div>
      <div style={{display:"flex",gap:6,marginBottom:16,background:"#F8FAFC",borderRadius:8,padding:4}}>
        <button onClick={()=>setMode("oauth")} style={{flex:1,padding:"7px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:mode==="oauth"?"#fff":"transparent",color:mode==="oauth"?"#0F172A":"#64748B",boxShadow:mode==="oauth"?"0 1px 3px rgba(0,0,0,.12)":"none"}}>
          🔐 Login Facebook
        </button>
        <button onClick={()=>setMode("token")} style={{flex:1,padding:"7px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:mode==="token"?"#fff":"transparent",color:mode==="token"?"#0F172A":"#64748B",boxShadow:mode==="token"?"0 1px 3px rgba(0,0,0,.12)":"none"}}>
          🏢 Business Manager Token
        </button>
      </div>
      {mode==="oauth"&&(
        <div>
          <p style={{fontSize:12,color:"var(--ink4)",marginBottom:12,lineHeight:1.5}}>Apre una finestra di login Facebook. Accedi con l'account che gestisce le pagine di questo cliente. Ogni cliente ha la propria connessione indipendente.</p>
          <button className="btn-primary sm" onClick={connectOAuth} disabled={conn} style={{width:"100%",justifyContent:"center"}}>{conn?"⏳ Connessione in corso…":"🔗 Accedi con Facebook"}</button>
          <div className="meta-warn-box" style={{marginTop:10}}>⚠️ Il token OAuth scade dopo 60 giorni. Per connessioni permanenti usa il Business Manager Token.</div>
        </div>
      )}
      {mode==="token"&&(
        <div>
          <p style={{fontSize:12,color:"var(--ink4)",marginBottom:8,lineHeight:1.5}}>Vai su <strong>Meta Business Manager → Impostazioni → Utenti di sistema → Genera token</strong> e incolla il token qui sotto.</p>
          <textarea className="inp" rows={3} placeholder="Incolla qui il token Business Manager o Page Access Token…" value={bmToken} onChange={e=>setBmToken(e.target.value)} style={{fontFamily:"monospace",fontSize:10,resize:"vertical",marginBottom:8}}/>
          {bmError&&<div style={{color:"#EF4444",fontSize:11,marginBottom:8}}>❌ {bmError}</div>}
          <button className="btn-primary sm" onClick={connectBMToken} disabled={bmLoading||!bmToken.trim()} style={{width:"100%",justifyContent:"center"}}>{bmLoading?"⏳ Verifica in corso…":"✅ Verifica e connetti"}</button>
          <div className="meta-warn-box" style={{marginTop:10}}>💡 Permessi necessari: <code>pages_show_list</code>, <code>instagram_basic</code>, <code>instagram_content_publish</code>, <code>pages_manage_posts</code>, <code>pages_read_engagement</code></div>
        </div>
      )}
    </div>
  );
}

// ─── GLOBAL META CONNECT (sidebar — now a no-op, connection moved to per-client) ─
function GlobalMetaConnect({ globalMeta, onMetaChange }) {
  return null;
}

// ─── KANBAN BOARD ────────────────────────────────────────────────────────────
function KanbanBoardED({ project, onUpdate }) {
  const items = project.ed?.contentItems || [];
  const [adding, setAdding] = useState(false);
  const [aiItem, setAiItem] = useState(null);
  const [form, setForm] = useState({title:"",format:"Post",pilastro:"",canale:"LinkedIn",funnel:"TOFU",dueDate:"",immagineUrl:"",videoUrl:""});
  function upEd(fn){ onUpdate({...project,ed:{...(project.ed||{}),...fn(project.ed||{})}}); }
  function addItem(){ if(!form.title) return; upEd(ed=>({...ed,contentItems:[...(ed.contentItems||[]),{...form,id:uid(),tipo:form.format.toLowerCase(),status:"idea",caption:"",createdAt:Date.now()}]})); setAdding(false); setForm({title:"",format:"Post",pilastro:"",canale:"LinkedIn",funnel:"TOFU",dueDate:"",immagineUrl:"",videoUrl:""}); }
  function move(id,status){ upEd(ed=>({...ed,contentItems:(ed.contentItems||[]).map(i=>i.id===id?{...i,status}:i)})); }
  function del(id){ upEd(ed=>({...ed,contentItems:(ed.contentItems||[]).filter(i=>i.id!==id)})); }
  function upCaption(id,caption){ upEd(ed=>({...ed,contentItems:(ed.contentItems||[]).map(i=>i.id===id?{...i,caption}:i)})); }
  async function genCaption(item){
    setAiItem(item.id);
    const bv=project.pdc?.sections?.tone_of_voice?.content?.slice(0,400)||"";
    const mh=project.pdc?.sections?.message_house?.content?.slice(0,300)||"";
    const ctx=buildCtx(project.interview||{});
    try { const t=await callClaude(`Copywriter B2B. Caption per ${item.canale}. SOLO la caption.\nCONTENUTO: ${item.title} | FORMATO: ${item.format} | FUNNEL: ${item.funnel}\nBRAND VOICE: ${bv}\nMESSAGE HOUSE: ${mh}\nBRAND: ${ctx.slice(0,300)}\nRegole: frasi corte · no emoji · CTA tecnica · tono B2B.`); upCaption(item.id,t); } catch{}
    setAiItem(null);
  }
  return(
    <div className="kan-wrap">
      <div className="kan-toolbar">
        <div className="kan-counts">{Object.keys(KAN_COLS).map(k=>{ const n=items.filter(i=>i.status===k).length; return n>0?<span key={k} style={{color:KAN_COLS[k].tx,background:KAN_COLS[k].bg,padding:"2px 8px",borderRadius:99,fontSize:10,fontWeight:700}}>{KAN_COLS[k].emoji} {n}</span>:null; })}</div>
        <button className="btn-primary sm" onClick={()=>setAdding(true)}>+ Contenuto</button>
      </div>
      {adding&&(
        <div className="ct-form">
          <div className="fg"><label className="lbl">Titolo / Idea *</label><input className="inp" placeholder="es. Esosomi: come li formuliamo in 3 veicoli" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
          <div className="fg-row3">
            <div className="fg"><label className="lbl">Formato</label><input className="inp" placeholder="Post / Reel / Carousel" value={form.format} onChange={e=>setForm({...form,format:e.target.value})}/></div>
            <div className="fg"><label className="lbl">Pilastro</label><input className="inp" placeholder="es. Library Advanced" value={form.pilastro} onChange={e=>setForm({...form,pilastro:e.target.value})}/></div>
            <div className="fg"><label className="lbl">Canale</label><select className="inp" value={form.canale} onChange={e=>setForm({...form,canale:e.target.value})}>{Object.keys(CANALE_COLOR).map(c=><option key={c}>{c}</option>)}</select></div>
            <div className="fg"><label className="lbl">Funnel</label><select className="inp" value={form.funnel} onChange={e=>setForm({...form,funnel:e.target.value})}>{["TOFU","MOFU","BOFU"].map(f=><option key={f}>{f}</option>)}</select></div>
            <div className="fg"><label className="lbl">Data pubbl.</label><input className="inp" type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/></div>
          </div>
          <div className="fg-row">
            <div className="fg"><label className="lbl">URL immagine</label><input className="inp" placeholder="https://…" value={form.immagineUrl} onChange={e=>setForm({...form,immagineUrl:e.target.value})}/></div>
            <div className="fg"><label className="lbl">URL video (Reel)</label><input className="inp" placeholder="https://…" value={form.videoUrl} onChange={e=>setForm({...form,videoUrl:e.target.value})}/></div>
          </div>
          <div className="form-actions"><button className="btn-ghost sm" onClick={()=>setAdding(false)}>Annulla</button><button className="btn-primary sm" onClick={addItem} disabled={!form.title}>Aggiungi</button></div>
        </div>
      )}
      <div className="kan-board">
        {Object.entries(KAN_COLS).map(([colKey,col])=>{
          const cards=items.filter(i=>i.status===colKey);
          const nextKey=KAN_NEXT[colKey];
          return(
            <div key={colKey} className="kan-col">
              <div className="kan-col-hdr" style={{background:col.bg,color:col.tx}}><span>{col.emoji} {col.label}</span><span className="kan-col-cnt">{cards.length}</span></div>
              <div className="kan-col-body">
                {cards.map(item=>(
                  <div key={item.id} className="kan-card" style={{borderLeft:`3px solid ${CANALE_COLOR[item.canale]||"#64748B"}`}}>
                    <div className="kan-card-title">{item.title}</div>
                    <div className="kan-card-meta">
                      <span className="kan-badge" style={{background:(CANALE_COLOR[item.canale]||"#64748B")+"18",color:CANALE_COLOR[item.canale]||"#64748B"}}>{item.canale}</span>
                      <span className="kan-badge" style={{background:"#F1F5F9",color:"#64748B"}}>{item.format}</span>
                      {item.dueDate&&<span className="kan-date">{item.dueDate}</span>}
                    </div>
                    {item.caption&&<div className="kan-caption">"{item.caption.slice(0,70)}{item.caption.length>70?"…":""}"</div>}
                    <div className="kan-card-actions">
                      <button className="kan-act-btn" onClick={()=>genCaption(item)} disabled={aiItem===item.id}>{aiItem===item.id?"...":"✦ Caption"}</button>
                      <button className="kan-act-btn" onClick={()=>del(item.id)} style={{color:"var(--err)"}}>×</button>
                    </div>
                    {nextKey&&<button className="kan-advance" style={{background:col.tx+"12",color:col.tx,borderColor:col.tx+"30"}} onClick={()=>move(item.id,nextKey)}>{KAN_NEXT_LABEL[colKey]}</button>}
                  </div>
                ))}
                {cards.length===0&&<div className="kan-empty">—</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PUBLISH MODAL ────────────────────────────────────────────────────────────
function PublishModal({post,meta,onClose,onPublished}){
  const igOk=meta?.ig?.userId&&meta?.ig?.token;
  const fbOk=meta?.fb?.pageId&&meta?.fb?.token;
  const [mode,setMode]=useState("ora");
  const [schedDate,setSchedDate]=useState(post.dueDate||new Date().toISOString().slice(0,10));
  const [schedTime,setSchedTime]=useState("09:00");
  const [status,setStatus]=useState("idle");
  const [results,setResults]=useState([]);
  const [videoWait,setVideoWait]=useState(false);
  const [selIG,setSelIG]=useState(!!igOk);
  const [selFB,setSelFB]=useState(!!fbOk);
  const schedUnix=mode==="pianifica"&&schedDate?Math.floor(new Date(schedDate+"T"+schedTime+":00").getTime()/1000):null;
  const isReel=(post.tipo||post.format||"").toLowerCase()==="reel";
  async function publish(){
    if(!igOk&&!fbOk) return; setStatus("publishing"); const out=[];
    if(igOk&&selIG){ try{ if(isReel)setVideoWait(true); await igPublish(meta.ig.userId,meta.ig.token,post,schedUnix); setVideoWait(false); out.push({platform:"Instagram",ok:true}); }catch(e){ setVideoWait(false); out.push({platform:"Instagram",ok:false,msg:e.message}); } }
    if(fbOk&&selFB){ try{ await fbPublish(meta.fb.pageId,meta.fb.token,post,schedUnix); out.push({platform:"Facebook",ok:true}); }catch(e){ out.push({platform:"Facebook",ok:false,msg:e.message}); } }
    setResults(out); const anyOk=out.some(r=>r.ok); setStatus(anyOk?"success":"error");
    if(anyOk) onPublished(mode==="pianifica"?"pianificato":"pubblicato");
  }
  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal sm" onClick={e=>e.stopPropagation()}>
        <div className="modal-head"><div><div className="modal-title">📢 Pubblica</div><div style={{fontSize:11,color:"var(--ink4)",marginTop:2}}>{post.title}</div></div><button className="btn-ghost sm" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          {status==="idle"&&(<>
            {!igOk&&!fbOk&&<div className="pub-warn">Nessun account Meta connesso. Connetti nella sezione Publishing Hub.</div>}
            {(igOk||fbOk)&&(<>
              <div className="pub-platforms">
                {igOk&&<label className="pub-plat-check"><input type="checkbox" checked={selIG} onChange={e=>setSelIG(e.target.checked)}/> Instagram</label>}
                {fbOk&&<label className="pub-plat-check"><input type="checkbox" checked={selFB} onChange={e=>setSelFB(e.target.checked)}/> Facebook</label>}
              </div>
              <div className="pub-mode">
                <button className={`pub-mode-btn ${mode==="ora"?"active":""}`} onClick={()=>setMode("ora")}>Ora</button>
                <button className={`pub-mode-btn ${mode==="pianifica"?"active":""}`} onClick={()=>setMode("pianifica")}>Pianifica</button>
              </div>
              {mode==="pianifica"&&<div className="fg-row" style={{marginTop:12}}><div className="fg"><label className="lbl">Data</label><input className="inp" type="date" value={schedDate} onChange={e=>setSchedDate(e.target.value)}/></div><div className="fg"><label className="lbl">Ora</label><input className="inp" type="time" value={schedTime} onChange={e=>setSchedTime(e.target.value)}/></div></div>}
              {post.caption&&<div className="pub-caption-preview">{post.caption.slice(0,200)}{post.caption.length>200?"…":""}</div>}
            </>)}
          </>)}
          {status==="publishing"&&<div style={{textAlign:"center",padding:"28px 0"}}><div className="spin" style={{margin:"0 auto 14px",width:32,height:32,borderWidth:3}}/><div style={{fontWeight:700}}>{videoWait?"Elaborazione video (1-2 min)…":"Pubblicazione…"}</div></div>}
          {status==="success"&&<div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:40,marginBottom:12}}>🎉</div><div style={{fontWeight:800,fontSize:16,marginBottom:8}}>{mode==="pianifica"?"Pianificato!":"Pubblicato!"}</div>{results.map(r=><div key={r.platform} style={{fontSize:12,color:r.ok?"var(--ok)":"var(--err)",marginBottom:4}}>{r.ok?"✅":"❌"} {r.platform}{r.msg?" — "+r.msg:""}</div>)}<button className="btn-primary" style={{marginTop:16}} onClick={onClose}>Chiudi</button></div>}
          {status==="error"&&<div>{results.map(r=><div key={r.platform} style={{fontSize:12,color:"var(--err)",background:"#FFF0F3",borderRadius:6,padding:"8px 12px",marginBottom:6}}>❌ <strong>{r.platform}</strong>: {r.msg}</div>)}<button className="btn-ghost sm" onClick={()=>setStatus("idle")}>Riprova</button></div>}
        </div>
        {status==="idle"&&(igOk||fbOk)&&<div className="modal-foot"><button className="btn-ghost sm" onClick={onClose}>Annulla</button><button className="btn-primary sm" onClick={publish} disabled={!selIG&&!selFB}>{mode==="pianifica"?"Pianifica":"Pubblica ora"}</button></div>}
      </div>
    </div>
  );
}

// ─── META CONNECT ─────────────────────────────────────────────────────────────
// ─── PUBLISHING HUB ───────────────────────────────────────────────────────────
function PublishingHubED({project,onUpdate,globalMeta}){
  const items=project.ed?.contentItems||[];
  const approved=items.filter(i=>i.status==="approvato");
  const [pubPost,setPubPost]=useState(null);
  const [aiItem,setAiItem]=useState(null);
  function upEd(fn){ onUpdate({...project,ed:{...(project.ed||{}),...fn(project.ed||{})}}); }
  function upCaption(id,caption){ upEd(ed=>({...ed,contentItems:(ed.contentItems||[]).map(i=>i.id===id?{...i,caption}:i)})); }
  function markLive(id){ upEd(ed=>({...ed,contentItems:(ed.contentItems||[]).map(i=>i.id===id?{...i,status:"live"}:i)})); }
  async function genCaption(item){
    setAiItem(item.id);
    const bv=project.pdc?.sections?.tone_of_voice?.content?.slice(0,400)||"";
    const mh=project.pdc?.sections?.message_house?.content?.slice(0,300)||"";
    const ctx=buildCtx(project.interview||{});
    try{ const t=await callClaude(`Copywriter B2B. Caption per ${item.canale}. SOLO la caption.\nCONTENUTO: ${item.title} | FORMATO: ${item.format} | FUNNEL: ${item.funnel}\nBRAND VOICE: ${bv}\nMESSAGE HOUSE: ${mh}\nBRAND: ${ctx.slice(0,300)}\nRegole: frasi corte · no emoji · CTA tecnica.`); upCaption(item.id,t); }catch{}
    setAiItem(null);
  }
  return(
    <div className="pub-hub-wrap">
      <div className="pub-hub-meta-status">
        {globalMeta?<div className="pub-meta-ok">🔗 Meta connesso: <strong>{globalMeta.nome}</strong> · {(globalMeta.allPages||[]).length||1} pagine</div>:<div className="pub-meta-warn">⚠️ Meta non connesso — usa il pulsante nella sidebar</div>}
      </div>
      <div className="pub-hub-section">
        <div className="pub-hub-title">Pronti per la pubblicazione <span className="pub-hub-cnt">{approved.length}</span></div>
        {approved.length===0&&<div className="ct-empty">Nessun contenuto in stato Approvato. Avanza i contenuti nel Kanban Board.</div>}
        {approved.map(item=>(
          <div key={item.id} className="pub-item">
            <div className="pub-item-hdr">
              <span className="kan-badge" style={{background:(CANALE_COLOR[item.canale]||"#64748B")+"18",color:CANALE_COLOR[item.canale]||"#64748B"}}>{item.canale}</span>
              <span className="kan-badge" style={{background:"#F1F5F9",color:"#64748B"}}>{item.format}</span>
              {item.dueDate&&<span className="kan-date">{item.dueDate}</span>}
              <span style={{flex:1}}/>
              <button className="btn-ghost sm" onClick={()=>genCaption(item)} disabled={aiItem===item.id}>{aiItem===item.id?"…":"✦ Caption"}</button>
              <button className="btn-primary sm" onClick={()=>setPubPost(item)}>📤 Pubblica</button>
            </div>
            <div style={{fontSize:13,fontWeight:600,color:"var(--ink)",margin:"8px 0 4px"}}>{item.title}</div>
            {item.caption
              ?<textarea className="txta" rows={4} value={item.caption} onChange={e=>upCaption(item.id,e.target.value)}/>
              :<div style={{fontSize:11,color:"var(--ink4)",fontStyle:"italic"}}>Caption non generata — clicca "Caption" o scrivi manualmente.</div>
            }
          </div>
        ))}
      </div>
      {pubPost&&<PublishModal post={{...pubPost,immagineUrl:pubPost.immagineUrl||"",videoUrl:pubPost.videoUrl||""}} meta={globalMeta} onClose={()=>setPubPost(null)} onPublished={()=>{ markLive(pubPost.id); setPubPost(null); }}/>}
    </div>
  );
}

// ─── TEAM PLANNER NMS ─────────────────────────────────────────────────────────
function TeamPlannerNMS({projects}){
  const [weekKey,setWeekKey]=useState(getWeekKey(new Date()));
  const [members,setMembers]=useState([]);
  const [tasks,setTasks]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showAdd,setShowAdd]=useState(null);
  const [editTask,setEditTask]=useState(null);
  const [showAddMem,setShowAddMem]=useState(false);
  const [fTitolo,setFTitolo]=useState(""); const [fCliente,setFCliente]=useState(""); const [fOre,setFOre]=useState(2); const [fColore,setFColore]=useState(TASK_COLORS[0]); const [fNote,setFNote]=useState("");
  const [mNome,setMNome]=useState(""); const [mRuolo,setMRuolo]=useState(RUOLI_NMS[0]); const [mColore,setMColore]=useState(TASK_COLORS[4]); const [mTariffa,setMTariffa]=useState(40);
  const monday=getMondayOfWeek(weekKey);
  const DAYS=Array.from({length:7},(_,i)=>{ const d=addDays(monday,i); return {iso:fmtISO(d),short:fmtShort(d),label:["Lun","Mar","Mer","Gio","Ven","Sab","Dom"][i]}; });
  const todayISO=fmtISO(new Date());
  useEffect(()=>{ (async()=>{ setLoading(true); const [m,t]=await Promise.all([tpGet(TP_SK_MEMBERS),tpGet("nms-tp:tasks:"+weekKey)]); setMembers(m||DEFAULT_MEMBERS_NMS); setTasks(t||[]); setLoading(false); })(); },[weekKey]);
  async function saveTasks(next){ setTasks(next); await tpSet("nms-tp:tasks:"+weekKey,next); }
  async function saveMembers(next){ setMembers(next); await tpSet(TP_SK_MEMBERS,next); }
  function prevWeek(){ const d=getMondayOfWeek(weekKey); d.setDate(d.getDate()-7); setWeekKey(getWeekKey(d)); }
  function nextWeek(){ const d=getMondayOfWeek(weekKey); d.setDate(d.getDate()+7); setWeekKey(getWeekKey(d)); }
  function openAdd(memberId,dateISO){ setFTitolo(""); setFCliente(""); setFOre(2); setFColore(TASK_COLORS[0]); setFNote(""); setEditTask(null); setShowAdd({memberId,dateISO}); }
  function openEdit(tk){ setFTitolo(tk.titolo||""); setFCliente(tk.cliente||""); setFOre(tk.ore||2); setFColore(tk.colore||TASK_COLORS[0]); setFNote(tk.note||""); setEditTask(tk); setShowAdd({memberId:tk.memberId,dateISO:tk.dateISO}); }
  async function saveTask(){ if(!fTitolo) return; if(editTask){ await saveTasks(tasks.map(t=>t.id===editTask.id?{...t,titolo:fTitolo,cliente:fCliente,ore:fOre,colore:fColore,note:fNote}:t)); } else { await saveTasks([...tasks,{id:"tk"+Date.now(),memberId:showAdd.memberId,dateISO:showAdd.dateISO,titolo:fTitolo,cliente:fCliente,ore:fOre,colore:fColore,note:fNote}]); } setShowAdd(null); setEditTask(null); }
  async function delTask(id){ await saveTasks(tasks.filter(t=>t.id!==id)); setShowAdd(null); }
  async function addMember(){ if(!mNome) return; await saveMembers([...members,{id:"m"+Date.now(),nome:mNome,ruolo:mRuolo,colore:mColore,tariffa:mTariffa,ore:40}]); setShowAddMem(false); setMNome(""); }
  async function removeMember(id){ if(!confirm("Rimuovere?")) return; await saveMembers(members.filter(m=>m.id!==id)); }
  const tasksFor=(mId,dIso)=>tasks.filter(t=>t.memberId===mId&&t.dateISO===dIso);
  const oreWeek=mId=>tasks.filter(t=>t.memberId===mId).reduce((s,t)=>s+(t.ore||0),0);
  const oreDay=dIso=>tasks.filter(t=>t.dateISO===dIso).reduce((s,t)=>s+(t.ore||0),0);
  const clientList=[...new Set(projects.map(p=>p.name).filter(Boolean))];
  if(loading) return <div className="gen-row"><div className="spin"/>Caricamento…</div>;
  return(
    <div className="tp-wrap">
      <div className="tp-header">
        <div className="tp-nav">
          <button className="btn-ghost sm" onClick={prevWeek}>←</button>
          <div className="tp-week-label">Settimana {weekKey} &nbsp;·&nbsp; {fmtShort(monday)} — {fmtShort(addDays(monday,6))}</div>
          <button className="btn-ghost sm" onClick={nextWeek}>→</button>
          <button className="btn-ghost sm" onClick={()=>setWeekKey(getWeekKey(new Date()))}>Oggi</button>
        </div>
        <button className="btn-outline sm" onClick={()=>setShowAddMem(true)}>+ Membro</button>
      </div>
      {showAddMem&&(
        <div className="ct-form" style={{margin:"0 0 14px"}}>
          <div className="fg-row3">
            <div className="fg"><label className="lbl">Nome *</label><input className="inp" value={mNome} onChange={e=>setMNome(e.target.value)} placeholder="es. Luca Giunta"/></div>
            <div className="fg"><label className="lbl">Ruolo</label><select className="inp" value={mRuolo} onChange={e=>setMRuolo(e.target.value)}>{RUOLI_NMS.map(r=><option key={r}>{r}</option>)}</select></div>
            <div className="fg"><label className="lbl">€/h</label><input className="inp" type="number" value={mTariffa} onChange={e=>setMTariffa(+e.target.value)}/></div>
            <div className="fg"><label className="lbl">Colore</label><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>{TASK_COLORS.map(c=><div key={c} onClick={()=>setMColore(c)} style={{width:20,height:20,borderRadius:"50%",background:c,cursor:"pointer",border:mColore===c?"2px solid var(--ink)":"2px solid transparent"}}/>)}</div></div>
          </div>
          <div className="form-actions"><button className="btn-ghost sm" onClick={()=>setShowAddMem(false)}>Annulla</button><button className="btn-primary sm" onClick={addMember} disabled={!mNome}>Aggiungi</button></div>
        </div>
      )}
      <div className="tp-grid-wrap">
        <table className="tp-table">
          <thead><tr>
            <th className="tp-th-member">Membro</th>
            {DAYS.map(d=><th key={d.iso} className={`tp-th-day ${d.iso===todayISO?"tp-today-col":""}`}><div>{d.label}</div><div className="tp-day-date">{d.short}</div>{oreDay(d.iso)>0&&<div className="tp-day-ore">{oreDay(d.iso)}h</div>}</th>)}
            <th className="tp-th-tot">Sett.</th>
          </tr></thead>
          <tbody>
            {members.map(m=>{
              const tot=oreWeek(m.id),pct=Math.min(100,Math.round((tot/(m.ore||40))*100));
              return(<tr key={m.id}>
                <td className="tp-td-member">
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div className="tp-avatar" style={{background:m.colore}}>{m.nome[0]}</div>
                    <div><div className="tp-member-name">{m.nome}</div><div className="tp-member-role">{m.ruolo}</div></div>
                    <button className="ct-del" onClick={()=>removeMember(m.id)}>×</button>
                  </div>
                </td>
                {DAYS.map(d=>{
                  const dTasks=tasksFor(m.id,d.iso);
                  return(<td key={d.iso} className={`tp-td ${d.iso===todayISO?"tp-today-col":""}`} onClick={()=>openAdd(m.id,d.iso)}>
                    {dTasks.map(tk=><div key={tk.id} className="tp-task" style={{background:tk.colore+"18",borderLeft:`3px solid ${tk.colore}`}} onClick={e=>{e.stopPropagation();openEdit(tk);}}>
                      <div className="tp-task-title">{tk.titolo}</div>
                      {tk.cliente&&<div className="tp-task-client">{tk.cliente}</div>}
                      <div className="tp-task-ore">{tk.ore}h</div>
                    </div>)}
                    <div className="tp-add-hint">+</div>
                  </td>);
                })}
                <td className="tp-td-tot">
                  <div className="tp-ore-tot" style={{color:pct>100?"var(--err)":pct>80?"var(--warn)":"var(--ok)"}}>{tot}h</div>
                  <div className="tp-ore-cap">/ {m.ore||40}h</div>
                  <div className="tp-ore-bar"><div style={{width:pct+"%",background:pct>100?"var(--err)":pct>80?"var(--warn)":"var(--ok)"}}/></div>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>
      {showAdd&&(
        <div className="modal-overlay" onClick={()=>setShowAdd(null)}>
          <div className="modal sm" onClick={e=>e.stopPropagation()}>
            <div className="modal-head"><div className="modal-title">{editTask?"Modifica task":"+ Task"}</div><button className="btn-ghost sm" onClick={()=>setShowAdd(null)}>✕</button></div>
            <div className="modal-body">
              <div className="fg" style={{marginBottom:10}}><label className="lbl">Titolo *</label><input className="inp" value={fTitolo} onChange={e=>setFTitolo(e.target.value)} placeholder="es. Copy post LinkedIn Library Advanced" autoFocus/></div>
              <div className="fg-row" style={{marginBottom:10}}>
                <div className="fg"><label className="lbl">Progetto</label><select className="inp" value={fCliente} onChange={e=>setFCliente(e.target.value)}><option value="">— Nessuno —</option>{clientList.map(c=><option key={c}>{c}</option>)}</select></div>
                <div className="fg"><label className="lbl">Ore</label><input className="inp" type="number" min={0.5} step={0.5} value={fOre} onChange={e=>setFOre(+e.target.value)}/></div>
              </div>
              <div className="fg" style={{marginBottom:10}}><label className="lbl">Note</label><input className="inp" value={fNote} onChange={e=>setFNote(e.target.value)} placeholder="Dettagli, link, riferimenti"/></div>
              <div className="fg"><label className="lbl">Colore</label><div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:4}}>{TASK_COLORS.map(c=><div key={c} onClick={()=>setFColore(c)} style={{width:22,height:22,borderRadius:"50%",background:c,cursor:"pointer",border:fColore===c?"2px solid var(--ink)":"2px solid transparent"}}/>)}</div></div>
            </div>
            <div className="modal-foot">
              {editTask&&<button className="btn-ghost sm" style={{color:"var(--err)"}} onClick={()=>delTask(editTask.id)}>Elimina</button>}
              <div style={{flex:1}}/><button className="btn-ghost sm" onClick={()=>setShowAdd(null)}>Annulla</button><button className="btn-primary sm" onClick={saveTask} disabled={!fTitolo}>Salva</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EXPORT HELPERS ──────────────────────────────────────────────────────────
function downloadBlob(filename, content, type="text/plain;charset=utf-8"){
  const blob=new Blob([content],{type});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download=filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function mdToHtml(md){
  return md
    .replace(/^### (.+)$/gm,"<h3>$1</h3>")
    .replace(/^## (.+)$/gm,"<h2>$1</h2>")
    .replace(/^# (.+)$/gm,"<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,"<em>$1</em>")
    .replace(/^---+$/gm,"<hr>")
    .replace(/^\| (.+) \|$/gm, row=>"<tr>"+row.slice(2,-2).split(" | ").map(c=>"<td>"+c+"</td>").join("")+"</tr>")
    .replace(/(<tr>.+<\/tr>)/gs, t=>"<table>"+t+"</table>")
    .replace(/^- (.+)$/gm,"<li>$1</li>")
    .replace(/(<li>.+<\/li>\n?)+/gs, l=>"<ul>"+l+"</ul>")
    .replace(/\n\n/g,"</p><p>")
    .replace(/^(?!<[hultHULT])/gm,"<p>")
    .replace(/(?<![>])\n/g,"<br>");
}

function buildDocHTML(label, content, projectName){
  const date=new Date().toLocaleDateString("it-IT",{day:"2-digit",month:"long",year:"numeric"});
  return `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>${label} — ${projectName}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Segoe UI',Arial,sans-serif;max-width:860px;margin:0 auto;padding:48px 40px;color:#1A1A2E;background:#fff;line-height:1.7;}
.doc-header{border-bottom:3px solid #0EA5E9;padding-bottom:24px;margin-bottom:40px;}
.doc-brand{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#0EA5E9;margin-bottom:8px;}
.doc-title{font-size:28px;font-weight:800;color:#0F172A;margin-bottom:6px;}
.doc-meta{font-size:12px;color:#94A3B8;}
h1{font-size:22px;color:#0F172A;margin:28px 0 12px;border-bottom:1px solid #E2E8F0;padding-bottom:6px;}
h2{font-size:18px;color:#0F172A;margin:22px 0 10px;}
h3{font-size:15px;color:#334155;margin:18px 0 8px;}
p{margin-bottom:12px;font-size:14px;}
ul{margin:8px 0 14px 20px;}li{margin-bottom:4px;font-size:14px;}
table{border-collapse:collapse;width:100%;margin:14px 0;font-size:13px;}
th,td{border:1px solid #E2E8F0;padding:8px 12px;text-align:left;}
th{background:#F1F5F9;font-weight:700;color:#334155;}
tr:nth-child(even) td{background:#F8FAFC;}
strong{font-weight:700;color:#0F172A;}
hr{border:none;border-top:1px solid #E2E8F0;margin:24px 0;}
.doc-footer{margin-top:48px;padding-top:16px;border-top:1px solid #E2E8F0;font-size:11px;color:#94A3B8;display:flex;justify-content:space-between;}
@media print{body{padding:20px;}@page{margin:2cm;}}
</style></head><body>
<div class="doc-header">
  <div class="doc-brand">Nassa Marketing Studio</div>
  <div class="doc-title">${label}</div>
  <div class="doc-meta">${projectName} · ${date}</div>
</div>
<div class="doc-body">${mdToHtml(content)}</div>
<div class="doc-footer">
  <span>Nassa Studio S.r.l.s. — nassastudio.it</span>
  <span>${date}</span>
</div>
</body></html>`;
}

const buildSlidePrompt=(label,content)=>`Trasforma questo contenuto strategico in una presentazione di 8-10 slide per Nassa Studio.
Rispondi SOLO con un array JSON valido, nessun testo prima o dopo:
[{"titolo":"titolo slide","punti":["punto chiave 1","punto chiave 2","punto chiave 3"],"tipo":"cover|content|data|quote","nota":"speaker note breve"}]

Tipi: "cover" per prima slide con headline, "content" per slide standard, "data" per slide con numeri/KPI, "quote" per citazioni/principi chiave.
Punti: max 4 per slide, max 60 caratteri ciascuno. Titoli: max 50 caratteri.

SEZIONE: ${label}
CONTENUTO:
${content.slice(0,3000)}`;

function buildSlideshowHTML(slidesJson, label, projectName){
  let slides;
  try { slides=JSON.parse(slidesJson.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim().match(/\[[\s\S]*\]/)?.[0]||"[]"); }
  catch { slides=[{titolo:label,punti:["Contenuto non strutturato"],tipo:"cover"}]; }

  const slideHTML=slides.map((s,i)=>`
  <div class="slide ${s.tipo||'content'}" data-index="${i}">
    <div class="slide-num">${i+1}/${slides.length}</div>
    <div class="slide-inner">
      <div class="slide-brand">NASSA STUDIO · ${projectName}</div>
      <h2 class="slide-title">${s.titolo||""}</h2>
      <ul class="slide-points">${(s.punti||[]).map(p=>`<li>${p}</li>`).join("")}</ul>
      ${s.nota?`<div class="slide-note">💡 ${s.nota}</div>`:""}
    </div>
  </div>`).join("");

  return `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>${label} — Presentazione</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
html,body{width:100%;height:100%;overflow:hidden;font-family:'Segoe UI',Arial,sans-serif;}
.slides-wrap{width:100%;height:100%;position:relative;background:#0F172A;}
.slide{position:absolute;inset:0;display:none;flex-direction:column;justify-content:center;padding:48px 80px;background:#0F172A;color:#F1F5F9;}
.slide.active{display:flex;}
.slide.cover{background:linear-gradient(135deg,#0F172A 0%,#1E3A5F 100%);text-align:center;align-items:center;}
.slide.data{background:linear-gradient(135deg,#0F172A 0%,#164E63 100%);}
.slide.quote{background:#1E293B;border-left:6px solid #0EA5E9;}
.slide-brand{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#0EA5E9;margin-bottom:24px;font-weight:700;}
.slide-title{font-size:36px;font-weight:800;color:#F1F5F9;margin-bottom:28px;line-height:1.2;}
.slide.cover .slide-title{font-size:48px;color:#fff;}
.slide-points{list-style:none;display:flex;flex-direction:column;gap:14px;}
.slide-points li{font-size:18px;color:#CBD5E1;display:flex;align-items:flex-start;gap:12px;}
.slide-points li::before{content:"→";color:#0EA5E9;font-weight:700;flex-shrink:0;margin-top:1px;}
.slide.cover .slide-points li{justify-content:center;font-size:20px;color:#94A3B8;}
.slide.cover .slide-points li::before{display:none;}
.slide-note{margin-top:28px;font-size:13px;color:#475569;background:#1E293B;padding:10px 16px;border-radius:6px;border-left:3px solid #334155;}
.slide-num{position:absolute;bottom:24px;right:32px;font-size:12px;color:#334155;font-weight:600;}
.controls{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);display:flex;gap:12px;z-index:100;}
.ctrl-btn{background:#1E293B;border:1px solid #334155;color:#94A3B8;padding:10px 20px;border-radius:6px;cursor:pointer;font-size:14px;font-weight:600;transition:all .15s;}
.ctrl-btn:hover{background:#0EA5E9;color:#fff;border-color:#0EA5E9;}
.progress{position:fixed;top:0;left:0;height:3px;background:#0EA5E9;transition:width .3s;}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.slide.active{animation:fadeIn .25s ease;}
@media print{.controls,.slide-num{display:none;}.slide{position:relative;display:flex!important;page-break-after:always;height:100vh;}}
</style></head><body>
<div class="slides-wrap">${slideHTML}</div>
<div class="progress" id="prog"></div>
<div class="controls">
  <button class="ctrl-btn" onclick="prev()">← Prec</button>
  <button class="ctrl-btn" onclick="toggleFull()">⛶ Full</button>
  <button class="ctrl-btn" onclick="next()">Succ →</button>
</div>
<script>
var cur=0,tot=${slides.length};
function show(n){
  document.querySelectorAll('.slide').forEach((s,i)=>s.classList.toggle('active',i===n));
  document.getElementById('prog').style.width=((n+1)/tot*100)+'%';
  cur=n;
}
function next(){if(cur<tot-1)show(cur+1);}
function prev(){if(cur>0)show(cur-1);}
function toggleFull(){if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen();}
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='Space')next();if(e.key==='ArrowLeft')prev();if(e.key==='f')toggleFull();});
show(0);
</script></body></html>`;
}

// ─── EXPORT MODULE ────────────────────────────────────────────────────────────
const MODULE_META = {
  pdm: { label:"Piano di Marketing", icon:"📊", sections:SECTIONS_PDM, getter: p=>p.pdm?.sections||{} },
  pdc: { label:"Piano di Comunicazione", icon:"📣", sections:SECTIONS_PDC, getter: p=>p.pdc?.sections||{} },
  ed:  { label:"Editoriale", icon:"✏️", sections:SECTIONS_ED.filter(s=>!ED_SPECIAL.includes(s.id)), getter: p=>p.ed?.sections||{} },
};

function buildModuleDocHTML(module, project){
  const meta=MODULE_META[module]; if(!meta) return "";
  const data=meta.getter(project);
  const date=new Date().toLocaleDateString("it-IT",{day:"2-digit",month:"long",year:"numeric"});
  const filled=meta.sections.filter(s=>data[s.id]?.content);

  const toc=meta.sections.map(s=>{
    const has=!!data[s.id]?.content;
    return `<li class="${has?"toc-done":"toc-pending"}">${has?"✓":"○"} ${s.label}</li>`;
  }).join("");

  const body=meta.sections.map(s=>{
    const content=data[s.id]?.content;
    if(!content) return `<div class="sec-placeholder"><h2>${s.label}</h2><p class="placeholder-note">Sezione non ancora generata.</p></div>`;
    return `<div class="doc-section"><h2>${s.label}</h2><div class="sec-content">${mdToHtml(content)}</div></div>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>${meta.label} — ${project.name}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Segoe UI',Arial,sans-serif;max-width:900px;margin:0 auto;padding:48px 40px;color:#1A1A2E;background:#fff;line-height:1.7;}
.cover{min-height:280px;display:flex;flex-direction:column;justify-content:center;border-bottom:4px solid #0EA5E9;padding-bottom:40px;margin-bottom:48px;}
.brand{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#0EA5E9;margin-bottom:16px;}
.module-title{font-size:38px;font-weight:800;color:#0F172A;margin-bottom:10px;letter-spacing:-.5px;}
.project-name{font-size:16px;color:#64748B;margin-bottom:4px;}
.doc-date{font-size:13px;color:#94A3B8;}
.stats-row{display:flex;gap:32px;margin-top:28px;}
.stat{text-align:center;}.stat-n{font-size:24px;font-weight:800;color:#0F172A;}.stat-l{font-size:10px;color:#94A3B8;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
.toc-wrap{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:24px 28px;margin-bottom:48px;}
.toc-title{font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748B;margin-bottom:14px;}
.toc-wrap ul{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:6px;}
.toc-wrap li{font-size:13px;color:#475569;padding:3px 0;}
.toc-done{color:#10B981!important;font-weight:500;}
.toc-pending{color:#CBD5E1!important;}
.doc-section{margin-bottom:56px;padding-bottom:40px;border-bottom:1px solid #E2E8F0;}
.doc-section:last-child{border-bottom:none;}
h2{font-size:22px;color:#0F172A;margin:0 0 20px;padding:12px 0 12px 16px;border-left:4px solid #0EA5E9;background:#F0F9FF;border-radius:0 6px 6px 0;}
h3{font-size:16px;color:#334155;margin:20px 0 10px;}
p{margin-bottom:12px;font-size:14px;color:#374151;}
ul{margin:8px 0 16px 20px;}li{margin-bottom:5px;font-size:14px;color:#374151;}
table{border-collapse:collapse;width:100%;margin:16px 0;font-size:13px;}
th,td{border:1px solid #E2E8F0;padding:9px 13px;text-align:left;}
th{background:#F1F5F9;font-weight:700;color:#334155;}
tr:nth-child(even) td{background:#F8FAFC;}
strong{font-weight:700;color:#0F172A;}
hr{border:none;border-top:1px solid #E2E8F0;margin:24px 0;}
.placeholder-note{color:#CBD5E1;font-style:italic;font-size:13px;}
.sec-placeholder h2{background:#F1F5F9;border-color:#CBD5E1;color:#94A3B8;}
.footer{margin-top:60px;padding-top:20px;border-top:2px solid #E2E8F0;display:flex;justify-content:space-between;font-size:11px;color:#94A3B8;}
@media print{
  body{padding:0;max-width:100%;}
  h2{break-before:auto;}
  .doc-section{break-inside:avoid;}
  @page{margin:2cm;size:A4;}
}
</style></head><body>
<div class="cover">
  <div class="brand">Nassa Marketing Studio</div>
  <div class="module-title">${meta.icon} ${meta.label}</div>
  <div class="project-name">${project.name}</div>
  <div class="doc-date">${date}</div>
  <div class="stats-row">
    <div class="stat"><div class="stat-n">${filled.length}</div><div class="stat-l">Sezioni completate</div></div>
    <div class="stat"><div class="stat-n">${meta.sections.length}</div><div class="stat-l">Sezioni totali</div></div>
    <div class="stat"><div class="stat-n">${Math.round(filled.length/meta.sections.length*100)}%</div><div class="stat-l">Avanzamento</div></div>
  </div>
</div>
<div class="toc-wrap">
  <div class="toc-title">Indice sezioni</div>
  <ul>${toc}</ul>
</div>
${body}
<div class="footer">
  <span>Nassa Studio S.r.l.s. — nassastudio.it — Modica (RG)</span>
  <span>${date}</span>
</div>
</body></html>`;
}

function buildModuleMarkdown(module, project){
  const meta=MODULE_META[module]; if(!meta) return "";
  const data=meta.getter(project);
  const date=new Date().toLocaleDateString("it-IT");
  const header=`# ${meta.icon} ${meta.label}\n**${project.name}** · ${date}\n\n---\n\n`;
  const toc=meta.sections.map((s,i)=>`${i+1}. ${s.label}${data[s.id]?.content?" ✓":""}`).join("\n");
  const body=meta.sections.map(s=>{
    const content=data[s.id]?.content;
    return `## ${s.label}\n\n${content||"_Sezione non ancora generata._"}\n\n---\n`;
  }).join("\n");
  return header+"## Indice\n\n"+toc+"\n\n---\n\n"+body;
}

async function buildModulePresentationSlides(module, project){
  const meta=MODULE_META[module]; if(!meta) return "[]";
  const data=meta.getter(project);
  const summary=meta.sections.filter(s=>data[s.id]?.content).map(s=>`### ${s.label}\n${data[s.id].content.slice(0,400)}`).join("\n\n");
  if(!summary.trim()) return `[{"titolo":"${meta.label}","punti":["Nessuna sezione generata"],"tipo":"cover"}]`;
  const prompt=`Crea una presentazione executive di 10-14 slide in italiano per "${meta.label}" di ${project.name}.
Includi: slide di cover con headline, slide per ogni macro-tema chiave, slide con key takeaway.
Rispondi SOLO con array JSON (nessun testo):
[{"titolo":"...","punti":["...","..."],"tipo":"cover|content|data|quote","nota":"..."}]
Punti: max 4 per slide, max 65 caratteri ciascuno.

CONTENUTO ESTRATTO:
${summary.slice(0,4000)}`;
  return await callClaude(prompt, 3000);
}

function ExportModuleBtn({ project, module }){
  const [open,  setOpen]  = useState(false);
  const [state, setState] = useState("idle"); // idle|generating

  if(!MODULE_META[module]) return null;
  const meta=MODULE_META[module];
  const data=meta.getter(project);
  const filled=meta.sections.filter(s=>data[s.id]?.content).length;

  async function dlDoc(){
    setState("generating");
    downloadBlob(`${module}_documento.html`, buildModuleDocHTML(module,project), "text/html;charset=utf-8");
    setState("idle"); setOpen(false);
  }
  async function dlMd(){
    setState("generating");
    downloadBlob(`${module}.md`, buildModuleMarkdown(module,project));
    setState("idle"); setOpen(false);
  }
  async function dlPres(){
    setState("generating");
    try {
      const slidesJson=await buildModulePresentationSlides(module,project);
      downloadBlob(`${module}_presentazione.html`, buildSlideshowHTML(slidesJson,meta.label,project.name), "text/html;charset=utf-8");
    } catch{}
    setState("idle"); setOpen(false);
  }

  return(
    <div className="exp-wrap">
      <button className="btn-outline sm" onClick={()=>setOpen(o=>!o)}>
        {meta.icon} Esporta modulo {filled>0?`(${filled}/${meta.sections.length})`:""}
      </button>
      {open&&(
        <div className="exp-panel" style={{right:0,width:320}}>
          <div className="exp-title">{meta.label}</div>
          {filled===0&&<div className="exp-hint" style={{marginBottom:10}}>⚠️ Nessuna sezione generata. Esporta il documento per vedere lo stato dell'avanzamento.</div>}
          <button className="exp-btn" onClick={dlDoc} disabled={state!=="idle"}>
            <span className="exp-icon">📄</span>
            <div><div className="exp-btn-label">Documento completo HTML</div><div className="exp-btn-sub">Tutte le sezioni · cover page · indice · stampa come PDF o apri in Word</div></div>
          </button>
          <button className="exp-btn" onClick={dlMd} disabled={state!=="idle"}>
            <span className="exp-icon">📝</span>
            <div><div className="exp-btn-label">Markdown completo</div><div className="exp-btn-sub">Tutte le sezioni in formato .md · Notion · Obsidian</div></div>
          </button>
          <button className="exp-btn" onClick={dlPres} disabled={state!=="idle"||filled===0}>
            <span className="exp-icon">🎯</span>
            <div><div className="exp-btn-label">{state==="generating"?"Generazione slide…":"Presentazione executive"}</div><div className="exp-btn-sub">AI struttura 10-14 slide dal modulo completo · slideshow HTML navigabile</div></div>
          </button>
          <div className="exp-divider"/>
          <div className="exp-hint">Per DOCX e PPTX ufficiali con template Nassa → chiedi a Claude di generarli</div>
        </div>
      )}
    </div>
  );
}

// ─── EXPORT PANEL ─────────────────────────────────────────────────────────────
function ExportPanel({ label, content, projectName, secId, onClose }){
  const [genPres,setGenPres]=useState(false);
  const [toast,setToast]=useState("");
  function showToast(m){ setToast(m); setTimeout(()=>setToast(""),2200); }

  function dlMarkdown(){
    const header=`# ${label}\n\n_${new Date().toLocaleDateString("it-IT")} — ${projectName}_\n\n---\n\n`;
    downloadBlob(`${secId}.md`, header+content);
    showToast("Markdown scaricato ✓");
  }

  function dlHTML(){
    downloadBlob(`${secId}.html`, buildDocHTML(label,content,projectName),"text/html;charset=utf-8");
    showToast("Documento HTML scaricato ✓ — aprilo in Chrome o Word");
  }

  async function dlPresentation(){
    setGenPres(true);
    try {
      const slidesJson=await callClaude(buildSlidePrompt(label,content),2000);
      downloadBlob(`${secId}_presentazione.html`,buildSlideshowHTML(slidesJson,label,projectName),"text/html;charset=utf-8");
      showToast("Presentazione scaricata ✓ — aprila nel browser");
    } catch { showToast("Errore generazione — riprova"); }
    setGenPres(false);
  }

  return(
    <div className="exp-panel" onClick={e=>e.stopPropagation()}>
      {toast&&<div className="exp-toast">{toast}</div>}
      <div className="exp-title">Esporta: {label}</div>
      <button className="exp-btn" onClick={dlMarkdown}>
        <span className="exp-icon">📝</span>
        <div><div className="exp-btn-label">Scarica Markdown</div><div className="exp-btn-sub">.md · compatibile con Notion, Obsidian</div></div>
      </button>
      <button className="exp-btn" onClick={dlHTML}>
        <span className="exp-icon">📄</span>
        <div><div className="exp-btn-label">Documento HTML</div><div className="exp-btn-sub">Apribile in Word · stampa come PDF</div></div>
      </button>
      <button className="exp-btn" onClick={dlPresentation} disabled={genPres}>
        <span className="exp-icon">🎯</span>
        <div>
          <div className="exp-btn-label">{genPres?"Generazione in corso…":"Presentazione interattiva"}</div>
          <div className="exp-btn-sub">AI genera slide · slideshow navigabile nel browser</div>
        </div>
      </button>
      <div className="exp-divider"/>
      <div className="exp-hint">Per DOCX e PPTX ufficiali → chiedi a Claude di generarli con i template Nassa</div>
    </div>
  );
}

function Toast({msg}){ return <div className="toast">{msg}</div>; }

// ─── WIZARD ───────────────────────────────────────────────────────────────────
const STEPS = [
  { title:"Anagrafica", fields:[
    {k:"nome",label:"Nome azienda *",ph:"es. Kosmetikal Srl"},
    {k:"settore",label:"Settore / categoria *",ph:"es. Contract manufacturing cosmetico"},
    {k:"anno",label:"Anno fondazione",ph:"es. 2003"},
    {k:"sede",label:"Sede",ph:"es. Pesaro, Marche"},
    {k:"sito",label:"Sito web",ph:"es. kosmetikal.it"},
  ]},
  { title:"Identità", fields:[
    {k:"descrizione",label:"In 2-3 frasi: cosa fa questa azienda? *",ph:"Cosa produce, per chi, come lo fa",multi:true},
    {k:"differenziale",label:"Cosa la rende unica rispetto ai competitor? *",ph:"Il differenziale principale — non un aggettivo, un fatto",multi:true},
    {k:"valori",label:"Valori guida (3-5 parole o frasi)",ph:"es. Verità prima della bellezza · Dati prima delle opinioni"},
  ]},
  { title:"Target", fields:[
    {k:"target",label:"Chi è il cliente ideale? *",ph:"Ruolo, settore, dimensione azienda, bisogno specifico",multi:true},
    {k:"b2x",label:"Modello commerciale",ph:"B2B / B2C / Entrambi — specificare"},
    {k:"mercati",label:"Mercati geografici",ph:"es. Italia · UK · Germania · Francia"},
  ]},
  { title:"Prodotti & Servizi", fields:[
    {k:"prodotti",label:"Principali prodotti o servizi *",ph:"Elenca con una riga di descrizione per ciascuno",multi:true},
    {k:"pricing",label:"Range di prezzo o modello pricing",ph:"es. Retainer 1.200-2.800€/mese · One-shot da 3.000€"},
  ]},
  { title:"Competitor", fields:[
    {k:"competitor",label:"2-3 competitor principali",ph:"es. Cosmoderma · Delta BKB · Reynaldi"},
    {k:"diff_competitor",label:"Come vi differenziate da loro?",ph:"Cosa fate voi che loro non fanno (o non comunicano)",multi:true},
  ]},
  { title:"Canali Attuali", fields:[
    {k:"canali_attuali",label:"Canali digitali attivi",ph:"es. LinkedIn pagina · Instagram · Email newsletter · Blog"},
    {k:"advertising",label:"Advertising attuale",ph:"es. Meta Ads (budget €/mese) · Google Search · nessuno"},
  ]},
  { title:"Obiettivi (12 mesi)", fields:[
    {k:"obiettivo1",label:"Obiettivo primario *",ph:"es. 50 lead qualificati/mese entro dicembre 2026",multi:true},
    {k:"obiettivo2",label:"Obiettivo secondario",ph:"es. 30% lead da mercati esteri"},
    {k:"budget",label:"Budget marketing mensile stimato",ph:"es. €3.000/mese (produzione + Ads)"},
  ]},
  { title:"Sfide", fields:[
    {k:"problema",label:"Problema principale nella comunicazione attuale *",ph:"Cosa non funziona, cosa manca, cosa frustra",multi:true},
    {k:"cosa_non_funziona",label:"Cosa avete già provato senza risultati?",ph:"Campagne, contenuti, strategie che non hanno funzionato"},
  ]},
  { title:"Team & Risorse", fields:[
    {k:"team",label:"Chi gestisce il marketing oggi?",ph:"es. Founder + freelance SMM · agenzia esterna · team interno"},
    {k:"risorse",label:"Strumenti già in uso",ph:"es. Canva · Metricool · HubSpot · nessuno"},
    {k:"note",label:"Note aggiuntive",ph:"Qualsiasi cosa non sia stata coperta sopra",multi:true},
  ]},
];

const STORICA_STEPS = [
  { title:"Origini", fields:[
    {k:"origini",label:"Chi ha fondato l'azienda e perché?",ph:"Il contesto, la motivazione, il momento storico",multi:true},
  ]},
  { title:"Svolte chiave", fields:[
    {k:"svolte",label:"I 2-3 momenti che hanno cambiato l'azienda",ph:"Crisi, pivot, acquisizioni, prodotti che hanno svoltato",multi:true},
  ]},
  { title:"Valori maturati", fields:[
    {k:"valori_maturati",label:"Cosa ha imparato l'azienda in questi anni?",ph:"Valori che vengono dall'esperienza, non dalla brochure",multi:true},
  ]},
];

// ─── EXTRACT PROMPT & REVIEW FIELDS ────────────────────────────────────────────
const REVIEW_FIELDS=[
  {k:"nome",label:"Nome azienda *",ph:"es. Kosmetikal Srl"},
  {k:"settore",label:"Settore *",ph:"es. Contract manufacturing cosmetico"},
  {k:"anno",label:"Anno fondazione",ph:"es. 2003"},
  {k:"sede",label:"Sede",ph:"es. Pesaro, Marche"},
  {k:"sito",label:"Sito web",ph:"es. kosmetikal.it"},
  {k:"descrizione",label:"Cosa fa l'azienda",ph:"",multi:true},
  {k:"differenziale",label:"Differenziale principale",ph:"",multi:true},
  {k:"valori",label:"Valori guida",ph:""},
  {k:"target",label:"Target primario",ph:"",multi:true},
  {k:"b2x",label:"Modello (B2B/B2C)",ph:""},
  {k:"mercati",label:"Mercati geografici",ph:""},
  {k:"prodotti",label:"Prodotti / Servizi",ph:"",multi:true},
  {k:"pricing",label:"Pricing",ph:""},
  {k:"competitor",label:"Competitor",ph:""},
  {k:"diff_competitor",label:"Differenziale vs competitor",ph:"",multi:true},
  {k:"canali_attuali",label:"Canali digitali attuali",ph:""},
  {k:"advertising",label:"Advertising attuale",ph:""},
  {k:"obiettivo1",label:"Obiettivo primario",ph:"",multi:true},
  {k:"obiettivo2",label:"Obiettivo secondario",ph:""},
  {k:"budget",label:"Budget marketing",ph:""},
  {k:"problema",label:"Problema principale",ph:"",multi:true},
  {k:"cosa_non_funziona",label:"Cosa non ha funzionato",ph:""},
  {k:"team",label:"Team marketing",ph:""},
  {k:"risorse",label:"Strumenti in uso",ph:""},
  {k:"note",label:"Note aggiuntive",ph:"",multi:true},
];

const buildExtractPrompt=text=>`Sei un assistente di marketing. Analizza il testo e compila SOLO un oggetto JSON — nessun testo prima o dopo, nessun markdown.
Usa valori BREVI (max 80 caratteri per campo). Stringa vuota "" per i campi non trovati.

Struttura JSON richiesta:
{"nome":"","settore":"","anno":"","sede":"","sito":"","descrizione":"","differenziale":"","valori":"","target":"","b2x":"","mercati":"","prodotti":"","pricing":"","competitor":"","diff_competitor":"","canali_attuali":"","advertising":"","obiettivo1":"","obiettivo2":"","budget":"","problema":"","cosa_non_funziona":"","team":"","risorse":"","note":""}

TESTO DA ANALIZZARE:
${text.slice(0,5000)}`;

function ReviewForm({data,onComplete,onBack}){
  const [f,setF]=useState({...data});
  function set(k,v){setF(p=>({...p,[k]:v}));}
  return(
    <div className="wiz-wrap">
      <div className="wiz-inner wiz-wide">
        <div className="wiz-brand">NASSA MARKETING STUDIO</div>
        <div className="wiz-title">✅ Verifica le informazioni estratte</div>
        <div className="review-notice">L'AI ha estratto i dati dal documento. Controlla ogni campo e correggi prima di creare il progetto.</div>
        <div className="review-grid">
          {REVIEW_FIELDS.map(field=>(
            <div key={field.k} className={`fg${field.multi?" review-full":""}`}>
              <label className="lbl">{field.label}</label>
              {field.multi
                ?<textarea className="txta" rows={2} placeholder={field.ph} value={f[field.k]||""} onChange={e=>set(field.k,e.target.value)}/>
                :<input className="inp" placeholder={field.ph} value={f[field.k]||""} onChange={e=>set(field.k,e.target.value)}/>
              }
            </div>
          ))}
        </div>
        <div className="wiz-actions" style={{marginTop:20}}>
          <button className="btn-ghost" onClick={onBack}>← Torna all'estrazione</button>
          <button className="btn-primary" onClick={()=>onComplete(f)} disabled={!f.nome?.trim()}>Crea Progetto →</button>
        </div>
      </div>
    </div>
  );
}

function BriefExtractor({onComplete,onBack,initialText}){
  const [text,setText]=useState(initialText||"");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [extracted,setExtracted]=useState(null);
  async function extract(){
    if(!text.trim()) return;
    setLoading(true); setError("");
    try {
      const raw=await callClaude(buildExtractPrompt(text), 2500);
      // Strip markdown fences
      const clean=raw.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
      const match=clean.match(/\{[\s\S]*\}/);
      if(!match) throw new Error("L'AI non ha restituito JSON. Riprova — a volte serve un testo più strutturato.");
      let data;
      try { data=JSON.parse(match[0]); }
      catch { try { data=JSON.parse(match[0]+"}"); } catch { throw new Error("Risposta troncata — riprova. Se il problema persiste, accorcia il testo incollato."); } }
      setExtracted(data);
    } catch(e){ setError("Errore: "+e.message); }
    setLoading(false);
  }
  if(extracted) return <ReviewForm data={extracted} onComplete={onComplete} onBack={()=>setExtracted(null)}/>;
  return(
    <div className="wiz-wrap">
      <div className="wiz-inner wiz-wide">
        <button className="btn-ghost sm" style={{marginBottom:12}} onClick={onBack}>← Scegli metodo</button>
        <div className="wiz-brand">NASSA MARKETING STUDIO</div>
        <div className="wiz-title">✦ Incolla il brief</div>
        <div style={{fontSize:12,color:"var(--ink4)",marginBottom:12,lineHeight:1.6}}>Incolla qualsiasi documento: brief cliente, appunti dell'intervista, email, note, documento Word... L'AI estrae automaticamente tutte le informazioni del progetto.</div>
        <textarea className="txta" rows={16}
          placeholder={"Incolla qui il brief, le note, il documento del cliente...\n\nEsempio:\nNome: Kosmetikal Srl\nSettore: contract manufacturing cosmetico\nObiettivo: aumentare i lead qualificati da 3 a 10/mese entro dic 2026\nCompetitor: Cosmoderma, Delta BKB\nBudget: €3.000/mese\n..."}
          value={text} onChange={e=>setText(e.target.value)}/>
        {text.trim()&&<div style={{fontSize:10,color:"var(--ink5)",marginTop:4}}>{text.length} caratteri</div>}
        {error&&<div className="extract-error">{error}</div>}
        <div className="wiz-actions">
          {loading?<div className="gen-row"><div className="spin"/>Elaborazione AI in corso…</div>
           :<button className="btn-primary" onClick={extract} disabled={!text.trim()}>✦ Elabora con AI →</button>}
        </div>
      </div>
    </div>
  );
}

function DriveExtractor({onComplete,onBack}){
  const [url,setUrl]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [fallbackText,setFallbackText]=useState("");
  const [showFallback,setShowFallback]=useState(false);
  const [fetchedText,setFetchedText]=useState(null);

  async function fetchDoc(){
    if(!url.trim()) return;
    setLoading(true); setError(""); setShowFallback(false);
    let finalUrl=url.trim();
    if(finalUrl.includes("dropbox.com")){
      finalUrl=finalUrl
        .replace("www.dropbox.com","dl.dropboxusercontent.com")
        .replace(/[?&]dl=0/,"");
      finalUrl+=(finalUrl.includes("?")?"&":"?")+"raw=1";
    }
    if(finalUrl.includes("docs.google.com/document")){
      const m=finalUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if(m) finalUrl=`https://docs.google.com/document/d/${m[1]}/export?format=txt`;
    }
    if(finalUrl.includes("drive.google.com/file")){
      const m=finalUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if(m) finalUrl=`https://drive.google.com/uc?export=download&id=${m[1]}`;
    }
    try {
      const r=await fetch(finalUrl);
      if(!r.ok) throw new Error("HTTP "+r.status);
      const t=await r.text();
      if(t.length<30) throw new Error("Documento vuoto");
      setFetchedText(t);
    } catch(e){
      setError("Impossibile leggere il file direttamente (CORS o file non pubblico). Apri il documento, copia il contenuto e incollalo nel campo qui sotto.");
      setShowFallback(true);
    }
    setLoading(false);
  }

  if(fetchedText) return <BriefExtractor onComplete={onComplete} onBack={()=>setFetchedText(null)} initialText={fetchedText}/>;

  return(
    <div className="wiz-wrap">
      <div className="wiz-inner wiz-wide">
        <button className="btn-ghost sm" style={{marginBottom:12}} onClick={onBack}>← Scegli metodo</button>
        <div className="wiz-brand">NASSA MARKETING STUDIO</div>
        <div className="wiz-title">🔗 Da Dropbox o Google Drive</div>
        <div style={{fontSize:12,color:"var(--ink4)",marginBottom:16,lineHeight:1.6}}>Incolla il link a un documento condiviso. L'AI lo legge ed estrae il contesto del progetto.</div>
        <div className="fg" style={{marginBottom:12}}>
          <label className="lbl">URL documento</label>
          <input className="inp" placeholder="https://www.dropbox.com/s/... oppure https://docs.google.com/document/d/..." value={url} onChange={e=>setUrl(e.target.value)}/>
        </div>
        <div className="extract-hints">
          <div>📦 <strong>Dropbox:</strong> File → Condividi → Copia link (accesso "Chiunque con il link")</div>
          <div>📄 <strong>Google Doc:</strong> File → Condividi → "Chiunque con il link può visualizzare"</div>
          <div>📋 <strong>Dropbox Paper / Notion:</strong> esporta in .docx o copia il testo e usa "Incolla brief"</div>
        </div>
        {error&&(
          <div className="extract-error" style={{marginTop:12}}>
            <div>{error}</div>
            {showFallback&&(
              <div style={{marginTop:12}}>
                <label className="lbl" style={{marginBottom:6,display:"block"}}>Incolla qui il contenuto del documento:</label>
                <textarea className="txta" rows={10} placeholder="Copia e incolla il testo del documento..." value={fallbackText} onChange={e=>setFallbackText(e.target.value)}/>
              </div>
            )}
          </div>
        )}
        <div className="wiz-actions">
          {loading?<div className="gen-row"><div className="spin"/>Lettura documento…</div>
           :showFallback
             ?<button className="btn-primary" onClick={()=>setFetchedText(fallbackText)} disabled={!fallbackText.trim()}>✦ Elabora testo incollato →</button>
             :<button className="btn-primary" onClick={fetchDoc} disabled={!url.trim()}>🔗 Carica ed Elabora →</button>
          }
        </div>
      </div>
    </div>
  );
}

function WizardView({onComplete}){
  const [mode,setMode]=useState(null);
  if(mode==="brief") return <BriefExtractor onComplete={onComplete} onBack={()=>setMode(null)}/>;
  if(mode==="drive") return <DriveExtractor onComplete={onComplete} onBack={()=>setMode(null)}/>;
  if(mode==="manuale") return <ManualWizard onComplete={onComplete} onBack={()=>setMode(null)}/>;
  return(
    <div className="wiz-wrap">
      <div className="wiz-inner">
        <div className="wiz-brand">NASSA MARKETING STUDIO</div>
        <div className="wiz-title">Nuovo progetto</div>
        <div style={{fontSize:12,color:"var(--ink4)",marginBottom:28,textAlign:"center"}}>Come vuoi inserire le informazioni del progetto?</div>
        <div className="wiz-modes">
          <div className="wiz-mode-card" onClick={()=>setMode("manuale")}>
            <div className="wiz-mode-icon">📝</div>
            <div className="wiz-mode-title">Compila manualmente</div>
            <div className="wiz-mode-desc">9 step guidati, campo per campo. Il modo più preciso per strutturare le informazioni fin dall'inizio.</div>
          </div>
          <div className="wiz-mode-card" onClick={()=>setMode("brief")}>
            <div className="wiz-mode-icon">✦</div>
            <div className="wiz-mode-title">Incolla un brief</div>
            <div className="wiz-mode-desc">Incolla testo libero — email, appunti, documento, trascrizione intervista. L'AI estrae tutte le informazioni.</div>
          </div>
          <div className="wiz-mode-card" onClick={()=>setMode("drive")}>
            <div className="wiz-mode-icon">🔗</div>
            <div className="wiz-mode-title">Dropbox o Google Drive</div>
            <div className="wiz-mode-desc">Incolla il link a un documento condiviso su Dropbox o Google Drive. L'AI lo legge e crea il progetto.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManualWizard({onComplete,onBack}){
  const [step,setStep]=useState(0);
  const [storica,setStorica]=useState(false);
  const [data,setData]=useState({});
  const allSteps=[...STEPS,...(storica?STORICA_STEPS:[])];
  const cur=allSteps[step];
  const isLast=step===allSteps.length-1;
  const progress=Math.round(((step+1)/allSteps.length)*100);
  function set(k,v){setData(d=>({...d,[k]:v}));}
  function next(){if(isLast){onComplete(data);}else setStep(s=>s+1);}
  function canNext(){return cur.fields.filter(f=>f.label.includes("*")).every(f=>data[f.k]?.trim());}
  return(
    <div className="wiz-wrap">
      <div className="wiz-inner">
        <div className="wiz-brand">NASSA MARKETING STUDIO</div>
        <div className="wiz-title">Nuovo progetto</div>
        <div className="wiz-progress-wrap">
          <div className="wiz-progress-bar"><div className="wiz-progress-fill" style={{width:progress+"%"}}/></div>
          <div className="wiz-progress-txt">{step+1} / {allSteps.length}</div>
        </div>
        <div className="wiz-step">
          <div className="wiz-step-num">Step {step+1}</div>
          <div className="wiz-step-title">{cur.title}</div>
          {step===0&&(
            <div className="wiz-storica-toggle">
              <label className="wiz-check-label">
                <input type="checkbox" checked={storica} onChange={e=>setStorica(e.target.checked)}/>
                <span>Azienda con più di 15 anni di storia — aggiungi sezione storica (Origini, Svolte, Valori)</span>
              </label>
            </div>
          )}
          <div className="wiz-fields">
            {cur.fields.map(f=>(
              <div key={f.k} className="fg">
                <label className="lbl">{f.label}</label>
                {f.multi
                  ?<textarea className="txta" rows={3} placeholder={f.ph} value={data[f.k]||""} onChange={e=>set(f.k,e.target.value)}/>
                  :<input className="inp" placeholder={f.ph} value={data[f.k]||""} onChange={e=>set(f.k,e.target.value)}/>
                }
              </div>
            ))}
          </div>
          <div className="wiz-actions">
            <button className="btn-ghost" onClick={step===0?onBack:()=>setStep(s=>s-1)}>← {step===0?"Scegli metodo":"Indietro"}</button>
            <button className="btn-primary" onClick={next} disabled={!canNext()}>{isLast?"Crea Progetto →":"Avanti →"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION CONTENT ──────────────────────────────────────────────────────────
function SectionContent({project, module, secId, onUpdate}){
  const sections = module==="pdm" ? SECTIONS_PDM : SECTIONS_PDC;
  const P = module==="pdm" ? P_PDM : P_PDC;
  const COLORS = module==="pdm" ? COLORS_PDM : COLORS_PDC;
  const curSec = sections.find(s=>s.id===secId);
  const secData = (module==="pdm"?project.pdm:project.pdc)?.sections?.[secId];
  const content = secData?.content||"";
  const versions = secData?.versions||[];

  const [generating,setGenerating]=useState(false);
  const [editing,setEditing]=useState(false);
  const [editText,setEditText]=useState("");
  const [showVer,setShowVer]=useState(false);
  const [toast,setToast]=useState("");
  const [showExport,setShowExport]=useState(false);

  const gc = COLORS[curSec?.group]||"#0EA5E9";

  function showToast(m){ setToast(m); setTimeout(()=>setToast(""),2200); }

  function updateSec(text){
    const prev = (module==="pdm"?project.pdm:project.pdc)||{sections:{}};
    const existing = prev.sections?.[secId]||{};
    const newVersions = text && existing.content ? [...(existing.versions||[]),{text:existing.content,ts:Date.now()}].slice(-5) : (existing.versions||[]);
    const newSecs = {...prev.sections, [secId]:{content:text, versions:newVersions}};
    const updated = module==="pdm"
      ? {...project, pdm:{...prev, sections:newSecs}}
      : {...project, pdc:{...prev, sections:newSecs}};
    onUpdate(updated);
  }

  async function generate(){
    if(!P[secId]) return;
    setGenerating(true);
    try {
      const ctx = buildCtx(project.interview||{})+(project.context||"");
      const pdmCtx=Object.entries(project.pdm?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,150)||""}`).join("\n");
      const pdcCtx=Object.entries(project.pdc?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,150)||""}`).join("\n");
      const richCtx=ctx+(pdmCtx?"\n\n## Marketing estratto:\n"+pdmCtx:"")+(pdcCtx?"\n\n## Comunicazione estratta:\n"+pdcCtx:"");
      const text = await callClaude(P[secId](richCtx));
      updateSec(text);
      showToast("Generato ✓");
    } catch(e){ showToast("Errore — riprova"); }
    setGenerating(false);
  }

  function startEdit(){ setEditText(content); setEditing(true); setShowVer(false); }
  function saveEdit(){ updateSec(editText); setEditing(false); showToast("Salvato ✓"); }
  function cancelEdit(){ setEditing(false); }

  function restoreVersion(v){
    updateSec(v.text);
    setShowVer(false);
    showToast("Versione ripristinata ✓");
  }

  const hasContent = !!content;

  return(
    <div className="sec-body">
      {toast&&<Toast msg={toast}/>}

      <div className="sec-body-hdr">
        <div className="sec-body-title" style={{borderLeft:`3px solid ${gc}`,paddingLeft:12}}>
          {curSec?.label}
        </div>
        <div className="sec-acts">
          {hasContent&&!editing&&(
            <>
              <button className="btn-outline sm" onClick={startEdit}>Modifica</button>
              {versions.length>0&&(
                <button className="btn-ghost sm" onClick={()=>setShowVer(v=>!v)}>
                  {showVer?"Chiudi":"Versioni ("+versions.length+")"}
                </button>
              )}
            </>
          )}
          {editing&&(
            <>
              <button className="btn-primary sm" onClick={saveEdit}>Salva</button>
              <button className="btn-ghost sm" onClick={cancelEdit}>Annulla</button>
            </>
          )}
          {P[secId]&&<button className="btn-primary sm" onClick={generate} disabled={generating}>{generating?"...":"Genera"}</button>}
          {hasContent&&<div className="exp-wrap"><button className="btn-ghost sm" onClick={()=>setShowExport(e=>!e)}>↓ Esporta</button>{showExport&&<ExportPanel label={curSec?.label||secId} content={content} projectName={project.name||"Progetto"} secId={secId} onClose={()=>setShowExport(false)}/>}</div>}
        </div>
      </div>

      <div className="sec-content">
        {showVer&&versions.length>0&&(
          <div className="vpanel">
            <div className="vpanel-head"><span className="vpanel-title">Versioni precedenti</span></div>
            {versions.map((v,i)=>(
              <div key={i} className="vitem">
                <div className="vitem-meta"><span className="vdate">{new Date(v.ts).toLocaleDateString("it-IT")}</span></div>
                <div className="vpreview">{v.text.slice(0,120)}…</div>
                <button className="btn-ghost sm" onClick={()=>restoreVersion(v)}>Ripristina</button>
              </div>
            ))}
          </div>
        )}

        {editing
          ? <textarea className="edit-txta" value={editText} onChange={e=>setEditText(e.target.value)}/>
          : hasContent
            ? <div className="md-out" dangerouslySetInnerHTML={{__html:renderMd(content)}}/>
            : !generating&&(
                <div className="sec-empty">
                  <div className="se-glyph" style={{color:gc}}>{curSec?.icon}</div>
                  <div className="se-msg">Sezione non ancora generata</div>
                  {P[secId]&&<button className="btn-primary" onClick={generate}>Genera →</button>}
                </div>
              )
        }
        {generating&&<div className="gen-row"><div className="spin"/>Generazione in corso…</div>}
      </div>
    </div>
  );
}

// ─── PROJECT VIEW ─────────────────────────────────────────────────────────────
function ProjectView({project, onUpdate, onBack, globalMeta}){
  const [module,setModule]=useState("overview"); // overview | pdm | pdc | ed
  const sections = module==="pdm" ? SECTIONS_PDM : module==="pdc" ? SECTIONS_PDC : SECTIONS_ED;
  const groups   = module==="pdm" ? GROUPS_PDM   : module==="pdc" ? GROUPS_PDC   : GROUPS_ED;
  const COLORS   = module==="pdm" ? COLORS_PDM   : module==="pdc" ? COLORS_PDC   : COLORS_ED;

  const [group,setGroup]=useState(groups[0]);
  const [sec,setSec]=useState(sections[0].id);
  const [genAll,setGenAll]=useState(false);
  const [toast,setToast]=useState("");

  function showToast(m){ setToast(m); setTimeout(()=>setToast(""),2200); }

  // Sync sec when module or group changes
  useEffect(()=>{
    const first = sections.find(s=>s.group===group);
    if(first) setSec(first.id);
  },[module,group]);

  useEffect(()=>{
    if(!groups.includes(group)) setGroup(groups[0]);
  },[module]);

  const groupSecs = sections.filter(s=>s.group===group);
  const P = module==="pdm" ? P_PDM : module==="ed" ? P_ED : P_PDC;

  async function generateAll(){
    setGenAll(true);
    const ctx = buildCtx(project.interview||{});
    const pdmCtx = Object.entries(project.pdm?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,200)||""}`).join("\n");
    const pdcCtx = Object.entries(project.pdc?.sections||{}).map(([k,v])=>`[${k}]\n${v.content?.slice(0,200)||""}`).join("\n");
    const fullCtx = module==="ed" ? ctx+"\n\n## Marketing:\n"+pdmCtx+"\n\n## Comunicazione:\n"+pdcCtx : ctx;
    const P = module==="pdm" ? P_PDM : module==="pdc" ? P_PDC : P_ED;
    const ids = sections.map(s=>s.id).filter(id=>!!P[id]);
    for(const id of ids){
      const existing = module==="pdm" ? project.pdm?.sections?.[id]?.content
                     : module==="pdc" ? project.pdc?.sections?.[id]?.content
                     : project.ed?.sections?.[id]?.content;
      if(existing) continue;
      try {
        const prevLog=(project.ed?.perfLogs||[]).slice(-1)[0];
        const text = await callClaude(P[id](fullCtx, prevLog?.note));
        if(module==="pdm"){
          const prev=project.pdm||{sections:{}};
          project={...project,pdm:{...prev,sections:{...prev.sections,[id]:{content:text,versions:[]}}}};
        } else if(module==="pdc"){
          const prev=project.pdc||{sections:{}};
          project={...project,pdc:{...prev,sections:{...prev.sections,[id]:{content:text,versions:[]}}}};
        } else {
          const prev=project.ed||{sections:{}};
          project={...project,ed:{...prev,sections:{...prev.sections,[id]:{content:text,versions:[]}}}};
        }
        onUpdate(project);
      } catch{}
    }
    setGenAll(false);
    showToast("Generazione completa ✓");
  }

  // Count filled sections
  const pdmFilled = SECTIONS_PDM.filter(s=>project.pdm?.sections?.[s.id]?.content).length;
  const pdcFilled = SECTIONS_PDC.filter(s=>project.pdc?.sections?.[s.id]?.content).length;
  const edFilled  = SECTIONS_ED.filter(s=>!ED_SPECIAL.includes(s.id)&&project.ed?.sections?.[s.id]?.content).length;

  return(
    <div className="proj-view">
      {toast&&<Toast msg={toast}/>}

      {/* TOP BAR */}
      <div className="pv-topbar">
        <button className="pv-back" onClick={onBack}>← Progetti</button>
        <div className="pv-name">{project.name}</div>
        <div className="pv-actions">
          {module!=="overview"&&<ExportModuleBtn project={project} module={module}/>}
          {genAll
            ? <div className="gen-row"><div className="spin"/>Generazione in corso…</div>
            : module!=="overview"&&<button className="btn-outline sm" onClick={generateAll}>Genera tutto</button>
          }
        </div>
      </div>

      {/* MODULE SWITCHER */}
      <div className="module-sw">
        <button className={`module-btn ${module==="overview"?"active":""}`} onClick={()=>setModule("overview")}>
          <span className="mb-icon">🏠</span>Overview
        </button>
        <button className={`module-btn ${module==="pdm"?"active":""}`} onClick={()=>setModule("pdm")}>
          <span className="mb-icon">📊</span>Piano di Marketing
          <span className="mb-badge" style={module==="pdm"?{background:"#EFF8FF",color:"#0EA5E9"}:{}}>{pdmFilled}/{SECTIONS_PDM.length}</span>
        </button>
        <button className={`module-btn ${module==="pdc"?"active":""}`} onClick={()=>setModule("pdc")}>
          <span className="mb-icon">📣</span>Piano di Comunicazione
          <span className="mb-badge" style={module==="pdc"?{background:"#F5F3FF",color:"#8B5CF6"}:{}}>{pdcFilled}/{SECTIONS_PDC.length}</span>
        </button>
        <button className={`module-btn ${module==="ed"?"active":""}`} onClick={()=>setModule("ed")}>
          <span className="mb-icon">✏️</span>Editoriale
          <span className="mb-badge" style={module==="ed"?{background:"#ECFDF5",color:"#10B981"}:{}}>{edFilled}/{SECTIONS_ED.filter(s=>!ED_SPECIAL.includes(s.id)).length}</span>
        </button>
      </div>

      {/* OVERVIEW */}
      {module==="overview"&&(
        <div style={{flex:1,overflow:"auto"}}>
          <ProjectOverview project={project} onUpdate={onUpdate} onGoToModule={setModule}/>
        </div>
      )}

      {/* GROUP TABS — nascosti in overview */}
      {module!=="overview"&&(
      <div className="group-tabs">
        {groups.map(g=>{
          const done = module==="ed"
            ? sections.filter(s=>s.group===g&&!ED_SPECIAL.includes(s.id)&&project.ed?.sections?.[s.id]?.content).length
            : sections.filter(s=>s.group===g&&(module==="pdm"?project.pdm:project.pdc)?.sections?.[s.id]?.content).length;
          const tot = module==="ed"
            ? sections.filter(s=>s.group===g&&!ED_SPECIAL.includes(s.id)).length
            : sections.filter(s=>s.group===g).length;
          const active = group===g;
          const gc = COLORS[g]||"#0EA5E9";
          return(
            <div key={g} className={`gtab ${active?"active":""}`}
              style={active?{color:gc,borderBottomColor:gc}:{}}
              onClick={()=>setGroup(g)}>
              {g}
              <span className="gtab-cnt" style={active?{background:gc+"18",color:gc}:{}}>{done}/{tot}</span>
            </div>
          );
        })}
      </div>
      )}

      {/* SECTION TABS — nascosti in overview */}
      {module!=="overview"&&(
      <div className="sec-tabs">
        {groupSecs.map(s=>{
          const filled = module==="ed"
            ? !!(ED_SPECIAL.includes(s.id) ? true : project.ed?.sections?.[s.id]?.content)
            : !!(module==="pdm"?project.pdm:project.pdc)?.sections?.[s.id]?.content;
          const isActive = sec===s.id;
          const gc = COLORS[s.group]||"#0EA5E9";
          return(
            <button key={s.id} className={`sec-tab ${isActive?"active":""} ${filled?"has":""}`}
              style={isActive?{color:gc,borderBottomColor:gc}:{}}
              onClick={()=>setSec(s.id)}>
              {filled&&<span className="tab-dot" style={{background:gc}}/>}
              {s.icon} {s.label}
            </button>
          );
        })}
      </div>
      )}

      {/* SECTION CONTENT — nascosto in overview */}
      {module!=="overview"&&(
        module==="ed"
          ? <EdSectionContent key={"ed-"+sec} project={project} secId={sec} onUpdate={onUpdate} globalMeta={globalMeta}/>
          : <SectionContent   key={module+"-"+sec} project={project} module={module} secId={sec} onUpdate={onUpdate}/>
      )}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({projects, onSelect, onNew}){
  return(
    <div className="dashboard">
      <div className="dash-hero">
        <div className="dash-label">Nassa Marketing Studio</div>
        <div className="dash-h1">Piano Marketing & Comunicazione</div>
        <div className="dash-p">Strategia annuale in due moduli: Piano di Marketing + Piano di Comunicazione.</div>
      </div>

      {projects.length===0?(
        <div className="dash-empty">
          <div className="dash-glyph">◈</div>
          <div className="dash-msg">Nessun progetto. Crea il primo progetto con l'intervista guidata.</div>
          <button className="btn-primary" onClick={onNew}>+ Nuovo Progetto</button>
        </div>
      ):(
        <>
          <div className="dash-grid">
            {projects.map(p=>{
              const pdmF=SECTIONS_PDM.filter(s=>p.pdm?.sections?.[s.id]?.content).length;
              const pdcF=SECTIONS_PDC.filter(s=>p.pdc?.sections?.[s.id]?.content).length;
              const tot=SECTIONS_PDM.length+SECTIONS_PDC.length;
              const done=pdmF+pdcF;
              const pct=Math.round((done/tot)*100);
              return(
                <div key={p.id} className="dash-card" onClick={()=>onSelect(p.id)}>
                  <div className="dc-top">
                    <div className="dc-glyph">◈</div>
                    <div className="dc-pct">{pct}%</div>
                  </div>
                  <div className="dc-name">{p.name}</div>
                  <div className="dc-date">{p.interview?.settore||"—"} · {new Date(p.createdAt).toLocaleDateString("it-IT")}</div>
                  <div className="dc-bar"><div className="dc-fill" style={{width:pct+"%"}}/></div>
                  <div className="dc-modules">
                    <span className="dc-mod pdm">{pdmF}/{SECTIONS_PDM.length} PdM</span>
                    <span className="dc-mod pdc">{pdcF}/{SECTIONS_PDC.length} PdC</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
// ── URL hash routing helpers ──────────────────────────────────────────────────
function parseHash(){
  const h=(window.location.hash||"").replace(/^#\/?/,"");
  if(!h||h==="dashboard") return {view:"dashboard",id:null};
  const parts=h.split("/"); return {view:parts[0]||"dashboard",id:parts[1]||null};
}
function pushHash(view,id){
  const h=id?`#/${view}/${id}`:`#/${view}`;
  if(window.location.hash!==h) window.history.pushState(null,"",h);
}

export default function App(){
  const [projects,setProjects]=useState([]);
  const [clients, setClients] =useState([]);
  const [activeId,setActiveId]=useState(null);
  const [activeClientId,setActiveClientId]=useState(null);
  const [expandedClients,setExpandedClients]=useState([]);
  const [view,setView]=useState(()=>parseHash().view||"dashboard");
  const [loaded,setLoaded]=useState(false);
  const [globalMeta,setGlobalMeta]=useState(null);

  // Back/forward browser buttons
  useEffect(()=>{
    function onPop(){
      const {view:v,id}=parseHash();
      setView(v);
      if(v==="project"&&id) setActiveId(id);
      if(v==="client"&&id) setActiveClientId(id);
    }
    window.addEventListener("popstate",onPop);
    return ()=>window.removeEventListener("popstate",onPop);
  },[]);

  function navigate(v,id){ setView(v); pushHash(v,id); }

  useEffect(()=>{
    load().then(async d=>{
      const gm=await loadGlobalMeta(); setGlobalMeta(gm);
      if(d&&(d.projects?.length>0||d.clients?.length>0)){
        setProjects(d.projects||[]); setClients(d.clients||[]);
        const {view:urlView,id:urlId}=parseHash();
        if(urlView==="project"&&urlId){ setActiveId(urlId); }
        else if(d.activeId){ setActiveId(d.activeId); }
      } else {
        const {client,project}=createKosmetikal();
        setProjects([project]); setClients([client]);
        setActiveId(project.id); setActiveClientId(client.id);
        setExpandedClients([client.id]);
        save({projects:[project],clients:[client],activeId:project.id});
        navigate("project",project.id);
      }
      setLoaded(true);
    });
  },[]);

  async function persist(ps,cs,aid){
    setProjects(ps); setClients(cs);
    if(aid!==undefined) setActiveId(aid);
    await save({projects:ps,clients:cs,activeId:aid??activeId});
  }
  async function handleMetaChange(m){ setGlobalMeta(m); await saveGlobalMeta(m); }
  async function handleUpdate(updated){ const ps=projects.map(p=>p.id===updated.id?updated:p); await persist(ps,clients,activeId); }
  async function handleClientUpdate(upd){ const cs=clients.map(c=>c.id===upd.id?upd:c); setClients(cs); await save({projects,clients:cs,activeId}); }

  function handleSelect(id){
    setActiveId(id);
    const proj=projects.find(p=>p.id===id);
    if(proj?.clientId) setActiveClientId(proj.clientId);
    navigate("project",id);
    persist(projects,clients,id);
  }
  function handleBack(){ navigate("dashboard"); persist(projects,clients,null); }
  function toggleExpand(id){ setExpandedClients(ex=>ex.includes(id)?ex.filter(e=>e!==id):[...ex,id]); }
  function openClient(id){ setActiveClientId(id); navigate("client",id); }
  function openPortal(id){ setActiveClientId(id); navigate("portal",id); }

  function handleWizardComplete(iv){
    const name=iv.nome||(iv.settore?`Piano ${iv.settore}`:("Progetto "+new Date().toLocaleDateString("it-IT")));
    const proj={id:uid(),clientId:activeClientId||null,name,createdAt:Date.now(),interview:iv,context:buildCtx(iv),pdm:{sections:{}},pdc:{sections:{}},ed:{sections:{},contentItems:[],campagne:[],calendarEvents:[],perfLogs:[],feedItems:[]},tasks:[],milestones:[],budget:{produzione:[],ads:{linkedin:0,google:0,meta:0,altri:0},note:""}};
    const ps=[...projects,proj];
    const cs=clients.map(c=>c.id===activeClientId?{...c,projectIds:[...(c.projectIds||[]),proj.id]}:c);
    persist(ps,cs,proj.id); setActiveId(proj.id); navigate("project",proj.id);
  }
  function addProjectToClient(cid){ setActiveClientId(cid); navigate("wizard"); }
  function addNewClient(){ const c=emptyClient(); const cs=[...clients,c]; setClients(cs); save({projects,clients:cs,activeId}); setActiveClientId(c.id); setExpandedClients(ex=>[...ex,c.id]); navigate("client",c.id); }

  const activeProj   = projects.find(p=>p.id===activeId);
  const activeClient = clients.find(c=>c.id===activeClientId);
  const activeProjClient = clients.find(c=>c.id===activeProj?.clientId);
  const effectiveMeta = activeProjClient?.meta || activeClient?.meta || null;

  if(!loaded) return <div className="app"><div className="loading">Caricamento…</div></div>;

  return(
    <div className="app">
      <style>{CSS}</style>

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-top">
          <div className="logo"><div className="logo-glyph">◈</div><div><div className="logo-name">NASSA</div><div className="logo-sub">Marketing Studio</div></div></div>
          <button className="new-btn" onClick={addNewClient}>+ Nuovo Cliente</button>
        </div>

        <div className="sb-label">Clienti</div>
        <div className="proj-list">
          {clients.length===0&&<div className="sb-empty">Nessun cliente. Aggiungine uno.</div>}
          {clients.map(client=>{
            const clientProjs=projects.filter(p=>p.clientId===client.id);
            const isExp=expandedClients.includes(client.id);
            const isClientActive=activeClientId===client.id&&(view==="client"||view==="portal");
            return(
              <div key={client.id} className="sb-client-group">
                <div className={`sb-client-row ${isClientActive?"sb-client-active":""}`}>
                  <button className="sb-chevron-btn" onClick={()=>toggleExpand(client.id)}>{isExp?"▼":"▶"}</button>
                  <div className="sb-client-name" onClick={()=>openClient(client.id)}>{client.nome}</div>
                  <button className="sb-icon-btn" title="Impostazioni cliente" onClick={()=>openClient(client.id)}>⚙</button>
                  <button className="sb-icon-btn" title="Nuovo progetto" onClick={()=>addProjectToClient(client.id)}>+</button>
                </div>
                {isExp&&clientProjs.map(p=>(
                  <div key={p.id} className={`sb-proj-row ${activeId===p.id&&view==="project"?"active":""}`}
                    onClick={()=>handleSelect(p.id)}>
                    <span className="sb-proj-dot"/>
                    <span className="sb-proj-name">{p.name}</span>
                  </div>
                ))}
                {isExp&&clientProjs.length===0&&(
                  <div className="sb-proj-empty" onClick={()=>addProjectToClient(client.id)}>+ Aggiungi progetto</div>
                )}
              </div>
            );
          })}
          {/* Progetti senza cliente (backward compat) */}
          {projects.filter(p=>!p.clientId).map(p=>(
            <div key={p.id} className={`proj-row ${activeId===p.id&&view==="project"?"active":""}`} onClick={()=>handleSelect(p.id)}>
              <div className="pr-name">{p.name}</div>
              <div className="pr-date">Nessun cliente</div>
            </div>
          ))}
        </div>

        <div className="sb-bottom">
          <GlobalMetaConnect globalMeta={effectiveMeta} onMetaChange={handleMetaChange}/>
          <button className={`sb-planner-btn ${view==="planner"?"active":""}`} onClick={()=>navigate("planner")}>🗓️ Team Planner</button>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        {view==="wizard"&&<WizardView onComplete={handleWizardComplete}/>}
        {view==="dashboard"&&(
          <Dashboard projects={projects} onSelect={handleSelect} onNew={addNewClient}/>
        )}
        {view==="client"&&activeClient&&(
          <ClientSettingsView
            client={activeClient}
            globalMeta={effectiveMeta}
            projects={projects}
            onUpdate={handleClientUpdate}
            onAddProject={addProjectToClient}
            onSelectProject={handleSelect}
            onClose={handleBack}
          />
        )}
        {view==="portal"&&activeClient&&(
          <ClientPortalPreview client={activeClient} projects={projects} onBack={()=>navigate("client",activeClientId)} onUpdateProject={handleUpdate}/>
        )}
        {view==="planner"&&(
          <div className="planner-view">
            <div className="pv-topbar"><button className="pv-back" onClick={()=>navigate("dashboard")}>← Clienti</button><div className="pv-name">Team Planner</div></div>
            <div style={{flex:1,overflow:"auto",padding:"20px 32px"}}><TeamPlannerNMS projects={projects}/></div>
          </div>
        )}
        {view==="project"&&activeProj&&(
          <ProjectView project={activeProj} onUpdate={handleUpdate} onBack={handleBack} globalMeta={effectiveMeta}/>
        )}
      </div>
    </div>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
:root{
  --bg:#F5F7FA;--bg1:#EFF2F7;--bg2:#E2E8F0;
  --white:#FFFFFF;--ink:#0F172A;--ink2:#1E293B;--ink3:#475569;--ink4:#94A3B8;--ink5:#CBD5E1;
  --gold:#0EA5E9;--gold-bg:#EFF8FF;
  --ok:#10B981;--warn:#F59E0B;--err:#EF4444;
  --border:#E2E8F0;--border2:#CBD5E1;
  --shadow:0 1px 3px rgba(15,23,42,.07),0 4px 16px rgba(15,23,42,.04);
  --shadow2:0 4px 12px rgba(15,23,42,.1),0 8px 32px rgba(15,23,42,.08);
}
*{box-sizing:border-box;margin:0;padding:0;}
.app{display:flex;height:100vh;overflow:hidden;font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--ink);}
.loading{display:flex;align-items:center;justify-content:center;width:100%;font-size:13px;color:var(--ink4);}

/* TOAST */
.toast{position:fixed;top:20px;right:20px;z-index:9999;background:var(--ink);color:#fff;padding:10px 18px;border-radius:8px;font-size:12px;font-weight:500;box-shadow:var(--shadow2);}

/* SIDEBAR */
.sidebar{width:224px;min-width:224px;background:#0F172A;border-right:none;display:flex;flex-direction:column;overflow:hidden;}
.sidebar-top{padding:20px 16px 14px;border-bottom:1px solid #1E293B;}
.logo{display:flex;align-items:center;gap:9px;margin-bottom:14px;}
.logo-glyph{font-size:18px;color:#0EA5E9;}
.logo-name{font-size:14px;font-weight:800;color:#F1F5F9;letter-spacing:1px;}
.logo-sub{font-size:9px;letter-spacing:1px;text-transform:uppercase;color:#475569;margin-top:1px;}
.new-btn{width:100%;padding:9px;background:#0EA5E9;border:none;border-radius:6px;font-size:12px;font-weight:600;color:#fff;cursor:pointer;transition:background .15s;}
.new-btn:hover{background:#0284C7;}
.sb-label{padding:16px 16px 6px;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#475569;}
.proj-list{flex:1;overflow-y:auto;padding:4px 8px 16px;}
.proj-list::-webkit-scrollbar{width:3px;}.proj-list::-webkit-scrollbar-thumb{background:#1E293B;border-radius:2px;}
.sb-empty{padding:14px 8px;font-size:11px;color:#475569;}
.proj-row{padding:9px 8px 7px;border-radius:6px;cursor:pointer;border-left:2px solid transparent;margin-bottom:2px;transition:background .1s;}
.proj-row:hover{background:#1E293B;}
.proj-row.active{background:#1E293B;border-left-color:#0EA5E9;}
.pr-name{font-size:12px;font-weight:500;color:#E2E8F0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.pr-date{font-size:10px;color:#64748B;margin-top:2px;}
.pr-bar{height:2px;background:#1E293B;border-radius:1px;overflow:hidden;margin-top:6px;}
.pr-fill{height:100%;background:#0EA5E9;transition:width .3s;}

/* MAIN */
.main{flex:1;overflow:hidden;display:flex;flex-direction:column;}

/* DASHBOARD */
.dashboard{flex:1;overflow-y:auto;padding:40px 48px;}
.dash-hero{margin-bottom:32px;}
.dash-label{font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--gold);margin-bottom:6px;font-weight:600;}
.dash-h1{font-size:28px;font-weight:800;color:var(--ink);margin-bottom:6px;letter-spacing:-.5px;}
.dash-p{font-size:12px;color:var(--ink4);}
.dash-empty{display:flex;flex-direction:column;align-items:center;padding:70px 0;gap:14px;}
.dash-glyph{font-size:48px;color:var(--bg2);}
.dash-msg{font-size:12px;color:var(--ink4);text-align:center;max-width:320px;}
.dash-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;}
.dash-card{background:var(--white);border:1px solid var(--border);border-radius:10px;padding:20px;cursor:pointer;transition:all .2s;box-shadow:var(--shadow);}
.dash-card:hover{border-color:var(--gold);box-shadow:var(--shadow2);transform:translateY(-1px);}
.dc-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
.dc-glyph{font-size:16px;color:var(--gold);}
.dc-pct{font-size:11px;font-weight:700;color:var(--ink4);}
.dc-name{font-size:15px;font-weight:700;color:var(--ink);margin-bottom:3px;}
.dc-date{font-size:10px;color:var(--ink4);margin-bottom:10px;}
.dc-bar{height:3px;background:var(--bg2);border-radius:2px;overflow:hidden;margin-bottom:10px;}
.dc-fill{height:100%;background:var(--gold);transition:width .3s;}
.dc-modules{display:flex;gap:8px;}
.dc-mod{font-size:10px;font-weight:600;padding:3px 8px;border-radius:99px;}
.dc-mod.pdm{background:#EFF8FF;color:#0EA5E9;}
.dc-mod.pdc{background:#F5F3FF;color:#8B5CF6;}

/* WIZARD */
.wiz-wrap{flex:1;overflow-y:auto;background:var(--bg);display:flex;align-items:flex-start;justify-content:center;padding:40px 20px 80px;}
.wiz-inner{width:100%;max-width:600px;}
.wiz-brand{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:6px;}
.wiz-title{font-size:24px;font-weight:800;color:var(--ink);margin-bottom:24px;letter-spacing:-.4px;}
.wiz-progress-wrap{display:flex;align-items:center;gap:12px;margin-bottom:28px;}
.wiz-progress-bar{flex:1;height:4px;background:var(--bg2);border-radius:2px;overflow:hidden;}
.wiz-progress-fill{height:100%;background:var(--gold);transition:width .3s;border-radius:2px;}
.wiz-progress-txt{font-size:11px;color:var(--ink4);font-weight:600;min-width:40px;text-align:right;}
.wiz-step{background:var(--white);border:1px solid var(--border);border-radius:12px;padding:28px;box-shadow:var(--shadow);}
.wiz-step-num{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--gold);margin-bottom:4px;}
.wiz-step-title{font-size:18px;font-weight:700;color:var(--ink);margin-bottom:20px;}
.wiz-storica-toggle{margin-bottom:16px;padding:12px;background:var(--bg);border-radius:6px;border:1px solid var(--border);}
.wiz-check-label{display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:12px;color:var(--ink3);line-height:1.5;}
.wiz-check-label input[type=checkbox]{margin-top:2px;accent-color:var(--gold);}
.wiz-fields{display:flex;flex-direction:column;gap:14px;}
.wiz-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:24px;}

/* PROJECT VIEW */
.proj-view{flex:1;overflow:hidden;display:flex;flex-direction:column;}
.pv-topbar{display:flex;align-items:center;gap:14px;padding:12px 24px;background:var(--white);border-bottom:1px solid var(--border);flex-shrink:0;}
.pv-back{background:none;border:1px solid var(--border);border-radius:6px;padding:6px 12px;font-size:11px;font-weight:600;color:var(--ink3);cursor:pointer;transition:all .15s;}
.pv-back:hover{border-color:var(--gold);color:var(--gold);}
.pv-name{font-size:14px;font-weight:700;color:var(--ink);flex:1;}
.pv-actions{display:flex;gap:8px;align-items:center;}

/* MODULE SWITCHER */
.module-sw{display:flex;background:var(--white);border-bottom:2px solid var(--border);flex-shrink:0;padding:0 24px;gap:4px;}
.module-btn{display:flex;align-items:center;gap:8px;padding:12px 20px;font-size:12px;font-weight:600;color:var(--ink4);background:none;border:none;border-bottom:3px solid transparent;margin-bottom:-2px;cursor:pointer;transition:all .15s;}
.module-btn:hover{color:var(--ink2);}
.module-btn.active{color:var(--ink);border-bottom-color:var(--gold);}
.mb-icon{font-size:14px;}
.mb-badge{font-size:10px;background:var(--bg1);color:var(--ink4);padding:2px 8px;border-radius:99px;font-weight:600;margin-left:4px;}
.module-btn.active .mb-badge{background:var(--gold-bg);color:var(--gold);}

/* GROUP TABS */
.group-tabs{display:flex;border-bottom:1px solid var(--border);background:var(--white);padding:0 24px;flex-shrink:0;}
.gtab{padding:11px 16px;font-size:12px;font-weight:600;color:var(--ink4);cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap;transition:all .15s;display:flex;align-items:center;gap:6px;}
.gtab:hover{color:var(--ink2);}
.gtab.active{font-weight:700;}
.gtab-cnt{font-size:10px;background:var(--bg2);color:var(--ink4);padding:2px 7px;border-radius:99px;font-weight:600;transition:all .15s;}

/* SECTION TABS */
.sec-tabs{display:flex;overflow-x:auto;border-bottom:1px solid var(--border);background:var(--white);flex-shrink:0;}
.sec-tabs::-webkit-scrollbar{height:0;}
.sec-tab{display:flex;align-items:center;gap:4px;padding:9px 16px;font-size:11px;font-weight:500;color:var(--ink4);cursor:pointer;border:none;background:none;border-bottom:2px solid transparent;white-space:nowrap;transition:all .15s;}
.sec-tab:hover{color:var(--ink2);}
.sec-tab.active{font-weight:600;}
.sec-tab.has{color:var(--ink3);}
.tab-dot{width:4px;height:4px;border-radius:50%;flex-shrink:0;}

/* SECTION BODY */
.sec-body{flex:1;overflow:hidden;display:flex;flex-direction:column;}
.sec-body-hdr{padding:18px 32px 0;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}
.sec-body-title{font-size:18px;font-weight:700;color:var(--ink);letter-spacing:-.3px;}
.sec-acts{display:flex;gap:6px;align-items:center;flex-wrap:wrap;}
.sec-content{flex:1;overflow-y:auto;padding:16px 32px 36px;}
.sec-content::-webkit-scrollbar{width:4px;}.sec-content::-webkit-scrollbar-thumb{background:var(--bg2);border-radius:2px;}
.sec-empty{display:flex;flex-direction:column;align-items:center;padding:64px 0;gap:12px;}
.se-glyph{font-size:40px;color:var(--bg2);}
.se-msg{font-size:12px;color:var(--ink4);}
.gen-row{display:flex;align-items:center;gap:10px;padding:18px 0;font-size:12px;color:var(--ink4);}
.spin{width:14px;height:14px;border:2px solid var(--bg2);border-top-color:var(--gold);border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0;}
@keyframes spin{to{transform:rotate(360deg);}}
.edit-txta{width:100%;min-height:440px;background:var(--white);border:1px solid var(--border);border-radius:8px;color:var(--ink);font-family:'Inter',sans-serif;font-size:13px;line-height:1.7;padding:22px;resize:vertical;outline:none;}
.edit-txta:focus{border-color:var(--gold);box-shadow:0 0 0 3px var(--gold-bg);}

/* MARKDOWN */
.md-out{background:var(--white);border:1px solid var(--border);border-radius:10px;padding:28px 32px;line-height:1.8;box-shadow:var(--shadow);}
.md-out h1{font-size:20px;font-weight:800;color:var(--ink);margin:0 0 16px;padding-bottom:12px;border-bottom:1px solid var(--border);letter-spacing:-.3px;}
.md-out h2{font-size:16px;font-weight:700;color:var(--ink2);margin:24px 0 10px;}
.md-out h3{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--gold);margin:20px 0 8px;}
.md-out p{color:var(--ink3);font-size:13px;margin:5px 0;}
.md-out strong{color:var(--ink2);font-weight:600;}
.md-out em{font-style:italic;}
.md-out hr{border:none;border-top:1px solid var(--border);margin:20px 0;}
.md-out ul{list-style:none;padding:0;margin:6px 0;}
.md-out li{color:var(--ink3);font-size:13px;padding:2px 0 2px 14px;position:relative;}
.md-out li::before{content:'–';position:absolute;left:0;color:var(--ink5);}
.md-out li.check{padding-left:20px;}
.md-out li.check::before{content:'☐';color:var(--ink4);}
.md-out li.check.done::before{content:'☑';color:var(--ok);}
.md-out ol{padding-left:18px;margin:6px 0;}
.md-out ol li::before{display:none;}
.md-out .ok{color:var(--ok);}.md-out .ko{color:var(--err);}.md-out .warn{color:var(--warn);}
.md-out .tbl-wrap{overflow-x:auto;margin:12px 0;}
.md-out table{width:100%;border-collapse:collapse;font-size:12px;}
.md-out th{background:var(--bg1);color:var(--ink3);font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:8px 12px;text-align:left;border-bottom:2px solid var(--border);white-space:nowrap;}
.md-out td{padding:8px 12px;color:var(--ink3);border-bottom:1px solid var(--border);vertical-align:top;}
.md-out tr:hover td{background:var(--bg);}

/* VERSIONS */
.vpanel{background:var(--white);border:1px solid var(--border);border-radius:10px;margin-bottom:14px;box-shadow:var(--shadow);}
.vpanel-head{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--border);background:var(--bg);}
.vpanel-title{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--ink4);}
.vitem{padding:12px 16px;border-bottom:1px solid var(--border);transition:background .1s;}
.vitem:hover{background:var(--bg);}
.vitem:last-child{border-bottom:none;}
.vitem-meta{display:flex;gap:8px;align-items:center;margin-bottom:5px;}
.vdate{font-size:10px;color:var(--ink4);}
.vpreview{font-size:11px;color:var(--ink4);margin-bottom:7px;line-height:1.4;}

/* BUTTONS */
.btn-primary{padding:8px 16px;background:var(--gold);border:none;border-radius:6px;font-size:12px;font-weight:600;color:#fff;cursor:pointer;transition:all .15s;}
.btn-primary:hover{background:#0284C7;}
.btn-primary:disabled{opacity:.5;cursor:not-allowed;}
.btn-primary.sm{font-size:11px;padding:6px 12px;}
.btn-outline{padding:8px 16px;background:none;border:1px solid var(--gold);border-radius:6px;font-size:12px;font-weight:600;color:var(--gold);cursor:pointer;transition:all .15s;}
.btn-outline:hover{background:var(--gold-bg);}
.btn-outline.sm{font-size:11px;padding:5px 11px;}
.btn-ghost{padding:8px 16px;background:none;border:1px solid var(--border);border-radius:6px;font-size:12px;font-weight:500;color:var(--ink3);cursor:pointer;transition:all .15s;}
.btn-ghost:hover{background:var(--bg);border-color:var(--border2);}
.btn-ghost.sm{font-size:11px;padding:5px 11px;}

/* FORM */
.fg{display:flex;flex-direction:column;gap:4px;}
.fg-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.lbl{font-size:11px;font-weight:600;color:var(--ink3);}
.inp{width:100%;padding:8px 10px;background:var(--white);border:1px solid var(--border);border-radius:6px;font-family:'Inter',sans-serif;font-size:13px;color:var(--ink);outline:none;transition:border-color .15s;}
.inp:focus{border-color:var(--gold);box-shadow:0 0 0 3px var(--gold-bg);}
.txta{width:100%;padding:8px 10px;background:var(--white);border:1px solid var(--border);border-radius:6px;font-family:'Inter',sans-serif;font-size:13px;color:var(--ink);outline:none;resize:vertical;line-height:1.6;transition:border-color .15s;}
.txta:focus{border-color:var(--gold);box-shadow:0 0 0 3px var(--gold-bg);}
/* CONTENT TRACKER ED */
.ct-wrap{padding:4px 0;}
.ct-hdr{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px;flex-wrap:wrap;}
.ct-filters{display:flex;flex-wrap:wrap;gap:6px;}
.ct-pill{padding:4px 12px;border:1px solid var(--border);border-radius:99px;font-size:11px;font-weight:500;color:var(--ink4);background:none;cursor:pointer;transition:all .15s;}
.ct-pill:hover{border-color:var(--border2);color:var(--ink3);}
.ct-pill.active{border-color:var(--gold);color:var(--gold);background:var(--gold-bg);}
.ct-title-sm{font-size:13px;font-weight:700;color:var(--ink);}
.ct-form{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:14px;}
.fg-row3{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-top:10px;}
.form-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:12px;}
.ct-empty{padding:24px;text-align:center;font-size:12px;color:var(--ink4);font-style:italic;}
.ct-list{display:flex;flex-direction:column;gap:8px;}
.ct-row{background:var(--white);border:1px solid var(--border);border-radius:8px;overflow:hidden;transition:box-shadow .15s;}
.ct-row:hover{box-shadow:var(--shadow);}
.ct-row-main{display:flex;align-items:center;gap:12px;padding:12px 14px;}
.ct-status-badge{font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;white-space:nowrap;flex-shrink:0;}
.ct-info{flex:1;min-width:0;}
.ct-title{font-size:13px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ct-meta{font-size:10px;color:var(--ink4);margin-top:2px;}
.ct-kpi-row{font-size:10px;color:var(--ok);margin-top:2px;}
.ct-actions{display:flex;gap:6px;align-items:center;flex-shrink:0;}
.ct-del{background:none;border:none;color:var(--ink5);font-size:16px;cursor:pointer;padding:2px 6px;border-radius:3px;}
.ct-del:hover{background:var(--bg);color:var(--err);}
.ct-caption{padding:10px 14px 12px;border-top:1px solid var(--border);background:var(--bg);}
.ct-caption-label{font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--gold);margin-bottom:4px;}
.ct-caption-text{font-size:12px;color:var(--ink3);line-height:1.6;}
.camp-exec-wrap{padding:4px 0;}
.camp-ref-box{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:14px;}
.camp-ref-label{font-size:10px;font-weight:700;letter-spacing:.5px;color:var(--ink4);margin-bottom:6px;}
.camp-ref-preview{font-size:11px;color:var(--ink4);line-height:1.5;}
.camp-exec-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
.camp-exec-title{font-size:13px;font-weight:700;color:var(--ink);}
.perf-table-wrap{overflow-x:auto;margin-top:8px;}
.perf-table{width:100%;border-collapse:collapse;font-size:11px;background:var(--white);border-radius:8px;overflow:hidden;border:1px solid var(--border);}
.perf-table th{background:var(--bg1);color:var(--ink3);font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:8px 12px;text-align:left;border-bottom:2px solid var(--border);}
.perf-table td{padding:8px 12px;color:var(--ink3);border-bottom:1px solid var(--border);vertical-align:top;}
.perf-table tr:last-child td{border-bottom:none;}
.perf-table tr:hover td{background:var(--bg);}
.cal-simple-wrap{background:var(--white);border:1px solid var(--border);border-radius:10px;overflow:hidden;}
.cal-nav{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border);}
.cal-month-label{font-size:14px;font-weight:700;color:var(--ink);}
.cal-grid-hdr{display:grid;grid-template-columns:repeat(7,1fr);background:var(--bg);border-bottom:1px solid var(--border);}
.cal-day-hdr{text-align:center;font-size:10px;font-weight:700;color:var(--ink4);padding:8px 4px;letter-spacing:.5px;}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);}
.cal-cell{min-height:80px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);padding:6px;}
.cal-cell:nth-child(7n){border-right:none;}
.cal-cell.empty{background:var(--bg);opacity:.4;}
.cal-cell.today{background:var(--gold-bg);}
.cal-num{font-size:11px;font-weight:500;color:var(--ink4);margin-bottom:3px;}
.cal-num-today{color:var(--gold);font-weight:700;}
.cal-chip{font-size:9px;padding:2px 5px;border-radius:3px;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:500;}
.cal-legend{display:flex;flex-wrap:wrap;gap:12px;padding:10px 20px;border-top:1px solid var(--border);background:var(--bg);}
.cal-leg-item{font-size:10px;font-weight:500;}
/* FUNNEL COMPARISON */
.funnel-compare-section{background:var(--white);border:1px solid var(--border);border-radius:10px;padding:16px 20px;margin-bottom:16px;}
.funnel-compare-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;flex-wrap:wrap;gap:4px;}
.funnel-cmp-table{width:100%;border-collapse:collapse;font-size:12px;}
.funnel-cmp-table th{background:var(--bg1);color:var(--ink3);font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;padding:8px 12px;text-align:left;border-bottom:2px solid var(--border);}
.funnel-cmp-table td{padding:10px 12px;border-bottom:1px solid var(--border);vertical-align:middle;}
.funnel-cmp-table tr:last-child td{border-bottom:none;}
.funnel-target-inp{width:52px;padding:5px 7px;border:1px solid var(--border);border-radius:5px;font-size:13px;font-weight:700;text-align:center;font-family:'Inter',sans-serif;}
.funnel-target-inp:focus{border-color:var(--gold);outline:none;}
.funnel-refs{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;}
.funnel-ref-card{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:14px;overflow:hidden;}
.funnel-ref-label{font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--ink4);margin-bottom:8px;}
.funnel-ref-preview{font-size:11px;color:var(--ink3);line-height:1.6;max-height:180px;overflow:hidden;}
.funnel-ref-preview h2,.funnel-ref-preview h3{font-size:11px;font-weight:700;margin:6px 0 3px;}
.funnel-ref-preview table{font-size:10px;border-collapse:collapse;width:100%;}
.funnel-ref-preview td,.funnel-ref-preview th{padding:3px 6px;border:1px solid var(--border);}
/* FUNNEL VIEW */
.funnel-wrap{padding:4px 0;}
.funnel-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;}
.funnel-visual{display:flex;flex-direction:column;gap:8px;margin-bottom:24px;padding:16px;background:var(--bg);border-radius:8px;}
.funnel-stage-bar-row{display:flex;align-items:center;gap:10px;}
.funnel-stage-bar{height:22px;position:relative;overflow:hidden;flex-shrink:0;}
.funnel-stage-fill{height:100%;position:absolute;left:0;top:0;border-radius:4px;transition:width .4s;}
.funnel-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.funnel-col{background:var(--white);border:1px solid var(--border);border-radius:8px;overflow:hidden;}
.funnel-col-hdr{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;}
.funnel-col-cnt{font-size:20px;font-weight:800;padding:4px 10px;border-radius:6px;min-width:36px;text-align:center;}
.funnel-col-body{padding:8px 12px;display:flex;flex-direction:column;gap:4px;min-height:80px;}
.funnel-empty{font-size:11px;color:var(--ink5);font-style:italic;padding:8px 0;}
.funnel-item-row{display:flex;align-items:center;gap:6px;padding:3px 0;border-bottom:1px solid var(--border);}
.funnel-item-row:last-child{border-bottom:none;}
.funnel-item-title{flex:1;font-size:11px;color:var(--ink3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.funnel-col-meta{padding:10px 12px;background:var(--bg);border-top:1px solid var(--border);}
.funnel-breakdown{margin-bottom:8px;}
.funnel-breakdown-label{font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--ink4);margin-bottom:5px;}
.funnel-breakdown-row{display:flex;align-items:center;gap:6px;font-size:10px;color:var(--ink3);margin-bottom:3px;}
.funnel-breakdown-row span:first-child{min-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.funnel-breakdown-row span:last-child{min-width:16px;text-align:right;font-weight:700;}
.funnel-mini-bar{flex:1;height:4px;background:var(--bg2);border-radius:2px;overflow:hidden;}
.funnel-mini-bar div{height:100%;border-radius:2px;transition:width .3s;}
/* MEDIA UPLOAD */
.pf-media-row{display:flex;align-items:center;gap:8px;margin-top:8px;}
.pf-upload-btn{display:inline-flex;align-items:center;padding:7px 12px;background:var(--bg);border:1px solid var(--border);border-radius:6px;font-size:12px;font-weight:600;color:var(--ink3);cursor:pointer;flex-shrink:0;transition:all .15s;white-space:nowrap;}
.pf-upload-btn:hover{border-color:var(--gold);color:var(--gold);}
.pf-media-hint{font-size:10px;color:var(--warn);background:#FFFBEB;padding:6px 10px;border-radius:5px;margin-top:6px;line-height:1.5;}
.pf-video-preview{width:100%;max-height:200px;border-radius:6px;background:#000;margin-bottom:8px;display:block;}

/* PHONE PREVIEW POST */
.ig-post-preview{padding:8px;border-top:1px solid #EFEFEF;}
.ig-post-hdr{display:flex;align-items:center;gap:6px;padding:6px 0;margin-bottom:4px;}
.ig-post-caption{font-size:9px;color:#333;padding:4px 2px;line-height:1.4;white-space:pre-wrap;}
/* EXPORT PANEL */
.exp-wrap{position:relative;}
.exp-panel{position:absolute;right:0;top:calc(100% + 6px);background:var(--white);border:1px solid var(--border);border-radius:10px;box-shadow:var(--shadow2);padding:16px;z-index:200;min-width:280px;max-width:320px;}
.exp-title{font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--ink4);margin-bottom:12px;}
.exp-btn{display:flex;align-items:center;gap:12px;width:100%;padding:10px 12px;background:var(--bg);border:1px solid var(--border);border-radius:7px;cursor:pointer;text-align:left;margin-bottom:6px;transition:all .15s;}
.exp-btn:hover:not(:disabled){border-color:var(--gold);background:var(--gold-bg);}
.exp-btn:disabled{opacity:.6;cursor:not-allowed;}
.exp-icon{font-size:20px;flex-shrink:0;}
.exp-btn-label{font-size:12px;font-weight:700;color:var(--ink);}
.exp-btn-sub{font-size:10px;color:var(--ink4);margin-top:1px;}
.exp-divider{border:none;border-top:1px solid var(--border);margin:10px 0;}
.exp-hint{font-size:10px;color:var(--ink5);line-height:1.5;}
.exp-toast{position:absolute;top:-36px;right:0;background:var(--ink);color:#fff;padding:5px 12px;border-radius:5px;font-size:11px;font-weight:500;white-space:nowrap;}
/* PROJECT OVERVIEW */
.ov-wrap{padding:24px 32px;overflow-y:auto;flex:1;}
.ov-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;}
.ov-metric-card{background:var(--white);border:1px solid var(--border);border-radius:10px;padding:16px;box-shadow:var(--shadow);}
.ov-metric-label{font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--ink4);margin-bottom:8px;}
.ov-metric-value{font-size:28px;font-weight:800;color:var(--ink);letter-spacing:-1px;line-height:1;}
.ov-metric-sub{font-size:10px;color:var(--ink4);margin-top:6px;line-height:1.4;}
.ov-two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;}
.ov-left,.ov-right{display:flex;flex-direction:column;gap:16px;}
.ov-card{background:var(--white);border:1px solid var(--border);border-radius:10px;padding:18px;box-shadow:var(--shadow);}
.ov-card-full{background:var(--white);border:1px solid var(--border);border-radius:10px;padding:18px;box-shadow:var(--shadow);}
.ov-sec-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
.ov-sec-title{font-size:12px;font-weight:700;color:var(--ink);}

/* MILESTONE */
.ms-list{display:flex;flex-direction:column;gap:6px;}
.ms-row{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);}
.ms-row:last-child{border-bottom:none;}
.ms-dot-el{width:10px;height:10px;border-radius:50%;flex-shrink:0;transition:transform .15s;}
.ms-dot-click:hover{transform:scale(1.3);cursor:pointer;}
.ms-info-el{flex:1;min-width:0;}
.ms-name{font-size:12px;font-weight:500;color:var(--ink);}
.ms-date{font-size:10px;color:var(--ink4);margin-top:1px;}
.ms-badge{font-size:9px;font-weight:700;padding:2px 8px;border-radius:99px;white-space:nowrap;}

/* TASKS */
.task-filter-bar{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;}
.task-filter-btn{padding:3px 10px;font-size:10px;font-weight:600;border:1px solid var(--border);border-radius:99px;cursor:pointer;background:none;color:var(--ink4);transition:all .15s;}
.task-filter-btn:hover{border-color:var(--border2);color:var(--ink3);}
.task-filter-btn.active{background:var(--gold-bg);border-color:var(--gold);color:var(--gold);}
.ov-task-list{display:flex;flex-direction:column;gap:4px;}
.ov-task-row{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:6px;background:var(--bg);transition:background .1s;}
.ov-task-row:hover{background:var(--bg1);}
.ov-task-done .ov-task-text{text-decoration:line-through;color:var(--ink5);}
.ov-task-check{width:16px;height:16px;border:1.5px solid var(--border2);border-radius:4px;flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:9px;color:var(--ok);transition:all .15s;}
.ov-task-done .ov-task-check{background:var(--ok);border-color:var(--ok);color:#fff;}
.ov-task-prio{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
.ov-task-text{flex:1;font-size:11px;color:var(--ink3);min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ov-task-tag{font-size:9px;font-weight:600;color:var(--ink4);background:var(--bg2);padding:1px 6px;border-radius:99px;flex-shrink:0;}
.ov-task-who{font-size:10px;font-weight:700;color:var(--ink3);flex-shrink:0;}

/* DOCUMENT LIBRARY */
.doc-grid-ov{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.doc-card-ov{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:12px;cursor:pointer;transition:all .15s;}
.doc-card-ov:hover{border-color:var(--gold);box-shadow:var(--shadow);}
.doc-pending{opacity:.6;border-style:dashed;}
.doc-card-ov-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;}
.doc-card-ov-title{font-size:12px;font-weight:700;color:var(--ink);}
.doc-ver-badge{font-size:9px;background:var(--bg2);color:var(--ink4);padding:1px 6px;border-radius:3px;flex-shrink:0;}
.doc-card-ov-meta{font-size:10px;color:var(--ink4);margin-bottom:6px;line-height:1.4;}
.doc-card-ov-action{font-size:10px;color:var(--gold);font-weight:600;}

/* AI SHORTCUTS */
.ai-shortcuts-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.ai-shortcut-btn{display:flex;align-items:center;gap:8px;padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;color:var(--ink3);transition:all .15s;text-align:left;}
.ai-shortcut-btn:hover{border-color:var(--gold);color:var(--gold);background:var(--gold-bg);}
.ai-sc-icon{font-size:16px;flex-shrink:0;}

/* BUDGET */
.budget-wrap{}
.budget-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:14px;}
.budget-col-title{font-size:11px;font-weight:700;color:var(--ink);margin-bottom:10px;}
.budget-row{display:flex;align-items:center;gap:6px;margin-bottom:6px;}
.budget-inp-label{flex:1;}
.budget-inp-val{width:80px;flex-shrink:0;text-align:right;}
.budget-eur{font-size:11px;color:var(--ink4);flex-shrink:0;}
.budget-label{flex:1;font-size:11px;color:var(--ink3);}
.budget-total{font-size:11px;color:var(--ink3);margin-top:10px;padding-top:8px;border-top:1px solid var(--border);}
.budget-totale{display:flex;align-items:center;gap:16px;padding:14px;background:var(--bg);border-radius:8px;font-size:12px;font-weight:600;color:var(--ink);}
.budget-totale-val{font-size:20px;font-weight:800;color:var(--ink);}
/* WIZARD 3-MODE */
.wiz-wide{max-width:720px!important;}
.wiz-modes{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-top:4px;}
.wiz-mode-card{border:1px solid var(--border);border-radius:12px;padding:22px 18px;cursor:pointer;transition:all .2s;background:var(--white);}
.wiz-mode-card:hover{border-color:var(--gold);box-shadow:var(--shadow2);transform:translateY(-2px);}
.wiz-mode-icon{font-size:30px;margin-bottom:10px;}
.wiz-mode-title{font-size:13px;font-weight:700;color:var(--ink);margin-bottom:6px;}
.wiz-mode-desc{font-size:11px;color:var(--ink4);line-height:1.5;}
.review-notice{background:var(--gold-bg);border:1px solid #BAE6FD;border-radius:6px;padding:10px 14px;font-size:11px;color:var(--ink3);margin-bottom:16px;line-height:1.5;}
.review-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.review-full{grid-column:1/-1;}
.review-txta{min-height:52px;}
.extract-error{background:#FFF0F3;border:1px solid #FECDD3;border-radius:6px;padding:10px 12px;font-size:11px;color:var(--err);margin-top:10px;line-height:1.5;}
.extract-hints{background:var(--bg);border-radius:6px;padding:12px 14px;font-size:11px;color:var(--ink4);line-height:1.9;margin-top:4px;}
/* SIDEBAR FILE EXPLORER */
.sb-client-group{margin-bottom:2px;}
.sb-client-row{display:flex;align-items:center;padding:6px 8px;border-radius:6px;gap:4px;transition:background .1s;}
.sb-client-row:hover{background:#1E293B;}
.sb-client-active{background:#1E293B;}
.sb-chevron-btn{background:none;border:none;color:#64748B;cursor:pointer;font-size:9px;width:16px;flex-shrink:0;}
.sb-client-name{flex:1;font-size:12px;font-weight:600;color:#E2E8F0;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.sb-icon-btn{background:none;border:none;color:#64748B;cursor:pointer;font-size:12px;padding:2px 4px;border-radius:3px;flex-shrink:0;}
.sb-icon-btn:hover{background:#0F172A;color:#94A3B8;}
.sb-proj-row{display:flex;align-items:center;gap:6px;padding:5px 8px 5px 24px;border-radius:5px;cursor:pointer;border-left:2px solid transparent;margin-bottom:1px;transition:all .1s;}
.sb-proj-row:hover{background:#1E293B;}
.sb-proj-row.active{background:#1E293B;border-left-color:#0EA5E9;}
.sb-proj-dot{width:5px;height:5px;border-radius:50%;background:#475569;flex-shrink:0;}
.sb-proj-row.active .sb-proj-dot{background:#0EA5E9;}
.sb-proj-name{font-size:11px;color:#94A3B8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.sb-proj-row.active .sb-proj-name{color:#E2E8F0;font-weight:500;}
.sb-proj-empty{font-size:10px;color:#475569;padding:4px 8px 4px 24px;cursor:pointer;font-style:italic;}
.sb-proj-empty:hover{color:#94A3B8;}

/* CLIENT SETTINGS VIEW */
.cs-wrap{flex:1;overflow-y:auto;padding:32px 48px;}
.cs-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;}
.cs-title{display:flex;align-items:center;gap:14px;}
.cs-avatar{width:48px;height:48px;border-radius:12px;background:var(--gold);display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-weight:800;flex-shrink:0;}
.cs-nome{font-size:22px;font-weight:800;color:var(--ink);letter-spacing:-.3px;}
.cs-sub{font-size:12px;color:var(--ink4);margin-top:3px;}
.cs-tabs{display:flex;gap:4px;margin-bottom:20px;border-bottom:1px solid var(--border);padding-bottom:0;}
.cs-tab{padding:10px 18px;font-size:12px;font-weight:600;color:var(--ink4);background:none;border:none;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .15s;}
.cs-tab:hover{color:var(--ink2);}
.cs-tab.active{color:var(--gold);border-bottom-color:var(--gold);}
.cs-body{display:flex;flex-direction:column;gap:16px;}
.cs-card{background:var(--white);border:1px solid var(--border);border-radius:10px;padding:20px;box-shadow:var(--shadow);}
.cs-card-title{font-size:14px;font-weight:700;color:var(--ink);margin-bottom:16px;}
.social-row{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
.social-badge{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;color:#fff;font-size:9px;font-weight:800;flex-shrink:0;}
.social-label{font-size:12px;font-weight:600;color:var(--ink3);width:80px;flex-shrink:0;}
.meta-platforms-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;}
.meta-plat-card{border:1px solid var(--border);border-radius:8px;padding:14px;}
.meta-plat-hdr{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;margin-bottom:10px;}
.meta-conn-badge{font-size:9px;background:#ECFDF5;color:#059669;padding:2px 7px;border-radius:99px;font-weight:700;}
.meta-plat-val{font-size:12px;color:var(--ink3);margin-bottom:8px;}
.meta-warn-box{background:#FFFBEB;border:1px solid #FCD34D;border-radius:6px;padding:10px 12px;font-size:11px;color:#92400E;margin-top:10px;line-height:1.5;}
.portal-url-row{display:flex;align-items:center;gap:10px;background:var(--bg);border-radius:6px;padding:12px 14px;margin-bottom:16px;}
.portal-url{flex:1;font-size:12px;color:var(--ink3);word-break:break-all;}
.portal-toggles{display:flex;flex-direction:column;gap:0;}
.portal-toggle-row{display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid var(--border);}
.portal-toggle-row:last-child{border-bottom:none;}
.toggle{width:44px;height:24px;border-radius:99px;background:#CBD5E1;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;}
.toggle.on{background:var(--ok);}
.toggle-knob{position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.2);}
.toggle.on .toggle-knob{transform:translateX(20px);}
.cs-proj-row{display:flex;align-items:center;gap:14px;padding:12px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px;cursor:pointer;transition:all .15s;}
.cs-proj-row:hover{border-color:var(--gold);box-shadow:var(--shadow);}

/* CLIENT PORTAL PREVIEW */
.portal-wrap{flex:1;display:flex;flex-direction:column;background:var(--bg);}
.portal-header{background:var(--white);border-bottom:1px solid var(--border);padding:14px 32px;display:flex;align-items:center;gap:12px;}
.portal-agency{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold);}
.portal-client{font-size:16px;font-weight:800;color:var(--ink);flex:1;}
.portal-body{flex:1;overflow-y:auto;padding:32px 48px;}
.portal-section-title{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--ink4);margin-bottom:12px;}
.portal-post-row{display:flex;align-items:center;gap:14px;background:var(--white);border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:10px;}
.portal-post-thumb{width:56px;height:56px;border-radius:6px;object-fit:cover;flex-shrink:0;}
.portal-post-caption{font-size:12px;color:var(--ink4);margin-top:4px;line-height:1.4;}
/* FEED SECTION */
.feed-wrap{display:flex;height:100%;gap:0;overflow:hidden;}
.feed-list{flex:1;overflow-y:auto;padding:16px 20px;}
.feed-list-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;}
.feed-list-count{font-size:13px;font-weight:700;color:var(--ink);}
.feed-row{display:flex;align-items:center;gap:12px;padding:12px;background:var(--white);border:1px solid var(--border);border-radius:10px;margin-bottom:8px;cursor:pointer;transition:all .15s;}
.feed-row:hover{border-color:var(--gold);box-shadow:var(--shadow);}
.feed-row-sel{border-color:var(--gold);box-shadow:var(--shadow2);}
.feed-thumb{width:60px;height:60px;border-radius:8px;overflow:hidden;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;}
.feed-thumb img{width:100%;height:100%;object-fit:cover;}
.feed-thumb-placeholder{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;width:100%;height:100%;}
.feed-row-body{flex:1;min-width:0;}
.feed-row-title{font-size:13px;font-weight:600;color:var(--ink);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.feed-row-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.feed-stato-badge{font-size:9px;font-weight:700;padding:2px 7px;border-radius:99px;}
.feed-row-team{display:flex;align-items:center;gap:5px;margin-top:4px;}
.feed-mem-dot{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:8px;flex-shrink:0;}
.feed-row-acts{display:flex;gap:4px;flex-shrink:0;}

/* PHONE PREVIEW */
.phone-wrap{width:280px;flex-shrink:0;display:flex;align-items:flex-start;justify-content:center;padding:16px 12px;border-left:1px solid var(--border);background:var(--bg);overflow-y:auto;}
.phone-frame{width:220px;border:8px solid #1C1C1E;border-radius:32px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3);flex-shrink:0;}
.phone-notch{height:24px;background:#1C1C1E;display:flex;align-items:center;justify-content:center;}
.phone-notch::after{content:"";width:60px;height:8px;background:#111;border-radius:4px;}
.phone-screen{background:#fff;min-height:400px;}
.ig-header{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid #EFEFEF;}
.ig-avatar{width:28px;height:28px;border-radius:50%;background:#E1306C;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0;}
.ig-name{font-size:12px;font-weight:700;color:#111;flex:1;}
.ig-header-icons{font-size:14px;color:#111;display:flex;gap:8px;}
.ig-stats{display:flex;padding:8px 12px;border-bottom:1px solid #EFEFEF;}
.ig-stat{flex:1;text-align:center;}
.ig-stat-n{font-size:13px;font-weight:700;color:#111;}
.ig-stat-l{font-size:9px;color:#777;}
.ig-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#EFEFEF;}
.ig-cell{aspect-ratio:1;background:#fff;position:relative;overflow:hidden;cursor:pointer;}
.ig-cell-sel::after{content:"";position:absolute;inset:0;border:2px solid #E1306C;}
.ig-cell img{width:100%;height:100%;object-fit:cover;}
.ig-cell-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:3px;background:#F5F5F5;font-size:14px;}
.ig-cell-badge{position:absolute;top:3px;right:3px;font-size:7px;background:rgba(0,0,0,.6);color:#fff;padding:1px 4px;border-radius:2px;}
.ig-cell-empty-gray{background:#F0F0F0;}
.ig-reel-badge{position:absolute;top:4px;right:4px;font-size:10px;color:rgba(255,255,255,.9);}
.ig-bottom-hint{font-size:9px;color:#999;text-align:center;padding:8px 0;}

/* POST FORM MODAL */
.post-form-modal{background:var(--white);border-radius:12px;width:100%;max-width:680px;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.25);}
.pf-header{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--border);}
.pf-thumb{width:60px;height:60px;border-radius:8px;overflow:hidden;background:var(--bg);flex-shrink:0;}
.pf-thumb img{width:100%;height:100%;object-fit:cover;}
.pf-thumb-empty{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:24px;}
.pf-title-inp{flex:1;border:none;outline:none;font-size:16px;font-weight:700;color:var(--ink);font-family:'Inter',sans-serif;background:transparent;}
.pf-icon-btn{background:none;border:1px solid var(--border);border-radius:6px;width:32px;height:32px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;}
.pf-del-btn{color:var(--err);border-color:var(--err)+"40";}
.pf-body{flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:4px;}
.pf-body::-webkit-scrollbar{width:4px;}.pf-body::-webkit-scrollbar-thumb{background:var(--bg2);border-radius:2px;}
.pf-tabs{display:flex;gap:6px;margin-bottom:12px;}
.pf-tab{padding:6px 14px;border:1px solid var(--border);border-radius:99px;font-size:11px;font-weight:600;cursor:pointer;background:none;color:var(--ink3);transition:all .15s;}
.pf-tab.active{background:var(--ink);color:#fff;border-color:var(--ink);}
.pf-section-label{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink4);font-weight:700;margin-top:12px;margin-bottom:6px;}
.pf-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;}
.pf-chip{padding:6px 14px;border:1px solid;border-radius:99px;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;background:none;}
.pf-img-row{display:flex;align-items:center;gap:10px;background:var(--bg);border-radius:6px;padding:10px;margin-bottom:6px;}
.pf-img-thumb{width:40px;height:40px;border-radius:4px;object-fit:cover;flex-shrink:0;}
.pf-img-url{flex:1;font-size:10px;color:var(--gold);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.pf-members{display:flex;gap:6px;flex-wrap:wrap;}
.pf-member-chip{display:flex;align-items:center;gap:6px;padding:5px 10px;border:1px solid;border-radius:99px;font-size:11px;font-weight:600;cursor:pointer;transition:all .15s;background:none;}
.pf-mem-avatar{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:8px;font-weight:700;flex-shrink:0;}

/* GLOBAL META SIDEBAR */
.gm-status{display:flex;align-items:center;gap:6px;padding:8px 10px;background:#1E293B;border-radius:6px;margin-bottom:4px;}
.sb-meta-btn{width:100%;padding:8px;background:none;border:1px solid #1E293B;border-radius:6px;font-size:11px;font-weight:500;color:#64748B;cursor:pointer;margin-bottom:4px;text-align:left;transition:all .15s;}
.sb-meta-btn:hover{background:#1E293B;color:#94A3B8;}
.sb-meta-btn.loading{color:#0EA5E9;border-color:#0EA5E9;}
.gm-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;}
.gm-modal{background:var(--white);border-radius:12px;padding:20px;max-width:400px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3);}
.pub-meta-ok{font-size:11px;color:var(--ok);background:#F0FDF4;padding:8px 12px;border-radius:6px;margin-bottom:12px;}
.pub-meta-warn{font-size:11px;color:var(--warn);background:#FFFBEB;padding:8px 12px;border-radius:6px;margin-bottom:12px;}
/* KANBAN BOARD */
.kan-wrap{padding:4px 0;}
.kan-toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}
.kan-counts{display:flex;gap:6px;flex-wrap:wrap;}
.kan-board{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;overflow-x:auto;}
@media(max-width:900px){.kan-board{grid-template-columns:repeat(3,1fr);}}
.kan-col{background:var(--bg);border-radius:8px;display:flex;flex-direction:column;min-height:200px;border:1px solid var(--border);}
.kan-col-hdr{display:flex;justify-content:space-between;align-items:center;padding:9px 12px;border-radius:8px 8px 0 0;font-size:11px;font-weight:700;flex-shrink:0;}
.kan-col-cnt{font-size:10px;background:rgba(255,255,255,.5);padding:1px 6px;border-radius:99px;}
.kan-col-body{flex:1;display:flex;flex-direction:column;gap:6px;padding:8px;}
.kan-card{background:var(--white);border:1px solid var(--border);border-radius:6px;padding:10px;box-shadow:var(--shadow);transition:box-shadow .15s;}
.kan-card:hover{box-shadow:var(--shadow2);}
.kan-card-title{font-size:11px;font-weight:600;color:var(--ink);margin-bottom:6px;line-height:1.4;}
.kan-card-meta{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px;}
.kan-badge{font-size:9px;font-weight:700;padding:2px 6px;border-radius:99px;}
.kan-date{font-size:9px;color:var(--ink4);margin-left:auto;align-self:center;}
.kan-caption{font-size:10px;color:var(--ink4);font-style:italic;margin-bottom:6px;line-height:1.4;}
.kan-card-actions{display:flex;gap:4px;margin-bottom:6px;}
.kan-act-btn{flex:1;padding:3px 6px;font-size:9px;font-weight:600;background:none;border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--ink3);transition:all .15s;}
.kan-act-btn:hover{border-color:var(--gold);color:var(--gold);}
.kan-advance{width:100%;padding:5px;font-size:9px;font-weight:700;border-radius:4px;border:1px solid;cursor:pointer;transition:all .15s;}
.kan-advance:hover{opacity:.85;}
.kan-empty{text-align:center;font-size:11px;color:var(--ink5);padding:20px 0;font-style:italic;}

/* PUBLISH MODAL & META CONNECT */
.pub-warn{background:#FFF3CD;border:1px solid #FFC107;border-radius:6px;padding:10px 14px;font-size:12px;color:#856404;margin-bottom:12px;}
.pub-platforms{display:flex;gap:16px;margin-bottom:14px;}
.pub-plat-check{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:500;cursor:pointer;}
.pub-plat-check input{accent-color:var(--gold);}
.pub-mode{display:flex;background:var(--bg);border-radius:6px;padding:3px;gap:3px;margin-bottom:14px;}
.pub-mode-btn{flex:1;padding:7px;background:none;border:none;border-radius:5px;font-size:12px;font-weight:500;cursor:pointer;color:var(--ink4);}
.pub-mode-btn.active{background:var(--white);color:var(--ink);font-weight:600;box-shadow:var(--shadow);}
.pub-caption-preview{background:var(--bg);border-radius:6px;padding:10px;font-size:12px;color:var(--ink3);font-style:italic;line-height:1.5;margin-top:12px;}
.meta-box{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:14px;}
.meta-box.connected{background:#F0FDF4;border-color:#BBF7D0;}
.meta-box-title{font-size:12px;font-weight:700;color:var(--ink);margin-bottom:8px;}
.meta-connected-row{display:flex;align-items:center;gap:10px;}
.meta-dot-ok{width:10px;height:10px;border-radius:50%;background:var(--ok);flex-shrink:0;}
.meta-page-row{padding:10px;background:var(--white);border:1px solid var(--border);border-radius:6px;cursor:pointer;margin-bottom:6px;transition:border-color .15s;}
.meta-page-row:hover{border-color:var(--gold);}

/* PUBLISHING HUB */
.pub-hub-wrap{padding:4px 0;}
.pub-hub-section{margin-top:4px;}
.pub-hub-title{font-size:13px;font-weight:700;color:var(--ink);margin-bottom:12px;}
.pub-hub-cnt{background:var(--gold-bg);color:var(--gold);font-size:11px;padding:2px 8px;border-radius:99px;margin-left:6px;}
.pub-item{background:var(--white);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:10px;}
.pub-item-hdr{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:8px;}

/* TEAM PLANNER */
.planner-view{flex:1;overflow:hidden;display:flex;flex-direction:column;}
.tp-wrap{font-family:'Inter',sans-serif;}
.tp-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;}
.tp-nav{display:flex;align-items:center;gap:8px;}
.tp-week-label{font-size:13px;font-weight:700;color:var(--ink);}
.tp-grid-wrap{overflow-x:auto;}
.tp-table{width:100%;border-collapse:collapse;min-width:700px;}
.tp-th-member{background:var(--bg1);padding:10px 14px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--ink4);width:160px;border-bottom:2px solid var(--border);}
.tp-th-day{background:var(--bg1);padding:8px 10px;text-align:center;font-size:10px;font-weight:700;color:var(--ink4);border-bottom:2px solid var(--border);min-width:100px;}
.tp-th-tot{background:var(--bg1);padding:8px 10px;text-align:center;font-size:10px;font-weight:700;color:var(--ink4);border-bottom:2px solid var(--border);width:70px;}
.tp-today-col{background:var(--gold-bg)!important;}
.tp-day-date{font-size:11px;font-weight:600;color:var(--ink);margin-top:2px;}
.tp-day-ore{font-size:9px;color:var(--gold);font-weight:700;margin-top:2px;}
.tp-td-member{padding:10px 14px;border-bottom:1px solid var(--border);vertical-align:middle;background:var(--white);}
.tp-td{padding:6px;border-bottom:1px solid var(--border);border-left:1px solid var(--border);vertical-align:top;cursor:pointer;min-height:60px;background:var(--white);transition:background .1s;}
.tp-td:hover{background:var(--bg);}
.tp-td-tot{padding:10px 8px;border-bottom:1px solid var(--border);text-align:center;background:var(--white);}
.tp-avatar{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:12px;flex-shrink:0;}
.tp-member-name{font-size:12px;font-weight:600;color:var(--ink);}
.tp-member-role{font-size:10px;color:var(--ink4);}
.tp-task{border-radius:4px;padding:5px 7px;margin-bottom:3px;cursor:pointer;transition:opacity .15s;}
.tp-task:hover{opacity:.85;}
.tp-task-title{font-size:10px;font-weight:600;color:var(--ink);line-height:1.3;}
.tp-task-client{font-size:9px;color:var(--ink4);margin-top:1px;}
.tp-task-ore{font-size:9px;font-weight:700;color:var(--ink3);margin-top:2px;}
.tp-add-hint{font-size:14px;color:var(--border2);text-align:center;line-height:2;opacity:0;}
.tp-td:hover .tp-add-hint{opacity:1;}
.tp-ore-tot{font-size:14px;font-weight:800;}
.tp-ore-cap{font-size:9px;color:var(--ink4);}
.tp-ore-bar{width:100%;height:3px;background:var(--bg2);border-radius:2px;overflow:hidden;margin-top:4px;}
.tp-ore-bar div{height:100%;border-radius:2px;transition:width .3s;}

/* SIDEBAR BOTTOM */
.sb-bottom{padding:8px;border-top:1px solid #1E293B;flex-shrink:0;}
.sb-planner-btn{width:100%;padding:9px;background:none;border:1px solid #1E293B;border-radius:6px;font-size:12px;font-weight:500;color:#94A3B8;cursor:pointer;transition:all .15s;text-align:left;}
.sb-planner-btn:hover{background:#1E293B;color:#E2E8F0;}
.sb-planner-btn.active{background:#1E293B;color:#F1F5F9;font-weight:600;}
`;
