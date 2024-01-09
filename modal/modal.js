import { scheduleRequest, getParkingInformation } from "../script.js";

export function generateModal() {
  // 페이지 로딩 시 모달 열기
  console.log("generateModal Go");
  uploadModalContent();
  openModal();
}

// 모달 열기
function openModal() {
  var modal = document.getElementById('myModal');
  modal.style.display = 'block';
}

// 모달 닫기
export function closeModal() {
  let modal = document.getElementById('myModal');
  modal.style.display = 'none';
}

// 모달 리다이랙션 함수
export function navigateTo(page, value) {
  if(value === true) {
    const originalText = document.getElementById('location-content').outerHTML;
    const locationName = parseStringBetweenSingleQuotes(originalText);
    scheduleRequest(locationName);
    getParkingInformation(locationName);
  }
  closeModal();
  window.location.href = page;
}

// HTML에서 ' ' 사이의 문자열을 파싱하는 함수
function parseStringBetweenSingleQuotes(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const textContent = doc.body.textContent;

  // 정규 표현식을 사용하여 ' ' 사이의 문자열 추출
  const match = textContent.match(/'([^']+)'/);
  if (match) {
    return match[1]; // 매치된 문자열 반환
  } else {
    return null; // 매치되지 않으면 null 반환
  }
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
    let url = '//219.255.1.253:8080/parking/withLocation?' + params.toString();
    // let url = 'http://localhost:8080/parking/withLocation?' + params.toString();


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
  let modalBtn = document.getElementById('modalBtn');
  let locationContent = document.getElementById('location-content');

  modalBtn.style.display = 'block';
  locationContent.innerHTML = `'${location}'에 계신가요?`;
}