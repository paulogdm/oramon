## Synopsis

This is the final project of the discipline SCC0241 (Database Lab). Second half of 2016 @ ICMC USP São Carlos.



# ORAMON - OracleDB Table to MongoDB Doc

## Frameworks and libs

Frontend: Vuejs + MDL (Material Design Lite)

Backend: NodeJS + Express + 


## Installation

Before anything, you need to install Oracle Instant Client!

These links can be useful:

### Windows

THIS IS A MUST >> https://github.com/bchr02/instantclient

http://stackoverflow.com/questions/5809195/installing-oracle-instant-client


### Linux

####Alternative #1 (arch/manjaro/antergos):

1. Download these packages from the link: [Oracle IC Linux x86-x64](http://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html#ic_x64_inst)

	*instantclient-basic-linux.x64-12.1.0.2.0.zip

	*instantclient-sdk-linux.x64-12.1.0.2.0.zip

	*instantclient-odbc-linux.x64-12.1.0.2.0.zip 

2. Extract and copy all zips to /opt/oracle, you may need to create the dir "oracle".

3. Run install.sh

####Alternative #2 (DIY):

(Check page foot)
http://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html#ic_x64_inst

https://wiki.archlinux.org/index.php/Oracle_client

####General instructions:

1. Download ZIPs.

2. Set environment variables (VERY IMPORTANT).

3. Run `npm install` 


`npm install`

## Running

`node server.js`

Browse `localhost:1337/`


## Authors

Henrique Pasquini Santos 		riquepasq@gmail.com


Paulo Guarnier De Mitri 		paulo.mitri@usp.br


## License

See License.md
