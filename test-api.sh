#!/bin/bash

# --------------------------------------------------

API_HOST_URL="http://127.0.0.1:3000"
TEXT_GENERATION_WEBUI_API_HOST_URL="http://127.0.0.1:5000/api/v1"

# --------------------------------------------------

while true; do
  echo -n "User Prompt: "
  read user_input

  # curl -X POST ${API_HOST_URL}/speech \
  # curl -X POST ${API_HOST_URL}/chat \
    # -H "Content-Type: application/json" \
    # -d '{"userInput": "'"${user_input}"'"}' |
    # sed 's/['\'']/_/g' |
    # sed 's/['\"']/\\&/g' |
    # sed 's/.*/"&"/' |
    # jq .

  curl -X POST ${TEXT_GENERATION_WEBUI_API_HOST_URL}/chat \
    -H "Content-Type: application/json" \
    -d '{"user_input": "'"${user_input}"'", "character": "sigma", "mode": "chat"}' |
    sed 's/['\'']/_/g' |
    sed 's/['\"']/\\&/g' |
    sed 's/.*/"&"/' |
    jq .
done
