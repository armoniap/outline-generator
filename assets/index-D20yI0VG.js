(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();function N(){const t=localStorage.getItem("openrouter_api_key"),e=document.getElementById("openrouterApiKey");t&&e&&(e.value=t)}function M(t,e){e.trim()&&localStorage.setItem(`${t}_api_key`,e)}function P(){N(),console.log("✅ AI Outline Generator inizializzato")}function R(){const t=localStorage.getItem("dark_mode")==="true",e=document.getElementById("darkModeToggle"),n=document.getElementById("darkModeIcon");t&&(document.documentElement.classList.add("dark"),O(n,!0)),e&&e.addEventListener("click",()=>{const i=document.documentElement.classList.toggle("dark");localStorage.setItem("dark_mode",i.toString()),O(n,i)})}function O(t,e){t&&(t.innerHTML=e?'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>':'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>')}const _="https://openrouter.ai/api/v1",A=3,x=1e3,g={SERP_SEARCH:"perplexity/sonar",OUTLINE_EXTRACTION:"openai/gpt-4o-mini",SEMANTIC_ANALYSIS:"anthropic/claude-3-5-sonnet-20241022",ASPECT_GENERATION:"anthropic/claude-3-5-sonnet-20241022",OUTLINE_GENERATION:"anthropic/claude-3-5-sonnet-20241022",FALLBACK_MODEL:"openai/gpt-3.5-turbo"},H=["conclusione","conclusioni","chi siamo","chiama ora","contattaci","contatti","richiedi preventivo","preventivo","offerta","promozione","sconto","privacy policy","termini di servizio","cookie policy","disclaimer","footer","sidebar","menu","navigazione","breadcrumb","condividi","social","newsletter","iscriviti","seguici","testimonial","recensioni cliente","clienti","portfolio","servizi correlati","prodotti correlati","articoli correlati","biografia autore","autore","about us","team","staff","faq generiche","domande frequenti generiche","help","supporto","login","registrati","account","profilo utente"];async function h(t,e,n,i=1e3){if(!t||!e||!n)throw new Error("API key, model, and messages are required");const s=`${_}/chat/completions`,o={model:e,messages:n,max_tokens:i,temperature:.7,top_p:1,frequency_penalty:0,presence_penalty:0};return await y(s,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,"HTTP-Referer":window.location.origin,"X-Title":"AI Outline Generator"},body:JSON.stringify(o)})}async function D(t,e){const n=[{role:"user",content:`Cerca su Google.it i primi 10 risultati per l'argomento "${e}". 
            
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
            }`}];try{const o=(await h(t,g.SERP_SEARCH,n,2e3)).choices[0].message.content.match(/\{[\s\S]*\}/);if(o)return JSON.parse(o[0]).results||[];throw new Error("Invalid response format from Perplexity")}catch(i){return console.warn("Perplexity search failed, using fallback with GPT-4o-mini:",i.message),await q(t,e)}}async function q(t,e){const n=[{role:"system",content:"Sei un assistente che genera URL e contenuti realistici per analisi competitor di siti web italiani."},{role:"user",content:`Genera 10 URL realistici di competitor italiani e descrizioni dei contenuti per l'argomento "${e}". Questi dovrebbero essere tipici siti che si posizionerebbero bene su Google.it per questo topic.
            
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
            }`}];try{const o=(await h(t,g.FALLBACK_MODEL,n,1500)).choices[0].message.content.match(/\{[\s\S]*\}/);if(o)return JSON.parse(o[0]).results||[];throw new Error("Invalid response format")}catch(i){return console.error("Error in fallback competitor search:",i),G(e)}}function G(t){return[{url:"https://marketing.esempio1.it/guida",title:`Guida Completa al ${t}`,description:`Guida completa che copre tutti gli aspetti del ${t}`},{url:"https://blog.digitalitalia.com/articolo",title:`${t}: Tutto quello che devi sapere`,description:`Articolo dettagliato che spiega i fondamenti del ${t}`},{url:"https://webmarketing.it/tutorial",title:`Come Padroneggiare il ${t}`,description:`Tutorial passo-passo per il ${t}`},{url:"https://consulenza.esempio4.it/consigli",title:`I 10 Migliori Consigli per il ${t}`,description:`Consigli esperti e best practice per il ${t}`},{url:"https://strategiadigitale.com/avanzate",title:`Strategie Avanzate di ${t}`,description:`Tecniche e strategie avanzate per il ${t}`},{url:"https://formazione.online.it/corso",title:`Corso Professionale di ${t}`,description:`Corso completo per professionisti del ${t}`},{url:"https://business.italia.net/case-study",title:`Case Study di Successo nel ${t}`,description:`Esempi reali di successo nel ${t}`}]}async function j(t,e,n,i){const s=[{role:"system",content:"Sei un esperto nell'estrazione di outline da contenuti web. Il tuo compito è identificare la struttura gerarchica dei contenuti (H1, H2, H3) da una pagina web."},{role:"user",content:`Estrai l'outline strutturale dalla seguente pagina web:

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

Se non riesci ad accedere al contenuto, prova a immaginare una struttura logica basata su titolo e descrizione.`}];try{const r=(await h(t,g.OUTLINE_EXTRACTION,s,1500)).choices[0].message.content.trim(),a=U(r);return{url:e,title:n,outline:a}}catch(o){throw console.error("Error extracting outline:",o),o}}function U(t){return t.split(`
`).filter(i=>{const s=i.toLowerCase();return!H.some(o=>s.includes(o.toLowerCase()))}).join(`
`)}async function F(t,e){const n=[{role:"system",content:"Sei un esperto linguista e semantologo. Il tuo compito è creare un'analisi semantica completa e dettagliata di un argomento specifico."},{role:"user",content:`Think this step by step.
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
}`}];try{const o=(await h(t,g.SEMANTIC_ANALYSIS,n,4e3)).choices[0].message.content.match(/\{[\s\S]*\}/);if(o)return JSON.parse(o[0]);throw new Error("Invalid response format")}catch(i){throw console.error("Error generating semantic analysis:",i),i}}async function W(t,e,n){const i=[{role:"system",content:"Sei un esperto content strategist. Il tuo compito è analizzare le outline dei competitor e identificare tutti gli aspetti che dovrebbero essere trattati per creare un contenuto completo e competitivo su un argomento."},{role:"user",content:`Analizza queste outline dei competitor per l'argomento "${e}" e identifica tutti gli aspetti che dovrebbero essere trattati:

OUTLINE COMPETITOR:
${n.map((s,o)=>`
COMPETITOR ${o+1} (${s.title}):
${s.outline}
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
}`}];try{const r=(await h(t,g.ASPECT_GENERATION,i,3e3)).choices[0].message.content.match(/\{[\s\S]*\}/);if(r)return JSON.parse(r[0]);throw new Error("Invalid response format")}catch(s){throw console.error("Error generating aspects to treat:",s),s}}async function y(t,e,n=0){var i;try{const s=await fetch(t,e);if(!s.ok){const r=await s.json().catch(()=>({}));if(s.status===429&&n<A){const c=x*Math.pow(2,n);return console.warn(`Rate limited. Retrying in ${c}ms...`),await k(c),y(t,e,n+1)}if(s.status>=500&&n<A){const c=x*Math.pow(2,n);return console.warn(`Server error ${s.status}. Retrying in ${c}ms...`),await k(c),y(t,e,n+1)}const a=((i=r.error)==null?void 0:i.message)||r.message||"Unknown error",l=s.status===400?`Bad Request - Check API key and model availability. ${a}`:`HTTP ${s.status} - ${a}`;throw new Error(`OpenRouter API Error ${s.status}: ${l}`)}const o=await s.json();if(!o.choices||!o.choices[0]||!o.choices[0].message)throw new Error("Invalid response format from OpenRouter API");return o}catch(s){if(s.name==="TypeError"&&s.message.includes("fetch"))throw new Error("Errore di connessione. Verifica la tua connessione internet.");if(n<A&&(s.message.includes("network")||s.message.includes("timeout")||s.message.includes("fetch"))){const o=x*Math.pow(2,n);return console.warn(`Network error. Retrying in ${o}ms...`),await k(o),y(t,e,n+1)}throw s}}function k(t){return new Promise(e=>setTimeout(e,t))}async function J(t,e,n,i=!0){const s=[{role:"system",content:"Sei un esperto content strategist e SEO specialist. Il tuo compito è creare un'outline completa e semanticamente ottimizzata per un contenuto che deve coprire al 100% tutti gli aspetti di un argomento."},{role:"user",content:`Crea un'outline completa per l'argomento "${e}" utilizzando i seguenti dati:

OUTLINE COMPETITOR ANALIZZATE:
${n.competitors.map((o,r)=>`
${o.title}:
${o.outline}
`).join(`
`)}

ASPETTI DA TRATTARE SELEZIONATI:
${Object.entries(n.aspects||{}).map(([o,r])=>`
${o}:
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

Crea un'outline esaustiva che non lasci nessun aspetto importante non trattato.`}];try{return(await h(t,g.SEMANTIC_ANALYSIS,s,3e3)).choices[0].message.content.trim()}catch(o){throw console.error("Error generating final outline:",o),o}}class Q{constructor(){this.results={competitorUrls:[],competitorOutlines:[],semanticAnalysis:null,aspectsToTreat:null,selectedElements:{competitors:new Set,semanticElements:new Set,aspects:new Set}},this.progressCallback=null,this.statusCallback=null}setProgressCallback(e){this.progressCallback=e}setStatusCallback(e){this.statusCallback=e}updateProgress(e,n){this.progressCallback&&this.progressCallback(e,n)}updateStatus(e){this.statusCallback&&this.statusCallback(e)}async generateCompleteOutline(e,n){try{this.updateStatus("Iniziando la generazione..."),this.updateProgress(1,"Ricerca competitor nella SERP"),this.updateStatus("Cercando competitor nella SERP..."),this.results.competitorUrls=await D(e,n),this.updateProgress(2,"Estrazione outline competitor"),this.updateStatus("Estraendo outline dai competitor..."),this.results.competitorOutlines=[];for(let i=0;i<Math.min(this.results.competitorUrls.length,10);i++){const s=this.results.competitorUrls[i];try{const o=await j(e,s.url,s.title,s.description);this.results.competitorOutlines.push(o),this.results.selectedElements.competitors.add(i)}catch(o){console.warn(`Failed to extract outline from ${s.url}:`,o)}}return this.updateProgress(3,"Analisi semantica completa"),this.updateStatus("Generando analisi semantica completa..."),this.results.semanticAnalysis=await F(e,n),this.selectAllSemanticElements(),this.updateProgress(4,"Generazione aspetti da trattare"),this.updateStatus("Identificando aspetti da trattare..."),this.results.aspectsToTreat=await W(e,n,this.results.competitorOutlines),this.selectAllAspects(),this.updateProgress(5,"Compilazione risultati completata"),this.updateStatus("Generazione completata con successo!"),this.results}catch(i){throw this.updateStatus(`Errore durante la generazione: ${i.message}`),i}}selectAllSemanticElements(){var e,n;this.results.selectedElements.semanticElements.clear(),this.results.semanticAnalysis&&((e=this.results.semanticAnalysis.salientEntities)==null||e.forEach((i,s)=>{this.results.selectedElements.semanticElements.add(`salient_${s}`)}),(n=this.results.semanticAnalysis.synonyms)==null||n.forEach((i,s)=>{this.results.selectedElements.semanticElements.add(`synonym_${s}`)}),Object.keys(this.results.semanticAnalysis.categories||{}).forEach(i=>{var o;this.results.selectedElements.semanticElements.add(`category_${i}`),(o=this.results.semanticAnalysis.categories[i].entities)==null||o.forEach((r,a)=>{this.results.selectedElements.semanticElements.add(`category_${i}_entity_${a}`)})}),["partWholeRelationships","commonCollocations","relatedStatements","relatedQuestions","commonErrors","currentDebates"].forEach(i=>{var s;(s=this.results.semanticAnalysis[i])==null||s.forEach((o,r)=>{this.results.selectedElements.semanticElements.add(`${i}_${r}`)})}))}selectAllAspects(){var e;this.results.selectedElements.aspects.clear(),(e=this.results.aspectsToTreat)!=null&&e.aspectsByCategory&&Object.keys(this.results.aspectsToTreat.aspectsByCategory).forEach(n=>{this.results.aspectsToTreat.aspectsByCategory[n].forEach((s,o)=>{this.results.selectedElements.aspects.add(`${n}_${o}`)})})}deselectAllElements(){this.results.selectedElements.competitors.clear(),this.results.selectedElements.semanticElements.clear(),this.results.selectedElements.aspects.clear()}selectAllElements(){this.results.competitorOutlines.forEach((e,n)=>{this.results.selectedElements.competitors.add(n)}),this.selectAllSemanticElements(),this.selectAllAspects()}toggleCompetitorSelection(e){this.results.selectedElements.competitors.has(e)?this.results.selectedElements.competitors.delete(e):this.results.selectedElements.competitors.add(e)}toggleSemanticElementSelection(e){this.results.selectedElements.semanticElements.has(e)?this.results.selectedElements.semanticElements.delete(e):this.results.selectedElements.semanticElements.add(e)}toggleAspectSelection(e){this.results.selectedElements.aspects.has(e)?this.results.selectedElements.aspects.delete(e):this.results.selectedElements.aspects.add(e)}getSelectedData(){const e=this.results.competitorOutlines.filter((s,o)=>this.results.selectedElements.competitors.has(o)),n=this.extractSelectedSemanticData(),i=this.extractSelectedAspects();return{competitors:e,semanticAnalysis:n,aspects:i,counts:{competitors:e.length,semanticElements:this.results.selectedElements.semanticElements.size,aspects:this.results.selectedElements.aspects.size}}}extractSelectedSemanticData(){var s,o;if(!this.results.semanticAnalysis)return null;const e={},n=[];(s=this.results.semanticAnalysis.salientEntities)==null||s.forEach((r,a)=>{this.results.selectedElements.semanticElements.has(`salient_${a}`)&&n.push(r)}),n.length>0&&(e.salientEntities=n);const i=[];return(o=this.results.semanticAnalysis.synonyms)==null||o.forEach((r,a)=>{this.results.selectedElements.semanticElements.has(`synonym_${a}`)&&i.push(r)}),i.length>0&&(e.synonyms=i),e}extractSelectedAspects(){var n;if(!((n=this.results.aspectsToTreat)!=null&&n.aspectsByCategory))return null;const e={};return Object.keys(this.results.aspectsToTreat.aspectsByCategory).forEach(i=>{const s=this.results.aspectsToTreat.aspectsByCategory[i],o=[];s.forEach((r,a)=>{this.results.selectedElements.aspects.has(`${i}_${a}`)&&o.push(r)}),o.length>0&&(e[i]=o)}),e}getStatistics(){return{competitorCount:this.results.competitorOutlines.length,selectedCompetitorCount:this.results.selectedElements.competitors.size,totalSemanticElements:this.calculateTotalSemanticElements(),selectedSemanticElements:this.results.selectedElements.semanticElements.size,totalAspects:this.calculateTotalAspects(),selectedAspects:this.results.selectedElements.aspects.size}}calculateTotalSemanticElements(){var n,i;if(!this.results.semanticAnalysis)return 0;let e=0;return e+=((n=this.results.semanticAnalysis.salientEntities)==null?void 0:n.length)||0,e+=((i=this.results.semanticAnalysis.synonyms)==null?void 0:i.length)||0,Object.values(this.results.semanticAnalysis.categories||{}).forEach(s=>{var o;e+=((o=s.entities)==null?void 0:o.length)||0}),["partWholeRelationships","commonCollocations","relatedStatements","relatedQuestions","commonErrors","currentDebates"].forEach(s=>{var o;e+=((o=this.results.semanticAnalysis[s])==null?void 0:o.length)||0}),e}calculateTotalAspects(){var n;if(!((n=this.results.aspectsToTreat)!=null&&n.aspectsByCategory))return 0;let e=0;return Object.values(this.results.aspectsToTreat.aspectsByCategory).forEach(i=>{e+=i.length}),e}async generateFinalOutline(e,n,i=!0){try{this.updateStatus("Generando outline finale...");const s=this.getSelectedData(),o=await J(e,n,s,i);return this.updateStatus("Outline finale generata con successo!"),{outline:o,analytics:this.analyzeOutline(o)}}catch(s){throw this.updateStatus(`Errore durante la generazione: ${s.message}`),s}}analyzeOutline(e){const n=e.split(`
`).filter(a=>a.trim());let i=0,s=0,o=0,r=0;return n.forEach(a=>{const l=a.trim();l.startsWith("H1:")?i++:l.startsWith("H2:")?s++:l.startsWith("H3:")&&o++,l.includes("?")&&r++}),{h1Count:i,h2Count:s,h3Count:o,questionsCount:r,totalSections:i+s+o}}convertToMarkdown(e){return e.split(`
`).map(n=>{const i=n.trim();return i.startsWith("H1:")?`# ${i.substring(3).trim()}`:i.startsWith("H2:")?`## ${i.substring(3).trim()}`:i.startsWith("H3:")?`### ${i.substring(3).trim()}`:n}).join(`
`)}}const d=new Q;function V(t="Caricamento in corso..."){const e=document.getElementById("loadingOverlay"),n=document.getElementById("loadingMessage");e&&n&&(n.textContent=t,e.classList.remove("hidden"))}function b(){const t=document.getElementById("loadingOverlay");t&&t.classList.add("hidden")}function f(t){z(t,"error")}function L(t){z(t,"success")}function z(t,e="info"){const n=document.createElement("div");n.className=`fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-lg z-50 animate-slide-up ${K(e)}`,n.innerHTML=`
        <div class="flex items-center">
            <div class="flex-shrink-0">
                ${Y(e)}
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
    `,document.body.appendChild(n),setTimeout(()=>{n.parentElement&&n.remove()},5e3)}function K(t){const e={success:"bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",error:"bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800",warning:"bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800",info:"bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800"};return e[t]||e.info}function Y(t){const e={success:`<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>`,error:`<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>`,warning:`<svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>`,info:`<svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>`};return e[t]||e.info}function $(t,e=300){t.style.opacity="0",t.style.transition=`opacity ${e}ms ease-in-out`,setTimeout(()=>{t.style.opacity="1"},10)}function T(t){Z(t.competitorOutlines),ee(t.semanticAnalysis),ne(t.aspectsToTreat),C(),X()}function X(){const t=document.getElementById("resultsSection");t&&(t.classList.remove("hidden"),$(t))}function Z(t){const e=document.getElementById("competitorSection"),n=document.getElementById("competitorOutlines");!e||!n||!t||(n.innerHTML="",t.forEach((i,s)=>{const o=document.createElement("div");o.className="competitor-outline-item border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4";const r=document.createElement("div");r.className="flex items-center justify-between mb-3";const a=document.createElement("div");a.className="flex-1";const l=document.createElement("h3");l.className="font-semibold text-gray-900 dark:text-white text-sm",l.textContent=i.title||`Competitor ${s+1}`;const c=document.createElement("a");c.className="text-xs text-blue-600 dark:text-blue-400 hover:underline",c.href=i.url,c.target="_blank",c.textContent=i.url,a.appendChild(l),a.appendChild(c);const u=document.createElement("input");u.type="checkbox",u.id=`competitor-${s}`,u.checked=d.results.selectedElements.competitors.has(s),u.className="ml-4",u.addEventListener("change",()=>{d.toggleCompetitorSelection(s),C()}),r.appendChild(a),r.appendChild(u);const p=document.createElement("div");p.className="outline-content bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm font-mono whitespace-pre-line",p.textContent=i.outline||"Nessuna outline estratta",o.appendChild(r),o.appendChild(p),n.appendChild(o)}))}function ee(t){const e=document.getElementById("semanticSection"),n=document.getElementById("semanticAnalysis");!e||!n||!t||(n.innerHTML="",m("Entità Principali",t.salientEntities,"salient",n),m("Sinonimi",t.synonyms,"synonym",n),t.categories&&Object.keys(t.categories).forEach(i=>{const s=t.categories[i];te(i,s,n)}),m("Relazioni Tutto-Parte",t.partWholeRelationships,"partWholeRelationships",n),m("Collocazioni Comuni",t.commonCollocations,"commonCollocations",n),m("Affermazioni Correlate",t.relatedStatements,"relatedStatements",n),m("Domande Correlate",t.relatedQuestions,"relatedQuestions",n),m("Errori Comuni",t.commonErrors,"commonErrors",n),m("Dibattiti Attuali",t.currentDebates,"currentDebates",n))}function m(t,e,n,i){if(!e||!Array.isArray(e)||e.length===0)return;const s=document.createElement("div");s.className="semantic-section mb-6";const o=document.createElement("h4");o.className="font-semibold text-gray-900 dark:text-white mb-3",o.textContent=t;const r=document.createElement("div");r.className="flex flex-wrap gap-2",e.forEach((a,l)=>{const c=document.createElement("span");c.className="semantic-item px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm cursor-pointer border border-transparent hover:border-blue-300",c.textContent=a,c.dataset.elementId=`${n}_${l}`,d.results.selectedElements.semanticElements.has(`${n}_${l}`)&&(c.classList.add("selected"),c.classList.add("bg-green-100","dark:bg-green-900","text-green-800","dark:text-green-200"),c.classList.remove("bg-blue-100","dark:bg-blue-900","text-blue-800","dark:text-blue-200")),c.addEventListener("click",()=>{d.toggleSemanticElementSelection(`${n}_${l}`),se(c),C()}),r.appendChild(c)}),s.appendChild(o),s.appendChild(r),i.appendChild(s)}function te(t,e,n){if(!e||!e.entities)return;const i=document.createElement("div");i.className="semantic-category mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg";const s=document.createElement("h4");s.className="font-semibold text-gray-900 dark:text-white mb-3",s.textContent=`Categoria: ${t}`,i.appendChild(s),m("Entità",e.entities,`category_${t}_entity`,i),e.examples&&m("Esempi",e.examples,`category_${t}_example`,i),e.attributes&&m("Attributi",e.attributes,`category_${t}_attribute`,i),n.appendChild(i)}function ne(t){const e=document.getElementById("aspectsSection"),n=document.getElementById("aspectsList");!e||!n||!t||(n.innerHTML="",t.aspectsByCategory&&Object.keys(t.aspectsByCategory).forEach(i=>{const s=t.aspectsByCategory[i],o=document.createElement("div");o.className="aspects-category mb-6";const r=document.createElement("h4");r.className="font-semibold text-gray-900 dark:text-white mb-3",r.textContent=i,o.appendChild(r),s.forEach((a,l)=>{const c=document.createElement("div");c.className="aspect-item flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg mb-2";const u=document.createElement("input");u.type="checkbox",u.id=`aspect-${i}-${l}`,u.checked=d.results.selectedElements.aspects.has(`${i}_${l}`),u.className="mt-1",u.addEventListener("change",()=>{d.toggleAspectSelection(`${i}_${l}`),C()});const p=document.createElement("div");p.className="flex-1";const v=document.createElement("h5");v.className="font-medium text-gray-900 dark:text-white",v.textContent=a.aspect;const S=document.createElement("p");S.className="text-sm text-gray-600 dark:text-gray-400 mt-1",S.textContent=a.description;const E=document.createElement("div");E.className="flex items-center space-x-4 mt-2";const I=document.createElement("span");if(I.className=`px-2 py-1 text-xs rounded-full ${ie(a.priority)}`,I.textContent=a.priority,E.appendChild(I),a.foundInCompetitors&&a.foundInCompetitors.length>0){const w=document.createElement("span");w.className="text-xs text-gray-500 dark:text-gray-400",w.textContent=`Trovato in ${a.foundInCompetitors.length} competitor`,E.appendChild(w)}p.appendChild(v),p.appendChild(S),p.appendChild(E),c.appendChild(u),c.appendChild(p),o.appendChild(c)}),n.appendChild(o)}))}function ie(t){const e={high:"bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",medium:"bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",low:"bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"};return e[t]||e.medium}function se(t){t.classList.contains("selected")?(t.classList.remove("selected"),t.classList.remove("bg-green-100","dark:bg-green-900","text-green-800","dark:text-green-200"),t.classList.add("bg-blue-100","dark:bg-blue-900","text-blue-800","dark:text-blue-200")):(t.classList.add("selected"),t.classList.add("bg-green-100","dark:bg-green-900","text-green-800","dark:text-green-200"),t.classList.remove("bg-blue-100","dark:bg-blue-900","text-blue-800","dark:text-blue-200"))}function C(){const t=d.getStatistics(),e=document.getElementById("competitorCount");e&&(e.textContent=`${t.selectedCompetitorCount}/${t.competitorCount}`);const n=document.getElementById("semanticCount");n&&(n.textContent=`${t.selectedSemanticElements}/${t.totalSemanticElements}`);const i=document.getElementById("aspectCount");i&&(i.textContent=`${t.selectedAspects}/${t.totalAspects}`);const s=document.getElementById("statsCard");s&&t.competitorCount>0&&s.classList.remove("hidden");const o=document.getElementById("proceedBtn");if(o){const r=t.selectedCompetitorCount>0||t.selectedSemanticElements>0||t.selectedAspects>0;o.disabled=!r}}function oe(){const t=document.getElementById("selectAllBtn"),e=document.getElementById("deselectAllBtn"),n=document.getElementById("proceedBtn");t&&t.addEventListener("click",()=>{d.selectAllElements(),T(d.results)}),e&&e.addEventListener("click",()=>{d.deselectAllElements(),T(d.results)}),n&&n.addEventListener("click",()=>{re()})}function re(){const t=d.getSelectedData(),e=document.getElementById("phase2Section");e&&(e.classList.remove("hidden"),$(e),e.scrollIntoView({behavior:"smooth"})),ae(t),ce()}function ae(t){const e=document.getElementById("selectedSummary");e&&(e.innerHTML=`
        <div>• <strong>Competitor:</strong> ${t.counts.competitors} selezionati</div>
        <div>• <strong>Elementi Semantici:</strong> ${t.counts.semanticElements} selezionati</div>
        <div>• <strong>Aspetti da Trattare:</strong> ${t.counts.aspects} selezionati</div>
    `)}function ce(){const t=document.getElementById("generateOutlineBtn"),e=document.getElementById("copyMarkdownBtn");t&&t.addEventListener("click",async()=>{await le()}),e&&e.addEventListener("click",()=>{me()})}async function le(){try{const t=document.getElementById("openrouterApiKey").value.trim(),e=document.getElementById("topicInput").value.trim(),n=document.getElementById("includeH3").checked;if(!t||!e){f("API key e topic sono richiesti per generare l'outline.");return}V("Generando outline finale...");const i=await d.generateFinalOutline(t,e,n);de(i.outline,i.analytics),b(),L("Outline finale generata con successo!")}catch(t){b(),f(`Errore durante la generazione: ${t.message}`),console.error("Outline generation error:",t)}}function de(t,e){const n=document.getElementById("generatedOutlineSection"),i=document.getElementById("generatedOutlineContent");n&&i&&(i.textContent=t,n.classList.remove("hidden"),$(n),ue(e),n.scrollIntoView({behavior:"smooth"}))}function ue(t){const e={h2Count:document.getElementById("h2Count"),h3Count:document.getElementById("h3Count"),questionsCount:document.getElementById("questionsCount"),totalSections:document.getElementById("totalSections")};e.h2Count&&(e.h2Count.textContent=t.h2Count),e.h3Count&&(e.h3Count.textContent=t.h3Count),e.questionsCount&&(e.questionsCount.textContent=t.questionsCount),e.totalSections&&(e.totalSections.textContent=t.totalSections)}function me(){const t=document.getElementById("generatedOutlineContent");if(!t||!t.textContent){f("Nessuna outline da copiare.");return}const e=t.textContent,n=d.convertToMarkdown(e);navigator.clipboard.writeText(n).then(()=>{L("Outline copiata in formato Markdown!");const i=document.getElementById("copyMarkdownBtn");if(i){const s=i.innerHTML;i.innerHTML="✅ Copiato!",i.classList.add("bg-green-600"),i.classList.remove("bg-blue-600"),setTimeout(()=>{i.innerHTML=s,i.classList.remove("bg-green-600"),i.classList.add("bg-blue-600")},2e3)}}).catch(i=>{console.error("Error copying to clipboard:",i),f("Errore durante la copia negli appunti.")})}function pe(){ge(),fe(),Ee(),be(),oe()}function ge(){const t=document.getElementById("toggleOpenrouterApiKey");t&&t.addEventListener("click",()=>{he("openrouterApiKey","openrouterEyeIcon")})}function he(t,e){const n=document.getElementById(t),i=document.getElementById(e);if(!n||!i)return;const s=n.type==="password";n.type=s?"text":"password",i.innerHTML=s?'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />':'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />'}function fe(){["openrouterApiKey","topicInput"].forEach(e=>{const n=document.getElementById(e);n&&n.addEventListener("input",()=>{if(e.includes("ApiKey")){const i=e.replace("ApiKey","");M(i,n.value)}setTimeout(()=>B(),0)})})}function Ee(){const t=document.getElementById("generateBtn");t&&t.addEventListener("click",ye)}async function ye(){try{const t=document.getElementById("openrouterApiKey").value.trim(),e=document.getElementById("topicInput").value.trim();if(!B())return;console.log("Skipping API key validation, proceeding with generation...");const n=await d.generateCompleteOutline(t,e);T(n),b(),L("Generazione completata con successo!")}catch(t){b(),f(`Errore durante la generazione: ${t.message}`),console.error("Generation error:",t)}}function be(){d.setProgressCallback((t,e)=>{Ce(t,e)}),d.setStatusCallback(t=>{ve(t)})}function Ce(t,e){const n=document.getElementById("progressSection"),i=document.getElementById(`step${t}`);if(n&&n.classList.remove("hidden"),i){const s=i.querySelector(".w-4.h-4.rounded-full"),o=i.querySelector("span");s&&(s.className="w-4 h-4 rounded-full bg-blue-500"),o&&(o.textContent=e,o.className="text-sm font-medium text-blue-600 dark:text-blue-400");for(let r=1;r<t;r++){const a=document.getElementById(`step${r}`);if(a){const l=a.querySelector(".w-4.h-4.rounded-full");l&&(l.className="w-4 h-4 rounded-full bg-green-500");const c=a.querySelector("span");c&&(c.className="text-sm text-green-600 dark:text-green-400")}}}}function ve(t){const e=document.getElementById("statusMessage");e&&(e.textContent=t)}function B(){const t=document.getElementById("openrouterApiKey").value.trim(),e=document.getElementById("topicInput").value.trim(),n=document.getElementById("generateBtn"),i=document.getElementById("generateHelp");let s=!0,o="";return t?e?e.length<3&&(s=!1,o="L'argomento deve essere di almeno 3 caratteri"):(s=!1,o="Inserisci un argomento/topic da analizzare"):(s=!1,o="Inserisci la tua API key di OpenRouter"),n&&(n.disabled=!s),i&&(o?(i.textContent=o,i.classList.remove("hidden")):i.classList.add("hidden")),s}document.addEventListener("DOMContentLoaded",()=>{P(),R(),pe(),document.body.classList.add("loaded")});
