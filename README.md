# spidergirl

## Need to build an indexer

- maybe a job every x hours that looks at our db and indexes whats in there
- create documents with the data in it
- when we create that doc, update the postings list. update the inverted index.

- set up what we fields we want to idnex, and what types
- so we need our schema to index according to. define that, then if its a number we can coerce to a number. or if its a URL we can combine fields.

- gotta figure out how to do ranking as well :)

# Tokenizer

- Pretty dumb atm, not taking into consideration semantics, or h1 h2 etc. but it's ok for now :)
