document.addEventListener('DOMContentLoaded', function () {
    const scrollContainer = document.getElementById('scrollContainer');
    const list = document.getElementById('list');

    // 가상의 아이템을 생성하여 리스트에 추가
    for (let i = 1; i <= 50; i++) {
        const listItem = document.createElement('li');
        listItem.className = 'listItem';
        listItem.textContent = '리스트 아이템 ' + i;
        list.appendChild(listItem);
    }

    // 스크롤 이벤트 처리
    // scrollContainer.addEventListener('scroll', function () {
    //     // 스크롤이 끝까지 도달하면 새로운 아이템을 리스트에 추가
    //     if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
    //         for (let i = 51; i <= 100; i++) {
    //             const listItem = document.createElement('li');
    //             listItem.className = 'listItem';
    //             listItem.textContent = '리스트 아이템 ' + i;
    //             list.appendChild(listItem);
    //         }
    //     }
    // });
});

document.getElementById('goToMain').addEventListener('click', function() {
    // Redirect to list.html when [뒤로가기] is clicked
    window.location.href = 'index.html';
});

document.getElementById('edit').addEventListener('click', function() {
    // Redirect to list.html when [뒤로가기] is clicked
    console.log("Edit!")
});