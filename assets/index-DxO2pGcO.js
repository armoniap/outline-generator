(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function s(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(n){if(n.ep)return;n.ep=!0;const i=s(n);fetch(n.href,i)}})();function B(){const e=localStorage.getItem("openrouter_api_key"),t=document.getElementById("openrouterApiKey");e&&t&&(t.value=e)}function z(e,t){t.trim()&&localStorage.setItem(`${e}_api_key`,t)}function O(){B(),console.log("✅ AI Outline Generator inizializzato")}function N(){const e=localStorage.getItem("dark_mode")==="true",t=document.getElementById("darkModeToggle"),s=document.getElementById("darkModeIcon");e&&(document.documentElement.classList.add("dark"),I(s,!0)),t&&t.addEventListener("click",()=>{const o=document.documentElement.classList.toggle("dark");localStorage.setItem("dark_mode",o.toString()),I(s,o)})}function I(e,t){e&&(e.innerHTML=t?'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>':'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>')}const M="https://openrouter.ai/api/v1",w=3,x=1e3,h={SERP_SEARCH:"perplexity/sonar",OUTLINE_EXTRACTION:"openai/gpt-4o-mini",SEMANTIC_ANALYSIS:"anthropic/claude-3-5-sonnet-20241022",ASPECT_GENERATION:"anthropic/claude-3-5-sonnet-20241022",OUTLINE_GENERATION:"anthropic/claude-3-5-sonnet-20241022",FALLBACK_MODEL:"openai/gpt-3.5-turbo"},R=["conclusione","conclusioni","chi siamo","chiama ora","contattaci","contatti","richiedi preventivo","preventivo","offerta","promozione","sconto","privacy policy","termini di servizio","cookie policy","disclaimer","footer","sidebar","menu","navigazione","breadcrumb","condividi","social","newsletter","iscriviti","seguici","testimonial","recensioni cliente","clienti","portfolio","servizi correlati","prodotti correlati","articoli correlati","biografia autore","autore","about us","team","staff","faq generiche","domande frequenti generiche","help","supporto","login","registrati","account","profilo utente"];async function g(e,t,s,o=1e3){if(!e||!t||!s)throw new Error("API key, model, and messages are required");const n=`${M}/chat/completions`,i={model:t,messages:s,max_tokens:o,temperature:.7,top_p:1,frequency_penalty:0,presence_penalty:0};return await E(n,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`,"HTTP-Referer":window.location.origin,"X-Title":"AI Outline Generator"},body:JSON.stringify(i)})}async function _(e,t){const s=[{role:"user",content:`Search online for the top 10 results about "${t}". 
            
            Focus on:
            - Blog articles
            - Complete guides
            - Informative pages
            - Educational resources
            
            Avoid:
            - Pure commercial/sales pages
            - Social media posts
            - Brief news items
            - Pages without substantial content
            
            For each result provide:
            - URL
            - Title
            - Brief content description
            
            Respond in JSON format:
            {
                "results": [
                    {
                        "url": "https://example.com",
                        "title": "Page title",
                        "description": "Brief description"
                    }
                ]
            }`}];try{const i=(await g(e,h.SERP_SEARCH,s,2e3)).choices[0].message.content.match(/\{[\s\S]*\}/);if(i)return JSON.parse(i[0]).results||[];throw new Error("Invalid response format from Perplexity")}catch(o){return console.warn("Perplexity search failed, using fallback with GPT-4o-mini:",o.message),await P(e,t)}}async function P(e,t){const s=[{role:"system",content:"You are a helpful assistant that generates realistic example URLs and content for competitor analysis based on a given topic."},{role:"user",content:`Generate 10 realistic competitor URLs and content descriptions for the topic "${t}". These should be typical pages that would rank well for this topic.
            
            Create realistic:
            - Domain names (like example1.com, blog.example2.com, etc.)
            - Page titles
            - Brief descriptions of what each page would contain
            
            Focus on educational and informative content types.
            
            Respond in JSON format:
            {
                "results": [
                    {
                        "url": "https://example.com/page",
                        "title": "Realistic page title",
                        "description": "What this page would contain"
                    }
                ]
            }`}];try{const i=(await g(e,h.FALLBACK_MODEL,s,1500)).choices[0].message.content.match(/\{[\s\S]*\}/);if(i)return JSON.parse(i[0]).results||[];throw new Error("Invalid response format")}catch(o){return console.error("Error in fallback competitor search:",o),D(t)}}function D(e){return[{url:"https://example1.com/guide",title:`Complete Guide to ${e}`,description:`Comprehensive guide covering all aspects of ${e}`},{url:"https://blog.example2.com/article",title:`${e}: Everything You Need to Know`,description:`Detailed article explaining ${e} fundamentals`},{url:"https://example3.com/tutorial",title:`How to Master ${e}`,description:`Step-by-step tutorial for ${e}`},{url:"https://example4.com/tips",title:`Top 10 ${e} Tips`,description:`Expert tips and best practices for ${e}`},{url:"https://example5.com/advanced",title:`Advanced ${e} Strategies`,description:`Advanced techniques and strategies for ${e}`}]}async function H(e,t,s,o){const n=[{role:"system",content:"Sei un esperto nell'estrazione di outline da contenuti web. Il tuo compito è identificare la struttura gerarchica dei contenuti (H1, H2, H3) da una pagina web."},{role:"user",content:`Estrai l'outline strutturale dalla seguente pagina web:

URL: ${t}
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

Se non riesci ad accedere al contenuto, prova a immaginare una struttura logica basata su titolo e descrizione.`}];try{const r=(await g(e,h.OUTLINE_EXTRACTION,n,1500)).choices[0].message.content.trim(),a=j(r);return{url:t,title:s,outline:a}}catch(i){throw console.error("Error extracting outline:",i),i}}function j(e){return e.split(`
`).filter(o=>{const n=o.toLowerCase();return!R.some(i=>n.includes(i.toLowerCase()))}).join(`
`)}async function G(e,t){const s=[{role:"system",content:"Sei un esperto linguista e semantologo. Il tuo compito è creare un'analisi semantica completa e dettagliata di un argomento specifico."},{role:"user",content:`Think this step by step.
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
}`}];try{const i=(await g(e,h.SEMANTIC_ANALYSIS,s,4e3)).choices[0].message.content.match(/\{[\s\S]*\}/);if(i)return JSON.parse(i[0]);throw new Error("Invalid response format")}catch(o){throw console.error("Error generating semantic analysis:",o),o}}async function U(e,t,s){const o=[{role:"system",content:"Sei un esperto content strategist. Il tuo compito è analizzare le outline dei competitor e identificare tutti gli aspetti che dovrebbero essere trattati per creare un contenuto completo e competitivo su un argomento."},{role:"user",content:`Analizza queste outline dei competitor per l'argomento "${t}" e identifica tutti gli aspetti che dovrebbero essere trattati:

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
}`}];try{const r=(await g(e,h.ASPECT_GENERATION,o,3e3)).choices[0].message.content.match(/\{[\s\S]*\}/);if(r)return JSON.parse(r[0]);throw new Error("Invalid response format")}catch(n){throw console.error("Error generating aspects to treat:",n),n}}async function E(e,t,s=0){var o;try{const n=await fetch(e,t);if(!n.ok){const r=await n.json().catch(()=>({}));if(n.status===429&&s<w){const c=x*Math.pow(2,s);return console.warn(`Rate limited. Retrying in ${c}ms...`),await k(c),E(e,t,s+1)}if(n.status>=500&&s<w){const c=x*Math.pow(2,s);return console.warn(`Server error ${n.status}. Retrying in ${c}ms...`),await k(c),E(e,t,s+1)}const a=((o=r.error)==null?void 0:o.message)||r.message||"Unknown error",l=n.status===400?`Bad Request - Check API key and model availability. ${a}`:`HTTP ${n.status} - ${a}`;throw new Error(`OpenRouter API Error ${n.status}: ${l}`)}const i=await n.json();if(!i.choices||!i.choices[0]||!i.choices[0].message)throw new Error("Invalid response format from OpenRouter API");return i}catch(n){if(n.name==="TypeError"&&n.message.includes("fetch"))throw new Error("Errore di connessione. Verifica la tua connessione internet.");if(s<w&&(n.message.includes("network")||n.message.includes("timeout")||n.message.includes("fetch"))){const i=x*Math.pow(2,s);return console.warn(`Network error. Retrying in ${i}ms...`),await k(i),E(e,t,s+1)}throw n}}function k(e){return new Promise(t=>setTimeout(t,e))}class q{constructor(){this.results={competitorUrls:[],competitorOutlines:[],semanticAnalysis:null,aspectsToTreat:null,selectedElements:{competitors:new Set,semanticElements:new Set,aspects:new Set}},this.progressCallback=null,this.statusCallback=null}setProgressCallback(t){this.progressCallback=t}setStatusCallback(t){this.statusCallback=t}updateProgress(t,s){this.progressCallback&&this.progressCallback(t,s)}updateStatus(t){this.statusCallback&&this.statusCallback(t)}async generateCompleteOutline(t,s){try{this.updateStatus("Iniziando la generazione..."),this.updateProgress(1,"Ricerca competitor nella SERP"),this.updateStatus("Cercando competitor nella SERP..."),this.results.competitorUrls=await _(t,s),this.updateProgress(2,"Estrazione outline competitor"),this.updateStatus("Estraendo outline dai competitor..."),this.results.competitorOutlines=[];for(let o=0;o<Math.min(this.results.competitorUrls.length,10);o++){const n=this.results.competitorUrls[o];try{const i=await H(t,n.url,n.title,n.description);this.results.competitorOutlines.push(i),this.results.selectedElements.competitors.add(o)}catch(i){console.warn(`Failed to extract outline from ${n.url}:`,i)}}return this.updateProgress(3,"Analisi semantica completa"),this.updateStatus("Generando analisi semantica completa..."),this.results.semanticAnalysis=await G(t,s),this.selectAllSemanticElements(),this.updateProgress(4,"Generazione aspetti da trattare"),this.updateStatus("Identificando aspetti da trattare..."),this.results.aspectsToTreat=await U(t,s,this.results.competitorOutlines),this.selectAllAspects(),this.updateProgress(5,"Compilazione risultati completata"),this.updateStatus("Generazione completata con successo!"),this.results}catch(o){throw this.updateStatus(`Errore durante la generazione: ${o.message}`),o}}selectAllSemanticElements(){var t,s;this.results.selectedElements.semanticElements.clear(),this.results.semanticAnalysis&&((t=this.results.semanticAnalysis.salientEntities)==null||t.forEach((o,n)=>{this.results.selectedElements.semanticElements.add(`salient_${n}`)}),(s=this.results.semanticAnalysis.synonyms)==null||s.forEach((o,n)=>{this.results.selectedElements.semanticElements.add(`synonym_${n}`)}),Object.keys(this.results.semanticAnalysis.categories||{}).forEach(o=>{var i;this.results.selectedElements.semanticElements.add(`category_${o}`),(i=this.results.semanticAnalysis.categories[o].entities)==null||i.forEach((r,a)=>{this.results.selectedElements.semanticElements.add(`category_${o}_entity_${a}`)})}),["partWholeRelationships","commonCollocations","relatedStatements","relatedQuestions","commonErrors","currentDebates"].forEach(o=>{var n;(n=this.results.semanticAnalysis[o])==null||n.forEach((i,r)=>{this.results.selectedElements.semanticElements.add(`${o}_${r}`)})}))}selectAllAspects(){var t;this.results.selectedElements.aspects.clear(),(t=this.results.aspectsToTreat)!=null&&t.aspectsByCategory&&Object.keys(this.results.aspectsToTreat.aspectsByCategory).forEach(s=>{this.results.aspectsToTreat.aspectsByCategory[s].forEach((n,i)=>{this.results.selectedElements.aspects.add(`${s}_${i}`)})})}deselectAllElements(){this.results.selectedElements.competitors.clear(),this.results.selectedElements.semanticElements.clear(),this.results.selectedElements.aspects.clear()}selectAllElements(){this.results.competitorOutlines.forEach((t,s)=>{this.results.selectedElements.competitors.add(s)}),this.selectAllSemanticElements(),this.selectAllAspects()}toggleCompetitorSelection(t){this.results.selectedElements.competitors.has(t)?this.results.selectedElements.competitors.delete(t):this.results.selectedElements.competitors.add(t)}toggleSemanticElementSelection(t){this.results.selectedElements.semanticElements.has(t)?this.results.selectedElements.semanticElements.delete(t):this.results.selectedElements.semanticElements.add(t)}toggleAspectSelection(t){this.results.selectedElements.aspects.has(t)?this.results.selectedElements.aspects.delete(t):this.results.selectedElements.aspects.add(t)}getSelectedData(){const t=this.results.competitorOutlines.filter((n,i)=>this.results.selectedElements.competitors.has(i)),s=this.extractSelectedSemanticData(),o=this.extractSelectedAspects();return{competitors:t,semanticAnalysis:s,aspects:o,counts:{competitors:t.length,semanticElements:this.results.selectedElements.semanticElements.size,aspects:this.results.selectedElements.aspects.size}}}extractSelectedSemanticData(){var n,i;if(!this.results.semanticAnalysis)return null;const t={},s=[];(n=this.results.semanticAnalysis.salientEntities)==null||n.forEach((r,a)=>{this.results.selectedElements.semanticElements.has(`salient_${a}`)&&s.push(r)}),s.length>0&&(t.salientEntities=s);const o=[];return(i=this.results.semanticAnalysis.synonyms)==null||i.forEach((r,a)=>{this.results.selectedElements.semanticElements.has(`synonym_${a}`)&&o.push(r)}),o.length>0&&(t.synonyms=o),t}extractSelectedAspects(){var s;if(!((s=this.results.aspectsToTreat)!=null&&s.aspectsByCategory))return null;const t={};return Object.keys(this.results.aspectsToTreat.aspectsByCategory).forEach(o=>{const n=this.results.aspectsToTreat.aspectsByCategory[o],i=[];n.forEach((r,a)=>{this.results.selectedElements.aspects.has(`${o}_${a}`)&&i.push(r)}),i.length>0&&(t[o]=i)}),t}getStatistics(){return{competitorCount:this.results.competitorOutlines.length,selectedCompetitorCount:this.results.selectedElements.competitors.size,totalSemanticElements:this.calculateTotalSemanticElements(),selectedSemanticElements:this.results.selectedElements.semanticElements.size,totalAspects:this.calculateTotalAspects(),selectedAspects:this.results.selectedElements.aspects.size}}calculateTotalSemanticElements(){var s,o;if(!this.results.semanticAnalysis)return 0;let t=0;return t+=((s=this.results.semanticAnalysis.salientEntities)==null?void 0:s.length)||0,t+=((o=this.results.semanticAnalysis.synonyms)==null?void 0:o.length)||0,Object.values(this.results.semanticAnalysis.categories||{}).forEach(n=>{var i;t+=((i=n.entities)==null?void 0:i.length)||0}),["partWholeRelationships","commonCollocations","relatedStatements","relatedQuestions","commonErrors","currentDebates"].forEach(n=>{var i;t+=((i=this.results.semanticAnalysis[n])==null?void 0:i.length)||0}),t}calculateTotalAspects(){var s;if(!((s=this.results.aspectsToTreat)!=null&&s.aspectsByCategory))return 0;let t=0;return Object.values(this.results.aspectsToTreat.aspectsByCategory).forEach(o=>{t+=o.length}),t}}const d=new q;function L(){const e=document.getElementById("loadingOverlay");e&&e.classList.add("hidden")}function F(e){T(e,"error")}function J(e){T(e,"success")}function T(e,t="info"){const s=document.createElement("div");s.className=`fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-lg z-50 animate-slide-up ${W(t)}`,s.innerHTML=`
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
        </svg>`};return t[e]||t.info}function Y(e,t=300){e.style.opacity="0",e.style.transition=`opacity ${t}ms ease-in-out`,setTimeout(()=>{e.style.opacity="1"},10)}function A(e){K(e.competitorOutlines),X(e.semanticAnalysis),ee(e.aspectsToTreat),y(),V()}function V(){const e=document.getElementById("resultsSection");e&&(e.classList.remove("hidden"),Y(e))}function K(e){const t=document.getElementById("competitorSection"),s=document.getElementById("competitorOutlines");!t||!s||!e||(s.innerHTML="",e.forEach((o,n)=>{const i=document.createElement("div");i.className="competitor-outline-item border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4";const r=document.createElement("div");r.className="flex items-center justify-between mb-3";const a=document.createElement("div");a.className="flex-1";const l=document.createElement("h3");l.className="font-semibold text-gray-900 dark:text-white text-sm",l.textContent=o.title||`Competitor ${n+1}`;const c=document.createElement("a");c.className="text-xs text-blue-600 dark:text-blue-400 hover:underline",c.href=o.url,c.target="_blank",c.textContent=o.url,a.appendChild(l),a.appendChild(c);const u=document.createElement("input");u.type="checkbox",u.id=`competitor-${n}`,u.checked=d.results.selectedElements.competitors.has(n),u.className="ml-4",u.addEventListener("change",()=>{d.toggleCompetitorSelection(n),y()}),r.appendChild(a),r.appendChild(u);const p=document.createElement("div");p.className="outline-content bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm font-mono whitespace-pre-line",p.textContent=o.outline||"Nessuna outline estratta",i.appendChild(r),i.appendChild(p),s.appendChild(i)}))}function X(e){const t=document.getElementById("semanticSection"),s=document.getElementById("semanticAnalysis");!t||!s||!e||(s.innerHTML="",m("Entità Principali",e.salientEntities,"salient",s),m("Sinonimi",e.synonyms,"synonym",s),e.categories&&Object.keys(e.categories).forEach(o=>{const n=e.categories[o];Z(o,n,s)}),m("Relazioni Tutto-Parte",e.partWholeRelationships,"partWholeRelationships",s),m("Collocazioni Comuni",e.commonCollocations,"commonCollocations",s),m("Affermazioni Correlate",e.relatedStatements,"relatedStatements",s),m("Domande Correlate",e.relatedQuestions,"relatedQuestions",s),m("Errori Comuni",e.commonErrors,"commonErrors",s),m("Dibattiti Attuali",e.currentDebates,"currentDebates",s))}function m(e,t,s,o){if(!t||!Array.isArray(t)||t.length===0)return;const n=document.createElement("div");n.className="semantic-section mb-6";const i=document.createElement("h4");i.className="font-semibold text-gray-900 dark:text-white mb-3",i.textContent=e;const r=document.createElement("div");r.className="flex flex-wrap gap-2",t.forEach((a,l)=>{const c=document.createElement("span");c.className="semantic-item px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm cursor-pointer border border-transparent hover:border-blue-300",c.textContent=a,c.dataset.elementId=`${s}_${l}`,d.results.selectedElements.semanticElements.has(`${s}_${l}`)&&(c.classList.add("selected"),c.classList.add("bg-green-100","dark:bg-green-900","text-green-800","dark:text-green-200"),c.classList.remove("bg-blue-100","dark:bg-blue-900","text-blue-800","dark:text-blue-200")),c.addEventListener("click",()=>{d.toggleSemanticElementSelection(`${s}_${l}`),se(c),y()}),r.appendChild(c)}),n.appendChild(i),n.appendChild(r),o.appendChild(n)}function Z(e,t,s){if(!t||!t.entities)return;const o=document.createElement("div");o.className="semantic-category mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg";const n=document.createElement("h4");n.className="font-semibold text-gray-900 dark:text-white mb-3",n.textContent=`Categoria: ${e}`,o.appendChild(n),m("Entità",t.entities,`category_${e}_entity`,o),t.examples&&m("Esempi",t.examples,`category_${e}_example`,o),t.attributes&&m("Attributi",t.attributes,`category_${e}_attribute`,o),s.appendChild(o)}function ee(e){const t=document.getElementById("aspectsSection"),s=document.getElementById("aspectsList");!t||!s||!e||(s.innerHTML="",e.aspectsByCategory&&Object.keys(e.aspectsByCategory).forEach(o=>{const n=e.aspectsByCategory[o],i=document.createElement("div");i.className="aspects-category mb-6";const r=document.createElement("h4");r.className="font-semibold text-gray-900 dark:text-white mb-3",r.textContent=o,i.appendChild(r),n.forEach((a,l)=>{const c=document.createElement("div");c.className="aspect-item flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg mb-2";const u=document.createElement("input");u.type="checkbox",u.id=`aspect-${o}-${l}`,u.checked=d.results.selectedElements.aspects.has(`${o}_${l}`),u.className="mt-1",u.addEventListener("change",()=>{d.toggleAspectSelection(`${o}_${l}`),y()});const p=document.createElement("div");p.className="flex-1";const b=document.createElement("h5");b.className="font-medium text-gray-900 dark:text-white",b.textContent=a.aspect;const v=document.createElement("p");v.className="text-sm text-gray-600 dark:text-gray-400 mt-1",v.textContent=a.description;const f=document.createElement("div");f.className="flex items-center space-x-4 mt-2";const C=document.createElement("span");if(C.className=`px-2 py-1 text-xs rounded-full ${te(a.priority)}`,C.textContent=a.priority,f.appendChild(C),a.foundInCompetitors&&a.foundInCompetitors.length>0){const S=document.createElement("span");S.className="text-xs text-gray-500 dark:text-gray-400",S.textContent=`Trovato in ${a.foundInCompetitors.length} competitor`,f.appendChild(S)}p.appendChild(b),p.appendChild(v),p.appendChild(f),c.appendChild(u),c.appendChild(p),i.appendChild(c)}),s.appendChild(i)}))}function te(e){const t={high:"bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",medium:"bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",low:"bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"};return t[e]||t.medium}function se(e){e.classList.contains("selected")?(e.classList.remove("selected"),e.classList.remove("bg-green-100","dark:bg-green-900","text-green-800","dark:text-green-200"),e.classList.add("bg-blue-100","dark:bg-blue-900","text-blue-800","dark:text-blue-200")):(e.classList.add("selected"),e.classList.add("bg-green-100","dark:bg-green-900","text-green-800","dark:text-green-200"),e.classList.remove("bg-blue-100","dark:bg-blue-900","text-blue-800","dark:text-blue-200"))}function y(){const e=d.getStatistics(),t=document.getElementById("competitorCount");t&&(t.textContent=`${e.selectedCompetitorCount}/${e.competitorCount}`);const s=document.getElementById("semanticCount");s&&(s.textContent=`${e.selectedSemanticElements}/${e.totalSemanticElements}`);const o=document.getElementById("aspectCount");o&&(o.textContent=`${e.selectedAspects}/${e.totalAspects}`);const n=document.getElementById("statsCard");n&&e.competitorCount>0&&n.classList.remove("hidden");const i=document.getElementById("proceedBtn");if(i){const r=e.selectedCompetitorCount>0||e.selectedSemanticElements>0||e.selectedAspects>0;i.disabled=!r}}function ne(){const e=document.getElementById("selectAllBtn"),t=document.getElementById("deselectAllBtn"),s=document.getElementById("proceedBtn");e&&e.addEventListener("click",()=>{d.selectAllElements(),A(d.results)}),t&&t.addEventListener("click",()=>{d.deselectAllElements(),A(d.results)}),s&&s.addEventListener("click",()=>{const o=d.getSelectedData();console.log("Selected data for phase 2:",o),alert("Fase 2 non ancora implementata. I dati selezionati sono stati salvati nella console.")})}function oe(){ie(),ae(),ce(),de(),ne()}function ie(){const e=document.getElementById("toggleOpenrouterApiKey");e&&e.addEventListener("click",()=>{re("openrouterApiKey","openrouterEyeIcon")})}function re(e,t){const s=document.getElementById(e),o=document.getElementById(t);if(!s||!o)return;const n=s.type==="password";s.type=n?"text":"password",o.innerHTML=n?'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />':'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />'}function ae(){["openrouterApiKey","topicInput"].forEach(t=>{const s=document.getElementById(t);s&&s.addEventListener("input",()=>{if(t.includes("ApiKey")){const o=t.replace("ApiKey","");z(o,s.value)}setTimeout(()=>$(),0)})})}function ce(){const e=document.getElementById("generateBtn");e&&e.addEventListener("click",le)}async function le(){try{const e=document.getElementById("openrouterApiKey").value.trim(),t=document.getElementById("topicInput").value.trim();if(!$())return;console.log("Skipping API key validation, proceeding with generation...");const s=await d.generateCompleteOutline(e,t);A(s),L(),J("Generazione completata con successo!")}catch(e){L(),F(`Errore durante la generazione: ${e.message}`),console.error("Generation error:",e)}}function de(){d.setProgressCallback((e,t)=>{ue(e,t)}),d.setStatusCallback(e=>{me(e)})}function ue(e,t){const s=document.getElementById("progressSection"),o=document.getElementById(`step${e}`);if(s&&s.classList.remove("hidden"),o){const n=o.querySelector(".w-4.h-4.rounded-full"),i=o.querySelector("span");n&&(n.className="w-4 h-4 rounded-full bg-blue-500"),i&&(i.textContent=t,i.className="text-sm font-medium text-blue-600 dark:text-blue-400");for(let r=1;r<e;r++){const a=document.getElementById(`step${r}`);if(a){const l=a.querySelector(".w-4.h-4.rounded-full");l&&(l.className="w-4 h-4 rounded-full bg-green-500");const c=a.querySelector("span");c&&(c.className="text-sm text-green-600 dark:text-green-400")}}}}function me(e){const t=document.getElementById("statusMessage");t&&(t.textContent=e)}function $(){const e=document.getElementById("openrouterApiKey").value.trim(),t=document.getElementById("topicInput").value.trim(),s=document.getElementById("generateBtn"),o=document.getElementById("generateHelp");let n=!0,i="";return e?t?t.length<3&&(n=!1,i="L'argomento deve essere di almeno 3 caratteri"):(n=!1,i="Inserisci un argomento/topic da analizzare"):(n=!1,i="Inserisci la tua API key di OpenRouter"),s&&(s.disabled=!n),o&&(i?(o.textContent=i,o.classList.remove("hidden")):o.classList.add("hidden")),n}document.addEventListener("DOMContentLoaded",()=>{O(),N(),oe(),document.body.classList.add("loaded")});
