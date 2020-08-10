In this directory, we are connecting bullet point-styled data facts into a paragraph.

### Requirements

The codebase requires [`spacy`](https://spacy.io/), [`tagme`](https://github.com/marcocor/tagme-python), and [`Wikipedia-API`](https://pypi.org/project/Wikipedia-API/) installation.

Please install through 

    pip install -r requirements.txt
    

Once finished, you may test installations with below codes. (We appreciate you report an issue to us!)

    import wikipediaapi
    import tagme
    import spacy
    from spacy.tokenizer import Tokenizer
    from spacy.lang.en import English
    
    nlp = English()
    # Create a blank Tokenizer with just the English vocab
    tokenizer = Tokenizer(nlp.vocab)


### Directory Structure

There is the `code/` and `data` directories. 

Inside `code/`, `rewrite-pipeline.py` is the service to convert a set of data facts in `.json` to a paragraph.

There are four tasks in the pipeline: 
1. Replacing templated language in single data facts
2. Sequencing the top-k data facts based on their mutual relationship
3. Stitching the sequence (deduplicate words)
4. Making it more comic/intelligent

Inside [`data/`](https://github.com/xeniaqian94/chartStories/tree/master/rewrite-python-service/data), there are seven examples of bulleted data facts, each named as `datafactX.json`. 
The rewritten outputs are named correspondingly as `datafactX-rewrite.json`. 
