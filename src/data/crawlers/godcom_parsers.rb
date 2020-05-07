require_relative '../lib/consts'
require_relative 'base'

class GodcomCrawler < Base
  FETCH_RULES = {
    fengsheng: -> (book_str, chapter) {
      "/#{book_str}%E4%B8%B0%E7%9B%9B%E7%94%9F%E5%91%BD%E7%A0%94%E8%AF%BB%E6%9C%AC/#{book_str}JT#{ chapter}.htm"
    },
    chenzhongdao: -> (book_str, chapter) { "/#{book_str}JT#{chapter}.htm" },
    matangna: -> (book_str, chapter) {
      book_str.to_i < 40 ?
        "/%E9%A9%AC%E5%94%90%E7%BA%B3%E6%B3%A8%E9%87%8A/#{book_str}KT#{chapter}.htm" :
        "/#{book_str}FT#{chapter}.htm"
    },
    dde: -> (book_str, chapter) { "/#{book_str}DT#{chapter}.htm" },
    leili: -> (book_str, chapter) {
      "/#{book_str}%E9%9B%B7%E5%8E%86%E6%B3%A8%E9%87%8A/#{book_str}NT#{chapter}.htm"
    }
  }

  CLEAR_KEY = '<clear>'
  PARSERS = {
    fengsheng: [{ 
      pattern: /^(\d+):(\d+)$/,
      key_fn: -> (book, chapter, m) { "#{book}.#{chapter}.#{m[2]}" }
    }, {
      pattern: /^返回/,
      key_fn: -> (book, chapter, m) { CLEAR_KEY }
    }],
    chenzhongdao: [{
      pattern: /（(\d+):(\d+)(-\d+)?(.)?）$/,
      key_fn: -> (book, chapter, m) { "#{book}.#{chapter}.#{m[2]}#{m[3]}" }
    }, {
      pattern: /^问题讨论$/,
      key_fn: -> (book, chapter, m) { CLEAR_KEY }
    }, {
      pattern: /^返回/,
      key_fn: -> (book, chapter, m) { CLEAR_KEY }
    }, {
      pattern: /^(\d+)[上中下]?[^\.]/,
      key_fn: -> (book, chapter, m) { "#{book}.#{chapter}.#{m[1]}" }
    }, {
      pattern: /^(\d+)本节/,
      key_fn: -> (book, chapter, m) { "#{book}.#{chapter}.#{m[1]}" }
    }],
    matangna: [{
      pattern: /（([#{$CHINESE_NUMBERS}]+)(\d+)(～(\d+))?）$/,
      key_fn: -> (book, chapter, m) { "#{book}.#{chapter}.#{m[2]}#{ m[3] ? '-' + m[4].to_s : '' }" }
    }, {
      pattern: /^──《/,
      key_fn: -> (book, chapter, m) { CLEAR_KEY }
    }, {
      pattern: /^返回/,
      key_fn: -> (book, chapter, m) { CLEAR_KEY }
    }, {
      pattern: /^评注/,
      key_fn: -> (book, chapter, m) { CLEAR_KEY }
    }, {
      pattern: /^([#{$CHINESE_NUMBERS}]+)(\d+)([,，](\d+))?\D+/,
      key_fn: -> (book, chapter, m) { "#{book}.#{chapter}.#{m[2]}#{ m[3] ? '-' + m[4].to_s : '' }" }
    }],
    dde: [{
      pattern: /^(\d+)(～(\d+))?\./,
      key_fn: -> (book, chapter, m) { "#{book}.#{chapter}.#{m[1]}#{ m[2] ? '-' + m[3].to_s : '' }" }
    }, {
      pattern: /^增注：([#{$CHINESE_NUMBERS}]+)章(\d+)(～(\d+))?节$/,
      key_fn: -> (book, chapter, m) { CLEAR_KEY }
    }, {
      pattern: /^\d+\D+.+\d+页/,
      key_fn: -> (book, chapter, m) { CLEAR_KEY }
    }, {
      pattern: /^──《/,
      key_fn: -> (book, chapter, m) { CLEAR_KEY }
    }, {
      pattern: /^返回/,
      key_fn: -> (book, chapter, m) { CLEAR_KEY }
    }, {
      pattern: /（([#{$CHINESE_NUMBERS}]+)(\d+)(～(\d+))?）$/,
      key_fn: -> (book, chapter, m) { "#{book}.#{chapter}.#{m[2]}#{ m[3] ? '-' + m[4].to_s : '' }" }
    }],
    leili: [{
      pattern: /^返回/,
      key_fn: -> (book, chapter, m) { CLEAR_KEY }
    }, {
      pattern: /^([#{$CHINESE_NUMBERS}]+)(\d+)([～,，](\d+))?/,
      key_fn: -> (book, chapter, m) { "#{book}.#{chapter}.#{m[2]}#{ m[3] ? '-' + m[4].to_s : '' }" }
    }]
  }

  METADATA = {
    fengsheng: {
      title: "丰盛生命研读本"
    },
    chenzhongdao: {
      title: "新约书信读经讲义",
      author: "陈终道"
    },
    matangna: {
      title: "马唐纳注释",
      author: "马唐纳"
    },
    dde: {
      title: "丁道尔圣经注释",
      author: "丁道尔"
    },
    leili: {
      title: "雷历研读本圣经",
      author: "雷历"
    }
  }
end
