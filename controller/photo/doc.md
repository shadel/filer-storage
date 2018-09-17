# Get Photo information

Delete all photo

**URL** : `/api/force_empty`

**URL Parameters** : None

**Method** : `GET`

## Success Response

**Code** : `200 OK`

**Content examples**

There is image information

```json
{
    "result": true
}
```

## Error Responses

**Condition** : If server can't process API

**Code** : `500 Internal Server Error`

**Content** : `{ "message": "Server error"}`

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



# Download Thumbnail Photo by id

Get photo in system

**URL** : `/api/photo/thumbnail/:id`

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



# Get list Images 

Get list images from disk

**URL** : `/api/photo/explore/:page/:number`

**URL Parameters** : `page=[integer]` where `page` is number of page, start is 1

**URL Parameters** : `number=[integer]` where `number` is number of photo in a page

**Method** : `GET`


## Success Response

**Code** : `200 OK`

**Content examples**

Updating datetime to server is successful

```json
{
    "images": ["0015.jpg","0016.jpg","0017.jpg","0018.jpg"],
    "pages":7,
    "total":101
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