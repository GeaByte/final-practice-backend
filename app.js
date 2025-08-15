require('dotenv').config();
// ############################################# //
// ##### Server Setup for BookStore Management API #####
// ############################################# //

// Importing packages
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Initialize Express app
const app = express();
// Define the port for the server to listen on
const port = process.env.PORT;

// Middleware setup
// Enable CORS (Cross-Origin Resource Sharing) for all routes
app.use(cors());
// Enable Express to parse JSON formatted request bodies
app.use(express.json());

// MongoDB connection string.
// This string is generated from the inputs provided in the UI.
mongoose
  .connect(
    process.env.DATABASE_URL, // Use the DATABASE_URL from the environment variables
    {
      useNewUrlParser: true, // Use the new URL parser instead of the deprecated one
      useUnifiedTopology: true, // Use the new server discovery and monitoring engine
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the Express server only after successfully connecting to MongoDB
    app.listen(port, () => {
      console.log("BookStore API Server is running on port " + port);
    });
  })
  .catch((error) => {
    // Log any errors that occur during the MongoDB connection
    console.error("Error connecting to MongoDB:", error);
  });

// ############################################# //
// ##### BookStore Model Setup #####
// ############################################# //

// Define Mongoose Schema Class
const Schema = mongoose.Schema;

// Create a Schema object for the BookStore model
// This schema defines the structure of bookstore documents in the MongoDB collection.
const bookstoreSchema = new Schema({
  Title: { type: String, required: true },
  Author: { type: String, required: true },
  Pages: { type: Number, required: true },
});

// Create a Mongoose model from the bookstoreSchema.
// This model provides an interface to interact with the 'bookstores' collection in MongoDB.
// Mongoose automatically pluralizes "BookStore" to "bookstores" for the collection name.
const BookStore = mongoose.model("BookStore", bookstoreSchema);

// ############################################# //
// ##### BookStore API Routes Setup #####
// ############################################# //

// Create an Express Router instance to handle bookstore-related routes.
const router = express.Router();

// Mount the router middleware at the '/api/bookstores' path.
// All routes defined on this router will be prefixed with '/api/bookstores'.
app.use("/api/bookstores", router);

// Route to get all bookstores from the database.
// Handles GET requests to '/api/bookstores/'.
router.route("/").get(async (req, res) => {
  // Added async
  try {
    const bookstores = await BookStore.find(); // Added await
    res.json(bookstores);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// Route to get a specific bookstore by its ID.
// Handles GET requests to '/api/bookstores/:id'.
router.route("/:id").get(async (req, res) => {
  // Added async
  try {
    const bookstore = await BookStore.findById(req.params.id); // Added await
    res.json(bookstore);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// Route to add a new bookstore to the database.
// Handles POST requests to '/api/bookstores/add'.
router.route("/add").post(async (req, res) => {
  // Added async
  // Extract attributes from the request body.
  const Title = req.body.Title;
  const Author = req.body.Author;
  const Pages = req.body.Pages;

  // Create a new BookStore object using the extracted data.
  const newBookStore = new BookStore({
    Title,
    Author,
    Pages,
  });

  try {
    await newBookStore.save(); // Added await
    res.json("BookStore added!");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// Route to update an existing bookstore by its ID.
// Handles PUT requests to '/api/bookstores/update/:id'.
router.route("/update/:id").put(async (req, res) => {
  // Added async
  try {
    const bookstore = await BookStore.findById(req.params.id); // Added await
    if (!bookstore) {
      return res.status(404).json("Error: BookStore not found");
    }

    // Update the bookstore's attributes with data from the request body.
    bookstore.Title = req.body.Title;
    bookstore.Author = req.body.Author;
    bookstore.Pages = req.body.Pages;

    await bookstore.save(); // Added await
    res.json("BookStore updated!");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// Route to delete a bookstore by its ID.
// Handles DELETE requests to '/api/bookstores/delete/:id'.
router.route("/delete/:id").delete(async (req, res) => {
  // Added async
  try {
    const deletedBookStore = await BookStore.findByIdAndDelete(req.params.id); // Added await
    if (!deletedBookStore) {
      return res.status(404).json("Error: BookStore not found");
    }
    res.json("BookStore deleted.");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// ############################################# //
// ##### Document Model Setup #####
// ############################################# //

// Create a Schema object for the Document model
// This schema defines the structure of document documents in the MongoDB collection.
const documentSchema = new Schema(
  {
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Create a Mongoose model from the documentSchema.
// This model provides an interface to interact with the 'documents' collection in MongoDB.
// Mongoose automatically pluralizes "Document" to "documents" for the collection name.
const Document = mongoose.model("Document", documentSchema);

// ############################################# //
// ##### Document API Routes Setup #####
// ############################################# //

// Mount the router middleware at the '/api/documents' path.
// All routes defined on this router will be prefixed with '/api/documents'.
app.use("/api/documents", router);

// Route to get all documents from the database.
// Handles GET requests to '/api/documents/'.
router.route("/").get(async (req, res) => {
  // Added async
  try {
    const documents = await Document.find(); // Added await
    res.json(documents);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// Route to get a specific document by its ID.
// Handles GET requests to '/api/documents/:id'.
router.route("/:id").get(async (req, res) => {
  // Added async
  try {
    const document = await Document.findById(req.params.id); // Added await
    res.json(document);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// Route to add a new document to the database.
// Handles POST requests to '/api/documents/add'.
router.route("/add").post(async (req, res) => {
  // Added async
  // Extract attributes from the request body.
  const text = req.body.text;

  // Create a new Document object using the extracted data.
  const newDocument = new Document({
    text,
  });

  try {
    await newDocument.save(); // Added await
    res.json("Document added!");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// Route to update an existing document by its ID.
// Handles PUT requests to '/api/documents/update/:id'.
router.route("/update/:id").put(async (req, res) => {
  // Added async
  try {
    const document = await Document.findById(req.params.id); // Added await
    if (!document) {
      return res.status(404).json("Error: Document not found");
    }

    // Update the document's attributes with data from the request body.
    document.text = req.body.text;

    await document.save(); // Added await
    res.json("Document updated!");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// Route to delete a document by its ID.
// Handles DELETE requests to '/api/documents/delete/:id'.
router.route("/delete/:id").delete(async (req, res) => {
  // Added async
  try {
    const deletedDocument = await Document.findByIdAndDelete(req.params.id); // Added await
    if (!deletedDocument) {
      return res.status(404).json("Error: Document not found");
    }
    res.json("Document deleted.");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});
