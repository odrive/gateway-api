
let auth_method = null
let gateway_auth = null
let storage = null
let gatewayUrl = null


async function authorizeGateway() {
    // Reset message texts.
    document.querySelector("#lblError").textContent = ""
    document.querySelector("#lblMsg").textContent = ""

    // Get values.
    gatewayUrl = document.querySelector("#gwUrl").value
    storage = document.querySelector("#gwStorage").value

    // Validate.
    if (!gatewayUrl || !storage) {
        document.querySelector("#lblError").textContent = "URL, Name and storage are required."
        return
    }

    // Authorize gateway.
    document.querySelector("#lblMsg").textContent = "Connecting..."

    // e.g: GET /gateway/onedrive/v2/gateway_auth_method
    let uri = `/gateway/${storage}/v2/gateway_auth_method`

    let response = await fetch(gatewayUrl + uri)
    if (!response.ok) {
        document.querySelector("#lblMsg").textContent = ""
        document.querySelector("#lblError").textContent = "Error connecting with gateway."
        return
    }
    
    // Save authorization data.
    auth_method = await response.json()
    console.log(auth_method)

    // Redirect to authorization url.
    window.open(auth_method["gateway.auth.oauth.url"], '_blank')
    document.querySelector("#lblMsg").textContent = `After authorizing access, press "Refresh".`
    document.getElementById("btnRefresh").hidden = false
}


async function validateAuth() {

    // e.g: POST /gateway/onedrive/v2/gateway_auth
    let uri = `/gateway/${storage}/v2/gateway_auth`

    let response = await fetch(gatewayUrl + uri, {
        method: 'POST',
        body: JSON.stringify({"gateway.auth.oauth.state": auth_method["gateway.auth.oauth.state"]})
    })

    if (!response.ok) {
        document.querySelector("#lblMsg").textContent = ""
        document.querySelector("#lblError").textContent = "Storage not authorized."
        return
    }

    gateway_auth = await response.json()
    console.log(gateway_auth)

    document.querySelector("#lblMsg").textContent = "Successfully connected to the gateway."
    document.getElementById("btnRefresh").hidden = true
    document.getElementById("btnList").hidden = false
}


async function listRoot() {

    // e.g: GET /gateway/onedrive/v2/gateway_metadata_children/odroot
    let uri = `/gateway/${storage}/v2/gateway_metadata_children/${gateway_auth["gateway.auth.metadata.id"]}`


    // For this DEMO, we are using a proxy "https://cors-anywhere.herokuapp.com/" to avoid CORS issues.
    // https://cors-anywhere.herokuapp.com/corsdemo - Request access to demo.
    let response = await fetch("https://cors-anywhere.herokuapp.com/" + gatewayUrl + uri,{
        headers: {
            'AUTHORIZATION': `Bearer ${gateway_auth["gateway.auth.access.token"]}`
        },
    })
    if (!response.ok) {
        document.querySelector("#lblMsg").textContent = ""
        document.querySelector("#lblError").textContent = "Error listing storage metadata."
        return
    }
    let data = await response.json()
    console.log(data)
    document.querySelector("#divData").append(JSON.stringify(data))

}