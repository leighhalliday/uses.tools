exports.up = function(knex) {
  return knex.schema.table("tools", function(table) {
    table.string("youtube_id");
  });
};

exports.down = function(knex) {
  return knex.schema.table("tools", function(table) {
    table.dropColumn("youtube_id");
  });
};
