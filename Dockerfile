# syntax=docker/dockerfile:1
FROM nginx:alpine

ENV PORT=10000
EXPOSE 10000

COPY index.html style.css script.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
