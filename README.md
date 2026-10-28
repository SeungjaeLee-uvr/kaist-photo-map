# KAIST 사진 지도

지도 + 제공받은 사진만 표시하는 정적 페이지. 사진 또는 지도 점을 누르면 서로 연결됩니다. 사진 클릭 시 확대됩니다. 모바일은 지도 위 / 사진 아래.

## 사진 추가

제공받은 사진을 `photos/`에 넣고 `photos.json`에 파일명과 원본 GPS를 기록합니다. 좌표 없는 사진은 지도 점 없이 사진만 표시됩니다. GPS 없는 위치를 추측하지 않습니다.

```json
[
  {"name":"사진1.jpg","latitude":36.372,"longitude":127.3604},
  {"name":"사진2.jpg"}
]
```

위 좌표는 형식 설명용 예시입니다. 현재 제공받은 IMG_1629.JPG~IMG_1663.JPG 총 35장과 원본 EXIF GPS를 연결했습니다. 웹용 사진은 최대 2048px, 썸네일은 최대 240px이며 원본은 변경하지 않았습니다. 방문자 업로드·편집·저장 기능은 없습니다. JPG/PNG/WEBP 권장. HEIC는 웹용으로 변환합니다.

## 미리 보기

이 폴더에서 `python3 -m http.server 4173` 실행 후 http://localhost:4173 접속합니다.

## GitHub Pages 배포

이 폴더 내용만 새 저장소의 루트로 올립니다. 상위 아두이노 저장소와 섞지 않습니다. 새 저장소는 비공개로 시작하고 GitHub 요금제의 비공개 저장소 Pages 지원 여부를 확인합니다. 공개 전환은 사용자가 결정합니다.

1. 기본 브랜치 `main`.
2. 저장소 Settings → Pages → Source: **GitHub Actions**.
3. `.github/workflows/pages.yml`이 main push 또는 수동 실행 때 검사 후 배포합니다.
4. 배포 주소는 Actions 결과 / Settings → Pages에서 확인합니다.

상대 경로를 사용하므로 저장소 하위 URL에서도 작동합니다. 서버·API 키·빌드 불필요. 사진과 GPS 좌표는 사이트 방문자에게 보입니다.

## 검증 및 출처

`node --test core.test.mjs` — GPS, 파일명, 경로 이탈, 중복, 데이터 검증.

[Leaflet 1.9.4](https://leafletjs.com/)와 [OpenStreetMap](https://www.openstreetmap.org/copyright) 사용. 지도와 라이브러리를 불러오려면 인터넷이 필요합니다. GPS는 원본 사진에서 추출해 photos.json에 저장했습니다. 대용량 원본은 웹용 크기로 변환하는 편이 좋습니다.
