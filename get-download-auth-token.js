// Get a download authorization token
// See https://help.backblaze.com/hc/en-us/articles/360010017893-How-to-allow-Cloudflare-to-fetch-content-from-a-Backblaze-B2-private-bucket

const B2 = require('backblaze-b2');
const config = require('./config.js');
 
const b2 = new B2({
  applicationKeyId: config.applicationKeyId,
  applicationKey: config.applicationKey
});


async function getDownloadAuthorizationToken(b2Handle) {
	try {
		await b2Handle.authorize();
	} catch (error) {
		throw(`authorize() failed: ${error}`);
	}
	try {
		let downloadAuthResponse = await b2Handle.getDownloadAuthorization({
	    bucketId: config.bucketId,
	    fileNamePrefix: config.downloadPrefix,
	    validDurationInSeconds: config.validDurationInSeconds,
		});
		return downloadAuthResponse.data;
	} catch (error) {
		throw(`getDownloadAuthorization() failed: ${error}`);
	}
}

// Test
// Get a downloadAuthorizationToken and print it out

(async function () {
	try {
		let r = await getDownloadAuthorizationToken(b2);
		console.log(r);
		process.exit(0);
	} catch(error) {
		console.log(`Got an error: ${error}`);
		process.exit(10);
	}
}());