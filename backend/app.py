from flask import Flask, jsonify
from flask_cors import CORS  # ✅ Import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # ✅ Enables CORS for all routes

@app.route("/api/designers", methods=["GET"])
def get_designers():
    json_path = os.path.join(os.path.dirname(__file__), "data", "designers.json")
    with open(json_path, "r") as file:
        data = json.load(file)
    return jsonify(data)

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)

