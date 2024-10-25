jsRunner=bun
pyRunner=python3
reqFile=requirements.txt
venvDir=venv

USER := $$(whoami)
SHELL := /bin/bash

feUpdate:
        cd FrontEnd && $(jsRunner) install && $(jsRunner) update 

beUpdate:
        cd BackEnd && sed 's/==/>=/g' $(reqFile) && $(pyRunner) -m venv $(venvDir) && source $(venvDir)/bin/activate && pip install -r $(reqFile) --upgrade && pip freeze > $(reqFile) && rm -rf $(venvDir)

deps:
        sudo apt install unzip python3.12-venv -y
        curl -fsSL https://get.docker.com | sudo bash
        curl -fsSL https://bun.sh/install | bash
        source /home/$(USER)/.bashrc

deploy:
        sudo docker compose up --build -d

full: deps feUpdate beUpdate deploy

.PHONY: feUpdate beUpdate deploy





