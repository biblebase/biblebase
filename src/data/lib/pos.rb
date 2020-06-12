require 'pry'

class Pos
  attr_reader :desc

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
    proper: '專有名詞',
    pror: '關係代詞'
  }

  TENSES = {
    p: '現在時',
    i: '未完成時',
    f: '將來時',
    a: '不定過去時',
    r: '完成時',
    l: '過去完成時',

    imp: '祈使語氣',
    prtcpl: '分詞',
    qalpassparticiple: '過去分詞',

    perf: '完成時',
    imperf: '未完成時',
    conjperf: '連接完成時',
    conjimperf: '連接未完成時',
    consecimperf: '連續未完成時'
  }

  VOICES = {
    a: '主動語態',
    m: '中間語態',
    p: '被動語態',
    'm/p': '中間或被動語態'
  }

  CASES = {
    n: '主格',
    v: '呼格',
    a: '賓格',
    g: '屬格',
    d: '與格'
  }

  COMPARISONS = {
    c: '比較級',
    s: '最高級'
  }

  MOODS = {
    i: '陳述語氣',
    m: '祈使語氣',
    s: '虛擬語氣',
    o: '祈願語氣',
    n: '不定式',
    p: '分詞'
  }

  GENDERS = {
    m: '陽性',
    f: '陰性',
    n: '中性',
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
    @parts = parse(lang)
  end

  # NOTE e.g
  # [
  #   '名詞',
  #   '陽性,第二人稱,單數'
  #   '連接詞|冠詞'
  # ]
  def to_display
    return [] if @parts.empty?
    main_part, *rest_parts = @parts

    [
      # e.g '名詞'
      Pos.display_pos(main_part[:pos]),

      # e.g. '陽性,第二人稱,單數'
      main_part.each_with_object([]) do |(k, v), arr|
        arr.push PERSONS[v.to_sym] if k == :person
        arr.push NUMBERS[v.to_sym] if k == :number
        arr.push GENDERS[v.to_sym] if k == :gender
        # arr.push STATES[v.to_sym]  if k == :state
        arr.push TENSES[v.to_sym]  if k == :tense
        arr.push MOODS[v.to_sym]  if k == :mood
        arr.push CASES[v.to_sym]  if k == :case
        arr.push VOICES[v.to_sym]  if k == :voice
        arr.push COMPARISONS[v.to_sym]  if k == :comparison
      end.join(','),

      # e.g. '連接詞|冠詞'
      rest_parts.map do |part|
        Pos.display_pos(part[:pos])
      end.join('|')
    ]
  end

  def main
    (@parts.first || {})[:pos]
  end

  def main_pos
    Pos.display_pos(main)
  end

  def self.display_pos(pos)
    pos ?  PARTS_OF_SPEECH[pos.to_sym] : ''
  end

  private

  # NOTE return an array, e.g.
  # [{
  #   pos: 'n',
  #   person: '2',
  #   gender: 'm',
  #   number: 's'
  # }, {
  #   pos: 'art'
  # }]
  def parse(lang)
    lang == 'hebrew' ? parse_hebrew : parse_greek
  end

  def parse_hebrew
    @desc.split('|').reverse.map(&:strip).map(&:downcase).map do |part_desc|
      part_desc = part_desc.sub(/^pro-r$/, 'pror')
      pos, ext1, ext2, ext3 = part_desc.split('‑')
      if pos == 'n' && ext1 == 'proper'
        pos = 'proper'
        ext1 = ext2
      end

      part = { pos: pos }

      if pos == 'v'
        part.merge!(tense: ext2)
        ext1 = ext3
      end

      ext1.to_s.split('').each do |char|
        part.merge!(person: char) if PERSONS[char.to_sym]
        part.merge!(number: char) if NUMBERS[char.to_sym]
        part.merge!(gender: char) if GENDERS[char.to_sym]
        # part.merge!(state:  char) if STATES[char.to_sym]
      end

      part
    end
  end

  def parse_greek
    pos, ext1, ext2 = @desc.split('-').map(&:downcase)
    part = { pos: pos }

    case pos
    when 'n', 'art', 'ipro'
      part.merge! ext_to_hash(ext1, :case, :gender, :number)
    when 'ppro'
      if ext1 && ext1.size == 3
        part.merge! ext_to_hash(ext1, :case, :person, :number)
      end
      if ext1 && ext1.size == 4
        part.merge! ext_to_hash(ext1, :case, :gender, :person, :number)
      end
    when 'adj'
      part.merge! ext_to_hash(ext1, :case, :gender, :number)
      part.merge! ext_to_hash(ext2, :comparison)
    when 'v'
      part.merge! ext_to_hash(ext1, :tense, :mood, :voice)

      if ext2 && ext2.size == 2
        part.merge! ext_to_hash(ext2, :person, :number)
      end
      if ext2 && ext2.size == 3
        part.merge! ext_to_hash(ext2, :case, :_, :number)
      end
    end

    [ part ]
  end

  def ext_to_hash(ext, *keys)
    return {} if ext.nil? or ext.empty?
    values = ext.split('')
    values[keys.size - 1] = values[(keys.size - 1)..-1].join if values.size > keys.size

    keys.each_with_object({}).with_index do |(key, h), idx|
      h[key] = values[idx] if key != :_ and values[idx] and values[idx].size > 0
    end
  end
end
