(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();function X(){const t=localStorage.getItem("openrouter_api_key"),e=localStorage.getItem("gemini_api_key"),n=document.getElementById("openrouterApiKey");t&&n&&(n.value=t);const i=document.getElementById("geminiApiKey");e&&i&&(i.value=e)}function Z(t,e){e.trim()&&localStorage.setItem(`${t}_api_key`,e)}function ee(){X(),console.log("✅ AI Outline Generator inizializzato")}function te(){const t=localStorage.getItem("dark_mode")==="true",e=document.getElementById("darkModeToggle"),n=document.getElementById("darkModeIcon");t&&(document.documentElement.classList.add("dark"),G(n,!0)),e&&e.addEventListener("click",()=>{const i=document.documentElement.classList.toggle("dark");localStorage.setItem("dark_mode",i.toString()),G(n,i)})}function G(t,e){t&&(t.innerHTML=e?'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>':'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>')}const ne="https://openrouter.ai/api/v1",z=3,M=1e3,y={SERP_SEARCH:"perplexity/sonar",OUTLINE_EXTRACTION:"openai/gpt-4o-mini",SEMANTIC_ANALYSIS:"anthropic/claude-3-5-sonnet-20241022",ASPECT_GENERATION:"anthropic/claude-3-5-sonnet-20241022",OUTLINE_GENERATION:"anthropic/claude-3-5-sonnet-20241022",FALLBACK_MODEL:"openai/gpt-3.5-turbo"},ie=["conclusione","conclusioni","chi siamo","chiama ora","contattaci","contatti","richiedi preventivo","preventivo","offerta","promozione","sconto","privacy policy","termini di servizio","cookie policy","disclaimer","footer","sidebar","menu","navigazione","breadcrumb","condividi","social","newsletter","iscriviti","seguici","testimonial","recensioni cliente","clienti","portfolio","servizi correlati","prodotti correlati","articoli correlati","biografia autore","autore","about us","team","staff","faq generiche","domande frequenti generiche","help","supporto","login","registrati","account","profilo utente"];async function E(t,e,n,i=1e3){if(!t||!e||!n)throw new Error("API key, model, and messages are required");const s=`${ne}/chat/completions`,o={model:e,messages:n,max_tokens:i,temperature:.7,top_p:1,frequency_penalty:0,presence_penalty:0};return await w(s,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,"HTTP-Referer":window.location.origin,"X-Title":"AI Outline Generator"},body:JSON.stringify(o)})}async function se(t,e){const n=[{role:"user",content:`Cerca su Google.it i primi 10 risultati per l'argomento "${e}". 
            
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
            }`}];try{const o=(await E(t,y.SERP_SEARCH,n,2e3)).choices[0].message.content.match(/\{[\s\S]*\}/);if(o)return JSON.parse(o[0]).results||[];throw new Error("Invalid response format from Perplexity")}catch(i){return console.warn("Perplexity search failed, using fallback with GPT-4o-mini:",i.message),await oe(t,e)}}async function oe(t,e){const n=[{role:"system",content:"Sei un assistente che genera URL e contenuti realistici per analisi competitor di siti web italiani."},{role:"user",content:`Genera 10 URL realistici di competitor italiani e descrizioni dei contenuti per l'argomento "${e}". Questi dovrebbero essere tipici siti che si posizionerebbero bene su Google.it per questo topic.
            
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
            }`}];try{const o=(await E(t,y.FALLBACK_MODEL,n,1500)).choices[0].message.content.match(/\{[\s\S]*\}/);if(o)return JSON.parse(o[0]).results||[];throw new Error("Invalid response format")}catch(i){return console.error("Error in fallback competitor search:",i),re(e)}}function re(t){return[{url:"https://marketing.esempio1.it/guida",title:`Guida Completa al ${t}`,description:`Guida completa che copre tutti gli aspetti del ${t}`},{url:"https://blog.digitalitalia.com/articolo",title:`${t}: Tutto quello che devi sapere`,description:`Articolo dettagliato che spiega i fondamenti del ${t}`},{url:"https://webmarketing.it/tutorial",title:`Come Padroneggiare il ${t}`,description:`Tutorial passo-passo per il ${t}`},{url:"https://consulenza.esempio4.it/consigli",title:`I 10 Migliori Consigli per il ${t}`,description:`Consigli esperti e best practice per il ${t}`},{url:"https://strategiadigitale.com/avanzate",title:`Strategie Avanzate di ${t}`,description:`Tecniche e strategie avanzate per il ${t}`},{url:"https://formazione.online.it/corso",title:`Corso Professionale di ${t}`,description:`Corso completo per professionisti del ${t}`},{url:"https://business.italia.net/case-study",title:`Case Study di Successo nel ${t}`,description:`Esempi reali di successo nel ${t}`}]}async function ae(t,e,n,i){const s=[{role:"system",content:"Sei un esperto nell'estrazione di outline da contenuti web. Il tuo compito è identificare la struttura gerarchica dei contenuti (H1, H2, H3) da una pagina web."},{role:"user",content:`Estrai l'outline strutturale dalla seguente pagina web:

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

Se non riesci ad accedere al contenuto, prova a immaginare una struttura logica basata su titolo e descrizione.`}];try{const r=(await E(t,y.OUTLINE_EXTRACTION,s,1500)).choices[0].message.content.trim(),a=ce(r);return{url:e,title:n,outline:a}}catch(o){throw console.error("Error extracting outline:",o),o}}function ce(t){return t.split(`
`).filter(i=>{const s=i.toLowerCase();return!ie.some(o=>s.includes(o.toLowerCase()))}).join(`
`)}async function le(t,e){const n=[{role:"system",content:"Sei un esperto linguista e semantologo. Il tuo compito è creare un'analisi semantica completa e dettagliata di un argomento specifico."},{role:"user",content:`Think this step by step.
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
}`}];try{const o=(await E(t,y.SEMANTIC_ANALYSIS,n,4e3)).choices[0].message.content.match(/\{[\s\S]*\}/);if(o)return JSON.parse(o[0]);throw new Error("Invalid response format")}catch(i){throw console.error("Error generating semantic analysis:",i),i}}async function de(t,e,n){const i=[{role:"system",content:"Sei un esperto content strategist. Il tuo compito è analizzare le outline dei competitor e identificare tutti gli aspetti che dovrebbero essere trattati per creare un contenuto completo e competitivo su un argomento."},{role:"user",content:`Analizza queste outline dei competitor per l'argomento "${e}" e identifica tutti gli aspetti che dovrebbero essere trattati:

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
}`}];try{const r=(await E(t,y.ASPECT_GENERATION,i,3e3)).choices[0].message.content.match(/\{[\s\S]*\}/);if(r)return JSON.parse(r[0]);throw new Error("Invalid response format")}catch(s){throw console.error("Error generating aspects to treat:",s),s}}async function w(t,e,n=0){var i;try{const s=await fetch(t,e);if(!s.ok){const r=await s.json().catch(()=>({}));if(s.status===429&&n<z){const l=M*Math.pow(2,n);return console.warn(`Rate limited. Retrying in ${l}ms...`),await N(l),w(t,e,n+1)}if(s.status>=500&&n<z){const l=M*Math.pow(2,n);return console.warn(`Server error ${s.status}. Retrying in ${l}ms...`),await N(l),w(t,e,n+1)}const a=((i=r.error)==null?void 0:i.message)||r.message||"Unknown error",c=s.status===400?`Bad Request - Check API key and model availability. ${a}`:`HTTP ${s.status} - ${a}`;throw new Error(`OpenRouter API Error ${s.status}: ${c}`)}const o=await s.json();if(!o.choices||!o.choices[0]||!o.choices[0].message)throw new Error("Invalid response format from OpenRouter API");return o}catch(s){if(s.name==="TypeError"&&s.message.includes("fetch"))throw new Error("Errore di connessione. Verifica la tua connessione internet.");if(n<z&&(s.message.includes("network")||s.message.includes("timeout")||s.message.includes("fetch"))){const o=M*Math.pow(2,n);return console.warn(`Network error. Retrying in ${o}ms...`),await N(o),w(t,e,n+1)}throw s}}function N(t){return new Promise(e=>setTimeout(e,t))}async function ue(t,e,n,i=!0){const s=[{role:"system",content:"Sei un esperto content strategist e SEO specialist. Il tuo compito è creare un'outline completa e semanticamente ottimizzata per un contenuto che deve coprire al 100% tutti gli aspetti di un argomento."},{role:"user",content:`Crea un'outline completa per l'argomento "${e}" utilizzando i seguenti dati:

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

IMPORTANTE: Rispondi SOLO con l'outline in formato markdown pulito, senza commenti, note o spiegazioni aggiuntive. Solo i titoli H1, H2, H3 con i relativi contenuti.`}];try{return(await E(t,y.SEMANTIC_ANALYSIS,s,3e3)).choices[0].message.content.trim().split(`
`).filter(l=>{const d=l.trim();return d.startsWith("#")||d===""}).join(`
`).trim()}catch(o){throw console.error("Error generating final outline:",o),o}}class me{constructor(){this.results={competitorUrls:[],competitorOutlines:[],semanticAnalysis:null,aspectsToTreat:null,selectedElements:{competitors:new Set,semanticElements:new Set,aspects:new Set}},this.progressCallback=null,this.statusCallback=null}setProgressCallback(e){this.progressCallback=e}setStatusCallback(e){this.statusCallback=e}updateProgress(e,n){this.progressCallback&&this.progressCallback(e,n)}updateStatus(e){this.statusCallback&&this.statusCallback(e)}async generateCompleteOutline(e,n){try{this.updateStatus("Iniziando la generazione..."),this.updateProgress(1,"Ricerca competitor nella SERP"),this.updateStatus("Cercando competitor nella SERP..."),this.results.competitorUrls=await se(e,n),this.updateProgress(2,"Estrazione outline competitor"),this.updateStatus("Estraendo outline dai competitor..."),this.results.competitorOutlines=[];for(let i=0;i<Math.min(this.results.competitorUrls.length,10);i++){const s=this.results.competitorUrls[i];try{const o=await ae(e,s.url,s.title,s.description);this.results.competitorOutlines.push(o),this.results.selectedElements.competitors.add(i)}catch(o){console.warn(`Failed to extract outline from ${s.url}:`,o)}}return this.updateProgress(3,"Analisi semantica completa"),this.updateStatus("Generando analisi semantica completa..."),this.results.semanticAnalysis=await le(e,n),this.selectAllSemanticElements(),this.updateProgress(4,"Generazione aspetti da trattare"),this.updateStatus("Identificando aspetti da trattare..."),this.results.aspectsToTreat=await de(e,n,this.results.competitorOutlines),this.selectAllAspects(),this.updateProgress(5,"Compilazione risultati completata"),this.updateStatus("Generazione completata con successo!"),this.results}catch(i){throw this.updateStatus(`Errore durante la generazione: ${i.message}`),i}}selectAllSemanticElements(){var e,n;this.results.selectedElements.semanticElements.clear(),this.results.semanticAnalysis&&((e=this.results.semanticAnalysis.salientEntities)==null||e.forEach((i,s)=>{this.results.selectedElements.semanticElements.add(`salient_${s}`)}),(n=this.results.semanticAnalysis.synonyms)==null||n.forEach((i,s)=>{this.results.selectedElements.semanticElements.add(`synonym_${s}`)}),Object.keys(this.results.semanticAnalysis.categories||{}).forEach(i=>{var o;this.results.selectedElements.semanticElements.add(`category_${i}`),(o=this.results.semanticAnalysis.categories[i].entities)==null||o.forEach((r,a)=>{this.results.selectedElements.semanticElements.add(`category_${i}_entity_${a}`)})}),["partWholeRelationships","commonCollocations","relatedStatements","relatedQuestions","commonErrors","currentDebates"].forEach(i=>{var s;(s=this.results.semanticAnalysis[i])==null||s.forEach((o,r)=>{this.results.selectedElements.semanticElements.add(`${i}_${r}`)})}))}selectAllAspects(){var e;this.results.selectedElements.aspects.clear(),(e=this.results.aspectsToTreat)!=null&&e.aspectsByCategory&&Object.keys(this.results.aspectsToTreat.aspectsByCategory).forEach(n=>{this.results.aspectsToTreat.aspectsByCategory[n].forEach((s,o)=>{this.results.selectedElements.aspects.add(`${n}_${o}`)})})}deselectAllElements(){this.results.selectedElements.competitors.clear(),this.results.selectedElements.semanticElements.clear(),this.results.selectedElements.aspects.clear()}selectAllElements(){this.results.competitorOutlines.forEach((e,n)=>{this.results.selectedElements.competitors.add(n)}),this.selectAllSemanticElements(),this.selectAllAspects()}toggleCompetitorSelection(e){this.results.selectedElements.competitors.has(e)?this.results.selectedElements.competitors.delete(e):this.results.selectedElements.competitors.add(e)}toggleSemanticElementSelection(e){this.results.selectedElements.semanticElements.has(e)?this.results.selectedElements.semanticElements.delete(e):this.results.selectedElements.semanticElements.add(e)}toggleAspectSelection(e){this.results.selectedElements.aspects.has(e)?this.results.selectedElements.aspects.delete(e):this.results.selectedElements.aspects.add(e)}getSelectedData(){const e=this.results.competitorOutlines.filter((s,o)=>this.results.selectedElements.competitors.has(o)),n=this.extractSelectedSemanticData(),i=this.extractSelectedAspects();return{competitors:e,semanticAnalysis:n,aspects:i,counts:{competitors:e.length,semanticElements:this.results.selectedElements.semanticElements.size,aspects:this.results.selectedElements.aspects.size}}}extractSelectedSemanticData(){var s,o;if(!this.results.semanticAnalysis)return null;const e={},n=[];(s=this.results.semanticAnalysis.salientEntities)==null||s.forEach((r,a)=>{this.results.selectedElements.semanticElements.has(`salient_${a}`)&&n.push(r)}),n.length>0&&(e.salientEntities=n);const i=[];return(o=this.results.semanticAnalysis.synonyms)==null||o.forEach((r,a)=>{this.results.selectedElements.semanticElements.has(`synonym_${a}`)&&i.push(r)}),i.length>0&&(e.synonyms=i),e}extractSelectedAspects(){var n;if(!((n=this.results.aspectsToTreat)!=null&&n.aspectsByCategory))return null;const e={};return Object.keys(this.results.aspectsToTreat.aspectsByCategory).forEach(i=>{const s=this.results.aspectsToTreat.aspectsByCategory[i],o=[];s.forEach((r,a)=>{this.results.selectedElements.aspects.has(`${i}_${a}`)&&o.push(r)}),o.length>0&&(e[i]=o)}),e}getStatistics(){return{competitorCount:this.results.competitorOutlines.length,selectedCompetitorCount:this.results.selectedElements.competitors.size,totalSemanticElements:this.calculateTotalSemanticElements(),selectedSemanticElements:this.results.selectedElements.semanticElements.size,totalAspects:this.calculateTotalAspects(),selectedAspects:this.results.selectedElements.aspects.size}}calculateTotalSemanticElements(){var n,i;if(!this.results.semanticAnalysis)return 0;let e=0;return e+=((n=this.results.semanticAnalysis.salientEntities)==null?void 0:n.length)||0,e+=((i=this.results.semanticAnalysis.synonyms)==null?void 0:i.length)||0,Object.values(this.results.semanticAnalysis.categories||{}).forEach(s=>{var o;e+=((o=s.entities)==null?void 0:o.length)||0}),["partWholeRelationships","commonCollocations","relatedStatements","relatedQuestions","commonErrors","currentDebates"].forEach(s=>{var o;e+=((o=this.results.semanticAnalysis[s])==null?void 0:o.length)||0}),e}calculateTotalAspects(){var n;if(!((n=this.results.aspectsToTreat)!=null&&n.aspectsByCategory))return 0;let e=0;return Object.values(this.results.aspectsToTreat.aspectsByCategory).forEach(i=>{e+=i.length}),e}async generateFinalOutline(e,n,i=!0){try{this.updateStatus("Generando outline finale...");const s=this.getSelectedData(),o=await ue(e,n,s,i);return this.updateStatus("Outline finale generata con successo!"),{outline:o,analytics:this.analyzeOutline(o)}}catch(s){throw this.updateStatus(`Errore durante la generazione: ${s.message}`),s}}analyzeOutline(e){const n=e.split(`
`).filter(a=>a.trim());let i=0,s=0,o=0,r=0;return n.forEach(a=>{const c=a.trim();c.startsWith("# ")?i++:c.startsWith("## ")?s++:c.startsWith("### ")?o++:c.startsWith("H1:")?i++:c.startsWith("H2:")?s++:c.startsWith("H3:")&&o++,c.includes("?")&&r++}),{h1Count:i,h2Count:s,h3Count:o,questionsCount:r,totalSections:i+s+o}}convertToMarkdown(e){return e.includes("# ")||e.includes("## ")||e.includes("### ")?e:e.split(`
`).map(n=>{const i=n.trim();return i.startsWith("H1:")?`# ${i.substring(3).trim()}`:i.startsWith("H2:")?`## ${i.substring(3).trim()}`:i.startsWith("H3:")?`### ${i.substring(3).trim()}`:n}).join(`
`)}}const u=new me;function k(t="Caricamento in corso..."){const e=document.getElementById("loadingOverlay"),n=document.getElementById("loadingMessage");e&&n&&(n.textContent=t,e.classList.remove("hidden"))}function h(){const t=document.getElementById("loadingOverlay");t&&t.classList.add("hidden")}function m(t){J(t,"error")}function v(t){J(t,"success")}function J(t,e="info"){const n=document.createElement("div");n.className=`fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-lg z-50 animate-slide-up ${pe(e)}`,n.innerHTML=`
        <div class="flex items-center">
            <div class="flex-shrink-0">
                ${ge(e)}
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
    `,document.body.appendChild(n),setTimeout(()=>{n.parentElement&&n.remove()},5e3)}function pe(t){const e={success:"bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",error:"bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800",warning:"bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800",info:"bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800"};return e[t]||e.info}function ge(t){const e={success:`<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>`,error:`<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>`,warning:`<svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>`,info:`<svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>`};return e[t]||e.info}function S(t,e=300){t.style.opacity="0",t.style.transition=`opacity ${e}ms ease-in-out`,setTimeout(()=>{t.style.opacity="1"},10)}const he="https://generativelanguage.googleapis.com/v1beta",j="embedding-001",R=3,P=1e3;async function U(t,e,n="SEMANTIC_SIMILARITY"){if(!t||!e||!Array.isArray(e)||e.length===0)throw new Error("API key and non-empty texts array are required");const i=`${he}/models/${j}:embedContent?key=${t}`,s=[];for(const o of e){if(!o||typeof o!="string"||o.trim().length===0)throw new Error("All texts must be non-empty strings");const r={model:`models/${j}`,content:{parts:[{text:o.trim()}]},taskType:n};try{const a=await I(i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(a.embedding&&a.embedding.values)s.push(a.embedding.values);else throw new Error("Invalid response format from Gemini API")}catch(a){throw console.error(`Error generating embedding for text: "${o.substring(0,50)}..."`,a),a}await A(100)}return s}async function I(t,e,n=0){var i;try{const s=await fetch(t,e);if(!s.ok){const r=await s.json().catch(()=>({}));if(s.status===429&&n<R){const l=P*Math.pow(2,n);return console.warn(`Rate limited. Retrying in ${l}ms...`),await A(l),I(t,e,n+1)}if(s.status>=500&&n<R){const l=P*Math.pow(2,n);return console.warn(`Server error ${s.status}. Retrying in ${l}ms...`),await A(l),I(t,e,n+1)}const a=((i=r.error)==null?void 0:i.message)||r.message||"Unknown error",c=s.status===400?`Bad Request - Check API key and request format. ${a}`:s.status===403?`Forbidden - Check API key permissions. ${a}`:`HTTP ${s.status} - ${a}`;throw new Error(`Gemini API Error ${s.status}: ${c}`)}return await s.json()}catch(s){if(s.name==="TypeError"&&s.message.includes("fetch"))throw new Error("Errore di connessione. Verifica la tua connessione internet.");if(n<R&&(s.message.includes("network")||s.message.includes("timeout")||s.message.includes("fetch"))){const o=P*Math.pow(2,n);return console.warn(`Network error. Retrying in ${o}ms...`),await A(o),I(t,e,n+1)}throw s}}function A(t){return new Promise(e=>setTimeout(e,t))}function W(t,e){if(!t||!e||t.length!==e.length)throw new Error("Invalid vectors for cosine similarity calculation");let n=0,i=0,s=0;for(let r=0;r<t.length;r++)n+=t[r]*e[r],i+=t[r]*t[r],s+=e[r]*e[r];const o=Math.sqrt(i)*Math.sqrt(s);return o===0?0:n/o}function C(t){return t>=.8?"excellent":t>=.6?"good":t>=.4?"fair":"poor"}function D(t){const e={excellent:"text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900",good:"text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900",fair:"text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900",poor:"text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900"};return e[t]||e.poor}function b(t){return`${Math.round(t*100)}%`}function K(t){return!t||t.length===0?0:t.reduce((e,n)=>e+n,0)/t.length}class fe{constructor(){this.geminiApiKey=null,this.openrouterApiKey=null,this.currentTopic=null,this.topicEmbedding=null,this.headings=[],this.semanticTerms=[]}setApiKeys(e,n){this.geminiApiKey=e,this.openrouterApiKey=n}setSemanticTerms(e){this.semanticTerms=this.extractSemanticTermsFromData(e)}extractSemanticTermsFromData(e){const n=[];return e.salientEntities&&n.push(...e.salientEntities),e.synonyms&&n.push(...e.synonyms),e.categories&&Object.values(e.categories).forEach(i=>{i.entities&&n.push(...i.entities),i.examples&&n.push(...i.examples),i.attributes&&n.push(...i.attributes)}),["partWholeRelationships","commonCollocations","relatedStatements","relatedQuestions","commonErrors","currentDebates"].forEach(i=>{e[i]&&n.push(...e[i])}),[...new Set(n)].filter(i=>i&&typeof i=="string"&&i.trim().length>0).map(i=>i.trim())}parseOutline(e){const n=e.split(`
`).filter(s=>s.trim()),i=[];return n.forEach((s,o)=>{const r=s.trim();let a=null,c="";r.startsWith("### ")?(a="H3",c=r.substring(4).trim()):r.startsWith("## ")?(a="H2",c=r.substring(3).trim()):r.startsWith("# ")?(a="H1",c=r.substring(2).trim()):r.startsWith("H1:")?(a="H1",c=r.substring(3).trim()):r.startsWith("H2:")?(a="H2",c=r.substring(3).trim()):r.startsWith("H3:")&&(a="H3",c=r.substring(3).trim()),a&&c&&i.push({id:`heading_${o}`,level:a,text:c,original:s,score:null,scoreLevel:null,embedding:null})}),i}async analyzeOutlineSemanticCoherence(e,n){if(!this.geminiApiKey)throw new Error("Gemini API key is required for semantic analysis");if(this.currentTopic=e,this.headings=this.parseOutline(n),this.headings.length===0)throw new Error("No valid headings found in outline");const i=[e,...this.headings.map(s=>s.text)];try{const s=await U(this.geminiApiKey,i);this.topicEmbedding=s[0];const o=s.slice(1);this.headings.forEach((d,p)=>{d.embedding=o[p],d.score=W(this.topicEmbedding,d.embedding),d.scoreLevel=C(d.score)});const r=this.headings.map(d=>d.score),a=K(r),c=C(a),l={totalHeadings:this.headings.length,overallScore:a,overallLevel:c,scoreDistribution:this.calculateScoreDistribution()};return{headings:this.headings,statistics:l,topic:e}}catch(s){throw console.error("Error in semantic analysis:",s),s}}calculateScoreDistribution(){const e={excellent:0,good:0,fair:0,poor:0};return this.headings.forEach(n=>{e[n.scoreLevel]++}),e}async recalculateHeadingScore(e,n){if(!this.topicEmbedding||!this.geminiApiKey)throw new Error("Topic embedding not available. Run full analysis first.");try{const s=(await U(this.geminiApiKey,[n]))[0],o=W(this.topicEmbedding,s),r=C(o),a=this.headings.findIndex(c=>c.id===e);if(a>=0){const c=this.headings[a].score;return this.headings[a].text=n,this.headings[a].score=o,this.headings[a].scoreLevel=r,this.headings[a].embedding=s,{score:o,scoreLevel:r,oldScore:c,improvement:o-c}}return{score:o,scoreLevel:r,oldScore:null,improvement:null}}catch(i){throw console.error("Error recalculating heading score:",i),i}}async generateAISuggestion(e){if(!this.openrouterApiKey||!this.currentTopic)throw new Error("OpenRouter API key and topic are required for AI suggestions");const n=this.headings.find(o=>o.id===e);if(!n)throw new Error("Heading not found");const i=this.getCurrentOutlineText(),s=[{role:"system",content:"Sei un esperto SEO e content strategist specializzato nella creazione di titoli semanticamente ottimizzati. Il tuo compito è migliorare la coerenza semantica dei subheading rispetto all'argomento principale."},{role:"user",content:`Migliora questo subheading per massimizzare la coerenza semantica con l'argomento principale "${this.currentTopic}":

SUBHEADING DA MIGLIORARE:
Livello: ${n.level}
Titolo attuale: "${n.text}"
Punteggio attuale: ${Math.round(n.score*100)}%

CONTESTO OUTLINE COMPLETA:
${i}

TERMINI SEMANTICI DISPONIBILI:
${this.semanticTerms.slice(0,20).join(", ")}

REQUISITI:
1. Mantieni il significato originale del subheading
2. Integra termini semanticamente rilevanti quando possibile
3. Usa linguaggio naturale e coinvolgente
4. Assicurati che il nuovo titolo sia più coerente con "${this.currentTopic}"
5. Mantieni il livello di profondità appropriato (${n.level})

Rispondi SOLO con il nuovo subheading migliorato, senza spiegazioni aggiuntive.`}];try{return(await E(this.openrouterApiKey,y.SEMANTIC_ANALYSIS,s,100)).choices[0].message.content.trim()}catch(o){throw console.error("Error generating AI suggestion:",o),o}}getCurrentOutlineText(){return this.headings.map(e=>(e.level==="H1"?"# ":e.level==="H2"?"## ":"### ")+e.text).join(`
`)}getUpdatedStatistics(){const e=this.headings.map(s=>s.score).filter(s=>s!==null),n=K(e),i=C(n);return{totalHeadings:this.headings.length,overallScore:n,overallLevel:i,scoreDistribution:this.calculateScoreDistribution()}}}const f=new fe;function ye(t,e){const n=document.getElementById("phase3Section");n&&(n.classList.remove("hidden"),S(n),n.scrollIntoView({behavior:"smooth"}),n.dataset.outlineText=t,n.dataset.topic=e,Ee())}function Ee(){const t=document.getElementById("startSemanticAnalysisBtn"),e=document.getElementById("copyFinalOutlineBtn");t&&t.addEventListener("click",be),e&&e.addEventListener("click",Oe)}async function be(){var t;try{const e=document.getElementById("geminiApiKey").value.trim(),n=document.getElementById("openrouterApiKey").value.trim(),i=document.getElementById("phase3Section"),s=i.dataset.outlineText,o=i.dataset.topic;if(!e){m("API key di Google Gemini richiesta per l'analisi semantica.");return}if(!n){m("API key di OpenRouter richiesta per i suggerimenti AI.");return}if(!s||!o){m("Nessuna outline trovata. Completa prima la Fase 2.");return}k("Analizzando coerenza semantica..."),f.setApiKeys(e,n);const r=(t=window.outlineGenerator)==null?void 0:t.getSelectedData();r!=null&&r.semanticAnalysis&&f.setSemanticTerms(r.semanticAnalysis);const a=await f.analyzeOutlineSemanticCoherence(o,s);ve(a),h(),v("Analisi semantica completata con successo!")}catch(e){h(),m(`Errore durante l'analisi semantica: ${e.message}`),console.error("Semantic analysis error:",e)}}function ve(t){const e=document.getElementById("semanticAnalysisResults");e&&(e.classList.remove("hidden"),S(e),Q(t.statistics),V(t.statistics.scoreDistribution),Se(t.headings))}function Q(t){const e=document.getElementById("overallScore");if(e){const n=D(t.overallLevel);e.className=`px-3 py-1 rounded-full text-sm font-medium ${n}`,e.textContent=`Punteggio Complessivo: ${b(t.overallScore)}`}}function V(t){const e={excellentCount:document.getElementById("excellentCount"),goodCount:document.getElementById("goodCount"),fairCount:document.getElementById("fairCount"),poorCount:document.getElementById("poorCount")};e.excellentCount&&(e.excellentCount.textContent=t.excellent),e.goodCount&&(e.goodCount.textContent=t.good),e.fairCount&&(e.fairCount.textContent=t.fair),e.poorCount&&(e.poorCount.textContent=t.poor)}function Se(t){const e=document.getElementById("interactiveOutlineEditor");e&&(e.innerHTML="",t.forEach((n,i)=>{const s=xe(n);e.appendChild(s)}))}function xe(t,e){const n=document.createElement("div");n.className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600",n.dataset.headingId=t.id;const i=D(t.scoreLevel);return n.innerHTML=`
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">${t.level}</span>
                <span class="px-2 py-1 text-xs rounded-full ${i}">
                    ${b(t.score)}
                </span>
            </div>
            <div class="flex items-center space-x-2">
                <button class="ai-suggest-btn bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded transition-colors" data-heading-id="${t.id}">
                    🤖 Suggerimento AI
                </button>
                <button class="edit-btn bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded transition-colors" data-heading-id="${t.id}">
                    ✏️ Modifica
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
    `,Ce(n,t),n}function Ce(t,e){const n=t.querySelector(".ai-suggest-btn"),i=t.querySelector(".edit-btn"),s=t.querySelector(".cancel-edit-btn"),o=t.querySelector(".confirm-edit-btn"),r=t.querySelector("input");n&&n.addEventListener("click",()=>ke(e.id)),i&&i.addEventListener("click",()=>we(t)),s&&s.addEventListener("click",()=>H(t)),o&&o.addEventListener("click",()=>_(t,e.id)),r&&r.addEventListener("keydown",a=>{a.key==="Enter"?_(t,e.id):a.key==="Escape"&&H(t)})}function we(t){const e=t.querySelector(".heading-display"),n=t.querySelector(".heading-edit");if(e&&n){e.classList.add("hidden"),n.classList.remove("hidden");const i=n.querySelector("input");i&&(i.focus(),i.select())}}function H(t){const e=t.querySelector(".heading-display"),n=t.querySelector(".heading-edit");e&&n&&(e.classList.remove("hidden"),n.classList.add("hidden"))}async function _(t,e){const n=t.querySelector("input");if(!n)return;const i=n.value.trim();if(!i){m("Il testo del subheading non può essere vuoto.");return}try{k("Ricalcolando punteggio...");const s=await f.recalculateHeadingScore(e,i);Ie(t,i,s),H(t),$e(),h(),Ae(t,s)}catch(s){h(),m(`Errore durante il ricalcolo: ${s.message}`),console.error("Recalculation error:",s)}}function Ie(t,e,n){const i=t.querySelector(".heading-display"),s=t.querySelector(".px-2.py-1");if(i&&(i.textContent=e),s){const o=D(n.scoreLevel);s.className=`px-2 py-1 text-xs rounded-full ${o}`,s.textContent=b(n.score)}}function Ae(t,e){const n=t.querySelector(".score-change-indicator");if(!n||e.improvement===null)return;const i=e.improvement,s=i>0,o=s?`+${b(Math.abs(i))}`:`-${b(Math.abs(i))}`,r=s?"text-green-600 dark:text-green-400":"text-red-600 dark:text-red-400";n.innerHTML=`
        <div class="text-xs ${r}">
            ${s?"📈":"📉"} ${o}
        </div>
    `,n.classList.remove("hidden"),setTimeout(()=>{n.classList.add("hidden")},3e3)}async function ke(t){try{k("Generando suggerimento AI...");const e=await f.generateAISuggestion(t);h(),Te(t,e)}catch(e){h(),m(`Errore durante la generazione del suggerimento: ${e.message}`),console.error("AI suggestion error:",e)}}function Te(t,e){const n=document.createElement("div");n.className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",n.innerHTML=`
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 w-full">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🤖 Suggerimento AI
            </h3>
            <div class="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-4">
                <p class="text-blue-800 dark:text-blue-200">${e}</p>
            </div>
            <div class="flex justify-end space-x-3">
                <button class="cancel-suggestion bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
                    Annulla
                </button>
                <button class="apply-suggestion bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
                    Applica Suggerimento
                </button>
            </div>
        </div>
    `;const i=n.querySelector(".cancel-suggestion"),s=n.querySelector(".apply-suggestion");i&&i.addEventListener("click",()=>{document.body.removeChild(n)}),s&&s.addEventListener("click",async()=>{document.body.removeChild(n),await Le(t,e)}),n.addEventListener("click",o=>{o.target===n&&document.body.removeChild(n)}),document.body.appendChild(n)}async function Le(t,e){const n=document.querySelector(`[data-heading-id="${t}"]`);if(!n)return;const i=n.querySelector("input");i&&(i.value=e,await _(n,t))}function $e(){const t=f.getUpdatedStatistics();Q(t),V(t.scoreDistribution)}function Oe(){try{const t=f.getCurrentOutlineText();navigator.clipboard.writeText(t).then(()=>{v("Outline finale copiata in formato Markdown!");const e=document.getElementById("copyFinalOutlineBtn");if(e){const n=e.innerHTML;e.innerHTML="✅ Copiato!",e.classList.add("bg-green-700"),e.classList.remove("bg-green-600"),setTimeout(()=>{e.innerHTML=n,e.classList.remove("bg-green-700"),e.classList.add("bg-green-600")},2e3)}}).catch(e=>{console.error("Error copying to clipboard:",e),m("Errore durante la copia negli appunti.")})}catch(t){m("Nessuna outline modificata da copiare."),console.error("Copy error:",t)}}function q(t){ze(t.competitorOutlines),Me(t.semanticAnalysis),Re(t.aspectsToTreat),T(),Be()}function Be(){const t=document.getElementById("resultsSection");t&&(t.classList.remove("hidden"),S(t))}function ze(t){const e=document.getElementById("competitorSection"),n=document.getElementById("competitorOutlines");!e||!n||!t||(n.innerHTML="",t.forEach((i,s)=>{const o=document.createElement("div");o.className="competitor-outline-item border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4";const r=document.createElement("div");r.className="flex items-center justify-between mb-3";const a=document.createElement("div");a.className="flex-1";const c=document.createElement("h3");c.className="font-semibold text-gray-900 dark:text-white text-sm",c.textContent=i.title||`Competitor ${s+1}`;const l=document.createElement("a");l.className="text-xs text-blue-600 dark:text-blue-400 hover:underline",l.href=i.url,l.target="_blank",l.textContent=i.url,a.appendChild(c),a.appendChild(l);const d=document.createElement("input");d.type="checkbox",d.id=`competitor-${s}`,d.checked=u.results.selectedElements.competitors.has(s),d.className="ml-4",d.addEventListener("change",()=>{u.toggleCompetitorSelection(s),T()}),r.appendChild(a),r.appendChild(d);const p=document.createElement("div");p.className="outline-content bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm font-mono whitespace-pre-line",p.textContent=i.outline||"Nessuna outline estratta",o.appendChild(r),o.appendChild(p),n.appendChild(o)}))}function Me(t){const e=document.getElementById("semanticSection"),n=document.getElementById("semanticAnalysis");!e||!n||!t||(n.innerHTML="",g("Entità Principali",t.salientEntities,"salient",n),g("Sinonimi",t.synonyms,"synonym",n),t.categories&&Object.keys(t.categories).forEach(i=>{const s=t.categories[i];Ne(i,s,n)}),g("Relazioni Tutto-Parte",t.partWholeRelationships,"partWholeRelationships",n),g("Collocazioni Comuni",t.commonCollocations,"commonCollocations",n),g("Affermazioni Correlate",t.relatedStatements,"relatedStatements",n),g("Domande Correlate",t.relatedQuestions,"relatedQuestions",n),g("Errori Comuni",t.commonErrors,"commonErrors",n),g("Dibattiti Attuali",t.currentDebates,"currentDebates",n))}function g(t,e,n,i){if(!e||!Array.isArray(e)||e.length===0)return;const s=document.createElement("div");s.className="semantic-section mb-6";const o=document.createElement("h4");o.className="font-semibold text-gray-900 dark:text-white mb-3",o.textContent=t;const r=document.createElement("div");r.className="flex flex-wrap gap-2",e.forEach((a,c)=>{const l=document.createElement("span");l.className="semantic-item px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm cursor-pointer border border-transparent hover:border-blue-300",l.textContent=a,l.dataset.elementId=`${n}_${c}`,u.results.selectedElements.semanticElements.has(`${n}_${c}`)&&(l.classList.add("selected"),l.classList.add("bg-green-100","dark:bg-green-900","text-green-800","dark:text-green-200"),l.classList.remove("bg-blue-100","dark:bg-blue-900","text-blue-800","dark:text-blue-200")),l.addEventListener("click",()=>{u.toggleSemanticElementSelection(`${n}_${c}`),He(l),T()}),r.appendChild(l)}),s.appendChild(o),s.appendChild(r),i.appendChild(s)}function Ne(t,e,n){if(!e||!e.entities)return;const i=document.createElement("div");i.className="semantic-category mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg";const s=document.createElement("h4");s.className="font-semibold text-gray-900 dark:text-white mb-3",s.textContent=`Categoria: ${t}`,i.appendChild(s),g("Entità",e.entities,`category_${t}_entity`,i),e.examples&&g("Esempi",e.examples,`category_${t}_example`,i),e.attributes&&g("Attributi",e.attributes,`category_${t}_attribute`,i),n.appendChild(i)}function Re(t){const e=document.getElementById("aspectsSection"),n=document.getElementById("aspectsList");!e||!n||!t||(n.innerHTML="",t.aspectsByCategory&&Object.keys(t.aspectsByCategory).forEach(i=>{const s=t.aspectsByCategory[i],o=document.createElement("div");o.className="aspects-category mb-6";const r=document.createElement("h4");r.className="font-semibold text-gray-900 dark:text-white mb-3",r.textContent=i,o.appendChild(r),s.forEach((a,c)=>{const l=document.createElement("div");l.className="aspect-item flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg mb-2";const d=document.createElement("input");d.type="checkbox",d.id=`aspect-${i}-${c}`,d.checked=u.results.selectedElements.aspects.has(`${i}_${c}`),d.className="mt-1",d.addEventListener("change",()=>{u.toggleAspectSelection(`${i}_${c}`),T()});const p=document.createElement("div");p.className="flex-1";const L=document.createElement("h5");L.className="font-medium text-gray-900 dark:text-white",L.textContent=a.aspect;const $=document.createElement("p");$.className="text-sm text-gray-600 dark:text-gray-400 mt-1",$.textContent=a.description;const x=document.createElement("div");x.className="flex items-center space-x-4 mt-2";const O=document.createElement("span");if(O.className=`px-2 py-1 text-xs rounded-full ${Pe(a.priority)}`,O.textContent=a.priority,x.appendChild(O),a.foundInCompetitors&&a.foundInCompetitors.length>0){const B=document.createElement("span");B.className="text-xs text-gray-500 dark:text-gray-400",B.textContent=`Trovato in ${a.foundInCompetitors.length} competitor`,x.appendChild(B)}p.appendChild(L),p.appendChild($),p.appendChild(x),l.appendChild(d),l.appendChild(p),o.appendChild(l)}),n.appendChild(o)}))}function Pe(t){const e={high:"bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",medium:"bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",low:"bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"};return e[t]||e.medium}function He(t){t.classList.contains("selected")?(t.classList.remove("selected"),t.classList.remove("bg-green-100","dark:bg-green-900","text-green-800","dark:text-green-200"),t.classList.add("bg-blue-100","dark:bg-blue-900","text-blue-800","dark:text-blue-200")):(t.classList.add("selected"),t.classList.add("bg-green-100","dark:bg-green-900","text-green-800","dark:text-green-200"),t.classList.remove("bg-blue-100","dark:bg-blue-900","text-blue-800","dark:text-blue-200"))}function T(){const t=u.getStatistics(),e=document.getElementById("competitorCount");e&&(e.textContent=`${t.selectedCompetitorCount}/${t.competitorCount}`);const n=document.getElementById("semanticCount");n&&(n.textContent=`${t.selectedSemanticElements}/${t.totalSemanticElements}`);const i=document.getElementById("aspectCount");i&&(i.textContent=`${t.selectedAspects}/${t.totalAspects}`);const s=document.getElementById("statsCard");s&&t.competitorCount>0&&s.classList.remove("hidden");const o=document.getElementById("proceedBtn");if(o){const r=t.selectedCompetitorCount>0||t.selectedSemanticElements>0||t.selectedAspects>0;o.disabled=!r}}function _e(){const t=document.getElementById("selectAllBtn"),e=document.getElementById("deselectAllBtn"),n=document.getElementById("proceedBtn");t&&t.addEventListener("click",()=>{u.selectAllElements(),q(u.results)}),e&&e.addEventListener("click",()=>{u.deselectAllElements(),q(u.results)}),n&&n.addEventListener("click",()=>{qe()})}function qe(){const t=u.getSelectedData(),e=document.getElementById("phase2Section");e&&(e.classList.remove("hidden"),S(e),e.scrollIntoView({behavior:"smooth"})),De(t),Ge()}function De(t){const e=document.getElementById("selectedSummary");e&&(e.innerHTML=`
        <div>• <strong>Competitor:</strong> ${t.counts.competitors} selezionati</div>
        <div>• <strong>Elementi Semantici:</strong> ${t.counts.semanticElements} selezionati</div>
        <div>• <strong>Aspetti da Trattare:</strong> ${t.counts.aspects} selezionati</div>
    `)}function Ge(){const t=document.getElementById("generateOutlineBtn"),e=document.getElementById("copyMarkdownBtn");t&&t.addEventListener("click",async()=>{await je()}),e&&e.addEventListener("click",()=>{Fe()})}async function je(){try{const t=document.getElementById("openrouterApiKey").value.trim(),e=document.getElementById("topicInput").value.trim(),n=document.getElementById("includeH3").checked;if(!t||!e){m("API key e topic sono richiesti per generare l'outline.");return}k("Generando outline finale...");const i=await u.generateFinalOutline(t,e,n);Ue(i.outline,i.analytics),h(),v("Outline finale generata con successo!")}catch(t){h(),m(`Errore durante la generazione: ${t.message}`),console.error("Outline generation error:",t)}}function Ue(t,e){const n=document.getElementById("generatedOutlineSection"),i=document.getElementById("generatedOutlineContent");n&&i&&(i.textContent=t,n.classList.remove("hidden"),S(n),Ke(e),We(n,t),n.scrollIntoView({behavior:"smooth"}))}function We(t,e){let n=t.querySelector("#proceedToPhase3Btn");if(!n){const i=document.createElement("div");i.className="mt-4 text-center",n=document.createElement("button"),n.id="proceedToPhase3Btn",n.className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-md transition-colors text-lg",n.innerHTML="🧠 Procedi alla Fase 3: Analisi Semantica",i.appendChild(n),t.appendChild(i)}n.onclick=()=>{const i=document.getElementById("topicInput").value.trim();ye(e,i)}}function Ke(t){const e={h2Count:document.getElementById("h2Count"),h3Count:document.getElementById("h3Count"),questionsCount:document.getElementById("questionsCount"),totalSections:document.getElementById("totalSections")};e.h2Count&&(e.h2Count.textContent=t.h2Count),e.h3Count&&(e.h3Count.textContent=t.h3Count),e.questionsCount&&(e.questionsCount.textContent=t.questionsCount),e.totalSections&&(e.totalSections.textContent=t.totalSections)}function Fe(){const t=document.getElementById("generatedOutlineContent");if(!t||!t.textContent){m("Nessuna outline da copiare.");return}const e=t.textContent,n=u.convertToMarkdown(e);navigator.clipboard.writeText(n).then(()=>{v("Outline copiata in formato Markdown!");const i=document.getElementById("copyMarkdownBtn");if(i){const s=i.innerHTML;i.innerHTML="✅ Copiato!",i.classList.add("bg-green-600"),i.classList.remove("bg-blue-600"),setTimeout(()=>{i.innerHTML=s,i.classList.remove("bg-green-600"),i.classList.add("bg-blue-600")},2e3)}}).catch(i=>{console.error("Error copying to clipboard:",i),m("Errore durante la copia negli appunti.")})}function Je(){Qe(),Ve(),Ye(),Ze(),_e()}function Qe(){const t=document.getElementById("toggleOpenrouterApiKey"),e=document.getElementById("toggleGeminiApiKey");t&&t.addEventListener("click",()=>{F("openrouterApiKey","openrouterEyeIcon")}),e&&e.addEventListener("click",()=>{F("geminiApiKey","geminiEyeIcon")})}function F(t,e){const n=document.getElementById(t),i=document.getElementById(e);if(!n||!i)return;const s=n.type==="password";n.type=s?"text":"password",i.innerHTML=s?'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />':'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />'}function Ve(){["openrouterApiKey","geminiApiKey","topicInput"].forEach(e=>{const n=document.getElementById(e);n&&n.addEventListener("input",()=>{if(e.includes("ApiKey")){const i=e.replace("ApiKey","");Z(i,n.value)}setTimeout(()=>Y(),0)})})}function Ye(){const t=document.getElementById("generateBtn");t&&t.addEventListener("click",Xe)}async function Xe(){try{const t=document.getElementById("openrouterApiKey").value.trim(),e=document.getElementById("topicInput").value.trim();if(!Y())return;console.log("Skipping API key validation, proceeding with generation...");const n=await u.generateCompleteOutline(t,e);q(n),h(),v("Generazione completata con successo!")}catch(t){h(),m(`Errore durante la generazione: ${t.message}`),console.error("Generation error:",t)}}function Ze(){u.setProgressCallback((t,e)=>{et(t,e)}),u.setStatusCallback(t=>{tt(t)})}function et(t,e){const n=document.getElementById("progressSection"),i=document.getElementById(`step${t}`);if(n&&n.classList.remove("hidden"),i){const s=i.querySelector(".w-4.h-4.rounded-full"),o=i.querySelector("span");s&&(s.className="w-4 h-4 rounded-full bg-blue-500"),o&&(o.textContent=e,o.className="text-sm font-medium text-blue-600 dark:text-blue-400");for(let r=1;r<t;r++){const a=document.getElementById(`step${r}`);if(a){const c=a.querySelector(".w-4.h-4.rounded-full");c&&(c.className="w-4 h-4 rounded-full bg-green-500");const l=a.querySelector("span");l&&(l.className="text-sm text-green-600 dark:text-green-400")}}}}function tt(t){const e=document.getElementById("statusMessage");e&&(e.textContent=t)}function Y(){const t=document.getElementById("openrouterApiKey").value.trim(),e=document.getElementById("topicInput").value.trim(),n=document.getElementById("generateBtn"),i=document.getElementById("generateHelp");let s=!0,o="";return t?e?e.length<3&&(s=!1,o="L'argomento deve essere di almeno 3 caratteri"):(s=!1,o="Inserisci un argomento/topic da analizzare"):(s=!1,o="Inserisci la tua API key di OpenRouter"),n&&(n.disabled=!s),i&&(o?(i.textContent=o,i.classList.remove("hidden")):i.classList.add("hidden")),s}document.addEventListener("DOMContentLoaded",()=>{ee(),te(),Je(),window.outlineGenerator=u,document.body.classList.add("loaded")});
