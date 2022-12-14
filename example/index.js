import fetch from 'node-fetch';
import open from 'open';
import waitForUserInput from 'wait-for-user-input';


const storage = "onedrive" // options: ["onedrive", "google_drive", "procore", ...]
const gatewayURL = "https://gateway2-dev.odrive.com";


(async() => { await main() })()


async function main() {

    const auth_method = await authorizeGateway()
    console.info(auth_method)
    await waitForUserInput('After authorizing access, press enter.')


    const gateway_auth = await validateAuth(auth_method)
    console.info(gateway_auth)


    const rootContent = await listContent(gateway_auth)
    console.info(rootContent)
    
}


async function authorizeGateway() {
    console.debug(`Authorizing gateway => ${storage}`)

    let uri = `/gateway/${storage}/v2/gateway_auth_method`
    let response = await fetch(gatewayURL + uri)
    if (!response.ok) {
        console.error("Error connecting with gateway.")
        return
    }
    let data = await response.json()
    // Open browser to sign-in
    open(data["gateway.auth.oauth.url"])
    
    return data
}


async function validateAuth(auth_method) {
    console.debug(`Validating gateway => ${storage}`)

    let uri = `/gateway/${storage}/v2/gateway_auth`
    let response = await fetch(gatewayURL + uri, {
        method: 'POST',
        body: JSON.stringify({"gateway.auth.oauth.state": auth_method["gateway.auth.oauth.state"]})
    })
    if (!response.ok) {
        console.error("Storage not authorized.")
        return
    }

    return await response.json()
}


async function listContent(gateway_auth) {
    console.debug(`Listing content => ${storage}`)

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