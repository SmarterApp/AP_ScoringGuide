# Scoring Guide

The Scoring Guide website is a Typescript, Node, and Express Application. It allows users to quickly generate PDF documents with sample questions from the Smarter Balanced test.

## Getting Started

This project was developed using VS Code, but any editor would work. If you are using VS Code, make sure your integrated terminal is set to bash. [This link](https://code.visualstudio.com/docs/editor/integrated-terminal#_configuration) shows you how to change your integrated terminal. 

### Installation
You can install most of the necessary dependencies with the install bash script. Note that you must have Node installed on your machine (version 8 is required for puppeteer).
```sh
# From the root directory
./install
```

You also need to install [wkhtmltopdf](https://wkhtmltopdf.org/downloads.html) and add it to your path. 

<details> 
  <summary>Installing by hand</summary>

1. Install development dependencies from the root directory.
```sh
npm install
```

2. In the **client** directory, install npm dependencies.
```sh
cd client/
npm install
```

3. In the **server** directory, install npm dependencies. Note that you may need to go back to the project's root directory before running the following commands. 
```sh
cd server/
npm install
```
</details>

### Building the project
Scoring Guide uses typescript and less files for both the server and the client, so these need to be compiled before running the app. If you want to run the application while watching for file changes, skip this and go to the [Development](#development) section.

To build, run these commands:
```sh
# Build the TS and LESS files for the server
cd server/
npm run build

# Build the frontend client
cd ../client/
npm run build
```

### Running the project
Once the project has been built, running it is easy; Just launch the compiled server:

```sh
# From the root folder
cd server/
npm start
```

Or, if you prefer to run it directly:
```sh
# From the root folder
node server/dist/Server.js
```

### Development

In Visual Studio Code, you can run the launch configuration **Development** _without debugging_. To do this, click on the Debug icon in the sidebar, select the Development profile, and then press `CTRL/CMD + F5`. This will build all of the necessary server components, run the server, then launch Webpack with the `--watch` flag within the client directory. Upon any changes, either the server code will be rebuilt and re-launched, or the client will be rebuilt without having to restart the server.

In any other editor or IDE, you can use the following commands from a terminal of your choice to get the same result. Note you only need to start watching for changes to webpack once, and that you must keep the process alive to continue watching.
```sh
# Watch, rebuild, and re-launch the server on change
$ cd server/
$ npm run watch

# In a new window, watch and rebuild the client on change
$ cd client/
$ npm run watch
```

### Testing
There is a script in the root directory of the project named 'test'. We're using Jest as our test framework and run two types of tests.  
The first is a deterministic snapshot test. Jest takes a snapshot of the component in it's rendered form and compares it to the 
last known snapshot. When you make changes to a component, the test for that component is DESIGNED TO FAIL. It is your responsibility to 
examine the differences in the snapshots, which will be displayed for you by Jest. If the changes to the snapshot are correct you must 
UPDATE the tests and check in the updated snapshot files into source control WITH YOUR COMMIT.

We are also running unit tests where we render the component in a virtual DOM and simulate click event on buttons and functional pieces 
of the UI. These tests will fail when making changes to the component, it is your responsibility to update these tests to reflect the 
expected behavior, and check them in WITH YOUR COMMIT.

Do not push your changes until you have run and updated the tests.

To run tests:
```
$ ./test
```

To run tests with code coverage:
```
$ ./test -c
```

To update snapshot tests:
```
$ ./test -u
```

## Deployment

### Deployment Checklist
- Ensure that the client has been built.
- Ensure that the server has been built.
- Check the values of the variables in the .env file in the server directory to ensure that values for the API and IVS are correct.

### Packaging the Application
To package the application ensure that you have preformed the steps above in the deployment checklist. Next run the following commands:
```
> docker build -t {desired tag} .
```
After building the docker image verify your build using:
```
> docker run -p 3000:3000 {desired tag}
```
visit localhost:3000 and ensure that the application runs.
Next push the image to docker hub so that it can be deployed.
```
> docker push {desired tag}
```

Now you are ready to deploy the score guide application. See the scoring guide configuration repo for instructions on how to deploy the application.
