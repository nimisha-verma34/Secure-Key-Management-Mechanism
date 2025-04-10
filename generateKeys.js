const fs = require('fs');
const crypto = require('crypto');

const publicKeyPath = './keys/public.pem';
const privateKeyPath = './keys/private.pem';

function generateRSAKeys() {
    try {
        // Check if keys exist
        if (fs.existsSync(publicKeyPath) && fs.existsSync(privateKeyPath)) {
            console.log('RSA keys already exist. Loading...');
            return {
                publicKey: fs.readFileSync(publicKeyPath, 'utf8'),
                privateKey: fs.readFileSync(privateKeyPath, 'utf8')
            };
        }

        // Generate new keys if they don't exist
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        // Save keys to files
        fs.writeFileSync(publicKeyPath, publicKey, 'utf8');
        fs.writeFileSync(privateKeyPath, privateKey, 'utf8');

        console.log('New RSA keys generated and saved.');

        return { publicKey, privateKey };
    } catch (err) {
        console.error('Error generating RSA keys:', err);
        throw err;
    }
}

module.exports = generateRSAKeys();

