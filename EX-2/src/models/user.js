import { DataTypes } from "sequelize";
import sequelize from "../db/database.js";

// Q1 - Define the modles and their relationships
const Author = sequelize.define("Author", {
    name: DataTypes.STRING,
    birthYear: DataTypes.INTEGER
});

const Book = sequelize.define("Book", {
    title: DataTypes.STRING,
    publicationYear: DataTypes.INTEGER,
    pages: DataTypes.INTEGER
});

Author.hasMany(Book);
Book.belongsTo(Author);
await sequelize.sync();

async function createSampleData() {
    // Q2 - Create sample data
    const ronan = await Author.create({ name: "Ronan The Best", birthYear: 1990 });
    await ronan.createBook({ title: "Ronans book 1", publicationYear: 2010, pages: 150 });
    await ronan.createBook({ title: "Ronans book 2", publicationYear: 2015, pages: 200 });

    const kimAng = await Author.create({ name: "Kim Ang", birthYear: 1995 });
    await kimAng.createBook({ title: "Kim's Journey", publicationYear: 2018, pages: 180 });
    await kimAng.createBook({ title: "Deep Thoughts", publicationYear: 2020, pages: 220 });

    const hokTim = await Author.create({ name: "Hok Tim", birthYear: 2015 });
    await hokTim.createBook({ title: "Young Genuis", publicationYear: 2023, pages: 90 });
    await hokTim.createBook({ title: "Hok's Ideas", publicationYear: 2024, pages: 110 });

    // Q3 - Queries
    // Fetch all books by a given author.
    const kimAngWithBooks = await Author.findOne({
        where: { name: "Kim Ang"},
        include: Book,
    })
    console.log("Kim's Books:", kimAngWithBooks)

    // Create a new book for an existing author using .createBook().
    await hokTim.createBook({ title: "New Adventure", publicationYear: 2025, pages: 130 });

    // List all authors along with their books (include) 
    const authorWithBooks = await Author.findAll({ include: Book });
    console.log(JSON.stringify(authorWithBooks, null, 2));
}

async function initData() {
    await sequelize.sync();
    await createSampleData();
}
initData();

// TODO - Export the model User
export {Author, Book};