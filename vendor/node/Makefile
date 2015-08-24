install:
	
	@echo make: installing dependency \'babel\'
	@npm install -g babel
	@npm install --save babel-runtime
	@npm install --save mssql

build: clean
	@mkdir dist
	@babel --stage 0 --optional runtime --out-dir dist src > /dev/null

clean:
ifneq ($(wildcard dist/.*),)
	@rm -r dist
endif

run: build
	@node index.js