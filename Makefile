.SILENT:
#==========VARIABLES================================================

nodejs_container = api_nodejs

#==========MAIN_COMMAND=============================================

up: docker_up
restart: docker_down up
init: docker_down build up


#==========COMMAND==================================================

build:
	docker-compose build

docker_up:
	docker-compose up -d

docker_down:
	docker-compose down --remove-orphans

#===================INTO_CONTAINER======================================

node_bash:
	docker exec -it $(nodejs_container) bash

#===================LOGS======================================

node_logs:
	docker logs $(nodejs_container)