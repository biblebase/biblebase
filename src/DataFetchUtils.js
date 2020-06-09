const GET_BIBLE_ENDPOINT = "http://cors-anywhere.herokuapp.com/https://getbible.net/v2/cut";
// const GET_BIBLE_ENDPOINT = "https://getbible.net/v2/cut";

// remove cors anywhere on deployment
const GET_VERSE_ENDPOINT = "http://cors-anywhere.herokuapp.com/http://biblebase.s3-website-us-east-1.amazonaws.com/json";
const GET_WORD_ENDPOINT = "http://cors-anywhere.herokuapp.com/http://biblebase.s3-website-us-east-1.amazonaws.com/words";


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

function getWordHtml(id) {
  return fetchHtml(encodeURI(`${GET_WORD_ENDPOINT}/${id}.htm`));
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

export { getBibleIndex, getBookChapterJson,  getVerseJson, getWordHtml, fetchJson, fetchLocalJsonData, 
  GET_BIBLE_ENDPOINT, GET_VERSE_ENDPOINT };