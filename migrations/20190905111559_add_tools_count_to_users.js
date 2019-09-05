exports.up = function(knex) {
  return knex.schema.table("users", function(table) {
    table
      .integer("tools_count")
      .notNullable()
      .defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.table("users", function(table) {
    table.dropColumn("tools_count");
  });
};
