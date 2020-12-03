
## dir overview


```
lib
├── builder.js                    # a builder build search indexes, td, idf, 
├── field_ref.js                  # -
├── idf.js                        # a tf-idf implementation
├── index.js
├── lunr.js                       # export entry
├── match_data.js                 # - 
├── pipeline.js                   # process term in pipeline
├── query.js                      # -
├── query_lexer.js                # parse string into set of tokens
├── query_parse_error.js          # parser error
├── query_parser.js               # query parser that parse tokens
├── set.js                        # a custom set
├── stemmer.js                    # set implementation
├── stop_word_filter.js           # stop word filter
├── token.js                      # represent a word token
├── token_set.js                  #! trie data structure, define how a term matchs with each other, fromFuzzyString is a very important method
├── token_set_builder.js
├── tokenizer.js                  # create token
├── trimmer.js                    # trim token
├── utils.js                      # utils
└── vector.js                     # vector to cacl similarity
```
