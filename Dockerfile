FROM node:24.11-alpine
WORKDIR /usr/src/app
COPY package*.json .
COPY prisma ./prisma/
RUN npm ci && npm cache clean --force
COPY . .
RUN npx prisma generate
RUN npm run build

RUN rm -rf src prisma test *.ts *.tsx && \
    find . -name "*.ts" ! -path "*/node_modules/*" -delete

EXPOSE 4000
CMD ["npm", "run", "start:docker"]