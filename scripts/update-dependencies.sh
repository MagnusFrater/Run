#!/bin/bash

# check for outdated packages
npm outdated

# update any outdated packages
npm update

# re-purpose package-lock.json; help NPM install exactly what you need
npm shrinkwrap
