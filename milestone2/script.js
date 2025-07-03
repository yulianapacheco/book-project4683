// maximum number of books shown per page
const maxResults = 20;
// store all books from the search result
let currentBooks = [];

$(function () {
  // when the Search button is clicked
  $('#searchBtn').on('click', function () {
    const term = $('#searchTerm').val().trim(); // get the user input
    if (term) {
      // build the API URL with the search term
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(term)}&maxResults=60`;

      // get JSON response from Google Books API
      $.getJSON(url, function (data) {
        console.log("API response:", data); // helpful for debugging

        // check if books are found
        if (!data.items || data.items.length === 0) {
          $('#results').html("<p>No books found.</p>");
          $('#pagination').empty();
          return;
        }

        currentBooks = data.items; // save results
        showPage(1); // show first page of results
        buildPagination(Math.ceil(currentBooks.length / maxResults)); // build pagination
      }).fail(function () {
        // if the API call fails
        $('#results').html("<p>Failed to load data from API. Try again later.</p>");
        $('#pagination').empty();
      });
    }
  });

  // when user changes page from dropdown
  $(document).on('change', '#pageSelect', function () {
    const page = Number($(this).val()); // get selected page number
    showPage(page); // show that page of results
  });
});

// display books for the selected page
function showPage(page) {
  const start = (page - 1) * maxResults;
  const end = start + maxResults;
  const books = currentBooks.slice(start, end);
  const $results = $('#results');
  $results.empty(); // clear previous results

  // loop through books and add them to the page
  books.forEach(book => {
    const info = book.volumeInfo;
    const title = info.title || "No title";
    const thumbnail = info.imageLinks?.thumbnail || "";
    const id = book.id;

    // create book display: image + title as a link
    $results.append(`
      <div class="book">
        <img src="${thumbnail}" alt="Cover">
        <a href="details.html?bookId=${id}">${title}</a>
      </div>
    `);
  });
}

// create dropdown to switch pages
function buildPagination(totalPages) {
  let options = '';
  for (let i = 1; i <= totalPages; i++) {
    options += `<option value="${i}">${i}</option>`;
  }

  // add the dropdown to the page
  $('#pagination').html(`<label>Page: <select id="pageSelect">${options}</select></label>`);
}
