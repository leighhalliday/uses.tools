exports.up = function(knex) {
  return knex.schema.table("tools", function(table) {
    table
      .integer("users_count")
      .notNullable()
      .defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.table("tools", function(table) {
    table.dropColumn("users_count");
  });
};
