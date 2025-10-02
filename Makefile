install:
	npm ci && npm -C backend ci && npm -C frontend ci && make migration-run

start:
	pm2 start "make start-backend" -n logic-like

start-backend:
	npm run start-local --prefix backend

start-frontend:
	npm run start --prefix frontend

migration-run:
	npm run migration:run --prefix backend