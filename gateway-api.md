
# Gateway API
The Gateway API specifies how odrive authorizes users and accesses storage. A Storage Gateway implements the Gateway API endpoints by translating them to internal application calls and returning standardized responses. 

## Integration Model
A Storage Gateway enables odrive access to its source system. It
maps its source data into a virtual, hierarchical file system represented by FILE and METADATA resources. 

A Storage Gateway's file system is navigable. Upon authorization, the gateway returns the session root folder as the starting point for browsing.

## API Resources

**AUTH**

AUTH objects represent the gateway's access authorization. AUTH endpoints support:
- Signing in
- Signing out
- Refreshing access tokens

**FILE**

FILE objects represent the binary file data. FILE endpoints support:
- Downloading files
- Downloading thumbnails

**METADATA**

METADATA resource represents the properties of files and folders. METADATA endpoints support:
- Listing folder content
- Getting properties
- Creating folders
- Uploading files
- Updating files
- Moving files or folders
- Rename files or folders
- Delete files or folders

# API Endpoints

# AUTH

## Sign in
```
POST /v2/auth
```

**REQUEST**

*JSON*

Sign-in requirements are specific to implementation. Please refer to provider documentation.

**RESPONSE**

*JSON*

Property | Description
---------|------------
`access.token` | Required AUTHORIZATION header for subsequent API requests.
`refresh.token` | Required to refresh expired access tokens.
`root.content.id` | The root folder to start browsing. 

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
DELETE /v2/auth/<access.token>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`access.token` | Session to sign out.

**RESPONSE**

*Status*

Status | Description
-------|------------
`200` | OK
`404` | access.token not found
`429` | Rate limited

## Refresh expired access token
```
POST /v2/auth
```

**REQUEST**

*JSON*

Property | Description
---------|-------------
`refresh.token` | Refresh.token from sign in.

**RESPONSE**

*JSON*

Property | Description
---------|------------
`access.token` | Required AUTHORIZATION header for subsequent API requests.
`refresh.token` | Required to refresh expired access tokens.
`root.content.id` | Root folder to start browsing. 

*Status*

Status | Description
-------|------------
`200` | OK
`400` | Missing refresh.token
`403` | Not allowed
`429` | Rate limited

# FILE

## Download file
```
GET /v2/file/<content.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`content.id` | File to download.

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <access.token>`

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
GET /v2/file_thumbnail/<content.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`content.id` | File thumbnail to download.

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <access.token>`

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

# METADATA

## Create new sub folder
```
POST /v2/metadata_folder/<content.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`content.id` | Parent folder

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <access.token>`

*JSON*

Property | Description
---------|-------------
`content.name` | New folder name
`content.modified`| Millis since the epoch when the folder was created.

**RESPONSE**

*JSON*

Property | Description
---------|------------
`content.id` | New folder
`content.type`| `folder`
`content.name`| New folder name
`content.modified`| Millis since the epoch when the folder was created.

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
DELETE /v2/metadata/<content.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`content.id` | File or folder to delete

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <access.token>`

*JSON*

Property | Description
---------|-------------
`parent.content.id` | Parent folder

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
GET /v2/metadata/<content.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`content.id` | File or folder

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <access.token>`

*JSON*

Property | Description
---------|------------
`content.id` | File or folder
`content.type`| `folder` or `file`
`content.name`| File or folder name
`content.modified` | Millis since the epoch
`file.size`| Total bytes
`file.hash` | Files with the same hash have the same data

**RESPONSE**

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
GET /v2/metadata_children/<content.id>?page=
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`content.id` | Folder
`page` | Next page token

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <access.token>`

**RESPONSE**

*Header*

Property | Description
---------|-------------
`X-Gateway-Page` | Next page token

*JSON*

List of metadata properties:

Property | Description
---------|------------
`content.id` | File or folder
`content.type`| `folder` or `file`
`content.name`| File or folder name
`content.modified` | Millis since the epoch
`file.size`| Total bytes
`file.hash` | Files with the same hash have the same data

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
PATCH /v2/metadata_parent/<content.id>
```
**REQUEST**

*URL*

Property | Description
---------|-------------
`content.id` | File or folder to move

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <access.token>`

*JSON*

Property | Description
---------|-------------
`parent.content.id` | New folder
`current.parent.content.id` | Current folder

**RESPONSE**

*JSON*

Property | Description
---------|------------
`content.id` | File or folder ID
`content.type`| `file` or `folder`
`content.name`| File or folder name
`content.modified` | Millis since the epoch
`file.size`| Total bytes (File Only)
`file.hash` | Files with the same hash have the same bytes

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
PATCH /v2/metadata_name/<content.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`content.id` | File or folder to rename

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <access.token>`

*JSON*

Property | Description
---------|-------------
`content.name` | New name

**RESPONSE**

*JSON*

Property | Description
---------|------------
`content.id` | File or folder ID
`content.type`| `file` or `folder`
`content.name`| File or folder name
`content.modified` | Millis since the epoch (File Only)
`file.size`| Total bytes (File Only)
`file.hash` | Files with the same hash have the same bytes

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
POST /v2/metadata_file/<content.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`content.id` | Parent folder

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <access.token>`
`X-Gateway-Upload` | Special file upload JSON (see below).

*X-Gateway-Upload*

Property | Description
---------|-------------
`content.name` | New file name
`content.modified` | New file modified time (Millis since the epoch)
`file.size` | New file size

*Body*

The file binary stream.

**RESPONSE**

*JSON*

Property | Description
---------|------------
`content.id` | File ID
`content.type`| `file`
`content.name`| File name
`content.modified` | Millis since the epoch
`file.size`| Total bytes
`file.hash` | Files with the same hash have the same bytes

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
PUT /v2/metadata/<content.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`content.id` | File to update

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <access.token>`
`X-Gateway-Upload` | Special file upload JSON (see below).

*X-Gateway-Upload*

Property | Description
---------|-------------
`content.modified` | Updated modified time (Millis since the epoch)
`file.size` | Updated file size

*Body*

The file binary stream.

**RESPONSE**

*JSON*

Property | Description
---------|------------
`content.id` | File
`content.type`| `file`
`content.name`| File name
`content.modified` | Millis since the epoch
`file.size`| Total bytes
`file.hash` | Files with the same hash have the same data

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
