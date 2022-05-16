# DLC Clarity Smart Conract

 ## Deployment can be found here: [discreet-log-storage](https://explorer.stacks.co/txid/0x4bc611b40fc13e31062d4c1ff7978a71c59da4cbec958a015ef5c2976b97d03d?chain=testnet)

# Setup
Add `secrets.js` file with the following fields:

```js
export const publicKey = '';
export const privateKey = '';
export const mnemonic = '';
```
`publicKey`: your wallet public key

`privateKey`: your private key corresponds to the public key (can be extracted with pk-extractor.js)

`mnemonic`: your menomic seed phrase

# Tests
Run
```console
clarinet test
```
For test coverage run
```console
clarinet test --coverage
```
And install lcov
```console
brew install lcov
genhtml coverage.lcov
open index.html
```
### Current coverage report summary
![coverage-report](https://user-images.githubusercontent.com/38463744/166215716-77a1add8-0173-454e-bad3-cd4820081f9f.png)
 
## Usage

Under scripts folder there are predefined scripts to:
* create dlc (emits an event)
* open new dlc
* close dlc
* early close dlc
* get dlc
* get all open dlc

These can be used as an example for later reference.

# Get all open DLCs UUID
Since Clarity has some limitations to store data in a dynamic way (lists has a pre defined length) also there is no way to create loops, we can't store or structure the required open dlc's uuids. 

As a workaround to achieve the above mentioned functionality the contract mints an NFT with each DLC open and burns it when it is closed, so we can easily poll the specific NFT balance of the contract to get the open UUIDs. This is very convenient since NFTs are first class citizens in Clarity and easy to work with them. See `get-all-open-dlc.js` for an example.

[Api docs for the call](https://docs.hiro.so/api?_gl=1*itpyo4*_ga*NzQwMjIzMDMxLjE2NDk4MzYyODk.*_ga_NB2VBT0KY2*MTY1MTIxNDk1NC41LjAuMTY1MTIxNDk1NC4w#operation/get_nft_holdings)

```json
{
    "limit": 50,
    "offset": 0,
    "total": 2,
    "results": [
        {
            "asset_identifier": "ST31H4TTX6TVMEE86TYV6PN6XPQ6J7NCS2DD0XFW0.discreet-log-storage::open-dlc",
            "value": {
                "hex": "0x02000000057575696431",
                "repr": "0x7575696431"
            },
            "tx_id": "0x3985fbed42431257013699e189e261c1253d4067e66a9d9323b3463130839baa"
        },
        {
            "asset_identifier": "ST31H4TTX6TVMEE86TYV6PN6XPQ6J7NCS2DD0XFW0.discreet-log-storage::open-dlc",
            "value": {
                "hex": "0x02000000057575696432",
                "repr": "0x7575696432"
            },
            "tx_id": "0xacf460c36ac1f5c90b14382265382b8e2e49b59dc2b17b84900cbdae4376932e"
        }
    ]
}
```
The response looks like this where the UUID is the `repr` key in a hex format.

# Error codes

```
unauthorised                 u2001
dlc-already-added            u2002
unknown-dlc                  u2003
not-reached-closing-time     u2004
already-closed               u2005
already-passed-closing-time  u2006
not-closed                   u2007
```

## Example calls
Refresh the page if it says not found.
* [Create DLC](https://explorer.stacks.co/txid/0xb83fe527c74ec1d40e8a5e06f9b08daeb26bd99fdc76d797ebe86cd4812c37e7?chain=testnet)
* [Open new DLC](https://explorer.stacks.co/txid/0x3985fbed42431257013699e189e261c1253d4067e66a9d9323b3463130839baa?chain=testnet)
* [Close DLC](https://explorer.stacks.co/txid/0xf3bd922b555330db8c97e572365148234c3267f3d7a5059a24d244127580a4a4?chain=testnet)
* [Early Close DLC](https://explorer.stacks.co/txid/0x3fb84c4a118ba4613af0199ea3f6ef5c5109c94f0fe790595b4ee3e61070f34c?chain=testnet)