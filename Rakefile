require 'jasmine'
require 'sprockets'
load 'jasmine/tasks/jasmine.rake'

# default
task :default => ["jasmine:ci"]

# settings
VERSION = "0.9.0"
ROOT = File.dirname(__FILE__)
SOURCE_DIR = "src"
BUILD_DIR = "lib"
SOURCE_JS = "application.js"
BUILD_JS = "neato-#{VERSION}.min.js"

# env
ENV['JASMINE_CONFIG_PATH'] = File.join(ROOT, "jasmine.yml")

# tasks
desc "Build library"
task :build do
  # init environment
  environment = Sprockets::Environment.new(ROOT)
  environment.js_compressor  = :uglify
  environment.append_path SOURCE_DIR

  # get asset content
  asset = environment.find_asset(SOURCE_JS)
  javascript_content = asset.to_s

  # add copyright notice
  javascript_content = %Q(/**
 *  Neato SDK Javascript
 *  https://github.com/NeatoRobotics/neato-sdk-js
 *
 *  Copyright (c)2016 Neato Robotics, Inc.
 *  Author: Roberto Ostinelli
 *
 *  Version: #{VERSION}
 */
) + javascript_content + "\n"

  # write to file
  File.open(File.join(ROOT, BUILD_DIR, BUILD_JS), 'w') { |file| file.write(javascript_content) }
end
