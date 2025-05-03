// Base64 Encoder Tool
document.addEventListener('DOMContentLoaded', function() {
    const state = {
        input: '',
        name: '',
        output: '',
        encMode: 'Base64 - Bash'
    };

    // Get DOM elements
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const fileNameInput = document.getElementById('fileName');
    const encodeButton = document.getElementById('encodeButton');
    const copyButton = document.getElementById('copyButton');
    const clearButton = document.getElementById('clearButton');
    const encModeDropdown = document.getElementById('encModeDropdown');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const currentEncMode = document.getElementById('currentEncMode');

    // Load saved state if available
    const savedState = localStorage.getItem('encoder_state');
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        state.input = parsedState.input || '';
        state.name = parsedState.name || '';
        inputText.value = state.input;
        fileNameInput.value = state.name;
    }

    // Generate random string for temporary filenames
    function randomString(length = 10) {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        if (length > chars.length) {
            return 'An error occurred';
        }
        for (let i = 0; i < length; i++) {
            const randomNumber = Math.floor(Math.random() * chars.length);
            if (randomNumber) {
                result += chars[randomNumber];
            } else {
                return 'An error occurred';
            }
        }
        return result;
    }

    // Update the state and save to localStorage
    function updateState(newValues) {
        Object.assign(state, newValues);
        localStorage.setItem('encoder_state', JSON.stringify({
            input: state.input,
            name: state.name
        }));
    }

    // Show message
    function showMessage(text, isError = false) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = text;
        messageElement.className = isError ? 'message error' : 'message success';
        messageElement.style.display = 'block';
        
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }

    // Handle encoding
    function handleEncode() {
        try {
            if (state.input.length === 0) {
                showMessage('Please enter some text to encode', true);
                return;
            }
            
            if (!state.name) {
                showMessage('Please enter an output file name', true);
                return;
            }

            let result = '';
            
            if (state.encMode === 'Base64 - Bash') {
                const bash_b64 = btoa(state.input);
                result = `echo -n '${bash_b64}' | base64 -d > ${state.name}`;
            }
            else if (state.encMode === 'Base64 - CMD') {
                const cmd_b64 = btoa(state.input);
                const cmd_random = randomString();
                result = `echo|set /p="${cmd_b64}" >> ${cmd_random} 
certutil -decode ${cmd_random} ${state.name}
del /Q ${cmd_random}`;
            }
            else if (state.encMode === 'Base64 - Powershell') {
                const pwsh_b64 = btoa(state.input);
                const pwsh_random = randomString();
                result = `$${pwsh_random} = @()
$${pwsh_random} +=
[System.Convert]::FromBase64String("${pwsh_b64}")
[Environment]::CurrentDirectory = (Get-Location -PSProvider FileSystem).ProviderPath
[System.IO.File]::WriteAllBytes("${state.name}", $${pwsh_random})
Remove-Variable ${pwsh_random}`;
            }
            
            state.output = result;
            outputText.value = result;
        }
        catch (ex) {
            showMessage('Unable to encode properly please try again', true);
        }
    }

    // Event listeners
    inputText.addEventListener('input', function() {
        updateState({ input: this.value });
    });

    fileNameInput.addEventListener('input', function() {
        updateState({ name: this.value });
    });

    encodeButton.addEventListener('click', handleEncode);

    copyButton.addEventListener('click', function() {
        if (state.output) {
            navigator.clipboard.writeText(state.output)
                .then(() => showMessage('Your payload has been copied successfully!'))
                .catch(() => showMessage('Failed to copy to clipboard', true));
        } else {
            showMessage('Nothing to copy', true);
        }
    });

    clearButton.addEventListener('click', function() {
        state.output = '';
        outputText.value = '';
    });

    // Set up encoding mode selection
    const encModes = ['Base64 - Bash', 'Base64 - CMD', 'Base64 - Powershell'];
    
    // Clear any existing items in dropdown menu
    dropdownMenu.innerHTML = '';
    
    // Add encoding mode options to dropdown
    encModes.forEach(mode => {
        const option = document.createElement('a');
        option.textContent = mode;
        option.href = '#';
        option.className = 'dropdown-item';
        option.addEventListener('click', function(e) {
            e.preventDefault();
            state.encMode = mode;
            currentEncMode.textContent = mode;
            dropdownMenu.classList.remove('show');
        });
        dropdownMenu.appendChild(option);
    });

    // Show/hide dropdown
    document.getElementById('dropdownToggle').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent the event from bubbling up
        dropdownMenu.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', function(e) {
        if (!e.target.matches('#dropdownToggle') && !e.target.closest('#dropdownMenu')) {
            dropdownMenu.classList.remove('show');
        }
    });

    // Initialize current mode display
    currentEncMode.textContent = state.encMode;
});