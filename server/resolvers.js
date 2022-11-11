const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const Book = require("./models/Book");
const Author = require("./models/Author");
const User = require("./models/User");
const { SECRET } = require("./utils/config");
const bcrypt = require("bcrypt");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const author = await Author.findOne({ name: args.author });
      if (!args.author && !args.genre) {
        return Book.find({}).populate("author");
      }
      if (args.author && !args.genre) {
        return Book.find({ author: author }).populate("author");
      }
      if (!args.author && args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate("author");
      }
      return Book.find({
        $and: [{ author: author }, { genres: { $in: [args.genre] } }],
      }).populate("author");
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError("Not authenticated");
      }

      const author = await Author.findOne({ name: args.author });
      let newAuthor = author;
      if (!author) {
        newAuthor = new Author({ name: args.author, bookCount: 1 });
      } else {
        newAuthor.bookCount = newAuthor.bookCount + 1;
      }
      const book = new Book({ ...args, author: newAuthor });
      try {
        book.save();
        newAuthor.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError("Not authenticated");
      }

      const author = await Author.findOne({ name: args.name });
      author.born = args.setBornTo;

      try {
        author.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      return author;
    },
    createUser: async (root, args) => {
      if (!args.password) {
        throw new UserInputError("Password missing");
      }
      if (args.password.length < 5) {
        throw new UserInputError("Password must be at least 5 characters long");
      }
      const passwordHash = await bcrypt.hash(args.password, 10);
      const user = new User({
        username: args.username,
        passwordHash,
        favouriteGenre: args.favouriteGenre,
      });
      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      const passwordCorrect =
        user === null
          ? false
          : await bcrypt.compare(args.password, user.passwordHash);
      if (!(user && passwordCorrect)) {
        throw new UserInputError("Invalid username or password");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };
      return { value: jwt.sign(userForToken, SECRET) };
    },
  },
  // Author: {
  //   bookCount: async (root) => {
  //     return Book.find({ author: root.id }).countDocuments();
  //   },
  // },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
