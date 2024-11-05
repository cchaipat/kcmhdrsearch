from flask import Flask, render_template, request, redirect, url_for, session, flash
import os
import pandas as pd
import json
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Replace with a secure key in production
app.config['UPLOAD_FOLDER'] = 'photos'
app.config['PROFILE_FOLDER'] = 'profiles'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}

# Ensure necessary folders exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['PROFILE_FOLDER'], exist_ok=True)

# Load CSV files at startup
users_df = pd.read_csv('data/users.csv')
departments_df = pd.read_csv('data/departments.csv')
specialties_df = pd.read_csv('data/specialties.csv')

# Load locations from CSV
locations_df = pd.read_csv('data/locations.csv')


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/authenticate', methods=['POST'])
def authenticate():
    username = request.form.get("username")
    password = request.form.get("password")
    user = users_df[(users_df['username'] == username) & (users_df['password'] == password)]
    if not user.empty:
        session['username'] = username
        session['user_id'] = int(user.iloc[0]['id'])
        return redirect(url_for('upload_form'))
    else:
        flash("Invalid username or password.")
        return redirect(url_for('login'))

@app.route('/upload_form')
def upload_form():
    if 'username' not in session:
        return redirect(url_for('login'))
    departments = departments_df['Department'].tolist()
    specialties = specialties_df['Specialty'].tolist()
    locations = locations_df['Location'].sort_values().tolist()
    return render_template('upload.html', departments=departments, specialties=specialties, locations = locations)

@app.route('/upload', methods=['GET','POST'])
def upload():
    if 'username' not in session:
        return redirect(url_for('login'))
    
    # Collect names and department
    position = request.form.get("position")
    thai_first_name = request.form.get("thai_first_name")
    thai_surname = request.form.get("thai_surname")
    english_first_name = request.form.get("english_first_name")
    english_surname = request.form.get("english_surname")
    department = request.form.get("department")
    specialty = request.form.get("specialty")  


    education_years = request.form.getlist("education_year[]")
    education_credentials = request.form.getlist("education_credential[]")
    education = [{"year": year, "credential": credential} for year, credential in zip(education_years, education_credentials)]
    # education = request.form.get("education")
    
    interest = request.form.getlist("interest[]")


    # Collect schedule fields
    schedule_days = request.form.getlist("schedule_day[]")
    start_times = request.form.getlist("start_time[]")
    end_times = request.form.getlist("end_time[]")
    locations = request.form.getlist("location[]")
    schedule = [
        {"day": day, "start_time": start, "end_time": end, "location": location}
        for day, start, end, location in zip(schedule_days, start_times, end_times, locations)
    ]

    # Collect additional comments
    additional_comments = request.form.get("additional_comments")


    if 'cropped_image' not in request.files:
        flash("No image file part in the form.")
        return redirect(url_for('upload_form'))

    file = request.files['cropped_image']
    filename = f"{session['user_id']}.jpg"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    # Save profile data as JSON
    profile_data = {
        "id": session['user_id'],
        "username": session['username'],
        "position": position,
        "thai_first_name": thai_first_name,
        "thai_surname": thai_surname,
        "english_first_name": english_first_name,
        "english_surname": english_surname,
        "department": department,
        "specialty": specialty,
        "education": education,
        "interest": interest,
        "schedule": schedule,
        "additional_comments": additional_comments, 
        "image": filename
    }

    profile_path = os.path.join(app.config['PROFILE_FOLDER'], f"{session['user_id']}.json")
    with open(profile_path, 'w') as json_file:
        json.dump(profile_data, json_file, indent=4, ensure_ascii=False)

    flash("Profile saved successfully!")
    return redirect(url_for('upload_form'))

@app.route('/logout')
def logout():
    session.pop('username', None)
    session.pop('user_id', None)
    flash("You have been logged out.")
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)