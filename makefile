jsRunner=bun

feUpdate:
	cd FrontEnd && bun install && bun update && rm -rf node_modules

beUpdate:
	cd BackEnd && sed 's/==/>=/g' requirements.txt && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt --upgrade && pip freeze > requirements.txt && rm -rf venv

deploy:
	docker compose up --build

.PHONY: feUpdate beUpdate deploy
