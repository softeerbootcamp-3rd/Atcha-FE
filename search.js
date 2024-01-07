document.addEventListener('DOMContentLoaded', function() {
    // Extract the search query from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');

    // Display the search result in the designated area
    const searchResultContainer = document.getElementById('searchResult');
    searchResultContainer.textContent = `검색어: ${searchQuery || '검색어가 없습니다'}`;
    
});

document.getElementById('goToMain').addEventListener('click', function() {
    // Redirect to list.html when [취소] is clicked
    window.location.href = 'index.html';
});

document.getElementById('searchInput').addEventListener('keydown', function(event) {
    // Check if the pressed key is Enter
    if (event.key === 'Enter') {
        const searchInputValue = document.getElementById('searchInput').value;

        if (searchInputValue.trim() !== '') {
            // Redirect to search.html with the search query as a parameter
            window.location.href = `search.html?q=${encodeURIComponent(searchInputValue)}`;
        }
    }
});

// 서버에 저장된 모든 주차장 이름을 가져오는 함수
async function getAllParkingName() {
    const response = await fetch('/parking/withoutLocation');
    const jsonData = response.json();

    const parkings = [...jsonData.parkingList];

    return parkings;
}

// 배열을 순회하면서 특정 문자열과 일치하는지 확인하는 함수
async function isParkingExist(target) {
    const array = await getAllParkingName();
    for (let i = 0;i < array.length;i++) {
        if (array[i] === target) {
            return true;
        }
    }
    return false;
}

// 웹 페이지에 저장되어 있는 위치들 출력하는 함수
function viewParkingList() {
    const listContainer = document.getElementById('listContainer');
    const parkings = getAllParkingName();

    parkings.forEach(function (item) {
        const divElement = document.createElement('div');
        divElement.textContent = item;
        listContainer.appendChild(divElement);
    });
}

function main() {
    viewParkingList();
}