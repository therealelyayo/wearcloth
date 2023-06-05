echo "Rebooting/Updating nkp instance"

sleep 3

echo "Stopping Services that may conflict"
service apache2 stop

service nginx stop

npm run stop


echo "Updating nkp to the latest"

git pull origin master

if [ $? -ne 0 ]
then
    git stash
    git pull origin master

fi


echo "Starting nkp"
npm run start


echo "Update/Reboot Done successfully..."






