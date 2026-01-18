.PHONY: install dev dev-api dev-web test test-api test-web lint build

install:
	cd api && npm install
	cd web && npm install

dev:
	cd api && npm run start:dev & cd web && npm run dev

dev-api:
	cd api && npm run start:dev

dev-web:
	cd web && npm run dev

test:
	cd api && npm test
	cd web && npm test

test-api:
	cd api && npm test

test-web:
	cd web && npm test

lint:
	cd api && npm run lint
	cd web && npm run lint

build:
	cd api && npm run build
	cd web && npm run build
