#!/bin/bash

# abort if any command fails
set -e

dir=$(dirname "$0")
cd ${dir}/..
docker-compose -f docker-compose.yml -f docker-compose.provider.yml build notification notification-db rabbitmq
docker-compose -f docker-compose.yml -f docker-compose.provider.yml up --exit-code-from notification notification notification-db rabbitmq
