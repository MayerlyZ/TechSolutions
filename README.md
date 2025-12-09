 # TechSolutions Project

TechSolutions is a full-stack web application designed to manage and track technical support tickets. It allows users to create, view, update, and delete tickets, facilitating efficient problem resolution.

## Technologies Used

This project is built using a modern MERN stack:

-   **MongoDB**: NoSQL database used to store application data, such as ticket and user information.
-   **Express.js**: Backend framework for Node.js, responsible for creating the REST API that manages all business logic and communication with the database.
-   **React**: Frontend library for building the user interface, allowing the creation of dynamic and interactive components.
-   **Node.js**: Server-side runtime environment, allowing JavaScript to run on the backend.
-   **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js. It simplifies interaction with the database and the definition of data schemas.


## Prerequisites

Before you begin, make sure you have the following installed:
- Node.js (v18.17 o superior)
- A package manager like `npm`, `yarn`, `pnpm`, or `bun`
- A MongoDB instance (it can be local or on a cloud service like MongoDB Atlas)

## Getting Started

Follow these steps to set up and run the project in your local environment.

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone <REPOSITORY_URL>
cd TechSolutions
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

### 2. Configuración de la Base de Datos

Este proyecto requiere una conexión a una base de datos MongoDB. Deberás configurar la variable de entorno con tu cadena de conexión.

1.  Crea un archivo `.env.local` en la raíz del proyecto.
2.  Añade tu cadena de conexión de MongoDB al archivo:

    ```
    MONGODB_URI="mongodb+srv://<usuario>:<password>@<cluster>/?retryWrites=true&w=majority"
    ```

### 3. Correr el Servidor de Desarrollo

Una vez instaladas las dependencias y configurada la base de datos, ejecuta el servidor de desarrollo:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
