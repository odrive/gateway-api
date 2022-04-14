# Gateway Shell (gws.exe)
Access gateways from the command line with Gateway Shell. You can interactively access storage or create scripts to automate storage management. Gateway Shell lets you connect to gateways, make folders, and browse, download, upload, rename, move, copy files.

## Download
- [Windows Gateway Shell](https://s3.amazonaws.com/cdn.odrive.com/gws/win-gws-3.zip)
- [Mac Gateway Shell](https://s3.amazonaws.com/cdn.odrive.com/gws/mac-gws-3.zip)
- [Linux Gateway Shell](https://s3.amazonaws.com/cdn.odrive.com/gws/linux64-gws-3.tar.gz)

## Install
Gateway Shell is an executable. Place the program anywhere and add it to the default path. The shell will create a hidden folder in the user's home directory (`~/.gws`) to contain its configuration and working data.

To uninstall, delete the program and the hidden application home folder.

## Usage
Use the shell as a terminal command or start an interactive session with path completion. Use command mode for scripting and interactive shell mode for ad-hoc storage management.

Call Gateway Shell with a command to execute once.
```
% gws.exe pwd
/gateway/devserver

% 
```

Call Gateway Shell without any commands to start an interactive session.
```
% gws.exe
gws> 
```

## Connect Gateway
Gateway Shell is a gateway client. Start by registering and authorizing access to the gateway. Use the `mounts` command to connect gateways. Gateway Shell can register multiple gateways. Each registered gateway is accessible by path: `/gateway/<gateway.name>`.

*Example*

Register a file server gateway at `http://localhost:8080` with key "123". 

```
gws> mounts add

What do you want to call the gateway?
Name: devserver

What is the gateway URL?
URL: http://localhost:8080

Please enter the access key.
key: 123

Success! Gateway authorized and mounted to /gateway/devserver.
gws> 
```
## Commands
Run Gateway Shell `help` command to display the usage info.

```
% gws.exe help
Gateway Shell.

Usage:
    gateway cd help
    gateway copy help
    gateway diagnostic help
    gateway download help
    gateway ls help
    gateway mkdir help
    gateway mounts help
    gateway mv help
    gateway pwd help
    gateway rename help
    gateway rm help
    gateway stat help
    gateway upload help

Command:
    cd          Change the current working directory.
    copy        Copy files and folders between storage.
    diagnostic  Get storage diagnostics.
    download    Download files and folders.
    ls          Print the directory content.
    mkdir       Make new folders.
    mounts      Manage access to storage.
    mv          Move to another directory.
    pwd         Print the current working directory.
    rename      Change the file or folder name.
    rm          Delete the file or folder.
    stat        Print the gateway metadata.
    upload      Upload files and folders
% 
```
