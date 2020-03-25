# Instructions

## Clone the project
Clone this project:
`git clone https://github.com/Deviad/resizefile-microservice.git`

## Start up the app
You can start the app by simply running: `docker-compose up -d`

The app responds on port 5006

## Available endpoints

| Path                                                                                   | Request parameters | Result                                                                | Method | Example                                           |
|----------------------------------------------------------------------------------------|--------------------|-----------------------------------------------------------------------|--------|---------------------------------------------------|
| /image?name=<image_name_including_extension>                                           | name, content      | {"status": "success"} or {"status": "error", "message: "the message"} | POST   | /image?name=japanese_tree.jpg                     |
| /image/resize?name=<image_name_including_extension>&size=<width>x<eight> | name, size         | {"status": "success"}or {"status": "error", "message: "the message"}  | GET    | /image/resize?name=japanese_tree.jpg&size=300x410 |
|                                                                                        |                    |                                                                       |        |                                                   |


## Some info

When a user tries to input a file with a name that already exists,
the same error exist the app will throw an error.

Since this is only a demo, I have not had time to use tools like redis,
therefore I am just using Map() from javascript.

When the app loads it will look into a Mongodb database and
will load all of the results into cache, just strings not files.

When a new file is stored, its name is recorded in the cache and in the db.
The checks regarding the existence of the file are run against the cache.

That's all.



