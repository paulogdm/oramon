export PATH=/opt/oracle/instantclient_12_1:$PATH
export OCI_LIB_DIR=/opt/oracle/instantclient_12_1
export OCI_INC_DIR=/opt/oracle/instantclient_12_1/sdk/include
export ORACLE_HOME=/opt/oracle/instantclient_12_1
export LD_LIBRARY_PATH=/opt/oracle/instantclient_12_1:$LD_LIBRARY_PATH
export TNS_ADMIN=./
node server.js
