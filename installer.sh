#!/bin/bash

# Define text colors
GREEN=$(tput setaf 2)
RED=$(tput setaf 1)
YELLOW=$(tput setaf 3)
BOLD=$(tput bold)
RESET=$(tput sgr0)

# Header
echo "${YELLOW}Installing justcatt...${RESET}"

# Make app.py executable
chmod +x ./app.py

# Install Python dependencies
echo "${GREEN}[+] Installing Python packages (Flask, Flask-CORS)...${RESET}"
sudo pip3 install flask flask-cors --break-system-packages

# Create launcher script
echo "${GREEN}[+] Creating launcher script...${RESET}"
cat <<EOF > justcatt
#!/bin/bash
python3 ~/justcatt/app.py
EOF

chmod +x justcatt

# Copy to /usr/bin
echo "${RED}[!] sudo is required to copy the launcher to /usr/bin${RESET}"
sudo cp justcatt /usr/bin/justcatt

# Setup project directory
echo "${GREEN}[+] Setting up project directory at ~/justcatt...${RESET}"
mkdir -p ~/justcatt
cp -r ./static ./templates ./CyberAllTheThings.py ./app.py ./README.md ~/justcatt

# Done
echo "${GREEN}[✓] justcatt has been installed successfully!${RESET}"
echo "${BOLD}${YELLOW}To run the program, type 'justcatt' in the terminal.${RESET}"
