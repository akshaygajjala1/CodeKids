FROM nginx:alpine

RUN apk add --update nodejs npm
COPY package*.json /opt/app/
WORKDIR /opt/app
RUN npm ci

WORKDIR /
RUN apk add --no-cache --update python3 py3-pip bash
ADD ./server/requirements.txt /tmp/requirements.txt
RUN pip3 install --no-cache-dir -q -r /tmp/requirements.txt --break-system-packages 

ADD . /opt/app
WORKDIR /opt/app
RUN npm run build
COPY ./default.conf.template /etc/nginx/conf.d/
COPY ./nginx.conf /etc/nginx/
COPY ./proxy_params /etc/nginx/
RUN chmod u+w /etc/nginx/ -R
RUN chmod +x ./entrypoint.sh

RUN adduser -D myuser
USER myuser

EXPOSE 8080

ENTRYPOINT ["sh", "./entrypoint.sh"]