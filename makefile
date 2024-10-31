jsRunner=bun
pyRunner=python3
reqFile=requirements.txt
venvDir=venv

SHELL := /bin/bash
USER := $(shell whoami)
PROJECT := /home/$(USER)/laborky

feUpdate:
	cd FrontEnd && $(jsRunner) install && $(jsRunner) update 

beUpdate:
	cd BackEnd && sed 's/==/>=/g' $(reqFile) && $(pyRunner) -m venv $(venvDir) && source $(venvDir)/bin/activate && pip install -r $(reqFile) --upgrade && pip freeze > $(reqFile) && rm -rf $(venvDir)

preInstall:
	sudo apt install unzip cron -y
	curl -fsSL https://get.docker.com | sudo bash
	curl -fsSL https://bun.sh/install | bash
	source /home/$(USER)/.bashrc

postInstall:
	sudo chown -R $(USER) $(PROJECT)
	sudo chmod -R 755 $(PROJECT)
	sudo groupadd -f docker && sudo usermod -aG docker $(USER) && newgrp docker

dockerup:
	cd FrontEnd && $(jsRunner) install
	docker compose up --build -d

dockerdown:
	docker compose down

install: preInstall postInstall 

start: dockerup

update: feUpdate beUpdate dockerup

stop:  dockerdown

.PHONY: install start update stop 
