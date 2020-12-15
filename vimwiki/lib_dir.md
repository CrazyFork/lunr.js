
## dir overview

d      // be done with



```
lib
├── builder.js                    d# !a builder builds index(tf-idf, invertedIndex, score, vector) for a specified docset
├── field_ref.js                  d# a tuple of (field, docRef, string)
├── idf.js                        d# a tf-idf implementation 
├── index.js                      d# ! this is the main entry for query underlying index data
├── lunr.js                       d# export entry
├── match_data.js                 d# match data, info about how term is matched, with what score
├── pipeline.js                   d# process term in pipeline, each pipeline using output of previous pipeline as input.
├── query.js                      d# represent a complete query, that parsed out of query string
├── query_lexer.js                d# parse string into set of meaningful tokens
├── query_parse_error.js          d# query parser error
├── query_parser.js               d# parse lexers into clauses
├── set.js                        d# a custom set
├── stemmer.js                    d# transform word to its basic form
├── stop_word_filter.js           d# stop word filter
├── token.js                      d# a token is a string with some meta data inside
├── token_set.js                  d# ! trie data structure, define how a term matchs with each other and process of how query term is reverse into terms in the original index, fromFuzzyString is a very important method
├── token_set_builder.js          d# ! i dont know why the author has to write a trie in this way. I dont see any advantage building a trie in this complicated way. maybe I just being stupid.
├── tokenizer.js                  d# create token outof a stringable object.
├── trimmer.js                    d# remove spaces on string's both end
├── utils.js                      d# utils
└── vector.js                     d# specially designed vector structure that is used for calculate similarity
```
