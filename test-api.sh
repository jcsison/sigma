#!/bin/bash

# --------------------------------------------------

API_HOST_URL="http://127.0.0.1:3000/api"

# --------------------------------------------------

curl -X POST ${API_HOST_URL}/chat \
  -H "Content-Type: application/json" \
  -d '{"userInput": "'"${*}"'"}' |
  sed 's/['\'']//g' |
  sed 's/['\"']/\\&/g' |
  sed 's/.*/"&"/' |
  jq .
