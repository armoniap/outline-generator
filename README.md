# AI Outline Generator

Un potente tool AI che genera outline complete e semanticamente coerenti per qualsiasi argomento utilizzando analisi dei competitor e analisi semantica avanzata.

## 🚀 Funzionalità

### Fase 1: Generazione e Analisi
- **Ricerca Competitor SERP**: Cerca automaticamente i primi 10 risultati nella SERP per l'argomento specificato
- **Estrazione Outline**: Estrae le strutture delle outline dai competitor utilizzando AI
- **Filtro Intelligente**: Rimuove automaticamente subheadings non coerenti (contatti, pubblicità, etc.)
- **Analisi Semantica Completa**: Genera un lessico semantico dettagliato con 13 categorie di analisi
- **Identificazione Aspetti**: Identifica tutti gli aspetti che dovrebbero essere trattati per un contenuto completo

### Caratteristiche dell'Analisi Semantica
1. 5 entità principali del topic
2. 5 sinonimi 
3. 5 categorie organizzative con entità, esempi e attributi
4. Concetti semantici applicati al topic
5. Categorie linguistiche correlate
6. Relazioni tutto-parte
7. Collocazioni comuni
8. Affermazioni correlate
9. Domande correlate
10. Errori/misconcezioni comuni
11. Dibattiti attuali

### Interfaccia Interattiva
- **Selezione/Deselezione**: Interfaccia intuitiva per selezionare/deselezionare elementi
- **Statistiche Real-time**: Monitoraggio in tempo reale delle selezioni
- **Progresso Visuale**: Tracking visuale del progresso di generazione
- **Controlli Batch**: Seleziona tutto/deseleziona tutto con un click

## 🛠 Tecnologie Utilizzate

- **Frontend**: Vanilla JavaScript, Tailwind CSS
- **Build Tool**: Vite
- **AI APIs**: 
  - OpenRouter API per orchestrazione modelli AI
  - Perplexity/Sonar per ricerca SERP online
  - Claude Sonnet 3.5 per analisi semantica e generazione aspetti
  - GPT-4o Mini per estrazione outline
- **Deployment**: GitHub Pages

## 📋 Requisiti

- **API Key OpenRouter**: Necessaria per accedere ai modelli AI
- **Browser moderno**: Supporto per ES6+ e Fetch API

## 🚀 Installazione e Setup

### Sviluppo Locale

```bash
# Clona il repository
git clone https://github.com/tuonome/outline-generator.git
cd outline-generator

# Installa dipendenze
npm install

# Avvia development server
npm run dev

# Build per produzione
npm run build

# Preview build di produzione
npm run preview
```

### Deploy su GitHub Pages

```bash
# Build e deploy automatico
npm run deploy
```

## 📖 Come Usare

1. **Configura API**: Inserisci la tua API key di OpenRouter
2. **Specifica Topic**: Inserisci l'argomento per cui vuoi generare l'outline
3. **Avvia Generazione**: Clicca "Genera Outline Completa"
4. **Monitora Progresso**: Segui il progresso attraverso i 5 step:
   - Ricerca competitor nella SERP
   - Estrazione outline competitor
   - Analisi semantica completa
   - Generazione aspetti da trattare
   - Compilazione risultati
5. **Rivedi Risultati**: Analizza competitor, dati semantici e aspetti trovati
6. **Seleziona Elementi**: Scegli quali elementi includere/escludere
7. **Procedi Fase 2**: Usa i dati selezionati per la generazione finale (prossimo update)

## 🎯 Modelli AI Utilizzati

- **Perplexity Sonar Large**: Ricerca SERP online in tempo reale
- **GPT-4o Mini**: Estrazione rapida ed efficiente delle outline
- **Claude Sonnet 3.5**: Analisi semantica avanzata e generazione aspetti

## 🔧 Configurazione

Il tool è configurato per funzionare out-of-the-box con GitHub Pages. Il file `vite.config.js` include:

```javascript
export default defineConfig({
  base: '/outline-generator/',
  // ... altre configurazioni
});
```

## 📊 Filtri Automatici

Il sistema filtra automaticamente subheadings non coerenti come:
- Sezioni commerciali (contatti, preventivi)
- Elementi di navigazione  
- Footer e sidebar
- Sezioni autore/biografia
- Call-to-action pubblicitarie
- E molti altri...

## 🤝 Contributi

I contributi sono benvenuti! Per contribuire:

1. Fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è distribuito sotto licenza ISC. Vedi il file `LICENSE` per dettagli.

## 🐛 Bug Reports

Per segnalare bug o richiedere feature, apri un issue su GitHub.

## 🚀 Roadmap

### Fase 2 (Prossimi Updates)
- Generazione outline finale basata su elementi selezionati
- Export in diversi formati (MD, HTML, JSON)
- Template personalizzabili
- Salvataggio progetti
- Integrazione con altri tool SEO

---

**Nota**: Questo tool richiede una API key OpenRouter valida. Assicurati di avere crediti sufficienti per l'utilizzo dei modelli AI.