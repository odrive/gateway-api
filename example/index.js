import fetch from 'node-fetch';
import open from 'open';
import waitForUserInput from 'wait-for-user-input';


// Required inputs to run script.
const storage = await waitForUserInput('Enter the storage name(e.g: onedrive, google_drive, amazon_s3): '); // options: "onedrive", "google_drive", "procore", "amazon_s3"...
const gatewayURL = ""; // e.g: https://gateway-url-odrive.com


(async() => { await main() })()


async function main() {

    let auth_body = {}

    // Get storage gateway's access method.
    const auth_method = await signIn()
    console.info("Sign-in response: ", auth_method)

    // Oauth Method.
    if (auth_method["gateway.auth.method"] === "oauth") {

        // Save body to then authorize.
        auth_body["gateway.auth.oauth.state"] = auth_method["gateway.auth.oauth.state"]

        // Open browser to sign-in into selected storage.
        open(auth_method["gateway.auth.oauth.url"])
        await waitForUserInput('After authorizing access, press enter.')
    }

    // Form based method.
    if (auth_method["gateway.auth.method"] === "form") {
        
        // Ask to user for inputs and save them as body to then authorize.
        for (let question of auth_method["gateway.auth.form"]) {
            auth_body[question["gateway.auth.form.input.field.name"]] = await waitForUserInput(`${question["gateway.auth.form.input.field.prompt"]}: `)
        }
    }

    // Validate if the gateway signed-in correctly into the storage selected.
    const gateway_auth = await authorize(auth_body)
    console.info("Authorization response: ", gateway_auth)

    if (!gateway_auth) {
        console.error("Storage gateway not authenticated.")
        return
    }

    // Get the metadata for the root content.
    const rootContent = await listContent(gateway_auth)
    console.info("Content response: ", rootContent)    
}


async function signIn() {
    console.debug(`Sign In => ${storage}`)

    // e.g: GET /gateway/onedrive/v2/gateway_auth_method
    let uri = `/gateway/${storage}/v2/gateway_auth_method`
    let response = await fetch(gatewayURL + uri)
    if (!response.ok) {
        console.error("Error connecting with gateway.")
        return
    }

    return await response.json()
}


async function authorize(body) {
    console.debug(`Authorize gateway => ${storage}`)

    // e.g: POST /gateway/onedrive/v2/gateway_auth
    let uri = `/gateway/${storage}/v2/gateway_auth`
    let response = await fetch(gatewayURL + uri, {
        method: 'POST',
        body: JSON.stringify(body)
    })
    if (!response.ok) {
        console.error("Storage not authorized.")
        return
    }

    return await response.json()
}


async function listContent(gateway_auth) {
    console.debug(`Listing content => ${storage}`)

    // e.g: GET /gateway/onedrive/v2/gateway_metadata_children/odroot
    let uri = `/gateway/${storage}/v2/gateway_metadata_children/${gateway_auth["gateway.auth.metadata.id"]}`
    let response = await fetch(gatewayURL + uri,{
        headers: {
            'AUTHORIZATION': `Bearer ${gateway_auth["gateway.auth.access.token"]}`
        },
    })
    if (!response.ok) {
        console.error("Error listing storage metadata.")
        return
    }

    return await response.json()
}