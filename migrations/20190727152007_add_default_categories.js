exports.up = async function(knex) {
  let position = 0;

  await knex("categories").insert({
    name: "Workstation",
    slug: "workstation",
    position: position++,
    description: "Physical tools relating to your desk, computer, chair, etc..."
  });

  await knex("categories").insert({
    name: "Development",
    slug: "development",
    position: position++,
    description:
      "What software do you use to get your work done? Do you work with a specific browser, a VS Code theme you really love, a color picker, database client, etc... These are your go-to tools of the trade."
  });

  await knex("categories").insert({
    name: "Design",
    slug: "design",
    position: position++,
    description:
      "Is there specific software you love to do your design and UI related work with? Do you prefer Figma over Sketch, or Photoshop over Pixelmator?"
  });

  await knex("categories").insert({
    name: "Hosting",
    slug: "hosting",
    position: position++,
    description:
      "What's your go to hosting platform? If you were to start a new project today, would you immediately opt for Zeit Now, or is Digital Ocean your old-faithful? Where do you register your domain names?"
  });

  await knex("categories").insert({
    name: "Productivity",
    slug: "productivity",
    position: position++,
    description:
      "These aren't dev-tools per se, but you use them every day and they're integral to getting your job done. Do you require a VPN? Do you store all your passwords on sticky-notes or do you put them in Buttercup? Do you use Slack just to set reminders for yourself?"
  });

  await knex("categories").insert({
    name: "Business",
    slug: "business",
    position: position++,
    description:
      "If you run a business, how do you do your accounting, handle customer support, do your email marketing?"
  });

  await knex("categories").insert({
    name: "Podcasting / Screencasting",
    slug: "podcasting-screencasting",
    position: position++,
    description:
      "This isn't for everyone, but a lot of developers appear on podcasts, have a YouTube channel, or just want specialty audio & video equipment for their Zoom standups every day. Looking and sounding your best isn't a crime! What gear and software do you use for this?"
  });
};

exports.down = async function(knex) {
  await knex("categories").del();
};
