lunr.QueryLexer = function (str) {
  this.lexemes = []
  this.str = str
  this.length = str.length
  // current cursor position
  this.pos = 0
  // last striped position
  this.start = 0
  this.escapeCharPositions = []
}

lunr.QueryLexer.prototype.run = function () {
  var state = lunr.QueryLexer.lexText

  while (state) {
    state = state(this)
  }
}

lunr.QueryLexer.prototype.sliceString = function () {
  var subSlices = [],
      sliceStart = this.start,
      sliceEnd = this.pos

  for (var i = 0; i < this.escapeCharPositions.length; i++) {
    sliceEnd = this.escapeCharPositions[i]
    subSlices.push(this.str.slice(sliceStart, sliceEnd))
    sliceStart = sliceEnd + 1
  }

  subSlices.push(this.str.slice(sliceStart, this.pos))
  this.escapeCharPositions.length = 0

  return subSlices.join('')
}

lunr.QueryLexer.prototype.emit = function (type) {
  this.lexemes.push({
    type: type,
    str: this.sliceString(),
    start: this.start,
    end: this.pos
  })

  this.start = this.pos
}

// escape char only has one char it seems
lunr.QueryLexer.prototype.escapeCharacter = function () {
  // remember the first / index
  this.escapeCharPositions.push(this.pos - 1)
  this.pos += 1
}

// return next char if has one
lunr.QueryLexer.prototype.next = function () {
  if (this.pos >= this.length) {
    return lunr.QueryLexer.EOS
  }

  var char = this.str.charAt(this.pos)
  this.pos += 1
  return char
}

// distance between pos & start
lunr.QueryLexer.prototype.width = function () {
  return this.pos - this.start
}

lunr.QueryLexer.prototype.ignore = function () {
  // just emited, if pos not add by 1, it will have no effect if emit just been made.
  if (this.start == this.pos) {
    this.pos += 1
  }

  this.start = this.pos
}

lunr.QueryLexer.prototype.backup = function () {
  this.pos -= 1
}

// move cursor out of span of number section
lunr.QueryLexer.prototype.acceptDigitRun = function () {
  var char, charCode

  do {
    char = this.next()
    charCode = char.charCodeAt(0)
    // only number: http://www.asciitable.com/
  } while (charCode > 47 && charCode < 58)

  if (char != lunr.QueryLexer.EOS) {
    // when loop ends, the cursor(this.pos) will point to, b
    // so it need a backoff
    // 0000abc
    // -----^
    this.backup()
  }
}

// has more
lunr.QueryLexer.prototype.more = function () {
  return this.pos < this.length
}

// end of file
lunr.QueryLexer.EOS = 'EOS'

lunr.QueryLexer.FIELD = 'FIELD'
lunr.QueryLexer.TERM = 'TERM'
lunr.QueryLexer.EDIT_DISTANCE = 'EDIT_DISTANCE'
// boost
lunr.QueryLexer.BOOST = 'BOOST'
// minus & plus
lunr.QueryLexer.PRESENCE = 'PRESENCE'

// parse field which starts with `:`
lunr.QueryLexer.lexField = function (lexer) {
  // move position cursor on to that `:` char

  // cursor point to
  // name:text
  // -----^
  lexer.backup()
  // name:text
  // ----^

  // slice string util to `:` char position
  lexer.emit(lunr.QueryLexer.FIELD)
  // move position cursor one step after the `:` char
  lexer.ignore()
  // continue to parse
  return lunr.QueryLexer.lexText
}

// parse out seperator
lunr.QueryLexer.lexTerm = function (lexer) {
  if (lexer.width() > 1) {

    //:todo
    // name of
    // -----^
    //
    // this is where cursor is at, so it need backoff by one
    //
    lexer.backup()
    lexer.emit(lunr.QueryLexer.TERM)
    // name of
    // ----^
  }

  // skip this sep
  lexer.ignore()
  // name of
  // -----^

  if (lexer.more()) {
    return lunr.QueryLexer.lexText
  }
}

lunr.QueryLexer.lexEditDistance = function (lexer) {
  lexer.ignore()
  lexer.acceptDigitRun()
  lexer.emit(lunr.QueryLexer.EDIT_DISTANCE)
  return lunr.QueryLexer.lexText
}

lunr.QueryLexer.lexBoost = function (lexer) {
  lexer.ignore()
  lexer.acceptDigitRun()
  lexer.emit(lunr.QueryLexer.BOOST)
  return lunr.QueryLexer.lexText
}

lunr.QueryLexer.lexEOS = function (lexer) {
  if (lexer.width() > 0) {
    lexer.emit(lunr.QueryLexer.TERM)
  }
}

// This matches the separator used when tokenising fields
// within a document. These should match otherwise it is
// not possible to search for some tokens within a document.
//
// It is possible for the user to change the separator on the
// tokenizer so it _might_ clash with any other of the special
// characters already used within the search string, e.g. :.
//
// This means that it is possible to change the separator in
// such a way that makes some words unsearchable using a search
// string.
lunr.QueryLexer.termSeparator = lunr.tokenizer.separator

lunr.QueryLexer.lexText = function (lexer) {
  while (true) {
    var char = lexer.next()

    if (char == lunr.QueryLexer.EOS) {
      return lunr.QueryLexer.lexEOS
    }

    // Escape character is '\'
    if (char.charCodeAt(0) == 92) {
      lexer.escapeCharacter()
      continue
    }

    if (char == ":") {
      return lunr.QueryLexer.lexField
    }

    if (char == "~") {
      lexer.backup()
      if (lexer.width() > 0) {
        lexer.emit(lunr.QueryLexer.TERM)
      }
      return lunr.QueryLexer.lexEditDistance
    }

    if (char == "^") {
      lexer.backup()
      if (lexer.width() > 0) {
        lexer.emit(lunr.QueryLexer.TERM)
      }
      return lunr.QueryLexer.lexBoost
    }

    // "+" indicates term presence is required
    // checking for length to ensure that only
    // leading "+" are considered
    if (char == "+" && lexer.width() === 1) {
      lexer.emit(lunr.QueryLexer.PRESENCE)
      return lunr.QueryLexer.lexText
    }

    // "-" indicates term presence is prohibited
    // checking for length to ensure that only
    // leading "-" are considered
    if (char == "-" && lexer.width() === 1) {
      lexer.emit(lunr.QueryLexer.PRESENCE)
      return lunr.QueryLexer.lexText
    }

    if (char.match(lunr.QueryLexer.termSeparator)) {
      // we got clear sign that cursor hits next term
      return lunr.QueryLexer.lexTerm
    }
  }
}

