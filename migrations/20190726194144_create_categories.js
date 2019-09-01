exports.up = function(knex) {
  return knex.schema.createTable("categories", function(table) {
    table.increments("id");
    table.string("slug", 255).notNullable();
    table
      .integer("position")
      .notNullable()
      .defaultTo(0);
    table.string("name", 255).notNullable();
    table.text("description");

    table.index("slug");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("categories");
};
