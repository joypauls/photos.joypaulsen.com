.PHONY: manifest
manifest:
	npm run manifest

.PHONY: dev
dev:
	npm run dev

.PHONY: update
update: manifest
	# add cloudflare stuff
	