import ShareDB from "sharedb";
import { MongoClient, ServerApiVersion } from "mongodb";

//Maybe hide this but eh.
const uri =
  "mongodb+srv://username:chosdisiples@cluster-project.znjjqvk.mongodb.net/?retryWrites=true&w=majority";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
};
const client = new MongoClient(uri, options);
let backend: ShareDB;

connectDatabase();

function connectDatabase() {
  try {
    const db = client.connect();
    backend = new ShareDB({ db });
    console.log("Successful database connection.");
  } catch {
    console.error("Failed to connect to database");
  }
}

export default backend;
