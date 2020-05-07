#!/usr/bin/env ruby

folders = `find verses_data -type d`.split
folders.each do |folder|
  next if folder[-1] =~ /[A-Za-z]/
  files = `ls #{folder}/*.json 2>/dev/null`.split
  next if files.empty?
  jq = (0..(files.count)).map{|idx| "(.[#{idx}] // {})"}.join(" * ")

  target = folder.sub('verses_data', 'json') + '.json'
  `cat #{folder}/*.json | jq -s '#{jq}' > #{target}`
end
