require_relative 'verse_bundle'

puts """
pragma journal_mode = delete;
pragma page_size = 1024;

drop table if exists sermons;
drop table if exists sermon_passages;

create table sermons(
  id integer primary key,
  title text not null,
  link text not null,
  date text not null,
  type text,
  preacher text not null,
  audio text,
  notes text,
  video text,
  passages text not null
);

create table sermon_passages(
  sermon_id integer,
  passage text,
  foreign key(sermon_id) references sermons(id)
);
"""

filename = File.dirname(__FILE__) + '/../table-sermons.tsv'
File.readlines(filename, chomp: true).each do |line|
  values = line.strip.split("\t")
  sermon_id = values.first
  passages = values.last
  vb = VerseBundle.new(passages)
  new_values = values[0..-2] + [vb.to_s]

  puts "insert into sermons(id,title,link,date,type,preacher,audio,notes,video,passages) values(#{new_values.map{|v| v.inspect}.join(",")});".gsub('\"', '""')

  vb.to_a.each do |v|
    puts "insert into sermon_passages(sermon_id, passage) values(#{sermon_id}, #{v.inspect});"
  end
end

puts "create index sp1 on sermon_passages(passage);"
