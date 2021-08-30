
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
`auth.access.token` | Required AUTHORIZATION header for subsequent API requests.
`auth.refresh.token` | Required to refresh expired access tokens.
`auth.metadata.content.id` | The root folder. 

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
DELETE /v2/auth/<auth.access.token>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`auth.access.token` | Session to sign out.

**RESPONSE**

*Status*

Status | Description
-------|------------
`200` | OK
`404` | auth.access.token not found
`429` | Rate limited

## Refresh expired access token
```
POST /v2/auth
```

**REQUEST**

*JSON*

Property | Description
---------|-------------
`auth.refresh.token` | auth.refresh.token from sign in.

**RESPONSE**

*JSON*

Property | Description
---------|------------
`auth.access.token` | Required AUTHORIZATION header for subsequent API requests.
`auth.refresh.token` | Required to refresh expired access tokens.
`auth.metadata.content.id` | Root folder to start browsing. 

*Status*

Status | Description
-------|------------
`200` | OK
`400` | Missing auth.refresh.token
`403` | Not allowed
`429` | Rate limited

# FILE

## Download file
```
GET /v2/file/<metadata.content.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`metadata.content.id` | File to download.

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <auth.access.token>`

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
GET /v2/file_thumbnail/<metadata.content.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`metadata.content.id` | File thumbnail to download.

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <auth.access.token>`

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
POST /v2/metadata_folder/<metadata.content.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`metadata.content.id` | Parent folder

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <auth.access.token>`

*JSON*

Property | Description
---------|-------------
`metadata.content.name` | New folder name
`metadata.content.modified`| Millis since the epoch when the folder was created.

**RESPONSE**

*JSON*

Property | Description
---------|------------
`metadata.content.id` | New folder
`metadata.content.parent.id` | Parent folder ID
`metadata.content.type`| `folder`
`metadata.content.name`| New folder name
`metadata.content.modified`| Millis since the epoch when the folder was created.

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
DELETE /v2/metadata/<metadata.content.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`metadata.content.id` | File or folder to delete

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <auth.access.token>`

*JSON*

Property | Description
---------|-------------
`metadata.content.parent.id` | Parent folder

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
GET /v2/metadata/<metadata.content.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`metadata.content.id` | File or folder

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <auth.access.token>`

*JSON*

Property | Description
---------|------------
`metadata.content.id` | File or folder
`metadata.content.parent.id` | Parent folder ID
`metadata.content.type`| `folder` or `file`
`metadata.content.name`| File or folder name
`metadata.content.modified` | Millis since the epoch
`metadata.file.size`| Total bytes
`metadata.file.hash` | Files with the same hash have the same data

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
GET /v2/metadata_children/<metadata.content.id>?page=
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`metadata.content.id` | Folder
`page` | Next page token

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <auth.access.token>`

**RESPONSE**

*Header*

Property | Description
---------|-------------
`X-Gateway-Page` | Next page token

*JSON*

List of metadata properties:

Property | Description
---------|------------
`metadata.content.id` | File or folder
`metadata.content.parent.id` | Parent folder ID
`metadata.content.type`| `folder` or `file`
`metadata.content.name`| File or folder name
`metadata.content.modified` | Millis since the epoch
`metadata.file.size`| Total bytes
`metadata.file.hash` | Files with the same hash have the same data

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
PATCH /v2/metadata_parent/<metadata.content.id>
```
**REQUEST**

*URL*

Property | Description
---------|-------------
`metadata.content.id` | File or folder to move

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <auth.access.token>`

*JSON*

Property | Description
---------|-------------
`new.metadata.content.parent.id` | New folder
`old.metadata.content.parent.id` | Current folder

**RESPONSE**

*JSON*

Property | Description
---------|------------
`metadata.content.id` | File or folder ID
`metadata.content.parent.id` | Parent folder ID
`metadata.content.type`| `file` or `folder`
`metadata.content.name`| File or folder name
`metadata.content.modified` | Millis since the epoch
`metadata.file.size`| Total bytes (File Only)
`metadata.file.hash` | Files with the same hash have the same bytes

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
PATCH /v2/metadata_name/<metadata.content.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`metadata.content.id` | File or folder to rename

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <auth.access.token>`

*JSON*

Property | Description
---------|-------------
`metadata.content.name` | New name

**RESPONSE**

*JSON*

Property | Description
---------|------------
`metadata.content.id` | File or folder ID
`metadata.content.parent.id` | Parent folder ID
`metadata.content.type`| `file` or `folder`
`metadata.content.name`| File or folder name
`metadata.content.modified` | Millis since the epoch (File Only)
`metadata.file.size`| Total bytes (File Only)
`metadata.file.hash` | Files with the same hash have the same bytes

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
POST /v2/metadata_file/<metadata.content.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`metadata.content.id` | Parent folder

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <auth.access.token>`
`X-Gateway-Upload` | Special file upload JSON (see below).

*X-Gateway-Upload*

Property | Description
---------|-------------
`metadata.content.name` | New file name
`metadata.content.modified` | New file modified time (Millis since the epoch)
`metadata.file.size` | New file size

*Body*

The file binary stream.

**RESPONSE**

*JSON*

Property | Description
---------|------------
`metadata.content.id` | File ID
`metadata.content.parent.id` | Parent folder ID
`metadata.content.type`| `file`
`metadata.content.name`| File name
`metadata.content.modified` | Millis since the epoch
`metadata.file.size`| Total bytes
`metadata.file.hash` | Files with the same hash have the same bytes

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
PUT /v2/metadata/<metadata.content.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`metadata.content.id` | File to update

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Requires access token formatted as: `Bearer <auth.access.token>`
`X-Gateway-Upload` | Special file upload JSON (see below).

*X-Gateway-Upload*

Property | Description
---------|-------------
`metadata.content.modified` | Updated modified time (Millis since the epoch)
`metadata.file.size` | Updated file size

*Body*

The file binary stream.

**RESPONSE**

*JSON*

Property | Description
---------|------------
`metadata.content.id` | File
`metadata.content.parent.id` | Parent folder ID
`metadata.content.type`| `file`
`metadata.content.name`| File name
`metadata.content.modified` | Millis since the epoch
`metadata.file.size`| Total bytes
`metadata.file.hash` | Files with the same hash have the same data

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
