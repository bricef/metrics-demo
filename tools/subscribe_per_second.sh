#!/bin/bash


RATE=${1:-1}
ENDPOINT="http://localhost:3000/mighty-fine/api/subscribe"
PAYLOAD="{}"

while true; do
  # this is an ugly hack to get around the fact 
  # that we can't do floating point math in bash
  for i in $(seq $RATE); do
    curl -d "$PAYLOAD" -H "Content-Type: application/json" -X POST $ENDPOINT
  done
  sleep 1
done
