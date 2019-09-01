exports.up = function(knex) {
  return knex.schema.createTable("users", function(table) {
    table.increments("id");
    table.string("github_id", 255).notNullable();
    table.string("username", 255).notNullable();
    table.string("name", 255).notNullable();
    table.string("website_url", 255);
    table.string("github_url", 255).notNullable();
    table.timestamp("created_at").notNullable();
    table.timestamp("updated_at").notNullable();

    table.unique("github_id");
    table.unique("username");
  });
};

// https://avatars3.githubusercontent.com/u/603921?v=4

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
