jsRunner=bun
pyRunner=python3
reqFile=requirements.txt
venvDir=venv

USER := $$(whoami)
SHELL := /bin/bash
PATH := /home/$(USER)/laborky

feUpdate:
	cd FrontEnd && $(jsRunner) install && $(jsRunner) update 

beUpdate:
	cd BackEnd && sed 's/==/>=/g' $(reqFile) && $(pyRunner) -m venv $(venvDir) && source $(venvDir)/bin/activate && pip install -r $(reqFile) --upgrade && pip freeze > $(reqFile) && rm -rf $(venvDir)

preInstall:
	sudo apt install unzip cron python3.12-venv -y
	curl -fsSL https://get.docker.com | sudo bash
	curl -fsSL https://bun.sh/install | bash
	source /home/$(USER)/.bashrc

postInstall:
	sudo groupadd docker && sudo usermod -aG docker $(USER) && newgrp docker
	sudo chown -R $(USER) $(PATH)
	sudo chmod -R 710 $(PATH)

setupCron:
	sudo systemctl enable cron
	sudo systemctl start cron
	(crontab -l 2>/dev/null; echo "40 5 * * 0 $(PATH)/make cron") | crontab -
	crontab -e

dockerup:
	docker compose up --build -d

dockerdown:
	docker compose down



install: preInstall postInstall feUpdate beUpdate setupCron dockerup

cron: dockerdown feUpdate beUpdate dockerup


.PHONY: feUpdate beUpdate dockerup dockerdown install cron
