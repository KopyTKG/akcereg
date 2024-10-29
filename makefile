jsRunner=bun
pyRunner=python3
reqFile=requirements.txt
venvDir=venv

SHELL := /bin/bash

feUpdate:
	cd FrontEnd && $(jsRunner) install && $(jsRunner) update 

beUpdate:
	cd BackEnd && sed 's/==/>=/g' $(reqFile) && $(pyRunner) -m venv $(venvDir) && source $(venvDir)/bin/activate && pip install -r $(reqFile) --upgrade && pip freeze > $(reqFile) && rm -rf $(venvDir)

deps:
	sudo apt install -y unzip cron 
	curl -fsSL https://get.docker.com | sudo bash
	curl -fsSL https://bun.sh/install | bash

dockerup:
	sudo docker compose up --build -d

dockerdown:
	sudo docker compose down


install: deps feUpdate beUpdate deploy

cron: dockerdown feUpdate beUpdate deploy


.PHONY: feUpdate beUpdate deploy
