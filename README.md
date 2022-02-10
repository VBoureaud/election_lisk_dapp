#  Election_lisk_dapp

This project was bootstrapped with [Lisk SDK](https://github.com/LiskHQ/lisk-sdk).


### Requirements
- You need to run with Node v12
- You need to launch Lisk before to use frontend

---
### How to start a node

```
$ npm install
$ npm start
```
This will install all dependencies and launch Lisk (after removed cache).
You can find the dashboard at http://localhost:4005

### Generate genesis
You may need to update Genesis Block (when editing schemas for example) 
```
./bin/run genesis-block:create --output config/default
```
Don't forget to update the configuration files with these commands: 
```
tmp=$(mktemp)
jq '.forging.delegates = input' config/default/config.json config/default/forging_info.json > "$tmp" && mv "$tmp" config/default/config.json
jq '.forging += input' config/default/config.json config/default/password.json > "$tmp" && mv "$tmp" config/default/config.json

```
---
### How to launch frontend (localhost:3000)

```
$ cd frontend
$ npm install
$ npm start
```

You can now add candidates with each account (use passphrase from config/default/accounts) and vote once with the same account. 

### If you see these errors:
- lisk accounts:address doesn't exist. Probably a problem with the cache:
```
rm -r ~/.lisk/election_lisk_dapp
```
## Learn More

You can learn more in the official [documentation](https://lisk.io/documentation/lisk-sdk/index.html).
