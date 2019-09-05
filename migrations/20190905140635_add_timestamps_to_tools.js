exports.up = function(knex) {
  return knex.schema.table("tools", function(table) {
    table.timestamp("created_at");
    table.timestamp("updated_at");
  });
};

exports.down = function(knex) {
  return knex.schema.table("tools", function(table) {
    table.dropColumn("created_at");
    table.dropColumn("updated_at");
  });
};
