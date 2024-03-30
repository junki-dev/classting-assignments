run:
	docker-compose up -d

down:
	docker-compose down -v

e2e:
	yarn install --frozen-lockfile
	yarn test:e2e

e2e-cov:
	yarn install --frozen-lockfile
	yarn test:e2e-cov