from flask import Flask, render_template, request, jsonify, send_from_directory
import pandas as pd
import os

app = Flask(__name__)

# Load doctor information from an Excel file
doctor_data = pd.read_excel('doctor_info.xlsx',header=1)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search_doctor():
    query = request.form.get('doctor_name', '').lower()
    print(doctor_data)
    result = doctor_data[doctor_data['name'].str.lower().str.contains(query)]

    if not result.empty:
        doctor = result.iloc[0].to_dict()  # Get the first matching doctor
        doc_id = doctor['id']
        # Convert schedule from Excel format (if applicable)
        schedule = eval(doctor['schedule']) if 'schedule' in doctor else []

        return jsonify({
            'doctor': doctor,
            'schedule': schedule
        })
    else:
        return jsonify({'error': 'Doctor not found'})

@app.route('/images/<filename>')
def images(filename):
    return send_from_directory('images', filename)

# if __name__ == '__main__':
#     app.run(debug=True)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # Default to 5000 if PORT is not set
    app.run(host='0.0.0.0', port=port)