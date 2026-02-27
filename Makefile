.PHONY: dev up down build logs restart clean install

# Subir em modo dev (sem rebuild)
dev:
	docker compose up -d

# Subir com rebuild (quando mudar package.json)
build:
	docker compose up --build -d

# Rebuild forçado sem cache (quando deps não atualizam)
rebuild:
	docker compose build --no-cache && docker compose up -d

# Parar tudo
down:
	docker compose down

# Reiniciar containers
restart:
	docker compose restart

# Ver logs (todos)
logs:
	docker compose logs -f

# Logs do frontend
logs-front:
	docker compose logs -f frontend

# Logs do backend
logs-back:
	docker compose logs -f backend

# Status dos containers
ps:
	docker compose ps

# Limpar tudo (volumes inclusos)
clean:
	docker compose down -v --rmi local

# Instalar deps no frontend (sem rebuild)
install:
	docker compose exec frontend npm install
