# Get Photo information

Get photo in system

**URL** : `/api/photo/:id`

**URL Parameters** : `id=[integer]` where `id` is the ID of the Photo on the
server.

**Method** : `GET`

## Success Response

**Code** : `200 OK`

**Content examples**

There is image information

```json
{
    "result": {
        "_id": 10,
        "name": "XYX"
    }
    
}
```

# Download Photo by id

Get photo in system

**URL** : `/api/photo/download/:id`

**URL Parameters** : `id=[integer]` where `id` is the ID of the Photo on the
server.

**Method** : `GET`

## Success Response

**Content examples**
Image

## Error Responses

**Condition** : If server can't process API

**Code** : `500 Internal Server Error`

**Content** : `{ "message": "Server error"}`


# Set datetime 

Set datetime for coping data from SD card

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

## Error Responses

**Condition** : If server can't process API

**Code** : `500 Internal Server Error`

**Content** : `{ "message": "Server error"}`


# Inserting photo to database

```javascript
const name = 'world' ;

insertImageInfo(name)
    .then(() => {
        // insert successfully
    })
    .catch((error) => {
        // got an error
    });
```

# Inserting a list photos to database

```javascript
const photos = ['world', 'chicken', 'bird'] ;

insertImageList(photos)
    .then(() => {
        // insert successfully
    })
    .catch((error) => {
        // got an error
    });
```

# Update photo name by id to database

```javascript
const newName = 'world' ;
const id = 20

updateImageInfo(id, newName)
    .then(() => {
        // update successfully
    })
    .catch((error) => {
        // got an error
    });
```