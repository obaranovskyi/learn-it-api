Some columns might appear even removing the field from entity and database. In that case what can help is to drop ./dist workspace.

to stop localhost on linux:
```bash
sudo lsof -iTCP:3000 -sTCP:LISTEN
```
next select pid(12017 is the process pid):
```bash
kill -9 12017
```
