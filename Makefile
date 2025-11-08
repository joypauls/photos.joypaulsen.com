.PHONY: manifest
manifest:
	npm run manifest

.PHONY: dev
dev:
	npm run dev

.PHONY: update
update: manifest
	rclone sync assets/originals cloudflare:photos/originals --fast-list
	rclone sync assets/previews cloudflare:photos/previews --fast-list

.PHONY: bucket
bucket:
	rclone lsd cloudflare:photos 
	