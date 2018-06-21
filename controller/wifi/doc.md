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
        "XXX", "YYY"
    ]
}
```

## Error Responses

**Condition** : If server can't process API

**Code** : `500 Internal Server Error`

**Content** : `{ "message": "Server error"}`

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

## Error Responses

**Condition** : If server can't process API

**Code** : `500 Internal Server Error`

**Content** : `{ "message": "Server error"}`

# GET Wifi status

Get current Wifi status

**URL** : `/api/wifi/status`

**Method** : `GET`

**Parameters**

None


## Success Response

**Code** : `200 OK`

**Content examples**

Connecting to wifi network is successful

CONNECTED
```json
{
    "result": {
        "status": "CONNECTED",
        "data": {
            "ssid": "string",
            "key_mgmt": "string",
            "address": "string",
        }
    }
}
```

DISCONNECTED
```json
{
    "result": {
        "status": "DISCONNECTED",
        "data": "string"
    }
}
```

OTHER
```json
{
    "result": {
        "status": "OTHER",
        "data": "string"
    }
}
```

## Error Responses

**Condition** : If server can't process API

**Code** : `500 Internal Server Error`

**Content** : `{ "message": "Server error"}`