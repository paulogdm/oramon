
# UBUNTU 
# sudo apt-get install npm
# sudo apt-get install mongodb
# sudo apt-get install nodejs

# ARCH // MANJARO // ANTERGOS
#update
sudo pacman -Syu
#install if needed
sudo pacman -S npm --needed
sudo pacman -S mongodb --needed
sudo pacman -S nodejs --needed

#set oracle paths (VERY IMPORTANT)
#this was accomplished by doing a lot of digging and research
export PATH=/opt/oracle/instantclient_12_1:$PATH
export OCI_LIB_DIR=/opt/oracle/instantclient_12_1
export OCI_INC_DIR=/opt/oracle/instantclient_12_1/sdk/include
export ORACLE_HOME=/opt/oracle/instantclient_12_1
export LD_LIBRARY_PATH=/opt/oracle/instantclient_12_1:$LD_LIBRARY_PATH
npm install
npm install oracledb --save
