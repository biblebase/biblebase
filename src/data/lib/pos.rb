require 'pry'

class Pos
  PARTS_OF_SPEECH = {
    n: '名詞',
    v: '動詞',
    adj: '形容詞',
    adv: '副詞',
    art: '冠詞',
    dpro: '指示代詞',
    ipro: '不定代詞',
    ppro: '人稱代詞',
    recpro: '相互代詞',
    relpro: '關係代詞',
    refpro: '反身代詞',
    prep: '介詞',
    conj: '連接詞',
    i: '感嘆詞',
    prtcl: '量詞',
    heb: '希伯來語詞彙',
    aram: '亞蘭語詞彙',
    number: '數詞',
    punc: '標點',
    pror: '關係代詞'
  }

  TENSES = {
    perf: '完成式',
    imperf: '未完成式',
    conjperf: '連接完成式',
    conjimperf: '連接未完成式',
    consecimperf: '連續未完成式'
  }

  GENDERS = {
    m: '陽性',
    f: '陰性',
    c: '通用性別'
  }

  NUMBERS = {
    s: '單數',
    p: '複數',
    d: '雙數'
  }

  STATES = {
    c: '構造狀態',
    d: '確定狀態'
  }

  PERSONS = {
    '1': '第一人稱',
    '2': '第二人稱',
    '3': '第三人稱'
  }

  def initialize(desc, lang='hebrew')
    @desc = desc
    @parts = lang == 'hebrew' ? parse_hebrew : parse_greek
  end

  # NOTE e.g
  # [
  #   '名詞',
  #   '陽性,第二人稱,單數'
  #   '連接詞|冠詞'
  # ]
  def to_display
    main_part, *rest_parts = @parts
    [
      # e.g '名詞'
      display_pos(main_part[:pos]),

      # e.g. '陽性,第二人稱,單數'
      main_part.each_with_object([]) do |(k, v), arr|
        arr.push PERSONS[v.to_sym] if k == :person
        arr.push NUMBERS[v.to_sym] if k == :number
        arr.push GENDERS[v.to_sym] if k == :gender
        arr.push STATES[v.to_sym]  if k == :state
        arr.push TENSES[v.to_sym]  if k == :tense
      end.join(','),

      # e.g. '連接詞|冠詞'
      rest_parts.map do |part|
        display_pos(part[:pos])
      end.join('|')
    ]
  end

  def main
    @parts.first[:pos]
  end

  private

  def display_pos(pos)
    PARTS_OF_SPEECH[pos.to_sym].to_s
  end

  # NOTE return an array, e.g.
  # [{
  #   pos: 'n',
  #   person: '2',
  #   gender: 'm',
  #   number: 's'
  # }, {
  #   pos: 'art'
  # }]
  def parse_hebrew
    @desc.split('|').reverse.map(&:strip).map(&:downcase).map do |part_desc|
      part_desc = part_desc.sub(/^pro-r$/, 'pror')
      pos, ext1, ext2, ext3 = part_desc.split('‑')
      part = { pos: pos }

      if pos == 'v'
        part.merge!(tense: ext2)
        ext1 = ext3
      end

      ext1.to_s.split('').each do |char|
        part.merge!(person: char) if PERSONS[char.to_sym]
        part.merge!(number: char) if NUMBERS[char.to_sym]
        part.merge!(gender: char) if GENDERS[char.to_sym]
        part.merge!(state:  char) if STATES[char.to_sym]
      end

      part
    end
  end

  def parse_greek
  end
end
