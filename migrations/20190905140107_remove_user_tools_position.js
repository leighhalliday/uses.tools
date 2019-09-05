exports.up = function(knex) {
  return knex.schema.table("user_tools", function(table) {
    table.dropColumn("position");
  });
};

exports.down = function(knex) {
  return knex.schema.table("user_tools", function(table) {
    table
      .integer("position")
      .notNullable()
      .defaultTo(0);
  });
};
