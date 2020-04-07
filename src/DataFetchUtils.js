const GET_BIBLE_ENDPOINT = "http://cors-anywhere.herokuapp.com/https://getbible.net/v2/cus";
// const GET_BIBLE_ENDPOINT = "https://getbible.net/v2/cus";

function getBibleIndex() {
  return fetchLocalJsonData('./json/bibleIndex.json');
}

function getBookChapterJson(bookId, chapter) {
    const url = encodeURI(`${GET_BIBLE_ENDPOINT}/${bookId}/${chapter}.json`);
    return fetchBookChapterJson(url);
}

function getVerseJson(verse) {
  return fetchLocalJsonData(`./json/${verse.toLowerCase()}.json`);
}

async function fetchBookChapterJson(path) {
    const res = await fetch(path);
    const data = await res.json();    
    console.log(data);
    return data;
}

async function fetchLocalJsonData(path) {
    const res = await fetch(path, {mode: 'no-cors'});
    const data = await res.json();    
    return data;
}

export { getBibleIndex, getBookChapterJson,  getVerseJson };