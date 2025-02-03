document.addEventListener('DOMContentLoaded', () => {
    // Load quotes from local storage or initialize with default quotes
    let quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
        { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const addQuoteBtn = document.getElementById('addQuoteBtn');
    const exportQuotesBtn = document.getElementById('exportQuotesBtn');
    const importFileInput = document.getElementById('importFile');

    // Function to save quotes to local storage
    const saveQuotes = () => {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    };

    // Function to display a random quote
    const showRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><em>- ${randomQuote.category}</em></p>`;

        // Store the last viewed quote in session storage
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
    };

    // Function to add a new quote
    const addQuote = () => {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

        if (newQuoteText && newQuoteCategory) {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            saveQuotes(); // Save updated quotes to local storage
            alert('Quote added successfully!');
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';
            showRandomQuote(); // Display a new random quote after adding
        } else {
            alert('Please enter both a quote and a category.');
        }
    };

    // Function to export quotes as a JSON file
    const exportQuotes = () => {
        const dataStr = JSON.stringify(quotes);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Function to import quotes from a JSON file
    const importQuotes = (event) => {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes(); // Save updated quotes to local storage
            alert('Quotes imported successfully!');
            showRandomQuote(); // Display a new random quote after importing
        };
        fileReader.readAsText(event.target.files[0]);
    };

    // Event listeners
    newQuoteBtn.addEventListener('click', showRandomQuote);
    addQuoteBtn.addEventListener('click', addQuote);
    exportQuotesBtn.addEventListener('click', exportQuotes);
    importFileInput.addEventListener('change', importQuotes);

    // Display a random quote on page load
    showRandomQuote();

    // Display the last viewed quote from session storage (if available)
    const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
    if (lastViewedQuote) {
        quoteDisplay.innerHTML = `<p>"${lastViewedQuote.text}"</p><p><em>- ${lastViewedQuote.category}</em></p>`;
    }
});