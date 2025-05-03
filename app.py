from flask import Flask, render_template, request
import subprocess
import os
import sys

app = Flask(__name__)

#======================================================
#Certificates:
@app.route('/certificates')
def certificates():
    return render_template('certificates.html')

#======================================================
#Blue Section:
@app.route('/Blue/')
def blue():
    return render_template('Blue/Blue.html')

@app.route('/Blue/sysmon')
def sysmon():
    return render_template('Blue/sysmon.html')

@app.route('/Blue/memory')
def memory():
    return render_template('Blue/memory.html')

@app.route('/Blue/Encoding')
def Encoding():
    return render_template('Blue/Encoding.html')

@app.route('/Blue/obfusticator')
def obfusticator():
    return render_template('Blue/obfusticator.html')

@app.route('/Blue/Android')
def Android():
    return render_template('Blue/Android.html')

@app.route('/Blue/windows_forensics')
def windows_forensics():
    return render_template('Blue/windows_forensics.html')

#======================================================
#Red Section:

@app.route('/Red/')
def Red():
    return render_template('Red/Red.html')

@app.route('/Red/Reverse_Shell')
def reverse_shell():
    return render_template('Red/Reverse_Shell.html')

@app.route('/Red/msfbuilder')
def msfbuilder():
    return render_template('Red/msfbuilder.html')

@app.route('/Red/Wordlist_Creator')
def Wordlist_Creator():
    return render_template('Red/Wordlist_Creator.html')

@app.route('/Red/PentestToolz')
def PentestToolz():
    return render_template('Red/pentest.html')

@app.route('/Red/WebAppPentest')
def WebPentest():
    return render_template('Red/webpentest.html')
#======================================================
#Web pentest section:
@app.route('/Red/WebAppPentest/sqli')
def sql():
    return render_template('Red/webpentest/sqli.html')

@app.route('/Red/WebAppPentest/commandinjection')
def commandinjection():
    return render_template('Red/webpentest/os.html')

@app.route('/Red/WebAppPentest/brokenAccessControl')
def broken():
    return render_template('Red/webpentest/broken.html')

@app.route('/Red/WebAppPentest/ssrf')
def ssrf():
    return render_template('Red/webpentest/ssrf.html')

@app.route('/Red/WebAppPentest/xxe')
def xxe():
    return render_template('Red/webpentest/xxe.html')

@app.route('/Red/WebAppPentest/idor')
def idor():
    return render_template('Red/webpentest/idor.html')

@app.route('/Red/WebAppPentest/LFI')
def lfi():
    return render_template('Red/webpentest/lfi.html')

@app.route('/Red/WebAppPentest/csrf')
def csrf():
    return render_template('Red/webpentest/csrf.html')

@app.route('/Red/WebAppPentest/fileupload')
def fileupload():
    return render_template('Red/webpentest/fileupload.html')

@app.route('/Red/WebAppPentest/request_smuggling')
def requestsmuggle():
    return render_template('Red/webpentest/requestsmuggling.html')

#======================================================
#main section:

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
    app.run(debug=True)