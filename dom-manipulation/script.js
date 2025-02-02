document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
        { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');

    // Function to display a random quote
    const showRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><em>- ${randomQuote.category}</em></p>`;
    };

    // Function to create the "Add Quote" form dynamically
    const createAddQuoteForm = () => {
        const formContainer = document.createElement('div');
        formContainer.innerHTML = `
            <h2>Add a New Quote</h2>
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button id="addQuoteBtn">Add Quote</button>
        `;
        document.body.appendChild(formContainer);

        // Add event listener to the "Add Quote" button
        const addQuoteBtn = document.getElementById('addQuoteBtn');
        addQuoteBtn.addEventListener('click', addQuote);
    };

    // Function to add a new quote
    const addQuote = () => {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

        if (newQuoteText && newQuoteCategory) {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            alert('Quote added successfully!');
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';
            showRandomQuote(); // Display a new random quote after adding
        } else {
            alert('Please enter both a quote and a category.');
        }
    };

    // Event listener for the "Show New Quote" button
    newQuoteBtn.addEventListener('click', showRandomQuote);

    // Create the "Add Quote" form when the page loads
    createAddQuoteForm();

    // Display a random quote on page load
    showRandomQuote();
});