// Sample quotes array (loaded from local storage or server)
let quotes = [];

// Load quotes from local storage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    refreshQuotesDisplay();

    // Periodically fetch quotes from the server
    setInterval(async () => {
        await syncQuotes();
    }, 10000); // Fetch every 10 seconds
});

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) throw new Error('Failed to fetch quotes');
        const serverQuotes = await response.json();
        return serverQuotes.map(post => ({
            id: post.id,
            text: post.title,
            author: `User ${post.userId}`,
        }));
    } catch (error) {
        console.error('Error fetching quotes:', error);
        return [];
    }
}

// Function to post a new quote to the server
async function postQuoteToServer(newQuote) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: newQuote.text,
                body: newQuote.author,
                userId: 1, // Simulate a user ID
            }),
        });
        if (!response.ok) throw new Error('Failed to post quote');
        const postedQuote = await response.json();
        return {
            id: postedQuote.id,
            text: postedQuote.title,
            author: `User ${postedQuote.userId}`,
        };
    } catch (error) {
        console.error('Error posting quote:', error);
        return null;
    }
}

// Function to sync local quotes with server quotes
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

    // Merge server quotes with local quotes
    const mergedQuotes = mergeQuotes(localQuotes, serverQuotes);

    // Save merged quotes to local storage
    localStorage.setItem('quotes', JSON.stringify(mergedQuotes));

    // Notify the user of updates
    showNotification('Quotes have been updated from the server.');

    // Refresh the displayed quotes
    refreshQuotesDisplay();
}

// Function to merge local and server quotes (server data takes precedence)
function mergeQuotes(localQuotes, serverQuotes) {
    const quoteMap = new Map();

    // Add local quotes to the map
    localQuotes.forEach(quote => quoteMap.set(quote.id, quote));

    // Add server quotes to the map (server data takes precedence)
    serverQuotes.forEach(quote => quoteMap.set(quote.id, quote));

    // Convert the map back to an array
    return Array.from(quoteMap.values());
}

// Function to refresh the displayed quotes
function refreshQuotesDisplay() {
    const quotesContainer = document.getElementById('quotes-container');
    quotesContainer.innerHTML = ''; // Clear existing quotes

    quotes.forEach(quote => {
        const quoteElement = document.createElement('div');
        quoteElement.className = 'quote';
        quoteElement.innerHTML = `
            <p>"${quote.text}"</p>
            <small>— ${quote.author}</small>
        `;
        quotesContainer.appendChild(quoteElement);
    });
}

// Function to show a notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    notificationMessage.textContent = message;
    notification.style.display = 'block';

    // Hide the notification after 5 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Function to resolve conflicts manually
function resolveConflict() {
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const serverQuotes = fetchQuotesFromServer();

    // Example: Let the user choose which quotes to keep
    const userChoice = confirm('Do you want to keep the server quotes?');
    const finalQuotes = userChoice ? serverQuotes : localQuotes;

    localStorage.setItem('quotes', JSON.stringify(finalQuotes));
    refreshQuotesDisplay();
    document.getElementById('notification').style.display = 'none';
}

// Function to add a new quote
async function addQuote(newQuote) {
    // Add the quote locally
    quotes.push(newQuote);
    saveQuotes();
    refreshQuotesDisplay();

    // Post the quote to the server
    const postedQuote = await postQuoteToServer(newQuote);
    if (postedQuote) {
        console.log('Quote posted to server:', postedQuote);
    }
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) {
        alert('No file selected');
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            refreshQuotesDisplay();
            alert('Quotes imported successfully!');
        } catch (error) {
            alert('Error parsing JSON file');
        }
    };
    fileReader.onerror = function () {
        alert('Error reading file');
    };
    fileReader.readAsText(file);
}

// Function to export quotes to a JSON file
function exportQuotesToJson() {
    const dataStr = JSON.stringify(quotes);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    link.click();
    URL.revokeObjectURL(url);
}