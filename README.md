# krakend-keycloak-with-react-and-quarkus

Hello, 

This repository was created for show how to connect the simple login user, with authentication/authorization using Krakend as the gateway. For the backend I've used Quarkus as Rest Client to do the integrations, this it the final structure:

Frontend:
- [React](https://react.dev/)

Gateway:
- [Krakend](https://www.krakend.io/)

Authorization and Authentication:
- [Keycloak](https://www.keycloak.org/)

Backend:
- [Quarkus](https://quarkus.io/) (using rest client)

I've used [Vite](https://vitejs.dev/) for the creation of the [React](https://react.dev/) project at the version "18.2.0", so the configuration is simple and the additional dependencies are:
- "@nextui-org/react" (lib for the UI)
- "@reduxjs/toolkit"
- "js-cookie"
- "react-redux"
- "react-router-dom"

Quarkus project was generated through [Code Quarkus](https://code.quarkus.io/) at the version "3.12.1" with these aditional dependencies:
- quarkus-smallrye-openapi (optional - swagger)
- quarkus-rest-jackson
- quarkus-config-yaml (optional)
- quarkus-spring-web (optional - just to facilitate some integration)
- quarkus-smallrye-jwt
- quarkus-rest-client
- lombok
- quarkus-keycloak-admin-rest-client

Krakend is being used with the version "3" and Keycloak at the version "24.0.3";

The running container to be used is the [Podman](https://podman.io/), so let's get started.

### Containers

The project is using Podman, so first we need to create the network who is going to be used by the containers.

Run ```sudo podman network create krakend```

Now let's create the containers for Keycloak with those commands, remember for this demo I'm using the postgres approach:

- Postgres:

```sudo podman run --name postgresql -e POSTGRES_PASSWORD=password -e POSTGRES_DB=krakend -e POSTGRES_USER=krakend -p 5432:5432/tcp --net krakend --memory-reservation=2048 --restart always -v postgresql_data:/var/lib/postgresql/data -i docker.io/postgres:16```

- Keycloak:

```sudo podman run --name oauth -e KC_DB=postgres -e KC_DB_USERNAME=krakend -e KC_DB_PASSWORD=password -e KC_DB_URL=jdbc:postgresql://postgresql/krakend -e KC_DB_URL_PORT=5432 -e KC_HEALTH_ENABLED=true -e KC_METRICS_ENABLED=true -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin -p 8080:8080/tcp --net krakend --restart always --requires postgresql -i quay.io/keycloak/keycloak start-dev```

So now, go to http://localhost:8080 and check if the Keycloak is running and enter the username and password with "admin" to enter in your local Keycloak.
Create your new realm for your project and keep going with your local setup.

<b>Remember</b>: if you already has some configuration export then and use it when creating your Keycloak container.

For the Krakend, you can use or not the Krakend Designer locally to generate the json, it's up to you!

- Krakend:

```sudo podman run --name krakend -e KRAKEND_PORT=9090 -p 9090:9090/tcp --net krakend -v krakend:/etc/krakend --entrypoint '[ "/usr/bin/krakend" ]' -i docker.io/devopsfaith/krakend:2.6-watch run --debug --config /etc/krakend/krakend.json --port 9090```

To access your gateway now, you can just call your gateway in the address http://localhost:9090. If you test in the browser you should see something like: "404 page not found" message.

- Krakend - Designer (Optional): 

```sudo podman run --name krakend-designer -p 8401:80/tcp --net krakend -v krakend:/etc/krakend -i docker.io/devopsfaith/krakendesigner:latest```

Krakend Designer is available at http://localhost:8401, load your json or create your own configuration.