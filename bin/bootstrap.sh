#!/usr/bin/env bash

# Add something that asks for Theme Name
# http://tecadmin.net/prompt-user-input-in-linux-shell-script/
read -p "What theme folder should we setup? "  theme_folder

debconf-set-selections <<< 'mysql-server-<version> mysql-server/root_password password password'
debconf-set-selections <<< 'mysql-server-<version> mysql-server/root_password_again password password'
debconf-set-selections <<< 'phpmyadmin phpmyadmin/reconfigure-webserver multiselect apache2'
debconf-set-selections <<< 'phpmyadmin phpmyadmin/dbconfig-install boolean true'
debconf-set-selections <<< 'phpmyadmin phpmyadmin/app-password-confirm password'
debconf-set-selections <<< 'phpmyadmin phpmyadmin/mysql/app-pass password'
debconf-set-selections <<< 'phpmyadmin phpmyadmin/mysql/admin-pass password password'

apt-get update
apt-get install -y apache2
apt-get install php5 -y
apt-get install libapache2-mod-php5 -y
apt-get install php5-cli -y
apt-get install php-pear php5-dev -y
apt-get install curl libcurl3 libcurl3-dev php5-curl -y
apt-get install build-essential -y
apt-get install mysql-server mysql-client -y
apt-get install php5-mysql -y
apt-get install phpmyadmin -y

if [ ! -h /var/www ]; 
then 
    rm -rf /var/www sudo 
    ln -s /vagrant /var/www
    a2enmod rewrite
    sed -i '/AllowOverride None/c AllowOverride All' /etc/apache2/sites-available/default
fi

service apache2 restart

# Setup Database
mysql -u root -ppassword -e "CREATE DATABASE wordpress;"
mysql -u root -ppassword -e "CREATE USER 'wp_user'@'localhost' IDENTIFIED BY 'password'"
mysql -u root -ppassword -e "GRANT ALL PRIVILEGES ON *.* TO 'wp_user'@'localhost';"
mysql -u root -ppassword -e "FLUSH PRIVILEGES;"

if [ ! -h /var/www/bin/database.sql ]; 
then
  mysql -u root -ppassword ltp_wordpress < /var/www/bin/database.sql
fi

# Download wordpress
wget http://wordpress.org/latest.tar.gz
tar xfz latest.tar.gz
mv wordpress/* /var/www/
rm -rf wordpress
rm -f latest.tar.gz

# Setup File structure in Theme
mkdir /var/www/wp-content/themes/peru
mkdir /var/www/wp-content/themes/peru/assets
mkdir /var/www/wp-content/themes/peru/assets/coffee
mkdir /var/www/wp-content/themes/peru/assets/sass
mkdir /var/www/wp-content/themes/peru/assets/img
mkdir /var/www/wp-content/themes/peru/assets/bower_components

# Replace stuff in wp-config file

# perl -pi -e 's/THEME_FOLDER/$(theme_folder)/g' .bowerrc
# perl -pi -e 's/THEME_FOLDER/$(theme_folder)/g' gulpfile.js