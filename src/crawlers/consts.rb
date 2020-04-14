$CHINESE_NUMBERS = "一二三四五六七八九十廿"

$BOOKS = {
  'gen': {
    index: 1
  },
  'exo': {
		index: 2
	},
  'lev': {
		index: 3
	},
	'num': {
		index: 4
	},
	'deu': {
		index: 5
	},
	'jos': {
		index: 6
	},
	'jdg': {
		index: 7
	},
	'rut': {
		index: 8
	},
	'1sa': {
		index: 9
	},
	'2sa': {
		index: 10
	},
	'1ki': {
		index: 11
	},
	'2ki': {
		index: 12
	},
	'1ch': {
		index: 13
	},
	'2ch': {
		index: 14
	},
	'ezr': {
		index: 15
	},
	'neh': {
		index: 16
	},
	'est': {
		index: 17
	},
	'job': {
		index: 18
	},
	'psa': {
		index: 19
	},
	'pro': {
		index: 20
	},
	'ecc': {
		index: 21
	},
	'sng': {
		index: 22
	},
	'isa': {
		index: 23
	},
	'jer': {
		index: 24
	},
	'lam': {
		index: 25
	},
	'ezk': {
		index: 26
	},
	'dan': {
		index: 27
	},
	'hos': {
		index: 28
	},
	'jol': {
		index: 29
	},
	'amo': {
		index: 30
	},
	'oba': {
		index: 31
	},
	'jon': {
		index: 32
	},
	'mic': {
		index: 33
	},
	'nam': {
		index: 34
	},
	'hab': {
		index: 35
	},
	'zep': {
		index: 36
	},
	'hag': {
		index: 37
	},
	'zec': {
		index: 38
	},
	'mal': {
		index: 39
	},
	'mat': {
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
	'mrk': {
		index: 41
	},
	'luk': {
		index: 42
	},
	'jhn': {
		index: 43
	},
	'act': {
		index: 44
	},
	'rom': {
		index: 45
	},
	'1co': {
		index: 46
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
  },
	'gal': {
		index: 48
	},
	'eph': {
		index: 49
	},
	'php': {
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
	'col': {
		index: 51
	},
	'1th': {
		index: 52
	},
	'2th': {
		index: 53
	},
	'1ti': {
		index: 54
	},
	'2ti': {
		index: 55
	},
	'tit': {
		index: 56
	},
	'phm': {
		index: 57
	},
	'heb': {
		index: 58
	},
	'jas': {
		index: 59
	},
	'1pe': {
		index: 60
	},
	'2pe': {
		index: 61
	},
	'1jn': {
		index: 62
	},
	'2jn': {
		index: 63
	},
	'3jn': {
		index: 64
	},
	'jud': {
		index: 65
	},
	'rev': {
		index: 66
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

