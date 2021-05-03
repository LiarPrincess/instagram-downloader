.PHONY: build watch run archive unpack

build:
	./node_modules/.bin/tsc

watch:
	./node_modules/.bin/tsc -w

run: build
	node ./dist/app.js

pack:
	./scripts/pack_archive.sh

unpack:
	./scripts/unpack_archive.sh
