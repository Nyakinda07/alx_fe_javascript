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
    const categoryFilter = document.getElementById('categoryFilter');

    // Function to save quotes to local storage
    const saveQuotes = () => {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    };

    // Function to display a random quote
    const showRandomQuote = () => {
        const selectedCategory = categoryFilter.value;
        const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

        if (filteredQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            const randomQuote = filteredQuotes[randomIndex];
            quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><em>- ${randomQuote.category}</em></p>`;
        } else {
            quoteDisplay.innerHTML = `<p>No quotes available for the selected category.</p>`;
        }
    };

    // Function to populate categories in the dropdown
    const populateCategories = () => {
        const categories = [...new Set(quotes.map(quote => quote.category))];
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        // Restore the last selected filter from local storage
        const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
        if (lastSelectedCategory) {
            categoryFilter.value = lastSelectedCategory;
        }
    };

    // Function to filter quotes based on the selected category
    const filterQuotes = () => {
        localStorage.setItem('lastSelectedCategory', categoryFilter.value);
        showRandomQuote();
    };

    // Function to add a new quote
    const addQuote = () => {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

        if (newQuoteText && newQuoteCategory) {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            saveQuotes(); // Save updated quotes to local storage
            populateCategories(); // Update the category dropdown
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
            populateCategories(); // Update the category dropdown
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
    categoryFilter.addEventListener('change', filterQuotes);

    // Populate categories and display a random quote on page load
    populateCategories();
    showRandomQuote();
});