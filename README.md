YAAK - Angular kickstarter
==========================

##TL;DR

DEV:

1- `npm install`
2- `npm run start`
3- Code your app

PROD
1- `npm install`
2- `npm run build`
3- Serve the content of dist/public with your server

##Simple AngularJS skeleton

Yet another AngularJS kickstarter, seed, bootstrap, boilerplate, stub, skeleton or whatever you want to name it. Why?  
Because I wanted to quickly start a new AngularJS project and didn't find what I wanted: a simple and light Angular seed with dependencies injection, development tools and nice build scripts. I didn't want to use Yeoman, ng-boilerplate or other well-known seeds that embed too many things and need some times to understand how everything is wired together (ultimate-seed MEAN stack?). 
So here it is, I made mine as I want it to be.

A simple Angular kickstarter skeleton that rely on gulp automation to automagically inject js and css bower dependencies and your custom code files into the project main file. It comes with a build process and a light web server for development.  
The build process generates angular templates from your html files and prepare your angular code for minification and then minify and concatenate all your code and reinject it in the project main file.

Please if you see something wrong or bad, tell me.
Feel free to use it limitless, contribute to enhance it, watch it, to star it and to fork it, enjoy :)


Images must be add in the app/public/images folder.

####Including

- AngularJS
- jQuery
- bootstrap
- angular-fontawesome
- bootstrap
- moment
- lodash
- log-ex
- ...

See `packages.json` and `bower.json` for complete list and versions.

####Requirements
`nodejs` and `npm`

######Note
Note that it's possible that you face permissions issues if you run or not `npm` with `sudo` and/or if you have some dependencies installed globally.
If it's the case, try to run with path from the `node_modules` folder like: `node_modules/bower/bin/bower install` or `node_modules/gulp/bin/gulp.js`.  
Hint: _check the rights / owner on your .npm content, or ask google :)_

####Install
Simply run `npm install` then `bower install` to install dependencies. The bower post install script will inject the js and css files ref in the main html file, prepare the fonts and create the partials angular js templates.

To run the local web server and watch files modifications to reload the app in the browser automagically on changes, use the command `gulp` (gulp default task) in a terminal, this would normaly open your web browser at the address `localhost:4242`.

The main gulp task creates a `.tmp` folder in `app/public` with a partials folder witch contains your html partials computed as angular js templates and a css folder witch contains your css autoprefixed. The build phase rely on these computed files.

See `gulpfile.js` for more details on tasks.

####i18n
By default, angularJS embed the `en-en` locale. So if you just need your app to be localized in english it's fine (the locale defines dates, numbers, currencies, ... formatting). If you want your app to be localized in one other locale or several others, you need to add their locale files.

So, I have added the `bower-angular-i18n` package in the bower dependencies. It contains the angular `ngLocale` files for internationalization (see `/app/public/bower_components/angular-i18n/`). 

To add an other default or add more locale, you need to tell wihch file from `/bower_components/angular-i18n/` need to be injected in the app by the gulp script.  
To do so, just go in the `bower.json` file and add an override object to the `overrides` object with the name of the package (`angular-i18n`) and in the `main` property add the file name to inject or an array of file names to be injected.
For example to make my app localized in french by default, the angular-i18n overrides will be:

```
"angular-i18n": {
    "main": "angular-locale_fr-fr.js"
},
```

If you want to know more about angular's i18n support go to [https://docs.angularjs.org/guide/i18n](https://docs.angularjs.org/guide/i18n).

####Build
To build the project run `gulp build`, it will prepare the project for production in the `dist` folder, then you can test the dist by running `gulp dist-webserver`.

######Tip
Before bringing your project live, you might want to make your app faster by disabling debug data in the `$compileProvider`.

[Jeff Cross & Brian Ford](https://www.youtube.com/watch?v=ojMy6m_fcxc&list=UUEGUP3TJJfMsEM_1y8iviSQ) annonce that the improvements are:

<table>
    <thead>
        <tr>
            <td></td>
            <td>time (ms)</td>
            <td>garbage (kb)</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>DOM manipulation</td>
            <td>44% faster</td>
            <td>73% less</td>
        </tr>
        <tr>
            <td>Digest</td>
            <td>28% faster</td>
            <td>na</td>
        </tr>
    </tbody>
</table>
  
To do this, go to the `app.module.js` file and in `app.config()` change `$compileProvider.debugInfoEnabled(true);` to `$compileProvider.debugInfoEnabled(false);`

####Dependencies injection explanations
_These explanations are based on js injection in the index.html file (it's the same thing for css files)._  

`wiredep`and `gulp-inject` uses html comments blocks to inject in place the dependencies files in the index.html file.

Here we have three injection blocks for javascript files. One for bower dependencies, one for our app scripts and one for the html templates converted to angular templates js files:

```
 <!-- build:js ./js/vendor.min.js -->
 <!-- bower:js -->
 <!-- endbower -->
 <!-- endbuild -->
   
 <!-- build:js ./js/app.min.js -->
 <!-- inject:js -->
 <!-- endinject -->
 <!-- endbuild -->
    
 <!-- build:js ./js/templates.min.js -->
 <!-- inject:partials -->
 <!-- endinject -->
 <!-- endbuild -->
```

A single injection block is an encapsulation of two injection blocks, development and build injections:

```
 <!-- build:js ./js/vendor.min.js -->
    
 <!-- bower:js -->
 <!-- endbower -->
    
 <!-- endbuild -->
```

During development phase, gulp tasks will inject your dependencies in the `bower:[type] ... endbower` and `inject:[type/name] ... endinject` blocks and let the injection comments in place:

```
 <!-- build:js ./js/app.min.js -->
 <!-- inject:js -->
 <script src="js/app.js"></script>
 <script src="js/controllers/testcontroller.js"></script>
 <!-- endinject -->
 <!-- endbuild -->
```

During the build phase, gulp tasks will take the injections out of the blocks and process the corresponding files, place them in the dist directory and reinject them in place in the `build:[type] [path] ... endbuild` blocks and delete the injection comments in the dist folder's index.html file:

```
 <!-- scripts -->
 <script src="./js/vendor.min.js"></script>
 <script src="./js/app.min.js"></script>
 <script src="./js/templates.min.js"></script>
```
---
Made easier with <3 by [@ArthurMaroulier](https://twitter.com/ArthurMaroulier)

===

####License

The MIT License (MIT)

Copyright (c) 2016 Arthur Maroulier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

