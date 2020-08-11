const GET_BIBLE_ENDPOINT = "/json/cunp";

// deployement
const GET_VERSE_ENDPOINT = "/json/verses";
const GET_WORD_ENDPOINT = "/json/words";

// local test
// const GET_VERSE_ENDPOINT = "http://0.0.0.0:8080/http://biblebase.s3-website-us-east-1.amazonaws.com/json";


function getBibleIndex() {
  return fetchLocalJsonData('./json/bibleIndex.json');
}

function getBookChapterJson(bookId, chapter) {
  // return fetchLocalJsonData(`/json/b${bookId}.${chapter}.json`);
    const url = encodeURI(`${GET_BIBLE_ENDPOINT}/${bookId}/${chapter}.json`);
    return fetchJson(url);
}

function getVerseJson(bookId, chapter, verse) {
  if (verse === 0) {
    return fetchJson(encodeURI(`${GET_VERSE_ENDPOINT}/${bookId}/${chapter}.json`));
    // return fetchLocalJsonData(`/json/${bookId}.${chapter}.json`);
  } else {
    return fetchJson(encodeURI(`${GET_VERSE_ENDPOINT}/${bookId}/${chapter}/${verse}.json`));
    // return fetchLocalJsonData(`/json/${bookId}.${chapter}.${verse}.json`);
  }
}

function getWordJson(wordId) {
  return fetchJson(encodeURI(`${GET_WORD_ENDPOINT}/${wordId}.json`))
}

async function fetchJson(path) {
    const res = await fetch(path);
    const data = await res.json();    
    return data;
}

async function fetchHtml(path) {
  const res = await fetch(path);
  const text = await res.text();
  return text;
}

async function fetchLocalJsonData(path) {
    const res = await fetch(path, {mode: 'no-cors'});
    const text = await res.text();   
    return JSON.parse(text);
}

export { getBibleIndex, getBookChapterJson,  getVerseJson, fetchJson, fetchLocalJsonData, getWordJson,
  GET_BIBLE_ENDPOINT, GET_VERSE_ENDPOINT };