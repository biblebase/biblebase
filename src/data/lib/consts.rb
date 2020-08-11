require 'pry'
require 'yaml'
require 'ruby-progressbar'
require_relative 'monkey_patches'

$CHINESE_NUMBERS = "一二三四五六七八九十廿"
$CHINESE_PUNCT = /[，。：“”‘’；「」『 』？！]/

$GREEK_TRANSLITERATES = {
  "α" => "άὰᾶἀἁἄἂἆἅἃἇᾳᾴᾲᾷᾀᾁᾄᾂᾆᾅᾃᾇ",
  "ε" => "έὲἐἑἔἒἕἓ",
  "η" => "ήὴῆἠἡἤἢἦἥἣἧῃῄῂῇᾐᾑᾔᾒᾖᾕᾓᾗ",
  "ι" => "ίὶῖἰἱἴἲἶἵἳἷ",
  "ο" => "όὸὀὁὄὂὅὃ",
  "υ" => "ύὺῦὐὑὔὒὖὕὓὗ",
  "ω" => "ώὼῶὠὡὤὢὦὥὣὧῳῴῲῷᾠᾡᾤᾢᾦᾥᾣᾧ",
  "ρ" => "ῤῥ"
}.each_with_object(["", ""]) do |(vowel, with_accents), map|
  map[0] += with_accents
  map[1] += vowel * with_accents.size
end

$BOOKS = YAML.load_file(File.dirname(__FILE__) +  '/books.yml')
$BOOK_LOOKUP = $BOOKS.each_with_object({}) do |kv, ret|
  key, book = kv
  (book[:full_name] || []).each do |lang, v|
    ret[v] = key
    ret[v.downcase] = key
    ret[v.downcase.snake_case] = key
    ret[v.downcase.kabab_case] = key
    ret[v.downcase.gsub(/\s+/,'')] = key
  end
  (book[:short_name] || []).each do |lang, v|
    ret[v] = key
    ret[v.downcase] = key
    ret[v.downcase.snake_case] = key
    ret[v.downcase.kabab_case] = key
  end
  ret["index_#{book[:index]}"] = key
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
  cunp: {
    version_id: 'CUNP',
    version_name: '和合本新標點（神版）',
    lang: 'cht',
    bible_com_index: 46
  },
  cnv: {
    version_id: 'CNV',
    version_name: '新譯本',
    lang: 'cht',
    bible_com_index: 40
  },
  ccb: {
    version_id: 'CCB',
    version_name: '圣经当代译本',
    lang: 'chs',
    bible_com_index: 36
  },
  niv: {
    version_id: 'NIV',
    version_name: 'New International Version',
    lang: 'en',
    bible_com_index: 111
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

# functions
require 'lemmatizer'
require 'stemmify'
$STOP_WORDS = %w[
  i we you it he she they us me him her
  my our your his their mine them
  myself themselves yourself yourselves himself herself
  be is are was were am been being
  will should shall might would can could may
  do did does
  have has having had let begin
  to from in for out at to of on up over down
  away with among against after by through
  within along besides between all under into
  before unto during
  because as but however therefore though then yet
  when while what why whatever which there who whom
  a an the any not o oh
  and s so this that these those also than or
  never man own now day indeed even
  things every anyone everyone if new
  - ‘
]
$lem = Lemmatizer.new

$STATS_BY_POS = %w[proper n v adj adv heb aram]
def get_main_pos(pos)
  pos.to_s.split(' | ')
    .map{|k| k.downcase.split(/[^0-9a-z]/).first}
    .sort_by{|k| $STATS_BY_POS.include?(k) ? 0 : 1 }
    .first
end

def stem(word)
  main_word = word.gsub(/\[.+\]/, '').strip
  words = main_word.downcase.split(/[\s'’]+/)
  (words - $STOP_WORDS)
    .map{ |w| $lem.lemma(w).stem }
    .join(' ')
end

$TRAILING_PUNC = /[-\.;:,!']$/
def stemmed_parts(word)
  main_word = word.gsub(/\[.+\]/, '').strip
  words = main_word.downcase
    .gsub(/['’]s/, '')
    .sub($TRAILING_PUNC, '')
    .split
  (words - $STOP_WORDS)
    .map{ |w| w = $lem.lemma(w) }
end

#NOTE formatter
$NBSP = "\u00A0"
$SP_RE = /[\s\u00A0\u3000\uE013]/

def verse_path(verse_key)
  bk,c,v = verse_key.split('.')
  b = $BOOKS.dig(bk.downcase.to_sym, :index)
  [b,c,v].join('/')
end

def verse_url(verse_key)
  "/##{verse_path(verse_key)}"
end

def verse_desc(verse_key, desc_mode=:full)
  VerseBundle.new(verse_key).to_s(desc_mode)
end

def verse_link(html_builder, verse_key, desc_mode=:full)
  html_builder.a(class: :verseLink, href: verse_url(verse_key)) do
    html_builder.text! verse_desc(verse_key, desc_mode)
  end
end
