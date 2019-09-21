exports.up = async function(knex) {
  await knex.schema.table("users", function(table) {
    table.timestamp("tweeted_at");
  });
  await knex.schema.table("tools", function(table) {
    table.timestamp("tweeted_at");
  });
};

exports.down = async function(knex) {
  await knex.schema.table("users", function(table) {
    table.dropColumn("tweeted_at");
  });
  await knex.schema.table("tools", function(table) {
    table.dropColumn("tweeted_at");
  });
};
