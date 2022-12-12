

// Define gateway URL.
const GATEWAY_URL = "https://gateway2-dev.odrive.com"
document.querySelector("#gwUrl").value = GATEWAY_URL


async function authorizeGateway() {
    // Reset message texts.
    document.querySelector("#lblError").textContent = ""
    document.querySelector("#lblMsg").textContent = ""

    // Get values.
    let gatewayUrl = document.querySelector("#gwUrl").value
    let gatewayName = document.querySelector("#gwName").value
    let storage = document.querySelector("#gwStorage").value

    // Validate.
    if (!gatewayUrl || !gatewayName || !storage) {
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

    let auth = await response.json()

    // Redirect to authorization url.
    window.open(auth["gateway.auth.oauth.url"], '_blank')
    document.querySelector("#lblMsg").textContent = `After authorizing access, press "List content" button to view the storage content.`
    document.getElementById("btnRefresh").hidden = false



}


function listRoot() {

}