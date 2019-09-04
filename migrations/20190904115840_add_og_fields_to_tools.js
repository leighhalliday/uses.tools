exports.up = function(knex) {
  return knex.schema.table("tools", function(table) {
    table.timestamp("featured_at");
    table.string("twitter_handle");
    table.string("og_image_url");
    table.string("og_title");
    table.text("og_description");
    table.boolean("og_result");
    table.timestamp("og_synced_at");
  });
};

exports.down = function(knex) {
  return knex.schema.table("tools", function(table) {
    table.dropColumn("featured_at");
    table.dropColumn("twitter_handle");
    table.dropColumn("og_image_url");
    table.dropColumn("og_title");
    table.dropColumn("og_description");
    table.dropColumn("og_result");
    table.dropColumn("og_synced_at");
  });
};
