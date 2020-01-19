FROM node:13

WORKDIR /api

# устанавливаем зависимости
COPY package*.json ./

RUN npm install
# Для использования в продакшне
# RUN npm install --production

# Копирование файлов проекта
COPY . .

# Уведомление о порте, который будет прослушивать работающее приложение
EXPOSE 3000

# Запуск проекта для разработки
CMD ["npm", "run", "start-dev"]

# Запуск проекта для production
#CMD ["npm", "run", "start"]