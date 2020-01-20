FROM node:13

RUN mkdir -p /home/node/api/node_modules && chown -R node:node /home/node/api

WORKDIR /home/node/api

# устанавливаем зависимости
COPY package*.json ./

USER node

RUN npm install
# Для использования в продакшне
# RUN npm install --production

# Копирование файлов проекта
COPY --chown=node:node . .

# Уведомление о порте, который будет прослушивать работающее приложение
EXPOSE 3000

# Запуск проекта для разработки
CMD ["npm", "run", "dev"]

# Запуск проекта для production
#CMD ["npm", "run", "start"]