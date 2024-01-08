// 페이지 로딩 시 모달 열기
document.addEventListener('DOMContentLoaded', function() {
  uploadModalContent();
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

// 모달 내용 업로드
function uploadModalContent() {
  // 현재 위치 가져오기
  navigator.geolocation.getCurrentPosition(getSuccess, getError);

  // 가져오기 성공
  async function getSuccess(position) {
    // 위도
    const latitude = position.coords.latitude;
    // 경도
    const longitude = position.coords.longitude;

    console.log(latitude, longitude);

    let params = new URLSearchParams();
    params.append('latitude', latitude.toString());
    params.append('longitude', longitude.toString());

    console.log(params.toString());

    // URL과 쿼리 문자열 합치기
    let url = 'http://localhost:8080/parking/withLocation?' + params.toString();


    const response = await fetch(url);
    const jsonData = await response.json();

    console.log(jsonData);
    console.log(jsonData.data.parkingList[0].name);

    const parkingName = jsonData.data.parkingList[0].name;
    updateText(parkingName);
  }

  // 가져오기 실패(거부)
  function getError() {
    alert('Geolocation Error');
  }
}

// HTML text update
function updateText(location) {
  let locationContent = document.getElementById('location-content');
  locationContent.innerHTML = `'${location}'에 계신가요?`;
}