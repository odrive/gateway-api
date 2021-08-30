# Gateway Shell (gws.exe)
Access gateways from the command line with Gateway Shell. You can interactively access storage or create scripts to automate storage management. Gateway Shell lets you connect to gateways, make folders, and browse, download, upload, rename, move, copy files.

## Download
- For Windows: *TBD URL*
- For Mac: *TBD URL*
- For Linux: *TBD URL*

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
Gateway Shell is a gateway client. Start by registering and authorizing access to the gateway. Use the `gateway` command to connect gateways. Gateway Shell can register multiple gateways. Each registered gateway is accessible by path: `/gateway/<gateway.name>`.

*Example*

Register a file server gateway at `http://localhost:8080` with `{"key": "default"}`. 

```
gws> gateway authorize devserver http://localhost:8080 '{"key": "default"}'

Success! Gateway authorized as devserver.
gws> gateway list
devserver

gws> 
```
## Commands
Run Gateway Shell without commands to display the usage info.

```
% gws.exe 
Usage:
    gws pwd
    gws ls [(-l | --long)] [(-r | --refresh)] [<path>]
    gws cd <path>
    gws upload <source> <destination> [--recursive] [--merge | --overwrite | --skip]
    gws download <source> <destination> [--recursive] [--merge | --overwrite | --skip]
    gws copy <source> <destination> [--recursive] [--merge | --overwrite | --skip]
    gws mv <source> <destination>
    gws mkdir <path>
    gws rm <path>
    gws rename <path> <new-name>
    gws stat <remote-path>
    gws gateway [list]
    gws gateway authorize <name> <url> <auth_json_string>
    gws gateway deauthorize <name>

% 
```