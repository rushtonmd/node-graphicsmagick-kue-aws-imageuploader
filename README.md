Image Uploader Example: Node, Kue, S3, and GraphicsMagick
=========================================

## Description

I had a project where I needed to upload an image, resize it into various sizes, and store it in S3. I wanted to create a small sample of something similar so that I can use it again. 

This application uploads an file selected by the user, converts it to 3 different sizes, and saves them all in unique locations on S3.

## Libraries Used

* Node.js
* [Kue](http://learnboost.github.io/kue/) (priority job queue)
* Redis (required for Kue)
* Amazon AWS S3 (storage)
* [GraphicsMagick](http://aheckmann.github.io/gm/) (image processing)

## Usage

Just update the config.js file with your AWS credentials and you should be good to go! 

