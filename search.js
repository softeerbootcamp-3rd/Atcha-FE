document.addEventListener('DOMContentLoaded', function() {
    // Extract the search query from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');

    // Display the search result in the designated area
    const searchResultContainer = document.getElementById('searchResult');
    searchResultContainer.textContent = `검색어: ${searchQuery || '검색어가 없습니다'}`;
    
});