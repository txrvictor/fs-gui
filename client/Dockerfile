FROM node:18-alpine

WORKDIR /app

CMD ["npm", "install"]

# running/serving in dev mode to watch file changes for simplicity
# in production it should be built and served as a bundle over
# some static hosting service
CMD ["npm", "run", "dev"]
