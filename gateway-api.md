
# Gateway API
The Gateway API specifies how Odrive authorizes users and accesses storage. A Storage Gateway implements the Gateway API endpoints by translating them to internal application calls and returning standardized responses.

## Integration Model
A Storage Gateway enables Odrive access to its source system. It
maps its source data into a virtual, hierarchical file system represented as `gateway.file` and `gateway.metadata` resources.

A Storage Gateway's file system is navigable. Upon authorization, the gateway returns the session root folder as the starting point for browsing.

## Representational States

**gateway.auth**

`gateway.auth` represents a storage gateway's access authorization.

Use Case | Endpoint
---------|------------
Determine the sign-in method | `GET /v2/gateway_auth_method`
Sign in with supported method | `POST /v2/gateway_auth`
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
Upload large files | `POST /v2/gateway_metadata_upload/<gateway.metdata.id>`
Update files | `PUT /v2/gateway_metadata_file/<gateway.metadata.id>`
Update large files | `PUT /v2/gateway_metadata_upload/<gateway.metadata.id>`
Move files or folders | `PUT /v2/gateway_metadata_parent/<gateway.metadata.id>`
Rename files or folders | `PUT /v2/gateway_metadata_name/<gateway.metadata.id>`
Delete files or folders | `DELETE /v2/gateway_metadata/<gateway.metadata.id>`

**gateway.upload**

`gateway.upload` represents a large file upload session.

Use Case | Endpoint
---------|------------
Start large file uploads | `POST /v2/gateway_upload`
Upload file segments | `POST /v2/gateway_upload_segment/<gateway.upload.id>`
Cancel large file uploads | `DELETE /v2/gateway_upload/<gateway.upload.id>`


# API Endpoints

# gateway.auth

## Discover available sign-in methods
```
GET /v2/gateway_auth_method
```

**RESPONSE**

There are two sign-in methods. The gateway responds with the keys for the supported method.

OAUTH Sign-In Method:

*JSON*

Property | Description
---------|------------
`gateway.auth.method` | `oauth`
`gateway.auth.oauth.url` | Redirect users to this url to sign in.
`gateway.auth.oauth.state` | Use this state code to authorize access after user sign in.

FORM Sign-In Method:

*JSON*

Property | Description
---------|------------
`gateway.auth.method` | `form`
`gateway.auth.form` | List of `gateway.auth.form.input.field` for authorizing access.

*gateway.auth.form.input.field*

Property | Description
---------|------------
`gateway.auth.form.input.field.prompt` | Question or instruction for user.
`gateway.auth.form.input.field.name` | Authorization parameter name.
`gateway.auth.form.input.field.required` | True if required for authorization.
`gateway.auth.form.input.field.order` | The sort order for displaying the input fields in a form.


*Status*

Status | Description
-------|------------
`200` | OK
`400` | Missing credential
`403` | Invalid credential
`403` | Not allowed


## Sign in with OAUTH method
```
POST /v2/gateway_auth
```

**REQUEST**

*JSON*

Property | Description
---------|------------
`gateway.auth.oauth.state` | The state code provided from the method specification.


**RESPONSE**

*JSON*

Property | Description
---------|------------
`gateway.auth.access.token` | Required AUTHORIZATION header for subsequent API requests.
`gateway.auth.refresh.token` | Required to refresh expired access tokens.
`gateway.auth.metadata.id` | The root folder.
`gateway.auth.id` | The ID of the user or account authorized.
`gateway.upload.segment.size` | Use segmented upload when files are bigger than the segment size.

*Status*

Status | Description
-------|------------
`200` | OK
`400` | Missing oauth state
`403` | Not authorized


## Sign in with FORM method
```
POST /v2/gateway_auth
```

**REQUEST**

*JSON*

Submit the user response to the required form input fields. Format the request as a JSON post with the field name as the key and user input as the value.

**RESPONSE**

*JSON*

Property | Description
---------|------------
`gateway.auth.access.token` | Required AUTHORIZATION header for subsequent API requests.
`gateway.auth.refresh.token` | Required to refresh expired access tokens.
`gateway.auth.metadata.id` | The root folder.
`gateway.auth.id` | The ID of the user or account authorized.
`gateway.upload.segment.size` | Use segmented upload when files are bigger than the segment size.

*Status*

Status | Description
-------|------------
`200` | OK
`400` | Missing credential
`403` | Invalid credential

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

## Refresh expired access token
```
POST /v2/gateway_auth_access
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

*Status*

Status | Description
-------|------------
`200` | OK
`400` | Missing gateway.auth.refresh.token
`403` | Not allowed

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
`AUTHORIZATION` | Required access token formatted as: `Bearer <gateway.auth.access.token>`

**RESPONSE**

*Header*

Property | Description
---------|-------------
`Content-Length` | Optional number of bytes in the file stream. If provided, the provided stream must match the specified size.
`Transfer-Encoding` | Optional HTTP encoding format. If `chunked` is specified, then omit the Content-Length property.

*Body*

The file binary stream. If `Transfer-Encoding` is specified, then return the encoded stream.

*Status*

Status | Description
-------|------------
`200` | OK
`400` | Not file
`401` | Authorization required
`403` | Not allowed
`404` | Not found

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
`AUTHORIZATION` | Required access token formatted as: `Bearer <gateway.auth.access.token>`

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
`AUTHORIZATION` | Required access token formatted as: `Bearer <gateway.auth.access.token>`

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
`AUTHORIZATION` | Required access token formatted as: `Bearer <gateway.auth.access.token>`

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
`AUTHORIZATION` | Required access token formatted as: `Bearer <gateway.auth.access.token>`

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
`gateway.metadata.file.hash` | Files with the same hash are considered the same file

*Status*

Status | Description
-------|------------
`200` | OK
`401` | Authorization required
`403` | Not allowed
`404` | Not found

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
`AUTHORIZATION` | Required access token formatted as: `Bearer <gateway.auth.access.token>`

**RESPONSE**

*Header*

Property | Description
---------|-------------
`X-Gateway-Page` | Next page token

*JSON*

List of objects with the following properties:

Property | Description
---------|------------
`gateway.metadata.id` | File or folder
`gateway.metadata.parent.id` | Parent folder ID
`gateway.metadata.type`| `folder` or `file`
`gateway.metadata.name`| File or folder name
`gateway.metadata.modified` | Millis since the epoch
`gateway.metadata.file.size`| Total bytes
`gateway.metadata.file.hash` | Files with the same hash are considered the same file

*Status*

Status | Description
-------|------------
`200` | OK
`400` | Not a folder
`401` | Authorization required
`403` | Not allowed
`404` | Not found

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
`AUTHORIZATION` | Required access token formatted as: `Bearer <gateway.auth.access.token>`

*JSON*

Property | Description
---------|-------------
`new.gateway.metadata.parent.id` | New folder
`old.gateway.metadata.parent.id` | Current folder

**RESPONSE**

*JSON*

Updated properties, including but not limited to the following:

Property | Description
---------|------------
`gateway.metadata.id` | File or folder ID
`gateway.metadata.parent.id` | Parent folder ID

*Status*

Status | Description
-------|------------
`200` | OK
`401` | Authorization required
`403` | Not allowed
`404` | Not found

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
`AUTHORIZATION` | Required access token formatted as: `Bearer <gateway.auth.access.token>`

*JSON*

Property | Description
---------|-------------
`new.gateway.metadata.name` | New name
`old.gateway.metadata.name` | Current name

**RESPONSE**

*JSON*

Updated properties, including but not limited to the following:

Property | Description
---------|------------
`gateway.metadata.id` | File or folder ID
`gateway.metadata.name`| File or folder name

*Status*

Status | Description
-------|------------
`200` | OK
`401` | Authorization required
`403` | Not allowed
`404` | Not found


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
`AUTHORIZATION` | Required access token formatted as: `Bearer <gateway.auth.access.token>`
`X-Gateway-Upload` | Special file upload JSON (see below).

*X-Gateway-Upload*

Property | Description
---------|-------------
`gateway.metadata.name` | New file name
`gateway.metadata.modified` | New file modified time (Millis since the epoch)
`gateway.metadata.file.size` | New file size
`gateway.metadata.file.sha256` | Optional file SHA-256

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

## Upload large file
```
POST /v2/gateway_metadata_upload/<gateway.metadata.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`gateway.metadata.id` | Parent folder

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Required access token formatted as: `Bearer <gateway.auth.access.token>`

*Body*

Property | Description
---------|-------------
`gateway.metadata.name` | New file name
`gateway.metadata.modified` | New file modified time (Millis since the epoch)
`gateway.metadata.file.size` | New file size
`gateway.upload.id` | File upload session ID
`gateway.upload.segment` | List of updated upload segments

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
`gateway.metadata.file.hash` | Files with the same hash are considered the same file

*Status*

Status | Description
-------|------------
`200` | OK
`400` | Invalid gateway.upload.id
`400` | Invalid gateway.upload.segment
`401` | Authorization required
`403` | Not allowed
`404` | Not found

## Update file
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
`AUTHORIZATION` | Required access token formatted as: `Bearer <gateway.auth.access.token>`
`X-Gateway-Upload` | Special file upload JSON (see below).

*X-Gateway-Upload*

Property | Description
---------|-------------
`gateway.metadata.modified` | Updated modified time (Millis since the epoch)
`gateway.metadata.file.size` | Updated file size
`gateway.metadata.file.sha256` | Optional file SHA-256

*Body*

The binary file stream.

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
`gateway.metadata.file.hash` | Files with the same hash are considered the same file

*Status*

Status | Description
-------|------------
`200` | OK
`401` | Authorization required
`403` | Not allowed
`404` | Not found

## Update large file
```
PUT /v2/gateway_metadata_upload/<gateway.metadata.id>
```

**REQUEST**

*URL*

Property | Description
---------|-------------
`gateway.metadata.id` | File to update

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Required access token formatted as: `Bearer <gateway.auth.access.token>`

*Body*

Property | Description
---------|-------------
`gateway.metadata.modified` | Updated modified time (Millis since the epoch)
`gateway.metadata.file.size` | Updated file size
`gateway.metadata.file.sha256` | Optional file SHA-256
`gateway.upload.id` | File upload session ID
`gateway.upload.segment` | List of updated upload segments

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
`gateway.metadata.file.hash` | Files with the same hash are considered the same file

*Status*

Status | Description
-------|------------
`200` | OK
`401` | Authorization required
`403` | Not allowed
`404` | Not found

# gateway.upload

## Start large file uploads
```
POST /v2/gateway_upload
```

**REQUEST**

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Required access token formatted as: `Bearer <gateway.auth.access.token>`

*JSON*

Property | Description
---------|-------------
`gateway.metadata.id` | File to update or none if new file
`gateway.metadata.parent.id` | Parent folder
`gateway.metadata.name` | File name
`gateway.metadata.file.size`| Total bytes
`gateway.metadata.modified`| Millis since the epoch
`gateway.upload.segment`| List of expected segments

*gateway.upload.segment*

Property | Description
---------|-------------
`gateway.upload.segment.number` | Sequential segment number starting from 1
`gateway.upload.segment.sha256` | Expected segment SHA-256
`gateway.upload.segment.size` | Expected segment size

**RESPONSE**

*JSON*

Property | Description
---------|------------
`gateway.upload.id` | Session ID
`gateway.upload.segment` | List of updated upload segments.

*gateway.upload.segment*

Property | Description
---------|-------------
`gateway.upload.segment.number` | Sequential segment number starting from 1
`gateway.upload.segment.sha256` | Expected segment SHA-256
`gateway.upload.segment.size` | Expected segment size
`gateway.upload.segment.memo` | Opaque gateway information

*Status*

Status | Description
-------|------------
`200` | OK
`400` | Invalid gateway.metadata.id
`400` | Invalid gateway.metadata.parent.id
`400` | Missing gateway.metadata.file.size
`400` | Missing gateway.metadata.modified
`401` | Authorization required
`403` | Not allowed

## Upload file segments
```
POST /v2/gateway_upload_segment/<gateway.upload.id>
```

**REQUEST**

*Header*

Property | Description
---------|-------------
`AUTHORIZATION` | Required access token formatted as: `Bearer <gateway.auth.access.token>`
`X-GATEWAY-UPLOAD-SEGMENT` | The corresponding upload segment for upload.

*X-GATEWAY-UPLOAD-SEGMENT*

Property | Description
---------|-------------
`gateway.upload.segment.number` | Sequential segment number starting from 1
`gateway.upload.segment.sha256` | Expected segment SHA-256
`gateway.upload.segment.size` | Expected segment size
`gateway.upload.segment.memo` | Opaque gateway information

*Body*

The binary segment stream.

**RESPONSE**

*JSON*

Property | Description
---------|------------
`gateway.upload.id` | Session ID
`gateway.upload.segment.number` | Sequential segment number starting from 1
`gateway.upload.segment.sha256` | Segment SHA-256
`gateway.upload.segment.size` | Segment size
`gateway.upload.segment.memo` | Opaque gateway information

*Status*

Status | Description
-------|------------
`200` | OK
`400` | Invalid X-GATEWAY-UPLOAD-SEGMENT
`401` | Authorization required
`403` | Not allowed
`404` | Gateway Upload Not found

# Error Handling

Status | Description
-------|------------
`429` | Rate limited
`500` | Unexpected exception
`502` | Unexpected error from downstream service
`503` | A downstream service is temporarily unavailable
`504` | No response from downstream service

The `Retry-After` response header may be included when code 429 or 503 is returned.
This attribute provides the number of seconds the client should wait before making a follow-up request to the gateway.
