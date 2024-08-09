envsubst '\${PORT}' < /etc/nginx/conf.d/default.conf/template > /etc/nginx/conf.d/default.conf &&
nginx -g 'daemon off;' & 
cd server && gunicorn -w 1 --threads 10 -b 127.0.0.1:5000 app:app &
PORT=8000 node build &
wait -n
exit $?