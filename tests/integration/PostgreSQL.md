# Creating a test environment for this integration test

This test expects a specific test database to be available. The instructions below
describe how to set it up on Linux

## Create the database and user
```
sudo -u postgres createuser --createdb tfmtest
sudo -u postgres createdb --owner=tfmtest tfmtest
```

## Set a password for the user

This example sets the password `diablo`. Choose a different password for your own local test.

```
sudo -u postgres psql -U postgres
# alter user tfmtest password 'diablo';
```

### Make it possible to use a password to authenticate psql with this user

Edit the authoriation rules configuration file

```
sudo nano /etc/postgresql/12/main/pg_hba.conf
```

And add this line to the bottom

```
local   all             tfmtest                                 md5
```

Save the file and restart postgresql:

```
sudo service postgresql restart
```

## Test your database access

Run this command to see if you can connect to the database.

```
psql -U tfmtest --host=localhost --dbname=tfmtest -W
```

## Set the environment variable for the password

Add this line to `tests/integration/.env`, still assuming the password is "diablo"

```
POSTGRES_INTEGRATION_TEST_PASSWORD=diablo
```

Now you can run the postgresql test.

```
npm run test:integration
```
