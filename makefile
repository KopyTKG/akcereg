jsRunner=bun
reqFile=requirements.txt
venvDir=venv

feUpdate:
	cd FrontEnd && $(jsRunner) install && $(jsRunner) update 

beUpdate:
	cd BackEnd && sed 's/==/>=/g' $(reqFile) && python -m venv $(venvDir) && source $(venvDir)/bin/activate && pip install -r $(reqFile) --upgrade && pip freeze > $(reqFile) && rm -rf $(venvDir)

deps:
	curl -fsSL https://get.docker.com | sudo bash
	curl -fsSL https://bun.sh/install | bash


deploy:
	docker compose up --build -d

full: feUpdate beUpdate deploy

.PHONY: feUpdate beUpdate deploy
