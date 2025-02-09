document.addEventListener('DOMContentLoaded', () => {
    const notification = document.getElementById('notification');
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const addQuoteBtn = document.getElementById('addQuoteBtn');
    const exportQuotesBtn = document.getElementById('exportQuotesBtn');
    const importFileInput = document.getElementById('importFile');
    const categoryFilter = document.getElementById('categoryFilter');

    let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

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

    // Function to fetch quotes from the server
    const fetchQuotesFromServer = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            const serverQuotes = await response.json();
            const formattedQuotes = serverQuotes.map(post => ({
                text: post.title,
                category: 'Server'
            }));

            // Merge server quotes with local quotes
            const mergedQuotes = [...quotes, ...formattedQuotes];
            const uniqueQuotes = Array.from(new Set(mergedQuotes.map(quote => JSON.stringify(quote))))
                .map(quote => JSON.parse(quote));

            // Update local storage with merged quotes
            quotes = uniqueQuotes;
            saveQuotes();
            populateCategories();
            showRandomQuote();

            // Notify the user
            notification.textContent = 'Quotes synced with server successfully!';
            notification.style.color = 'green';
        } catch (error) {
            notification.textContent = 'Failed to fetch quotes from server.';
            notification.style.color = 'red';
        }
    };

    // Function to post quotes to the server
    const postQuotesToServer = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quotes)
            });

            if (response.ok) {
                notification.textContent = 'Quotes posted to server successfully!';
                notification.style.color = 'green';
            } else {
                notification.textContent = 'Failed to post quotes to server.';
                notification.style.color = 'red';
            }
        } catch (error) {
            notification.textContent = 'Failed to post quotes to server.';
            notification.style.color = 'red';
        }
    };

    // Function to sync quotes with the server
    const syncQuotes = async () => {
        await fetchQuotesFromServer(); // Fetch quotes from the server
        await postQuotesToServer(); // Post quotes to the server
    };

    // Function to periodically check for new quotes from the server
    const startPeriodicSync = () => {
        setInterval(syncQuotes, 30000); // Sync every 30 seconds
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

    // Start periodic syncing with the server
    startPeriodicSync();

    // Perform an initial sync on page load
    syncQuotes();
});