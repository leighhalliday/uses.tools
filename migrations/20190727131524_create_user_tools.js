exports.up = function(knex) {
  return knex.schema.createTable("user_tools", function(table) {
    table.increments("id");
    table.integer("user_id").notNullable();
    table.integer("tool_id").notNullable();
    table.integer("category_id").notNullable();
    table
      .integer("position")
      .notNullable()
      .defaultTo(0);
    table.string("url", 255);
    table.text("description").notNullable();
    table.timestamp("created_at").notNullable();
    table.timestamp("updated_at").notNullable();

    table.index("user_id");
    table.index("category_id");
    table.index("tool_id");
    table.unique(["user_id", "tool_id"]);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("user_tools");
};
