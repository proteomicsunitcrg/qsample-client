# QSample Client

## Install and launch the development environment

### Requirements

First of all install the latest stable version of **[Node.js](https://nodejs.org/en/about/releases/)**

Install **[NPM (Node Packet Manager)](https://docs.npmjs.com/cli/v7/commands/npm-install)**. Node.js installs it, check your version with `npm -v`

Install **[Angular CLI](https://angular.io/cli)** with the following command:

`npm install -g @angular/cli`

### Environments

Angular works with environments to separate prod, dev and test, by default the development server starts with the dev environment. The environments have important variables like the backend URL.

### Sarting dev server

Install the needed node modules with `npm install`. This command install all the modules and dependencies that the project needs to work. It can take a while to complete.

Then run the project with `ng serve` to start the development server with the dev environment active.

## Compile the project

Compile the project clicking at the play button in transpile:prod (or transpile:test, depending on the desired environment).

![Compile Angular](images/compileAngular.png)

You can also use:

`node --max_old_space_size=8196 node_modules/@angular/cli/bin/ng build --configuration=production`

To achieve the same result.

Both methods will create a `dist` folder with the compiled files.

## Deploy the project

Compile: `node --max_old_space_size=8196 node_modules/@angular/cli/bin/ng build --configuration=production`

Send the compiled files to the server:

`scp -r dist/* admin@10.102.1.26:/home/admin/temp`

Make a backup of the actual prod files:

`cp -r /var/www/html/qsample/* /home/admin/backup`

And then delete the old prod files and send the new files to the Apache2 folder

`rm -rf /var/www/html/qsample/*`

`cp -r /home/admin/temp/qsample-client/* /var/www/html/qsample/`

Sometimes the `.htaccess` file is deleted. In this case just use the one in QCloud2 folder:

`cp /var/www/html/qcloud2/.htaccess /var/www/html/qsample/`

Go to your favorite web browser and test if it works (Remember to clear the cache `Ctrl + shift + r`).

*Obviously everthing works*

## Errors

Be sure that the front end is pointing to the correct back end. Check it using the dev tools -> network.

## References

[Getting started with Angular](https://angular.io/start)

---

Document created by *[Marc](mailto:vesperon51@gmail.com)* with [love](https://i.imgur.com/cvWpdOP.jpg).

4/10/2021
