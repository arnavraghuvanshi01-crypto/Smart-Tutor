@echo off
cd "%~dp0"
pip install flask==2.0.1 flask-cors==3.0.10 nltk==3.8.1
python app.py
pause 