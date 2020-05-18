const GET_BIBLE_ENDPOINT = "https://cors-anywhere.herokuapp.com/https://getbible.net/v2/cut";
// const GET_BIBLE_ENDPOINT = "https://getbible.net/v2/cut";
const GET_VERSE_ENDPOINT = "http://cors-anywhere.herokuapp.com/http://biblebase.s3-website-us-east-1.amazonaws.com/json"
function getBibleIndex() {
  return fetchLocalJsonData('./json/bibleIndex.json');
}

function getBookChapterJson(bookId, chapter) {
  // return fetchLocalJsonData(`/json/b${bookId}.${chapter}.json`);
    const url = encodeURI(`${GET_BIBLE_ENDPOINT}/${bookId}/${chapter}.json`);
    return fetchBookChapterJson(url);
}

function getVerseJson(bookId, chapter, verse) {
  if (verse === 0) {
    return fetchVerseJson(encodeURI(`${GET_VERSE_ENDPOINT}/${bookId}/${chapter}.json`));
    // return fetchLocalJsonData(`/json/${bookId}.${chapter}.json`);
  } else {
    return fetchVerseJson(encodeURI(`${GET_VERSE_ENDPOINT}/${bookId}/${chapter}/${verse}.json`));
    // return fetchLocalJsonData(`/json/${bookId}.${chapter}.${verse}.json`);
  }
}

async function fetchBookChapterJson(path) {
    const res = await fetch(path);
    const data = await res.json();    
    return data;
}

async function fetchVerseJson(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function fetchLocalJsonData(path) {
    const res = await fetch(path, {mode: 'no-cors'});
    const text = await res.text();
    // const data = await res.json();   
    return JSON.parse(text);
}

export { getBibleIndex, getBookChapterJson,  getVerseJson };