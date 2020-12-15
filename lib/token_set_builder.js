lunr.TokenSet.Builder = function () {
  this.previousWord = ""
  this.root = new lunr.TokenSet
  this.uncheckedNodes = []
  this.minimizedNodes = {}
}

lunr.TokenSet.Builder.prototype.insert = function (word) {
  var node,
      commonPrefix = 0

  // word has to be inserted in order?
  // yes, to maintain max space efficency
  if (word < this.previousWord) {
    throw new Error ("Out of order word insertion")
  }

  for (var i = 0; i < word.length && i < this.previousWord.length; i++) {
    if (word[i] != this.previousWord[i]) break
    commonPrefix++
  }


  // abcd
  //^ commonPrefix = 0 
  // uncheckedNodes = []
  // after loop
  // uncheckedNodes = [a, b, c, d]
  // then new entry is been added
  // abcd
  // abde
  // --^ commonPrefix
  // uncheckedNodes = [a, b, c, d]
  // after minimize
  // uncheckedNodes = [a, b]
  // after loop
  // uncheckedNodes = [a, b, d, e]
  //
  // then new entry added
  // abde
  // abce
  // --^ commonPrefix
  this.minimize(commonPrefix)

  if (this.uncheckedNodes.length == 0) {
    node = this.root
  } else {
    // remember last branch diverage
    node = this.uncheckedNodes[this.uncheckedNodes.length - 1].child
  }

  for (var i = commonPrefix; i < word.length; i++) {
    var nextNode = new lunr.TokenSet,
        char = word[i]

    node.edges[char] = nextNode

    this.uncheckedNodes.push({
      parent: node,
      char: char,
      child: nextNode
    })

    node = nextNode
  }

  node.final = true
  this.previousWord = word
}

lunr.TokenSet.Builder.prototype.finish = function () {
  this.minimize(0)
}

lunr.TokenSet.Builder.prototype.minimize = function (downTo) {
  for (var i = this.uncheckedNodes.length - 1; i >= downTo; i--) {
    var node = this.uncheckedNodes[i],
        childKey = node.child.toString()

    if (childKey in this.minimizedNodes) {
      node.parent.edges[node.char] = this.minimizedNodes[childKey]
    } else {
      // Cache the key for this node since
      // we know it can't change anymore
      node.child._str = childKey

      this.minimizedNodes[childKey] = node.child
    }

    this.uncheckedNodes.pop()
  }
}
