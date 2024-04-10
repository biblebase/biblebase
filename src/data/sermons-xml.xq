.rss.channel.item[] | 
  select(."wp:status" == "publish") |
    { title, link, "wp:post_id" } *
    ([.category] | flatten |
      map( .key = ."@domain" | .value = ."#text") |
      from_entries |
      .service_type = .wpfc_service_type) *
    (."wp:postmeta"  |
      map( .key = ."wp:meta_key" | .value = ."wp:meta_value") |
      from_entries) |
    select(.bible_passage | tostring | test("\\d+")) |
    [
      ."wp:post_id",
      .title,
      .link,
      (.sermon_date | tonumber | todate | split("T") | first),
      .service_type,
      .wpfc_preacher,
      .sermon_audio,
      .sermon_notes,
      (.sermon_video | tostring | split("\"") | .[5] ),
      .bible_passage
    ] | @tsv
