# Get Photo information

Get list wifi in system

**URL** : `/api/photo/:id`

**URL Parameters** : `id=[integer]` where `id` is the ID of the Photo on the
server.

**Method** : `GET`

## Success Response

**Code** : `200 OK`

**Content examples**

There're 2 wifi networks

```json
{
    "result": {
        "_id": 10,
        "name": "XYX"
    }
    
}
```

# Set datetime for coping data from SD card

Connect wifi with id and password

**URL** : `/api/photo/`

**Method** : `POST`

**Data constraints**

```json
{
    "datetime": "Wed Jun 10 2018 17:47:14",
}
```


## Success Response

**Code** : `200 OK`

**Content examples**

Updating datetime to server is successful

```json
{
    "result": true
}
```