# Docker

```
docker pull mongo

docker run --name mongo_db -p 27017:27017 -v $(pwd)/data:/data/db mongo

docker start mongo_db
```

Hay que crear la Base de datos ``hospitalDB``, y el usuario para acceder:

```
db.createUser({ user: 'adminProUser', pwd: '5ecXLiVUI9YbMf7r', roles: [ { role: "userAdminAnyDatabase", db: "hospitalDB" } ] });
```

# AdminPro BackEnd
