require 'pry'
require 'yaml'
require 'progress_bar'

$CHINESE_NUMBERS = "一二三四五六七八九十廿"

$BOOKS = YAML.load_file(File.dirname(__FILE__) +  '/books.yml')
$BOOK_LOOKUP = $BOOKS.each_with_object({}) do |kv, ret|
  key, book = kv
  (book[:full_name] || []).each do |lang, v|
    ret[v] = key
  end
  (book[:short_name] || []).each do |lang, v|
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

# monkey patches
class Hash
  def compact
    self.each_with_object({}) do |kv, h|
      k,v = kv
      h[k] = v if v
    end
  end
end

class Array
  def compact_join
    if self.any?{|item| not item.nil? and item.size > 0}
      self.join
    else
      nil
    end
  end
end

# functions
require 'lemmatizer'
require 'stemmify'
$STOP_WORDS = %w[
  i we you it he she they us me him her
  my our your his their mine them
  myself themselves yourself yourselves himself herself
  be is are was were am been being
  will should shall might
  do did does
  have has having let
  to from in for out at to of on up
  away with among against after by through
  within along besides between all under into
  before unto during
  because as but however therefore though then
  when while what why whatever which there who whom
  a an the any not
  and s so this that these those also than or
  never man own now day indeed even
  things every anyone everyone if new
  -
  lord savior jesus christ god
  glory beloved holy spirit grace heaven heavens
]
$lem = Lemmatizer.new
def stem(word)
  main_word = word.gsub(/\[.+\]/, '').strip
  words = main_word.downcase.split(/[\s'’]+/)
  (words - $STOP_WORDS)
    .map{|w| $lem.lemma(w).stem}
    .join(' ')
end
