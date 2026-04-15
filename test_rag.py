
import sys
import os
sys.path.append(os.getcwd())
from ui_agent.ui_rag.vector_store import get_store
import json

store = get_store()
results = store.search("ecommerce professional PUMA shoe", k=5)
print(json.dumps(results, indent=2))
