import requests
import json
import os

API_BASE = "http://localhost:8000"

def test_auth_flux():
    print("--- 🛡️ Testing IDENTITY_VAULT API ---")
    
    # 1. Check current status
    print("[1] Querying /api/auth/status...")
    try:
        res = requests.get(f"{API_BASE}/api/auth/status")
        if res.ok:
            print(f"    Current Status: {json.dumps(res.json(), indent=2)}")
        else:
            print(f"    Error: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"    Connection Error: {e}")
        return

    # 2. Check OpenCode Login 
    # Note: This will actually modify your auth.json if you run it on a real server
    dummy_key = "58c3814372c9404fbdf9b07210d6be34.qy4TgP6UwsN40q_gXTaQbW-V" # From your capture
    print(f"\n[2] Testing OpenCode credential injection...")
    res = requests.post(f"{API_BASE}/api/auth/opencode/login", json={"key": dummy_key})
    if res.ok:
        print("    ✅ Success: Credentials injected into auth.json")
    else:
        print(f"    ❌ Error: {res.text}")

    # 3. Verify status update
    print("\n[3] Verifying status update...")
    res = requests.get(f"{API_BASE}/api/auth/status")
    status = res.json()
    if status["opencode"]["signed_in"]:
        print(f"    ✅ Status confirmed: Connected to {status['opencode']['provider']}")
    else:
        print("    ❌ Status check failed.")

    # 4. Ollama Signout test
    print("\n[4] Testing Ollama Signout...")
    res = requests.post(f"{API_BASE}/api/auth/ollama/signout")
    if res.ok:
        print("    ✅ Success: Signout command sent")
    else:
        print(f"    ❌ Error: {res.text}")

if __name__ == "__main__":
    test_auth_flux()
