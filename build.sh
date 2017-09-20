#!/usr/bin/env bash
ng build --prod --aot=false
mv dist/assets/manifest.webapp dist/
