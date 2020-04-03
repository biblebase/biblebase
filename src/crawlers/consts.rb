$CHINESE_NUMBERS = "一二三四五六七八九十廿"

$BOOKS = {
  mat: {
    index: 40,
    full_name: {
      en: 'Matthew',
      chs: '马太福音',
      cht: '馬太福音'
    },
    short_name: {
      en: 'Mt',
      chs: '太',
      cht: '太'
    }
  },
  php: {
    index: 50,
    full_name: {
      en: 'Philippians',
      chs: '腓立比书',
      cht: '腓立比書'
    },
    short_name: {
      en: 'phil',
      chs: '腓',
      cht: '腓'
    }
  },
  '2co': {
    index: 47,
    full_name: {
      en: '2 Corinthians',
      chs: '哥林多后书',
      cht: '哥林多後书'
    },
    short_name: {
      en: '2co',
      chs: '林后',
      cht: '林後'
    }
  }
}
$BOOK_LOOKUP = $BOOKS.each_with_object({}) do |kv, ret|
  key, book = kv
  book[:full_name].each do |lang, v|
    ret[v] = key
  end
  book[:short_name].each do |lang, v|
    ret[v] = key
  end
end
$LANGS = {
  chs: {
    description_fn: -> (book, chapter, verse) { "#{book[:full_name][:chs]}#{chapter}章#{verse}节" },
    short_fn: -> (book, chapter, verse) { "#{book[:short_name][:chs]}#{chapter}:#{verse}" }
  },
  en: {
    description_fn: -> (book, chapter, verse) { "#{book[:full_name][:en]} #{chapter}:#{verse}" },
    short_fn: -> (book, chapter, verse) { "#{book[:short_name][:en]}#{chapter}:#{verse}" }
  }
}
$VERSIONS = {
  cunpss: {
    version_id: 'CUNPSS',
    version_name: '和合本新标点（神版）',
    lang: 'chs',
    bible_com_index: 48
  },
  cnvs: {
    version_id: 'CNVS',
    version_name: '新译本',
    lang: 'chs',
    bible_com_index: 41
  },
  nlt: {
    version_id: 'NLT',
    version_name: 'New Living Translation',
    lang: 'en',
    bible_com_index: 116
  },
  nasb: {
    version_id: 'NASB',
    version_name: 'New American Standard Bible',
    lang: 'en',
    bible_com_index: 100
  }
}

