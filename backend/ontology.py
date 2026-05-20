import json
from typing import Dict, Any, List

class SemanticKnowledgeGraph:
    def __init__(self):
        # Basis-Ontologie für VOB/B und VOB/C
        self.nodes = {
            "Gefahrstoff": {
                "TRGS519_Zertifikat": True,
                "hasMinimumCost": 150.0,  # EUR/m2
                "description": "Hazardous material requiring special handling",
                "synonyms": ["asbest", "eternit", "faserzement"]
            },
            "Abbruch": {
                "requires_material_check": True,
                "synonyms": ["abreißen", "demontieren", "entfernen", "rückbau"]
            },
            "Ziegel": {
                "is_hazardous": False,
                "synonyms": ["mauerwerk", "klinker", "backstein"]
            },
            "Wand": {
                "possible_materials": ["Ziegel", "Gefahrstoff"],
                "synonyms": ["mauer", "trennwand"]
            }
        }

    def map_synonym(self, word: str) -> str:
        """Maps a given word to its official ontology node name based on synonyms."""
        word_lower = word.lower()
        for node_name, properties in self.nodes.items():
            if word_lower in properties.get("synonyms", []):
                return node_name
            if word_lower == node_name.lower():
                return node_name
        return "Unknown"

    def get_node_properties(self, node_name: str) -> Dict[str, Any]:
        return self.nodes.get(node_name, {})

knowledge_graph = SemanticKnowledgeGraph()
