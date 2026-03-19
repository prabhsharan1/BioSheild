import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# --- BioShield Firebase Python Integration Demo ---
# This script demonstrates how to connect to the BioShield Firestore 
# database using Python, ideal for data science or remote sensor integration.

def initialize_bioshield():
    # TODO: Download your service account key from Firebase Console
    # Settings -> Service Accounts -> Generate New Private Key
    try:
        cred = credentials.Certificate('path/to/serviceAccountKey.json')
        firebase_admin.initialize_app(cred)
        
        db = firestore.client()
        print("✅ BioShield Firebase Initialized")
        return db
    except Exception as e:
        print(f"❌ Initialization failed: {e}")
        return None

def get_zone_risk(db, zone_id):
    """Fetch real-time risk data for a specific greenhouse zone."""
    if not db: return
    
    doc_ref = db.collection('zones').document(zone_id)
    doc = doc_ref.get()
    
    if doc.exists:
        data = doc.to_dict()
        print(f"📊 Zone {zone_id} Status: {data.get('risk', 'Unknown')}")
        print(f"🌡️ Temperature: {data.get('temp')}°C")
    else:
        print("❓ Zone not found")

if __name__ == "__main__":
    # Example Usage
    # bios_db = initialize_bioshield()
    # get_zone_risk(bios_db, 'C')
    print("🚀 BioShield Python Demo Ready. Configure serviceAccountKey.json to run.")
