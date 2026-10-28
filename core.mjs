export function hasGPS(photo) {
  return Number.isFinite(photo.latitude) && Number.isFinite(photo.longitude)
    && Math.abs(photo.latitude) <= 90 && Math.abs(photo.longitude) <= 180;
}
export function photoPath(name) {
  if (typeof name !== 'string' || !name || name === '.' || name === '..' || /[\\/]/.test(name)) throw new Error('잘못된 사진 파일명');
  return './photos/' + encodeURIComponent(name);
}
export function validateManifest(data) {
  if (!Array.isArray(data)) throw new Error('photos.json은 배열이어야 합니다.');
  const names = new Set();
  return data.map(photo => {
    if (!photo || typeof photo !== 'object') throw new Error('잘못된 사진 항목');
    photoPath(photo.name);
    if (names.has(photo.name)) throw new Error('사진 파일명이 중복되었습니다.');
    names.add(photo.name);
    if (('latitude' in photo || 'longitude' in photo) && !hasGPS(photo)) throw new Error('잘못된 GPS 좌표');
    return {...photo};
  });
}
