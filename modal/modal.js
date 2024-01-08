// 페이지 로딩 시 모달 열기
document.addEventListener('DOMContentLoaded', function() {
  openModal();
});

// 모달 열기
function openModal() {
  var modal = document.getElementById('myModal');
  modal.style.display = 'block';
}

// 모달 닫기
function closeModal() {
  var modal = document.getElementById('myModal');
  modal.style.display = 'none';
}

// 결과 반환
function returnResult(value) {
  closeModal(); // 모달 닫기
  console.log(value); // 여기에서는 콘솔에 결과를 출력하도록 했습니다. 원하는 작업을 수행하면 됩니다.
}
