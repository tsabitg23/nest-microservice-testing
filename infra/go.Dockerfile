# Use an official Golang runtime as a parent image
FROM golang:1.22-alpine AS build-stage

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum to download dependencies
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download


# Copy the local package files to the container
COPY . .

# Build the Go application
RUN CGO_ENABLED=0 GOOS=linux go build -o /main main.go
RUN touch /.env
#
#RUN ["ls", "/"]

FROM gcr.io/distroless/base-debian11 AS build-release-stage

WORKDIR /

COPY --from=build-stage /main /main
COPY --from=build-stage /.env /.env
ENTRYPOINT ["/main"]
