const GET_BIBLE_ENDPOINT = "http://cors-anywhere.herokuapp.com/https://getbible.net/v2/cus";
// const GET_BIBLE_ENDPOINT = "https://getbible.net/v2/cus";

function getBibleIndex() {
  return fetchLocalJsonData('./json/bibleIndex.json');
}

function getBookChapterJson(bookId, chapter) {
    const url = encodeURI(`${GET_BIBLE_ENDPOINT}/${bookId}/${chapter}.json`);
    return fetchBookChapterJson(url);
}

function getVerseJson(bookId, chapter, verse) {
  return fetchLocalJsonData(`./json/php.${chapter}.${verse}.json`);
}

async function fetchBookChapterJson(path) {
    const res = await fetch(path);
    const data = await res.json();    
    return data;
}

async function fetchLocalJsonData(path) {
    const res = await fetch(path, {mode: 'no-cors'});
    const data = await res.json();    
    return data;
}

export { getBibleIndex, getBookChapterJson,  getVerseJson };