import spacy
from typing import Dict, Any
from backend.models import ExtractedEntity
from backend.ontology import knowledge_graph

class SpacyExtractor:
    def __init__(self):
        # Load German language model
        self.nlp = spacy.load("de_core_news_lg")

    def extract_entities(self, text: str) -> ExtractedEntity:
        """
        Extracts action, object, and location from free text.
        This is a simplified extraction logic mapping verbs/nouns.
        """
        doc = self.nlp(text)
        action = "Unknown_Action"
        obj = "Unknown_Object"
        location = "Unknown_Location"

        for token in doc:
            if token.pos_ == "VERB":
                action = token.lemma_
            elif token.pos_ == "NOUN":
                # Very basic heuristic for location vs object based on context (prepositions)
                if token.head.pos_ == "ADP" and token.head.lemma_ in ["in", "an", "auf"]:
                    location = token.lemma_
                elif obj == "Unknown_Object":
                     obj = token.lemma_

        # Use ontology to map synonyms to formal concepts
        mapped_action = knowledge_graph.map_synonym(action)
        if mapped_action != "Unknown":
            action = mapped_action

        mapped_obj = knowledge_graph.map_synonym(obj)
        if mapped_obj != "Unknown":
             obj = mapped_obj

        return ExtractedEntity(action=action, object=obj, location=location)

nlp_engine = SpacyExtractor()
