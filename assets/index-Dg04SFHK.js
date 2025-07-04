(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function s(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=s(i);fetch(i.href,o)}})();function $(){const e=localStorage.getItem("openrouter_api_key"),t=document.getElementById("openrouterApiKey");e&&t&&(t.value=e)}function B(e,t){t.trim()&&localStorage.setItem(`${e}_api_key`,t)}function O(){$(),console.log("✅ AI Outline Generator inizializzato")}function N(){const e=localStorage.getItem("dark_mode")==="true",t=document.getElementById("darkModeToggle"),s=document.getElementById("darkModeIcon");e&&(document.documentElement.classList.add("dark"),I(s,!0)),t&&t.addEventListener("click",()=>{const n=document.documentElement.classList.toggle("dark");localStorage.setItem("dark_mode",n.toString()),I(s,n)})}function I(e,t){e&&(e.innerHTML=t?'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>':'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>')}const M="https://openrouter.ai/api/v1",w=3,k=1e3,g={SERP_SEARCH:"perplexity/sonar",OUTLINE_EXTRACTION:"openai/gpt-4o-mini",SEMANTIC_ANALYSIS:"anthropic/claude-3-5-sonnet-20241022",ASPECT_GENERATION:"anthropic/claude-3-5-sonnet-20241022",OUTLINE_GENERATION:"anthropic/claude-3-5-sonnet-20241022",FALLBACK_MODEL:"openai/gpt-3.5-turbo"},R=["conclusione","conclusioni","chi siamo","chiama ora","contattaci","contatti","richiedi preventivo","preventivo","offerta","promozione","sconto","privacy policy","termini di servizio","cookie policy","disclaimer","footer","sidebar","menu","navigazione","breadcrumb","condividi","social","newsletter","iscriviti","seguici","testimonial","recensioni cliente","clienti","portfolio","servizi correlati","prodotti correlati","articoli correlati","biografia autore","autore","about us","team","staff","faq generiche","domande frequenti generiche","help","supporto","login","registrati","account","profilo utente"];async function h(e,t,s,n=1e3){if(!e||!t||!s)throw new Error("API key, model, and messages are required");const i=`${M}/chat/completions`,o={model:t,messages:s,max_tokens:n,temperature:.7,top_p:1,frequency_penalty:0,presence_penalty:0};return await E(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`,"HTTP-Referer":window.location.origin,"X-Title":"AI Outline Generator"},body:JSON.stringify(o)})}async function P(e,t){const s=[{role:"user",content:`Cerca su Google.it i primi 10 risultati per l'argomento "${t}". 
            
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
            }`}];try{const o=(await h(e,g.SERP_SEARCH,s,2e3)).choices[0].message.content.match(/\{[\s\S]*\}/);if(o)return JSON.parse(o[0]).results||[];throw new Error("Invalid response format from Perplexity")}catch(n){return console.warn("Perplexity search failed, using fallback with GPT-4o-mini:",n.message),await _(e,t)}}async function _(e,t){const s=[{role:"system",content:"Sei un assistente che genera URL e contenuti realistici per analisi competitor di siti web italiani."},{role:"user",content:`Genera 10 URL realistici di competitor italiani e descrizioni dei contenuti per l'argomento "${t}". Questi dovrebbero essere tipici siti che si posizionerebbero bene su Google.it per questo topic.
            
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
            }`}];try{const o=(await h(e,g.FALLBACK_MODEL,s,1500)).choices[0].message.content.match(/\{[\s\S]*\}/);if(o)return JSON.parse(o[0]).results||[];throw new Error("Invalid response format")}catch(n){return console.error("Error in fallback competitor search:",n),D(t)}}function D(e){return[{url:"https://marketing.esempio1.it/guida",title:`Guida Completa al ${e}`,description:`Guida completa che copre tutti gli aspetti del ${e}`},{url:"https://blog.digitalitalia.com/articolo",title:`${e}: Tutto quello che devi sapere`,description:`Articolo dettagliato che spiega i fondamenti del ${e}`},{url:"https://webmarketing.it/tutorial",title:`Come Padroneggiare il ${e}`,description:`Tutorial passo-passo per il ${e}`},{url:"https://consulenza.esempio4.it/consigli",title:`I 10 Migliori Consigli per il ${e}`,description:`Consigli esperti e best practice per il ${e}`},{url:"https://strategiadigitale.com/avanzate",title:`Strategie Avanzate di ${e}`,description:`Tecniche e strategie avanzate per il ${e}`},{url:"https://formazione.online.it/corso",title:`Corso Professionale di ${e}`,description:`Corso completo per professionisti del ${e}`},{url:"https://business.italia.net/case-study",title:`Case Study di Successo nel ${e}`,description:`Esempi reali di successo nel ${e}`}]}async function H(e,t,s,n){const i=[{role:"system",content:"Sei un esperto nell'estrazione di outline da contenuti web. Il tuo compito è identificare la struttura gerarchica dei contenuti (H1, H2, H3) da una pagina web."},{role:"user",content:`Estrai l'outline strutturale dalla seguente pagina web:

URL: ${t}
Titolo: ${s}
Descrizione: ${n}

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

Se non riesci ad accedere al contenuto, prova a immaginare una struttura logica basata su titolo e descrizione.`}];try{const a=(await h(e,g.OUTLINE_EXTRACTION,i,1500)).choices[0].message.content.trim(),r=G(a);return{url:t,title:s,outline:r}}catch(o){throw console.error("Error extracting outline:",o),o}}function G(e){return e.split(`
`).filter(n=>{const i=n.toLowerCase();return!R.some(o=>i.includes(o.toLowerCase()))}).join(`
`)}async function j(e,t){const s=[{role:"system",content:"Sei un esperto linguista e semantologo. Il tuo compito è creare un'analisi semantica completa e dettagliata di un argomento specifico."},{role:"user",content:`Think this step by step.
Topic=${t}
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
}`}];try{const o=(await h(e,g.SEMANTIC_ANALYSIS,s,4e3)).choices[0].message.content.match(/\{[\s\S]*\}/);if(o)return JSON.parse(o[0]);throw new Error("Invalid response format")}catch(n){throw console.error("Error generating semantic analysis:",n),n}}async function q(e,t,s){const n=[{role:"system",content:"Sei un esperto content strategist. Il tuo compito è analizzare le outline dei competitor e identificare tutti gli aspetti che dovrebbero essere trattati per creare un contenuto completo e competitivo su un argomento."},{role:"user",content:`Analizza queste outline dei competitor per l'argomento "${t}" e identifica tutti gli aspetti che dovrebbero essere trattati:

OUTLINE COMPETITOR:
${s.map((i,o)=>`
COMPETITOR ${o+1} (${i.title}):
${i.outline}
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
}`}];try{const a=(await h(e,g.ASPECT_GENERATION,n,3e3)).choices[0].message.content.match(/\{[\s\S]*\}/);if(a)return JSON.parse(a[0]);throw new Error("Invalid response format")}catch(i){throw console.error("Error generating aspects to treat:",i),i}}async function E(e,t,s=0){var n;try{const i=await fetch(e,t);if(!i.ok){const a=await i.json().catch(()=>({}));if(i.status===429&&s<w){const l=k*Math.pow(2,s);return console.warn(`Rate limited. Retrying in ${l}ms...`),await x(l),E(e,t,s+1)}if(i.status>=500&&s<w){const l=k*Math.pow(2,s);return console.warn(`Server error ${i.status}. Retrying in ${l}ms...`),await x(l),E(e,t,s+1)}const r=((n=a.error)==null?void 0:n.message)||a.message||"Unknown error",c=i.status===400?`Bad Request - Check API key and model availability. ${r}`:`HTTP ${i.status} - ${r}`;throw new Error(`OpenRouter API Error ${i.status}: ${c}`)}const o=await i.json();if(!o.choices||!o.choices[0]||!o.choices[0].message)throw new Error("Invalid response format from OpenRouter API");return o}catch(i){if(i.name==="TypeError"&&i.message.includes("fetch"))throw new Error("Errore di connessione. Verifica la tua connessione internet.");if(s<w&&(i.message.includes("network")||i.message.includes("timeout")||i.message.includes("fetch"))){const o=k*Math.pow(2,s);return console.warn(`Network error. Retrying in ${o}ms...`),await x(o),E(e,t,s+1)}throw i}}function x(e){return new Promise(t=>setTimeout(t,e))}class U{constructor(){this.results={competitorUrls:[],competitorOutlines:[],semanticAnalysis:null,aspectsToTreat:null,selectedElements:{competitors:new Set,semanticElements:new Set,aspects:new Set}},this.progressCallback=null,this.statusCallback=null}setProgressCallback(t){this.progressCallback=t}setStatusCallback(t){this.statusCallback=t}updateProgress(t,s){this.progressCallback&&this.progressCallback(t,s)}updateStatus(t){this.statusCallback&&this.statusCallback(t)}async generateCompleteOutline(t,s){try{this.updateStatus("Iniziando la generazione..."),this.updateProgress(1,"Ricerca competitor nella SERP"),this.updateStatus("Cercando competitor nella SERP..."),this.results.competitorUrls=await P(t,s),this.updateProgress(2,"Estrazione outline competitor"),this.updateStatus("Estraendo outline dai competitor..."),this.results.competitorOutlines=[];for(let n=0;n<Math.min(this.results.competitorUrls.length,10);n++){const i=this.results.competitorUrls[n];try{const o=await H(t,i.url,i.title,i.description);this.results.competitorOutlines.push(o),this.results.selectedElements.competitors.add(n)}catch(o){console.warn(`Failed to extract outline from ${i.url}:`,o)}}return this.updateProgress(3,"Analisi semantica completa"),this.updateStatus("Generando analisi semantica completa..."),this.results.semanticAnalysis=await j(t,s),this.selectAllSemanticElements(),this.updateProgress(4,"Generazione aspetti da trattare"),this.updateStatus("Identificando aspetti da trattare..."),this.results.aspectsToTreat=await q(t,s,this.results.competitorOutlines),this.selectAllAspects(),this.updateProgress(5,"Compilazione risultati completata"),this.updateStatus("Generazione completata con successo!"),this.results}catch(n){throw this.updateStatus(`Errore durante la generazione: ${n.message}`),n}}selectAllSemanticElements(){var t,s;this.results.selectedElements.semanticElements.clear(),this.results.semanticAnalysis&&((t=this.results.semanticAnalysis.salientEntities)==null||t.forEach((n,i)=>{this.results.selectedElements.semanticElements.add(`salient_${i}`)}),(s=this.results.semanticAnalysis.synonyms)==null||s.forEach((n,i)=>{this.results.selectedElements.semanticElements.add(`synonym_${i}`)}),Object.keys(this.results.semanticAnalysis.categories||{}).forEach(n=>{var o;this.results.selectedElements.semanticElements.add(`category_${n}`),(o=this.results.semanticAnalysis.categories[n].entities)==null||o.forEach((a,r)=>{this.results.selectedElements.semanticElements.add(`category_${n}_entity_${r}`)})}),["partWholeRelationships","commonCollocations","relatedStatements","relatedQuestions","commonErrors","currentDebates"].forEach(n=>{var i;(i=this.results.semanticAnalysis[n])==null||i.forEach((o,a)=>{this.results.selectedElements.semanticElements.add(`${n}_${a}`)})}))}selectAllAspects(){var t;this.results.selectedElements.aspects.clear(),(t=this.results.aspectsToTreat)!=null&&t.aspectsByCategory&&Object.keys(this.results.aspectsToTreat.aspectsByCategory).forEach(s=>{this.results.aspectsToTreat.aspectsByCategory[s].forEach((i,o)=>{this.results.selectedElements.aspects.add(`${s}_${o}`)})})}deselectAllElements(){this.results.selectedElements.competitors.clear(),this.results.selectedElements.semanticElements.clear(),this.results.selectedElements.aspects.clear()}selectAllElements(){this.results.competitorOutlines.forEach((t,s)=>{this.results.selectedElements.competitors.add(s)}),this.selectAllSemanticElements(),this.selectAllAspects()}toggleCompetitorSelection(t){this.results.selectedElements.competitors.has(t)?this.results.selectedElements.competitors.delete(t):this.results.selectedElements.competitors.add(t)}toggleSemanticElementSelection(t){this.results.selectedElements.semanticElements.has(t)?this.results.selectedElements.semanticElements.delete(t):this.results.selectedElements.semanticElements.add(t)}toggleAspectSelection(t){this.results.selectedElements.aspects.has(t)?this.results.selectedElements.aspects.delete(t):this.results.selectedElements.aspects.add(t)}getSelectedData(){const t=this.results.competitorOutlines.filter((i,o)=>this.results.selectedElements.competitors.has(o)),s=this.extractSelectedSemanticData(),n=this.extractSelectedAspects();return{competitors:t,semanticAnalysis:s,aspects:n,counts:{competitors:t.length,semanticElements:this.results.selectedElements.semanticElements.size,aspects:this.results.selectedElements.aspects.size}}}extractSelectedSemanticData(){var i,o;if(!this.results.semanticAnalysis)return null;const t={},s=[];(i=this.results.semanticAnalysis.salientEntities)==null||i.forEach((a,r)=>{this.results.selectedElements.semanticElements.has(`salient_${r}`)&&s.push(a)}),s.length>0&&(t.salientEntities=s);const n=[];return(o=this.results.semanticAnalysis.synonyms)==null||o.forEach((a,r)=>{this.results.selectedElements.semanticElements.has(`synonym_${r}`)&&n.push(a)}),n.length>0&&(t.synonyms=n),t}extractSelectedAspects(){var s;if(!((s=this.results.aspectsToTreat)!=null&&s.aspectsByCategory))return null;const t={};return Object.keys(this.results.aspectsToTreat.aspectsByCategory).forEach(n=>{const i=this.results.aspectsToTreat.aspectsByCategory[n],o=[];i.forEach((a,r)=>{this.results.selectedElements.aspects.has(`${n}_${r}`)&&o.push(a)}),o.length>0&&(t[n]=o)}),t}getStatistics(){return{competitorCount:this.results.competitorOutlines.length,selectedCompetitorCount:this.results.selectedElements.competitors.size,totalSemanticElements:this.calculateTotalSemanticElements(),selectedSemanticElements:this.results.selectedElements.semanticElements.size,totalAspects:this.calculateTotalAspects(),selectedAspects:this.results.selectedElements.aspects.size}}calculateTotalSemanticElements(){var s,n;if(!this.results.semanticAnalysis)return 0;let t=0;return t+=((s=this.results.semanticAnalysis.salientEntities)==null?void 0:s.length)||0,t+=((n=this.results.semanticAnalysis.synonyms)==null?void 0:n.length)||0,Object.values(this.results.semanticAnalysis.categories||{}).forEach(i=>{var o;t+=((o=i.entities)==null?void 0:o.length)||0}),["partWholeRelationships","commonCollocations","relatedStatements","relatedQuestions","commonErrors","currentDebates"].forEach(i=>{var o;t+=((o=this.results.semanticAnalysis[i])==null?void 0:o.length)||0}),t}calculateTotalAspects(){var s;if(!((s=this.results.aspectsToTreat)!=null&&s.aspectsByCategory))return 0;let t=0;return Object.values(this.results.aspectsToTreat.aspectsByCategory).forEach(n=>{t+=n.length}),t}}const d=new U;function z(){const e=document.getElementById("loadingOverlay");e&&e.classList.add("hidden")}function F(e){T(e,"error")}function J(e){T(e,"success")}function T(e,t="info"){const s=document.createElement("div");s.className=`fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-lg z-50 animate-slide-up ${W(t)}`,s.innerHTML=`
        <div class="flex items-center">
            <div class="flex-shrink-0">
                ${Q(t)}
            </div>
            <div class="ml-3">
                <p class="text-sm font-medium">${e}</p>
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
    `,document.body.appendChild(s),setTimeout(()=>{s.parentElement&&s.remove()},5e3)}function W(e){const t={success:"bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",error:"bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800",warning:"bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800",info:"bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800"};return t[e]||t.info}function Q(e){const t={success:`<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>`,error:`<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>`,warning:`<svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>`,info:`<svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>`};return t[e]||t.info}function V(e,t=300){e.style.opacity="0",e.style.transition=`opacity ${t}ms ease-in-out`,setTimeout(()=>{e.style.opacity="1"},10)}function A(e){Y(e.competitorOutlines),K(e.semanticAnalysis),ee(e.aspectsToTreat),b(),X()}function X(){const e=document.getElementById("resultsSection");e&&(e.classList.remove("hidden"),V(e))}function Y(e){const t=document.getElementById("competitorSection"),s=document.getElementById("competitorOutlines");!t||!s||!e||(s.innerHTML="",e.forEach((n,i)=>{const o=document.createElement("div");o.className="competitor-outline-item border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4";const a=document.createElement("div");a.className="flex items-center justify-between mb-3";const r=document.createElement("div");r.className="flex-1";const c=document.createElement("h3");c.className="font-semibold text-gray-900 dark:text-white text-sm",c.textContent=n.title||`Competitor ${i+1}`;const l=document.createElement("a");l.className="text-xs text-blue-600 dark:text-blue-400 hover:underline",l.href=n.url,l.target="_blank",l.textContent=n.url,r.appendChild(c),r.appendChild(l);const u=document.createElement("input");u.type="checkbox",u.id=`competitor-${i}`,u.checked=d.results.selectedElements.competitors.has(i),u.className="ml-4",u.addEventListener("change",()=>{d.toggleCompetitorSelection(i),b()}),a.appendChild(r),a.appendChild(u);const p=document.createElement("div");p.className="outline-content bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm font-mono whitespace-pre-line",p.textContent=n.outline||"Nessuna outline estratta",o.appendChild(a),o.appendChild(p),s.appendChild(o)}))}function K(e){const t=document.getElementById("semanticSection"),s=document.getElementById("semanticAnalysis");!t||!s||!e||(s.innerHTML="",m("Entità Principali",e.salientEntities,"salient",s),m("Sinonimi",e.synonyms,"synonym",s),e.categories&&Object.keys(e.categories).forEach(n=>{const i=e.categories[n];Z(n,i,s)}),m("Relazioni Tutto-Parte",e.partWholeRelationships,"partWholeRelationships",s),m("Collocazioni Comuni",e.commonCollocations,"commonCollocations",s),m("Affermazioni Correlate",e.relatedStatements,"relatedStatements",s),m("Domande Correlate",e.relatedQuestions,"relatedQuestions",s),m("Errori Comuni",e.commonErrors,"commonErrors",s),m("Dibattiti Attuali",e.currentDebates,"currentDebates",s))}function m(e,t,s,n){if(!t||!Array.isArray(t)||t.length===0)return;const i=document.createElement("div");i.className="semantic-section mb-6";const o=document.createElement("h4");o.className="font-semibold text-gray-900 dark:text-white mb-3",o.textContent=e;const a=document.createElement("div");a.className="flex flex-wrap gap-2",t.forEach((r,c)=>{const l=document.createElement("span");l.className="semantic-item px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm cursor-pointer border border-transparent hover:border-blue-300",l.textContent=r,l.dataset.elementId=`${s}_${c}`,d.results.selectedElements.semanticElements.has(`${s}_${c}`)&&(l.classList.add("selected"),l.classList.add("bg-green-100","dark:bg-green-900","text-green-800","dark:text-green-200"),l.classList.remove("bg-blue-100","dark:bg-blue-900","text-blue-800","dark:text-blue-200")),l.addEventListener("click",()=>{d.toggleSemanticElementSelection(`${s}_${c}`),se(l),b()}),a.appendChild(l)}),i.appendChild(o),i.appendChild(a),n.appendChild(i)}function Z(e,t,s){if(!t||!t.entities)return;const n=document.createElement("div");n.className="semantic-category mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg";const i=document.createElement("h4");i.className="font-semibold text-gray-900 dark:text-white mb-3",i.textContent=`Categoria: ${e}`,n.appendChild(i),m("Entità",t.entities,`category_${e}_entity`,n),t.examples&&m("Esempi",t.examples,`category_${e}_example`,n),t.attributes&&m("Attributi",t.attributes,`category_${e}_attribute`,n),s.appendChild(n)}function ee(e){const t=document.getElementById("aspectsSection"),s=document.getElementById("aspectsList");!t||!s||!e||(s.innerHTML="",e.aspectsByCategory&&Object.keys(e.aspectsByCategory).forEach(n=>{const i=e.aspectsByCategory[n],o=document.createElement("div");o.className="aspects-category mb-6";const a=document.createElement("h4");a.className="font-semibold text-gray-900 dark:text-white mb-3",a.textContent=n,o.appendChild(a),i.forEach((r,c)=>{const l=document.createElement("div");l.className="aspect-item flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg mb-2";const u=document.createElement("input");u.type="checkbox",u.id=`aspect-${n}-${c}`,u.checked=d.results.selectedElements.aspects.has(`${n}_${c}`),u.className="mt-1",u.addEventListener("change",()=>{d.toggleAspectSelection(`${n}_${c}`),b()});const p=document.createElement("div");p.className="flex-1";const y=document.createElement("h5");y.className="font-medium text-gray-900 dark:text-white",y.textContent=r.aspect;const v=document.createElement("p");v.className="text-sm text-gray-600 dark:text-gray-400 mt-1",v.textContent=r.description;const f=document.createElement("div");f.className="flex items-center space-x-4 mt-2";const C=document.createElement("span");if(C.className=`px-2 py-1 text-xs rounded-full ${te(r.priority)}`,C.textContent=r.priority,f.appendChild(C),r.foundInCompetitors&&r.foundInCompetitors.length>0){const S=document.createElement("span");S.className="text-xs text-gray-500 dark:text-gray-400",S.textContent=`Trovato in ${r.foundInCompetitors.length} competitor`,f.appendChild(S)}p.appendChild(y),p.appendChild(v),p.appendChild(f),l.appendChild(u),l.appendChild(p),o.appendChild(l)}),s.appendChild(o)}))}function te(e){const t={high:"bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",medium:"bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",low:"bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"};return t[e]||t.medium}function se(e){e.classList.contains("selected")?(e.classList.remove("selected"),e.classList.remove("bg-green-100","dark:bg-green-900","text-green-800","dark:text-green-200"),e.classList.add("bg-blue-100","dark:bg-blue-900","text-blue-800","dark:text-blue-200")):(e.classList.add("selected"),e.classList.add("bg-green-100","dark:bg-green-900","text-green-800","dark:text-green-200"),e.classList.remove("bg-blue-100","dark:bg-blue-900","text-blue-800","dark:text-blue-200"))}function b(){const e=d.getStatistics(),t=document.getElementById("competitorCount");t&&(t.textContent=`${e.selectedCompetitorCount}/${e.competitorCount}`);const s=document.getElementById("semanticCount");s&&(s.textContent=`${e.selectedSemanticElements}/${e.totalSemanticElements}`);const n=document.getElementById("aspectCount");n&&(n.textContent=`${e.selectedAspects}/${e.totalAspects}`);const i=document.getElementById("statsCard");i&&e.competitorCount>0&&i.classList.remove("hidden");const o=document.getElementById("proceedBtn");if(o){const a=e.selectedCompetitorCount>0||e.selectedSemanticElements>0||e.selectedAspects>0;o.disabled=!a}}function ie(){const e=document.getElementById("selectAllBtn"),t=document.getElementById("deselectAllBtn"),s=document.getElementById("proceedBtn");e&&e.addEventListener("click",()=>{d.selectAllElements(),A(d.results)}),t&&t.addEventListener("click",()=>{d.deselectAllElements(),A(d.results)}),s&&s.addEventListener("click",()=>{const n=d.getSelectedData();console.log("Selected data for phase 2:",n),alert("Fase 2 non ancora implementata. I dati selezionati sono stati salvati nella console.")})}function ne(){oe(),re(),le(),de(),ie()}function oe(){const e=document.getElementById("toggleOpenrouterApiKey");e&&e.addEventListener("click",()=>{ae("openrouterApiKey","openrouterEyeIcon")})}function ae(e,t){const s=document.getElementById(e),n=document.getElementById(t);if(!s||!n)return;const i=s.type==="password";s.type=i?"text":"password",n.innerHTML=i?'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />':'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />'}function re(){["openrouterApiKey","topicInput"].forEach(t=>{const s=document.getElementById(t);s&&s.addEventListener("input",()=>{if(t.includes("ApiKey")){const n=t.replace("ApiKey","");B(n,s.value)}setTimeout(()=>L(),0)})})}function le(){const e=document.getElementById("generateBtn");e&&e.addEventListener("click",ce)}async function ce(){try{const e=document.getElementById("openrouterApiKey").value.trim(),t=document.getElementById("topicInput").value.trim();if(!L())return;console.log("Skipping API key validation, proceeding with generation...");const s=await d.generateCompleteOutline(e,t);A(s),z(),J("Generazione completata con successo!")}catch(e){z(),F(`Errore durante la generazione: ${e.message}`),console.error("Generation error:",e)}}function de(){d.setProgressCallback((e,t)=>{ue(e,t)}),d.setStatusCallback(e=>{me(e)})}function ue(e,t){const s=document.getElementById("progressSection"),n=document.getElementById(`step${e}`);if(s&&s.classList.remove("hidden"),n){const i=n.querySelector(".w-4.h-4.rounded-full"),o=n.querySelector("span");i&&(i.className="w-4 h-4 rounded-full bg-blue-500"),o&&(o.textContent=t,o.className="text-sm font-medium text-blue-600 dark:text-blue-400");for(let a=1;a<e;a++){const r=document.getElementById(`step${a}`);if(r){const c=r.querySelector(".w-4.h-4.rounded-full");c&&(c.className="w-4 h-4 rounded-full bg-green-500");const l=r.querySelector("span");l&&(l.className="text-sm text-green-600 dark:text-green-400")}}}}function me(e){const t=document.getElementById("statusMessage");t&&(t.textContent=e)}function L(){const e=document.getElementById("openrouterApiKey").value.trim(),t=document.getElementById("topicInput").value.trim(),s=document.getElementById("generateBtn"),n=document.getElementById("generateHelp");let i=!0,o="";return e?t?t.length<3&&(i=!1,o="L'argomento deve essere di almeno 3 caratteri"):(i=!1,o="Inserisci un argomento/topic da analizzare"):(i=!1,o="Inserisci la tua API key di OpenRouter"),s&&(s.disabled=!i),n&&(o?(n.textContent=o,n.classList.remove("hidden")):n.classList.add("hidden")),i}document.addEventListener("DOMContentLoaded",()=>{O(),N(),ne(),document.body.classList.add("loaded")});
