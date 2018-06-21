# Get List Wifi

Get list wifi in system

**URL** : `/api/wifi/`

**Method** : `GET`

## Success Response

**Code** : `200 OK`

**Content examples**

There're 2 wifi networks

```json
{
    "result": [
        {
            "name": "XYX"
        },
        {
            "name": "TTT"
        }
    ]
}
```

# Connect Wifi

Connect wifi with id and password

**URL** : `/api/wifi/`

**Method** : `POST`

**Data constraints**

```json
{
    "id": "Link",
    "password": "abcxyz"
}
```


## Success Response

**Code** : `200 OK`

**Content examples**

Connecting to wifi network is successful

```json
{
    "result": true
}
```