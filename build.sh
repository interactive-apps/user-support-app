#!/usr/bin/env bash
ng build --prod --aot=false
mv dist/assets/manifest.webapp dist/
cp -r dist/* /opt/dhis/config/apps/usersupport/
cd dist
#Compress the file
echo "Compress the file"
zip -r -D usersupport.zip .
echo "Install the app into DHIS Siera Lione"
curl -X POST -u admin:district -F file=@usersupport.zip https://play.dhis2.org/demo/api/apps
echo "Install the app into DHIS hisptz"
curl -X POST -u admin:district -F file=@usersupport.zip https://play.hisptz.org/27/api/apps
echo "app installed into DHIS"
