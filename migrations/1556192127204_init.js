exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable("urls", {
    id: "id",
    path: { type: "varchar(100)", notNull: false },
    host: { type: "varchar(100)", notNull: false },
    scheme: { type: "varchar(100)", notNull: false },
    queryString: { type: "varchar(100)", notNull: false },
    content: { type: "text", notNull: false },
    dateLastCrawled: { type: "timestamp", notNull: false },
    dateFirstCrawled: {
      type: "timestamp",
      notNull: false,
      default: pgm.func("current_timestamp")
    }
  });
};

exports.down = pgm => {};
