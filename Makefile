overmind: soundfonts
	overmind start
.PHONY: overmind

soundfonts:
	ln -s "$$SOUNDFONTS_DIR" ./
