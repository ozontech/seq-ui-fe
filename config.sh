CONFIG_JSON=$(cat /usr/share/nginx/html/config.json)
CONFIG_JS="window.__CONFIG__ = ${CONFIG_JSON}"

echo "${CONFIG_JS}" > /usr/share/nginx/html/config.js

nginx -g "daemon off;"
