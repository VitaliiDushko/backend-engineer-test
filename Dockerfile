# Stage 1: Build the application using Bun
FROM oven/bun:1 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and bun.lockb
COPY package.json bun.lockb ./

# Install dependencies using Bun
RUN bun install

# Copy the rest of the application code
COPY . .

# Build the NestJS app
RUN bun run build

# Stage 2: Create the final image with only necessary files
FROM oven/bun:1

# Set the working directory
WORKDIR /usr/src/app

# Copy only production dependencies from the build stage
COPY --from=build /usr/src/app/package.json /usr/src/app/bun.lockb ./
RUN bun install --production

# Copy built files from the build stage
COPY --from=build /usr/src/app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Set the command to start the app
CMD ["bun", "run", "start"]