# Storage Gateway
odrive integrates with applications through Storage Gateways.

A Storage Gateway is simply a web server implementing the [Gateway API](https://github.com/odrive/gateway-api/blob/main/gateway-api.md) used by odrive to access and synchronize files.

# Integrating with odrive
Integrate with odrive by making and publishing a Storage Gateway to your storage or application.

## Designing your Gateway
A Storage Gateway provides a file system view of application data. Each gateway user can have different folder hierarchies and files.

Begin integration by deciding how to map users and application data to virtual file systems. 

1. How to map application data to gateway folders and files? What are files, and how are they grouped into folders?
2. How to map application users to gateway users? Most of the time, the mapping is one-to-one. However, the mapping is arbitrary. The only requirement is the ability to support authentication and authorization.
3. How to map users to root folders?  How to present user data as files and folders in root folders? 

## Implementating your Gateway
A Storage Gateway is a web service implementing the [Gateway API](https://github.com/odrive/gateway-api/blob/main/gateway-api.md). Implement the gateway endpoints in any web application platform.

1. Implement the AUTH endpoints to support authorizing users and getting access tokens.
2. Implement the METADATA endpoints to enable browsing and uploading files. 
3. Implement the FILE endpoints to handle downloading files.

Please refer to the [Gateway API](https://github.com/odrive/gateway-api/blob/main/gateway-api.md) reference for details.

## Testing your Gateway
Use the following applications to access and exercise your gateway implementation:
- [Gateway Shell](https://github.com/odrive/gateway-api/blob/main/gateway-shell.md) - Interactive command-line interface.
- Gateway Sync - Desktop sync folder.

## Publishing your Gateway
Make the integration available to odrive. Several options are available:

1. Publish the Storage Gateway privately and allow odrive users to connect with Gateway credentials.
2. Submit your Storage Gateway to odrive to be included as an official source.
3. Partner with odrive to integrate sync functionality into your product.

# Reference Implementations

- [File Server Gateway](https://github.com/odrive/py-fs-gateway)
- [S3 Gateway](https://github.com/odrive/py-s3-gateway)






