const selfsigned = require('selfsigned');
const fs = require('fs').promises; // Using promise-based fs for consistency

// Use an async IIFE (Immediately Invoked Function Expression)
(async () => {
  try {
    const attrs = [{ name: 'commonName', value: 'localhost' }];
    const options = {
      keySize: 2048,
      days: 365,
      algorithm: 'sha256',
    };

    // Await the promise returned by selfsigned.generate
    const pems = await selfsigned.generate(attrs, options);

    // Use await with fs.writeFile
    await fs.writeFile('server.key', pems.private, { encoding: 'utf-8' });
    await fs.writeFile('server.crt', pems.cert, { encoding: 'utf-8' });

    console.log('Successfully generated server.key and server.crt');
  } catch (err) {
    console.error("Failed to generate certificates:", err);
    process.exit(1); // Exit with an error code
  }
})();
