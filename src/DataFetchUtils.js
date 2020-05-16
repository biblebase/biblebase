const GET_BIBLE_ENDPOINT = "https://cors-anywhere.herokuapp.com/https://getbible.net/v2/cus";
// const GET_BIBLE_ENDPOINT = "https://getbible.net/v2/cus";
const GET_VERSE_ENDPOINT = "http://cors-anywhere.herokuapp.com/http://biblebase.s3-website-us-east-1.amazonaws.com/json"
function getBibleIndex() {
  return fetchLocalJsonData('./json/bibleIndex.json');
}

function getBookChapterJson(bookId, chapter) {
    const url = encodeURI(`${GET_BIBLE_ENDPOINT}/${bookId}/${chapter}.json`);
    return fetchBookChapterJson(url);
}

function getVerseJson(bookId, chapter, verse) {
  // return fetchLocalJsonData(`./json/php.${chapter}.${verse}.json`);
  const url = encodeURI(`${GET_VERSE_ENDPOINT}/${bookId}/${chapter}/${verse}.json`);
  console.log(url);
  return fetchVerseJson(url);
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
    const data = await res.json();    
    return data;
}

export { getBibleIndex, getBookChapterJson,  getVerseJson };