### Getting Started
Install package

```
> npm install
```

### Setup enviroment
Setup directory for images folder and cache folder
Cache folder permission should be available to be created thumbnail images on this.

```
DIR=/home/quaywin/Downloads/
CACHE=/home/quaywin/cache/
```

### Start server
Start server at port 3000

```
> npm start
```

- After running server, data will be copied from SD to Pictures folder in project.
- Server listen Device attached, it will be automatically copy data when user stick SD card to camera


### API

#### Photo API

* [Photo features](controller/photo/doc.md) : `/api/photo/`


