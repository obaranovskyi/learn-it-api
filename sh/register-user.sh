# To make script runnable
# chmod u+x filename

# Register user
curl -X POST -H "Content-Type: application/json" \
    -d '{"username": "obaranovskyi", "password": "@ValidPass123"}' \
    http://localhost:3000/register
