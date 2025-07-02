// Maximum number of books shown per page
const maxResults = 20;
// Store all books from the search result
let currentBooks = [];

$(function () {
  // When the Search button is clicked
  $('#searchBtn').on('click', function () {
    const term = $('#searchTerm').val().trim(); // Get the user input
    if (term) {
      // Build the API URL with the search term
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(term)}&maxResults=60`;

      // Get JSON response from Google Books API
      $.getJSON(url, function (data) {
        currentBooks = data.items || []; // Save results
        showPage(1); // Show first page of results
        buildPagination(Math.ceil(currentBooks.length / maxResults)); // Build pagination dropdown
      });
    }
  });

  // When user changes page from dropdown
  $(document).on('change', '#pageSelect', function () {
    const page = Number($(this).val()); // Get selected page number
    showPage(page); // Show that page of results
  });
});

// Display books for the selected page
function showPage(page) {
  const start = (page - 1) * maxResults;
  const end = start + maxResults;
  const books = currentBooks.slice(start, end);
  const $results = $('#results');
  $results.empty(); // Clear previous results

  // Loop through books and add them to the page
  books.forEach(book => {
    const info = book.volumeInfo;
    const title = info.title || "No title";
    const thumbnail = info.imageLinks?.thumbnail || "";
    const id = book.id;

    // Create book display: image + title as a link
    $results.append(`
      <div class="book">
        <img src="${thumbnail}" alt="Cover">
        <a href="details.html?bookId=${id}">${title}</a>
      </div>
    `);
  });
}

// Create dropdown to switch pages
function buildPagination(totalPages) {
  let options = '';
  for (let i = 1; i <= totalPages; i++) {
    options += `<option value="${i}">${i}</option>`;
  }

  // Add the dropdown to the page
  $('#pagination').html(`<label>Page: <select id="pageSelect">${options}</select></label>`);
}
