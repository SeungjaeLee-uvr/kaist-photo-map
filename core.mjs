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
    if ('heading' in photo && (!Number.isFinite(photo.heading) || photo.heading < 0 || photo.heading >= 360)) throw new Error('잘못된 촬영 방향');
    return {...photo};
  });
}

export function directionCone(photo) {
  if (!hasGPS(photo) || !Number.isFinite(photo.heading) || photo.heading < 0 || photo.heading >= 360) return [];
  const rad = Math.PI / 180, lat = photo.latitude * rad, lon = photo.longitude * rad;
  const distance = 70 / 6371000;
  const points = [[photo.latitude, photo.longitude]];
  // The wedge illustrates direction; its 50-degree width is not the lens field of view.
  for (let offset = -25; offset <= 25; offset += 5) {
    const bearing = (photo.heading + offset) * rad;
    const y = Math.asin(Math.sin(lat) * Math.cos(distance) + Math.cos(lat) * Math.sin(distance) * Math.cos(bearing));
    const x = lon + Math.atan2(Math.sin(bearing) * Math.sin(distance) * Math.cos(lat), Math.cos(distance) - Math.sin(lat) * Math.sin(y));
    points.push([y / rad, (x / rad + 540) % 360 - 180]);
  }
  return points;
}
