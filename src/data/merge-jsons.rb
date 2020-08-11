#!/usr/bin/env ruby
require 'parallel'

folders = `find verses_data -type d`.split
Parallel.each(folders, progress: 'Merging') do |folder|
# folders.each do |folder|
  next if folder[-1] =~ /[A-Za-z]/
  files = `ls #{folder}/*.json 2>/dev/null`.split
  files = files.map{ |f| not f.include?('interpretations') }
  next if files.empty?
  jq = (0..(files.count)).map{|idx| "(.[#{idx}] // {})"}.join(" * ")

  target = folder.sub('verses_data', 'json') + '.json'
  `cat #{folder}/*.json | jq -s '#{jq}' > #{target}`
end
