
IF "%1" == "clean" GOTO clean

:install

call npm install --save express
call npm install --save express-handlebars
call npm install --save body-parser

call npm install --save-dev mocha
mkdir public/vendor
copy node_modules/mocha/mocha.js public/vendor
copy node_modules/mocha/mocha.css public/vendor

npm install --save-dev chai
copy node_modules/chai/chai.js public/vendor

GOTO exit

:clean
	REM RD /S /Q node_modules/
	goto exit

:exit