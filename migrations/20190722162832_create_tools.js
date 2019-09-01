exports.up = function(knex) {
  return knex.schema.createTable("tools", function(table) {
    table.increments("id");
    table.string("name", 255).notNullable();
    table.string("url", 255).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("tools");
};
