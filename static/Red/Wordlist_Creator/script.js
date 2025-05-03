document.getElementById('wordlist-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    // Get user inputs
    const info = document.getElementById('info').value.split(' ');
    const minLength = parseInt(document.getElementById('min-length').value);
    const maxLength = parseInt(document.getElementById('max-length').value);
  
    // Generate wordlist
    const wordlist = generateWordlist(info, minLength, maxLength);
  
    // Display the output
    const outputElement = document.getElementById('wordlist-output');
    outputElement.textContent = wordlist.join('\n');
  
    // Show the output section
    document.getElementById('output').style.display = 'block';
  });
  
  // Copy to clipboard functionality
  document.getElementById('copy-btn').addEventListener('click', function () {
    const wordlist = document.getElementById('wordlist-output').textContent;
    navigator.clipboard.writeText(wordlist).then(() => {
      alert('Wordlist copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy wordlist.');
    });
  });
  
  // Wordlist generation logic
  function generateWordlist(info, minLength, maxLength) {
    const words = new Set();
  
    // Generate combinations
    for (let r = minLength; r <= maxLength; r++) {
      const combinations = getCombinations(info, r);
      combinations.forEach(combination => {
        const word = combination.join('');
        if (word.length >= minLength && word.length <= maxLength) {
          words.add(word);
        }
      });
    }
  
    return Array.from(words).sort();
  }
  
  // Helper function to generate combinations
  function getCombinations(arr, length) {
    if (length === 1) return arr.map(item => [item]);
    const result = [];
    arr.forEach((item, index) => {
      const smallerCombinations = getCombinations(arr, length - 1);
      smallerCombinations.forEach(combination => {
        result.push([item, ...combination]);
      });
    });
    return result;
  }