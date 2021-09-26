
# Gateway API
The Gateway API specifies how odrive authorizes users and accesses storage. A Storage Gateway implements the Gateway API endpoints by translating them to internal application calls and returning standardized responses. 

## Integration Model
A Storage Gateway enables odrive access to its source system. It
maps its source data into a virtual, hierarchical file system represented as `gateway.file` and `gateway.metadata` resources. 

A Storage Gateway's file system is navigable. Upon authorization, the gateway returns the session root folder as the starting point for browsing.

## Representational States

**gateway.auth**

`gateway.auth` represents a storage gateway's access authorization.

Use Case | Endpoint
---------|------------
Sign in | `POST /v2/gateway_auth`
Sign out | `DELETE /v2/gateway_auth/<gateway.auth.access.token>`
Refresh expired access token | `POST /v2/gateway_auth`

**gateway.file**

`gateway.file` represent the binary file data.

Use Case | Endpoint
---------|------------
Download file | `GET /v2/gateway_file/<gateway.metadata.id>`
Download file thumbnail | `GET /v2/gateway_file_thumbnail/<gateway.metadata.id>`

**gateway.metadata**

`gateway.metadata` represents a file or folder.

Use Case | Endpoint
---------|------------
List folder content | `GET /v2/gateway_metadata_children/<gateway.metadata.id>?page=`
Get file or folder properties | `GET /v2/gateway_metadata/<gateway.metadata.id>`
Create folders | `POST /v2/gateway_metadata_folder/<gateway.metadata.id>`
Upload files | `POST /v2/gateway_metadata_file/<gateway.metadata.id>`
Update files | `PUT /v2/gateway_metadata_file/<gateway.metadata.id>`
Move files or folders | `PUT /v2/gateway_metadata_parent/<gateway.metadata.id>`
Rename files or folders | `PUT /v2/gateway_metadata_name/<gateway.metadata.id>`
Delete files or folders | `DELETE /v2/gateway_metadata/<gateway.metadata.id>`

# API Endpoints

# gateway.auth

## Sign in
```
POST /v2/gateway_auth
```

**REQUEST**

*JSON*

Sign-in requirements are specific to implementation. Please refer to provider documentation.

**RESPONSE**

*JSON*

Property | Description
---------|------------
`gateway.auth.access.token` | Required AUTHORIZATION header for subsequent API requests.
`gateway.auth.refresh.token` | Required to refresh expired access tokens.
`gateway.auth.metadata.content.id` | The root folder. 

*Status*

Status | Description
-------|------------
`200` | OK
`400` | Missing credential
`403` | Invalid credential
`403` | Not allowed
`429` | Rate limited

## Sign out
```
DELETE /v2/gateway_auth/<gateway.auth.access.token>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`gateway.auth.access.token` | Session to sign out.

**RESPONSE**

*Status*

Status | Description
-------|------------
`200` | OK
`404` | gateway.auth.access.token not found
`429` | Rate limited

## Refresh expired access token
```
POST /v2/gateway_auth
```

**REQUEST**

*JSON*

Property | Description
---------|-------------
`gateway.auth.refresh.token` | token from sign in.

**RESPONSE**

*JSON*

Property | Description
---------|------------
`gateway.auth.access.token` | Required AUTHORIZATION header for subsequent API requests.
`gateway.auth.refresh.token` | Required to refresh expired access tokens.
`gateway.auth.metadata.id` | Root folder to start browsing. 

*Status*

Status | Description
-------|------------
`200` | OK
`400` | Missing gateway.auth.refresh.token
`403` | Not allowed
`429` | Rate limited

# gateway.file

## Download file
```
GET /v2/gateway_file/<gateway.metadata.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`gateway.metadata.id` | File to download.

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <gateway.auth.access.token>`

*Body*

The file binary stream.

**RESPONSE**

*Status*

Status | Description
-------|------------
`200` | OK
`400` | Not file
`401` | Authorization required
`403` | Not allowed
`404` | Not found
`429` | Rate limited

## Download thumbnail
```
GET /v2/gateway_file_thumbnail/<gateway.metadata.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`gateway.metadata.id` | File thumbnail to download.

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <gateway.auth.access.token>`

**RESPONSE**

*Body*

The thumbnail binary stream.

*Status*

Status | Description
-------|------------
`200` | OK
`401` | Authorization required
`403` | Not allowed
`403` | Not available
`404` | Not found
`429` | Rate limited

# gateway.metadata

## Create new folder
```
POST /v2/gateway_metadata_folder/<gateway.metadata.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`gateway.metadata.id` | Parent folder

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <gateway.auth.access.token>`

*JSON*

Property | Description
---------|-------------
`gateway.metadata.name` | New folder name
`gateway.metadata.modified`| Millis since the epoch when the folder was created.

**RESPONSE**

*JSON*

Property | Description
---------|------------
`gateway.metadata.id` | New folder
`gateway.metadata.parent.id` | Parent folder ID
`gateway.metadata.type`| `folder`
`gateway.metadata.name`| New folder name
`gateway.metadata.modified`| Millis since the epoch when the folder was created.

*Status*

Status | Description
-------|------------
`200` | OK
`400` | Missing folder name
`401` | Authorization required
`403` | Not allowed
`429` | Rate limited

## Delete content
```
DELETE /v2/gateway_metadata/<gateway.metadata.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`gateway.metadata.id` | File or folder to delete

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <gateway.auth.access.token>`

*JSON*

Property | Description
---------|-------------
`gateway.metadata.parent.id` | Parent folder

**RESPONSE**

*Status*

Status | Description
-------|------------
`200` | OK
`401` | Authorization required
`403` | Not allowed
`404` | Not found
`429` | Rate limited

## Get content metadata
```
GET /v2/gateway_metadata/<gateway.metadata.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`gateway.metadata.id` | File or folder

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <gateway.auth.access.token>`

**RESPONSE**

*JSON*

Property | Description
---------|------------
`gateway.metadata.id` | File or folder
`gateway.metadata.parent.id` | Parent folder ID
`gateway.metadata.type`| `folder` or `file`
`gateway.metadata.name`| File or folder name
`gateway.metadata.modified` | Millis since the epoch
`gateway.metadata.file.size`| Total bytes
`gateway.metadata.file.hash` | Files with the same hash have the same data

*Status*

Status | Description
-------|------------
`200` | OK
`401` | Authorization required
`403` | Not allowed
`404` | Not found
`429` | Rate limited

## List folder content metadata
```
GET /v2/gateway_metadata_children/<gateway.metadata.id>?page=
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`gateway.metadata.id` | Folder
`page` | Next page token

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <gateway.auth.access.token>`

**RESPONSE**

*Header*

Property | Description
---------|-------------
`X-Gateway-Page` | Next page token

*JSON*

List of metadata properties:

Property | Description
---------|------------
`gateway.metadata.id` | File or folder
`gateway.metadata.parent.id` | Parent folder ID
`gateway.metadata.type`| `folder` or `file`
`gateway.metadata.name`| File or folder name
`gateway.metadata.modified` | Millis since the epoch
`gateway.metadata.file.size`| Total bytes
`gateway.metadata.file.hash` | Files with the same hash have the same data

*Status*

Status | Description
-------|------------
`200` | OK
`400` | Not a folder
`401` | Authorization required
`403` | Not allowed
`404` | Not found
`429` | Rate limited

## Move content
```
PUT /v2/gateway_metadata_parent/<gateway.metadata.id>
```
**REQUEST**

*URL*

Property | Description
---------|-------------
`gateway.metadata.id` | File or folder to move

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <gateway.auth.access.token>`

*JSON*

Property | Description
---------|-------------
`new.gateway.metadata.parent.id` | New folder
`old.gateway.metadata.parent.id` | Current folder

**RESPONSE**

*JSON*

Property | Description
---------|------------
`gateway.metadata.parent.id` | Parent folder ID

*Status*

Status | Description
-------|------------
`200` | OK
`401` | Authorization required
`403` | Not allowed
`404` | Not found
`429` | Rate limited

## Rename content
```
PUT /v2/gateway_metadata_name/<gateway.metadata.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`gateway.metadata.id` | File or folder to rename

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <gateway.auth.access.token>`

*JSON*

Property | Description
---------|-------------
`new.gateway.metadata.name` | New name
`old.gateway.metadata.name` | Current name

**RESPONSE**

*JSON*

Property | Description
---------|------------
`gateway.metadata.name`| File or folder name

*Status*

Status | Description
-------|------------
`200` | OK
`401` | Authorization required
`403` | Not allowed
`404` | Not found
`429` | Rate limited


## Upload new file
```
POST /v2/gateway_metadata_file/<gateway.metadata.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`gateway.metadata.id` | Parent folder

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <gateway.auth.access.token>`
`X-Gateway-Upload` | Special file upload JSON (see below).

*X-Gateway-Upload*

Property | Description
---------|-------------
`gateway.metadata.name` | New file name
`gateway.metadata.modified` | New file modified time (Millis since the epoch)
`gateway.metadata.file.size` | New file size

*Body*

The file binary stream.

**RESPONSE**

*JSON*

Property | Description
---------|------------
`gateway.metadata.id` | File ID
`gateway.metadata.parent.id` | Parent folder ID
`gateway.metadata.type`| `file`
`gateway.metadata.name`| File name
`gateway.metadata.modified` | Millis since the epoch
`gateway.metadata.file.size`| Total bytes
`gateway.metadata.file.hash` | Files with the same hash have the same bytes

*Status*

Status | Description
-------|------------
`200` | OK
`401` | Authorization required
`403` | Not allowed
`404` | Not found
`429` | Rate limited

## Update existing file
```
PUT /v2/gateway_metadata_file/<gateway.metadata.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`gateway.metadata.id` | File to update

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <gateway.auth.access.token>`
`X-Gateway-Upload` | Special file upload JSON (see below).

*X-Gateway-Upload*

Property | Description
---------|-------------
`gateway.metadata.modified` | Updated modified time (Millis since the epoch)
`gateway.metadata.file.size` | Updated file size

*Body*

The file binary stream.

**RESPONSE**

*JSON*

Property | Description
---------|------------
`gateway.metadata.id` | File
`gateway.metadata.parent.id` | Parent folder ID
`gateway.metadata.type`| `file`
`gateway.metadata.name`| File name
`gateway.metadata.modified` | Millis since the epoch
`gateway.metadata.file.size`| Total bytes
`gateway.metadata.file.hash` | Files with the same hash have the same data

*Status*

Status | Description
-------|------------
`200` | OK
`401` | Authorization required
`403` | Not allowed
`404` | Not found
`429` | Rate limited

# Error Handling

Status | Description
-------|------------
`500` | Unexpected exception
`502` | Unexpected error from downstream service
`503` | A downstream service is temporarily unavailable
`504` | No response from downstream service
