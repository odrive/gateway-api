let auth_method = null
let gateway_auth = null
let storage = null
let gatewayUrl = null

let authHeaders = {
// Add auth header to test bim track clients; otherwise leave empty
//     'AUTHORIZATION': 'Bearer <account.id>/<app.id>',
//     'AUTHORIZATION': 'Bearer 9e90b4f7727eca97ab7af068c68f2c869e2c8e38/ff66297293c1744a4f6d04e0859ca5aa8e9fdab3',
//     'AUTHORIZATION': `Bearer 9e90b4f7727eca97ab7af068c68f2c869e2c8e38/b46c83993c46511e6d184d42497b015d1c3a6ea3`,
}

    async function signin() {
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

    // Sign in to gateway.
    document.querySelector("#lblMsg").textContent = "Connecting..."

    // e.g: GET /gateway/onedrive/v2/gateway_auth_method
    let uri = `/gateway/${storage}/v2/gateway_auth_method`

    let response = await fetch(gatewayUrl + uri, {
        method: 'GET',
        headers: authHeaders,
    })
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
    document.querySelector("#lblMsg").textContent = `After signing in, press "Authorize".`
    document.getElementById("btnAuth").hidden = false
    document.getElementById("btnRefresh").hidden = true
    document.getElementById("btnDelete").hidden = true
}


async function validateAuth() {

    // e.g: POST /gateway/onedrive/v2/gateway_auth
    let uri = `/gateway/${storage}/v2/gateway_auth`

    let response = await fetch(gatewayUrl + uri, {
        method: 'POST',
        body: JSON.stringify({"gateway.auth.oauth.state": auth_method["gateway.auth.oauth.state"]}),
        headers: authHeaders,
    })

    if (!response.ok) {
        document.querySelector("#lblMsg").textContent = ""
        document.querySelector("#lblError").textContent = "Storage not authorized."
        return
    }

    gateway_auth = await response.json()
    console.log(gateway_auth)

    document.querySelector("#lblMsg").textContent = "Successfully connected to the gateway."
    document.getElementById("btnAuth").hidden = true
    document.getElementById("btnRefresh").hidden = false
    document.getElementById("btnDelete").hidden = false
    document.getElementById("btnList").hidden = false
}


async function refreshAuth() {

    // e.g: POST /gateway/onedrive/v2/gateway_auth_access
    let uri = `/gateway/${storage}/v2/gateway_auth_access`

    let response = await fetch(gatewayUrl + uri, {
        method: 'POST',
        body: JSON.stringify({"gateway.auth.refresh.token": gateway_auth["gateway.auth.refresh.token"]}),
        headers: authHeaders,
    })

    if (!response.ok) {
        document.querySelector("#lblMsg").textContent = ""
        document.querySelector("#lblError").textContent = "Storage auth not refreshed."
        return
    }

    let gateway_refresh = await response.json()
    console.log(gateway_refresh)
    if (gateway_refresh) {
        gateway_auth["gateway.auth.access.token"] = gateway_refresh["gateway.auth.access.token"]
        gateway_auth["gateway.auth.refresh.token"] = gateway_refresh["gateway.auth.refresh.token"]
    }

    document.querySelector("#lblMsg").textContent = "Successfully connected to the gateway."
    document.getElementById("btnAuth").hidden = true
    document.getElementById("btnRefresh").hidden = false
    document.getElementById("btnDelete").hidden = false
    document.getElementById("btnList").hidden = false
}


async function deleteAuth() {

    // e.g: DELETE /gateway/onedrive/v2/gateway_auth
    let uri = `/gateway/${storage}/v2/gateway_auth/${gateway_auth["gateway.auth.access.token"]}`

    let response = await fetch(gatewayUrl + uri, {
        method: 'DELETE',
        headers: authHeaders,
    })

    if (!response.ok) {
        document.querySelector("#lblMsg").textContent = ""
        document.querySelector("#lblError").textContent = "Storage not de-authorized."
        return
    }

    document.querySelector("#lblMsg").textContent = "Successfully disconnected from the gateway."
    document.getElementById("btnAuth").hidden = false
    document.getElementById("btnRefresh").hidden = false
    document.getElementById("btnDelete").hidden = false
    document.getElementById("btnList").hidden = false
}




async function listRoot() {

    // e.g: GET /gateway/onedrive/v2/gateway_metadata_children/odroot
    let uri = `/gateway/${storage}/v2/gateway_metadata_children/${gateway_auth["gateway.auth.metadata.id"]}`


    let response = await fetch(gatewayUrl + uri,{
        method: 'GET',
        // credentials: 'include',
        headers: {
            'AUTHORIZATION': `Bearer ${gateway_auth["gateway.auth.access.token"]}`,
            // 'FAKE_REQUEST_HEADER': 'xxx'
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
