.SILENT:
#==========VARIABLES================================================

nodejs_container = api_nodejs
mongo_container = mongo

#==========MAIN_COMMAND=============================================

up: docker_up info
restart: docker_down up
init: docker_down build up info


#==========COMMAND==================================================

build:
	docker-compose build

docker_up:
	docker-compose up -d

docker_down:
	docker-compose down --remove-orphans

info:
	echo "http://localhost:8000"
	echo "Mailer http://localhost:8001"

permission:
	sudo chmod 777 -R docker

#===================INTO_CONTAINER======================================

node_bash:
	docker exec -it $(nodejs_container) bash

mongo_bash:
	docker exec -it $(mongo_container) bash

#===================LOGS======================================

node_logs:
	docker logs $(nodejs_container)