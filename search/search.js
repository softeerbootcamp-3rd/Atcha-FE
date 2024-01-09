let parkingList = [];

document.addEventListener('DOMContentLoaded', function() {
    // Extract the search query from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');

    // Display the search result in the designated area
    // const searchResultContainer = document.getElementById('searchResult');
    // searchResultContainer.textContent = `검색어: ${searchQuery || '검색어가 없습니다'}`;
    
});

document.getElementById('goToMain').addEventListener('click', function() {
    // Redirect to list.html when [취소] is clicked
    window.location.href = '../main.html';
});

// document.getElementById('searchInput').addEventListener('keydown', function(event) {
//     // Check if the pressed key is Enter
//     if (event.key === 'Enter') {
//         const searchInputValue = document.getElementById('searchInput').value;

//         if (searchInputValue.trim() !== '') {
//             // Redirect to search.html with the search query as a parameter
//             window.location.href = `search.html?q=${encodeURIComponent(searchInputValue)}`;
//         }
//     }
// });

// 서버에 저장된 모든 주차장 이름을 가져오는 함수
async function getAllParkingName() {
    // 요청 url 생성
    // const reqUrl = `http://localhost:8080/parking/withoutLocation`;
    const reqUrl = `//219.255.1.253:8080/parking/withoutLocation`;

    // api 요청
    const response = await fetch(reqUrl, {
        method : "GET",
        headers : {
            "Content-Type" : "application/json",
        }
    })
    .then(res => {return res.json()});
    // console.log(response);
    parkingList = response.data.parkingList;
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

function filter() {
    let search = document.getElementById("searchInput").value.toLowerCase();
    let listInner = document.getElementsByClassName("listContent");
   
    for (let i = 0; i < listInner.length; i++) {
        parkingName = listInner[i].getElementsByClassName("position-left");
        if (parkingName[0].innerHTML.toLowerCase().includes(search)
           ) {
            listInner[i].style.display = "flex"
        } else {
            listInner[i].style.display = "none"
        }
    }
}

// 웹 페이지에 저장되어 있는 위치들 출력하는 함수
async function viewParkingList() {
    const listContainer = document.getElementById('listContainer');
    await getAllParkingName();

    parkingList.forEach(function (item) {
        // console.log(item);
        const listContent = document.createElement("div");
        listContent.id = item.name;
        listContent.addEventListener('click', function(event) {
            localStorage.setItem("locationKey", event.currentTarget.id);
            window.location.href = '../main.html';
        });
        listContent.classList.add("listContent");

        const parkingName = document.createElement("text");
        parkingName.classList.add("position-left");
        parkingName.textContent = item.name;
        listContent.append(parkingName);

        if (item.distance) {
            const parkingDistance = document.createElement("text");
            parkingDistance.classList.add("position-right");
            parkingDistance.textContent = item.distance;
            listContent.append(parkingDistance);
        }

        listContainer.append(listContent);

        // const divElement = document.createElement('div');
        // divElement.textContent = item;
        // listContainer.appendChild(divElement);
    });
}

function main() {
    viewParkingList();
}

main();