# Gateway Shell
Access gateways from the command line with Gateway Shell. You can interactively access storage or create scripts to automate storage management. Gateway Shell lets you connect to gateways, make folders, and browse, download, upload, rename, move, copy files.

## Download
- For Windows: *TBD URL*
- For Mac: *TBD URL*
- For Linux: *TBD URL*

## Install
Gateway Shell is an executable. Place the program anywhere and add it to the default path. The shell will create a hidden folder in the user's home directory (`~/.gateway-shell`) to contain its configuration and working data.

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
explorer> 
```

## Connect Gateway
Gateway Shell is a gateway client. Start by registering and authorizing access to the gateway. Use the `gateway` command to connect gateways. Gateway Shell can register multiple gateways. Each registered gateway is accessible by path: `/gateway/<gateway.name>`.

*Example*

Register a file server gateway at `http://localhost:8080` with `{"key": "default"}`. 

```
show me the money
```
## Commands
Run Gateway Shell without commands to display the usage info.

```
explorer> 
Usage:
    explore pwd
    explore ls [(-l | --long)] [(-r | --refresh)] [<path>]
    explore cd <path>
    explore upload <source> <destination> [--recursive] [--merge | --overwrite | --skip]
    explore download <source> <destination> [--recursive] [--merge | --overwrite | --skip]
    explore copy <source> <destination> [--recursive] [--merge | --overwrite | --skip]
    explore mv <source> <destination>
    explore mkdir <path>
    explore rm <path>
    explore rename <path> <new-name>
    explore stat <remote-path>
    explore gateway [list]
    explore gateway authorize <name> <url> <auth_json_string>
    explore gateway deauthorize <name>
explorer> 
```