(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function s(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(n){if(n.ep)return;n.ep=!0;const i=s(n);fetch(n.href,i)}})();function $(){const t=localStorage.getItem("gemini_api_key"),e=localStorage.getItem("openrouter_api_key");t&&(document.getElementById("geminiApiKey").value=t),e&&(document.getElementById("openrouterApiKey").value=e)}function N(t,e){e.trim()&&localStorage.setItem(`${t}_api_key`,e)}function R(){const t=document.getElementById("openrouterApiKey").value.trim(),e=document.getElementById("topicInput").value.trim(),s=t.length>=20,o=e.length>=3&&e.length<=100,n=s&&o,i=document.getElementById("generateBtn"),r=document.getElementById("generateHelp");i&&(i.disabled=!n);let a="";return s?o||(a="Argomento richiesto (3-100 caratteri)."):a="API key OpenRouter è richiesta (almeno 20 caratteri).",r&&(n?r.classList.add("hidden"):(r.textContent=a,r.classList.remove("hidden"))),L(document.getElementById("openrouterApiKey"),s),L(document.getElementById("topicInput"),o),n}function L(t,e){t&&(t.classList.remove("border-red-500","border-green-500","border-gray-300","dark:border-gray-600"),t.value.trim()===""?t.classList.add("border-gray-300","dark:border-gray-600"):e?t.classList.add("border-green-500"):t.classList.add("border-red-500"))}function M(){$(),R(),console.log("✅ Outline Semantic Analyzer inizializzato")}function _(){const t=localStorage.getItem("dark_mode")==="true",e=document.getElementById("darkModeToggle"),s=document.getElementById("darkModeIcon");t&&(document.documentElement.classList.add("dark"),B(s,!0)),e&&e.addEventListener("click",()=>{const o=document.documentElement.classList.toggle("dark");localStorage.setItem("dark_mode",o.toString()),B(s,o)})}function B(t,e){t&&(t.innerHTML=e?'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>':'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>')}const P="https://openrouter.ai/api/v1",A=3,x=1e3,g={SERP_SEARCH:"perplexity/llama-3.1-sonar-large-128k-online",OUTLINE_EXTRACTION:"openai/gpt-4o-mini",SEMANTIC_ANALYSIS:"anthropic/claude-3-5-sonnet-20241022",ASPECT_GENERATION:"anthropic/claude-3-5-sonnet-20241022",OUTLINE_GENERATION:"anthropic/claude-3-5-sonnet-20241022"},D=["conclusione","conclusioni","chi siamo","chiama ora","contattaci","contatti","richiedi preventivo","preventivo","offerta","promozione","sconto","privacy policy","termini di servizio","cookie policy","disclaimer","footer","sidebar","menu","navigazione","breadcrumb","condividi","social","newsletter","iscriviti","seguici","testimonial","recensioni cliente","clienti","portfolio","servizi correlati","prodotti correlati","articoli correlati","biografia autore","autore","about us","team","staff","faq generiche","domande frequenti generiche","help","supporto","login","registrati","account","profilo utente"];async function h(t,e,s,o=1e3){if(!t||!e||!s)throw new Error("API key, model, and messages are required");const n=`${P}/chat/completions`,i={model:e,messages:s,max_tokens:o,temperature:.7,top_p:1,frequency_penalty:0,presence_penalty:0};return await E(n,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,"HTTP-Referer":window.location.origin,"X-Title":"AI Outline Generator"},body:JSON.stringify(i)})}async function H(t,e){const s=[{role:"user",content:`Cerca online i primi 10 risultati per l'argomento "${e}". 
            
            Concentrati su:
            - Articoli di blog
            - Guide complete
            - Pagine informative
            - Risorse educative
            
            Evita:
            - Pagine commerciali con solo vendita
            - Social media posts
            - News brevissime
            - Pagine senza contenuto sostanziale
            
            Per ogni risultato fornisci:
            - URL
            - Titolo
            - Breve descrizione del contenuto
            
            Rispondi in formato JSON:
            {
                "results": [
                    {
                        "url": "https://example.com",
                        "title": "Titolo della pagina",
                        "description": "Breve descrizione"
                    }
                ]
            }`}];try{const i=(await h(t,g.SERP_SEARCH,s,2e3)).choices[0].message.content.match(/\{[\s\S]*\}/);if(i)return JSON.parse(i[0]).results||[];throw new Error("Invalid response format")}catch(o){throw console.error("Error searching competitor URLs:",o),o}}async function j(t,e,s,o){const n=[{role:"system",content:"Sei un esperto nell'estrazione di outline da contenuti web. Il tuo compito è identificare la struttura gerarchica dei contenuti (H1, H2, H3) da una pagina web."},{role:"user",content:`Estrai l'outline strutturale dalla seguente pagina web:

URL: ${e}
Titolo: ${s}
Descrizione: ${o}

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

Se non riesci ad accedere al contenuto, prova a immaginare una struttura logica basata su titolo e descrizione.`}];try{const r=(await h(t,g.OUTLINE_EXTRACTION,n,1500)).choices[0].message.content.trim(),a=U(r);return{url:e,title:s,outline:a}}catch(i){throw console.error("Error extracting outline:",i),i}}function U(t){return t.split(`
`).filter(o=>{const n=o.toLowerCase();return!D.some(i=>n.includes(i.toLowerCase()))}).join(`
`)}async function q(t,e){const s=[{role:"system",content:"Sei un esperto linguista e semantologo. Il tuo compito è creare un'analisi semantica completa e dettagliata di un argomento specifico."},{role:"user",content:`Think this step by step.
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
}`}];try{const i=(await h(t,g.SEMANTIC_ANALYSIS,s,4e3)).choices[0].message.content.match(/\{[\s\S]*\}/);if(i)return JSON.parse(i[0]);throw new Error("Invalid response format")}catch(o){throw console.error("Error generating semantic analysis:",o),o}}async function G(t,e,s){const o=[{role:"system",content:"Sei un esperto content strategist. Il tuo compito è analizzare le outline dei competitor e identificare tutti gli aspetti che dovrebbero essere trattati per creare un contenuto completo e competitivo su un argomento."},{role:"user",content:`Analizza queste outline dei competitor per l'argomento "${e}" e identifica tutti gli aspetti che dovrebbero essere trattati:

OUTLINE COMPETITOR:
${s.map((n,i)=>`
COMPETITOR ${i+1} (${n.title}):
${n.outline}
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
}`}];try{const r=(await h(t,g.ASPECT_GENERATION,o,3e3)).choices[0].message.content.match(/\{[\s\S]*\}/);if(r)return JSON.parse(r[0]);throw new Error("Invalid response format")}catch(n){throw console.error("Error generating aspects to treat:",n),n}}async function E(t,e,s=0){var o;try{const n=await fetch(t,e);if(!n.ok){const r=await n.json().catch(()=>({}));if(n.status===429&&s<A){const a=x*Math.pow(2,s);return console.warn(`Rate limited. Retrying in ${a}ms...`),await k(a),E(t,e,s+1)}if(n.status>=500&&s<A){const a=x*Math.pow(2,s);return console.warn(`Server error ${n.status}. Retrying in ${a}ms...`),await k(a),E(t,e,s+1)}throw new Error(`OpenRouter API Error ${n.status}: ${((o=r.error)==null?void 0:o.message)||"Unknown error"}`)}const i=await n.json();if(!i.choices||!i.choices[0]||!i.choices[0].message)throw new Error("Invalid response format from OpenRouter API");return i}catch(n){if(n.name==="TypeError"&&n.message.includes("fetch"))throw new Error("Errore di connessione. Verifica la tua connessione internet.");if(s<A&&(n.message.includes("network")||n.message.includes("timeout")||n.message.includes("fetch"))){const i=x*Math.pow(2,s);return console.warn(`Network error. Retrying in ${i}ms...`),await k(i),E(t,e,s+1)}throw n}}function k(t){return new Promise(e=>setTimeout(e,t))}async function V(t){try{const e=[{role:"user",content:'Rispondi con "OK" se ricevi questo messaggio.'}],s=await h(t,g.OUTLINE_EXTRACTION,e,10);return s.choices&&s.choices[0]&&s.choices[0].message}catch(e){return console.error("OpenRouter API key test failed:",e.message),!1}}class K{constructor(){this.results={competitorUrls:[],competitorOutlines:[],semanticAnalysis:null,aspectsToTreat:null,selectedElements:{competitors:new Set,semanticElements:new Set,aspects:new Set}},this.progressCallback=null,this.statusCallback=null}setProgressCallback(e){this.progressCallback=e}setStatusCallback(e){this.statusCallback=e}updateProgress(e,s){this.progressCallback&&this.progressCallback(e,s)}updateStatus(e){this.statusCallback&&this.statusCallback(e)}async generateCompleteOutline(e,s){try{this.updateStatus("Iniziando la generazione..."),this.updateProgress(1,"Ricerca competitor nella SERP"),this.updateStatus("Cercando competitor nella SERP..."),this.results.competitorUrls=await H(e,s),this.updateProgress(2,"Estrazione outline competitor"),this.updateStatus("Estraendo outline dai competitor..."),this.results.competitorOutlines=[];for(let o=0;o<Math.min(this.results.competitorUrls.length,10);o++){const n=this.results.competitorUrls[o];try{const i=await j(e,n.url,n.title,n.description);this.results.competitorOutlines.push(i),this.results.selectedElements.competitors.add(o)}catch(i){console.warn(`Failed to extract outline from ${n.url}:`,i)}}return this.updateProgress(3,"Analisi semantica completa"),this.updateStatus("Generando analisi semantica completa..."),this.results.semanticAnalysis=await q(e,s),this.selectAllSemanticElements(),this.updateProgress(4,"Generazione aspetti da trattare"),this.updateStatus("Identificando aspetti da trattare..."),this.results.aspectsToTreat=await G(e,s,this.results.competitorOutlines),this.selectAllAspects(),this.updateProgress(5,"Compilazione risultati completata"),this.updateStatus("Generazione completata con successo!"),this.results}catch(o){throw this.updateStatus(`Errore durante la generazione: ${o.message}`),o}}selectAllSemanticElements(){var e,s;this.results.selectedElements.semanticElements.clear(),this.results.semanticAnalysis&&((e=this.results.semanticAnalysis.salientEntities)==null||e.forEach((o,n)=>{this.results.selectedElements.semanticElements.add(`salient_${n}`)}),(s=this.results.semanticAnalysis.synonyms)==null||s.forEach((o,n)=>{this.results.selectedElements.semanticElements.add(`synonym_${n}`)}),Object.keys(this.results.semanticAnalysis.categories||{}).forEach(o=>{var i;this.results.selectedElements.semanticElements.add(`category_${o}`),(i=this.results.semanticAnalysis.categories[o].entities)==null||i.forEach((r,a)=>{this.results.selectedElements.semanticElements.add(`category_${o}_entity_${a}`)})}),["partWholeRelationships","commonCollocations","relatedStatements","relatedQuestions","commonErrors","currentDebates"].forEach(o=>{var n;(n=this.results.semanticAnalysis[o])==null||n.forEach((i,r)=>{this.results.selectedElements.semanticElements.add(`${o}_${r}`)})}))}selectAllAspects(){var e;this.results.selectedElements.aspects.clear(),(e=this.results.aspectsToTreat)!=null&&e.aspectsByCategory&&Object.keys(this.results.aspectsToTreat.aspectsByCategory).forEach(s=>{this.results.aspectsToTreat.aspectsByCategory[s].forEach((n,i)=>{this.results.selectedElements.aspects.add(`${s}_${i}`)})})}deselectAllElements(){this.results.selectedElements.competitors.clear(),this.results.selectedElements.semanticElements.clear(),this.results.selectedElements.aspects.clear()}selectAllElements(){this.results.competitorOutlines.forEach((e,s)=>{this.results.selectedElements.competitors.add(s)}),this.selectAllSemanticElements(),this.selectAllAspects()}toggleCompetitorSelection(e){this.results.selectedElements.competitors.has(e)?this.results.selectedElements.competitors.delete(e):this.results.selectedElements.competitors.add(e)}toggleSemanticElementSelection(e){this.results.selectedElements.semanticElements.has(e)?this.results.selectedElements.semanticElements.delete(e):this.results.selectedElements.semanticElements.add(e)}toggleAspectSelection(e){this.results.selectedElements.aspects.has(e)?this.results.selectedElements.aspects.delete(e):this.results.selectedElements.aspects.add(e)}getSelectedData(){const e=this.results.competitorOutlines.filter((n,i)=>this.results.selectedElements.competitors.has(i)),s=this.extractSelectedSemanticData(),o=this.extractSelectedAspects();return{competitors:e,semanticAnalysis:s,aspects:o,counts:{competitors:e.length,semanticElements:this.results.selectedElements.semanticElements.size,aspects:this.results.selectedElements.aspects.size}}}extractSelectedSemanticData(){var n,i;if(!this.results.semanticAnalysis)return null;const e={},s=[];(n=this.results.semanticAnalysis.salientEntities)==null||n.forEach((r,a)=>{this.results.selectedElements.semanticElements.has(`salient_${a}`)&&s.push(r)}),s.length>0&&(e.salientEntities=s);const o=[];return(i=this.results.semanticAnalysis.synonyms)==null||i.forEach((r,a)=>{this.results.selectedElements.semanticElements.has(`synonym_${a}`)&&o.push(r)}),o.length>0&&(e.synonyms=o),e}extractSelectedAspects(){var s;if(!((s=this.results.aspectsToTreat)!=null&&s.aspectsByCategory))return null;const e={};return Object.keys(this.results.aspectsToTreat.aspectsByCategory).forEach(o=>{const n=this.results.aspectsToTreat.aspectsByCategory[o],i=[];n.forEach((r,a)=>{this.results.selectedElements.aspects.has(`${o}_${a}`)&&i.push(r)}),i.length>0&&(e[o]=i)}),e}getStatistics(){return{competitorCount:this.results.competitorOutlines.length,selectedCompetitorCount:this.results.selectedElements.competitors.size,totalSemanticElements:this.calculateTotalSemanticElements(),selectedSemanticElements:this.results.selectedElements.semanticElements.size,totalAspects:this.calculateTotalAspects(),selectedAspects:this.results.selectedElements.aspects.size}}calculateTotalSemanticElements(){var s,o;if(!this.results.semanticAnalysis)return 0;let e=0;return e+=((s=this.results.semanticAnalysis.salientEntities)==null?void 0:s.length)||0,e+=((o=this.results.semanticAnalysis.synonyms)==null?void 0:o.length)||0,Object.values(this.results.semanticAnalysis.categories||{}).forEach(n=>{var i;e+=((i=n.entities)==null?void 0:i.length)||0}),["partWholeRelationships","commonCollocations","relatedStatements","relatedQuestions","commonErrors","currentDebates"].forEach(n=>{var i;e+=((i=this.results.semanticAnalysis[n])==null?void 0:i.length)||0}),e}calculateTotalAspects(){var s;if(!((s=this.results.aspectsToTreat)!=null&&s.aspectsByCategory))return 0;let e=0;return Object.values(this.results.aspectsToTreat.aspectsByCategory).forEach(o=>{e+=o.length}),e}}const l=new K;function F(t="Caricamento in corso..."){const e=document.getElementById("loadingOverlay"),s=document.getElementById("loadingMessage");e&&s&&(s.textContent=t,e.classList.remove("hidden"))}function w(){const t=document.getElementById("loadingOverlay");t&&t.classList.add("hidden")}function T(t){z(t,"error")}function W(t){z(t,"success")}function z(t,e="info"){const s=document.createElement("div");s.className=`fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-lg z-50 animate-slide-up ${J(e)}`,s.innerHTML=`
        <div class="flex items-center">
            <div class="flex-shrink-0">
                ${Q(e)}
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
    `,document.body.appendChild(s),setTimeout(()=>{s.parentElement&&s.remove()},5e3)}function J(t){const e={success:"bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",error:"bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800",warning:"bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800",info:"bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800"};return e[t]||e.info}function Q(t){const e={success:`<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>`,error:`<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>`,warning:`<svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>`,info:`<svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>`};return e[t]||e.info}function X(t,e=300){t.style.opacity="0",t.style.transition=`opacity ${e}ms ease-in-out`,setTimeout(()=>{t.style.opacity="1"},10)}function I(t){Z(t.competitorOutlines),ee(t.semanticAnalysis),se(t.aspectsToTreat),y(),Y()}function Y(){const t=document.getElementById("resultsSection");t&&(t.classList.remove("hidden"),X(t))}function Z(t){const e=document.getElementById("competitorSection"),s=document.getElementById("competitorOutlines");!e||!s||!t||(s.innerHTML="",t.forEach((o,n)=>{const i=document.createElement("div");i.className="competitor-outline-item border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4";const r=document.createElement("div");r.className="flex items-center justify-between mb-3";const a=document.createElement("div");a.className="flex-1";const d=document.createElement("h3");d.className="font-semibold text-gray-900 dark:text-white text-sm",d.textContent=o.title||`Competitor ${n+1}`;const c=document.createElement("a");c.className="text-xs text-blue-600 dark:text-blue-400 hover:underline",c.href=o.url,c.target="_blank",c.textContent=o.url,a.appendChild(d),a.appendChild(c);const m=document.createElement("input");m.type="checkbox",m.id=`competitor-${n}`,m.checked=l.results.selectedElements.competitors.has(n),m.className="ml-4",m.addEventListener("change",()=>{l.toggleCompetitorSelection(n),y()}),r.appendChild(a),r.appendChild(m);const p=document.createElement("div");p.className="outline-content bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm font-mono whitespace-pre-line",p.textContent=o.outline||"Nessuna outline estratta",i.appendChild(r),i.appendChild(p),s.appendChild(i)}))}function ee(t){const e=document.getElementById("semanticSection"),s=document.getElementById("semanticAnalysis");!e||!s||!t||(s.innerHTML="",u("Entità Principali",t.salientEntities,"salient",s),u("Sinonimi",t.synonyms,"synonym",s),t.categories&&Object.keys(t.categories).forEach(o=>{const n=t.categories[o];te(o,n,s)}),u("Relazioni Tutto-Parte",t.partWholeRelationships,"partWholeRelationships",s),u("Collocazioni Comuni",t.commonCollocations,"commonCollocations",s),u("Affermazioni Correlate",t.relatedStatements,"relatedStatements",s),u("Domande Correlate",t.relatedQuestions,"relatedQuestions",s),u("Errori Comuni",t.commonErrors,"commonErrors",s),u("Dibattiti Attuali",t.currentDebates,"currentDebates",s))}function u(t,e,s,o){if(!e||!Array.isArray(e)||e.length===0)return;const n=document.createElement("div");n.className="semantic-section mb-6";const i=document.createElement("h4");i.className="font-semibold text-gray-900 dark:text-white mb-3",i.textContent=t;const r=document.createElement("div");r.className="flex flex-wrap gap-2",e.forEach((a,d)=>{const c=document.createElement("span");c.className="semantic-item px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm cursor-pointer border border-transparent hover:border-blue-300",c.textContent=a,c.dataset.elementId=`${s}_${d}`,l.results.selectedElements.semanticElements.has(`${s}_${d}`)&&(c.classList.add("selected"),c.classList.add("bg-green-100","dark:bg-green-900","text-green-800","dark:text-green-200"),c.classList.remove("bg-blue-100","dark:bg-blue-900","text-blue-800","dark:text-blue-200")),c.addEventListener("click",()=>{l.toggleSemanticElementSelection(`${s}_${d}`),oe(c),y()}),r.appendChild(c)}),n.appendChild(i),n.appendChild(r),o.appendChild(n)}function te(t,e,s){if(!e||!e.entities)return;const o=document.createElement("div");o.className="semantic-category mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg";const n=document.createElement("h4");n.className="font-semibold text-gray-900 dark:text-white mb-3",n.textContent=`Categoria: ${t}`,o.appendChild(n),u("Entità",e.entities,`category_${t}_entity`,o),e.examples&&u("Esempi",e.examples,`category_${t}_example`,o),e.attributes&&u("Attributi",e.attributes,`category_${t}_attribute`,o),s.appendChild(o)}function se(t){const e=document.getElementById("aspectsSection"),s=document.getElementById("aspectsList");!e||!s||!t||(s.innerHTML="",t.aspectsByCategory&&Object.keys(t.aspectsByCategory).forEach(o=>{const n=t.aspectsByCategory[o],i=document.createElement("div");i.className="aspects-category mb-6";const r=document.createElement("h4");r.className="font-semibold text-gray-900 dark:text-white mb-3",r.textContent=o,i.appendChild(r),n.forEach((a,d)=>{const c=document.createElement("div");c.className="aspect-item flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg mb-2";const m=document.createElement("input");m.type="checkbox",m.id=`aspect-${o}-${d}`,m.checked=l.results.selectedElements.aspects.has(`${o}_${d}`),m.className="mt-1",m.addEventListener("change",()=>{l.toggleAspectSelection(`${o}_${d}`),y()});const p=document.createElement("div");p.className="flex-1";const b=document.createElement("h5");b.className="font-medium text-gray-900 dark:text-white",b.textContent=a.aspect;const v=document.createElement("p");v.className="text-sm text-gray-600 dark:text-gray-400 mt-1",v.textContent=a.description;const f=document.createElement("div");f.className="flex items-center space-x-4 mt-2";const C=document.createElement("span");if(C.className=`px-2 py-1 text-xs rounded-full ${ne(a.priority)}`,C.textContent=a.priority,f.appendChild(C),a.foundInCompetitors&&a.foundInCompetitors.length>0){const S=document.createElement("span");S.className="text-xs text-gray-500 dark:text-gray-400",S.textContent=`Trovato in ${a.foundInCompetitors.length} competitor`,f.appendChild(S)}p.appendChild(b),p.appendChild(v),p.appendChild(f),c.appendChild(m),c.appendChild(p),i.appendChild(c)}),s.appendChild(i)}))}function ne(t){const e={high:"bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",medium:"bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",low:"bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"};return e[t]||e.medium}function oe(t){t.classList.contains("selected")?(t.classList.remove("selected"),t.classList.remove("bg-green-100","dark:bg-green-900","text-green-800","dark:text-green-200"),t.classList.add("bg-blue-100","dark:bg-blue-900","text-blue-800","dark:text-blue-200")):(t.classList.add("selected"),t.classList.add("bg-green-100","dark:bg-green-900","text-green-800","dark:text-green-200"),t.classList.remove("bg-blue-100","dark:bg-blue-900","text-blue-800","dark:text-blue-200"))}function y(){const t=l.getStatistics(),e=document.getElementById("competitorCount");e&&(e.textContent=`${t.selectedCompetitorCount}/${t.competitorCount}`);const s=document.getElementById("semanticCount");s&&(s.textContent=`${t.selectedSemanticElements}/${t.totalSemanticElements}`);const o=document.getElementById("aspectCount");o&&(o.textContent=`${t.selectedAspects}/${t.totalAspects}`);const n=document.getElementById("statsCard");n&&t.competitorCount>0&&n.classList.remove("hidden");const i=document.getElementById("proceedBtn");if(i){const r=t.selectedCompetitorCount>0||t.selectedSemanticElements>0||t.selectedAspects>0;i.disabled=!r}}function ie(){const t=document.getElementById("selectAllBtn"),e=document.getElementById("deselectAllBtn"),s=document.getElementById("proceedBtn");t&&t.addEventListener("click",()=>{l.selectAllElements(),I(l.results)}),e&&e.addEventListener("click",()=>{l.deselectAllElements(),I(l.results)}),s&&s.addEventListener("click",()=>{const o=l.getSelectedData();console.log("Selected data for phase 2:",o),alert("Fase 2 non ancora implementata. I dati selezionati sono stati salvati nella console.")})}function re(){ae(),le(),de(),ue(),ie()}function ae(){const t=document.getElementById("toggleOpenrouterApiKey");t&&t.addEventListener("click",()=>{ce("openrouterApiKey","openrouterEyeIcon")})}function ce(t,e){const s=document.getElementById(t),o=document.getElementById(e);if(!s||!o)return;const n=s.type==="password";s.type=n?"text":"password",o.innerHTML=n?'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />':'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />'}function le(){["openrouterApiKey","topicInput"].forEach(e=>{const s=document.getElementById(e);s&&s.addEventListener("input",()=>{if(e.includes("ApiKey")){const o=e.replace("ApiKey","");N(o,s.value)}O()})})}function de(){const t=document.getElementById("generateBtn");t&&t.addEventListener("click",me)}async function me(){try{const t=document.getElementById("openrouterApiKey").value.trim(),e=document.getElementById("topicInput").value.trim();if(!O())return;if(F("Verifica API key..."),!await V(t)){w(),T("API key OpenRouter non valida. Verifica e riprova.");return}const o=await l.generateCompleteOutline(t,e);I(o),w(),W("Generazione completata con successo!")}catch(t){w(),T(`Errore durante la generazione: ${t.message}`),console.error("Generation error:",t)}}function ue(){l.setProgressCallback((t,e)=>{pe(t,e)}),l.setStatusCallback(t=>{ge(t)})}function pe(t,e){const s=document.getElementById("progressSection"),o=document.getElementById(`step${t}`);if(s&&s.classList.remove("hidden"),o){const n=o.querySelector(".w-4.h-4.rounded-full"),i=o.querySelector("span");n&&(n.className="w-4 h-4 rounded-full bg-blue-500"),i&&(i.textContent=e,i.className="text-sm font-medium text-blue-600 dark:text-blue-400");for(let r=1;r<t;r++){const a=document.getElementById(`step${r}`);if(a){const d=a.querySelector(".w-4.h-4.rounded-full");d&&(d.className="w-4 h-4 rounded-full bg-green-500");const c=a.querySelector("span");c&&(c.className="text-sm text-green-600 dark:text-green-400")}}}}function ge(t){const e=document.getElementById("statusMessage");e&&(e.textContent=t)}function O(){const t=document.getElementById("openrouterApiKey").value.trim(),e=document.getElementById("topicInput").value.trim(),s=document.getElementById("generateBtn"),o=document.getElementById("generateHelp");let n=!0,i="";return t?e?e.length<3&&(n=!1,i="L'argomento deve essere di almeno 3 caratteri"):(n=!1,i="Inserisci un argomento/topic da analizzare"):(n=!1,i="Inserisci la tua API key di OpenRouter"),s&&(s.disabled=!n),o&&(i?(o.textContent=i,o.classList.remove("hidden")):o.classList.add("hidden")),n}document.addEventListener("DOMContentLoaded",()=>{M(),_(),re(),document.body.classList.add("loaded")});
