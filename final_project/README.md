Practice-Project

1) 
1-getallbooks.png
curl -X GET http://localhost:5001/

2)
2-gedetailsISBN
curl -X GET http://localhost:5001/isbn/2

3)
3-getbooksbyauthor
curl -X GET http://localhost:5001/author/Unknown
curl -X GET http://localhost:5001/author/Hans%20Christian%20Andersen

4)
4-getbooksbytitle
curl -X GET http://localhost:5001/title/Things%20Fall%20Apart
curl -X GET http://localhost:5001/title/Fairy%20tales

5)
5-getbookreview
curl -X GET http://localhost:5001/review/1
curl -X GET http://localhost:5001/review/2

6)
6-register
curl -X POST http://localhost:5001/register \
     -H "Content-Type: application/json" \
     -d '{"username": "myuser", "password": "mypassword"}'

curl -X POST http://example.com/login \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=user&password=pass"