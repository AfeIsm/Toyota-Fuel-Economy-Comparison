import firebase_admin
from firebase_admin import credentials, firestore
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

# Initialize Firebase
cred = credentials.Certificate('hackutd-ripple-effect-firebase-adminsdk-wc2ty-f0e94bbdf5.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# Define car models to analyze
models = [
    'Toyota Camry LE-SE',
    'Toyota Camry XLE-XSE',
    'Toyota Corolla',
    'Toyota Prius',
    'Toyota Prius Prime',
    'Toyota RAV4 Hybrid',
    'Toyota RAV4 PRIME',
    'Toyota Sienna',
    'Toyota Venza',
    'Toyota Mirai Limited',
    'Toyota Mirai XLE'
]

# Create DataFrame to store all data
all_data = []

# Fetch data for each model
for model in models:
    try:
        docs = db.collection('cars').document(model).collection('years').stream()
        for doc in docs:
            data = doc.to_dict()
            city_mpg = data.get('cityMPG', 0)
            if city_mpg:
                all_data.append({
                    'model': model,
                    'year': int(doc.id),
                    'mpg': float(city_mpg)
                })
    except Exception as e:
        print(f"Error fetching data for {model}: {e}")

# Convert to DataFrame
df = pd.DataFrame(all_data)

# Create the plot
plt.figure(figsize=(15, 8))
sns.set_style("whitegrid")

# Create line plot
for model in models:
    model_data = df[df['model'] == model]
    if not model_data.empty:
        plt.plot(model_data['year'], model_data['mpg'], 
                marker='o', label=model, linewidth=2, markersize=6)

# Customize the plot
plt.title('City Fuel Efficiency Trends by Car Model (2000-2023)', fontsize=16, pad=20)
plt.xlabel('Year', fontsize=12)
plt.ylabel('City Miles Per Gallon (MPG)', fontsize=12)
plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left', fontsize=10)
plt.grid(True, alpha=0.3)

# Rotate x-axis labels for better readability
plt.xticks(rotation=45)

# Adjust layout to prevent label cutoff
plt.tight_layout()

# Save the plot
plt.savefig('car_mpg_trends.png', dpi=300, bbox_inches='tight')
plt.show()

# Print summary statistics
print("\nSummary Statistics:")
for model in models: 
    model_data = df[df['model'] == model]
    if not model_data.empty:
        avg_mpg = model_data['mpg'].mean()
        print(f"{model}: Average MPG = {avg_mpg:.1f}") 