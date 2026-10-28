import assert from 'node:assert/strict';
import {hasGPS,photoPath,validateManifest,directionCone} from './core.mjs';
assert.equal(hasGPS({latitude:36.37,longitude:127.36}),true);
for (const p of [{},{latitude:null,longitude:0},{latitude:91,longitude:0},{latitude:0,longitude:181},{latitude:NaN,longitude:0}]) assert.equal(hasGPS(p),false);
assert.equal(hasGPS({latitude:0,longitude:0}),true);
assert.equal(photoPath('사진 #1.jpg'),'./photos/%EC%82%AC%EC%A7%84%20%231.jpg');
for (const name of ['../secret','..','a\\b','',null]) assert.throws(()=>photoPath(name));
assert.deepEqual(validateManifest([{name:'a.jpg',latitude:36,longitude:127}]),[{name:'a.jpg',latitude:36,longitude:127}]);
for (const data of [{},[null],[{name:'a',latitude:100,longitude:0}],[{name:'a'},{name:'a'}]]) assert.throws(()=>validateManifest(data));
console.log('GPS, 경로, 사진 목록 검증 통과');

const {readFileSync,existsSync}=await import('node:fs');
const entries=validateManifest(JSON.parse(readFileSync(new URL('./photos.json',import.meta.url),'utf8')));
assert.equal(entries.length,35);
for(const photo of entries){
  assert.ok(hasGPS(photo));
  assert.ok(existsSync(new URL(photoPath(photo.name),import.meta.url)));
  assert.ok(existsSync(new URL('./photos/thumbs/'+encodeURIComponent(photo.name),import.meta.url)));
}
console.log('제공 사진 35장, GPS 및 사진/썸네일 파일 확인');

assert.deepEqual(directionCone({latitude:36,longitude:127}),[]);
assert.throws(()=>validateManifest([{name:'bad.jpg',heading:360}]));
const north=directionCone({latitude:36,longitude:127,heading:0});
assert.equal(north.length,12);
assert.ok(north[6][0]>36 && Math.abs(north[6][1]-127)<1e-8);
const east=directionCone({latitude:36,longitude:127,heading:90});
assert.ok(east[6][1]>127 && Math.abs(east[6][0]-36)<1e-7);
for(const p of entries)assert.equal(directionCone(p).length,12);
console.log('촬영 방향 35장 및 북/동 방향 부채꼴 검사 통과');
