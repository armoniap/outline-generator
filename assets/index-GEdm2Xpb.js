(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();function X(){const t=localStorage.getItem("openrouter_api_key"),e=localStorage.getItem("gemini_api_key"),n=document.getElementById("openrouterApiKey");t&&n&&(n.value=t);const i=document.getElementById("geminiApiKey");e&&i&&(i.value=e)}function ee(t,e){e.trim()&&localStorage.setItem(`${t}_api_key`,e)}function te(){X(),console.log("✅ AI Outline Generator inizializzato")}function ne(){const t=localStorage.getItem("dark_mode")==="true",e=document.getElementById("darkModeToggle"),n=document.getElementById("darkModeIcon");t&&(document.documentElement.classList.add("dark"),G(n,!0)),e&&e.addEventListener("click",()=>{const i=document.documentElement.classList.toggle("dark");localStorage.setItem("dark_mode",i.toString()),G(n,i)})}function G(t,e){t&&(t.innerHTML=e?'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>':'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>')}const ie="https://openrouter.ai/api/v1",z=3,M=1e3,y={SERP_SEARCH:"perplexity/sonar",OUTLINE_EXTRACTION:"openai/gpt-4o-mini",SEMANTIC_ANALYSIS:"anthropic/claude-3-5-sonnet-20241022",ASPECT_GENERATION:"anthropic/claude-3-5-sonnet-20241022",OUTLINE_GENERATION:"anthropic/claude-3-5-sonnet-20241022",FALLBACK_MODEL:"openai/gpt-3.5-turbo"},oe=["conclusione","conclusioni","chi siamo","chiama ora","contattaci","contatti","richiedi preventivo","preventivo","offerta","promozione","sconto","privacy policy","termini di servizio","cookie policy","disclaimer","footer","sidebar","menu","navigazione","breadcrumb","condividi","social","newsletter","iscriviti","seguici","testimonial","recensioni cliente","clienti","portfolio","servizi correlati","prodotti correlati","articoli correlati","biografia autore","autore","about us","team","staff","faq generiche","domande frequenti generiche","help","supporto","login","registrati","account","profilo utente"];async function E(t,e,n,i=1e3){if(!t||!e||!n)throw new Error("API key, model, and messages are required");const o=`${ie}/chat/completions`,s={model:e,messages:n,max_tokens:i,temperature:.7,top_p:1,frequency_penalty:0,presence_penalty:0};return await w(o,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,"HTTP-Referer":window.location.origin,"X-Title":"AI Outline Generator"},body:JSON.stringify(s)})}async function se(t,e){const n=[{role:"user",content:`Cerca su Google.it i primi 10 risultati per l'argomento "${e}". 
            
            IMPORTANTE: Cerca specificamente su Google Italia (google.it) per ottenere risultati in lingua italiana.
            
            Concentrati su:
            - Articoli di blog italiani
            - Guide complete in italiano
            - Pagine informative italiane
            - Risorse educative italiane
            - Siti web .it quando possibile
            
            Evita:
            - Pagine puramente commerciali/vendita
            - Post social media
            - Notizie brevi
            - Pagine senza contenuto sostanziale
            - Risultati in inglese se esistono alternative italiane
            
            Per ogni risultato fornisci:
            - URL del sito italiano
            - Titolo in italiano
            - Breve descrizione del contenuto
            
            Rispondi in formato JSON:
            {
                "results": [
                    {
                        "url": "https://example.it",
                        "title": "Titolo della pagina italiana",
                        "description": "Breve descrizione in italiano"
                    }
                ]
            }`}];try{const s=(await E(t,y.SERP_SEARCH,n,2e3)).choices[0].message.content.match(/\{[\s\S]*\}/);if(s)return JSON.parse(s[0]).results||[];throw new Error("Invalid response format from Perplexity")}catch(i){return console.warn("Perplexity search failed, using fallback with GPT-4o-mini:",i.message),await re(t,e)}}async function re(t,e){const n=[{role:"system",content:"Sei un assistente che genera URL e contenuti realistici per analisi competitor di siti web italiani."},{role:"user",content:`Genera 10 URL realistici di competitor italiani e descrizioni dei contenuti per l'argomento "${e}". Questi dovrebbero essere tipici siti che si posizionerebbero bene su Google.it per questo topic.
            
            Crea realistici:
            - Nomi di dominio italiani (come esempio1.it, blog.esempio2.com, marketing.example.it, etc.)
            - Titoli delle pagine in italiano
            - Brevi descrizioni di cosa conterrebbe ogni pagina
            
            Concentrati su tipi di contenuto educativi e informativi tipici del web italiano.
            
            Rispondi in formato JSON:
            {
                "results": [
                    {
                        "url": "https://esempio.it/pagina",
                        "title": "Titolo realistico della pagina",
                        "description": "Cosa conterrebbe questa pagina"
                    }
                ]
            }`}];try{const s=(await E(t,y.FALLBACK_MODEL,n,1500)).choices[0].message.content.match(/\{[\s\S]*\}/);if(s)return JSON.parse(s[0]).results||[];throw new Error("Invalid response format")}catch(i){return console.error("Error in fallback competitor search:",i),ae(e)}}function ae(t){return[{url:"https://marketing.esempio1.it/guida",title:`Guida Completa al ${t}`,description:`Guida completa che copre tutti gli aspetti del ${t}`},{url:"https://blog.digitalitalia.com/articolo",title:`${t}: Tutto quello che devi sapere`,description:`Articolo dettagliato che spiega i fondamenti del ${t}`},{url:"https://webmarketing.it/tutorial",title:`Come Padroneggiare il ${t}`,description:`Tutorial passo-passo per il ${t}`},{url:"https://consulenza.esempio4.it/consigli",title:`I 10 Migliori Consigli per il ${t}`,description:`Consigli esperti e best practice per il ${t}`},{url:"https://strategiadigitale.com/avanzate",title:`Strategie Avanzate di ${t}`,description:`Tecniche e strategie avanzate per il ${t}`},{url:"https://formazione.online.it/corso",title:`Corso Professionale di ${t}`,description:`Corso completo per professionisti del ${t}`},{url:"https://business.italia.net/case-study",title:`Case Study di Successo nel ${t}`,description:`Esempi reali di successo nel ${t}`}]}async function ce(t,e,n,i){const o=[{role:"system",content:"Sei un esperto nell'estrazione di outline da contenuti web. Il tuo compito è identificare la struttura gerarchica dei contenuti (H1, H2, H3) da una pagina web."},{role:"user",content:`Estrai l'outline strutturale dalla seguente pagina web:

URL: ${e}
Titolo: ${n}
Descrizione: ${i}

Identifica e restituisci:
1. Il titolo principale (H1)
2. I sottotitoli principali (H2)
3. I sotto-sottotitoli (H3)

Filtra ed escludi:
- Sezioni commerciali (contatti, preventivi, etc.)
- Elementi di navigazione
- Footer e sidebar
- Sezioni autore/biografia
- Call-to-action commerciali

Rispondi in formato:
H1: Titolo principale
H2: Primo sottotitolo
H3: Primo sotto-sottotitolo
H3: Secondo sotto-sottotitolo
H2: Secondo sottotitolo
H3: Terzo sotto-sottotitolo
... e così via

Se non riesci ad accedere al contenuto, prova a immaginare una struttura logica basata su titolo e descrizione.`}];try{const r=(await E(t,y.OUTLINE_EXTRACTION,o,1500)).choices[0].message.content.trim(),a=le(r);return{url:e,title:n,outline:a}}catch(s){throw console.error("Error extracting outline:",s),s}}function le(t){return t.split(`
`).filter(i=>{const o=i.toLowerCase();return!oe.some(s=>o.includes(s.toLowerCase()))}).join(`
`)}async function de(t,e){const n=[{role:"system",content:"Sei un esperto linguista e semantologo. Il tuo compito è creare un'analisi semantica completa e dettagliata di un argomento specifico."},{role:"user",content:`Think this step by step.
Topic=${e}
Write in italian a semantic lexicon:
1. Identify 5 salient entities (nouns) to the topic.
2. Identify 5 synonyms.
3. Create 5 categories to organize these entities. Name 5 significant entities within each category.
4. Offer 5 specific named examples for each of these entities.
5. Identify 5 attributes of each of these entities.
6. Apply semantic concepts to the topic and write down 5 salient entities for each semantic concept related to the topic.
7. Delve into 5 related linguistic categories and write down 5 related entities related to the topic for each category.
8. List 5 Part-Whole Relationships.
9. List 5 Common Collocations.
10. List 5 Related Statements.
11. List 5 Related Questions.
12. List 5 Common Errors/Misconceptions.
13. Detail 5 Current Debates.

Rispondi in formato JSON strutturato per facilitare l'elaborazione:
{
    "salientEntities": ["entità1", "entità2", "entità3", "entità4", "entità5"],
    "synonyms": ["sinonimo1", "sinonimo2", "sinonimo3", "sinonimo4", "sinonimo5"],
    "categories": {
        "categoria1": {
            "entities": ["entità1", "entità2", "entità3", "entità4", "entità5"],
            "examples": ["esempio1", "esempio2", "esempio3", "esempio4", "esempio5"],
            "attributes": ["attributo1", "attributo2", "attributo3", "attributo4", "attributo5"]
        },
        "categoria2": {
            "entities": ["entità1", "entità2", "entità3", "entità4", "entità5"],
            "examples": ["esempio1", "esempio2", "esempio3", "esempio4", "esempio5"],
            "attributes": ["attributo1", "attributo2", "attributo3", "attributo4", "attributo5"]
        },
        "categoria3": {
            "entities": ["entità1", "entità2", "entità3", "entità4", "entità5"],
            "examples": ["esempio1", "esempio2", "esempio3", "esempio4", "esempio5"],
            "attributes": ["attributo1", "attributo2", "attributo3", "attributo4", "attributo5"]
        },
        "categoria4": {
            "entities": ["entità1", "entità2", "entità3", "entità4", "entità5"],
            "examples": ["esempio1", "esempio2", "esempio3", "esempio4", "esempio5"],
            "attributes": ["attributo1", "attributo2", "attributo3", "attributo4", "attributo5"]
        },
        "categoria5": {
            "entities": ["entità1", "entità2", "entità3", "entità4", "entità5"],
            "examples": ["esempio1", "esempio2", "esempio3", "esempio4", "esempio5"],
            "attributes": ["attributo1", "attributo2", "attributo3", "attributo4", "attributo5"]
        }
    },
    "semanticConcepts": {
        "concetto1": ["entità1", "entità2", "entità3", "entità4", "entità5"],
        "concetto2": ["entità1", "entità2", "entità3", "entità4", "entità5"],
        "concetto3": ["entità1", "entità2", "entità3", "entità4", "entità5"],
        "concetto4": ["entità1", "entità2", "entità3", "entità4", "entità5"],
        "concetto5": ["entità1", "entità2", "entità3", "entità4", "entità5"]
    },
    "linguisticCategories": {
        "categoria1": ["entità1", "entità2", "entità3", "entità4", "entità5"],
        "categoria2": ["entità1", "entità2", "entità3", "entità4", "entità5"],
        "categoria3": ["entità1", "entità2", "entità3", "entità4", "entità5"],
        "categoria4": ["entità1", "entità2", "entità3", "entità4", "entità5"],
        "categoria5": ["entità1", "entità2", "entità3", "entità4", "entità5"]
    },
    "partWholeRelationships": ["relazione1", "relazione2", "relazione3", "relazione4", "relazione5"],
    "commonCollocations": ["collocazione1", "collocazione2", "collocazione3", "collocazione4", "collocazione5"],
    "relatedStatements": ["affermazione1", "affermazione2", "affermazione3", "affermazione4", "affermazione5"],
    "relatedQuestions": ["domanda1", "domanda2", "domanda3", "domanda4", "domanda5"],
    "commonErrors": ["errore1", "errore2", "errore3", "errore4", "errore5"],
    "currentDebates": ["dibattito1", "dibattito2", "dibattito3", "dibattito4", "dibattito5"]
}`}];try{const s=(await E(t,y.SEMANTIC_ANALYSIS,n,4e3)).choices[0].message.content.match(/\{[\s\S]*\}/);if(s)return JSON.parse(s[0]);throw new Error("Invalid response format")}catch(i){throw console.error("Error generating semantic analysis:",i),i}}async function ue(t,e,n){const i=[{role:"system",content:"Sei un esperto content strategist. Il tuo compito è analizzare le outline dei competitor e identificare tutti gli aspetti che dovrebbero essere trattati per creare un contenuto completo e competitivo su un argomento."},{role:"user",content:`Analizza queste outline dei competitor per l'argomento "${e}" e identifica tutti gli aspetti che dovrebbero essere trattati:

OUTLINE COMPETITOR:
${n.map((o,s)=>`
COMPETITOR ${s+1} (${o.title}):
${o.outline}
`).join(`
`)}

Identifica:
1. Aspetti comuni trattati da più competitor
2. Aspetti unici trovati in singoli competitor
3. Aspetti mancanti che potrebbero essere importanti
4. Sotto-aspetti specifici per ogni area tematica
5. Aspetti avanzati per utenti esperti
6. Aspetti base per principianti

Organizza tutto in categorie logiche e fornisci una lista completa di tutti gli aspetti da considerare per creare un contenuto esaustivo.

Rispondi in formato JSON:
{
    "aspectsByCategory": {
        "categoria1": [
            {
                "aspect": "Nome aspetto",
                "description": "Descrizione dettagliata",
                "priority": "high|medium|low",
                "foundInCompetitors": ["competitor1", "competitor2"],
                "isUnique": false,
                "isMissing": false
            }
        ]
    },
    "summary": {
        "totalAspects": 0,
        "highPriorityAspects": 0,
        "missingAspects": 0,
        "uniqueAspects": 0
    }
}`}];try{const r=(await E(t,y.ASPECT_GENERATION,i,3e3)).choices[0].message.content.match(/\{[\s\S]*\}/);if(r)return JSON.parse(r[0]);throw new Error("Invalid response format")}catch(o){throw console.error("Error generating aspects to treat:",o),o}}async function w(t,e,n=0){var i;try{const o=await fetch(t,e);if(!o.ok){const r=await o.json().catch(()=>({}));if(o.status===429&&n<z){const l=M*Math.pow(2,n);return console.warn(`Rate limited. Retrying in ${l}ms...`),await N(l),w(t,e,n+1)}if(o.status>=500&&n<z){const l=M*Math.pow(2,n);return console.warn(`Server error ${o.status}. Retrying in ${l}ms...`),await N(l),w(t,e,n+1)}const a=((i=r.error)==null?void 0:i.message)||r.message||"Unknown error",c=o.status===400?`Bad Request - Check API key and model availability. ${a}`:`HTTP ${o.status} - ${a}`;throw new Error(`OpenRouter API Error ${o.status}: ${c}`)}const s=await o.json();if(!s.choices||!s.choices[0]||!s.choices[0].message)throw new Error("Invalid response format from OpenRouter API");return s}catch(o){if(o.name==="TypeError"&&o.message.includes("fetch"))throw new Error("Errore di connessione. Verifica la tua connessione internet.");if(n<z&&(o.message.includes("network")||o.message.includes("timeout")||o.message.includes("fetch"))){const s=M*Math.pow(2,n);return console.warn(`Network error. Retrying in ${s}ms...`),await N(s),w(t,e,n+1)}throw o}}function N(t){return new Promise(e=>setTimeout(e,t))}async function me(t,e,n,i=!0){const o=[{role:"system",content:"Sei un esperto content strategist e SEO specialist. Il tuo compito è creare un'outline completa e semanticamente ottimizzata per un contenuto che deve coprire al 100% tutti gli aspetti di un argomento."},{role:"user",content:`Crea un'outline completa per l'argomento "${e}" utilizzando i seguenti dati:

OUTLINE COMPETITOR ANALIZZATE:
${n.competitors.map((s,r)=>`
${s.title}:
${s.outline}
`).join(`
`)}

ASPETTI DA TRATTARE SELEZIONATI:
${Object.entries(n.aspects||{}).map(([s,r])=>`
${s}:
${r.map(a=>`- ${a.aspect}: ${a.description}`).join(`
`)}
`).join(`
`)}

ELEMENTI SEMANTICI SELEZIONATI:
${JSON.stringify(n.semanticAnalysis,null,2)}

REQUISITI DELL'OUTLINE:
1. ${i?"Usa struttura H1, H2, H3 per massima profondità":"Usa solo H1 e H2 per struttura più semplice"}
2. Subheading in italiano perfetto, interessanti e coinvolgenti
3. Ogni subheading deve avere un argomento UNICO senza ripetizioni
4. Incorpora entità semantiche rilevanti nei titoli quando possibile
5. Usa domande come subheading quando è naturale e coinvolgente
6. Copri TUTTI gli aspetti importanti dell'argomento
7. Struttura logica e progressiva
8. Subheading che esprimono chiaramente cosa sarà trattato

FORMATO RICHIESTO:
H1: Titolo Principale
H2: Primo Argomento Principale
${i?`H3: Primo Sottoargomento
H3: Secondo Sottoargomento`:""}
H2: Secondo Argomento Principale
${i?`H3: Primo Sottoargomento
H3: Secondo Sottoargomento`:""}

IMPORTANTE: Rispondi SOLO con l'outline in formato markdown pulito, senza commenti, note o spiegazioni aggiuntive. Solo i titoli H1, H2, H3 con i relativi contenuti.`}];try{return(await E(t,y.SEMANTIC_ANALYSIS,o,3e3)).choices[0].message.content.trim().split(`
`).filter(l=>{const d=l.trim();return d.startsWith("#")||d===""}).join(`
`).trim()}catch(s){throw console.error("Error generating final outline:",s),s}}async function pe(t,e,n,i,o=[]){const s=[{role:"system",content:"Sei un esperto SEO e content strategist specializzato nella creazione di titoli semanticamente ottimizzati e descrittivi. Il tuo compito è creare subheading che non solo siano semanticamente coerenti, ma che spieghino chiaramente al lettore cosa aspettarsi nel paragrafo."},{role:"user",content:`Migliora questo subheading per l'argomento "${e}" creando un titolo che:
1. Massimizzi la coerenza semantica
2. Spieghi chiaramente cosa verrà trattato nel paragrafo
3. Sia coinvolgente e informativo per il lettore

SUBHEADING DA MIGLIORARE:
Livello: ${n.level}
Titolo attuale: "${n.text}"
Punteggio semantico attuale: ${Math.round((n.score||0)*100)}%

CONTESTO OUTLINE COMPLETA:
${i}

TERMINI SEMANTICI DISPONIBILI:
${o.slice(0,25).join(", ")}

OBIETTIVI DEL NUOVO SUBHEADING:
1. COERENZA SEMANTICA: Integra termini rilevanti per migliorare la correlazione con "${e}"
2. CHIAREZZA ESPOSITIVA: Il titolo deve far capire al lettore esattamente cosa imparerà
3. SPECIFICITÀ: Evita titoli generici, sii specifico su benefici, processi, o informazioni concrete
4. VALORE AGGIUNTO: Il lettore deve percepire il valore di leggere questa sezione

ESEMPI DI MIGLIORAMENTO:
- Da "Strumenti" a "I 10 Strumenti Essenziali per Automatizzare il Tuo Marketing Digitale"
- Da "Benefici" a "Come il Life Coaching Trasforma la Carriera: 5 Benefici Misurabili"
- Da "Implementazione" a "Guida Step-by-Step: Come Implementare una Strategia SEO in 30 Giorni"

FORMATO:
Mantieni il livello ${n.level} ma rendi il titolo descrittivo e specifico.

IMPORTANTE: Rispondi SOLO con il testo del titolo, senza prefissi markdown (##, ###) o etichette (H1:, H2:). Solo il testo pulito del subheading.`}];try{let a=(await E(t,y.SEMANTIC_ANALYSIS,s,150)).choices[0].message.content.trim();return a=a.replace(/^#{1,6}\s*/,""),a=a.replace(/^H[1-6]:\s*/,""),a}catch(r){throw console.error("Error generating subheading suggestion:",r),r}}class ge{constructor(){this.results={competitorUrls:[],competitorOutlines:[],semanticAnalysis:null,aspectsToTreat:null,selectedElements:{competitors:new Set,semanticElements:new Set,aspects:new Set}},this.progressCallback=null,this.statusCallback=null}setProgressCallback(e){this.progressCallback=e}setStatusCallback(e){this.statusCallback=e}updateProgress(e,n){this.progressCallback&&this.progressCallback(e,n)}updateStatus(e){this.statusCallback&&this.statusCallback(e)}async generateCompleteOutline(e,n){try{this.updateStatus("Iniziando la generazione..."),this.updateProgress(1,"Ricerca competitor nella SERP"),this.updateStatus("Cercando competitor nella SERP..."),this.results.competitorUrls=await se(e,n),this.updateProgress(2,"Estrazione outline competitor"),this.updateStatus("Estraendo outline dai competitor..."),this.results.competitorOutlines=[];for(let i=0;i<Math.min(this.results.competitorUrls.length,10);i++){const o=this.results.competitorUrls[i];try{const s=await ce(e,o.url,o.title,o.description);this.results.competitorOutlines.push(s),this.results.selectedElements.competitors.add(i)}catch(s){console.warn(`Failed to extract outline from ${o.url}:`,s)}}return this.updateProgress(3,"Analisi semantica completa"),this.updateStatus("Generando analisi semantica completa..."),this.results.semanticAnalysis=await de(e,n),this.selectAllSemanticElements(),this.updateProgress(4,"Generazione aspetti da trattare"),this.updateStatus("Identificando aspetti da trattare..."),this.results.aspectsToTreat=await ue(e,n,this.results.competitorOutlines),this.selectAllAspects(),this.updateProgress(5,"Compilazione risultati completata"),this.updateStatus("Generazione completata con successo!"),this.results}catch(i){throw this.updateStatus(`Errore durante la generazione: ${i.message}`),i}}selectAllSemanticElements(){var e,n;this.results.selectedElements.semanticElements.clear(),this.results.semanticAnalysis&&((e=this.results.semanticAnalysis.salientEntities)==null||e.forEach((i,o)=>{this.results.selectedElements.semanticElements.add(`salient_${o}`)}),(n=this.results.semanticAnalysis.synonyms)==null||n.forEach((i,o)=>{this.results.selectedElements.semanticElements.add(`synonym_${o}`)}),Object.keys(this.results.semanticAnalysis.categories||{}).forEach(i=>{var s;this.results.selectedElements.semanticElements.add(`category_${i}`),(s=this.results.semanticAnalysis.categories[i].entities)==null||s.forEach((r,a)=>{this.results.selectedElements.semanticElements.add(`category_${i}_entity_${a}`)})}),["partWholeRelationships","commonCollocations","relatedStatements","relatedQuestions","commonErrors","currentDebates"].forEach(i=>{var o;(o=this.results.semanticAnalysis[i])==null||o.forEach((s,r)=>{this.results.selectedElements.semanticElements.add(`${i}_${r}`)})}))}selectAllAspects(){var e;this.results.selectedElements.aspects.clear(),(e=this.results.aspectsToTreat)!=null&&e.aspectsByCategory&&Object.keys(this.results.aspectsToTreat.aspectsByCategory).forEach(n=>{this.results.aspectsToTreat.aspectsByCategory[n].forEach((o,s)=>{this.results.selectedElements.aspects.add(`${n}_${s}`)})})}deselectAllElements(){this.results.selectedElements.competitors.clear(),this.results.selectedElements.semanticElements.clear(),this.results.selectedElements.aspects.clear()}selectAllElements(){this.results.competitorOutlines.forEach((e,n)=>{this.results.selectedElements.competitors.add(n)}),this.selectAllSemanticElements(),this.selectAllAspects()}toggleCompetitorSelection(e){this.results.selectedElements.competitors.has(e)?this.results.selectedElements.competitors.delete(e):this.results.selectedElements.competitors.add(e)}toggleSemanticElementSelection(e){this.results.selectedElements.semanticElements.has(e)?this.results.selectedElements.semanticElements.delete(e):this.results.selectedElements.semanticElements.add(e)}toggleAspectSelection(e){this.results.selectedElements.aspects.has(e)?this.results.selectedElements.aspects.delete(e):this.results.selectedElements.aspects.add(e)}getSelectedData(){const e=this.results.competitorOutlines.filter((o,s)=>this.results.selectedElements.competitors.has(s)),n=this.extractSelectedSemanticData(),i=this.extractSelectedAspects();return{competitors:e,semanticAnalysis:n,aspects:i,counts:{competitors:e.length,semanticElements:this.results.selectedElements.semanticElements.size,aspects:this.results.selectedElements.aspects.size}}}extractSelectedSemanticData(){var o,s;if(!this.results.semanticAnalysis)return null;const e={},n=[];(o=this.results.semanticAnalysis.salientEntities)==null||o.forEach((r,a)=>{this.results.selectedElements.semanticElements.has(`salient_${a}`)&&n.push(r)}),n.length>0&&(e.salientEntities=n);const i=[];return(s=this.results.semanticAnalysis.synonyms)==null||s.forEach((r,a)=>{this.results.selectedElements.semanticElements.has(`synonym_${a}`)&&i.push(r)}),i.length>0&&(e.synonyms=i),e}extractSelectedAspects(){var n;if(!((n=this.results.aspectsToTreat)!=null&&n.aspectsByCategory))return null;const e={};return Object.keys(this.results.aspectsToTreat.aspectsByCategory).forEach(i=>{const o=this.results.aspectsToTreat.aspectsByCategory[i],s=[];o.forEach((r,a)=>{this.results.selectedElements.aspects.has(`${i}_${a}`)&&s.push(r)}),s.length>0&&(e[i]=s)}),e}getStatistics(){return{competitorCount:this.results.competitorOutlines.length,selectedCompetitorCount:this.results.selectedElements.competitors.size,totalSemanticElements:this.calculateTotalSemanticElements(),selectedSemanticElements:this.results.selectedElements.semanticElements.size,totalAspects:this.calculateTotalAspects(),selectedAspects:this.results.selectedElements.aspects.size}}calculateTotalSemanticElements(){var n,i;if(!this.results.semanticAnalysis)return 0;let e=0;return e+=((n=this.results.semanticAnalysis.salientEntities)==null?void 0:n.length)||0,e+=((i=this.results.semanticAnalysis.synonyms)==null?void 0:i.length)||0,Object.values(this.results.semanticAnalysis.categories||{}).forEach(o=>{var s;e+=((s=o.entities)==null?void 0:s.length)||0}),["partWholeRelationships","commonCollocations","relatedStatements","relatedQuestions","commonErrors","currentDebates"].forEach(o=>{var s;e+=((s=this.results.semanticAnalysis[o])==null?void 0:s.length)||0}),e}calculateTotalAspects(){var n;if(!((n=this.results.aspectsToTreat)!=null&&n.aspectsByCategory))return 0;let e=0;return Object.values(this.results.aspectsToTreat.aspectsByCategory).forEach(i=>{e+=i.length}),e}async generateFinalOutline(e,n,i=!0){try{this.updateStatus("Generando outline finale...");const o=this.getSelectedData(),s=await me(e,n,o,i);return this.updateStatus("Outline finale generata con successo!"),{outline:s,analytics:this.analyzeOutline(s)}}catch(o){throw this.updateStatus(`Errore durante la generazione: ${o.message}`),o}}analyzeOutline(e){const n=e.split(`
`).filter(a=>a.trim());let i=0,o=0,s=0,r=0;return n.forEach(a=>{const c=a.trim();c.startsWith("# ")?i++:c.startsWith("## ")?o++:c.startsWith("### ")?s++:c.startsWith("H1:")?i++:c.startsWith("H2:")?o++:c.startsWith("H3:")&&s++,c.includes("?")&&r++}),{h1Count:i,h2Count:o,h3Count:s,questionsCount:r,totalSections:i+o+s}}convertToMarkdown(e){return e.includes("# ")||e.includes("## ")||e.includes("### ")?e:e.split(`
`).map(n=>{const i=n.trim();return i.startsWith("H1:")?`# ${i.substring(3).trim()}`:i.startsWith("H2:")?`## ${i.substring(3).trim()}`:i.startsWith("H3:")?`### ${i.substring(3).trim()}`:n}).join(`
`)}}const u=new ge;function k(t="Caricamento in corso..."){const e=document.getElementById("loadingOverlay"),n=document.getElementById("loadingMessage");e&&n&&(n.textContent=t,e.classList.remove("hidden"))}function f(){const t=document.getElementById("loadingOverlay");t&&t.classList.add("hidden")}function m(t){V(t,"error")}function b(t){V(t,"success")}function V(t,e="info"){const n=document.createElement("div");n.className=`fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-lg z-50 animate-slide-up ${he(e)}`,n.innerHTML=`
        <div class="flex items-center">
            <div class="flex-shrink-0">
                ${fe(e)}
            </div>
            <div class="ml-3">
                <p class="text-sm font-medium">${t}</p>
            </div>
            <div class="ml-auto pl-3">
                <button class="inline-flex rounded-md hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <span class="sr-only">Chiudi</span>
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        </div>
    `,document.body.appendChild(n),setTimeout(()=>{n.parentElement&&n.remove()},5e3)}function he(t){const e={success:"bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",error:"bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800",warning:"bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800",info:"bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800"};return e[t]||e.info}function fe(t){const e={success:`<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>`,error:`<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>`,warning:`<svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>`,info:`<svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>`};return e[t]||e.info}function S(t,e=300){t.style.opacity="0",t.style.transition=`opacity ${e}ms ease-in-out`,setTimeout(()=>{t.style.opacity="1"},10)}const ye="https://generativelanguage.googleapis.com/v1beta",j="embedding-001",R=3,P=1e3;async function U(t,e,n="SEMANTIC_SIMILARITY"){if(!t||!e||!Array.isArray(e)||e.length===0)throw new Error("API key and non-empty texts array are required");const i=`${ye}/models/${j}:embedContent?key=${t}`,o=[];for(const s of e){if(!s||typeof s!="string"||s.trim().length===0)throw new Error("All texts must be non-empty strings");const r={model:`models/${j}`,content:{parts:[{text:s.trim()}]},taskType:n};try{const a=await I(i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(a.embedding&&a.embedding.values)o.push(a.embedding.values);else throw new Error("Invalid response format from Gemini API")}catch(a){throw console.error(`Error generating embedding for text: "${s.substring(0,50)}..."`,a),a}await A(100)}return o}async function I(t,e,n=0){var i;try{const o=await fetch(t,e);if(!o.ok){const r=await o.json().catch(()=>({}));if(o.status===429&&n<R){const l=P*Math.pow(2,n);return console.warn(`Rate limited. Retrying in ${l}ms...`),await A(l),I(t,e,n+1)}if(o.status>=500&&n<R){const l=P*Math.pow(2,n);return console.warn(`Server error ${o.status}. Retrying in ${l}ms...`),await A(l),I(t,e,n+1)}const a=((i=r.error)==null?void 0:i.message)||r.message||"Unknown error",c=o.status===400?`Bad Request - Check API key and request format. ${a}`:o.status===403?`Forbidden - Check API key permissions. ${a}`:`HTTP ${o.status} - ${a}`;throw new Error(`Gemini API Error ${o.status}: ${c}`)}return await o.json()}catch(o){if(o.name==="TypeError"&&o.message.includes("fetch"))throw new Error("Errore di connessione. Verifica la tua connessione internet.");if(n<R&&(o.message.includes("network")||o.message.includes("timeout")||o.message.includes("fetch"))){const s=P*Math.pow(2,n);return console.warn(`Network error. Retrying in ${s}ms...`),await A(s),I(t,e,n+1)}throw o}}function A(t){return new Promise(e=>setTimeout(e,t))}function W(t,e){if(!t||!e||t.length!==e.length)throw new Error("Invalid vectors for cosine similarity calculation");let n=0,i=0,o=0;for(let r=0;r<t.length;r++)n+=t[r]*e[r],i+=t[r]*t[r],o+=e[r]*e[r];const s=Math.sqrt(i)*Math.sqrt(o);return s===0?0:n/s}function C(t){return t>=.8?"excellent":t>=.6?"good":t>=.4?"fair":"poor"}function q(t){const e={excellent:"text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900",good:"text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900",fair:"text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900",poor:"text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900"};return e[t]||e.poor}function v(t){return`${Math.round(t*100)}%`}function F(t){return!t||t.length===0?0:t.reduce((e,n)=>e+n,0)/t.length}class Ee{constructor(){this.geminiApiKey=null,this.openrouterApiKey=null,this.currentTopic=null,this.topicEmbedding=null,this.headings=[],this.semanticTerms=[]}setApiKeys(e,n){this.geminiApiKey=e,this.openrouterApiKey=n}setSemanticTerms(e){this.semanticTerms=this.extractSemanticTermsFromData(e)}extractSemanticTermsFromData(e){const n=[];return e.salientEntities&&n.push(...e.salientEntities),e.synonyms&&n.push(...e.synonyms),e.categories&&Object.values(e.categories).forEach(i=>{i.entities&&n.push(...i.entities),i.examples&&n.push(...i.examples),i.attributes&&n.push(...i.attributes)}),["partWholeRelationships","commonCollocations","relatedStatements","relatedQuestions","commonErrors","currentDebates"].forEach(i=>{e[i]&&n.push(...e[i])}),[...new Set(n)].filter(i=>i&&typeof i=="string"&&i.trim().length>0).map(i=>i.trim())}parseOutline(e){const n=e.split(`
`).filter(o=>o.trim()),i=[];return n.forEach((o,s)=>{const r=o.trim();let a=null,c="";r.startsWith("### ")?(a="H3",c=r.substring(4).trim()):r.startsWith("## ")?(a="H2",c=r.substring(3).trim()):r.startsWith("# ")?(a="H1",c=r.substring(2).trim()):r.startsWith("H1:")?(a="H1",c=r.substring(3).trim()):r.startsWith("H2:")?(a="H2",c=r.substring(3).trim()):r.startsWith("H3:")&&(a="H3",c=r.substring(3).trim()),a&&c&&i.push({id:`heading_${s}`,level:a,text:c,original:o,score:null,scoreLevel:null,embedding:null})}),i}async analyzeOutlineSemanticCoherence(e,n){if(!this.geminiApiKey)throw new Error("Gemini API key is required for semantic analysis");if(this.currentTopic=e,this.headings=this.parseOutline(n),this.headings.length===0)throw new Error("No valid headings found in outline");const i=[e,...this.headings.map(o=>o.text)];try{const o=await U(this.geminiApiKey,i);this.topicEmbedding=o[0];const s=o.slice(1);this.headings.forEach((d,p)=>{d.embedding=s[p],d.score=W(this.topicEmbedding,d.embedding),d.scoreLevel=C(d.score)});const r=this.headings.map(d=>d.score),a=F(r),c=C(a),l={totalHeadings:this.headings.length,overallScore:a,overallLevel:c,scoreDistribution:this.calculateScoreDistribution()};return{headings:this.headings,statistics:l,topic:e}}catch(o){throw console.error("Error in semantic analysis:",o),o}}calculateScoreDistribution(){const e={excellent:0,good:0,fair:0,poor:0};return this.headings.forEach(n=>{e[n.scoreLevel]++}),e}async recalculateHeadingScore(e,n){if(!this.topicEmbedding||!this.geminiApiKey)throw new Error("Topic embedding not available. Run full analysis first.");try{const o=(await U(this.geminiApiKey,[n]))[0],s=W(this.topicEmbedding,o),r=C(s),a=this.headings.findIndex(c=>c.id===e);if(a>=0){const c=this.headings[a].score;return this.headings[a].text=n,this.headings[a].score=s,this.headings[a].scoreLevel=r,this.headings[a].embedding=o,{score:s,scoreLevel:r,oldScore:c,improvement:s-c}}return{score:s,scoreLevel:r,oldScore:null,improvement:null}}catch(i){throw console.error("Error recalculating heading score:",i),i}}async generateAISuggestion(e){if(!this.openrouterApiKey||!this.currentTopic)throw new Error("OpenRouter API key and topic are required for AI suggestions");const n=this.headings.find(o=>o.id===e);if(!n)throw new Error("Heading not found");const i=this.getCurrentOutlineText();try{return await pe(this.openrouterApiKey,this.currentTopic,n,i,this.semanticTerms)}catch(o){throw console.error("Error generating AI suggestion:",o),o}}getCurrentOutlineText(){return this.headings.map(e=>(e.level==="H1"?"# ":e.level==="H2"?"## ":"### ")+e.text).join(`
`)}getUpdatedStatistics(){const e=this.headings.map(o=>o.score).filter(o=>o!==null),n=F(e),i=C(n);return{totalHeadings:this.headings.length,overallScore:n,overallLevel:i,scoreDistribution:this.calculateScoreDistribution()}}}const h=new Ee;function be(t,e){const n=document.getElementById("phase3Section");n&&(n.classList.remove("hidden"),S(n),n.scrollIntoView({behavior:"smooth"}),n.dataset.outlineText=t,n.dataset.topic=e,ve())}function ve(){const t=document.getElementById("startSemanticAnalysisBtn"),e=document.getElementById("copyFinalOutlineBtn");t&&t.addEventListener("click",Se),e&&e.addEventListener("click",Ne)}async function Se(){var t;try{const e=document.getElementById("geminiApiKey").value.trim(),n=document.getElementById("openrouterApiKey").value.trim(),i=document.getElementById("phase3Section"),o=i.dataset.outlineText,s=i.dataset.topic;if(!e){m("API key di Google Gemini richiesta per l'analisi semantica.");return}if(!n){m("API key di OpenRouter richiesta per i suggerimenti AI.");return}if(!o||!s){m("Nessuna outline trovata. Completa prima la Fase 2.");return}k("Analizzando coerenza semantica..."),h.setApiKeys(e,n);const r=(t=window.outlineGenerator)==null?void 0:t.getSelectedData();r!=null&&r.semanticAnalysis&&h.setSemanticTerms(r.semanticAnalysis);const a=await h.analyzeOutlineSemanticCoherence(s,o);xe(a),f(),b("Analisi semantica completata con successo!")}catch(e){f(),m(`Errore durante l'analisi semantica: ${e.message}`),console.error("Semantic analysis error:",e)}}function xe(t){const e=document.getElementById("semanticAnalysisResults");e&&(e.classList.remove("hidden"),S(e),J(t.statistics),Q(t.statistics.scoreDistribution),Ce(t.headings))}function J(t){const e=document.getElementById("overallScore");if(e){const n=q(t.overallLevel);e.className=`px-3 py-1 rounded-full text-sm font-medium ${n}`,e.textContent=`Punteggio Complessivo: ${v(t.overallScore)}`}}function Q(t){const e={excellentCount:document.getElementById("excellentCount"),goodCount:document.getElementById("goodCount"),fairCount:document.getElementById("fairCount"),poorCount:document.getElementById("poorCount")};e.excellentCount&&(e.excellentCount.textContent=t.excellent),e.goodCount&&(e.goodCount.textContent=t.good),e.fairCount&&(e.fairCount.textContent=t.fair),e.poorCount&&(e.poorCount.textContent=t.poor)}function Ce(t){const e=document.getElementById("interactiveOutlineEditor");e&&(e.innerHTML="",t.forEach((n,i)=>{const o=we(n);e.appendChild(o)}))}function we(t,e){const n=document.createElement("div");n.className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600",n.dataset.headingId=t.id;const i=q(t.scoreLevel);return n.innerHTML=`
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">${t.level}</span>
                <span class="px-2 py-1 text-xs rounded-full ${i}">
                    ${v(t.score)}
                </span>
            </div>
            <div class="flex items-center space-x-2">
                <button class="ai-suggest-btn bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded transition-colors" data-heading-id="${t.id}">
                    🤖 Suggerimento AI
                </button>
                <button class="edit-btn bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded transition-colors" data-heading-id="${t.id}">
                    ✏️ Modifica
                </button>
                <button class="delete-btn bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition-colors" data-heading-id="${t.id}">
                    🗑️ Elimina
                </button>
            </div>
        </div>
        <div class="heading-content">
            <div class="heading-display font-medium text-gray-900 dark:text-white">
                ${t.text}
            </div>
            <div class="heading-edit hidden">
                <input type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" value="${t.text}">
                <div class="flex justify-end space-x-2 mt-2">
                    <button class="cancel-edit-btn bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded transition-colors">
                        Annulla
                    </button>
                    <button class="confirm-edit-btn bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded transition-colors">
                        Conferma
                    </button>
                </div>
            </div>
        </div>
        <div class="score-change-indicator mt-2 hidden">
            <!-- Score change will be shown here -->
        </div>
    `,Ie(n,t),n}function Ie(t,e){const n=t.querySelector(".ai-suggest-btn"),i=t.querySelector(".edit-btn"),o=t.querySelector(".delete-btn"),s=t.querySelector(".cancel-edit-btn"),r=t.querySelector(".confirm-edit-btn"),a=t.querySelector("input");n&&n.addEventListener("click",()=>Le(e.id)),i&&i.addEventListener("click",()=>Ae(t)),o&&o.addEventListener("click",()=>Be(e.id,t)),s&&s.addEventListener("click",()=>H(t)),r&&r.addEventListener("click",()=>D(t,e.id)),a&&a.addEventListener("keydown",c=>{c.key==="Enter"?D(t,e.id):c.key==="Escape"&&H(t)})}function Ae(t){const e=t.querySelector(".heading-display"),n=t.querySelector(".heading-edit");if(e&&n){e.classList.add("hidden"),n.classList.remove("hidden");const i=n.querySelector("input");i&&(i.focus(),i.select())}}function H(t){const e=t.querySelector(".heading-display"),n=t.querySelector(".heading-edit");e&&n&&(e.classList.remove("hidden"),n.classList.add("hidden"))}async function D(t,e){const n=t.querySelector("input");if(!n)return;const i=n.value.trim();if(!i){m("Il testo del subheading non può essere vuoto.");return}try{k("Ricalcolando punteggio...");const o=await h.recalculateHeadingScore(e,i);ke(t,i,o),H(t),Y(),f(),Te(t,o)}catch(o){f(),m(`Errore durante il ricalcolo: ${o.message}`),console.error("Recalculation error:",o)}}function ke(t,e,n){const i=t.querySelector(".heading-display"),o=t.querySelector(".px-2.py-1");if(i&&(i.textContent=e),o){const s=q(n.scoreLevel);o.className=`px-2 py-1 text-xs rounded-full ${s}`,o.textContent=v(n.score)}}function Te(t,e){const n=t.querySelector(".score-change-indicator");if(!n||e.improvement===null)return;const i=e.improvement,o=i>0,s=o?`+${v(Math.abs(i))}`:`-${v(Math.abs(i))}`,r=o?"text-green-600 dark:text-green-400":"text-red-600 dark:text-red-400";n.innerHTML=`
        <div class="text-xs ${r}">
            ${o?"📈":"📉"} ${s}
        </div>
    `,n.classList.remove("hidden"),setTimeout(()=>{n.classList.add("hidden")},3e3)}async function Le(t){try{k("Generando suggerimento AI...");const e=await h.generateAISuggestion(t);f(),$e(t,e)}catch(e){f(),m(`Errore durante la generazione del suggerimento: ${e.message}`),console.error("AI suggestion error:",e)}}function $e(t,e){const n=document.createElement("div");n.className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",n.innerHTML=`
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg mx-4 w-full">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🤖 Suggerimento AI Ottimizzato
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Questo suggerimento è stato ottimizzato per massimizzare la coerenza semantica e spiegare chiaramente cosa verrà trattato nel paragrafo:
            </p>
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
                <p class="text-blue-800 dark:text-blue-200 font-medium">${e}</p>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-4">
                💡 Il suggerimento integra termini semantici rilevanti e rende il titolo più descrittivo e coinvolgente
            </div>
            <div class="flex justify-end space-x-3">
                <button class="cancel-suggestion bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
                    Annulla
                </button>
                <button class="apply-suggestion bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded transition-colors">
                    Applica Suggerimento
                </button>
            </div>
        </div>
    `;const i=n.querySelector(".cancel-suggestion"),o=n.querySelector(".apply-suggestion");i&&i.addEventListener("click",()=>{document.body.removeChild(n)}),o&&o.addEventListener("click",async()=>{document.body.removeChild(n),await Oe(t,e)}),n.addEventListener("click",s=>{s.target===n&&document.body.removeChild(n)}),document.body.appendChild(n)}async function Oe(t,e){const n=document.querySelector(`[data-heading-id="${t}"]`);if(!n)return;const i=n.querySelector("input");i&&(i.value=e,await D(n,t))}function Y(){const t=h.getUpdatedStatistics();J(t),Q(t.scoreDistribution)}function Be(t,e){ze(t,e)}function ze(t,e){const n=h.headings.find(r=>r.id===t);if(!n)return;const i=document.createElement("div");i.className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",i.innerHTML=`
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 w-full">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🗑️ Conferma Eliminazione
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
                Sei sicuro di voler eliminare questo subheading?
            </p>
            <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4">
                <p class="text-sm font-medium text-gray-900 dark:text-white">${n.level}: ${n.text}</p>
            </div>
            <div class="flex justify-end space-x-3">
                <button class="cancel-delete bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
                    Annulla
                </button>
                <button class="confirm-delete bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors">
                    Elimina
                </button>
            </div>
        </div>
    `;const o=i.querySelector(".cancel-delete"),s=i.querySelector(".confirm-delete");o&&o.addEventListener("click",()=>{document.body.removeChild(i)}),s&&s.addEventListener("click",()=>{document.body.removeChild(i),Me(t,e)}),i.addEventListener("click",r=>{r.target===i&&document.body.removeChild(i)}),document.body.appendChild(i)}function Me(t,e){try{const n=h.headings.findIndex(i=>i.id===t);n>=0&&h.headings.splice(n,1),e.remove(),Y(),b("Subheading eliminato con successo!")}catch(n){m(`Errore durante l'eliminazione: ${n.message}`),console.error("Delete error:",n)}}function Ne(){try{const t=h.getCurrentOutlineText();navigator.clipboard.writeText(t).then(()=>{b("Outline finale copiata in formato Markdown!");const e=document.getElementById("copyFinalOutlineBtn");if(e){const n=e.innerHTML;e.innerHTML="✅ Copiato!",e.classList.add("bg-green-700"),e.classList.remove("bg-green-600"),setTimeout(()=>{e.innerHTML=n,e.classList.remove("bg-green-700"),e.classList.add("bg-green-600")},2e3)}}).catch(e=>{console.error("Error copying to clipboard:",e),m("Errore durante la copia negli appunti.")})}catch(t){m("Nessuna outline modificata da copiare."),console.error("Copy error:",t)}}function _(t){Pe(t.competitorOutlines),He(t.semanticAnalysis),_e(t.aspectsToTreat),T(),Re()}function Re(){const t=document.getElementById("resultsSection");t&&(t.classList.remove("hidden"),S(t))}function Pe(t){const e=document.getElementById("competitorSection"),n=document.getElementById("competitorOutlines");!e||!n||!t||(n.innerHTML="",t.forEach((i,o)=>{const s=document.createElement("div");s.className="competitor-outline-item border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4";const r=document.createElement("div");r.className="flex items-center justify-between mb-3";const a=document.createElement("div");a.className="flex-1";const c=document.createElement("h3");c.className="font-semibold text-gray-900 dark:text-white text-sm",c.textContent=i.title||`Competitor ${o+1}`;const l=document.createElement("a");l.className="text-xs text-blue-600 dark:text-blue-400 hover:underline",l.href=i.url,l.target="_blank",l.textContent=i.url,a.appendChild(c),a.appendChild(l);const d=document.createElement("input");d.type="checkbox",d.id=`competitor-${o}`,d.checked=u.results.selectedElements.competitors.has(o),d.className="ml-4",d.addEventListener("change",()=>{u.toggleCompetitorSelection(o),T()}),r.appendChild(a),r.appendChild(d);const p=document.createElement("div");p.className="outline-content bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm font-mono whitespace-pre-line",p.textContent=i.outline||"Nessuna outline estratta",s.appendChild(r),s.appendChild(p),n.appendChild(s)}))}function He(t){const e=document.getElementById("semanticSection"),n=document.getElementById("semanticAnalysis");!e||!n||!t||(n.innerHTML="",g("Entità Principali",t.salientEntities,"salient",n),g("Sinonimi",t.synonyms,"synonym",n),t.categories&&Object.keys(t.categories).forEach(i=>{const o=t.categories[i];De(i,o,n)}),g("Relazioni Tutto-Parte",t.partWholeRelationships,"partWholeRelationships",n),g("Collocazioni Comuni",t.commonCollocations,"commonCollocations",n),g("Affermazioni Correlate",t.relatedStatements,"relatedStatements",n),g("Domande Correlate",t.relatedQuestions,"relatedQuestions",n),g("Errori Comuni",t.commonErrors,"commonErrors",n),g("Dibattiti Attuali",t.currentDebates,"currentDebates",n))}function g(t,e,n,i){if(!e||!Array.isArray(e)||e.length===0)return;const o=document.createElement("div");o.className="semantic-section mb-6";const s=document.createElement("h4");s.className="font-semibold text-gray-900 dark:text-white mb-3",s.textContent=t;const r=document.createElement("div");r.className="flex flex-wrap gap-2",e.forEach((a,c)=>{const l=document.createElement("span");l.className="semantic-item px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm cursor-pointer border border-transparent hover:border-blue-300",l.textContent=a,l.dataset.elementId=`${n}_${c}`,u.results.selectedElements.semanticElements.has(`${n}_${c}`)&&(l.classList.add("selected"),l.classList.add("bg-green-100","dark:bg-green-900","text-green-800","dark:text-green-200"),l.classList.remove("bg-blue-100","dark:bg-blue-900","text-blue-800","dark:text-blue-200")),l.addEventListener("click",()=>{u.toggleSemanticElementSelection(`${n}_${c}`),Ge(l),T()}),r.appendChild(l)}),o.appendChild(s),o.appendChild(r),i.appendChild(o)}function De(t,e,n){if(!e||!e.entities)return;const i=document.createElement("div");i.className="semantic-category mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg";const o=document.createElement("h4");o.className="font-semibold text-gray-900 dark:text-white mb-3",o.textContent=`Categoria: ${t}`,i.appendChild(o),g("Entità",e.entities,`category_${t}_entity`,i),e.examples&&g("Esempi",e.examples,`category_${t}_example`,i),e.attributes&&g("Attributi",e.attributes,`category_${t}_attribute`,i),n.appendChild(i)}function _e(t){const e=document.getElementById("aspectsSection"),n=document.getElementById("aspectsList");!e||!n||!t||(n.innerHTML="",t.aspectsByCategory&&Object.keys(t.aspectsByCategory).forEach(i=>{const o=t.aspectsByCategory[i],s=document.createElement("div");s.className="aspects-category mb-6";const r=document.createElement("h4");r.className="font-semibold text-gray-900 dark:text-white mb-3",r.textContent=i,s.appendChild(r),o.forEach((a,c)=>{const l=document.createElement("div");l.className="aspect-item flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg mb-2";const d=document.createElement("input");d.type="checkbox",d.id=`aspect-${i}-${c}`,d.checked=u.results.selectedElements.aspects.has(`${i}_${c}`),d.className="mt-1",d.addEventListener("change",()=>{u.toggleAspectSelection(`${i}_${c}`),T()});const p=document.createElement("div");p.className="flex-1";const L=document.createElement("h5");L.className="font-medium text-gray-900 dark:text-white",L.textContent=a.aspect;const $=document.createElement("p");$.className="text-sm text-gray-600 dark:text-gray-400 mt-1",$.textContent=a.description;const x=document.createElement("div");x.className="flex items-center space-x-4 mt-2";const O=document.createElement("span");if(O.className=`px-2 py-1 text-xs rounded-full ${qe(a.priority)}`,O.textContent=a.priority,x.appendChild(O),a.foundInCompetitors&&a.foundInCompetitors.length>0){const B=document.createElement("span");B.className="text-xs text-gray-500 dark:text-gray-400",B.textContent=`Trovato in ${a.foundInCompetitors.length} competitor`,x.appendChild(B)}p.appendChild(L),p.appendChild($),p.appendChild(x),l.appendChild(d),l.appendChild(p),s.appendChild(l)}),n.appendChild(s)}))}function qe(t){const e={high:"bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",medium:"bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",low:"bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"};return e[t]||e.medium}function Ge(t){t.classList.contains("selected")?(t.classList.remove("selected"),t.classList.remove("bg-green-100","dark:bg-green-900","text-green-800","dark:text-green-200"),t.classList.add("bg-blue-100","dark:bg-blue-900","text-blue-800","dark:text-blue-200")):(t.classList.add("selected"),t.classList.add("bg-green-100","dark:bg-green-900","text-green-800","dark:text-green-200"),t.classList.remove("bg-blue-100","dark:bg-blue-900","text-blue-800","dark:text-blue-200"))}function T(){const t=u.getStatistics(),e=document.getElementById("competitorCount");e&&(e.textContent=`${t.selectedCompetitorCount}/${t.competitorCount}`);const n=document.getElementById("semanticCount");n&&(n.textContent=`${t.selectedSemanticElements}/${t.totalSemanticElements}`);const i=document.getElementById("aspectCount");i&&(i.textContent=`${t.selectedAspects}/${t.totalAspects}`);const o=document.getElementById("statsCard");o&&t.competitorCount>0&&o.classList.remove("hidden");const s=document.getElementById("proceedBtn");if(s){const r=t.selectedCompetitorCount>0||t.selectedSemanticElements>0||t.selectedAspects>0;s.disabled=!r}}function je(){const t=document.getElementById("selectAllBtn"),e=document.getElementById("deselectAllBtn"),n=document.getElementById("proceedBtn");t&&t.addEventListener("click",()=>{u.selectAllElements(),_(u.results)}),e&&e.addEventListener("click",()=>{u.deselectAllElements(),_(u.results)}),n&&n.addEventListener("click",()=>{Ue()})}function Ue(){const t=u.getSelectedData(),e=document.getElementById("phase2Section");e&&(e.classList.remove("hidden"),S(e),e.scrollIntoView({behavior:"smooth"})),We(t),Fe()}function We(t){const e=document.getElementById("selectedSummary");e&&(e.innerHTML=`
        <div>• <strong>Competitor:</strong> ${t.counts.competitors} selezionati</div>
        <div>• <strong>Elementi Semantici:</strong> ${t.counts.semanticElements} selezionati</div>
        <div>• <strong>Aspetti da Trattare:</strong> ${t.counts.aspects} selezionati</div>
    `)}function Fe(){const t=document.getElementById("generateOutlineBtn"),e=document.getElementById("copyMarkdownBtn");t&&(t.replaceWith(t.cloneNode(!0)),document.getElementById("generateOutlineBtn").addEventListener("click",async()=>{await Ke()})),e&&(e.replaceWith(e.cloneNode(!0)),document.getElementById("copyMarkdownBtn").addEventListener("click",()=>{Ye()}))}async function Ke(){try{const t=document.getElementById("openrouterApiKey").value.trim(),e=document.getElementById("topicInput").value.trim(),n=document.getElementById("includeH3").checked;if(!t||!e){m("API key e topic sono richiesti per generare l'outline.");return}k("Generando outline finale..."),console.log("Starting outline generation with:",{topic:e,includeH3:n});const i=await u.generateFinalOutline(t,e,n);if(console.log("Generation result:",i),!i||!i.outline)throw new Error("Nessuna outline ricevuta dal servizio");Ve(i.outline,i.analytics),f(),b("Outline finale generata con successo!")}catch(t){f(),m(`Errore durante la generazione: ${t.message}`),console.error("Outline generation error:",t)}}function Ve(t,e){const n=document.getElementById("generatedOutlineSection"),i=document.getElementById("generatedOutlineContent");if(!n||!i){console.error("Generated outline elements not found");return}if(console.log("Displaying outline:",t?t.substring(0,100):"EMPTY"),!t||t.trim().length===0){m("Nessuna outline generata. Riprova.");return}i.textContent="",i.textContent=t,n.classList.remove("hidden"),S(n),Qe(e),Je(n,t),setTimeout(()=>{n.scrollIntoView({behavior:"smooth"})},100)}function Je(t,e){const n=t.querySelector(".phase3-btn-container");n&&n.remove();const i=document.createElement("div");i.className="mt-4 text-center phase3-btn-container";const o=document.createElement("button");o.id="proceedToPhase3Btn",o.className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-md transition-colors text-lg",o.innerHTML="🧠 Procedi alla Fase 3: Analisi Semantica",o.onclick=()=>{const s=document.getElementById("topicInput").value.trim();be(e,s)},i.appendChild(o),t.appendChild(i)}function Qe(t){const e={h2Count:document.getElementById("h2Count"),h3Count:document.getElementById("h3Count"),questionsCount:document.getElementById("questionsCount"),totalSections:document.getElementById("totalSections")};e.h2Count&&(e.h2Count.textContent=t.h2Count),e.h3Count&&(e.h3Count.textContent=t.h3Count),e.questionsCount&&(e.questionsCount.textContent=t.questionsCount),e.totalSections&&(e.totalSections.textContent=t.totalSections)}function Ye(){const t=document.getElementById("generatedOutlineContent");if(!t||!t.textContent){m("Nessuna outline da copiare.");return}const e=t.textContent,n=u.convertToMarkdown(e);navigator.clipboard.writeText(n).then(()=>{b("Outline copiata in formato Markdown!");const i=document.getElementById("copyMarkdownBtn");if(i){const o=i.innerHTML;i.innerHTML="✅ Copiato!",i.classList.add("bg-green-600"),i.classList.remove("bg-blue-600"),setTimeout(()=>{i.innerHTML=o,i.classList.remove("bg-green-600"),i.classList.add("bg-blue-600")},2e3)}}).catch(i=>{console.error("Error copying to clipboard:",i),m("Errore durante la copia negli appunti.")})}function Ze(){Xe(),et(),tt(),it(),je()}function Xe(){const t=document.getElementById("toggleOpenrouterApiKey"),e=document.getElementById("toggleGeminiApiKey");t&&t.addEventListener("click",()=>{K("openrouterApiKey","openrouterEyeIcon")}),e&&e.addEventListener("click",()=>{K("geminiApiKey","geminiEyeIcon")})}function K(t,e){const n=document.getElementById(t),i=document.getElementById(e);if(!n||!i)return;const o=n.type==="password";n.type=o?"text":"password",i.innerHTML=o?'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />':'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />'}function et(){["openrouterApiKey","geminiApiKey","topicInput"].forEach(e=>{const n=document.getElementById(e);n&&n.addEventListener("input",()=>{if(e.includes("ApiKey")){const i=e.replace("ApiKey","");ee(i,n.value)}setTimeout(()=>Z(),0)})})}function tt(){const t=document.getElementById("generateBtn");t&&t.addEventListener("click",nt)}async function nt(){try{const t=document.getElementById("openrouterApiKey").value.trim(),e=document.getElementById("topicInput").value.trim();if(!Z())return;console.log("Skipping API key validation, proceeding with generation...");const n=await u.generateCompleteOutline(t,e);_(n),f(),b("Generazione completata con successo!")}catch(t){f(),m(`Errore durante la generazione: ${t.message}`),console.error("Generation error:",t)}}function it(){u.setProgressCallback((t,e)=>{ot(t,e)}),u.setStatusCallback(t=>{st(t)})}function ot(t,e){const n=document.getElementById("progressSection"),i=document.getElementById(`step${t}`);if(n&&n.classList.remove("hidden"),i){const o=i.querySelector(".w-4.h-4.rounded-full"),s=i.querySelector("span");o&&(o.className="w-4 h-4 rounded-full bg-blue-500"),s&&(s.textContent=e,s.className="text-sm font-medium text-blue-600 dark:text-blue-400");for(let r=1;r<t;r++){const a=document.getElementById(`step${r}`);if(a){const c=a.querySelector(".w-4.h-4.rounded-full");c&&(c.className="w-4 h-4 rounded-full bg-green-500");const l=a.querySelector("span");l&&(l.className="text-sm text-green-600 dark:text-green-400")}}}}function st(t){const e=document.getElementById("statusMessage");e&&(e.textContent=t)}function Z(){const t=document.getElementById("openrouterApiKey").value.trim(),e=document.getElementById("topicInput").value.trim(),n=document.getElementById("generateBtn"),i=document.getElementById("generateHelp");let o=!0,s="";return t?e?e.length<3&&(o=!1,s="L'argomento deve essere di almeno 3 caratteri"):(o=!1,s="Inserisci un argomento/topic da analizzare"):(o=!1,s="Inserisci la tua API key di OpenRouter"),n&&(n.disabled=!o),i&&(s?(i.textContent=s,i.classList.remove("hidden")):i.classList.add("hidden")),o}document.addEventListener("DOMContentLoaded",()=>{te(),ne(),Ze(),window.outlineGenerator=u,document.body.classList.add("loaded")});
