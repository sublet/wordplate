#!/bin/bash

echo "What do you want to name your template?"
read input
if [ "$input" == "" ]
then
  echo "ERROR"
else
  export BASEPLATE_FOLDER_NAME=$input
  vagrant up
fi
